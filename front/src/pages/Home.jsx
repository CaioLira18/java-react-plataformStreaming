import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const API_URL = "http://localhost:8080/api";
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setName(parsedUser.name);
        console.log("Dados do usuário carregados:", parsedUser);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        navigate('/login');
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch(`${API_URL}/series`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSeries(data);
        } else {
          console.error('Formato inesperado para Series:', data);
        }
      })
      .catch(error => console.error('Erro ao buscar Series:', error));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch(`${API_URL}/movie`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          console.error('Formato inesperado para Movies:', data);
        }
      })
      .catch(error => console.error('Erro ao buscar Movies:', error));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // ou um loading spinner
  }

  return (
    <div>
      <div className="welcome">
        <h1>Bem Vindo, <strong>{name}</strong></h1>
        {isAdmin && (
          <div className="buttonsAdd">
            <a href="/AdicionarTemporadas"><button>Adicionar Temporadas</button></a>
            <a href="/AdicionarSerie"><button>Adicionar Serie</button></a>
          </div>
        )}
      </div>

      <div className="genericContentBox">
        <h1>Series</h1>
        <a href="/series">Mostrar Tudo</a>
        <div className="containerContent">
          {series
            .filter(item => item.type === "SERIES")
            .map((serieItem, i) => (
              <div className="boxContent" key={serieItem.id || i}>
                <div className="boxInformation">
                  <img src={serieItem.image} alt={serieItem.name} />
                  <a href={"/series/" + serieItem.id}>{serieItem.name}</a>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="genericContentBox">
        <h1>Filmes</h1>
        <a href="/movies">Mostrar tudo</a>
        <div className="containerContent">
          {movies.map((movieItem, i) => (
              <div className="boxContent" key={movieItem.id || i}>
                <div className="boxInformation">
                  <img src={movieItem.image} alt={movieItem.name} />
                  <a href={"/movies/" + movieItem.id}>{movieItem.name}</a>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="genericContentBox">
        <h1>Disney</h1>
        <div className="containerContent">
          {movies.filter(item => item.marca === "DISNEY")
            .map((movieItem, i) => (
              <div className="boxContent" key={movieItem.id || i}>
                <div className="boxInformation">
                  <img src={movieItem.image} alt={movieItem.name} />
                  <a href={"/movies/" + movieItem.id}>{movieItem.name}</a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;