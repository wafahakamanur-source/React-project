import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// TAMBAHKAN BARIS INI DI PALING ATAS:
import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)