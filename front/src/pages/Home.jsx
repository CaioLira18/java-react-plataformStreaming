import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slide from '../components/Slide';

const Home = () => {
  const API_URL = "http://localhost:8080/api";
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');

  const seriesRef = useRef(null);
  const moviesRef = useRef(null);
  const disneyRef = useRef(null);
  const dcRef = useRef(null);

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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setName(parsedUser.name);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

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

  const renderCarousel = (title, href, ref, items) => (
    <div className="genericContentBox">
      {title && <h1>{title}</h1>}
      {href && <a href={href}>Mostrar Tudo</a>}

      <div className="slideWrapper">
        <div className="sliderControls left">
          <div className="rowAngle" onClick={() => scroll(ref, 'left')}>
            <i className="fa-solid fa-angle-left"></i>
          </div>
        </div>

        <div className="containerContent" ref={ref}>
          {items.map((item, i) => (
            <div className="boxContent" key={item.id || i}>
              <div className="boxInformation">
                <a href={`/${item.type === 'SERIES' ? 'series' : 'movies'}/${item.id}`}>
                  <img src={item.imageVertical} alt={item.name} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="sliderControls right">
          <div className="rowAngle" onClick={() => scroll(ref, 'right')}>
            <i className="fa-solid fa-angle-right"></i>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Slide />

      <div className="welcome">
        {isAdmin && (
          <div className="buttonsAdd">
            <a href="/AdicionarTemporadas"><button>Adicionar Temporadas</button></a>
            <a href="/AdicionarConteudo"><button>Adicionar Conteudo</button></a>
          </div>
        )}
      </div>

      {/* Carrossel Series */}
      {renderCarousel(
        'Séries',
        '/series',
        seriesRef,
        series.filter(item => item.type === "SERIES")
      )}

      {/* Carrossel Filmes */}
      {renderCarousel(
        'Filmes',
        '/movies',
        moviesRef,
        movies
      )}

      {/* Carrossel Disney */}
      <div className="genericContentBox">
        <div className="specialSecction">
          <img
            src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070612/logoDisney_twejpl.png"
            alt="logo disney"
          />
        </div>
        {renderCarousel(null, null, disneyRef, movies.filter(item => item.marca === "DISNEY"))}
      </div>

      {/* Carrossel DC */}
      <div className="genericContentBox">
        <div className="specialSecction">
          <img
            src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png"
            alt="logo dc"
          />
        </div>
        {renderCarousel(null, null, dcRef, movies.filter(item => item.marca === "DC"))}
      </div>
    </div>
  );
};

export default Home;
