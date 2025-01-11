function getScheduledEvents() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('helper');
  var range = sheet.getRange(1,1,sheet.getLastRow(),1);
  var values = range.getValues();

  return values;
}

function logStart(task) {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Record');

  var lastUnfilledColData = sheet.getRange(1,1,3,sheet.getLastColumn()).getValues()
  var lastUnfilledCol1 = lastUnfilledColData[0].filter((content) => content != "").length + 1;
  var lastUnfilledCol2 = lastUnfilledColData[1].filter((content) => content != "").length + 1;
  var lastUnfilledCol3 = lastUnfilledColData[2].filter((content) => content != "").length + 1;
  
  if(lastUnfilledCol1 == lastUnfilledCol2 && lastUnfilledCol1 == lastUnfilledCol3) {
    now = new Date().toLocaleTimeString();
    sheet.getRange(1,lastUnfilledCol1,2,1).setValues([[task],[now]]);
  } 
}

function logEnd() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Record');

  var lastUnfilledColData = sheet.getRange(1,1,3,sheet.getLastColumn()).getValues()
  var lastUnfilledCol1 = lastUnfilledColData[0].filter((content) => content != "").length + 1;
  var lastUnfilledCol2 = lastUnfilledColData[1].filter((content) => content != "").length + 1;
  var lastUnfilledCol3 = lastUnfilledColData[2].filter((content) => content != "").length + 1;

  if(lastUnfilledCol1 == lastUnfilledCol3+1 && lastUnfilledCol2 == lastUnfilledCol3+1) {
    now = new Date().toLocaleTimeString();
    sheet.getRange(3,lastUnfilledCol3).setValue([[now]]);
  }
}