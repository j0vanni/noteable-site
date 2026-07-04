import { useState } from "react";
import Practice from "./pages/Practice";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Practice />
    </>
  );
}

export default App;
