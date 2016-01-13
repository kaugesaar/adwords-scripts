/**
 * Shopping Search Query Suggestion
 *
 * Get keyword ideas from your shopping campaigns. The script
 * generate a list of keywords where your shopping campaings does
 * trigger a impression but not any other search campaign.
 *
 * Spreadsheet Teamplate https://goo.gl/eF5fQ2
 * This only works for MCC accounts.
 *
 * @todo refactoring before pulling to master
 */

var SPREADSHEET_URL = 'https://goo.gl/eF5fQ2';

function main() {
  var spreadsheetUrl = SPREADSHEET_URL;
  var spreadsheet = ScriptHelpers.spreadsheetByUrl(spreadsheetUrl);
  var accountConfigs = ScriptHelpers.getAccountConfigs(spreadsheet);
  var accountIds = (function() {
    var configData = accountConfigs.data();
    var tempArr = [];
    configData.forEach(function(row){
      tempArr.push(row[1].replace(/-/g,''))
    })
    return tempArr;
  })()

  var accountSelector = MccApp.accounts().withIds(accountIds);
      accountSelector.executeInParallel('processAccounts', null, spreadsheetUrl);
}


function processAccounts(spreadsheetUrl) {
  var spreadsheet = ScriptHelpers.spreadsheetByUrl(spreadsheetUrl);
  var currentAccountId = AdWordsApp.currentAccount().getCustomerId().replace(/-/g,'')
  var accountConfigs = ScriptHelpers.getAccountConfigs(spreadsheet).data();
  var config = accountConfigs.filter(function(value){
    return value[1].replace(/-/g,'') == currentAccountId
  })[0]
  var accountName = config[0];

  Logger.log('Start processing: ' + accountName)

  // Get all Shopping Camapaign's ID
  var shoppingCampaignIterator = AdWordsApp
    .shoppingCampaigns()
    .withCondition('Impressions > 10')
    .forDateRange('ALL_TIME')
    .get();
  var shoppingCampaignIds = [];
  while(shoppingCampaignIterator.hasNext()) {
    var shoppingCampaignId = shoppingCampaignIterator.next().getId();
    shoppingCampaignIds.push(shoppingCampaignId)
  }

  // Get KPI-contions from spreadsheet config
  var kpiCondition = ScriptHelpers.buildKpiQuery(config);
  var dateRange = (config[2]) ? config[2] : 'LAST_7_DAYS';

  // init AdWordsReport
  var ga = new AdWordsReport();

  // get query data
  var shoppingSearchQueries = getShoppingSearchQueries(ga,shoppingCampaignIds,kpiCondition,dateRange);
  var existingSearchQueries = getExistingSearchQueries(ga,shoppingCampaignIds,dateRange);

  // filter out duplicates and get unique queries
  var queries = shoppingSearchQueries.query.filter(function(value){
    return existingSearchQueries.indexOf(value) == -1;
  });

  // map unique queries with report data
  var proposals = []
  queries.forEach(function(value){
    shoppingSearchQueries.report.forEach(function(row){
      if(value == row.Query) { proposals.push(row) }
    })
  });

  // Create a new spreadspreadsheet from Template and paste data
  var dataSheet = ScriptHelpers.copyTemplateAndCreateNewSpreadsheet(spreadsheet,config[0]);
  var newSheet = ScriptHelpers.pasteToDataSheet(proposals,dataSheet,dateRange);
  var newSpreadsheet = dataSheet.getParent();
      newSpreadsheet.deleteSheet(newSpreadsheet.getSheets()[0])
  var newSpreadsheetUrl = newSpreadsheet.getUrl()

  // Update owner of spreadsheet and remove Victor as editor
  fixUserSettingsOnSpreadsheet(newSpreadsheet,config[3])

  // Update spreadsheet URL in Settings tab
  var currentAccountRow; 
  accountConfigs.forEach(function(value,index){
    if(value[0] == accountName) { currentAccountRow = index }
  });

  var latestUrlRange = ScriptHelpers.updateConfigSheetWithUrl(spreadsheet,newSpreadsheetUrl,currentAccountRow);
  Logger.log('Proccess completed | Account: ' + accountName + ' | Spreadsheet URL: ' + latestUrlRange.getValue())

}

function getShoppingSearchQueries(ga,shoppingCampaignIds,kpiCondition,dateRange) {
  var searchQueries = [];
  var report = ga.awql()
    .select(['Query','Impressions','Clicks','Cost','Ctr','ConvertedClicks','AverageCpc',
      'CostPerConvertedClick','ValuePerConvertedClick','ClickConversionRate','ConversionValue'])
    .from('SEARCH_QUERY_PERFORMANCE_REPORT')
    .where('CampaignId IN [' + shoppingCampaignIds.toString() + ']')
    .and(kpiCondition)
    .during(dateRange)
    .run();
  report['data'].forEach(function(row){
    searchQueries.push(ScriptHelpers.normalizeKeyword(row.Query))
  });
  return {
    query: searchQueries,
    report: report['data']
  }
}

function getExistingSearchQueries(ga,shoppingCampaignIds,dateRange) {
  var existingSearchQueries = [];
  var keywordsReport = ga.awql()
    .select(['Query'])
    .from('SEARCH_QUERY_PERFORMANCE_REPORT')
    .where('CampaignId NOT_IN [' + shoppingCampaignIds.toString() + ']')
    .during(dateRange)
    .run();
  keywordsReport['data'].forEach(function(row){
    existingSearchQueries.push(ScriptHelpers.normalizeKeyword(row.Query))
  });
  return existingSearchQueries;
}

function fixUserSettingsOnSpreadsheet (spreadsheet,email) {
  var users = email.split(',')
  var file = DriveApp.getFileById(spreadsheet.getId())
  spreadsheet.addEditors(users)
  file.setOwner(users[0])
  spreadsheet.removeEditor('victor.kaugesaar@iprospect.se')
}

var ScriptHelpers = {

  normalizeKeyword: function(kw) {
    return kw.replace(/\[|\]|\+/g,'').toLowerCase()
  },

  buildKpiQuery: function(config) {
    return '' + config[4] + config[5] + config[6] + ' AND '+ config[7] + config[8] + config[9] + ''.trim();
  },

  spreadsheetByUrl: function(spreadsheetUrl) {
    return SpreadsheetApp.openByUrl(spreadsheetUrl)
  },

  getAccountConfigs: function(spreadsheet) {
    return { 
      data: function() {
        return spreadsheet.getRangeByName('accountSettings').getValues().filter(function(value){
          return value[0].length > 1 && value[1].length >= 9 && value[10] == 'YES'
        })
      },
      headers: function() {
        return spreadsheet.getRangeByName('accountSettingsHeaders').getValues()[0]
      }
    }
  },

  copyTemplateAndCreateNewSpreadsheet: function(spreadsheet,sheetName) {
    return spreadsheet.getSheetByName('Template').copyTo(SpreadsheetApp.create('GSSQS | ' + sheetName)).setName(sheetName)
  },
  
  pasteToDataSheet: function(data,sheet,dateRange) {
    var sheetData = [];
    for (i in data) 
    {   
        var row = [
          data[i]['Query'],data[i]['Impressions'],data[i]['Clicks'],data[i]['Ctr'],data[i]['ConvertedClicks'],
          data[i]['Cost'],data[i]['AverageCpc'],data[i]['CostPerConvertedClick'],data[i]['ValuePerConvertedClick'],
          data[i]['ClickConversionRate'],data[i]['ConversionValue']
        ]
        sheetData.push(row);
    }
    var rows = sheetData.length;
    var statusLine = 'Proposed Search Query Report | Proposed queries: ' + rows + ' | Created: ' + new Date().toLocaleDateString() + ' | Date range: ' + dateRange;
    sheet.getRange('B3').setValue(statusLine);
    sheet.getRange(5, 2, rows, 11).setValues(sheetData);
    return sheet
  },

  sendMail: function(body,emails,message) {
    return MailApp.sendEmail(emails,message,body)
  },

  updateConfigSheetWithUrl: function(spreadsheet,url,row) {
    var sheet = spreadsheet.getSheetByName('Settings');
    var range = sheet.getRange('M' + (5 + row)).clearContent();
    return range.setValue(url);
  }
}

// get all shopping campaign ids
// get search queries of shopping campaigns
// push all rows to a dict
// get exsiting queries from search campaigns
var AdWordsReport=function(e){e=e||{},e.limit=e.limit,e.remaining=e.remaining,e.exportToSheet=e.exportToSheet,e.zeroImpression=!0,e.awqlOptions={};var t=function(e){return"--"===e?null:e.split(";").map(Function.prototype.call,String.prototype.trim)},r=function(e){return String(e)},i=function(e){return e=String(e),e.indexOf("%")>-1?parseFloat(e.replace(/[%|<]/g,""))/100:"--"===e?parseFloat(0):parseFloat(e.replace(/,/g,""))},a={AccountCurrencyCode:r,AccountDescriptiveName:r,AccountTimeZoneId:r,ActiveViewCpm:i,ActiveViewImpressions:i,AdFormat:r,AdGroupAdDisapprovalReasons:t,AdGroupCount:i,AdGroupCreativesCount:i,AdGroupCriteriaCount:i,AdGroupCriterionStatus:r,AdGroupId:r,AdGroupName:r,AdGroupsCount:i,AdGroupStatus:r,AdId:r,AdNetworkType1:r,AdNetworkType2:r,AdType:r,AdvertiserExperimentSegmentationBin:r,AdvertiserPhoneNumber:r,AdvertisingChannelSubType:r,AdvertisingChannelType:r,AggregatorId:r,Amount:i,ApprovalStatus:r,AssociatedCampaignId:r,AssociatedCampaignName:r,AssociatedCampaignStatus:r,AttributeValues:t,AverageCpc:i,AverageCpm:i,AverageFrequency:i,AveragePageviews:i,AveragePosition:i,AverageTimeOnSite:i,AvgCostForOfflineInteraction:i,BenchmarkAverageMaxCpc:i,BenchmarkCtr:i,BiddingStrategyId:r,BiddingStrategyName:r,BiddingStrategyType:r,BidModifier:i,BidType:r,BounceRate:i,Brand:r,BudgetCampaignAssociationStatus:r,BudgetId:r,BudgetName:r,BudgetReferenceCount:i,BudgetStatus:r,CallDuration:i,CallEndTime:i,CallerCountryCallingCode:r,CallerNationalDesignatedCode:r,CallStartTime:i,CallStatus:r,CallType:r,CampaignCount:i,CampaignId:r,CampaignName:r,CampaignsCount:i,CampaignStatus:r,CanManageClients:r,Category0:r,Category1:r,Category2:r,CategoryL1:r,CategoryL2:r,CategoryL3:r,CategoryL4:r,CategoryL5:r,CategoryPaths:r,Channel:r,ChannelExclusivity:r,CityCriteriaId:r,ClickAssistedConversions:i,ClickAssistedConversionsOverLastClickConversions:i,ClickAssistedConversionValue:i,ClickConversionRate:i,ClickConversionRateSignificance:i,Clicks:i,ClickSignificance:i,ClickType:r,CombinedAdsOrganicClicks:i,CombinedAdsOrganicClicksPerQuery:i,CombinedAdsOrganicQueries:i,ContentBidCriterionTypeGroup:r,ContentBudgetLostImpressionShare:i,ContentImpressionShare:i,ContentRankLostImpressionShare:i,ConversionCategoryName:r,ConversionManyPerClickSignificance:i,ConversionRateManyPerClick:i,ConversionRateManyPerClickSignificance:i,ConversionsManyPerClick:i,ConversionTrackerId:r,ConversionTypeName:r,ConversionValue:i,ConvertedClicks:i,ConvertedClicksSignificance:i,Cost:i,CostPerConversionManyPerClick:i,CostPerConversionManyPerClickSignificance:i,CostPerConvertedClick:i,CostPerConvertedClickSignificance:i,CostPerEstimatedTotalConversion:i,CostSignificance:i,CountryCriteriaId:r,CpcBid:r,CpcBidSource:r,CpcSignificance:i,CpmBid:r,CpmBidSource:r,CpmSignificance:i,CreativeApprovalStatus:r,CreativeDestinationUrl:r,CreativeFinalAppUrls:t,CreativeFinalMobileUrls:t,CreativeFinalUrls:t,CreativeId:r,CreativeTrackingUrlTemplate:r,CreativeUrlCustomParameters:r,Criteria:r,CriteriaDestinationUrl:r,CriteriaId:r,CriteriaParameters:r,CriteriaStatus:r,CriteriaType:r,CriteriaTypeName:r,CriterionId:r,Ctr:i,CtrSignificance:i,CustomAttribute0:r,CustomAttribute1:r,CustomAttribute2:r,CustomAttribute3:r,CustomAttribute4:r,CustomerDescriptiveName:r,Date:r,DayOfWeek:r,DeliveryMethod:r,Description1:r,Description2:r,DestinationUrl:r,Device:r,DevicePreference:r,DisapprovalShortNames:t,DisplayName:r,DisplayUrl:r,DistanceBucket:r,Domain:r,EffectiveDestinationUrl:r,EndTime:r,EnhancedCpcEnabled:r,EstimatedCrossDeviceConversions:i,EstimatedTotalConversionRate:i,EstimatedTotalConversions:i,EstimatedTotalConversionValue:i,EstimatedTotalConversionValuePerClick:i,EstimatedTotalConversionValuePerCost:i,ExtensionPlaceholderCreativeId:r,ExtensionPlaceholderType:r,ExternalCustomerId:r,FeedId:r,FeedItemAttributes:t,FeedItemEndTime:r,FeedItemId:r,FeedItemStartTime:r,FeedItemStatus:r,FinalAppUrls:t,FinalMobileUrls:t,FinalUrls:t,FirstPageCpc:i,GclId:r,Headline:r,HourOfDay:i,Id:r,ImageAdUrl:r,ImageCreativeName:r,ImpressionAssistedConversions:i,ImpressionAssistedConversionsOverLastClickConversions:i,ImpressionAssistedConversionValue:i,ImpressionReach:i,Impressions:i,ImpressionSignificance:i,InvalidClickRate:i,InvalidClicks:i,IsAutoOptimized:r,IsAutoTaggingEnabled:r,IsBidOnPath:r,IsBudgetExplicitlyShared:r,IsNegative:r,IsPathExcluded:r,IsRestrict:r,IsSelfAction:r,IsTargetingLocation:r,IsTestAccount:r,KeywordId:r,KeywordMatchType:r,KeywordText:r,KeywordTextMatchingQuery:r,LabelId:r,LabelIds:t,LabelName:r,Labels:t,LanguageCriteriaId:r,Line1:r,LocationType:r,MatchType:r,MatchTypeWithVariant:r,MemberCount:i,MerchantId:r,MetroCriteriaId:r,Month:r,MonthOfYear:r,MostSpecificCriteriaId:r,Name:r,NonRemovedAdGroupCount:i,NonRemovedAdGroupCriteriaCount:i,NonRemovedCampaignCount:i,NumOfflineImpressions:i,NumOfflineInteractions:i,OfferId:r,OfflineInteractionCost:i,OfflineInteractionRate:i,OrganicAveragePosition:i,OrganicClicks:i,OrganicClicksPerQuery:i,OrganicImpressions:i,OrganicImpressionsPerQuery:i,OrganicQueries:i,Page:i,PageOnePromotedBidCeiling:i,PageOnePromotedBidChangesForRaisesOnly:r,PageOnePromotedBidModifier:i,PageOnePromotedRaiseBidWhenBudgetConstrained:r,PageOnePromotedRaiseBidWhenLowQualityScore:r,PageOnePromotedStrategyGoal:r,Parameter:r,ParentCriterionId:r,PartitionType:r,PercentNewVisitors:i,Period:r,PlaceholderType:i,PlacementUrl:r,PositionSignificance:i,PrimaryCompanyName:r,ProductCondition:r,ProductGroup:r,ProductTypeL1:r,ProductTypeL2:r,ProductTypeL3:r,ProductTypeL4:r,ProductTypeL5:r,QualityScore:i,Quarter:r,Query:r,ReferenceCount:i,RegionCriteriaId:r,RelativeCtr:i,Scheduling:r,SearchBudgetLostImpressionShare:i,SearchExactMatchImpressionShare:i,SearchImpressionShare:i,SearchQuery:r,SearchRankLostImpressionShare:i,SerpType:r,ServingStatus:r,SharedSetId:r,SharedSetName:r,SharedSetType:r,Slot:r,StartTime:r,Status:r,StoreId:r,TargetCpa:i,TargetCpaMaxCpcBidCeiling:i,TargetCpaMaxCpcBidFloor:i,TargetOutrankShare:i,TargetOutrankShareBidChangesForRaisesOnly:r,TargetOutrankShareCompetitorDomain:r,TargetOutrankShareMaxCpcBidCeiling:i,TargetOutrankShareRaiseBidWhenLowQualityScore:r,TargetRoas:i,TargetRoasBidCeiling:i,TargetRoasBidFloor:i,TargetSpendBidCeiling:i,TargetSpendSpendTarget:i,Title:r,TopOfPageCpc:i,TotalBudget:i,TotalCost:i,TrackingUrlTemplate:r,Trademarks:t,Type:r,Url:r,UrlCustomParameters:r,UserListId:r,UserListsCount:i,ValidationDetails:t,ValuePerConversionManyPerClick:i,ValuePerConvertedClick:i,ValuePerEstimatedTotalConversion:i,ViewThroughConversions:i,ViewThroughConversionsSignificance:i,Week:r,Year:r},n=function(t){return Array.isArray(t)&&(t=t.join(",")),e.awqlOptions.select=t,{from:o}},o=function(t){return e.awqlOptions.from=t,{where:s,and:d,during:C}},s=function(t){return e.awqlOptions.where=t,{and:d,during:C}},d=function(t){return e.awqlOptions.and||(e.awqlOptions.and=[]),Array.isArray(t)?e.awqlOptions.and=[].contact.apply([],e.awqlOptions.and,t):e.awqlOptions.and.push(t),{and:d,during:C}},C=function(t){return Array.isArray(t)&&(t=t.join(",")),e.awqlOptions.during=t,{run:l}},l=function(){var t=e.awqlOptions;"object"==typeof e.awqlOptions?(t="SELECT "+e.awqlOptions.select+" FROM "+e.awqlOptions.from,e.awqlOptions.where&&(t+=" WHERE "+e.awqlOptions.where),e.awqlOptions.and&&(t+=" AND "+e.awqlOptions.and.join(" AND ")),e.awqlOptions.during&&(t+=" DURING "+e.awqlOptions.during)):"String"==typeof t&&(t=t.split(", ").join(",")),options={includeZeroImpressions:e.zeroImpression},e.awqlOptions={};var r=AdWordsApp.report(t,options);return c(r)},c=function(t){var r={};r.data=[];var i=(new Date).toLocaleDateString();if(e.exportToSheet){var n=SpreadsheetApp.create("AdWordsReport - "+i);t.exportToSheet(n.getActiveSheet()),r.sheetUrl=n.getUrl(),r.sheetId=n.getId(),r.sheetName=n.getName()}for(var o=t.rows();o.hasNext();){var s=o.next(),d={},C=Object.keys(s);C.forEach(function(e){if(void 0!=a[e]){var t=s[e];return d[e]=a[e](t)}}),r.data.push(d)}return r};return this.use=function(t){if("object"!=typeof t)throw new Error('Wrong param "options"');"boolean"==typeof t.exportToSheet&&(e.exportToSheet=t.exportToSheet),"boolean"==typeof t.zeroImpression&&(e.zeroImpression=t.zeroImpression)},this.awql=function(t){return t?(e.awqlOptions=t,Array.isArray(e.awqlOptions.select)&&(e.awqlOptions.select=e.awqlOptions.select.join(",")),Array.isArray(e.awqlOptions.during)&&(e.awqlOptions.during=e.awqlOptions.during.joing(",")),{run:l}):{select:n}},this};