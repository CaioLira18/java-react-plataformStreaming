import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdicionarEpisodio = () => {
  const API_URL = "http://localhost:8080/api";

  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [year, setYear] = useState("");
  const [seassons, setSeassons] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const { id } = useParams();

  const sanitizeFolderName = (name) => name.replace(/[^a-zA-Z0-9]/g, "_");

  async function uploadToCloudinary(file, folderName) {
    if (!file) return "";
    const cleanFolderName = sanitizeFolderName(folderName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Photos");
    formData.append("folder", `Photos/${cleanFolderName}`);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Erro no upload");
    }

    const data = await response.json();
    return data.secure_url;
  }

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  async function addEpisode() {
    if (!name.trim() || !description.trim() || !imageFile) {
      alert("Preencha os campos obrigatórios e selecione uma imagem.");
      return;
    }

    if (!selectedSeason || !selectedSeason.id) {
      alert("Selecione uma temporada.");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(imageFile, name);

      const payload = {
        name,
        episodeDescription: description,
        imageEpisode: imageUrl,
        duration,
        year
      };

      const response = await fetch(`${API_URL}/episodes/season/${selectedSeason.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Erro ao adicionar o episódio.");

      alert("Episódio adicionado com sucesso!");
      setName("");
      setDescription("");
      setDuration("");
      setYear("");
      setImageFile(null);
      setImagePreview("");

    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar: " + error.message);
    }
  }

  useEffect(() => {
    fetch(`${API_URL}/series`)
      .then(response => response.json())
      .then(data => {
        const dataArray = Array.isArray(data) ? data : (data.content || []);
        setSeries(dataArray);

        const found = dataArray.find(g => String(g.id) === String(id));
        if (found) {
          setSelectedSerie(found);
          const seasonList = found?.seassonsList || [];
          setSeassons(seasonList);
          if (seasonList.length > 0) setSelectedSeason(seasonList[0]);
        }
      })
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, [id, API_URL]);

  return (
    <div className="episode-page-container">
      <div className="episode-form-card">
        {selectedSerie?.image && (
          <img className='episode-header-banner' src={selectedSerie.image} alt="Banner da Série" />
        )}

        <div className="episode-form-content">
          <h2 className="form-section-title">Configurações do Episódio</h2>

          <div className="input-group">
            <label>Temporada</label>
            {seassons.length > 0 ? (
              <select
                className="select-field"
                onChange={(e) => {
                  const season = seassons.find(s => s.name === e.target.value);
                  setSelectedSeason(season);
                }}
                value={selectedSeason?.name || ""}
              >
                {seassons.map(season => (
                  <option key={season.id} value={season.name}>{season.name}</option>
                ))}
              </select>
            ) : <p className="text-muted">Nenhuma temporada disponível.</p>}
          </div>

          <div className="input-group">
            <label>Título do Episódio</label>
            <input
              className="input-field"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do episódio"
            />
          </div>

          <div className="input-group">
            <label>Sinopse/Descrição</label>
            <textarea
              className="textarea-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que acontece neste episódio?"
            />
          </div>

          <div className="input-group">
            <label>Thumbnail (Imagem)</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setImageFile, setImagePreview)}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="custom-file-label">
                <span className="file-icon">📁</span>
                <span>{imageFile ? imageFile.name : "Clique para selecionar"}</span>
              </label>
            </div>
            {imagePreview && (
              <div className="preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview-img" />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label>Duração (min)</label>
              <input
                className="input-field"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 45"
              />
            </div>
            <div className="input-group">
              <label>Ano de Lançamento</label>
              <input
                className="input-field"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 2024"
              />
            </div>
          </div>

          <button className="submit-button" onClick={addEpisode}>
            Salvar Episódio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdicionarEpisodio;