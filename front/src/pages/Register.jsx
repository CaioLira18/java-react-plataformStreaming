import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const API_URL = "http://localhost:8080/api/users";
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
    setMessageType('');

    try {
      // Validações básicas
      if (!name || !email || !cpf || !password) {
        setMessage("Preencha todos os campos.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage("Email inválido.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Validação de CPF (básica)
      if (cpf.length !== 11) {
        setMessage("CPF deve ter exatamente 11 dígitos.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Senha de administrador
      if (role === "ADMIN" && adminPassword !== "admin123") {
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
        role,
      };

      console.log("Enviando para:", API_URL);
      console.log("Dados:", userData);

      const response = await axios.post(API_URL, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 seconds timeout
      });

      setMessage("Usuário criado com sucesso!");
      setMessageType("success");

      // Limpa os campos
      setName('');
      setEmail('');
      setCpf('');
      setPassword('');
      setRole('USER');
      setAdminPassword('');
    } catch (error) {
      console.error("Erro completo:", error);
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        setMessage("Erro: Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      } else if (error.response) {
        // Servidor respondeu com erro
        const status = error.response.status;
        const msg = error.response.data?.message || error.response.data || "Erro desconhecido";
        
        if (status === 415) {
          setMessage("Erro: Formato de dados não suportado pelo servidor.");
        } else if (status === 400) {
          setMessage(`Erro: Dados inválidos - ${msg}`);
        } else if (status === 409) {
          setMessage("Erro: Email ou CPF já cadastrado.");
        } else {
          setMessage(`Erro ${status}: ${msg}`);
        }
      } else {
        setMessage("Erro: Falha na conexão com o servidor.");
      }
      
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="backgroundBox">
        <div className="registerContainer">
          <div className="registerCabecalho">
            <h1>Cadastre-se Agora</h1>
            <p>Preencha os dados para se registrar</p>
          </div>
          <div className="registerBox">
            <div className="inputRegister">
              <h2>Nome</h2>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Digite seu nome completo"
              />
            </div>
            <div className="inputRegister">
              <h2>Email</h2>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
              />
            </div>
            <div className="inputRegister">
              <h2>CPF</h2>
              <input 
                type="text" 
                value={cpf} 
                onChange={e => setCpf(e.target.value.replace(/\D/g, ''))}
                placeholder="12345678901"
                maxLength="11"
              />
            </div>
            <div className="inputRegister">
              <h2>Senha</h2>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite uma senha segura"
              />
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
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Digite a senha de administrador"
                />
              </div>
            )}
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