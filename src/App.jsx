import { useState } from 'react'
import Login from './pages/authentication/Login/Login'
import Registration from './pages/authentication/Registration/Registration'
import Dashboard from './pages/Dashboard/Dashboard'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import './App.css'
import ConfirmationCode from './pages/authentication/ConfirmationCode/ConfirmationCode'

function App() {
  const [count, setCount] = useState(0)

  
    const router = createBrowserRouter([
      {
          // path: "/",
          // element: <Layout />,
          // errorElement: <NotFound />,
          children: [
              {
                  path: "/",
                  element: <Login />
              },
              {
                path: "registration",
                element: <Registration />
            },
            {
              path: "otp",
              element: <ConfirmationCode />
          },
           
            {
              path: "dashboard",
              element: <Dashboard />
          },
           
              
          ]
      },
  ]);

  return (
      <RouterProvider router={router} />
  )
    
}

export default App
