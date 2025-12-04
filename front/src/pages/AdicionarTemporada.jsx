import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdicionarTemporada = () => {
 const API_URL = process.env.NODE_ENV === 'production' 
    ? "https://java-react-plataformstreaming.onrender.com/api" 
    : "http://localhost:8080/api";  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [seasonName, setSeasonName] = useState("");
  const { id } = useParams();

  function addSeasson() {
  if (!selectedSerie || seasonName.trim() === "") {
    alert("Selecione uma série e informe o nome da temporada.");
    return;
  }

  const novaTemporada = {
    name: seasonName,
    episodesList: [] // você pode adicionar isso ou deixar o backend criar vazio
  };

  fetch(`${API_URL}/seassons/series/${selectedSerie.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novaTemporada)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao adicionar temporada.");
      }
      return response.json();
    })
    .then(data => {
      alert("Temporada adicionada com sucesso!");
      setSeasonName(""); // Limpa o campo de input

      // Atualiza o estado da série selecionada para refletir a nova temporada
      setSelectedSerie(prev => ({
        ...prev,
        seassonsList: [...(prev.seassonsList || []), data]
      }));
    })
    .catch(error => {
      console.error(error);
      alert("Erro ao adicionar temporada.");
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
        }
      })
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, [id]);

  return (
    <div>
      <div className="containerAddSeasson">
        <div className="boxAddSeasson">
          {series.length > 0 && (
            <div className="inputSeassons">
              <select 
                name="season" 
                id="season"
                onChange={(e) => {
                  const selected = series.find(s => s.name === e.target.value);
                  setSelectedSerie(selected);
                }}
                value={selectedSerie?.name || ""}
              >
                <option value="">Selecione uma série</option>
                {series.map(serie => (
                  <option key={serie.id} value={serie.name}>
                    {serie.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="addSeasson">
            <h2>Nome da Temporada</h2>
            <input 
              type="text" 
              value={seasonName} 
              onChange={(e) => setSeasonName(e.target.value)} 
              placeholder="Digite o nome da temporada"
            />
          </div>
          
          <div className="buttonAddContainer">
            <button onClick={addSeasson}>Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdicionarTemporada;
