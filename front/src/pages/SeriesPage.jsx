import {useState, useEffect} from 'react'

const SeriesPage = () => {
    const [series, setSeries] = useState([]);
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
