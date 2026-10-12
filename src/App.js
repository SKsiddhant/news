import { useState } from 'react';
import Navbar from './Component/Navbar';
import NewsSection from './Component/NewsSection';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar'
import { CATEGORIES } from './api';

const PAGE_SIZE = 9;

function App() {
  const [mode, setMode] = useState('dark')
  const [progress, setProgress] = useState(0)

  // undefined when not configured -> the app falls back to the bundled sample articles
  const apiKey = process.env.REACT_APP_NEWS_API || undefined

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  const section = (category) => (
    <NewsSection setProgress={setProgress} apiKey={apiKey} key={category} pageSize={PAGE_SIZE} mode={mode} country="in" category={category} />
  );

  // HashRouter keeps deep links working on static hosts such as GitHub Pages
  return (
    <Router>
      <Navbar toggleMode={toggleMode} mode={mode} />
      <LoadingBar height={3} color='#f11946' progress={progress} />
      <Routes>
        <Route path="/" element={section('general')} />
        {CATEGORIES.map((c) => <Route key={c} path={`/${c}`} element={section(c)} />)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
