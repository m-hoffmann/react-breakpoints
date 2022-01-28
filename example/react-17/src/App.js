import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import WithHOC from './WithHOC';
import WithRenderProps from './WithRenderProps';
import WithHook from './WithHook';
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React 17 test app</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <WithHOC />
        <WithRenderProps />
        <WithHook />
      </div>
    );
  }
}

export default App;
