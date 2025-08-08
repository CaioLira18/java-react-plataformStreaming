import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState(null);
  const [favoriteList, setFavoriteList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = "http://localhost:8080/api";

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Dados do usuário do localStorage:", parsedUser);
        
        // Validar se o usuário tem ID válido
        if (!parsedUser.id) {
          console.error("ID do usuário não encontrado");
          return;
        }
        
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        
        // Buscar dados completos do usuário da API para pegar a lista de favoritos
        fetchUserData(parsedUser.id);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }
  }, []);

  // Função separada para buscar dados do usuário
  const fetchUserData = async (userId) => {
    try {
      console.log("Buscando dados do usuário ID:", userId);
      
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const userData = await response.json();
      console.log("Dados completos do usuário:", userData);
      
      // Verificar se favoriteMovieList existe e é um array
      const favoriteMovies = Array.isArray(userData.favoriteMovieList) 
        ? userData.favoriteMovieList 
        : [];
      
      setFavoriteList(favoriteMovies);
      
    } catch (error) {
      console.error("Erro detalhado ao buscar dados do usuário:", error);
      
      // Se for erro 404, o usuário pode não existir mais
      if (error.message.includes('404')) {
        console.warn("Usuário não encontrado, limpando localStorage");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    }
  };

  // Carregar filme específico e lista de filmes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/movie`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar filmes: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Dados recebidos da API:", data);
        
        const found = data.find(g => g.id === id);
        console.log("Movie encontrado:", found);
        
        setMovie(found);
        setMovies(data);
      } catch (error) {
        console.error("Erro ao buscar dados dos filmes:", error);
      }
    };

    fetchMovies();
  }, [id]);

  const handleAddToFavorites = async () => {
  if (!isAuthenticated || !user || !movie) {
    console.warn("Usuário não autenticado ou dados incompletos.");
    return;
  }

  const isAlreadyFavorite = favoriteList.some(item => item.id === movie.id);

  try {
    if (isAlreadyFavorite) {
      // 🔴 REMOVER dos favoritos
      const response = await fetch(`${API_URL}/favorite-movie`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          movieId: movie.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao remover favorito: ${response.status}`);
      }

      console.log("Filme removido dos favoritos");
    } else {
      // ✅ ADICIONAR aos favoritos
      const response = await fetch(`${API_URL}/favorite-movie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          movieId: movie.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar favorito: ${response.status}`);
      }

      console.log("Filme adicionado aos favoritos");
    }

    // 🔄 Atualiza lista de favoritos depois da mudança
    fetchUserData(user.id);
  } catch (error) {
    console.error("Erro ao atualizar favoritos:", error);
  }
};





  // Verificar se o filme atual está nos favoritos
  const isInFavorites = Array.isArray(favoriteList) && movie 
    ? favoriteList.some(item => item.id === movie.id)
    : false;

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
              <span className="movieTag movieTagRating">{movie.age}</span>
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
              <button onClick={handleAddToFavorites} className="actionButton">
                {isInFavorites ? (
                  <i className="fa-solid fa-check"></i>
                ) : (
                  <i className="fa-solid fa-plus"></i>
                )}
                <span>{isInFavorites ? 'Na lista' : 'Minha lista'}</span>
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
              <span>{movie.category}</span>
              <span>{movie.type}</span>
            </div>
            
            {/* Informações técnicas */}
            <div className="movieTechInfo">
              <p>A disponibilidade de 4K UHD, HDR e Dolby Atmos varia de acordo with o dispositivo e o plano.</p>
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
          {Array.isArray(movies) && movies
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