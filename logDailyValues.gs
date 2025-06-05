function logDailyValues() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const mainSheet = spreadsheet.getSheetByName(${SHEET_NAME});
  let logSheet = spreadsheet.getSheetByName(${LOG_SHEET_NAME});
  
  if (!logSheet) {
    logSheet = spreadsheet.insertSheet(${LOG_SHEET_NAME});
    logSheet.appendRow(["Date", "Current Value", "Invested Value", "", "Date", "Current Total Value", "Invested Total Value"]);
  }

  const chartPositionRow = 13; 
  const chartPositionCol = 2;  

  const currentValue = mainSheet.getRange("F3").getValue(); //CELL VALUES
  const investedValue = mainSheet.getRange("C3").getValue();
  const today = new Date();
  const formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const cutoffDate = new Date(2025, 11, 31);

  if (today > cutoffDate) {
    Logger.log("Function execution stopped: Date exceeds 31st Dec 2025.");
    return;
  }

  const dataA = logSheet.getRange("A:A").getValues().flat();
  const lastUpdatedRowA = dataA.findLastIndex(value => value !== "") + 1; // Get last non-empty row in column A
  const nextRowA = Math.max(lastUpdatedRowA + 1, 2); 

  const existingFormattedDates = dataA
    .filter(value => value !== "")
    .map(date => date instanceof Date ? Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd") : date);

  if (existingFormattedDates.includes(formattedDate)) {
    Logger.log("Data for today is already logged in column A.");
    return;
  }

  if (nextRowA > 2) {
    const formatRange = logSheet.getRange(`A${nextRowA - 1}:C${nextRowA - 1}`);
    const newFormatRange = logSheet.getRange(`A${nextRowA}:C${nextRowA}`);
    formatRange.copyTo(newFormatRange, { formatOnly: true });
  }

  logSheet.getRange(nextRowA, 1, 1, 3).setValues([[formattedDate, currentValue, investedValue]]);
  Logger.log(`Logged daily values: Date=${formattedDate}, Current Value=${currentValue}, Invested Value=${investedValue}`);

  updateChart(mainSheet, logSheet, chartPositionRow, chartPositionCol);
}