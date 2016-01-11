/**
 * updateKeywordsUrlFromAds.js
 *
 * This script works great for those who are using DoubleClick Search
 * and are used to updating url at ad level rather than at keyword level.
 * It will sync in the same matter as DoubleClick does the first time you
 * add a new keyword without any final url.
 *
 * In case you have keywords with a final url you do not want to change or
 * you are running a landing page test apply the label "kw-ds-manual" to 
 * those keywords. The label will be created the first time you run the script.
 * You could also create it yourself if you have keywords you do not want to edit
 * during the first run.
 *
 * The script can handle up to ~10.000 keyword per account.
 *
 * @TODO 
 *  - increase the amount of keyword that can be processed 
 */


var ACCOUNTS_ID = ['123-456-7890','111-222-3334'];
var LABEL = 'kw-ds-manual';

function main() {
    var accountSelector = MccApp.accounts().withIds(ACCOUNTS_ID);
    accountSelector.executeInParallel('processKeywords');
}

function processKeywords() {
    var clientAccount = AdWordsApp.currentAccount();

    createLabelIfItNotExsist(
        LABEL,
        'Use this labels on keywords where you dont want the script to overwrite the url with url from ads.',
        '#AB2C35'
    );

    var keywordSelector = AdWordsApp.keywords()
        .withCondition('FinalUrls CONTAINS_IGNORE_CASE "http"')
        .withCondition('LabelNames CONTAINS_NONE ["kw-ds-manual"]')
        .withCondition('Status = ENABLED')
    var keywordIterator = keywordSelector.get();
    while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        var adGroup = keyword.getAdGroup();
        var ad = adGroup.ads().withCondition('Status = ENABLED').get().next();
        var adUrl = ad.urls().getFinalUrl();
        var keywordUrl = keyword.urls().getFinalUrl();
        if(adUrl.toLowerCase() == keywordUrl.toLowerCase()) { continue; }
        keyword.urls().setFinalUrl(adUrl)
    }

    Logger.log('Process completed for ' + clientAccount.getName())
}

function createLabelIfItNotExsist(label,labelDescription,labelColor) {
    if( ! labelExists(label)) {
        AdWordsApp.createLabel(label,labelDescription,labelColor);
        _tmpLabels.push(label)
    }
}

function labelExists(label) {
    if ( _tmpLabels.indexOf(label) > -1) return true
    var labelExist = AdWordsApp.labels()
        .withCondition("Name = '" + label + "'")
        .get()
        .hasNext()
    if (labelExist) {
        _tmpLabels.push(label)
        return true
    }
  return false
}

var _tmpLabels = (function(){
    var labels = []
    var labelIterator = AdWordsApp.labels().get()
    while(labelIterator.hasNext()) {
        labels.push(labelIterator.next().getName())
    }
    return labels;
})();