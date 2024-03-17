package main

import (
	"encoding/json"
	"fmt"
	"os/exec"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

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
	PorcUsed    int `json:"PorcUsed"`
	PorcNotUsed int `json:"PorcNotUsed"`
}

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Get("/ram", handleLiveRam)
	app.Get("/cpu", handleLiveCpu)
	app.Listen(":3002")
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
	fmt.Println("Porcentaje Usado:", info.PorcUsed)
	fmt.Println("Porcentaje No usado:", info.PorcNotUsed)
	//subir info a la base de datos
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
	fmt.Println("Porcentaje Usado:", info.PorcUsed)
	fmt.Println("Porcentaje No usado:", info.PorcNotUsed)
	return c.Status(fiber.StatusOK).JSON(info)
}
