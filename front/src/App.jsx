import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import Series from './pages/Series'


function App() {
  
  return (
   <div>
    <Header />
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/series/:id" element={<Series />} />
      </Routes>
   </div>
  )
}

export default App
