import React from 'react';
import './App.css'
import ThreeScene from './components/testScene'
import BeaconParser from './components/BeaconParser';

function App() {
  return (
    <>
        <ThreeScene></ThreeScene>
        <BeaconParser />
        <ThreeScene />
    </>
  )
}

export default App
