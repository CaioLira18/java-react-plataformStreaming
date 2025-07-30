import {useEffect, useState} from 'react'

const Header = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState(false);
  
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setIsAdmin(parsedUser.role === 'ADMIN');
          setName(parsedUser.name);
  
          console.log("Dados do usuário carregados:", parsedUser);
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      } else {
        console.log("Nenhum usuário encontrado no localStorage");
      }
    
    }, []);

     function removeProfile() {
        localStorage.removeItem("user");
        navigate('/login');
      }

  return (
    <div>
      <div className="header">
        <div className="headerContainer">
            <div className="logoHeader">
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png" alt="" />
            </div>
            <div className="optionsHeader">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="">Filmes</a></li>
                    <li><a href="/series">Series</a></li>
                    <li className='liProfile'>
                        <i class="fa-solid fa-user"></i>
                        {!isAuthenticated && (
                        <a href="/login">Perfil</a>
                        )}
                        {isAuthenticated && (
                          <div className='authenticatedBox'>
                            <a href="">{name}</a>
                            <div className="logOutBox">
                              <i class="fa-solid fa-arrow-right-from-bracket"></i>
                              <a onClick={removeProfile} href="">Sair</a>
                            </div>
                          </div>
                   
                        )}
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Header
