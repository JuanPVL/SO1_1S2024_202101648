import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route} from "react-router-dom"
import App from './App.jsx'
import Navbar from './navbar.jsx'
import './index.css'
import Fotos from './Fotos.jsx'

function Home() {
  return (
    <div>
      <Navbar />
      <App />
    </div>
  );
}

function Reports() {
  return (
    <div>
      <Navbar />
      <Fotos />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element:<Home/>,
  },
  {
    path: "/fotos",
    element:<Reports/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
