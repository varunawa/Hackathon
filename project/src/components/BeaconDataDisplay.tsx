import React from 'react';
import { useBeaconData } from './BeaconDataProvider';

const BeaconDataDisplay: React.FC = () => {
  const { beaconMessages, currentMessageIndex, dataView, setDataView } = useBeaconData();

  const renderDataView = () => {
    if (beaconMessages.length === 0 || currentMessageIndex >= beaconMessages.length) return null;
    const currentData = beaconMessages[currentMessageIndex];

    switch (dataView) {
      case 'position':
        return (
          <>
            <p><strong>Beacon Position:</strong></p>
            <p>Latitude: {currentData.position.latitude}</p>
            <p>Longitude: {currentData.position.longitude}</p>
            <p>Altitude: {currentData.position.altitude}</p>
          </>
        );
      case 'orientation':
        return (
          <>
            <p><strong>Beacon Orientation:</strong></p>
            <p>Yaw: {currentData.rotation.yaw}</p>
            <p>Pitch: {currentData.rotation.pitch}</p>
            <p>Roll: {currentData.rotation.roll}</p>
          </>
        );
      case 'acceleration':
        return (
          <>
            <p><strong>Beacon Gyroscopic Acceleration:</strong></p>
            <p>Yaw: {currentData.gyroscopicAcceleration.yaw}</p>
            <p>Pitch: {currentData.gyroscopicAcceleration.pitch}</p>
            <p>Roll: {currentData.gyroscopicAcceleration.roll}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="beacon-data-display">
      <div>
        <button onClick={() => setDataView('position')}>Position</button>
        <button onClick={() => setDataView('orientation')}>Orientation</button>
        <button onClick={() => setDataView('acceleration')}>Acceleration</button>
      </div>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        {renderDataView()}
      </div>
    </div>
  );
};

export default BeaconDataDisplay;