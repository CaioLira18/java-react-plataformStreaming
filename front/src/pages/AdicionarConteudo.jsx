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
  const [imageVertical, setImageVertical] = useState("");
  const [type, setType] = useState("MOVIE");
  const [category, setCategory] = useState("ACTION");
  const [marca, setMarca] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [franquia, setFranquia] = useState("");
  const [duration, setDuration] = useState("");
  const { id } = useParams();

  // LOGICA PAGEABLE: Acessando .content para listar as séries no select
  useEffect(() => {
    fetch(`${API_URL}/series?size=1000`)
      .then(res => res.json())
      .then(data => {
        const list = data.content || data;
        setSeries(list);
      })
      .catch(err => console.error(err));
  }, []);

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
      imageVertical,
      type,
      category,
      marca,
      age,
      year,
      franquia,
      duration
    };

    fetch(`${API_URL}/movie`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => alert("Conteúdo adicionado!"))
      .catch(() => alert("Erro ao adicionar"));
  }

  return (
    <div className="containerAddSeasson">
      <div className="boxAddSeasson">
        <div className="formContainer">
          <div className="inputGroup">
            <div className="inputBox">
              <h2>Nome</h2>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do conteúdo" />
            </div>
            <div className="inputBox">
              <h2>Tipo</h2>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="MOVIE">Filme</option>
                <option value="SERIES">Série</option>
              </select>
            </div>
            <div className="inputBox">
              <h2>Descrição</h2>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" />
            </div>
            <div className="inputBox">
              <h2>Imagem Principal</h2>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL da imagem" />
            </div>
            <div className="inputBox">
              <h2>Imagem Vertical</h2>
              <input type="text" value={imageVertical} onChange={(e) => setImageVertical(e.target.value)} placeholder="URL da imagem vertical" />
            </div>
            <div className="inputBox">
              <h2>Marca</h2>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca" />
            </div>
            <div className="inputBox">
              <h2>Imagem 1</h2>
              <input type="text" value={image1} onChange={(e) => setImage1(e.target.value)} placeholder="URL da imagem 1" />
            </div>
            <div className="inputBox">
              <h2>Imagem 2</h2>
              <input type="text" value={image2} onChange={(e) => setImage2(e.target.value)} placeholder="URL da imagem 2" />
            </div>
            <div className="inputBox">
              <h2>Imagem 3</h2>
              <input type="text" value={image3} onChange={(e) => setImage3(e.target.value)} placeholder="URL da imagem 3" />
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