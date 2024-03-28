import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QuiscoProvider } from './context/QuioscoProvider'
import router from './router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QuiscoProvider>
      <RouterProvider router={router}/>
    </QuiscoProvider>
  </React.StrictMode>,
)
