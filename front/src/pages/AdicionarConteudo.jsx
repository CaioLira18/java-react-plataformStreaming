import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdicionarConteudo = () => {

  const API_URL = "http://localhost:8080/api";
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [type, setType] = useState("MOVIE");
  const [category, setCategory] = useState("ACTION");
  const [marca, setMarca] = useState("");
  const [year, setYear] = useState("");
  const [duration, setDuration] = useState("");
  const { id } = useParams();

  function addSeries() {
    if (!name.trim() || !description.trim() || !image.trim()) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    // Validação adicional para filmes
    if (type === "MOVIE" && (!year.trim() || !duration.trim())) {
      alert("Para filmes, ano e duração são obrigatórios.");
      return;
    }

    const payload = {
      name,
      description,
      image,
      image1,
      image2,
      image3,
      category,
      type,
      marca,
      // Incluindo year e duration no payload
      ...(type === "MOVIE" && { year, duration })
    };

    const endpoint = type === "SERIES" ? "series" : "movie";

    console.log("Payload sendo enviado:", payload); // Para debug

    fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Resposta da API:", data); // Para debug
        alert("Adicionado com sucesso!");
        // Reset dos campos
        setName("");
        setDescription("");
        setImage("");
        setImage1("");
        setImage2("");
        setImage3("");
        setCategory("ACTION");
        setType("MOVIE");
        setMarca("");
        setYear("");
        setDuration("");
      })
      .catch(error => {
        console.error("Erro detalhado:", error);
        alert("Erro ao adicionar: " + error.message);
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
          <div className="addSeasson">
            <div className="inputBox">
              <h2>Nome</h2>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Digite o nome da série"
              />
            </div>

            <div className="inputBox">
              <h2>Descrição</h2>
              <input 
                type='text'
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Digite a descrição da série"
                rows="3"
              />
            </div>

            <div className="inputBox">
              <h2>Imagem</h2>
              <input 
                type="text" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                placeholder="URL principal da imagem"
              />
            </div>

            <div className="inputBox">
              <h2>Categoria</h2>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="ACTION">ACTION</option>
                <option value="ADVENTURE">ADVENTURE</option>
                <option value="HORROR">HORROR</option>
                <option value="COMEDY">COMEDY</option>
                <option value="HERO">HERO</option>
                <option value="FAMILY">FAMILY</option>
              </select>
            </div>

            <div className="inputBox">
              <h2>Tipo</h2>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="MOVIE">MOVIE</option>
                <option value="SERIES">SERIES</option>
              </select>
            </div>

            {type === "MOVIE" && (
              <div>
                <div className="inputBox">
                  <h2>Ano do Filme</h2>
                  <input 
                    type="text" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    placeholder="Ex: 2024"
                    min="1900"
                    max="2030"
                  />
                </div>
                <div className="inputBox">
                  <h2>Duração do Filme</h2>
                  <input 
                    type="text" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    placeholder="Ex: 120"
                    min="1"
                  />
                </div>
              </div>
            )}

            <div className="inputBox">
              <h2>Marca</h2>
              <input 
                type="text" 
                value={marca} 
                onChange={(e) => setMarca(e.target.value)} 
                placeholder="Marca"
              />
            </div>

            <div className="inputBox">
              <h2>Imagem 1</h2>
              <input 
                type="text" 
                value={image1} 
                onChange={(e) => setImage1(e.target.value)} 
                placeholder="URL da imagem 1"
              />
            </div>

            <div className="inputBox">
              <h2>Imagem 2</h2>
              <input 
                type="text" 
                value={image2} 
                onChange={(e) => setImage2(e.target.value)} 
                placeholder="URL da imagem 2"
              />
            </div>

            <div className="inputBox">
              <h2>Imagem 3</h2>
              <input 
                type="text" 
                value={image3} 
                onChange={(e) => setImage3(e.target.value)} 
                placeholder="URL da imagem 3"
              />
            </div>
          </div>

          <div className="buttonAddContainer">
            <button onClick={addSeries}>Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdicionarConteudo;