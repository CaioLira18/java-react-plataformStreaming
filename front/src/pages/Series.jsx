import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Series = () => {
  const { id } = useParams(); 
  const [serie, setSerie] = useState(null); 
  const [seassons, setSeassons] = useState([]); 
  const [episodes, setEpisodes] = useState([]); 
  const [selectedSeason, setSelectedSeason] = useState(null);
  const API_URL = "http://localhost:8080/api";

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState(false);
  
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

  if (!serie) {
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
      <div className="seriesIndividualContainer">
        <div className="serieIndividualBox">
          <div className="serieImage">
            <img src={serie.image} alt={serie.name} />
          </div>

          <div className="serieInformations">
            <h1>{serie.name}</h1>
            <p>{serie.description}</p>
          </div>

          {seassons.length > 0 && (
            <div className="inputSeassons">
              <select 
                name="season" 
                id="season"
                onChange={(e) => {
                  const season = seassons.find(s => s.name === e.target.value);
                  setSelectedSeason(season);
                  setEpisodes(season?.episodesList || []);
                }}
                value={selectedSeason?.name}
              >
                {seassons.map(season => (
                  <option key={season.id} value={season.name}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {episodes.length > 0 && (
            <div className="episodesContainer">
              {episodes.map(episode => (
                <div key={episode.id} className="episodeItem">
                  <img src={episode.imageEpisode} alt={episode.name} />
                  <div className="optionsEpisode">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                    <i class="fa-solid fa-play"></i>
                  </div>
                  <div className="episodeInformations">
                    <p><strong>{episode.name}</strong></p>
                    <p>{episode.episodeDescription}</p>
                    <div className="durationYear">
                      <p>Duração: {episode.duration}</p>
                      <p><strong>{episode.year}</strong></p>
                    </div>
                  </div>   
                </div>
              ))}
            </div>
          )}

          <div className="information">
            <p>* Os Episodios estão limitados e não estão disponiveis para assitir, devido aos direitos</p>
          </div>

          <div className="serieImagesIndividual">
            <h1>Imagens</h1>
            <div className="imagesSerie">
              <img src={serie.image1} alt="Imagem 1" />
              <img src={serie.image2} alt="Imagem 2" />
              <img src={serie.image3} alt="Imagem 3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Series;
