import React from 'react';

import { ComponentContextProvider } from './context/ComponentContext';

import ComponentForm from './components/ComponentForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ComponentContextProvider>
      <div className="container-fluid">
        <h1 className="my-4">SignalRGB Component Creator</h1>
        <ComponentForm />
      </div>
    </ComponentContextProvider>
  );
}

export default App;
