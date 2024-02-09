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
  let fechaAccion = dia + "/" + mes + "/" + year;
  let textoFinal = fechaAccion
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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {showImage()}}>
          Take photo
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
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
