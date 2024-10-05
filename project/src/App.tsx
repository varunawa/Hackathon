import './App.css'
import ThreeScene from './components/testScene'
import BeaconParser from './components/BeaconParser'

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