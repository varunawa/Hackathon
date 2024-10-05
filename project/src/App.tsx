import './App.css'
import ThreeScene from './components/testScene'
import Globe from './components/globe.js'

function App() {
  return (
    <div className="App">
      <BeaconParser />
      <ThreeScene />
    </div>

    /*
    <>
        <Globe></Globe>
    </>
    */
  );
}

export default App;