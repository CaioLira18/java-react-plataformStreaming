import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const API_URL = "http://localhost:8080/api/users";

  // Campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); 
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');


  async function handleCreateUser() {
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      let imageUrl = null;

      // Validação da senha de admin (opcional)
      if (role === "ADMIN" && adminPassword !== "admin123") {
        setMessage("Senha de administrador incorreta.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const userData = {
        name: name || "",
        email: email || "",
        cpf: cpf || "",
        password: password || "",
        role: role || "USER",
      };

      console.log("Dados sendo enviados:", userData); // ✅ ADICIONADO: para debug

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
      setRole('USER');
      setAdminPassword('');
    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Response data:", error.response?.data);

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
        <div className="backgroundBox">
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
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                {role === "ADMIN" && (
                  <div className='inputRegister'>
                    <h2>Digite a Senha de Admin</h2>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                    />
                  </div>
                )}
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
    </div>
  );
};

export default Register;