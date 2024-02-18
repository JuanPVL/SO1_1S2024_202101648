import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [datos, setDatos] = useState("Datos no disponibles")

  const getData = async () => {
    console.log("Obteniendo datos")
    try {
      const datasos = JSON.parse('{"totalRam": 15664, "used": 6897, "free": 8767, "porcUsed": 44, "porcNotUsed": 55}')
      console.log("Esto es datasos:",datasos)
      console.log("Esto es datasos.totalRam:",datasos.totalRam)
      console.log("Esto es datasos.used:",datasos.used)
      console.log("Esto es datasos.free:",datasos.free)
      console.log("Esto es datasos.porcUsed:",datasos.porcUsed)
      console.log("Esto es datasos.porcNotUsed:",datasos.porcNotUsed)
      
      // console.log("Obteniendo datos desde try")
      // const response = await fetch("http://127.0.0.1:3002/data")
      // console.log("Esto es response:",response)
      // const data = await response.json()
      // console.log("Esto es data:",data)
      // setDatos(`${data.Nombre} - ${data.Carnet}`)
    } catch (error) { 
      console.error("Error al obtener datos", error)
    }
  }

  return (
    <>
      <h1>Tarea 1 - SO1 - 1s2024</h1>
      <div className="card">
        <button onClick={() => getData()}>
          Mostrar Datos
        </button>
      </div>
      <div className="card">
        <h2>{datos}</h2>
      </div>  
    </>
  )
}

export default App
