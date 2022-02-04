import logo from './logo.svg';
import './App.css';
import { ReactNode } from 'react';

function App({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">{title}</h1>
      </header>
      {children}
    </div>
  );
}

export default App;
