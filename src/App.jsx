import './App.css';
import HarvestYieldTracker from "./Pages/HarvestYieldTracker";
import ErrorBoundary from './Helper/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <HarvestYieldTracker />
    </ErrorBoundary>
  );
}

export default App;