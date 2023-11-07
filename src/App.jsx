import './App.css';
import CharactersDetail from './components/CharactersDetail';
import CharacterList from './components/CharactersList';
import Navbar, { Search, SearchResult } from './components/Navbar';
import { allCharacters } from '../Data/Data';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
function App() {
  const [cahracters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/?name=${query}`
        );
        setCharacters(data.results.slice(0, 5));
      } catch (err) {
        setCharacters([]);
        // console.log(err.response.data.error);
        toast.error(err.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }
    // if (query.length < 3) {
    //   setCharacters([]);
    //   return;
    // }
    fetchData();
  }, [query]);

  return (
    <div className="app">
      <Toaster />
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult numOfResult={cahracters.length} />
      </Navbar>
      <Main cahracters={cahracters}>
        <CharacterList cahracters={cahracters} isLoading={isLoading} />
        <CharactersDetail />
      </Main>
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
