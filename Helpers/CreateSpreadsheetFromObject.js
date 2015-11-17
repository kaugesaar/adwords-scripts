/**
 * Creates a Google Spreadsheet from an object.
 * Object-keys will become the column names.
 */
var createSpreadsheetFromObject = function (data){

    var spreadsheet = SpreadsheetApp.create('Negative JS - Report');
    var sheet = spreadsheet.getActiveSheet();

    var sheetData = [];
    var headerRow = [];
        headerRow.push(Object.keys(data[0]));
  
    for (i in data) 
    {   
        var row = Object.keys(data[i]).map(function(k) { return data[i][k] });
        sheetData.push(row);
    }
            
    var cols = sheetData[0].length;
    var rows = sheetData.length;
     
    sheet.getRange(1, 1, 1, cols).setValues(headerRow);
    sheet.getRange(2, 1, rows, cols).setValues(sheetData);

    Logger.log('Spreadsheet created, access it here: ' + spreadsheet.getUrl())

}