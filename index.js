const express = require('express');
const os = require('os');

const app = express();

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(`<html>
  <head>
     <title>System Usage</title>
     <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
     <style>#myChart {display: block; margin: 0 auto;}body {display: flex; background: #435165; justify-content: center;align-items: center;}.card {color: black; background: white; min-width: 60%; max-width: 70%; padding: 10px;} h1 {font-size: 32px;font-weight: bold;text-align: center;} #cpu #memory { text-align: center; } p{font-size: 24px;text-align: center;margin: 10px 0;}</style>
     <div class="card">
        <h1>CPU and Memory Usage</h1>
        <canvas id="myChart" width="700%" height="400"></canvas>
     </div>
     <script>const ctx = document.getElementById("myChart").getContext("2d");
        const labels = [];
        const cpuData = [];
        const memoryData = [];
        var uptime = "";
        const chart = new Chart(ctx, {
        type: "line",
          data: {
            labels: labels,
            datasets: [{
              label: "CPU Usage (%)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              data: cpuData,
              fill: false
            }, {
              label: "Memory Usage (MB)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              data: memoryData,
              fill: false
            }]
          },
          options: {
            animation: false,
            responsive: false,
            scales: {
              yAxes: [{
                ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
          setInterval(() => {
            fetch("/usage").then(response => response.json()).then(data => {
              uptime = data.uptime;
              labels.push(new Date().toLocaleTimeString());
              cpuData.push(data.cpuUsage.toFixed(2));
              memoryData.push((data.usedMem / 1024 / 1024).toFixed(2));
              if (labels.length > 15) {
                labels.shift();
                cpuData.shift();
                memoryData.shift();
              }
              chart.update();
            });
          }, 1000);
       </script>
    </body>
  </html>`);
  res.end();
});


app.get('/usage', (req, res) => {
  const numCPUs = os.cpus().length;
  const cpuUsage = os.loadavg()[0] / numCPUs / 2;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const uptime = os.uptime()
  const usedMem = totalMem - freeMem;
  const data = {
    cpuUsage: cpuUsage * 100,
    totalMem: totalMem,
    usedMem: usedMem,
    uptime: uptime,
  };
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

function updateChart(cpuUsage) {
  const chart = document.getElementById('chart').getContext('2d');
  const data = {
    labels: [],
    datasets: [{
      label: 'CPU Usage',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };
  if (chart.data) {
    data.labels = chart.data.labels.slice(-9);
    data.datasets[0].data = chart.data.datasets[0].data.slice(-9);
  }
  data.labels.push('');
  data.datasets[0].data.push(cpuUsage.toFixed(2));
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false,
          suggestedMax: 100
        }
      }]
    }
  };
  chart.data = data;
  chart.options = options;
  chart.update();
}
