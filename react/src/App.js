import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Realtime from './components/Realtime';
import Training from './components/Training';
import Games from './components/Games';

const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Realtime</Button>
          <Button color="inherit" component={Link} to="/training">Training</Button>
          <Button color="inherit" component={Link} to="/games">Games</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Realtime />} />
        <Route path="/training" element={<Training />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </Router>
  );
};

export default App;
