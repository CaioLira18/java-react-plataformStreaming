import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_URL = "http://localhost:8080/api";

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
        setMovies(data);
      })
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, [id]);

  if (!movie) {
    return (
      <div className="loading">
        <div className="loadingText">
          <p>Carregando Conteudo...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      

      {/* Hero Section com Background */}
      <div className="movieHeroSection" style={{backgroundImage: `url(${movie.image})`}}>
        <div className="movieHeroOverlay">
          <div className="movieHeroContent">
            {/* Logo/Brand */}
            <div className="movieBrand">
              {movie.marca === "DISNEY" && (
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070612/logoDisney_twejpl.png" alt="" />
              )}
              {movie.marca === "DC" && (
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png" alt="" />
              )}
            </div>
            
            {/* Título Principal */}
            <h1 className="movieMainTitle">{movie.name}</h1>
            
            {/* Tags/Badges */}
            <div className="movieTags">
              <span className="movieTag movieTagNew">Novo</span>
              <span className="movieTag movieTagRating">16</span>
              <span className="movieTag movieTagYear">{movie.year}</span>
              <span className="movieTag movieTagQuality">4K UHD</span>
            </div>
            
            {/* Botão de Assistir */}
            <button className="watchButton">
              <i className="fa-solid fa-play"></i>
              Assistir Agora
            </button>
            
            {/* Ações secundárias */}
            <div className="secondaryActions">
              <button className="actionButton">
                <i className="fa-solid fa-plus"></i>
                <span>Minha lista</span>
              </button>
              <button className="actionButton">
                <i className="fa-solid fa-bookmark"></i>
                <span>Trailer</span>
              </button>
            </div>
            
            {/* Descrição */}
            <div className="movieDescription">
              <p>{movie.description}</p>
            </div>
            
            {/* Gêneros e informações */}
            <div className="movieMetadata">
              <span>Crime</span>
              <span>Documentários</span>
            </div>
            
            {/* Informações técnicas */}
            <div className="movieTechInfo">
              <p>A disponibilidade de 4K UHD, HDR e Dolby Atmos varia de acordo com o dispositivo e o plano.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Imagens */}
      <div className="moviesImagesIndividual">
        <h1>Imagens</h1>
        <div className="imagesMovie">
          <img src={movie.image1} alt="Imagem 1" />
          <img src={movie.image2} alt="Imagem 2" />
          <img src={movie.image3} alt="Imagem 3" />
        </div>
      </div>


      <div className="othersMovies">
        <h2>Coisas que você pode gostar</h2>
        <div className="othersMoviesContent">
          {movies
            .filter(movieItem => movieItem.marca === movie.marca && movieItem.id !== movie.id)
            .map((movieItem, i) => (
              <div className="movieCard" key={movieItem.id || i}>
                <img src={movieItem.image} alt={movieItem.name} />
                <div className="movieCardInfo">
                  <a href={`/movies/${movieItem.id}`}><h3>{movieItem.name}</h3></a>
                  <a href={`/movies/${movieItem.id}`}><p>{movieItem.description || "Filme da Disney"}</p></a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Movie;