// src/components/BeaconParser.tsx

import React, { useEffect, useState } from 'react';
import { BeaconMessage, readAndParseBeaconMessages } from '../utils/parsing';

const BeaconParser: React.FC = () => {
    const [beaconMessages, setBeaconMessages] = useState<BeaconMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the text file from the public folder
        fetch('/updated_beacon_output.txt')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const parsed = readAndParseBeaconMessages(data);
                setBeaconMessages(parsed);
            })
            .catch(err => {
                console.error("Failed to fetch and parse beacon messages:", err);
                setError(err.message);
            });
    }, []);

    return (
        <div>
            <h1>Parsed Beacon Messages</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {beaconMessages.length > 0 ? (
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
                !error && <p>Loading...</p>
            )}
        </div>
    );
};

export default BeaconParser;
