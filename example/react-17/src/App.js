import React from 'react';
import logo from './logo.svg';
import './App.css';
import WithHOC from './WithHOC';
import WithRenderProps from './WithRenderProps';
import WithHook from './WithHook';
import WithMatchBreakpoint from './WithMatchBreakpoint';

function App({ title, description }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">{title}</h1>
      </header>
      <p className="App-intro">{description}</p>
      <WithHOC />
      <WithRenderProps />
      <WithHook />
      <WithMatchBreakpoint />
    </div>
  );
}

export default App;
