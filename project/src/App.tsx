import './App.css';
import { useEffect, useState } from 'react';
import { BeaconMessage, readAndParseBeaconMessages } from './utils/parsing';
import './App.css'
import ThreeScene from './components/testScene'
// import BeaconParser from './components/BeaconParser'
// @ts-ignore
import Orbit from './components/orbit.js';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [beaconMessages, setBeaconMessages] = useState<BeaconMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [dataView, setDataView] = useState<string>('position');

  useEffect(() => {
    fetch('/updated_beacon_output.txt')
      .then(response => response.text())
      .then(text => {
        try {
          const parsedMessages = readAndParseBeaconMessages(text);
          setBeaconMessages(parsedMessages);
        } catch (err) {
          if (err instanceof Error) {
            setError('Error parsing beacon data: ' + err.message);
          }
        }
      })
      .catch(err => {
        if (err instanceof Error) {
          setError('Error loading file: ' + err.message);
        }
      });
  }, []);

  useEffect(() => {
    if (beaconMessages.length > 0) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prevIndex => {
          if (prevIndex < beaconMessages.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            return prevIndex;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [beaconMessages]);
  const currentData = beaconMessages[currentMessageIndex];
  console.log('Current Data:', currentData);
  // console.log(currentData.position);
  return (
    <div className="App">
      <h1>Beacon 3D Visualisation</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {beaconMessages.length > 0 && currentData ? (
        <>

          <div
            style={{
              position: 'absolute',
              top: 10,
              left: '10%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '10px',
              borderRadius: '5px',
              width: '250px',  // Make the box consistent in size
            }}
          >

          <div>
            <button onClick={() => setDataView('position')}>Position</button>
            <button onClick={() => setDataView('orientation')}>Orientation</button>
            <button onClick={() => setDataView('acceleration')}>Acceleration</button>
          </div>

          <div style={{ position: 'absolute', top: 30, left: 400, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', borderRadius: '5px' }}>
            

            {dataView === 'position' && (
              <>
                <p><strong>Beacon Position:</strong></p>
                <p>Latitude: {beaconMessages[currentMessageIndex].position.latitude}</p>
                <p>Longitude: {beaconMessages[currentMessageIndex].position.longitude}</p>
                <p>Altitude: {beaconMessages[currentMessageIndex].position.altitude}</p>
              </>
            )}

            {dataView === 'orientation' && (
              <>
                <p><strong>Beacon Orientation:</strong></p>
                <p>Yaw: {beaconMessages[currentMessageIndex].rotation.yaw}</p>
                <p>Pitch: {beaconMessages[currentMessageIndex].rotation.pitch}</p>
                <p>Roll: {beaconMessages[currentMessageIndex].rotation.roll}</p>
              </>
            )}

            {dataView === 'acceleration' && (
              <>
                <p><strong>Beacon Gyroscopic Acceleration:</strong></p>
                <p>Yaw: {beaconMessages[currentMessageIndex].gyroscopicAcceleration.yaw}</p>
                <p>Pitch: {beaconMessages[currentMessageIndex].gyroscopicAcceleration.pitch}</p>
                <p>Roll: {beaconMessages[currentMessageIndex].gyroscopicAcceleration.roll}</p>
              </>
            )}
          </div>

          

          <ErrorBoundary>
            <Orbit
              currentCoordinates={currentData.position}
              rotation={currentData.rotation}
              acceleration={currentData.gyroscopicAcceleration}
              dataView={dataView}
            />
          </ErrorBoundary>
        </>
      ) : (
        <p>Loading data...</p>
      )}

      {/* <Orbit /> */}
    </div>
  );
}

export default App;