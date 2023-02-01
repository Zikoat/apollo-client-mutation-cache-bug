import { writeCache } from "./reproduceBug";

function App() {
  return (
    <div>
      <p>see console</p>
      <button onClick={writeCache}>write to cache</button>
    </div>
  );
}

export default App;
