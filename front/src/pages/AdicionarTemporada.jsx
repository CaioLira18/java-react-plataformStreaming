import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdicionarTemporada = () => {
  const API_URL = "http://localhost:8080/api";
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [seasonName, setSeasonName] = useState("");
  const [series, setSeries] = useState([]);
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
    if (!selectedSerie || !seasonName) return alert("Erro");
    fetch(`${API_URL}/seassons/series/${selectedSerie.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: seasonName, episodesList: [] })
    }).then(() => alert("Temporada adicionada!"));
  }

  return (
    <div className="containerAddSeasson">
      <div className="boxAddSeasson">
        <select onChange={e => setSelectedSerie(series.find(s => s.name === e.target.value))} value={selectedSerie?.name || ""}>
          <option value="">Selecione a série</option>
          {series.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        <input type="text" value={seasonName} onChange={e => setSeasonName(e.target.value)} placeholder="Nome da Temporada" />
        <button onClick={addSeasson}>Adicionar</button>
      </div>
    </div>
  );
};

export default AdicionarTemporada;