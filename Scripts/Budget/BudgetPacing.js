/**
 * BudgetPacing.js
 * 
 */

// Copy this spreadsheet
// enter the id of your new and edited sheet here
var SPREADSHEET_ID = '';


var REPORT_DATA = [];
var SELECT = ['Cost','CampaignName','AccountDescriptiveName','SearchImpressionShare','Impressions','Clicks','Date'];
var FROM = 'ACCOUNT_PERFORMANCE_REPORT';
var DATE = (function() {
    var y, m, d, z;
    z = new Date();
    y = '' + z.getFullYear();
    m = (z.getMonth() + 1 > 9 ) ? '' + (z.getMonth() + 1) : '0' + (z.getMonth() + 1);
    d = (z.getDate() - 1 > 9) ? '' + (z.getDate() - 1) : '0' + (z.getDate() - 1);;

    return y + m + '01,' + y + m + d;
    
})();
