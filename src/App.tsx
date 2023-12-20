import React from 'react';

import ComponentForm from './components/ComponentForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1 className="my-4">SignalRGB Component Creator</h1>
      <ComponentForm />
    </div>
  );
}

export default App;
