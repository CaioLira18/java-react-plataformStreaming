import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const API_URL = "http://localhost:8080/api/users";

  // Campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('USER'); // role
  const [adminPassword, setAdminPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  async function uploadImage(file) {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "react_upload");
      data.append("folder", "streamingPlatform/profile"); 
      
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
        data
      );
      return res.data.secure_url;
    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      throw new Error("Falha no upload da imagem");
    }
  }

  async function handleCreateUser() {
  setLoading(true);
  setMessage('');
  setMessageType('');

  try {
    let imageUrl = null;

    // Upload da imagem, se houver
    if (profileImage) {
      imageUrl = await uploadImage(profileImage);
    }

    // Validação da senha de admin (opcional)
    if (type === "ADMIN" && adminPassword !== "admin123") {
      setMessage("Senha de administrador incorreta.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const userData = {
      name,
      email,
      cpf,
      password,
      type,
      profileImage: imageUrl
    };

    // Envio dos dados para o backend
    const response = await axios.post(API_URL, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setMessage("Usuário criado com sucesso!");
    setMessageType("success");

    // Limpa o formulário
    setName('');
    setEmail('');
    setCpf('');
    setPassword('');
    setType('USER');
    setAdminPassword('');
    setProfileImage(null);
  } catch (error) {
    console.error(error);

    if (error.response && error.response.data && error.response.data.message) {
      setMessage(`Erro: ${error.response.data.message}`);
    } else {
      setMessage("Erro ao criar o usuário.");
    }

    setMessageType("error");
  } finally {
    setLoading(false);
  }
}


 

  return (
    <div>
      <div className="register">
        <div className="registerContainer">
          <div className="registerCabecalho">
            <h1>Cadastre-se Agora</h1>
            <p>preencha os dados para se registrar</p>
          </div>
          <div className="registerBox">
            <div className="inputRegister">
              <h2>Nome</h2>
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="inputRegister">
              <h2>Email</h2>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="inputRegister">
              <h2>CPF</h2>
              <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} />
            </div>
            <div className="inputRegister">
              <h2>Senha</h2>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="inputRegister">
              <h2>Tipo da Conta</h2>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {type === "ADMIN" && (
                <div className='adminBox'>
                  <h2>Digite a Senha de Admin</h2>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="inputRegister">
              <h2>Escolha a Foto de Perfil</h2>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setProfileImage(e.target.files[0])} 
              />
            </div>
          </div>

          <div className="registerAddContainer">
            <button
              onClick={handleCreateUser}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
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
    </div>
  );
};

export default Register;