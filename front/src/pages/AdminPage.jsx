import React from 'react'

const AdminPage = () => {
  return (
    <div>
      <div className="updateContainer">
       <a href="/adicionarconteudo"><div className="updateBox">
            <div className="updateBackground">
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764897687/Silvermist-Profile4_qbl4sn.webp" alt="" />
            </div>
            <h1>Filmes</h1>
            <p>Atualize, Insira ou Delete Filmes</p>
        </div></a> 
      </div>

      <div className="updateContainer">
        <div className="updateBox">
            <div className="updateBackground">
                <img src="" alt="" />
            </div>
            <h1>Series</h1>
            <p>Atualize, Insira ou Delete Series</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
