import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route} from "react-router-dom"
import App from './App.jsx'
import BarraSup from './navbar.jsx'
import Graficas from './GraficoTReal.jsx'
import Historico from './HistoricoG.jsx'
import ArbolProcesos from './ArbolProcess.jsx'
import SimulacionP from './SimulacionProcess.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
//import './index.css'


function Home() {
  return (
    <div>
      <BarraSup />
      <App />
    </div>
  );
}

function LiveCharts() {
  return (
    <div>
      <BarraSup />
      <Graficas />
    </div>
  );
}

function Hystoric() {
  return (
    <div>
      <BarraSup />
      <Historico />
    </div>
  );
}

function ProcessTree() {
  return (
    <div>
      <BarraSup />
      <ArbolProcesos />
    </div>
  );
}

function Simulation() {
  return (
    <div>
      <BarraSup />
      <SimulacionP />
    </div>
  );
}


const router = createBrowserRouter([
  {
    path: "/",
    element:<Home/>,
  },
  {
    path: "/livecharts",
    element:<LiveCharts/>,
  },
  {
    path: "/historico",
    element:<Hystoric/>,
  },
  {
    path: "/arbolprocesos",
    element:<ProcessTree/>,
  },
  {
    path: "/simulacionp",
    element:<Simulation/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)


