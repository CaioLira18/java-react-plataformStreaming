import { useEffect, useState } from 'react';

const AdicionarConteudo = () => {
  const API_URL = "http://localhost:8080/api";

  const [series, setSeries] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("MOVIE");
  const [category, setCategory] = useState("ACTION");
  const [marca, setMarca] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [franquia, setFranquia] = useState("");
  const [duration, setDuration] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  // Estados para os arquivos
  const [imageFile, setImageFile] = useState(null);
  const [imageVerticalFile, setImageVerticalFile] = useState(null);
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const [image3File, setImage3File] = useState(null);

  // Estados para preview das imagens
  const [imagePreview, setImagePreview] = useState("");
  const [imageVerticalPreview, setImageVerticalPreview] = useState("");
  const [image1Preview, setImage1Preview] = useState("");
  const [image2Preview, setImage2Preview] = useState("");
  const [image3Preview, setImage3Preview] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/series?size=1000`)
      .then(res => res.json())
      .then(data => {
        const list = data.content || data;
        setSeries(list);
      })
      .catch(err => console.error(err));
  }, []);

  // Função para limpar o nome da pasta (remove caracteres especiais)
  const sanitizeFolderName = (name) => {
    return name
      .normalize("NFD") // Remove acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove caracteres especiais
      .replace(/\s+/g, "_") // Substitui espaços por underline
      .trim();
  };

  // Função para fazer upload no Cloudinary
  async function uploadToCloudinary(file, folderName) {
    const cleanFolderName = sanitizeFolderName(folderName);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Photos"); // Nome exato do preset
    formData.append("folder", `Photos/${cleanFolderName}`); // Photos/NomeDoFilme

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Erro no upload");
    }

    const data = await response.json();
    return data.secure_url;
  }

  // Função para lidar com seleção de arquivo e preview
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function addSeries() {
    if (!name.trim() || !description.trim()) {
      alert("Preencha os campos obrigatórios (Nome e Descrição).");
      return;
    }

    if (!imageFile) {
      alert("Selecione pelo menos a imagem principal.");
      return;
    }

    setUploading(true);

    try {
      // Upload de todas as imagens
      const imageUrl = await uploadToCloudinary(imageFile, name);
      const imageVerticalUrl = imageVerticalFile
        ? await uploadToCloudinary(imageVerticalFile, name)
        : "";
      const image1Url = image1File
        ? await uploadToCloudinary(image1File, name)
        : "";
      const image2Url = image2File
        ? await uploadToCloudinary(image2File, name)
        : "";
      const image3Url = image3File
        ? await uploadToCloudinary(image3File, name)
        : "";

      const payload = {
        name,
        description,
        image: imageUrl,
        image1: image1Url,
        image2: image2Url,
        image3: image3Url,
        imageVertical: imageVerticalUrl,
        type,
        category,
        marca,
        age,
        year,
        franquia,
        youtubeLink,
        duration
      };

      const response = await fetch(`${API_URL}/movie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Conteúdo adicionado com sucesso!");
        // Limpar formulário
        setName("");
        setDescription("");
        setMarca("");
        setAge("");
        setYear("");
        setFranquia("");
        setDuration("");
        setYoutubeLink("");
        setImageFile(null);
        setImageVerticalFile(null);
        setImage1File(null);
        setImage2File(null);
        setImage3File(null);
        setImagePreview("");
        setImageVerticalPreview("");
        setImage1Preview("");
        setImage2Preview("");
        setImage3Preview("");

        // Resetar os inputs de arquivo
        document.querySelectorAll('input[type="file"]').forEach(input => {
          input.value = '';
        });
      } else {
        throw new Error("Erro ao salvar no banco");
      }
    } catch (error) {
      alert("Erro ao adicionar conteúdo: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="containerAddSeasson">
      <div className="boxAddSeasson">
        <h2>Adicionar Novo Conteúdo</h2>

        <div className="formContainer">
          <div className="inputGroup">
            {/* Nome */}
            <div className="inputBox">
              <label>Nome *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do conteúdo"
              />
            </div>

            {/* Tipo */}
            <div className="inputBox">
              <label>Tipo *</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="MOVIE">Filme</option>
                <option value="SERIES">Série</option>
              </select>
            </div>

            {/* Descrição */}
            <div className="inputBox fullWidth">
              <label>Descrição *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do conteúdo"
                rows="4"
              />
            </div>

            {/* Imagem Principal */}
            <div className="inputBox fullWidth">
              <label>Imagem Principal * (Horizontal)</label>
              <div className="fileInputWrapper">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setImageFile, setImagePreview)}
                />
                <label htmlFor="image" className="fileLabel">
                  <span className="fileIcon">📁</span>
                  <span>{imageFile ? imageFile.name : "Escolher arquivo"}</span>
                </label>
              </div>
              {imagePreview && (
                <div className="imagePreview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            {/* Imagem Vertical */}
            <div className="inputBox fullWidth">
              <label>Imagem Vertical (Poster)</label>
              <div className="fileInputWrapper">
                <input
                  type="file"
                  id="imageVertical"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setImageVerticalFile, setImageVerticalPreview)}
                />
                <label htmlFor="imageVertical" className="fileLabel">
                  <span className="fileIcon">📁</span>
                  <span>{imageVerticalFile ? imageVerticalFile.name : "Escolher arquivo"}</span>
                </label>
              </div>
              {imageVerticalPreview && (
                <div className="imagePreview vertical">
                  <img src={imageVerticalPreview} alt="Preview Vertical" />
                </div>
              )}
            </div>

            {/* Marca */}
            <div className="inputBox">
              <label>Marca</label>
              <select value={marca} onChange={(e) => setMarca(e.target.value)}>
                <option value="DC">DC</option>
                <option value="DISNEY">DISNEY</option>
                <option value="WARNER">WARNER</option>
                <option value="CARTOON">CARTOON</option>
              </select>
            </div>

            {/* Categoria */}
            <div className="inputBox">
              <label>Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="ACTION">Ação</option>
                <option value="COMEDY">Comédia</option>
                <option value="DRAMA">Drama</option>
                <option value="HORROR">Terror</option>
                <option value="ROMANCE">Romance</option>
                <option value="SCIFI">Ficção Científica</option>
                <option value="ADVENTURE">Aventura</option>
              </select>
            </div>

            {/* Ano */}
            <div className="inputBox">
              <label>Ano</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 2024"
              />
            </div>

            {/* Classificação Etária */}
            <div className="inputBox">
              <label>Classificação Etária</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 14, 16, 18"
              />
            </div>

            {/* Duração */}
            <div className="inputBox">
              <label>Duração</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 2h 30min"
              />
            </div>

            {/* Franquia */}
            <div className="inputBox">
              <label>Franquia</label>
              <input
                type="text"
                value={franquia}
                onChange={(e) => setFranquia(e.target.value)}
                placeholder="Ex: Marvel, Star Wars"
              />
            </div>

            {/* Imagens Adicionais */}
            <div className="inputBox fullWidth">
              <label>Imagens Adicionais (Galeria)</label>
              <div className="additionalImagesGrid">
                {/* Imagem 1 */}
                <div className="additionalImageBox">
                  <div className="fileInputWrapper">
                    <input
                      type="file"
                      id="image1"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setImage1File, setImage1Preview)}
                    />
                    <label htmlFor="image1" className="fileLabel small">
                      <span className="fileIcon">📷</span>
                      <span>{image1File ? "Imagem 1 ✓" : "Imagem 1"}</span>
                    </label>
                  </div>
                  {image1Preview && (
                    <div className="imagePreview small">
                      <img src={image1Preview} alt="Preview 1" />
                    </div>
                  )}
                </div>

                {/* Imagem 2 */}
                <div className="additionalImageBox">
                  <div className="fileInputWrapper">
                    <input
                      type="file"
                      id="image2"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setImage2File, setImage2Preview)}
                    />
                    <label htmlFor="image2" className="fileLabel small">
                      <span className="fileIcon">📷</span>
                      <span>{image2File ? "Imagem 2 ✓" : "Imagem 2"}</span>
                    </label>
                  </div>
                  {image2Preview && (
                    <div className="imagePreview small">
                      <img src={image2Preview} alt="Preview 2" />
                    </div>
                  )}
                </div>

                {/* Imagem 3 */}
                <div className="additionalImageBox">
                  <div className="fileInputWrapper">
                    <input
                      type="file"
                      id="image3"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setImage3File, setImage3Preview)}
                    />
                    <label htmlFor="image3" className="fileLabel small">
                      <span className="fileIcon">📷</span>
                      <span>{image3File ? "Imagem 3 ✓" : "Imagem 3"}</span>
                    </label>
                  </div>
                  {image3Preview && (
                    <div className="imagePreview small">
                      <img src={image3Preview} alt="Preview 3" />
                    </div>
                  )}
                </div>

                {/* Link do Trailer */}
                <div className="inputBox">
                  <label>Link do Trailer *</label>
                  <input
                    type="text"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="Link do Trailer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="buttonAddContainer">
            <button onClick={addSeries} disabled={uploading}>
              {uploading ? "🔄 Enviando..." : "✓ Adicionar Conteúdo"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {uploading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default AdicionarConteudo;