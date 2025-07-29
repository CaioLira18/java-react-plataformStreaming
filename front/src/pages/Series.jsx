import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Series = () => {

  const { id } = useParams(); 
  const [serie, setSerie] = useState(null); 
  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetch(`${API_URL}/series`)
      .then(response => response.json())
      .then(data => {
        console.log("Dados recebidos da API:", data);
        const found = data.find(g => g.id === id);
        console.log("Serie encontrado:", found);
        setSerie(found);
      })
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, [id]);

  if (!serie) {
    return (
      <div className="loading">
        <div className="loadingText">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="seriesIndividualContainer">
          <div className="serieIndividualBox">
            <div className="serieImage">
              <img src={serie.image} alt="" />
            </div>
            <div className="serieInformations">
              <h1>{serie.name}</h1>
              <p>{serie.description}</p>
            </div>
            <div className="inputSeassons">
              <select name="" id="">
                <option value="">Temporada 1</option>
              </select>
            </div>
          </div>

          
      </div>
    </div>
  )
}

export default Series
