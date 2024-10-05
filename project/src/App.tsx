import './App.css';
import { useEffect, useState } from 'react';
import { BeaconMessage, readAndParseBeaconMessages } from './utils/parsing';
import './App.css'
import Orbit from './components/orbit.js'
import ThreeScene from './components/testScene'
// import BeaconParser from './components/BeaconParser'

function App() {
  // Store the parsed beacon messages and errors
  const [beaconMessages, setBeaconMessages] = useState<BeaconMessage[]>([]);  // State to hold the parsed messages
  const [error, setError] = useState<string | null>(null);  // State to hold error messages

  useEffect(() => {
    // Fetch the raw data from the text file in the public folder
    fetch('/updated_beacon_output.txt')
      .then(response => response.text())
      .then(text => {
        try {
          // Parse the raw text data into beacon messages
          const parsedMessages = readAndParseBeaconMessages(text);
          setBeaconMessages(parsedMessages);  // Store parsed messages in state
        } catch (err) {
          if (err instanceof Error) {
            setError('Error parsing beacon data: ' + err.message);
          }
        }
      })
      .catch(err => {
        if (err instanceof Error) {
          setError('Error loading file: ' + err.message); // Handle any fetch errors
        }
      });
  }, []);

  return (

    <div className="App">
      <h1>Beacon 3D Visualisation</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* {beaconMessages.length > 0 ? (
        <ul>
          {beaconMessages.map((msg, index) => (
            <li key={index}>
              <h2>Message ID: {msg.id}</h2>
              <p><strong>Position:</strong> Latitude {msg.position.latitude}, Longitude {msg.position.longitude}, Altitude {msg.position.altitude}</p>
              <p><strong>Rotation:</strong> Yaw {msg.rotation.yaw}, Pitch {msg.rotation.pitch}, Roll {msg.rotation.roll}</p>
              <p><strong>Gyroscopic Acceleration:</strong> Yaw {msg.gyroscopicAcceleration.yaw}, Pitch {msg.gyroscopicAcceleration.pitch}, Roll {msg.gyroscopicAcceleration.roll}</p>
              <p><strong>Timestamp:</strong> {msg.timestamp}</p>
            </li>
          ))}
        </ul>
      ) : (
        !Error && <p>Loading...</p>
      )} */}
      <ThreeScene
        beaconMessages={beaconMessages.map(msg => ({
          position: [msg.position.latitude, msg.position.longitude, msg.position.altitude],
          rotation: [msg.rotation.yaw, msg.rotation.pitch, msg.rotation.roll],
        }))}
      />
    </div>
  );

  return (
    <Orbit></Orbit>
  );
}

export default App;