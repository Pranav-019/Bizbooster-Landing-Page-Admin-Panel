import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ContextProvider } from './Contexts/ContextProvider'; // adjust the path accordingly
import App from './App';
import './index.css';
import Login from './Pages/Login';

ReactDOM.render(
  <ContextProvider>
    <Router>
      <App/>
    </Router>
  </ContextProvider>,
  document.getElementById('root')
);
