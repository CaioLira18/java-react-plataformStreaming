import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Series = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);
  const [imdbRating, setImdbRating] = useState(null);
  const [seassons, setSeassons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favoriteList, setFavoriteList] = useState([]);
  const [user, setUser] = useState(null);
  // const API_URL = "http://localhost:8080/api";
  const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
  {
    !isAuthenticated && (
      navigate('/login')
    )
  }


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');

        fetch(`${API_URL}/users/${parsedUser.id}`)
          .then(response => response.json())
          .then(userData => {
            setFavoriteList(userData.favoriteSeassonList || []);
          })
          .catch(err => console.error("Erro ao buscar dados do usuário:", err));
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
  }, []);

  // LOGICA PAGEABLE: Fetch direto pelo ID para evitar erro de .find no objeto de paginação
  useEffect(() => {
    fetch(`${API_URL}/series/${id}`)
      .then(response => response.json())
      .then(data => {
        setSerie(data);
        const seasonList = data?.seassonsList || [];
        setSeassons(seasonList);

        if (seasonList.length > 0) {
          setSelectedSeason(seasonList[0]);
          setEpisodes(seasonList[0].episodesList || []);
        }
      })
      .catch(err => console.error("Erro ao buscar dados da série:", err));
  }, [id]);

  useEffect(() => {
    if (!serie?.name) return;

    const fetchRating = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?t=${encodeURIComponent(serie.name)}&apikey=6df0658b`
        );
        const data = await res.json();
        setImdbRating(data.Response === "True" ? data.imdbRating : "N/A");
      } catch (error) {
        setImdbRating("N/A");
      }
    };
    fetchRating();
  }, [serie]);

  const handleAddToFavorites = async () => {
    if (!user) {
      alert("Você precisa estar logado para adicionar aos favoritos.");
      return;
    }

    try {
      const seasonToAdd = seassons[0];
      if (!seasonToAdd) {
        alert("Nenhuma temporada disponível para adicionar.");
        return;
      }

      const response = await fetch(`${API_URL}/users/${user.id}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seassonId: seasonToAdd.id })
      });

      if (!response.ok) throw new Error();

      const updatedUser = await response.json();
      setFavoriteList(updatedUser.favoriteSeassonList || []);
      alert("Série adicionada à sua lista!");
    } catch (error) {
      alert("Erro ao adicionar série à lista.");
    }
  };

  const isInFavorites = favoriteList.some(item =>
    seassons.some(season => season.id === item.id)
  );

  if (!serie) {
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
      <div
        className="serieHeroSection"
        style={{
          '--desktop-image': `url(${serie.image})`,
          '--mobile-image': `url(${serie.imageVertical})`
        }}
      >
        <div className="serieHeroOverlay">
          <div className="serieHeroContent">
            <div className="movieBrand">
              {serie.marca === "DC" && (
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png" alt="" />
              )}
              {serie.marca === "WARNER" && (
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754851380/logoMarca_tmnmvb.png" alt="" />
              )}
            </div>

            <h1 className="serieMainTitle">{serie.name}</h1>

            <div className="serieTags">
              <span className="serieTag serieTagNew">Novo</span>
              <span className="serieTag serieTagRating">{serie.age}</span>
              <span className="serieTag serieTagQuality">4K UHD</span>
            </div>

            {seassons.length > 0 && (
              <div className="seasonSelector">
                <select
                  onChange={(e) => {
                    const season = seassons.find(s => s.name === e.target.value);
                    setSelectedSeason(season);
                    setEpisodes(season?.episodesList || []);
                  }}
                  value={selectedSeason?.name || ''}
                >
                  {seassons.map(season => (
                    <option key={season.id} value={season.name}>{season.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flexMovie">
              <button className="watchButton">
                <i className="fa-solid fa-play"></i>
                {episodes.length > 0 ? `Assistir ${episodes[0]?.name || 'Episódio 1'}` : 'Assistir Agora'}
              </button>
              <button className="ratingButton">
                <i className="fa-solid fa-star"></i>
                {imdbRating}
              </button>
            </div>

            <div className="secondaryActions">
              {!isAuthenticated && isAdmin && (
                <button className="actionButton" onClick={() => navigate(`/AdicionarEpisodio/${serie.id}`)}>
                  <i className="fa-solid fa-plus-circle"></i>
                  <span>Adicionar Episódio</span>
                </button>
              )}
            </div>

            <div className="serieDescription">
              <p>{serie.description}</p>
            </div>
          </div>
        </div>
      </div>

      {episodes.length > 0 && (
        <div className="episodesSection">
          <h2>{selectedSeason?.name}</h2>
          <div className="episodesGrid">
            {episodes.map(episode => (
              <div key={episode.id} className="episodeCard">
                <div className="episodeImageContainer">
                  <img src={episode.imageEpisode} alt={episode.name} />
                  <div className="episodeOverlay">
                    <button className="playEpisodeButton"><i className="fa-solid fa-play"></i></button>
                  </div>
                </div>
                <div className="episodeInfo">
                  <h3>{episode.name}</h3>
                  <p className="episodeDescription">{episode.episodeDescription}</p>
                  <div className="episodeMetadata">
                    <span>Duração: {episode.duration}</span>
                    <span>{episode.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="serieImagesSection">
        <h2>Imagens</h2>
        <div className="serieImages">
          <img src={serie.image1} alt="Imagem 1" />
          <img src={serie.image2} alt="Imagem 2" />
          <img src={serie.image3} alt="Imagem 3" />
        </div>
      </div>
    </div>
  );
};

export default Series;