import React from 'react'

const Header = () => {
  return (
    <div>
      <div className="header">
        <div className="headerContainer">
            <div className="logoHeader">
                <img src="" alt="" />
            </div>
            <div className="optionsHeader">
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="">Filmes</a></li>
                    <li><a href="">Series</a></li>
                    <li className='liProfile'>
                        <a href="">Perfil</a>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Header
