import { useState, useEffect, useCallback } from 'react';
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
  const API_URL = "https://java-react-plataformstreaming-8f2k.onrender.com/api";

  // Função para buscar dados atualizados do usuário (favoritos)
  const fetchUserData = useCallback((userId) => {
    fetch(`${API_URL}/users/${userId}`)
      .then(response => response.json())
      .then(userData => {
        setFavoriteList(userData.favoriteSeriesList || []);
      })
      .catch(err => console.error("Erro ao buscar dados do usuário:", err));
  }, [API_URL]);

  // Verificação de autenticação e carga inicial do usuário
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        fetchUserData(parsedUser.id);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      navigate('/login');
    }
  }, [navigate, fetchUserData]);

  // Busca os dados da série
  // Busca os dados da série
  useEffect(() => {
    fetch(`${API_URL}/series/${id}`)
      .then(response => response.json())
      .then(data => {
        setSerie(data);
        const seasonList = data?.seassonsList || [];
        setSeassons(seasonList);

        if (seasonList.length > 0) {
          setSelectedSeason(seasonList[0]);
          const sortedEpisodes = (seasonList[0].episodesList || []).sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
          });
          setEpisodes(sortedEpisodes);
        }
      })
      .catch(err => console.error("Erro ao buscar dados da série:", err));
  }, [id, API_URL]);

  // Busca o rating no OMDB
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

  // Lógica correta para verificar se esta série específica está nos favoritos
  const isInFavorites = favoriteList.some(item => item.id === serie?.id);

  const handleAddToFavorites = async () => {
    if (!isAuthenticated || !user || !serie) {
      alert("Você precisa estar logado para adicionar aos favoritos!");
      return;
    }

    try {
      // Se já está nos favoritos, o método deve ser DELETE (ou conforme sua API tratar)
      const method = isInFavorites ? "DELETE" : "POST";
      const response = await fetch(
        `${API_URL}/favorites/series/${serie.id}/${user.id}`,
        {
          method,
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.ok) {
        // Recarrega a lista de favoritos do backend para atualizar o ícone
        fetchUserData(user.id);
      }
    } catch (error) {
      console.error("Erro ao processar favoritos:", error);
    }
  };

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
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png" alt="DC Logo" />
              )}
              {serie.marca === "WARNER" && (
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754851380/logoMarca_tmnmvb.png" alt="Warner Logo" />
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

            {/* Botão de Favoritos corrigido */}
            <button onClick={handleAddToFavorites} className="actionButton">
              {isInFavorites ? (
                <i className="fa-solid fa-check" style={{ color: '#2ecc71' }}></i>
              ) : (
                <i className="fa-solid fa-plus"></i>
              )}
              <span>{isInFavorites ? "Na lista" : "Minha lista"}</span>
            </button>

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
                    <button className="playEpisodeButton"><i class="fa-solid fa-ellipsis"></i></button>
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