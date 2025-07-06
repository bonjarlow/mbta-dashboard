import React from 'react';
import OccupancyBarChart from './OccupancyBarChart';

const countTrainsByLine = (vehicles) => {
  const counts = {
    R: { trains: 0, carriages: 0 },
    G: { trains: 0, carriages: 0 },
    O: { trains: 0, carriages: 0 },
    B: { trains: 0, carriages: 0 },
    C: { trains: 0, carriages: 0 },
    Bus: {trains: 0, carriages: 0}
  };

  for (const v of vehicles) {
    const line = v.line;
    if (counts[line] !== undefined) {
      counts[line].trains++;
      counts[line].carriages += (v.carriages ? v.carriages.length : 0);
    }
  }

  return counts;
};

const TrainStats = ({ vehicles }) => {
  const counts  = countTrainsByLine(vehicles);

  return (
    <div>
      <h2>Train Counts</h2>
      <ul>
        <li><span className="red-line">Red Line</span>: {counts.R.trains} trains ({counts.R.carriages} carriages)</li>
        <li><span className="green-line">Green Line</span>: {counts.G.trains} trains ({counts.G.carriages} carriages)</li>
        <li><span className="blue-line">Blue Line</span>: {counts.B.trains} trains ({counts.B.carriages} carriages)</li>
        <li><span className="orange-line">Orange Line</span>: {counts.O.trains} trains ({counts.O.carriages} carriages)</li>
        <li><span className="commuter-rail">Commuter Rail</span>: {counts.C.trains} trains</li>
        <li>Buses: {counts.Bus.trains} Buses</li>
      </ul>

      <h2>Occupancy Status</h2>
      <OccupancyBarChart vehicles={vehicles} />
    </div>
  );
};

export default TrainStats
