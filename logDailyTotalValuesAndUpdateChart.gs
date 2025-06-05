function logDailyTotalValuesAndUpdateChart() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const mainSheet = spreadsheet.getSheetByName(${SHEET_NAME});
  let logSheet = spreadsheet.getSheetByName(${LOG_SHEET_NAME});

  if (!logSheet) {
    logSheet = spreadsheet.insertSheet(${LOG_SHEET_NAME});
    logSheet.appendRow(["Date", "Current Value", "Invested Value", "", "Date", "Current Total Value", "Invested Total Value"]);
  }

  const today = new Date();
  const formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const cutoffDate = new Date(2025, 11, 31)

  if (today > cutoffDate) {
    Logger.log("Function execution stopped: Dat exceeds 31st Dec 2025.");
    return;
  

  const currentTotalValue = mainSheet.getRange("F9").getValue(); //CELL VALUES
  const investedTotalValue = mainSheet.getRange("C9").getValue();

  const dataE = logSheet.getRange("E:E").getValues().flat();
  const lastUpdatedRowE = dataE.findLastIndex(value => value !== "") + 1;
  const newRowE = Math.max(lastUpdatedRowE + 1, 7);

  const existingFormattedDates = dataE
    .filter(value => value !== "")
    .map(date => date instanceof Date ? Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd") : date);

  if (existingFormattedDates.includes(formattedDate)) {
    Logger.log("Total values for today are already logged in column E.");
    return;
  }

  if (newRowE > 7) {
    const formatRange = logSheet.getRange(`E${newRowE - 1}:G${newRowE - 1}`);
    const newFormatRange = logSheet.getRange(`E${newRowE}:G${newRowE}`);
    formatRange.copyTo(newFormatRange, { formatOnly: true });
  }

  logSheet.getRange(newRowE, 5, 1, 3).setValues([[formattedDate, currentTotalValue, investedTotalValue]]);
  
  Logger.log(`Logged total values: Date=${formattedDate}, Current Total Value=${currentTotalValue}, Invested Total Value=${investedTotalValue}`);

  updateTotalChart(mainSheet, logSheet, 13, 4);
}