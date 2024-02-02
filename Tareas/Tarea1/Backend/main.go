package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Respuesta struct {
	Carnet string
	Nombre string
}


func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	
	app.Get("/data", func(c *fiber.Ctx) error {
		respuesta := Respuesta{
			Carnet: "202101648",
			Nombre: "Juan Pedro Valle Lema",
		}
		return c.JSON(respuesta)
	})

	app.Listen(":3002")
}
