function taskEndTime() {
  var sheetName = "规划";
  var startColumn = "CI";
  var startColumnNumner = 86; // the same as CH
  var endColumn = "DI";
  var conditionalRowNumber = 5;
  var targetRowNumber = 3;
  var checkRowNumber = 1;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  var conditionalRange = sheet.getRange(startColumn + conditionalRowNumber + ":" + endColumn + conditionalRowNumber);
  var conditionalValues = conditionalRange.getValues();

  var targetRange = sheet.getRange(startColumn + targetRowNumber + ":" + endColumn + targetRowNumber);
  var targetValues = targetRange.getValues();

  var checkRange = sheet.getRange(startColumn + checkRowNumber + ":" + endColumn + checkRowNumber);
  var checkValues = checkRange.getValues();

  var currentTime = new Date();

  for (var i = 0; i < conditionalValues[0].length; i++) {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    if (checkValues[0][i] == "") {
      break;
    }
    
    if (conditionalValues[0][i] == false) {
      targetValues[0][i] = time;
    }
  }
  targetRange.setValues(targetValues);
}