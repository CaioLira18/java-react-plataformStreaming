import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  const API_URL = "http://localhost:8080/api";


  useEffect(() => {
    fetch(`${API_URL}/series`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSeries(data);
        } else {
          console.error('Formato inesperado para Movies:', data);
        }
      })
      .catch(error => console.error('Erro ao buscar Movies:', error));
  }, []);

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

  const navigate = useNavigate();

  {
    !isAuthenticated && (
      navigate('/login')
    )
  }


  return (
    <div>
      <div className="containerContent" >
        {series.map((series, i) => (
          <div className="boxContent" key={i}>
            {series.type = "SERIES" && (
              <div className="boxInformation">
                <img src={series.image} alt="" />
                <a href={"/series/" + series.id}><p>{series.name}</p></a>
              </div>
            )}
          </div>

        ))}
      </div>
    </div>
  )
}

export default SeriesPage
