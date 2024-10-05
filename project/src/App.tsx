import './App.css';
import { useEffect, useState } from 'react';
import { BeaconMessage, readAndParseBeaconMessages } from './utils/parsing';


function App() {
  // Store the parsed beacon messages and errors
  const [, setBeaconMessages] = useState<BeaconMessage[]>([]);  // State to hold the parsed messages
  const [, setError] = useState<string | null>(null);  // State to hold error messages

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

}

export default App;