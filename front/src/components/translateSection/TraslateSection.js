import { useState } from 'react';
import axios from 'axios';
import './TranslateSection.css'
export default function TranslateSection() {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');

const handleTranslate = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/texts/find/byText/${sourceText}`);
    const { translations, languages } = response.data;
    const allTranslations = translations;
    const allLanguages = languages;

    if (allTranslations && allTranslations.length > 0) {
      let combinedTranslation = '';
      allTranslations.forEach((translation) => {
        combinedTranslation += translation.translatedText + ', ';
      });
      combinedTranslation = combinedTranslation.trim().slice(0, -1);

      let languageList = '';
      allLanguages.forEach((language) => {
        languageList += language.name + '\n';
      });
      languageList = languageList.trim();

      setTargetText(`Translations:\n${combinedTranslation}\n\nAvailable languages:\n${languageList}`);
    } else {
      setTargetText('No translations available');
    }
  } catch (error) {
    console.error('Error translating text:', error);
  }
};

  return (
    <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
      <textarea
        id="source-text"
        value={sourceText}
        onChange={(e) => setSourceText(e.target.value)}
        placeholder="Enter text to translate"
        style={{
          width: '300px',
          height: '300px',
          padding: '1rem',
          fontSize: '1rem',
          fontFamily: 'inherit',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#D1D1D1',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          resize: 'vertical',
          outline: 'none',
          transition: 'box-shadow 0.3s ease',
          margin: '1rem',
           resize: 'none',	
        }}
      ></textarea>
      <button onClick={handleTranslate} className='translateButton'>
        Translate
      </button>
      <textarea
        id="target-text"
        value={targetText}
        onChange={(e) => setTargetText(e.target.value)}
        placeholder="Translated text and available languages"
        style={{
          width: '300px',
          height: '300px',
          padding: '1rem',
          fontSize: '1rem',
          fontFamily: 'inherit',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#D1D1D1',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          resize: 'vertical',
          outline: 'none',
          transition: 'box-shadow 0.3s ease',
          margin: '1rem',
           resize: 'none',	
        }}
      ></textarea>
    </section>
  );
}