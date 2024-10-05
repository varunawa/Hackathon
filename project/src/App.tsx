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
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0); 

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

  useEffect(() => {
    if (beaconMessages.length > 0) {
      // Simulate real-time message arrival
      const interval = setInterval(() => {
        setCurrentMessageIndex(prevIndex => {
          if (prevIndex < beaconMessages.length - 1) {
            return prevIndex + 1;  // Move to the next message
          } else {
            clearInterval(interval);  // Stop the interval when all messages are shown
            return prevIndex;
          }
        });
      }, 1000);  // Update every 1 second

      return () => clearInterval(interval);  // Clean up the interval on unmount
    }
  }, [beaconMessages]);

  return (

    <div className="App">
      <h1>Beacon 3D Visualisation</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {beaconMessages.length > 0 ? (
        <ThreeScene
          beaconMessages={[
            {
              position: [
                beaconMessages[currentMessageIndex].position.latitude,
                beaconMessages[currentMessageIndex].position.longitude,
                beaconMessages[currentMessageIndex].position.altitude,
              ],
              rotation: [
                beaconMessages[currentMessageIndex].rotation.yaw,
                beaconMessages[currentMessageIndex].rotation.pitch,
                beaconMessages[currentMessageIndex].rotation.roll,
              ],
            },
          ]}
        />
      ) : null}

    </div>
  );

  return (
    <Orbit></Orbit>
  );
}

export default App;

function setCurrentMessageIndex(arg0: (prevIndex: any) => any) {
  throw new Error('Function not implemented.');
}
