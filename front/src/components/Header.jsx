import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      const userData = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser; 

      setIsAuthenticated(true);
      setName(userData.name);
      setIsAdmin(userData.role === 'ADMIN');
      setImage(userData.profileImage);

      console.log("Dados do usuário carregados:", userData);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  } else {
    console.log("Nenhum usuário encontrado no localStorage");
  }
}, []);


  function removeProfile() {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setName('');
    setImage('');
    navigate('/login');
  }

  return (
    <div>
      <div className="header">
        <div className="headerContainer">
          <div className="logoHeader">
            <img
              src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png"
              alt="Logo"
            />
          </div>
          <div className="optionsHeader">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/movies">Filmes</a></li>
              <li><a href="/series">Séries</a></li>
              <li className='liProfile'>
                {!isAuthenticated ? (
                  <a href="/login">Perfil</a>
                ) : (
                  <div className='authenticatedBox'>
                    <div className="iconName">
                      <img src={image || "https://res.cloudinary.com/dthgw4q5d/image/upload/v1753994647/icon_fzzpew.png"}  alt="Perfil" />
                      <a href="/Edit">{name}</a>
                    </div>
                    <div className="logOutBox">
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      <a onClick={removeProfile} href="#">Sair</a>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
