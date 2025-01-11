function runningRecord() {
  var sourceSheet = SpreadsheetApp.openById("1JIEtUBKP6ne8pbiUBEBHNEaa74n1OapF1NZx6v8UjEI").getSheetByName("Record");
  var sourceSheetDataCols = sourceSheet.getMaxColumns()-1;
  var sourceRange = sourceSheet.getRange(1,2,3,sourceSheetDataCols);
  var sourceValues = sourceRange.getValues();

  var targetSheet = SpreadsheetApp.openById("1IsTvucBDsE6pC-4w2peCjrsb4Zpy0kdF0TdMJ2G2Sg4").getSheetByName("Daily Data");
  var targetRange = targetSheet.getRange(1,1,3,sourceSheetDataCols);

  targetRange.setValues(sourceValues);
}
