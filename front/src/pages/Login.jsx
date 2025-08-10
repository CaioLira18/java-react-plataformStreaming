import React, { useState, useContext } from 'react';
import Divider from '../components/Divider';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await Axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
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
        navigate('/');
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (error.code === "ERR_NETWORK") {
        setError("Erro de conexão. Verifique sua internet.");
      } else if (error.response) {
        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          "Credenciais inválidas";
        setError(message);
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const API_URL = "https://java-react-plataformstreaming.onrender.com/api" || "http://localhost:8080/api";

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="imageLogin">
          <img
            src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753831910/logo2_gd2mwf.png"
            alt="Logo"
          />
        </div>

        <div className="cabecalhoLogin">
          <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png" alt="" />
          <h1>Bem-vindo</h1>
          <p>Preencha as informações para fazer login</p>
        </div>

        <div className="loginBox">
          <div className="inputLogin">
            <i className="fa-solid fa-envelope"></i>
            <h1>Email</h1>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputLogin">
            <i className="fa-solid fa-lock"></i>
            <h1>Senha</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="buttonLogin">
            <button onClick={handleClickLogin} disabled={loading}>
              {loading ? "Carregando..." : "LOGIN"}
            </button>
          </div>

          <Divider />

          <div className="othersLogin">
            <a href="#"><i className="fa-brands fa-google"></i></a>
            <a href="#"><i className="fa-brands fa-facebook"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
          </div>

          <div className="registerLink">
            <p>Não tem conta? <strong><a href="/Register">Registre-se</a></strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
