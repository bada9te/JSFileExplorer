import { Routes, Route } from 'react-router-dom';
import './App.css';
import ItemsContainer from './components/items-container/items-container';
import AppContainer from './pages/Container';




function App(props) {
  return(
    <Routes>
      <Route path="/" element={<AppContainer/>}>
        <Route path="/" element={<ItemsContainer status="filesystem"/>} />
        <Route path="/bookmarks" element={<ItemsContainer status="bookmarks"/>} />
      </Route>
    </Routes>
  );
}


export default App;
