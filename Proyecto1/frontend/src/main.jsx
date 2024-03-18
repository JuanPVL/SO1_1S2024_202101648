import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route} from "react-router-dom"
import App from './App.jsx'
import './index.css'


function Home() {
  return (
    <div>
      <Navbar />
      <App />
    </div>
  );
}

function LiveCharts() {
  return (
    <div>
      <Navbar />
      <Graficas />
    </div>
  );
}

function Hystoric() {
  return (
    <div>
      <Navbar />
      <Historico />
    </div>
  );
}

function ProcessTree() {
  return (
    <div>
      <Navbar />
      <ArbolProcesos />
    </div>
  );
}

function Simulation() {
  return (
    <div>
      <Navbar />
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


