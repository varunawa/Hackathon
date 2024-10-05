interface BeaconMessage {
    id: string;
    position: { latitude: number; longitude: number; altitude: number };
    rotation: { yaw: number; pitch: number; roll: number };
    gyroscopicAcceleration: { yaw: number; pitch: number; roll: number };
    timestamp: string;
  }
  
  export function parseBeaconMessage(message: string): BeaconMessage {
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
