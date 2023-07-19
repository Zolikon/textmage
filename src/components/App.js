import './App.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import { useEffect } from 'react';

function App() {
  document.title = "TextMage"


  return (
    <>
      <Header>
      </Header>
      <Main/>
      <Footer/>
    </>
  );
}

export default App;
