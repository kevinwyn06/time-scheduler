function export_select_gcals_to_gsheet(){
  // variables
  var ids = selectImports();
  var cals = [];

  // ensures nothing is being filtered
  removeAllCriteria();
  console.log("removed all criteria")

  // save planned time for current sheet contents to gcal description
  exportSheetsTimeToGcal();
  console.log("exported sheets time to gcal")

  // gets new sheet contents from gcal, including old planned times
  for (var i = 0; i < ids.length; i++) {
    var cal = CalendarApp.getCalendarById(ids[i]);
    cals.push(cal);
  }
  console.log("got calendar IDs")

  // clear current sheet contents
  clear();
  console.log("cleared sheet")

  // imports new sheet contents from gcal, including old planned times
  export_gcal_to_gsheet(cals); 
  console.log("done")
}

function exportSheetsTimeToGcal() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Schedule');
  var dataRows = sheet.getLastRow() - sheet.getFrozenRows();
  var rowStart = sheet.getFrozenRows() + 1;

  if (dataRows > 0) {
    var cals = sheet.getRange(rowStart, 1, dataRows, 1).getValues();
    var eventIds = sheet.getRange(rowStart, 5, dataRows, 1).getValues();
    var rawTime = sheet.getRange(rowStart, 6, dataRows, 1).getValues();
    var checkExacts = sheet.getRange(rowStart, 7, dataRows, 1).getValues();
    
    var previousCalName = '';
    var cal = null;

    for (var i = 0; i < eventIds.length; i++) {
      try {
        var currentCalName = cals[i][0];

        if (currentCalName !== previousCalName) {
          cal = CalendarApp.getCalendarsByName(currentCalName)[0];
          previousCalName = currentCalName;
        }

        var event = cal.getEventById(eventIds[i][0]);
        console.log(event.getId());

        var curDescription = String(event.getDescription());
        var time = new Date(rawTime[i][0]);
        var checkExact = checkExacts[i][0];
        var eventStartTime = event.getStartTime();

        if (!isNaN(time)) {
          var hh = String(time.getHours()).padStart(2, '0');
          var mm = String(time.getMinutes()).padStart(2, '0');

          if (curDescription.startsWith("//planned-duration: ")) {
            curDescription = "//planned-duration: " + hh + ":" + mm + " " + checkExact + "\n\n" + curDescription.slice(29);
          } else {
            curDescription = "//planned-duration: " + hh + ":" + mm + " " + checkExact + "\n\n" + curDescription;
          }

          if (!event.isAllDayEvent) {
            var duration = time.getHours() * 60 * 60 * 1000 + time.getMinutes() * 60 * 1000; 
            var newEndTime = new Date(eventStartTime.getTime() + duration); 
            event.setTime(eventStartTime, newEndTime); 
          }
        } else {
          if (curDescription.startsWith("//planned-duration: ")) {
            curDescription = curDescription.slice(29);
          }
        }

        event.setDescription(curDescription);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

function export_gcal_to_gsheet(cals) {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Schedule');
  var startTime = sheet.getRange('B2').getValue();
  var endTime = sheet.getRange('D2').getValue();
  var rowStart = sheet.getFrozenRows() + 1;
  var entries = [];
  var colors = [];
  var adjusted_Spent_Time = [];
  var addedRecurringName = [];

  // add only the first occurrence of each recurring event
  for (var i = 0; i < cals.length; i++) {
    var cal = cals[i];
    var events = cal.getEvents(startTime, endTime);

    for (var j = 0; j < events.length; j++) {
      var e = events[j];
      console.log(e.getTitle());
      var eName = e.getTitle();
      if (e.isRecurringEvent() && !addedRecurringName.includes(eName)) {
        if (cal.getName() === "Timetable Classes" && e.getStartTime().toDateString() !== new Date().toDateString()) {
          continue;
        }
        addedRecurringName.push(eName);
        console.log(String(eName) + "pushed!");

        var desc = String(e.getDescription());
        var eventDesc = desc;
        var time = "";
        var checkExact = 0;

        if (desc.startsWith("//planned-duration: ")) {
          var hours = parseInt(desc.slice(20, 22));
          var minutes = parseInt(desc.slice(23, 25));
          time = (hours + minutes / 60) / 24;
          checkExact = parseInt(desc.slice(26, 27));
          eventDesc = desc.slice(29); // Adjust this slice to correctly capture the event description
        } else {
          if (cal.getName() === "Timetable Classes") {
            time = (e.getEndTime() - e.getStartTime()) / 1000 / 60 / 60 / 24;
            checkExact = 1;
          }
        }

        entries.push([cal.getName(), getWeekDay(e.getStartTime()), e.getStartTime(), e.getTitle(), e.getId(), time, checkExact]);
        colors.push([cal.getColor()]);
      }
    }
  }

  // add remaining events
  for (var i = 0; i < cals.length; i++) {
    var cal = cals[i];
    var events = cal.getEvents(startTime, endTime);

    for (var j = 0; j < events.length; j++) {
      var e = events[j];
      if (!e.isRecurringEvent()) {
        var desc = String(e.getDescription());
        var eventDesc = desc;
        var time = "";
        var checkExact = 0;

        if (desc.startsWith("//planned-duration: ")) {
          var hours = parseInt(desc.slice(20, 22));
          var minutes = parseInt(desc.slice(23, 25));
          time = (hours + minutes / 60) / 24;
          checkExact = parseInt(desc.slice(26, 27));
          eventDesc = desc.slice(29); // Adjust this slice to correctly capture the event description
        } else {
          if (cal.getName() === "Timetable Classes") {
            time = (e.getEndTime() - e.getStartTime()) / 1000 / 60 / 60 / 24;
          }
        }

        entries.push([cal.getName(), getWeekDay(e.getStartTime()), e.getStartTime(), e.getTitle(), e.getId(), time, checkExact]);
        colors.push([cal.getColor()]);
      }
    }
  }

  if (entries.length == 0) {
    return;
  }

  for (var i = 0; i < entries.length; i++) {
    var row = rowStart + i;
    adjusted_Spent_Time.push([
      "=IF(AND(ISBLANK(F" + row + "),ISBLANK(I" + row + ")),,IFERROR(IF(G" + row + "=1,F" + row + ",F" + row + "*($G$1-SUMPRODUCT($F$4:$F,$G$4:$G))/(SUM($F$4:$F)-SUMPRODUCT($F$4:$F,$G$4:$G)))-I" + row + ",))",
      "=IF(SUMIF('Record'!$B$1:$CT$1,D" + row + ", 'Record'!$B$4:$CT$4) <> 0, SUMIF('Record'!$B$1:$CT$1,D" + row + ", 'Record'!$B$4:$CT$4),)"
    ]);
  }

  sheet.getRange(rowStart, 3, entries.length, 1).setNumberFormat("mmm dd, yyyy");
  sheet.getRange(rowStart, 6, entries.length, 1).setNumberFormat("[hh]:mm");
  sheet.getRange(rowStart, 8, entries.length, 2).setNumberFormat("[hh]:mm");
  sheet.getRange(rowStart, 1, entries.length, 7).setValues(entries);
  sheet.getRange(rowStart, 8, entries.length, 2).setFormulas(adjusted_Spent_Time);
  sheet.getRange(rowStart, 1, entries.length, sheet.getLastColumn()).setBackground('#f5f5f5');
  sheet.getRange(rowStart, 1, entries.length, 1).setBackgrounds(colors);
}

function clear() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Schedule');
  var dataRows = sheet.getLastRow()-sheet.getFrozenRows();
  var startRow = sheet.getFrozenRows()+1;
  if (dataRows>0) {  
    var range = sheet.getRange(startRow,1,dataRows,sheet.getLastColumn());
    var eventRange = sheet.getRange(startRow,4,dataRows);
    range
      .setBackground("#f5f5f5")
      .setValue(null);
    eventRange.clearNote();
  }
}

function getWeekDay(date){
  var dayNumber = date.getDay();
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return days[dayNumber];
}