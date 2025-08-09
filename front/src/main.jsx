import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/Franquia.css'
import './css/Responsividade.css'
import './css/Slide.css'
import './css/Register.css'
import './css/Edit.css'
import './css/Footer.css'
import './css/AdicionarTemporadas.css'
import './css/Login.css'
import './css/Movie.css'
import './css/Header.css'
import './css/Serie.css'
import './css/Home.css'
import './css/Search.css'





import App from './App.jsx'

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <App />
  </BrowserRouter>
)
