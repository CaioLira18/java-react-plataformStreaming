import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdicionarTemporada = () => {
  const API_URL = "http://localhost:8080/api";
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [seasonName, setSeasonName] = useState("");
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // LOGICA PAGEABLE: Acessando .content para popular o select de séries
  useEffect(() => {
    fetch(`${API_URL}/series?size=1000`)
      .then(res => res.json())
      .then(data => {
        const list = data.content || data;
        setSeries(list);
        if (id) {
          const found = list.find(s => String(s.id) === String(id));
          setSelectedSerie(found);
        }
      });
  }, [id]);

  function addSeasson() {
    if (!selectedSerie) {
      alert("Selecione uma série!");
      return;
    }
    
    if (!seasonName.trim()) {
      alert("Digite o nome da temporada!");
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/seassons/series/${selectedSerie.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: seasonName, 
        episodesList: [] 
      })
    })
    .then(res => {
      if (res.ok) {
        alert("Temporada adicionada com sucesso!");
        setSeasonName("");
        setSelectedSerie(null);
      } else {
        throw new Error("Erro ao adicionar temporada");
      }
    })
    .catch(error => {
      alert("Erro ao adicionar temporada: " + error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  return (
    <div className="containerAddSeasson">
      <div className="boxAddSeasson">
        <h2>Adicionar Temporada</h2>
        
        <div className="formContainer">
          <div className="addSeasson">
            {/* Select de Série */}
            <div className="inputBox">
              <label>Série *</label>
              <select 
                onChange={e => setSelectedSerie(series.find(s => s.name === e.target.value))} 
                value={selectedSerie?.name || ""}
              >
                <option value="">Selecione a série</option>
                {series.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Nome da Temporada */}
            <div className="inputBox">
              <label>Nome da Temporada *</label>
              <input 
                type="text" 
                value={seasonName} 
                onChange={e => setSeasonName(e.target.value)} 
                placeholder="Ex: Temporada 1, Season 2" 
              />
            </div>

            {/* Preview da Seleção */}
            {selectedSerie && (
              <div className="selectionPreview">
                <div className="previewCard">
                  <div className="previewIcon">📺</div>
                  <div className="previewInfo">
                    <span className="previewLabel">Série selecionada:</span>
                    <span className="previewValue">{selectedSerie.name}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Adicionar */}
          <div className="buttonAddContainer">
            <button onClick={addSeasson} disabled={loading}>
              {loading ? "🔄 Adicionando..." : "✓ Adicionar Temporada"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">Adicionando temporada...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdicionarTemporada;