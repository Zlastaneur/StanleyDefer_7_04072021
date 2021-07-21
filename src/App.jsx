import React from 'react';
import {BrowserRouter as Router, Link } from 'react-router-dom';
import './scss/styles.scss';
import Header from "./components/Header/Header";
import Routes from './components/Routes';
import Footer from "./components/Footer/Footer";
import AuthContext from './components/AuthContext';

function App() {
  const [auth, setAuth] = React.useState(false);
  
  return (
    <React.Fragment>
      <AuthContext.Provider value={{auth, setAuth}}>
        <Router>
          <Header />
          <Routes />
          <Footer />
        </Router>
      </AuthContext.Provider>
    </React.Fragment>
  );
}

export default App;
