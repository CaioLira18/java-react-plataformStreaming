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
  const [birthDate, setBirthDate] = useState('');
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

  async function handleCreate() {
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = null;
      if (profileImage) {
        imageUrl = await uploadImage(profileImage);
      }

      const newUser = {
        name,
        email,
        cpf,
        password,
        role: type, 
        birthDate,
        adminPassword: type === "ADMIN" ? adminPassword : undefined,
        profileImage: imageUrl,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro ao criar usuário: ${errorData}`);
      }
      await response.json();

      setMessage('Conta criada com sucesso!');
      setMessageType('success');

      setName('');
      setEmail('');
      setCpf('');
      setPassword('');
      setType('USER');
      setAdminPassword('');
      setBirthDate('');
      setProfileImage(null);

    } catch (error) {
      console.error("Erro:", error);
      setMessage(error.message);
      setMessageType('error');
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
              <h2>Data da Nascimento</h2>
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
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
              onClick={handleCreate}
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