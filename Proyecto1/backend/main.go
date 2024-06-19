package main

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Db Connection

var connection = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
	"root",
	"secret",
	"so1_db",
	"3306",
	"historico",
)

// var dsn = "root:secret@tcp(so1_db:3306)/historico?parseTime=true"
// var db, _ = gorm.Open(mysql.Open(connection), &gorm.Config{})

func DbConect() *gorm.DB {
	for {
		db, err := gorm.Open(mysql.Open(connection), &gorm.Config{})
		if err != nil {
			fmt.Println("No se pudo conectar a la base de datos")
			time.Sleep(5 * time.Second)
			continue
		} else {
			fmt.Println("Conectado a la base de datos")
			return db
		}
	}
}

var db = DbConect()

func RegisterRamInfo(info RamInfo) {
	db.Create(&DbInfoRam{
		PorcUsed: info.PorcUsed,
		Tiempo:   GetHour(),
	})
	if err := db.Error; err != nil {
		fmt.Println(err)
	}

}

func RegisterCpuInfo(info CpuInfo) {
	db.Create(&DbInfoCpu{
		PorcUsed: info.PorcUsed,
		Tiempo:   GetHour(),
	})
	if err := db.Error; err != nil {
		fmt.Println(err)
	}

}

type RamInfo struct {
	TotalRam    int `json:"totalRam"`
	Used        int `json:"used"`
	Free        int `json:"free"`
	PorcUsed    int `json:"porcUsed"`
	PorcNotUsed int `json:"porcNotUsed"`
}

// {
// 	"cpu_total":5020857666028,

// 	"cpu_en_uso":1304200000000,
// 	"PorcUsed":25,

// }

type CpuInfo struct {
	TotalCpu    int `json:"cpu_total"`
	Used        int `json:"cpu_en_uso"`
	Free        int `json:"cpu_libre"`
	PorcUsed    int `json:"PorcUsed"`
	PorcNotUsed int `json:"PorcNotUsed"`
}

type DbInfoRam struct {
	PorcUsed int
	Tiempo   string
}

type ProcessInfo struct {
	Procesos  []ProcesoJ `json:"processes"`
	Corriendo int        `json:"running"`
	Dormidos  int        `json:"sleeping"`
	Zombies   int        `json:"zombie"`
	Detenido  int        `json:"stopped"`
	Total     int        `json:"total"`
}

type ProcesoJ struct {
	Pid   int      `json:"pid"`
	Name  string   `json:"name"`
	User  int      `json:"user"`
	State int      `json:"state"`
	Ram   int      `json:"ram"`
	Hijos []HijosJ `json:"child"`
}

type HijosJ struct {
	Pid      int    `json:"pid"`
	Name     string `json:"name"`
	State    int    `json:"state"`
	PidPadre int    `json:"pidPadre"`
}

type DbInfoCpu struct {
	PorcUsed int
	Tiempo   string
}

type PidInfo struct {
	Pid int
}

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Get("/api/ram", handleLiveRam)
	app.Get("/api/cpu", handleLiveCpu)
	app.Get("/api/historicoram", handleHistoricoRam)
	app.Get("/api/historicocpu", handleHistoricoCpu)
	app.Get("/api/start", handleStartProcess)
	app.Get("/api/stop", handleStopProcess)
	app.Get("/api/resume", handleResumeProcess)
	app.Get("/api/kill", handleKillProcess)
	app.Get("/api/process", handleProcessInfo)
	app.Listen(":3008")
}

func handleLiveRam(c *fiber.Ctx) error {
	var info RamInfo
	cmd := exec.Command("cat", "/proc/ram_so1_1s2024")
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println("Error: ", err)
	}
	err1 := json.Unmarshal([]byte(stdout), &info)
	if err1 != nil {
		fmt.Println("error: ", err)
	}
	//fmt.Println("Porcentaje Usado RAM:", info.PorcUsed)
	//fmt.Println("Porcentaje No usado RAM:", info.PorcNotUsed)
	//subir info a la base de datos
	go RegisterRamInfo(info)
	return c.Status(fiber.StatusOK).JSON(info)
}

func handleLiveCpu(c *fiber.Ctx) error {
	var info CpuInfo
	cmd := exec.Command("cat", "/proc/cpu_so1_1s2024")
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println("Error: ", err)
	}
	err1 := json.Unmarshal([]byte(stdout), &info)
	if err1 != nil {
		fmt.Println("error:", err)
	}
	//fmt.Println("Porcentaje Usado CPU:", info.PorcUsed)
	//fmt.Println("Porcentaje No usado CPU:", info.PorcNotUsed)
	//subir info a la base de datos
	go RegisterCpuInfo(info)
	return c.Status(fiber.StatusOK).JSON(info)
}

func handleHistoricoRam(c *fiber.Ctx) error {
	var resultado []DbInfoRam
	db.Find(&resultado)
	return c.Status(fiber.StatusOK).JSON(resultado)
}

func handleHistoricoCpu(c *fiber.Ctx) error {
	var resultado []DbInfoCpu
	db.Find(&resultado)
	return c.Status(fiber.StatusOK).JSON(resultado)
}

func handleStartProcess(c *fiber.Ctx) error {
	cmd := exec.Command("sleep", "infinity")
	err := cmd.Start()
	if err != nil {
		fmt.Print(err)
	}

	// Obtener el comando con PID
	pid := cmd.Process.Pid
	return c.Status(fiber.StatusOK).JSON(PidInfo{Pid: pid})
}

func handleStopProcess(c *fiber.Ctx) error {
	//get pid from query in URL
	pidStr := c.Query("pid")
	if pidStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "pid is required"})
	}
	pid, err := strconv.Atoi(pidStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "pid must be a number"})
	}

	cmd := exec.Command("kill", "-SIGSTOP", strconv.Itoa(pid))
	err = cmd.Run()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	fmt.Println("Process stopped")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Process stopped"})
}

func handleResumeProcess(c *fiber.Ctx) error {
	pidStr := c.Query("pid")
	if pidStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "pid is required"})
	}
	pid, err := strconv.Atoi(pidStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "pid must be a number"})
	}
	cmd := exec.Command("kill", "-SIGCONT", strconv.Itoa(pid))
	err = cmd.Run()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	fmt.Println("Process resumed")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Process resumed"})
}

func handleKillProcess(c *fiber.Ctx) error {
	pidStr := c.Query("pid")
	if pidStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "pid is required"})
	}
	pid, err := strconv.Atoi(pidStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "pid must be a number"})
	}
	cmd := exec.Command("kill", "-9", strconv.Itoa(pid))
	err = cmd.Run()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	fmt.Println("Process killed")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Process killed"})
}

func handleProcessInfo(c *fiber.Ctx) error {
	var info ProcessInfo
	cmd := exec.Command("cat", "/proc/procesos_so1")
	stdout, err := cmd.Output()
	//fmt.Println("SALIDA:", stdout)
	if err != nil {
		fmt.Println("Error: ", err)
	}
	err1 := json.Unmarshal([]byte(stdout), &info)
	//fmt.Println("JSON SALIDA:", info)
	if err1 != nil {
		fmt.Println("error:", err)
	}
	return c.Status(fiber.StatusOK).JSON(info)
}

func GetHour() string {
	cmd := exec.Command("date", "+%H:%M:%S")
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println("Error: ", err)
	}
	return string(stdout)
}
