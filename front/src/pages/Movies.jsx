import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
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
      } catch {}
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      if (!response.ok) throw new Error();
      const userData = await response.json();
      setFavoriteList(Array.isArray(userData.favoriteMovieList) ? userData.favoriteMovieList : []);
    } catch {}
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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/movie`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        const found = data.find((g) => String(g.id) === String(id));

        if (found) {
          setMovie(found);
          if (found.youtubelink && found.youtubelink.trim() !== '') {
            setYoutubeLink(convertYouTubeToEmbed(found.youtubelink));
          }
        }
      } catch {}
    };

    if (id) fetchMovies();
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
    } catch {}
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
