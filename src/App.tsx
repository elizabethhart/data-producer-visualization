import Producer from "./Producer";

import "./App.css";

function App() {
  return (
    <div>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((producer) => (
        <Producer id={producer} />
      ))}
    </div>
  );
}

export default App;
