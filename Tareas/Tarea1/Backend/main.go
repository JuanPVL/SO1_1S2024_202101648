package main

import (
	"fmt"
	"os/exec"
)

type Respuesta struct {
	Carnet string
	Nombre string
}


func main() {
	cmd := exec.Command("cat", "/proc/module_ram")
	stdout, err := cmd.Output()

	if err != nil {
		fmt.Sprintf("Error: %s", err)
	}
	fmt.Println(string(stdout))
}
