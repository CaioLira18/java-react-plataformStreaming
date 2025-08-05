import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Series = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [serie, setSerie] = useState(null); 
  const [seassons, setSeassons] = useState([]); 
  const [episodes, setEpisodes] = useState([]); 
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favoriteList, setFavoriteList] = useState([]);
  const [user, setUser] = useState(null);

  const API_URL = "http://localhost:8080/api";

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        console.log("Dados do usuário carregados:", parsedUser);
        
        // Buscar dados completos do usuário da API para pegar a lista de favoritos
        fetch(`${API_URL}/users/${parsedUser.id}`)
          .then(response => response.json())
          .then(userData => {
            console.log("Dados completos do usuário:", userData);
            // O backend retorna favoriteSeassonList
            setFavoriteList(userData.favoriteSeassonList || []);
          })
          .catch(err => console.error("Erro ao buscar dados do usuário:", err));
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }
  }, []);

  // Carregar série específica
  useEffect(() => {
    fetch(`${API_URL}/series`)
      .then(response => response.json())
      .then(data => {
        console.log("Dados recebidos da API:", data);
        const found = data.find(g => g.id === id);
        console.log("Série encontrada:", found);
        setSerie(found);
        const seasonList = found?.seassonsList || [];
        setSeassons(seasonList);

        if (seasonList.length > 0) {
          setSelectedSeason(seasonList[0]);
          setEpisodes(seasonList[0].episodesList || []);
        }
      })
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!user) {
      alert("Você precisa estar logado para adicionar aos favoritos.");
      return;
    }

    try {
      // Como o backend salva temporadas, vamos adicionar a primeira temporada
      const seasonToAdd = seassons[0];
      if (!seasonToAdd) {
        alert("Nenhuma temporada disponível para adicionar.");
        return;
      }

      console.log("User ID:", user.id);
      console.log("Season ID:", seasonToAdd.id);

      const response = await fetch(`${API_URL}/users/${user.id}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // Usar seassonId porque é o que o backend espera
        body: JSON.stringify({ seassonId: seasonToAdd.id })
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar aos favoritos.");
      }

      const updatedUser = await response.json();
      console.log("Usuário atualizado:", updatedUser);
      
      // Atualizar a lista de favoritos local com temporadas
      setFavoriteList(updatedUser.favoriteSeassonList || []);
      
      alert("Série adicionada à sua lista!");
    } catch (error) {
      console.error("Erro ao adicionar aos favoritos:", error);
      alert("Erro ao adicionar série à lista.");
    }
  };

  // Verificar se alguma temporada da série está nos favoritos
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
      {/* Hero Section com Background */}
      <div className="serieHeroSection" style={{
        '--desktop-image': `url(${serie.image})`,
        '--mobile-image': `url(${serie.imageVertical})`
      }}>
        <div className="serieHeroOverlay">
          <div className="serieHeroContent">
            {/* Logo/Brand */}
            <div className="movieBrand">
              {serie.marca === "DC" && (
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1754070853/DClOGO_izlahe.png" alt="" />
              )}
            </div>
            
            {/* Título Principal */}
            <h1 className="serieMainTitle">{serie.name}</h1>
            
            {/* Tags/Badges */}
            <div className="serieTags">
              <span className="serieTag serieTagNew">Novo</span>
              <span className="serieTag serieTagRating">{serie.age}</span>
              <span className="serieTag serieTagQuality">4K UHD</span>
            </div>
            
            {/* Selector de Temporadas */}
            {seassons.length > 0 && (
              <div className="seasonSelector">
                <select 
                  name="season" 
                  id="season"
                  onChange={(e) => {
                    const season = seassons.find(s => s.name === e.target.value);
                    setSelectedSeason(season);
                    setEpisodes(season?.episodesList || []);
                  }}
                  value={selectedSeason?.name || ''}
                >
                  {seassons.map(season => (
                    <option key={season.id} value={season.name}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Botão de Assistir */}
            <button className="watchButton">
              <i className="fa-solid fa-play"></i>
              {episodes.length > 0 ? `Assistir ${episodes[0]?.name || 'Episódio 1'}` : 'Assistir Agora'}
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
              
              {isAuthenticated && isAdmin && (
                <button className="actionButton" onClick={() => navigate(`/AdicionarEpisodio/${serie.id}`)}>
                  <i className="fa-solid fa-plus-circle"></i>
                  <span>Adicionar Episódio</span>
                </button>
              )}
            </div>
            
            {/* Descrição */}
            <div className="serieDescription">
              <p>{serie.description}</p>
            </div>
            
            {/* Informações técnicas */}
            <div className="serieTechInfo">
              <p>A disponibilidade de 4K UHD, HDR e Dolby Atmos varia de acordo com o dispositivo e o plano.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Episódios */}
      {episodes.length > 0 && (
        <div className="episodesSection">
          <h2>{selectedSeason?.name}</h2>
          <div className="episodesGrid">
            {episodes.map(episode => (
              <div key={episode.id} className="episodeCard">
                <div className="episodeImageContainer">
                  <img src={episode.imageEpisode} alt={episode.name} />
                  <div className="episodeOverlay">
                    <button className="playEpisodeButton">
                      <i className="fa-solid fa-play"></i>
                    </button>
                    <button className="episodeOptionsButton">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
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
          
          <div className="episodeDisclaimer">
            <p>* Os Episódios estão limitados e não estão disponíveis para assistir, devido aos direitos</p>
          </div>
        </div>
      )}

      {/* Seção de Imagens */}
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