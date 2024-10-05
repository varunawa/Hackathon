import './App.css'
import { Key, useEffect, useState } from 'react'
import ThreeScene from './components/testScene'
import { BeaconMessage, readAndParseBeaconMessages } from './utils/parsing';

function App() {
  const [, setBeaconMessages] = useState<BeaconMessage[]>([]); // Change the declaration of setBeaconMessages to include the correct setter function signature
  const [, setError] = useState<string | null>(null);

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
          setError('Error loading file: ' + err.message); // Update the code to properly handle the setError state
        }
      });
  }, []);
  return (
    <div className="App">
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