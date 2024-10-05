export interface BeaconMessage {
  id: string;
  timestamp: string;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  rotation: {
    yaw: number;
    pitch: number;
    roll: number;
  };
  gyroscopicAcceleration: {
    yaw: number;
    pitch: number;
    roll: number;
  };
}

// Parsing function
export function parseBeaconMessage(message: string): BeaconMessage {
  // Regex to capture position, rotation, gyroscopic acceleration, and timestamp
  const messageRegex = /Message (\d+).*L\[(\-?\d+\.\d+),(\-?\d+\.\d+),(\-?\d+\.\d+)\].*R\[(\-?\d+\.\d+),(\-?\d+\.\d+),(\-?\d+\.\d+)\].*G\[(\-?\d+\.\d+),(\-?\d+\.\d+),(\-?\d+\.\d+)\].*RD\[(.*?)\]/;
  const match = message.match(messageRegex);

  if (!match) throw new Error("Invalid message format: " + message);

  const [
      _,
      id,
      latitude,
      longitude,
      altitude,
      yaw,
      pitch,
      roll,
      gyroYaw,
      gyroPitch,
      gyroRoll,
      timestamp
  ] = match;

  // Return the parsed message object
  return {
      id,
      position: { latitude: parseFloat(latitude), longitude: parseFloat(longitude), altitude: parseFloat(altitude) },
      rotation: { yaw: parseFloat(yaw), pitch: parseFloat(pitch), roll: parseFloat(roll) },
      gyroscopicAcceleration: { yaw: parseFloat(gyroYaw), pitch: parseFloat(gyroPitch), roll: parseFloat(gyroRoll) },
      timestamp,
  };
}

// Function to parse all beacon messages from a string
export function readAndParseBeaconMessages(data: string): BeaconMessage[] {
  // Split the messages using a regex that accounts for the message structure
  const rawMessages = data.split(/(?=Message \d+)/).filter(msg => msg.trim() !== '');

  // Parse each message
  const parsedMessages: BeaconMessage[] = rawMessages.map((msg, index) => {
      try {
          return parseBeaconMessage(msg);
      } catch (error) {
          console.error(`Error parsing message at index ${index}:`, (error as Error).message);
          return null; // or handle the error as needed
      }
  }).filter(msg => msg !== null) as BeaconMessage[]; // Remove nulls

  return parsedMessages;
}