function getCalSelect() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Cal Select');
  var calendars = CalendarApp.getAllCalendars();
  var names = [];
  var colors = [];
  var ids = [];

  for (var i = 0; i < calendars.length; i++) {
    names.push([calendars[i].getName()]);
    colors.push([calendars[i].getColor()])
    ids.push([calendars[i].getId()]);
  }

  sheet.getRange(2,4,calendars.length,1)
    .setValues(names)
    .setBackgrounds(colors)
  sheet.getRange(2,3,calendars.length,1).setValues(ids);
}


function selectImports() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Cal Select');
  var ids = [];

  for (var row = 2; row <= sheet.getLastRow(); row++) {
    var select = sheet.getRange(row,1).getValue();
    var id = sheet.getRange(row,3).getValue();

    if (select) {
      ids.push(id);
    }
  }

  return ids;
}