import { useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Fotos() {
  const [img, setImg] = useState([])

  useEffect(() => {
    fetch('http://localhost:3002/imagenes')
    .then(response => response.json())
    .then(data => setImg(data))
  }, [])

  return (
    <>
      <h1>FOTOS</h1>
      <div className="card">
        {img.map((image,i) => (
            <center key={i}>
                <img src={image.imgbase64} alt='.....'/>
                <figcaption>{image.fecha}</figcaption>
            </center>
        ))}
      </div>
    </>
  )
}

export default Fotos
