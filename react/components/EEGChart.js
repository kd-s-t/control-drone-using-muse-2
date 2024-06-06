import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const EEGChart = ({ eegData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && !chartInstanceRef.current) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: Array(100).fill(''), // Adjust as needed
          datasets: [
            {
              label: 'Delta',
              data: eegData.Delta.power,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
            },
            {
              label: 'Theta',
              data: eegData.Theta.power,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: false,
            },
            {
              label: 'Alpha',
              data: eegData.Alpha.power,
              borderColor: 'rgba(255, 206, 86, 1)',
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              fill: false,
            },
            {
              label: 'Beta',
              data: eegData.Beta.power,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            },
            {
              label: 'Gamma',
              data: eegData.Gamma.power,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              fill: false,
            },
          ],
        },
      });
    } else if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = Array(100).fill(''); // Adjust as needed
      chartInstanceRef.current.data.datasets.forEach((dataset) => {
        dataset.data = eegData[dataset.label].power;
      });
      chartInstanceRef.current.update();
    }
  }, [eegData]);

  return <canvas ref={chartRef}></canvas>;
};

export default EEGChart;
