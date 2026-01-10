import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_URL = "https://java-react-plataformstreaming.onrender.com/api";
  
  const navigate = useNavigate();

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setIsAuthenticated(true);
      }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleClickLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await Axios.post(
        `${API_URL}/auth/login`,
        { email, password },
      );

      if (response.data) {
        const userData = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          cpf: response.data.cpf,
          role: (response.data.role || "USER").toUpperCase(),
          token: response.data.token,
          authenticated: true,
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        setSuccess("Login realizado com sucesso!");
        setIsAuthenticated(true); 
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || "Credenciais inválidas");
      } else {
        setError("Erro de conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="cabecalhoLogin">
          <h1>Bem-vindo</h1>
          <p>Preencha as informações para fazer login</p>
        </div>

        <div className="loginBox">
          <div className="inputLogin">
            <h1>Email</h1>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputLogin">
            <h1>Senha</h1>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="message error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          <div className="buttonLogin">
            <button onClick={handleClickLogin} disabled={loading}>
              {loading ? "Carregando..." : "LOGIN"}
            </button>
          </div>

          <div className="registerLink">
            <p>Não tem conta? <a href="/Register">Registre-se</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;