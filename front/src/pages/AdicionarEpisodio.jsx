import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdicionarEpisodio = () => {
  const API_URL = "http://localhost:8080/api";
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState("");
  const [year, setYear] = useState("");
  const [seassons, setSeassons] = useState([]);
  const { id } = useParams();

  function addEpisode() {
    if (!name.trim() || !description.trim() || !image.trim()) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    if (!selectedSeason || !selectedSeason.id) {
      alert("Selecione uma temporada.");
      return;
    }

    const payload = {
      name,
      episodeDescription: description,
      imageEpisode: image,
      duration,
      year
    };

    fetch(`${API_URL}/episodes/season/${selectedSeason.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao adicionar.");
        }
        return response.json();
      })
      .then(() => {
        alert("Adicionado com sucesso!");
        setName("");
        setDescription("");
        setImage("");
        setDuration("");
        setYear("");
      })
      .catch(error => {
        console.error(error);
        alert("Erro ao adicionar.");
      });
  }

  useEffect(() => {
    fetch(`${API_URL}/series`)
      .then(response => response.json())
      .then(data => {
        setSeries(data);
        const found = data.find(g => g.id === id);
        if (found) {
          setSelectedSerie(found);
          const seasonList = found?.seassonsList || [];
          setSeassons(seasonList);
          if (seasonList.length > 0) {
            setSelectedSeason(seasonList[0]);
          }
        }
      })
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, [id]);

  return (
    <div>
      <div className="containerAddSeasson">
        <div className="boxAddSeasson">
          <div className="addSeasson">
            <div className="inputBox">
              <h2>Escolha a Temporada</h2>
              {seassons.length > 0 && (
                <div>
                  <select
                    name="season"
                    id="season"
                    onChange={(e) => {
                      const season = seassons.find(s => s.name === e.target.value);
                      setSelectedSeason(season);
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
            </div>

            <div className="inputBox">
              <h2>Nome do Episódio</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do episódio"
              />
            </div>

            <div className="inputBox">
              <h2>Descrição do Episódio</h2>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do episódio"
              />
            </div>

            <div className="inputBox">
              <h2>Imagem do Episódio</h2>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="URL principal da imagem"
              />
            </div>

            <div className="inputBox">
              <h2>Duração do Episódio</h2>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duração do episódio"
              />
            </div>

            <div className="inputBox">
              <h2>Ano do Episódio</h2>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ano do episódio"
              />
            </div>
          </div>

          <div className="buttonAddContainer">
            <button onClick={addEpisode}>Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdicionarEpisodio;
