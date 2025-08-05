import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const API_URL = "http://localhost:8080/api";
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  // Refs para slides
  const seriesRef = useRef(null);
  const moviesRef = useRef(null);
  const disneyRef = useRef(null);
  const dcRef = useRef(null);

  const scroll = (ref, direction) => {
    if (!ref.current) return;
    const scrollAmount = 300; // distância que vai deslizar
    ref.current.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
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
      .then(response => response.json())
      .then(data => Array.isArray(data) && setSeries(data))
      .catch(error => console.error('Erro ao buscar Series:', error));

    fetch(`${API_URL}/movie`)
      .then(response => response.json())
      .then(data => Array.isArray(data) && setMovies(data))
      .catch(error => console.error('Erro ao buscar Movies:', error));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div>
      <div className="welcome">
        <h1>Bem Vindo, <strong>{name}</strong></h1>
        {isAdmin && (
          <div className="buttonsAdd">
            <a href="/AdicionarTemporadas"><button>Adicionar Temporadas</button></a>
            <a href="/AdicionarConteudo"><button>Adicionar Conteudo</button></a>
          </div>
        )}
      </div>

      {/* SERIES */}
      <div className="genericContentBox">
        <h1>Series</h1>
        <a href="/series">Mostrar Tudo</a>
        <div className="slideWrapper">
          <div className="rowAngle left" onClick={() => scroll(seriesRef, 'left')}>◀</div>
          <div className="rowAngle right" onClick={() => scroll(seriesRef, 'right')}>▶</div>
          <div className="containerContent" ref={seriesRef}>
            {series
              .filter(item => item.type === "SERIES")
              .map((serieItem, i) => (
                <div className="boxContent" key={serieItem.id || i}>
                  <div className="boxInformation">
                    <a href={"/series/" + serieItem.id}>
                      <img src={serieItem.imageVertical} alt={serieItem.name} />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* FILMES */}
      <div className="genericContentBox">
        <h1>Filmes</h1>
        <a href="/movies">Mostrar tudo</a>
        <div className="slideWrapper">
          <div className="rowAngle left" onClick={() => scroll(moviesRef, 'left')}>◀</div>
          <div className="rowAngle right" onClick={() => scroll(moviesRef, 'right')}>▶</div>
          <div className="containerContent" ref={moviesRef}>
            {movies.map((movieItem, i) => (
              <div className="boxContent" key={movieItem.id || i}>
                <div className="boxInformation">
                  <a href={"/movies/" + movieItem.id}>
                    <img src={movieItem.imageVertical} alt={movieItem.name} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DISNEY */}
      <div className="genericContentBox">
        <div className="specialSecction">
          <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070612/logoDisney_twejpl.png" alt="" />
        </div>
        <div className="slideWrapper">
          <div className="rowAngle left" onClick={() => scroll(disneyRef, 'left')}>◀</div>
          <div className="rowAngle right" onClick={() => scroll(disneyRef, 'right')}>▶</div>
          <div className="containerContent" ref={disneyRef}>
            {movies.filter(item => item.marca === "DISNEY")
              .map((movieItem, i) => (
                <div className="boxContent" key={movieItem.id || i}>
                  <div className="boxInformation">
                    <a href={"/movies/" + movieItem.id}>
                      <img src={movieItem.imageVertical} alt={movieItem.name} />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* DC */}
      <div className="genericContentBox">
        <div className="specialSecction">
          <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png" alt="" />
        </div>
        <div className="slideWrapper">
          <div className="rowAngle left" onClick={() => scroll(dcRef, 'left')}>◀</div>
          <div className="rowAngle right" onClick={() => scroll(dcRef, 'right')}>▶</div>
          <div className="containerContent" ref={dcRef}>
            {movies.filter(item => item.marca === "DC")
              .map((movieItem, i) => (
                <div className="boxContent" key={movieItem.id || i}>
                  <div className="boxInformation">
                    <a href={"/movies/" + movieItem.id}>
                      <img src={movieItem.imageVertical} alt={movieItem.name} />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
