function updateChart(mainSheet, logSheet, chartPositionRow, chartPositionCol) {
  const lastRow = logSheet.getLastRow();
  if (lastRow < 2) return; // Avoid charting if no data is logged

  const tableRange = logSheet.getRange(`A1:C${lastRow}`);
  const values = logSheet.getRange(`B2:C${lastRow}`).getValues().flat(); // Get all numeric values
  const minValue = Math.min(...values.filter(v => typeof v === 'number' && v > 0)); // Find minimum positive value

  
  const charts = mainSheet.getCharts();
  charts.forEach(chart => {
    const pos = chart.getContainerInfo().getAnchorRow();
    const col = chart.getContainerInfo().getAnchorColumn();
    if (pos === chartPositionRow && col === chartPositionCol) {
      mainSheet.removeChart(chart);
    }
  });

  
  const chart = mainSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(tableRange)
    .setOption('title', 'MF Invested vs Current')
    .setOption('hAxis', { format: 'MMM', title: 'Month', gridlines: { count: -1 } })
    .setOption('vAxis', { minValue: minValue, title: 'Values (₹)', format: '₹#,##0' }) // Start from minimum value
    .setOption('curveType', 'function')
    .setOption('legend', { position: 'bottom' })
    .setOption('series', [
      { labelInLegend: "Current Value", color: '#4285F4', pointSize: 5, dataLabel: { fontSize: 10 } }, // Current Value
      { labelInLegend: "Invested Value", color: '#EA4335', pointSize: 5, dataLabel: { fontSize: 10 } }  // Invested Value
    ])
    .setPosition(chartPositionRow, chartPositionCol, 0, 0) // Ensure chart is positioned only in column B
    .build();

  mainSheet.insertChart(chart);
}