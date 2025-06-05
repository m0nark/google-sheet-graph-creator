function updateTotalChart(mainSheet, logSheet, chartPositionRow, chartPositionCol) {
  const lastRow = logSheet.getLastRow();
  if (lastRow < 7) return; 

  
  const dataRange = logSheet.getRange(`E2:G${lastRow}`);
  const totalValues = logSheet.getRange(`F2:G${lastRow}`).getValues().flat();

  
  const minValue = Math.min(...totalValues.filter(v => typeof v === 'number' && v > 0));

  
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
    .addRange(dataRange)
    .setOption('title', 'Total Invested vs Current Value')
    .setOption('hAxis', { format: 'MMM', title: 'Month', gridlines: { count: -1 } })
    .setOption('vAxis', { minValue: minValue, title: 'Values (₹)', format: '₹#,##0' }) // Start from the lowest of both values
    .setOption('curveType', 'function')
    .setOption('legend', { position: 'bottom' })
    .setOption('series', {
      0: { labelInLegend: "Current Total Value", color: '#4285F4', pointSize: 5 },
      1: { labelInLegend: "Invested Total Value", color: '#EA4335', pointSize: 5 }
    })
    .setPosition(chartPositionRow, chartPositionCol, 0, 0) // Row 13, Column D
    .build();

  mainSheet.insertChart(chart);
  Logger.log("Chart updated successfully in column D.");
}
