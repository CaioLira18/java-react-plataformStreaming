import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_URL = "http://localhost:8080/api";

  // ✅ Verifica autenticação
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        console.log("Dados do usuário carregados:", parsedUser);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/movie`)
      .then(response => response.json())
      .then(data => {
        console.log("Dados recebidos da API:", data);
        const found = data.find(g => g.id === id);
        console.log("Movie encontrado:", found);
        setMovie(found);
      })
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, [id]);


  if (!movie) {
    return (
      <div className="loading">
        <div className="loadingText">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="moviesIndividualContainer">
        <div className="moviesIndividualBox">
          <div className="moviesImage">
            <img src={movie.image} alt={movie.name} />
          </div>
          <div className="moviesInformations">
            <h1>{movie.name}</h1>
            <div className="movieDetails">
              <p>Duração: {movie.duration}</p>
              <p>Ano: {movie.year}</p>
            </div>
            <p>{movie.description}</p>
          </div>
          <div className="optionsContent">
            <button>ASSISTIR AGORA</button>
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>
        <div className="moviesImagesIndividual">
          <h1>Images</h1>
          <div className="imagesMovie">
            <img src={movie.image1} alt="Imagem 1" />
            <img src={movie.image2} alt="Imagem 2" />
            <img src={movie.image3} alt="Imagem 3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
