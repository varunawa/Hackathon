import React from 'react';
import { useBeaconData } from './BeaconDataProvider';
import BeaconDataDisplay from './BeaconDataDisplay';
import Orbit from './OrbitData';

const BeaconVisualization: React.FC = () => {
  const { error, isLoading } = useBeaconData();

  if (isLoading) {
    return <div>Loading beacon messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Beacon 3D Visualisation</h1>
      <BeaconDataDisplay />
      <Orbit />
    </div>
  );
};

export default BeaconVisualization;