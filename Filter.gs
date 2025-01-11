function filterSortTimePositive() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Schedule');
  let filter = sheet.getFilter();
  const criteria1 = SpreadsheetApp.newFilterCriteria()
                             .whenNumberGreaterThan(0)
                             .build();
  filter
    .setColumnFilterCriteria(8, criteria1)
    .sort(3,true);
  const criteria2 = SpreadsheetApp.newFilterCriteria()
                             .whenCellNotEmpty()
                             .build();
  filter
    .setColumnFilterCriteria(6, criteria2)
    }

function removeAllCriteria() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Schedule');
  let filter = sheet.getFilter();
  let maxCols = sheet.getMaxColumns();
  for (var i = 1; i <= maxCols; i++) {
    filter.removeColumnFilterCriteria(i);
  }
}