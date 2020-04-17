import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import {
  IoLogoGithub,
  IoLogoJavascript,
  IoLogoNodejs,
  IoLogoHtml5,
} from 'react-icons/io';
import api from './services/api';

import './App.css';
import Logo from './assets/logo.png';

export default function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    api.get('repositories').then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (title === '' || url === '' || techs === '') {
      console.log('Any information is empty!');
      return;
    }
    setTitle('');
    setUrl('');
    setTechs('');

    const repository = {
      title,
      url,
      techs: techs.replace(/ /g, '').split(','),
    };

    const response = await api.post('repositories', repository);

    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`);

    setRepositories([...repositories.filter((repo) => repo.id !== id)]);
  }

  return (
    <div className="page-container">
      <header className="header-container">
        <img className="logo" alt="Repository logo" src={Logo} />
      </header>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Title"
        />
        <input
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          placeholder="Url"
        />
        <input
          onChange={(e) => setTechs(e.target.value)}
          value={techs}
          placeholder="Techs"
        />

        <button type="submit">Cadastrar</button>
      </form>

      <ul>
        {repositories.length > 0 ? (
          repositories.map((repository) => (
            <li key={repository.id}>
              <div>
                <IoLogoGithub size={140} color="#000" />
              </div>

              <strong>{repository.title}</strong>

              <p>{repository.url}</p>

              {repository.techs.length < 4 ? (
                <section>
                  <IoLogoHtml5 className="icons" size={32} />
                  <IoLogoJavascript className="icons" size={32} />
                  <IoLogoNodejs className="icons" size={32} />
                </section>
              ) : (<div />)}

              <button onClick={() => handleRemoveRepository(repository.id)} type="button">
                <FiTrash2 size={23} />
              </button>
            </li>
          ))) : (
            <div id="empty_repository">
              {console.log('Repositories is empty')}
            </div>
        )}

      </ul>
    </div>
  );
}
