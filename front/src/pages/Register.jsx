import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const API_URL = "https://java-react-plataformstreaming.onrender.com/api/users";
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
      const userData = { name, email, cpf, password, role };
      await axios.post(API_URL, userData);
      
      setMessage("Usuário criado com sucesso!");
      setMessageType("success");
      setName(''); setEmail(''); setCpf(''); setPassword('');
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