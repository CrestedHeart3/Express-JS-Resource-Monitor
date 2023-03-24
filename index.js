<html>
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
</html>
