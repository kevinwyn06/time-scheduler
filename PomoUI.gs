// creates a custom menu when the spreadsheet is opened
function onAnOpen() {
var ui = SpreadsheetApp.getUi()
    .createMenu('Pomodoro')
    .addItem('Open Pomodoro','openPomodoroTimer')
    .addToUi();
  openPomodoroTimer();
}

// opens the sidebar app
function openPomodoroTimer() {
  var html = HtmlService.createTemplateFromFile('PomHTML') 
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle("Pomodoro");

  SpreadsheetApp.getUi()
    .showSidebar(html);
}

function alert() {
  openUrl('https://www.youtube.com/watch?v=T4SimnaiktU&pp=ygUM5YWJ5bm05LmL5aSW');
}

function openUrl( url ){
  var html = HtmlService.createHtmlOutput('<html><script>'
  +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
  +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
  +'if(document.createEvent){'
  +'  var event=document.createEvent("MouseEvents");'
  +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
  +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
  +'}else{ a.click() }'
  +'close();'
  +'</script>'
  // Offer URL as clickable link in case above code fails.
  +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
  +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
  +'</html>')
  .setWidth( 90 ).setHeight( 1 );
  SpreadsheetApp.getUi().showModalDialog( html, "Opening ..." );
}