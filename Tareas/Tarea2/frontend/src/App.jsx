import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Webcam from 'react-webcam'
import './App.css'

var base64info = ""
function App() {
  const [img, setImg] = useState(""); 
  const webCamRef = useRef(null)
  const showImage = () => {
    base64info = webCamRef.current.getScreenshot()
    setImg(webCamRef.current.getScreenshot());
}

function formato_hora() {
  let fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let year = fecha.getFullYear();
  let hora = fecha.getHours();
  let minutos = fecha.getMinutes();
  let segundos = fecha.getSeconds();
  let fechaAccion = dia + "/" + mes + "/" + year;
  let horaAccion = hora + ":" + minutos + ":" + segundos;
  let textoFinal = fechaAccion + " " + horaAccion;
  return textoFinal;
}

const sendData = async () => {
  console.log(base64info)
  let fechaActual = formato_hora()
  let nuevaFoto = {
    imgbase64: base64info,
    fecha: fechaActual
  }
  fetch('http://localhost:3002/insertarfoto', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevaFoto)
  })
    .then(response => response.json())

}

  return (
    <>
      <div>
        <Webcam ref={webCamRef}/>
      </div>
      <h1>FOTO ALBUM</h1>
      <div className="card">
        <button onClick={() => {showImage()}}>
          Take photo
        </button>
      </div>
      <div>
        <img src={img}></img>
      </div>
      <div>
        <button onClick={() => sendData()}>Subir Imagen</button>
      </div>
    </>
  )
}

export default App
