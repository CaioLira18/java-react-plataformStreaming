import React from 'react'

const Header = () => {
  return (
    <div>
      <div className="header">
        <div className="headerContainer">
            <div className="logoHeader">
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1753825253/logo_wzqgvp.png" alt="" />
            </div>
            <div className="optionsHeader">
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="">Filmes</a></li>
                    <li><a href="">Series</a></li>
                    <li className='liProfile'>
                        <i class="fa-solid fa-user"></i>
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
