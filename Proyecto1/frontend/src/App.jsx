import { useState } from 'react'
import dockerLogo from './assets/docker.png'
import ubuntuLogo from './assets/ubuntu.png'
import './App.css'
import { Col, Row } from 'react-bootstrap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <h1>Plataforma de Monitoreo y Simulacion de Procesos</h1>
      </div>
      <Row>
        <Col>
        <img style={{ width: 1000, height: 1100 }} src={dockerLogo} className="logo docker" alt="Docker logo"/>
        </Col>
        <Col>
        <img style={{ width: 1000, height: 1100 }} src={ubuntuLogo} className="UBUNTU docker" alt="Ubuntu logo"/>
        </Col>
      </Row>
      
    </>
  )
}

export default App
