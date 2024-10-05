import * as fs from 'fs';
import * as path from 'path';

// Define the BeaconMessage interface
interface BeaconMessage {
    id: string;
    position: { latitude: number; longitude: number; altitude: number };
    rotation: { yaw: number; pitch: number; roll: number };
    gyroscopicAcceleration: { yaw: number; pitch: number; roll: number };
    timestamp: string;
}

// Parsing function as provided
function parseBeaconMessage(message: string): BeaconMessage {
    // Regex to capture position, rotation, gyroscopic acceleration, and timestamp
    const messageRegex = /Message (\d+).*L\[(.*)\].*R\[(.*)\].*G\[(.*)\].*RD\[(.*)\]/;
    const match = message.match(messageRegex);

    if (!match) throw new Error("Invalid message format");

    const [id, positionString, rotationString, gyroscopicString, timestamp] = match.slice(1);

    // Parse position (latitude, longitude, altitude)
    const [latitude, longitude, altitude] = positionString.split(',').map(parseFloat);

    // Parse rotation (yaw, pitch, roll)
    const [yaw, pitch, roll] = rotationString.split(',').map(parseFloat);

    // Parse gyroscopic acceleration (yaw, pitch, roll)
    const [gyroYaw, gyroPitch, gyroRoll] = gyroscopicString.split(',').map(parseFloat);

    // Return the parsed message object
    return {
      id,
      position: { latitude, longitude, altitude },
      rotation: { yaw, pitch, roll },
      gyroscopicAcceleration: { yaw: gyroYaw, pitch: gyroPitch, roll: gyroRoll },
      timestamp
    };
}

// Function to read and parse all beacon messages from the file
function readAndParseBeaconMessages(filePath: string): BeaconMessage[] {
    try {
        // Read the file content synchronously (for simplicity)
        const data = fs.readFileSync(filePath, 'utf-8');

        // Define a delimiter based on your file's structure
        // From your example, messages are separated by a series of underscores
        // Adjust the delimiter as per the actual file content
        const delimiter = /Message \d+/; // This regex matches the start of a new message

        // Split the data into individual messages
        // Using a regex to split before 'Message' followed by digits
        const rawMessages = data.split(/(?=Message \d+)/).filter(msg => msg.trim() !== '');

        // Parse each message
        const parsedMessages: BeaconMessage[] = rawMessages.map((msg, index) => {
            try {
                return parseBeaconMessage(msg);
            } catch (error) {
                console.error(`Error parsing message at index ${index}:`, error.message);
                return null; // or handle the error as needed
            }
        }).filter(msg => msg !== null) as BeaconMessage[]; // Remove nulls

        return parsedMessages;
    } catch (err) {
        console.error("Error reading the file:", err.message);
        return [];
    }
}

// Usage Example
const filePath = path.join(__dirname, 'updated_beacon_output.txt');
const beaconMessages = readAndParseBeaconMessages(filePath);

console.log("Parsed Beacon Messages:", beaconMessages);
