import './App.css';
import CharactersDetail from './components/CharactersDetail';
import CharacterList from './components/CharactersList';
import Navbar, { SearchResult } from './components/Navbar';
import { allCharacters } from '../Data/Data';
import { useState } from 'react';
function App() {
  const [cahracters, setCharacters] = useState(allCharacters);

  return (
    <div className="app">
      <Navbar>
        <SearchResult numOfResult={cahracters.length} />
      </Navbar>
      <Main cahracters={cahracters}>
        <CharacterList cahracters={cahracters} />
        <CharactersDetail />
      </Main>
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
