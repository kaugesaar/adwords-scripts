/**
 *  AutoLabels as solution to an question
 *  over at the AdWords Scripts Google group
 *  
 *  https://groups.google.com/forum/#!topic/adwords-scripts/yFcXYlH2mV8
 */

var SEPARATOR = '|' // define which sperator you have
var CATEGORY_PREFIX = true // change this if you want a prefix or not

function main() {

  // Here you probably want to edit yourself
  var campaigns = AdWordsApp.campaigns()
    .forDateRange("ALL_TIME")
    .withCondition("Name CONTAINS '"+ SEPARATOR +"'")
    .withCondition("Impressions > 1")
    .get()

  while (campaigns.hasNext()) {
    var campaign = campaigns.next()
    var labelsToApply = [];

     // We split the campaign name as definied by SEPARATOR
     // note that we also make them lower case and trim whitespace
    var labels = campaign.getName()
      .toLowerCase()
      .split(SEPARATOR)
      .map(Function.prototype.call, String.prototype.trim)

    for (var i = 0; i < labels.length; i++) {

      var label = (CATEGORY_PREFIX) ? "Category " + (i + 1) + " - " + labels[i] : labels[i]

      if( ! labelExists(label)) {
        AdWordsApp.createLabel(label)
        _tmpLabels.push(label)
      }
      if( ! campaignHasLabel(campaign, label) ) {
        labelsToApply.push(label)
      }
    }

    for (var i = 0; i < labelsToApply.length; i++) {
      var label = labelsToApply[i]
      campaign.applyLabel(label)
    }
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

function campaignHasLabel(campaign, label) {

  return campaign.labels()
    .withCondition("Name = '" + label + "'")
    .get()
    .hasNext()
}

// Don't remove this one, it speed things up
var _tmpLabels = (function(){
  var labels = []
  var labelIterator = AdWordsApp.labels().get()
  while(labelIterator.hasNext()) {
    labels.push(labelIterator.next().getName())
  }
  return labels;
})();
