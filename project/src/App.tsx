import './App.css';
import ThreeScene from './components/testScene';
import BeaconParser from './components/BeaconParser';

function App() {
  return (
    <div className="App">
      <BeaconParser />
      <ThreeScene />
    </div>

    /*
    <>
        <ThreeScene></ThreeScene>
    </>
    */
  );
}

export default App;