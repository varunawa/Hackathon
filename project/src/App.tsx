import './App.css'
import { Key, useEffect, useState } from 'react'
import ThreeScene from './components/testScene'
import { BeaconMessage, readAndParseBeaconMessages } from './utils/parsing';

function App() {
  const [, setBeaconMessages] = useState<BeaconMessage[]>([]); // Change the declaration of setBeaconMessages to include the correct setter function signature
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the raw data from the text file in the public folder
    fetch('/beaconData.txt')
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
          setError('Error loading file: ' + err.message); // Update the code to properly handle the setError state
        }
      });
  }, []);
  return (
    <div className="App">
      <h1>Parsed Beacon Messages</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}.
      
      {setBeaconMessages.length > 0 ? (
        <ul>
          {setBeaconMessages.map((msg: BeaconMessage, index: Key | null | undefined) => (
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
      )}
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