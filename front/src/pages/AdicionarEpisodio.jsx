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

  // LOGICA PAGEABLE: Carrega séries tratando o objeto de paginação
  useEffect(() => {
    fetch(`${API_URL}/series?size=1000`)
      .then(res => res.json())
      .then(data => {
        const list = data.content || data;
        setSeries(list);
        if (id) {
          const found = list.find(s => String(s.id) === String(id));
          if (found) {
            setSelectedSerie(found);
            setSeassons(found.seassonsList || []);
          }
        }
      });
  }, [id]);

  function addEpisode() {
    if (!name.trim() || !selectedSeason) return alert("Preencha os campos!");

    const payload = { name, episodeDescription: description, imageEpisode: image, duration, year };

    fetch(`${API_URL}/episodes/season/${selectedSeason.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => alert("Episódio adicionado!"));
  }

  return (
    <div className="containerAddSeasson">
      <div className="boxAddSeasson">
        <select onChange={(e) => {
          const s = series.find(x => x.name === e.target.value);
          setSelectedSerie(s);
          setSeassons(s?.seassonsList || []);
        }} value={selectedSerie?.name || ""}>
          <option value="">Selecione a Série</option>
          {series.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>

        {seassons.length > 0 && (
          <select onChange={(e) => setSelectedSeason(seassons.find(x => x.name === e.target.value))}>
            <option value="">Selecione a Temporada</option>
            {seassons.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        )}

        <input type="text" placeholder="Nome do Episódio" onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Descrição" onChange={e => setDescription(e.target.value)} />
        <input type="text" placeholder="URL Imagem" onChange={e => setImage(e.target.value)} />
        <button onClick={addEpisode}>Adicionar</button>
      </div>
    </div>
  );
};

export default AdicionarEpisodio;