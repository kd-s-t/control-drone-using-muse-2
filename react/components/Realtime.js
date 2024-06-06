import React, { useEffect, useState } from 'react';
import EEGChart from './EEGChart';

const Realtime = () => {
  const [eegData, setEegData] = useState({
    Delta: { power: [], range: [0.5, 4] },
    Theta: { power: [], range: [4, 8] },
    Alpha: { power: [], range: [8, 13] },
    Beta: { power: [], range: [13, 30] },
    Gamma: { power: [], range: [30, 100] },
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/eeg');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setEegData((prevData) => ({
        Delta: { ...prevData.Delta, power: [...prevData.Delta.power, data.Delta.power].slice(-100) },
        Theta: { ...prevData.Theta, power: [...prevData.Theta.power, data.Theta.power].slice(-100) },
        Alpha: { ...prevData.Alpha, power: [...prevData.Alpha.power, data.Alpha.power].slice(-100) },
        Beta: { ...prevData.Beta, power: [...prevData.Beta.power, data.Beta.power].slice(-100) },
        Gamma: { ...prevData.Gamma, power: [...prevData.Gamma.power, data.Gamma.power].slice(-100) },
      }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Real-time EEG Data</h1>
      <ul>
        {Object.entries(eegData).map(([band, { power, range }]) => (
          <li key={band}>{band}: {power.length > 0 ? power[power.length - 1].toFixed(2) : 'N/A'} ({range[0]} - {range[1]} Hz)</li>
        ))}
      </ul>
      <EEGChart eegData={eegData} />
    </div>
  );
};

export default Realtime;
