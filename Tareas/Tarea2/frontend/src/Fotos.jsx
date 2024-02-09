import { useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Fotos() {
  const [img, setImg] = useState(""); 


  return (
    <>
      <h1>FOTOS</h1>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div>
        <button>Subir Imagen</button>
      </div>
    </>
  )
}

export default Fotos
