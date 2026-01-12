import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  // const API_URL = "https://java-react-plataformstreaming.onrender.com/api/users";
  const API_URL = "http://localhost:8080/api";
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState("");

  async function uploadProfileImageToCloudinary() {
    const formData = new FormData()
    formData.append("file", photoFile)
    formData.append("upload_preset", "profile_users")

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    )

    if (!response.ok) throw new Error()

    const data = await response.json()
    return data.secure_url
  }

  const handleCreateUser = async () => {
    setLoading(true);
    setMessage('');

    if (!name || !email || !cpf || !password) {
      setMessage("Preencha todos os campos.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {

      const uploadedImageProfile = await uploadProfileImageToCloudinary()
      setPhoto(uploadedImageProfile)

      const userData = { name, email, cpf, password, photo: uploadedImageProfile, role };
      await axios.post(API_URL, userData);

      setMessage("Usuário criado com sucesso!");
      setMessageType("success");
      setName(''); setEmail(''); setCpf(''); setPassword(''); setPhoto();
    } catch (error) {
      setMessage("Erro ao cadastrar usuário.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="backgroundBox">
        <div className="registerCabecalho">
          <h1>Cadastre-se Agora</h1>
          <p>Preencha os dados para se registrar</p>
        </div>

        <div className="registerBox">
          <div className="inputRegister">
            <h2>Nome Completo</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Digite seu nome" />
          </div>

          <div className="inputRegister">
            <h2>Email</h2>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="exemplo@email.com" />
          </div>

          <div className="inputRegister">
            <h2>CPF</h2>
            <input type="text" value={cpf} onChange={e => setCpf(e.target.value.replace(/\D/g, ''))} placeholder="000.000.000-00" maxLength="11" />
          </div>

          <div className="inputRegister">
            <h2>Senha</h2>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Crie uma senha" />
          </div>

          <div className="inputRegister">
            <h2>Tipo da Conta</h2>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {role === "ADMIN" && (
            <div className="inputRegister">
              <h2>Senha de Admin</h2>
              <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Senha mestre" />
            </div>
          )}

          <div className="inputPhoto">
            <h2>Foto de Perfil</h2>
            <label htmlFor="file-upload" className="custom-file-upload">
              <span className="upload-icon">📁</span>
              <span className="file-name">Escolher arquivo...</span>
              <input onChange={(e) => setPhotoFile(e.target.files[0])} id="file-upload" type="file" />
              {photoFile && <p style={{ color: 'green', marginTop: '5px' }}>Arquivo selecionado: {photoFile.name}</p>}
            </label>
          </div>
        </div>

        <div className="registerAddContainer">
          <button onClick={handleCreateUser} disabled={loading}>
            {loading ? 'Salvando...' : 'Criar Conta'}
          </button>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;