import { useEffect, useState } from "react";
import { apiRequest } from "./services/api";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await apiRequest("/health");
        setMessage(`${data.status} - ${data.database}`);
      } catch (error) {
        setMessage(`Connection failed: ${error.message}`);
      }
    };

    checkBackend();
  }, []);

  return (
    <div>
      <h1>ScrollToll</h1>
      <p>Backend status: {message}</p>
    </div>
  );
}

export default App;
