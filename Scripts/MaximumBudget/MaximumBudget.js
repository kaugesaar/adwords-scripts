function main() {
  var labels = getAllBudgetLabels();

  parseCampaignBudgets(labels,'videoCampaigns')
  parseCampaignBudgets(labels,'campaigns')
  parseCampaignBudgets(labels,'shoppingCampaigns')
}

function getMaxSpendFromLabel(label) {
  return parseInt(label.getName().replace('budget::',''));
}

function getAllBudgetLabels() {
  var labels = [];
  var labelsIterator = AdWordsApp.labels()
    .withCondition('Name STARTS_WITH "budget::"')
    .get();

  while(labelsIterator.hasNext()) {
    labels.push(labelsIterator.next().getName());
  }

  return labels;
}

function parseCampaignBudgets(labelNames, functionName) {
  var campaignsIterator = AdWordsApp[functionName]()
      .withCondition("LabelNames CONTAINS_ANY ['"+ labelNames.join("','") +"']")
      .withCondition('Status = ENABLED')
      .get();

  while(campaignsIterator.hasNext()) {
    var campaign = campaignsIterator.next();
    var campaignCost = campaign.getStatsFor('ALL_TIME').getCost();
    var campaignBudget = getMaxSpendFromLabel(campaign.labels()
      .withCondition('Name STARTS_WITH "budget::"')
      .get().next());

    if(campaignCost >= campaignBudget) {
      Logger.log('%s: has spent %s and have a total budget of %s, pausing campaign!', 
        campaign.getName(), campaignCost, campaignBudget)
      campaign.pause();
    }

  }
}