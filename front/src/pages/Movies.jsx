import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [imdbRating, setImdbRating] = useState(null);
  const [favoriteList, setFavoriteList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const API_URL = "https://java-react-plataformstreaming.onrender.com/api";

  useEffect(() => {
    if (!movie?.name) return;

    const fetchRating = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?t=${encodeURIComponent(movie.name)}&apikey=6df0658b`
        );
        const data = await res.json();

        if (data.Response === "True") {
          setImdbRating(data.imdbRating);
        } else {
          setImdbRating("N/A");
        }
      } catch (error) {
        console.error("Erro ao buscar rating:", error);
        setImdbRating("N/A");
      }
    };

    fetchRating();
  }, [movie]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.id) return;

        setUser(parsedUser);
        setIsAuthenticated(true);
        setFavoriteList(parsedUser.favoriteMovieList || [])
        setIsAdmin(parsedUser.role === "ADMIN");
        fetchUserData(parsedUser.id);
      } catch { }
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setFavoriteList(updatedUser.favoriteMovieList || []);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  const convertYouTubeToEmbed = (url) => {
    if (!url || typeof url !== 'string') return "";
    url = url.trim().replace(/\s/g, '');
    let videoId = "";

    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      const params = url.split('?')[1];
      const urlParams = new URLSearchParams(params);
      videoId = urlParams.get('v');
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    } else if (url.includes('youtube.com/v/')) {
      videoId = url.split('youtube.com/v/')[1].split('?')[0];
    } else if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) {
      videoId = url;
    }

    if (!videoId) return "";
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // LOGICA PAGEABLE: Fetch direto pelo ID para evitar erro de .find no objeto de paginação
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/movie/${id}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        setMovie(data);
        if (data.youtubelink && data.youtubelink.trim() !== '') {
          setYoutubeLink(convertYouTubeToEmbed(data.youtubelink));
        }
      } catch (err) {
        console.error("Erro ao carregar filme", err);
      }
    };

    if (id) fetchMovieDetail();
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
      if (!response.ok) throw new Error();
      fetchUserData(user.id);
    } catch { }
  };

  function handleTrailerPlay() {
    if (youtubeLink && youtubeLink.includes('youtube.com/embed/')) {
      setShowTrailer(true);
    } else if (movie?.youtubelink && movie.youtubelink.trim() !== '') {
      const processedLink = convertYouTubeToEmbed(movie.youtubelink);
      if (processedLink) {
        setYoutubeLink(processedLink);
        setShowTrailer(true);
      } else {
        alert("Formato de link do trailer inválido!");
      }
    } else {
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

  const hasTrailer = movie.youtubelink && movie.youtubelink.trim() !== '';

  return (
    <div>
      <div
        className="movieHeroSection"
        style={{
          '--desktop-image': `url(${movie.image})`,
          '--mobile-image': `url(${movie.imageVertical})`,
        }}
      >
        <div className="movieHeroOverlay">
          <div className="movieHeroContent">
            <div className="movieBrand">
              {movie.marca === "DISNEY" && (
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070612/logoDisney_twejpl.png" alt="" />
              )}
              {movie.marca === "DC" && (
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png" alt="" />
              )}
            </div>
            <h1 className="movieMainTitle">{movie.name}</h1>
            <div className="flexMovie">
              <button className="watchButton">
                <i className="fa-solid fa-play"></i>
                Assistir Agora
              </button>
              <button className="ratingButton">
                <i className="fa-solid fa-star"></i>
                {imdbRating}
              </button>
            </div>
            <div className="secondaryActions">
              <button onClick={handleAddToFavorites} className="actionButton">
                {isInFavorites ? (
                  <i className="fa-solid fa-check"></i>
                ) : (
                  <i className="fa-solid fa-plus"></i>
                )}
                <span>{isInFavorites ? "Na lista" : "Minha lista"}</span>
              </button>
              {hasTrailer && (
                <button onClick={handleTrailerPlay} className="actionButton">
                  <i className="fa-solid fa-film"></i>
                  <span>Trailer</span>
                </button>
              )}
            </div>
            <p>{movie.description}</p>
          </div>
        </div>
      </div>

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
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="serieImagesSection">
        <h2>Imagens</h2>
        <div className="serieImages">
          <img src={movie.image1} alt="Imagem 1" />
          <img src={movie.image2} alt="Imagem 2" />
          <img src={movie.image3} alt="Imagem 3" />
        </div>
      </div>
    </div>
  );
};

export default Movie;