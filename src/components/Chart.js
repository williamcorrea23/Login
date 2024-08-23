// src/components/Chart.js
import React, { useEffect } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Chart = () => {
  useEffect(() => {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: ['Linguagens', 'Matemática', 'C. Humanas', 'C. Natureza', 'Redação'],
        datasets: [
          {
            label: 'Acertos',
            data: [12, 19, 3, 5, 2],
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
          },
          {
            label: 'Erros',
            data: [2, 3, 20, 5, 1],
            backgroundColor: 'rgba(244, 67, 54, 0.8)',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return <canvas id="scoreChart"></canvas>;
};

export default Chart;
