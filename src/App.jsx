import './App.css';
import CharactersDetail from './components/CharactersDetail';
import CharacterList from './components/CharactersList';
import Navbar, { Favourites, Search, SearchResult } from './components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import useCharacters from './hooks/useCharacter';
import useLocalStorage from './hooks/useLocalStorage';
function App() {
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState('');
  const { characters, isLoading } = useCharacters(
    'https://rickandmortyapi.com/api/character/?name',
    query
  );

  const [selectedId, setSelectedId] = useState(null);
  const [favourites, setFavourites] = useLocalStorage('FAVOURITES', []);

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + 1), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [count]);

  const handleSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };
  const handleFavourite = (char) => {
    setFavourites((prevFav) => [...prevFav, char]);
  };
  const handleDeleteFavourite = (id) => {
    setFavourites((preFav) => preFav.filter((fav) => fav.id !== id));
  };
  const isFavouriteAdded = favourites.map((fav) => fav.id).includes(selectedId);

  return (
    <div className="app">
      <Toaster />
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult numOfResult={characters.length} />
        <Favourites
          favourites={favourites}
          onDeleteFavourite={handleDeleteFavourite}
        />
      </Navbar>
      <Main characters={characters}>
        <CharacterList
          selectedId={selectedId}
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={handleSelectCharacter}
        />
        <CharactersDetail
          selectedId={selectedId}
          onAddFavourite={handleFavourite}
          isFavouriteAdded={isFavouriteAdded}
        />
      </Main>
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
