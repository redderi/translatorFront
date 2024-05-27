import './App.css';
import Header from './components/header/Header';
import { Fragment, useState, useEffect } from 'react';
import TranslateSection from './components/translateSection/TraslateSection';
import WordLibrarySection from './components/wordLibrarySection/WordLibrarySection';


export default function App() {
  const [tab, setTab] = useState('main');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const scrollFunction = () => {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', scrollFunction);

    return () => {
      window.removeEventListener('scroll', scrollFunction);
    };
  }, []);

  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <Fragment>
      <link rel="shortcut icon" href="../favicon.png" />
      {showButton && (
        <button onClick={topFunction} id="myBtn" title="Наверх" style={{backgroundColor: '#333'}}>
          Up
        </button>
      )}
      <Header active={tab} onChange={(current) => setTab(current)} />
      <main>
        {tab === 'main' && <TranslateSection />}
        {tab === 'wordLibrary' && <WordLibrarySection />}
      </main>
    </Fragment>
  );
}