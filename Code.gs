const spreadSheetName = "规划"

// creates a custom menu when the spreadsheet is opened
function onAnOpen() {
var ui = SpreadsheetApp.getUi()
    .createMenu('Notifications')
    .addItem('Open Notifications', 'openCallNotifier')
    .addToUi();
  openCallNotifier();
}

// opens the sidebar app
function openCallNotifier() {
  var html = HtmlService.createTemplateFromFile('Page') 
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle("Task Notifications");

  SpreadsheetApp.getUi()
    .showSidebar(html);
}

// returns a list of values in some column
function getColumn(rowStart, columnStart) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(spreadSheetName);

  // get the values in column and turn the rows into a single values
  return sheet.getRange(rowStart, columnStart, sheet.getLastRow(), 1).getValues().map(function (row) { return row[0]; });
}

// marks tasks as complete so alarm doesn't trigger a second time
function resetValue(rowNum, column) {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(spreadSheetName).getRange(column + rowNum).setValue(1);
}

// generates a popup and offers button for pausing audio
function popup(message) {
  var result = SpreadsheetApp.getUi().alert(message);
  if(result === SpreadsheetApp.getUi().Button.OK) {
    return 1;
  }
}