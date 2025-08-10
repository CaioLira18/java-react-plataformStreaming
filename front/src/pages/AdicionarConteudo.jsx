import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdicionarConteudo = () => {
  // Corrigir a lógica de URL da API
  const API_URL = process.env.NODE_ENV === 'production' 
    ? "https://java-react-plataformstreaming.onrender.com/api" 
    : "http://localhost:8080/api";
    
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [imageVertical, setImageVertical] = useState("");
  const [type, setType] = useState("MOVIE");
  const [category, setCategory] = useState("ACTION");
  const [marca, setMarca] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [franquia, setFranquia] = useState("");
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
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      image1: image1.trim(),
      image2: image2.trim(),
      image3: image3.trim(),
      age: age.trim(),
      imageVertical: imageVertical.trim(),
      category,
      type,
      marca: marca.trim(),
      franquia: franquia.trim(),
      ...(type === "MOVIE" && { 
        year: year.trim(), 
        duration: duration.trim() 
      })
    };

    // Remover campos vazios para evitar problemas no backend
    Object.keys(payload).forEach(key => {
      if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    const endpoint = type === "SERIES" ? "series" : "movie";

    console.log("URL da requisição:", `${API_URL}/${endpoint}`);
    console.log("Payload sendo enviado:", payload);

    fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        console.log("Status da resposta:", response.status);
        console.log("Headers da resposta:", response.headers);
        
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Erro HTTP ${response.status}: ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Resposta da API:", data);
        alert("Adicionado com sucesso!");
        // Reset dos campos
        setName("");
        setDescription("");
        setImage("");
        setImage1("");
        setImage2("");
        setImage3("");
        setImageVertical("");
        setCategory("ACTION");
        setType("MOVIE");
        setMarca("");
        setAge("");
        setYear("");
        setDuration("");
        setFranquia("");
      })
      .catch(error => {
        console.error("Erro detalhado:", error);
        alert("Erro ao adicionar: " + error.message);
      });
  }

  useEffect(() => {
    console.log("Buscando séries na URL:", `${API_URL}/series`);
    
    fetch(`${API_URL}/series`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setSeries(data);
        const found = data.find(g => g.id === id);
        if (found) {
          setSelectedSerie(found);
        }
      })
      .catch(err => {
        console.error("Erro ao buscar dados:", err);
        alert("Erro ao carregar séries: " + err.message);
      });
  }, [id, API_URL]);

  return (
    <div>
      <div className="containerAddContent">
        <div className="boxAddContent">
          <div className="addContent">
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
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="URL principal da imagem"
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
              <h2>Vertical Imagem</h2>
              <input
                type="text"
                value={imageVertical}
                onChange={(e) => setImageVertical(e.target.value)}
                placeholder="URL da imagem vertical"
              />
            </div>

            <div className="inputBox">
              <h2>Idade Recomendada</h2>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Idade Recomendada"
              />
            </div>

            <div className="inputBox">
              <h2>Franquia</h2>
              <input
                type="text"
                value={franquia}
                onChange={(e) => setFranquia(e.target.value)}
                placeholder="Franquia"
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
                    type="number"
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
                    placeholder="Ex: 2h21"
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