import useVehicleData from './hooks/useVehicleData';
import MapView from './components/MapView';
import TrainStats from './components/TrainStats';
import './App.css';

function App() {
  const { vehicles } = useVehicleData(); // lift blip state down into hook

  return (
    <div className='App'>
      <h2>MBTA Live Dashboard</h2>
      <MapView vehicles={vehicles} />
      <TrainStats vehicles={vehicles} />
    </div>
  );
}

export default App;
