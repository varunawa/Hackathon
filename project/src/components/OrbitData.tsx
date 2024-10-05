import React from 'react';
import { useBeaconData } from './BeaconDataProvider';

import Orbit from './orbit';

const OrbitData: React.FC = () => {
  const { beaconMessages, currentMessageIndex, dataView } = useBeaconData();

  if (beaconMessages.length === 0 || currentMessageIndex >= beaconMessages.length) {
    return null;
  }

  const currentData = beaconMessages[currentMessageIndex];

  return (
    <div className="orbit-container">
      <Orbit
        beaconMessages={[
          {
            position: [
              currentData.position.latitude,
              currentData.position.longitude,
              currentData.position.altitude,
            ],
            rotation: [
              currentData.rotation.yaw,
              currentData.rotation.pitch,
              currentData.rotation.roll,
            ],
            acceleration: [
              currentData.gyroscopicAcceleration.yaw,
              currentData.gyroscopicAcceleration.pitch,
              currentData.gyroscopicAcceleration.roll,
            ],
          },
        ]}
        dataView={dataView}
      />
      {/* Add any additional OrbitData-specific rendering here */}
    </div>
  );
};

export default OrbitData;