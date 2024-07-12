import React, { useEffect, useState } from 'react';
import { ComponentContextProvider } from './context/ComponentContext';

import ComponentForm from './components/ComponentForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isOpenCvReady, setIsOpenCvReady] = useState<boolean>(false);

  useEffect(() => {
    // Wait for OpenCV.js to be ready
    const checkOpenCv = () => {
      if (window.cv) {
        setIsOpenCvReady(true);
      } else {
        setTimeout(checkOpenCv, 100);
      }
    };
    checkOpenCv();
  }, []);

  return (
    <ComponentContextProvider>
      <div className="container-fluid">
        <h1 className="my-4">
          SignalRGB Component Creator
          {!isOpenCvReady && (
            <div
              className="spinner-grow ms-2"
              style={{ width: '2rem', height: '2rem' }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </h1>
        <ComponentForm />
      </div>
    </ComponentContextProvider>
  );
}

export default App;
