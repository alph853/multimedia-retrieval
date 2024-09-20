import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import GlobalState from './context/index.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import History from './components/history_page/index.jsx'


const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/history",
    element:<History/>
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalState>
      <RouterProvider router={router}/>
    </GlobalState>
  </React.StrictMode>
)
