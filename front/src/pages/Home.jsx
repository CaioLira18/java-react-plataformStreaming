import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slide from '../components/Slide';

const Home = () => {
  const API_URL = "http://localhost:8080/api";
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [favoriteMovieList, setFavoriteMovieList] = useState([]);
  const [favoriteSerieList, setFavoriteSerieList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');

  // Refs individuais para cada sessão
  const seriesRef = useRef(null);
  const favRef = useRef(null);
  const moviesRef = useRef(null);
  const disneyRef = useRef(null);
  const dcRef = useRef(null);
  const cartoonRef = useRef(null);

  const navigate = useNavigate();

  const scroll = (ref, direction) => {
    if (!ref.current) return;
    const scrollAmount = 300;
    ref.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);

      fetch(`http://localhost:8080/api/users/${parsedUser.id}`)
        .then((res) => res.json())
        .then((fullUser) => {
          setIsAuthenticated(true);
          setIsAdmin(fullUser.role === 'ADMIN');
          setName(fullUser.name || '');
          setFavoriteMovieList(fullUser.favoriteMovieList || []);
          setFavoriteSerieList(fullUser.favoriteSeassonList || []);
        })
        .catch((error) => {
          console.error('Erro ao carregar dados:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch(`${API_URL}/series`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setSeries(data))
      .catch((err) => console.error("Erro ao buscar séries", err));

    fetch(`${API_URL}/movie`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setMovies(data))
      .catch((err) => console.error("Erro ao buscar filmes", err));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const allFavorites = [
    ...favoriteMovieList.map((item) => ({
      ...item,
      id: item.id || item.movieId,
      type: 'MOVIE',
      uniqueKey: `movie-${item.id || item.movieId}`
    })),
    ...favoriteSerieList.map((item) => ({
      ...item,
      id: item.id,
      type: 'SERIE',
      uniqueKey: `seasson-${item.id}`,
      name: item.name || 'Temporada sem nome'
    })),
  ];

  return (
    <div className='home'>
      <Slide />

      <div className="welcome">
        {isAdmin && (
          <div className="buttonsAdd">
            <a href="/AdicionarTemporadas"><button>Adicionar Temporadas</button></a>
            <a href="/AdicionarConteudo"><button>Adicionar Conteudo</button></a>
          </div>
        )}
      </div>

      {/* Minha Lista */}
      {allFavorites.length > 0 && (
        <div className="genericContentBox">
          <h1>Minha Lista</h1>
          <div className="slideWrapper">
            <div className="sliderControls left">
              <div className="rowAngle" onClick={() => scroll(favRef, 'left')}>
                <i className="fa-solid fa-angle-left"></i>
              </div>
            </div>

            <div className="containerContent" ref={favRef}>
              {allFavorites.map((item) => (
                <div className="boxContent" key={item.uniqueKey}>
                  <div className="boxInformation">
                    <a href={`/${item.type === 'MOVIE' ? 'movies' : 'series'}/${item.id}`}>
                      <img src={item.imageVertical || '/imagem-padrao.jpg'} alt={item.name} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="sliderControls right">
              <div className="rowAngle" onClick={() => scroll(favRef, 'right')}>
                <i className="fa-solid fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERIES */}
      <div className="genericContentBox">
        <h1>Series</h1>
        <a href="/series">Mostrar Tudo</a>
        <div className="slideWrapper">
          <div className="sliderControls left">
            <div className="rowAngle" onClick={() => scroll(seriesRef, 'left')}>
              <i className="fa-solid fa-angle-left"></i>
            </div>
          </div>
          <div className="containerContent" ref={seriesRef}>
            {series.filter(item => item.type === "SERIES").map((serieItem) => (
              <div className="boxContent" key={serieItem.id}>
                <div className="boxInformation">
                  <a href={`/series/${serieItem.id}`}>
                    <img src={serieItem.imageVertical} alt={serieItem.name} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right">
            <div className="rowAngle" onClick={() => scroll(seriesRef, 'right')}>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>

      {/* FILMES */}
      <div className="genericContentBox">
        <h1>Filmes</h1>
        <a href="/movies">Mostrar tudo</a>
        <div className="slideWrapper">
          <div className="sliderControls left">
            <div className="rowAngle" onClick={() => scroll(moviesRef, 'left')}>
              <i className="fa-solid fa-angle-left"></i>
            </div>
          </div>
          <div className="containerContent" ref={moviesRef}>
            {movies.map((movieItem) => (
              <div className="boxContent" key={movieItem.id}>
                <div className="boxInformation">
                  <a href={`/movies/${movieItem.id}`}>
                    <img src={movieItem.imageVertical} alt={movieItem.name} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right">
            <div className="rowAngle" onClick={() => scroll(moviesRef, 'right')}>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>

      {/* DISNEY */}
      <div className="genericContentBox">
        <div className="specialSecction">
          <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070612/logoDisney_twejpl.png" alt="logo disney" />
        </div>
        <div className="slideWrapper">
          <div className="sliderControls left">
            <div className="rowAngle" onClick={() => scroll(disneyRef, 'left')}>
              <i className="fa-solid fa-angle-left"></i>
            </div>
          </div>
          <div className="containerContent" ref={disneyRef}>
            {movies.filter(item => item.marca === "DISNEY").map((movieItem) => (
              <div className="boxContent" key={movieItem.id}>
                <div className="boxInformation">
                  <a href={`/movies/${movieItem.id}`}>
                    <img src={movieItem.imageVertical} alt={movieItem.name} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right">
            <div className="rowAngle" onClick={() => scroll(disneyRef, 'right')}>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>

      {/* DC */}
      <div className="genericContentBox">
        <div className="specialSecction">
          <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png" alt="logo dc" />
        </div>
        <div className="slideWrapper">
          <div className="sliderControls left">
            <div className="rowAngle" onClick={() => scroll(dcRef, 'left')}>
              <i className="fa-solid fa-angle-left"></i>
            </div>
          </div>
          <div className="containerContent" ref={dcRef}>
            {movies.filter(item => item.marca === "DC").map((movieItem) => (
              <div className="boxContent" key={movieItem.id}>
                <div className="boxInformation">
                  <a href={`/movies/${movieItem.id}`}>
                    <img src={movieItem.imageVertical} alt={movieItem.name} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right">
            <div className="rowAngle" onClick={() => scroll(dcRef, 'right')}>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>

      {/* CARTOON */}
      <div className="genericContentBox">
        <div className="specialSecction">
          <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754688018/logoMarcaCartoon_of4twi.png" alt="logo cartoon" />
        </div>
        <div className="slideWrapper">
          <div className="sliderControls left">
            <div className="rowAngle" onClick={() => scroll(cartoonRef, 'left')}>
              <i className="fa-solid fa-angle-left"></i>
            </div>
          </div>
          <div className="containerContent" ref={cartoonRef}>
            {series.filter(item => item.marca === "cartoon").map((serieItem) => (
              <div className="boxContent" key={serieItem.id}>
                <div className="boxInformation">
                  <a href={`/series/${serieItem.id}`}>
                    <img src={serieItem.imageVertical} alt={serieItem.name} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="sliderControls right">
            <div className="rowAngle" onClick={() => scroll(cartoonRef, 'right')}>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;