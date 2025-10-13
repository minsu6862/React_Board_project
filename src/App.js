import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './component/Navbar';
import Home from "./pages/Home";
import Board from "./pages/Board";
import BoardDetail from "./pages/BoardDetail";
import BoardWrite from "./pages/BoardWrite";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/board' element={<Board />} />
        <Route path='/board/:id' element={<BoardDetail />} />
        <Route path='/board/write' element={<BoardWrite />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
