import React from 'react';

const AdminPage = () => {

    return (
        <div className="adminPage">
            <div className="centerBox">
                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://uploads.maisgoias.com.br/2022/05/f229a945-top-gun-maverick.jpg" alt="Filmes" />
                        </div>
                        <div className="updateContent">
                            <h1>Insira Filmes</h1>
                            <p>Adicionar Filmes</p>
                            <div className="buttonUpdate">
                                <a href="/adicionarconteudo">
                                    <button>Inserir</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764902884/tbbt_2_oshudg.jpg" alt="Series" />
                        </div>
                        <div className="updateContent">
                            <h1>Adicionar Series</h1>
                            <p>Adicionar Series</p>
                            <div className="buttonUpdate">
                                <a href="/adicionarconteudo">
                                    <button>Inserir</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764903403/friends_c1jwhm.jpg" alt="Adicionar Temporadas" />
                        </div>
                        <div className="updateContent">
                            <h1>Adicionar Temporadas</h1>
                            <p>Adicionar Temporadas</p>
                            <div className="buttonUpdate">
                                <a href="/AdicionarTemporadas">
                                    <button>Inserir</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="updateContainer">
                    <div className="updateBox">
                        <div className="updateBackground">
                            <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764903493/coming-soon-letter-hanging-door-600nw-2497993761_mgpqmi.webp" alt="Coming Soon" />
                        </div>
                        <div className="updateContent">
                            <h1>Coming Soon</h1>
                            <p>Atualize, Insira ou Delete Series</p>
                            <div className="buttonUpdate">
                                <a href="/adicionarconteudo">
                                    <button>Inserir</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;