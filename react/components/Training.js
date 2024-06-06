import React, { useEffect, useState } from 'react';
import Realtime from './Realtime';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const canvasStyle = {
  border: '1px solid black',
  backgroundColor: '#f0f0f0',
};

const Training = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [brainwaveData, setBrainwaveData] = useState({ Delta: 0, Theta: 0, Alpha: 0, Beta: 0 });
  const canvasWidth = 500;
  const canvasHeight = 500;
  const boxSize = 20;

  useEffect(() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const droneImage = new Image();
    droneImage.src = '/tello.png'; // Adjust path as necessary

    const drawCharacter = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.drawImage(droneImage, position.x, position.y, boxSize, boxSize); // Draw the character
    };

    drawCharacter();

    const handleBrainwaveData = (e) => {
      const data = JSON.parse(e.data);
      setBrainwaveData({
        Delta: data.Delta.power,
        Theta: data.Theta.power,
        Alpha: data.Alpha.power,
        Beta: data.Beta.power,
      });

      if (data.Delta.power > 1000000) {
        setPosition((pos) => ({ x: pos.x, y: Math.max(pos.y - 10, 0) })); // Move up
      }
      if (data.Theta.power > 200000) {
        setPosition((pos) => ({ x: Math.max(pos.x - 10, 0), y: pos.y })); // Move left
      }
      if (data.Alpha.power > 200000) {
        setPosition((pos) => ({ x: Math.min(pos.x + 10, canvasWidth - boxSize), y: pos.y })); // Move right
      }
      if (data.Beta.power > 100000) {
        setPosition((pos) => ({ x: pos.x, y: Math.min(pos.y + 10, canvasHeight - boxSize) })); // Move down
      }
    };

    const ws = new WebSocket('ws://localhost:8000/ws/eeg');
    ws.onmessage = handleBrainwaveData;

    return () => {
      ws.close();
    };
  }, [position]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} style={{ textAlign: 'center' }}>
        <h1>Training</h1>
        <p>Move the character using your brainwaves.</p>
        <canvas id="gameCanvas" width={canvasWidth} height={canvasHeight} style={canvasStyle}></canvas>
        <Box mt={2}>
          <h2>Instructions</h2>
          <ul>
            <li>Focus on different tasks to move the character:</li>
            <li>Delta (Deep focus or relaxation): Move up (Power &gt; 1000000)</li>
            <li>Theta (Light relaxation): Move left (Power &gt; 200000)</li>
            <li>Alpha (Awake but relaxed): Move right (Power &gt; 200000)</li>
            <li>Beta (Active thinking): Move down (Power &gt; 100000)</li>
            <li>Try to balance your brain activity to control the character effectively.</li>
          </ul>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Realtime />
      </Grid>
    </Grid>
  );
};

export default Training;
