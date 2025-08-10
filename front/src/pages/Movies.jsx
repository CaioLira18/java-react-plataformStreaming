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
  const [showTrailer, setShowTrailer] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");

  const API_URL =
    "https://java-react-plataformstreaming.onrender.com/api" ||
    "http://localhost:8080/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.id) return;

        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === "ADMIN");
        fetchUserData(parsedUser.id);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const userData = await response.json();
      setFavoriteList(Array.isArray(userData.favoriteMovieList) ? userData.favoriteMovieList : []);
    } catch (error) {
      console.error(error);
    }
  };

  // Função para converter link do YouTube para embed
  const convertYouTubeToEmbed = (url) => {
    if (!url || typeof url !== 'string') {
      console.log("URL inválida ou não fornecida:", url);
      return "";
    }
    
    console.log("URL original para conversão:", url);
    
    // Remove espaços em branco e quebras de linha
    url = url.trim().replace(/\s/g, '');
    
    // Diferentes formatos de URL do YouTube
    let videoId = "";
    
    if (url.includes('youtu.be/')) {
      // Formato: https://youtu.be/VIDEO_ID?si=... ou https://youtu.be/VIDEO_ID
      const afterDomain = url.split('youtu.be/')[1];
      videoId = afterDomain.split('?')[0].split('&')[0]; // Remove parâmetros como ?si=
    } else if (url.includes('youtube.com/watch?v=')) {
      // Formato: https://www.youtube.com/watch?v=VIDEO_ID&...
      const params = url.split('?')[1];
      const urlParams = new URLSearchParams(params);
      videoId = urlParams.get('v');
    } else if (url.includes('youtube.com/embed/')) {
      // Já está no formato embed
      return url;
    } else if (url.includes('youtube.com/v/')) {
      // Formato: https://www.youtube.com/v/VIDEO_ID
      videoId = url.split('youtube.com/v/')[1].split('?')[0];
    } else {
      // Caso o campo contenha apenas o ID do vídeo (11 caracteres)
      if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) {
        videoId = url;
      }
    }
    
    if (!videoId) {
      console.error("Não foi possível extrair o ID do vídeo de:", url);
      return "";
    }
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    console.log("ID do vídeo extraído:", videoId);
    console.log("URL convertida para embed:", embedUrl);
    
    return embedUrl;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log("Buscando filme com ID:", id);
        const response = await fetch(`${API_URL}/movie`);
        if (!response.ok) throw new Error(`Erro ao buscar filmes: ${response.status}`);
        
        const data = await response.json();
        console.log("Dados recebidos da API:", data);
        
        // Converter o ID para string se necessário para comparação
        const found = data.find((g) => String(g.id) === String(id));
        
        if (found) {
          console.log("Filme encontrado:", found);
          console.log("Todas as propriedades do filme:", Object.keys(found));
          console.log("youtubelink do filme:", found.youtubelink);
          console.log("Tipo do youtubelink:", typeof found.youtubelink);
          
          setMovie(found);
          setMovies(data);
          
          // Verificar se youtubelink existe e não está vazio
          if (found.youtubelink && found.youtubelink.trim() !== '') {
            const processedLink = convertYouTubeToEmbed(found.youtubelink);
            setYoutubeLink(processedLink);
            console.log("Link processado e definido:", processedLink);
          } else {
            console.log("youtubelink está vazio ou não existe");
            setYoutubeLink("");
          }
        } else {
          console.log("Filme não encontrado para ID:", id);
          console.log("IDs disponíveis:", data.map(item => ({ id: item.id, name: item.name })));
        }
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    };
    
    if (id) {
      fetchMovies();
    }
  }, [id, API_URL]);

  const handleAddToFavorites = async () => {
    if (!isAuthenticated || !user || !movie) {
      alert("Você precisa estar logado para adicionar aos favoritos!");
      return;
    }

    const isAlreadyFavorite = favoriteList.some((item) => item.id === movie.id);
    try {
      const method = isAlreadyFavorite ? "DELETE" : "POST";
      const response = await fetch(
        `${API_URL}/favorites/movie/${movie.id}/${user.id}`,
        { method, headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error(`Erro: ${response.status}`);
      fetchUserData(user.id);
    } catch (error) {
      console.error("Erro ao gerenciar favoritos:", error);
    }
  };

  function handleTrailerPlay() {
    console.log("=== TENTATIVA DE REPRODUZIR TRAILER ===");
    console.log("Estado atual do youtubeLink:", youtubeLink);
    console.log("youtubelink do movie:", movie?.youtubelink);
    console.log("movie completo:", movie);
    
    // Primeiro, tentar usar o link já processado
    if (youtubeLink && youtubeLink.includes('youtube.com/embed/')) {
      console.log("Usando link já processado:", youtubeLink);
      setShowTrailer(true);
    } 
    // Se não houver link processado, tentar processar o link original
    else if (movie?.youtubelink && movie.youtubelink.trim() !== '') {
      console.log("Tentando processar link original:", movie.youtubelink);
      const processedLink = convertYouTubeToEmbed(movie.youtubelink);
      if (processedLink) {
        console.log("Link processado com sucesso:", processedLink);
        setYoutubeLink(processedLink);
        setShowTrailer(true);
      } else {
        console.error("Falha ao processar link:", movie.youtubelink);
        alert("Formato de link do trailer inválido!");
      }
    } else {
      console.log("Nenhum link de trailer disponível");
      alert("Trailer não disponível!");
    }
  }

  if (!movie) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Carregando Conteúdo...</p>
      </div>
    );
  }

  const isInFavorites =
    Array.isArray(favoriteList) && movie
      ? favoriteList.some((item) => item.id === movie.id)
      : false;

  // Verificar se deve mostrar o botão do trailer
  const hasTrailer = movie.youtubelink && movie.youtubelink.trim() !== '';

  return (
    <div>
      {/* Hero Section */}
      <div
        className="movieHeroSection"
        style={{
          '--desktop-image': `url(${movie.image})`,
          '--mobile-image': `url(${movie.imageVertical})`,
        }}
      >
        <div className="movieHeroOverlay">
          <div className="movieHeroContent">
            <h1 className="movieMainTitle">{movie.name}</h1>

            <button className="watchButton">
              <i className="fa-solid fa-play"></i>
              Assistir Agora
            </button>

            <div className="secondaryActions">
              <button onClick={handleAddToFavorites} className="actionButton">
                {isInFavorites ? (
                  <i className="fa-solid fa-check"></i>
                ) : (
                  <i className="fa-solid fa-plus"></i>
                )}
                <span>{isInFavorites ? "Na lista" : "Minha lista"}</span>
              </button>

              {/* Botão trailer - só aparece se houver link válido */}
              {hasTrailer && (
                <button onClick={handleTrailerPlay} className="actionButton">
                  <i className="fa-solid fa-film"></i>
                  <span>Trailer</span>
                </button>
              )}
            </div>

            <p>{movie.description}</p>
            
            {/* Debug info - remova em produção */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ 
                marginTop: '1rem', 
                fontSize: '0.8rem', 
                opacity: 0.7,
                background: 'rgba(0,0,0,0.5)',
                padding: '10px',
                borderRadius: '5px'
              }}>
                <p><strong>Debug Info:</strong></p>
                <p>ID do filme: {movie.id}</p>
                <p>Link original: {movie.youtubelink || 'N/A'}</p>
                <p>Link processado: {youtubeLink || 'N/A'}</p>
                <p>Tem trailer: {hasTrailer ? 'Sim' : 'Não'}</p>
                <p>Tipo youtubelink: {typeof movie.youtubelink}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal trailer */}
      {showTrailer && youtubeLink && (
        <div className="trailerModal" onClick={() => setShowTrailer(false)}>
          <div className="trailerContent" onClick={(e) => e.stopPropagation()}>
            <span className="closeBtn" onClick={() => setShowTrailer(false)}>
              &times;
            </span>
            <iframe
              width="100%"
              height="500"
              src={youtubeLink}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;