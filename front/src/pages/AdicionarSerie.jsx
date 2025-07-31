import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdicionarSerie = () => {
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
  const { id } = useParams();

  function addSeries() {
    if (!name.trim() || !description.trim() || !image.trim()) {
      alert("Preencha os campos obrigatórios.");
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
      type
    };

    const endpoint = type === "SERIES" ? "series" : "movie";

    fetch(`${API_URL}/${endpoint}`, {
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
      .then(data => {
        alert("Adicionado com sucesso!");
        setName("");
        setDescription("");
        setImage("");
        setImage1("");
        setImage2("");
        setImage3("");
        setCategory("ACTION");
        setType("MOVIE");
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
              <h2>Nome da Serie</h2>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Digite o nome da série"
              />
            </div>

            <div className="inputBox">
              <h2>Descrição da Serie</h2>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Digite a descrição da série"
              />
            </div>

            <div className="inputBox">
              <h2>Imagem da Serie</h2>
              <input 
                type="text" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                placeholder="URL principal da imagem"
              />
            </div>

            <div className="inputBox">
              <h2>Categoria da Serie</h2>
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
              <h2>Tipo da Serie</h2>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="MOVIE">MOVIE</option>
                <option value="SERIES">SERIES</option>
              </select>
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

export default AdicionarSerie;
