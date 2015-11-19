/**
 *  CampaignEndDate - find or filter out
 *  campaign which are enabled but have ended.
 *
 *  https://groups.google.com/forum/#!topic/adwords-scripts/Xnn3jR65YcI
 */

function main() {
    var campaignIterator = AdWordsApp.campaigns()
        .withCondition('Status = "ENABLED"')
        .get();

    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        var endDate = campaign.getEndDate();
      
        if(endDate != null && DATE.year > endDate.year && DATE.month > endDate.month && DATE.day > endDate.day) { continue; }
      
        // From here you can do what you want with campaigns which hasn't ended.

    }

}

var DATE = (function () {
    var d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()}
})();