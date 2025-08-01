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
import AdicionarEpisodio from './pages/AdicionarEpisodio'
import Edit from './pages/Edit'
import Register from './pages/Register'


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
        <Route path="/Edit" element={<Edit />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/AdicionarTemporadas" element={<AdicionarTemporada />} />
        <Route path="/AdicionarSerie" element={<AdicionarSerie />} />
        <Route path="/AdicionarEpisodio/:id" element={<AdicionarEpisodio />} />
      </Routes>
    <Footer />
   </div>
  )
}

export default App
