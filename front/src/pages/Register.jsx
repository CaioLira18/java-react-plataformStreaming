import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  // Configuração correta da URL da API
  const API_URL = process.env.NODE_ENV === 'production' 
    ? "https://java-react-plataformstreaming.onrender.com/api/users"
    : "http://localhost:8080/api/users";

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Função para formatar CPF
  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 11) {
      return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  // Função para validar email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar CPF
  const isValidCPF = (cpf) => {
    const numericCPF = cpf.replace(/\D/g, '');
    return numericCPF.length === 11;
  };

  const handleCreateUser = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Validações básicas
      if (!name.trim()) {
        setMessage("Nome é obrigatório.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (!email.trim()) {
        setMessage("Email é obrigatório.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        setMessage("Email inválido.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (!cpf.trim()) {
        setMessage("CPF é obrigatório.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (!isValidCPF(cpf)) {
        setMessage("CPF deve ter 11 dígitos.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setMessage("Senha é obrigatória.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setMessage("Senha deve ter pelo menos 6 caracteres.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Validação para senha de administrador
      if (role === "ADMIN" && adminPassword !== "admin123") {
        setMessage("Senha de administrador incorreta.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Prepara os dados do usuário (apenas números no CPF)
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        cpf: cpf.replace(/\D/g, ''), // Remove formatação do CPF
        password: password,
        role: role
      };

      console.log("Enviando para:", API_URL);
      console.log("Dados:", userData);

      // Faz a requisição com headers corretos
      const response = await axios.post(API_URL, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 segundos de timeout
      });

      console.log("Resposta:", response.data);
      setMessage("Usuário criado com sucesso!");
      setMessageType("success");

      // Limpa os campos após sucesso
      setName('');
      setEmail('');
      setCpf('');
      setPassword('');
      setRole('USER');
      setAdminPassword('');

    } catch (error) {
      console.error("Erro completo:", error);
      
      let errorMessage = "Erro ao criar o usuário.";
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        
        switch (error.response.status) {
          case 400:
            errorMessage = "Dados inválidos. Verifique se todos os campos estão corretos.";
            break;
          case 409:
            errorMessage = "Email ou CPF já cadastrado.";
            break;
          case 415:
            errorMessage = "Erro no formato dos dados. Tente novamente.";
            break;
          case 500:
            errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
            break;
          default:
            errorMessage = error.response.data?.message || `Erro ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      
      setMessage(errorMessage);
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
                disabled={loading}
              />
            </div>
            <div className="inputRegister">
              <h2>Email</h2>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>
            <div className="inputRegister">
              <h2>CPF</h2>
              <input 
                type="text" 
                value={cpf} 
                onChange={e => setCpf(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength="14"
                disabled={loading}
              />
            </div>
            <div className="inputRegister">
              <h2>Senha</h2>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>
            <div className="inputRegister">
              <h2>Tipo da Conta</h2>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)}
                disabled={loading}
              >
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
                  disabled={loading}
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
              {loading ? 'Criando...' : 'Criar Conta'}
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