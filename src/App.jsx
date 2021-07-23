import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './scss/styles.scss';
import Header from "./components/Header/Header";
import Routes from './components/Routes';
import Footer from "./components/Footer/Footer";
import AuthContext from './components/AuthContext';
import Cookies from 'js-cookie';

function App() {
  const [auth, setAuth] = React.useState(false);

  const readCookie = () => {
    const user = Cookies.get("user");
    if(user) {
      setAuth(true);
    }
  }

  React.useEffect(() => {
    readCookie();
  }, [])
  
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
