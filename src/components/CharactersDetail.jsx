import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import toast from 'react-hot-toast';

const CharactersDetail = ({ selectedId, onAddFavourite, isFavouriteAdded }) => {
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const { data } = await axios.get(
          ` https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);

        const episodesId = data.episode.map((e) => e.split('/').at(-1));
        const { data: episodeData } = await axios.get(
          ` https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        setEpisodes([episodeData].flat().slice(0, 6));
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }
    if (selectedId) {
      fetchData();
    }
  }, [selectedId]);

  if (isLoading) {
    return (
      <div style={{ flex: 1 }}>
        <Loader />
      </div>
    );
  }

  if (!character || !selectedId) {
    return (
      <div style={{ flex: 1, color: 'var(--slate-300)' }}>
        Please select a character
      </div>
    );
  }
  return (
    <div style={{ flex: 1 }}>
      <CharacterSubInfo
        character={character}
        isFavouriteAdded={isFavouriteAdded}
        onAddFavourite={onAddFavourite}
      />
      <EpisodeList episodes={episodes} />
    </div>
  );
};

export default CharactersDetail;

function CharacterSubInfo({ character, isFavouriteAdded, onAddFavourite }) {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender === 'Male' ? '' : ''}</span>
          <span>&nbsp;{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === 'Dead' ? 'red' : ''}`}
          ></span>
          <span>&nbsp;{character.status}</span>
          <span>&nbsp; - {character.species}</span>
        </div>
        <div className="location">
          <p>Last Known Location: </p>
          <p>{character.location.name}</p>
        </div>
        <div className="action">
          {isFavouriteAdded ? (
            <p style={{ flex: 1, color: 'var(--slate-300)' }}>
              Already exist to favourite
            </p>
          ) : (
            <button
              onClick={() => onAddFavourite(character)}
              className="btn btn--primary"
            >
              Add to favorit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
function EpisodeList({ episodes }) {
  const [sortBy, setSortBy] = useState(true);
  let sortedEpisodes;
  if (sortBy) {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created)
    );
  } else {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }
  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of Episodes: </h2>
        <button onClick={() => setSortBy((is) => !is)}>
          <ArrowUpCircleIcon
            className="icon"
            style={{ rotate: sortBy ? '0deg' : '180deg' }}
          />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>
              {String(index + 1).padStart(2, '0')}
              {item.episodes}
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary"> {item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
