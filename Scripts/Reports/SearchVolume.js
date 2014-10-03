/**
 * Total Search Volume for your Exact Match Keywords
 *
 * The total search volume is based on your 
 * impressions / impression share | (e.g. 1000/0.25)
 *
 * @source
 * https://github.com/kaugesaar/adwords-scripts
 * 
 */

// Enter your email address
var email = ''; 

// Style your report with a logo
var logo_img_url = 'http://kaugesaar.se/ryan-meme/ryan-meme-' + Math.floor((Math.random() * 10) + 1) +'.jpg';

// Where should your logo link to?
var logo_href_url = 'http://kaugesaar.se/';

var impressionThreshold = 100;
var date = 'LAST_30_DAYS';

function main() {

    if( ! email) { Logger.log('Error: Enter your email address in the config variables.'); return }

    var result = getKeywordPerformanceReport();

    var subject = "Search Volume Report - " + Utilities.formatDate(new Date(), "GMT+2", "yyyy-MM-dd");
    var html = htmlReport(result);

    var img = UrlFetchApp
                .fetch(logo_img_url)
                .getBlob()
                .setName("logo");

    MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: html,
        inlineImages:
        {
            logo: img,
        }
    });

    Logger.log('Success: Email was sent.');
}

function htmlReport(result) {

    result.sort((function(index){
        return function(a, b) {
            return (a[index] === b[index] ? 0 : (a[index] > b[index] ? -1 : 1));
        };
    })('search_volume'));

    var totals = [0,0,0,0,0];

    var html = '<html>';
        html += '<body style="background:#e7e7e7; font-family:Helvetica Neue,Helvetica,Arial,sans-serif; padding-top: 15px;">';
        html += '<p style="text-align:center;"><a href="' + logo_href_url + '"><img src="cid:logo" style="max-height:180px;"></a>';
        html += '<h1 style="text-align:center;color: #fff;font-size: 29px;background: #3B9471;padding: 15px;margin: 15px auto;width: 450px;">Search Volume Report</h1>';
        html += '<hr style="min-height:0;margin-bottom:21px;border:0;border-top: 1px solid #D6D6D6;border-bottom: 1px solid #F1F1F1;">';
        html += '<p style="text-align:center;"><strong>Settings</strong> | During: ' + date + ' | Impressions Threshold: '+ impressionThreshold + '</p>';
        html += '<table style="font-size:13px;padding:15px;margin:15px auto;background:#fff;border-spacing:0;box-shadow: 0px 1px 3px #A2A2A2";>';
        html += '<thead style="text-align:left; padding-bottom:5px; border-bottom:1px solid #ddd;">';
        html += '<tr>';
        html += '<th style="border-bottom: 2px  solid #ccc;padding: 7px;">Keyword</th>' +
                '<th style="border-bottom: 2px  solid #ccc;padding: 7px;">Search Volume</th>' +
                '<th style="border-bottom: 2px  solid #ccc;padding: 7px;">Clicks</th>' +
                '<th style="border-bottom: 2px  solid #ccc;padding: 7px;">Impression Share</th>' +
                '<th style="border-bottom: 2px  solid #ccc;padding: 7px;">Click Reach</th>' +
                '<th style="border-bottom: 2px  solid #ccc;padding: 7px;">Campagin</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
    
    for(i in result) 
    {

        var bgcolor = (i % 2) ? 'f7f7f7' : '';

        html += '<tr style="background:#' + bgcolor + ';">' +
                    '<td style="border-bottom: 1px  solid #ddd;padding: 7px;">'+ result[i].keyword + '</td>' +
                    '<td style="border-bottom: 1px  solid #ddd;padding: 7px;">'+ Math.round(result[i].search_volume) + '</td>' +
                    '<td style="border-bottom: 1px  solid #ddd;padding: 7px;">'+ result[i].clicks + '</td>' +
                    '<td style="border-bottom: 1px  solid #ddd;padding: 7px;">'+ (result[i].impression_share*100).toFixed(2) + '%</td>' +
                    '<td style="border-bottom: 1px  solid #ddd;padding: 7px;">'+ (result[i].reach*100).toFixed(2)  + '%</td>' +
                    '<td style="border-bottom: 1px  solid #ddd;padding: 7px;">'+ result[i].origin + '</td>' +
                '</tr>';
    }

    for(i in result)
    {
        totals[0] += result[i].search_volume;  
        totals[1] += parseFloat(result[i].clicks); 
        totals[2] += parseFloat(result[i].impressions);
    }

    totals[3] = totals[2]/totals[0];
    totals[4] = totals[1]/totals[0];

        html += '<tr style="background: #50AD88;color: #E9FFF4;">' +
                    '<td style="border-top: 2px  solid #197943;padding: 7px;">Totals:</td>' +
                    '<td style="border-top: 2px  solid #197943;padding: 7px;">'+ Math.round(totals[0]) + '</td>' +
                    '<td style="border-top: 2px  solid #197943;padding: 7px;">'+ Math.round(totals[1]) + '</td>' +
                    '<td style="border-top: 2px  solid #197943;padding: 7px;">'+ (totals[3]*100).toFixed(2) + '%</td>' +
                    '<td style="border-top: 2px  solid #197943;padding: 7px;">'+ (totals[4]*100).toFixed(2) + '%</td>' +
                    '<td style="border-top: 2px  solid #197943;padding: 7px;"></td>' +
                '</tr>';

        html += '</tbody>';
        html += '</table>';
        html += '<p style="text-align: center; padding-bottom: 15px;"><small>Want more scripts? Checkout <a href="https://github.com/kaugesaar/adwords-scripts">kaugesaar/adwords-scripts@github</a>.</small></p>';
        html += '</body>';
        html += '</html>';

    return html;    
}


function getKeywordPerformanceReport() {
    var options = {includeZeroImpressions: false};
    var cols = ['KeywordMatchType', 'KeywordText', 'Impressions', 
                'Clicks', 'SearchImpressionShare', 'CampaignName'];
    var report = 'KEYWORDS_PERFORMANCE_REPORT';
    var query = ['select', cols.join(','), 'from', report,
        'where Impressions >= ', impressionThreshold,
        'and KeywordMatchType = EXACT',
        'DURING', date].join(' ');
    var result = [];
    var report = AdWordsApp.report(query, options).rows();



    while (report.hasNext()) 
    {
        var row = report.next();
      
        var keyword = row.KeywordText;
        var impressions = row.Impressions;
        var impressionShare = row.SearchImpressionShare;
        
        var searchVolume = impressions / (parseFloat(impressionShare) / 100.0);

        if(isNaN(searchVolume)) continue;

        result.push({
            'search_volume': searchVolume,
            'keyword': keyword,
            'clicks': row.Clicks,
            'impressions': impressions,
            'impression_share': parseFloat(impressionShare) / 100.0,
            'reach':  row.Clicks / searchVolume,
            'origin': row.CampaignName
        });


    }

    return result;

}