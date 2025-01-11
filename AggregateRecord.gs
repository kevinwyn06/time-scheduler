function dailyRecord() {
  var sourceSheet = SpreadsheetApp.openById("1JIEtUBKP6ne8pbiUBEBHNEaa74n1OapF1NZx6v8UjEI").getSheetByName("Record");
  var sourceSheetDataCols = sourceSheet.getMaxColumns()-1;
  var sourceRange = sourceSheet.getRange(1,2,3,sourceSheetDataCols);
  var sourceValues = sourceRange.getValues();

  var targetSheet = SpreadsheetApp.openById("1IsTvucBDsE6pC-4w2peCjrsb4Zpy0kdF0TdMJ2G2Sg4").getSheetByName("Import");
  var targetSheetNextRow = targetSheet.getLastRow()+1;
  var targetRange = targetSheet.getRange(targetSheetNextRow,3,3,sourceSheetDataCols);

  if (!sourceValues[0][0] == "") {
    targetRange.setValues(sourceValues);
    sourceRange.setValue(null);

    var day = new Date();
    targetSheet.getRange(targetSheetNextRow,1,3,2).setValues([[day, day],[day, day],[day,day]]);
  }
}