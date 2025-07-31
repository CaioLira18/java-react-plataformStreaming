import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import Series from './pages/Series'
import Login from './pages/Login'
import SeriesPage from './pages/SeriesPage'
import Movie from './pages/Movies'
import Footer from './components/Footer'
import Movies from './pages/MoviesPage'
import MoviesPage from './pages/MoviesPage'
import AdicionarTemporada from './pages/AdicionarTemporada'
import AdicionarSerie from './pages/AdicionarSerie'


function App() {
  
  return (
   <div>
    <Header />
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/series/:id" element={<Series />} />
        <Route path="/movies/:id" element={<Movie />} />
        <Route path="/login" element={<Login />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/AdicionarTemporadas" element={<AdicionarTemporada />} />
        <Route path="/AdicionarSerie" element={<AdicionarSerie />} />
      </Routes>
    <Footer />
   </div>
  )
}

export default App
