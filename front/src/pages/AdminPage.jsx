import React from 'react'

const AdminPage = () => {
  return (
    <div>
      <div className="centerBox">
      <div className="updateContainer">
       <div className="updateBox">
            <div className="updateBackground">
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764897687/Silvermist-Profile4_qbl4sn.webp" alt="" />
            </div>
            <h1>Filmes</h1>
            <p>Atualize, Insira ou Delete Filmes</p>
            <div className="buttonUpdate">
                <a href="/adicionarconteudo"><button>Inserir</button></a>
            </div>
        </div>
      </div>

      <div className="updateContainer">
        <div className="updateBox">
            <div className="updateBackground">
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764902884/tbbt_2_oshudg.jpg" alt="" />
            </div>
            <h1>Series</h1>
            <p>Atualize, Insira ou Delete Series</p>
             <div className="buttonUpdate">
                <a href="/adicionarconteudo"><button>Inserir</button></a>
            </div>
        </div>
      </div>

      <div className="updateContainer">
        <div className="updateBox">
            <div className="updateBackground">
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764903403/friends_c1jwhm.jpg" alt="" />
            </div>
            <h1>Adicionar Temporadas</h1>
            <p>Atualize, Insira ou Delete Series</p>
             <div className="buttonUpdate">
                <a href="/AdicionarTemporadas"><button>Inserir</button></a>
            </div>
        </div>
      </div>

      <div className="updateContainer">
        <div className="updateBox">
            <div className="updateBackground">
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764903493/coming-soon-letter-hanging-door-600nw-2497993761_mgpqmi.webp" alt="" />
            </div>
            <h1>Comming Soon</h1>
            <p>Atualize, Insira ou Delete Series</p>
             <div className="buttonUpdate">
                <a href="/adicionarconteudo"><button>Inserir</button></a>
            </div>
        </div>
      </div>

      </div>

    </div>
  )
}

export default AdminPage
