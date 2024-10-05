import './App.css';
import { useEffect, useState } from 'react';
import { BeaconMessage, readAndParseBeaconMessages } from './utils/parsing';
import Orbit from './components/Orbit'; // Ensure correct file casing

function App() {
    const [beaconMessages, setBeaconMessages] = useState<BeaconMessage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
    const [dataView, setDataView] = useState<string>('position');
    const [cameraView, setCameraView] = useState<string>('top');

    useEffect(() => {
        fetch('/updated_beacon_output.txt')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then((text) => {
                try {
                    const parsedMessages = readAndParseBeaconMessages(text);
                    setBeaconMessages(parsedMessages);
                    console.log(parsedMessages); // Check the structure of the messages
                } catch (err) {
                    if (err instanceof Error) {
                        setError('Error parsing beacon data: ' + err.message);
                    }
                }
            })
            .catch((err) => {
                if (err instanceof Error) {
                    setError('Error loading file: ' + err.message);
                }
            });
    }, []);

    useEffect(() => {
        if (beaconMessages.length > 0) {
            const interval = setInterval(() => {
                setCurrentMessageIndex((prevIndex) => {
                    if (prevIndex < beaconMessages.length - 1) {
                        return prevIndex + 1;
                    } else {
                        clearInterval(interval);
                        return prevIndex;
                    }
                });
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [beaconMessages]);

    return (
        <div className="App">
            <h1>Beacon 3D Visualization</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {beaconMessages.length > 0 && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '700px',
                        left: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}>
                        <button onClick={() => setDataView('position')}>Position</button>
                        <button onClick={() => setDataView('orientation')}>Orientation</button>
                        <button onClick={() => setDataView('acceleration')}>Acceleration</button>
                    </div>

                    <div style={{
                        position: 'absolute',
                        top: 30,
                        left: 400,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: '10px',
                        borderRadius: '5px',
                    }}>
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

                    <Orbit
                        latitude={beaconMessages[currentMessageIndex].position.latitude}
                        longitude={beaconMessages[currentMessageIndex].position.longitude}
                        altitude={beaconMessages[currentMessageIndex].position.altitude}
                    />

                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '1800px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}>
                        <button onClick={() => setCameraView('top')}>Top</button>
                        <button onClick={() => setCameraView('side')}>Side</button>
                        <button onClick={() => setCameraView('bottom')}>Bottom</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
