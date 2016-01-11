/**
 * Matrix.js
 * 
 * Will create a spreadsheet with a matrix overview of selected KPIs
 * sorted by hour of day and day of week.
 * Example: https://goo.gl/43zW0S
 */

// Specify which account to run the report for
var ACCOUNTS = ['123-456-7890','789-456-1230','456-789-1011'];

// Specifiy which dates you want to use.
var DATE = ['20150101','20151231'];

// Avaiable KPIs: http://goo.gl/mdtDdh (green ones)
var KPI_TO_LOOK_AT = ['SearchImpressionShare', 'Impressions'];

// We need to convert integers to day-strings later on. Do not change
// the order of this. Even if your first day of week for any reason
// would be anything else than monday
var _days = ['Monday','Tuesday','Wednesday','Thursday',
                         'Friday','Saturday','Sunday'];

function main() {
    var accountSelector = MccApp.accounts().withIds(ACCOUNTS);
    accountSelector.executeInParallel('processDataForMatrix','completeMessage');
}

function processDataForMatrix() {
    var currentAccount = AdWordsApp.currentAccount();
    var result = getReportData()['data'];
    var data = {};
    KPI_TO_LOOK_AT.forEach(function(columnName){
        data[columnName] = [];
        for(var i=0; i<24; i++) {
            data[columnName].push([]);
            for(var j=0; j <7; j++) {
                var times = findInObject(result, {
                    'DayOfWeek': _days[j],
                    'HourOfDay': i
                }, columnName);
                var sum = times.reduce(function(a, b) { return a + b });
                var avg = sum / times.length;
                data[columnName][i].push(avg);
            }
        }
    });

    createSpreadsheet(data,currentAccount)

}

function completeMessage() {
    Logger.log('All accounts has been processed.')
}

function createSpreadsheet(data,account) {

    var spreadsheetName =  account.getName() + ' | Matrix Report';
    var rowLabels = [
        ['00:00'],['01:00'],['02:00'],['03:00'],['04:00'],['05:00'],
        ['06:00'],['07:00'],['08:00'],['09:00'],['10:00'],['11:00'],
        ['12:00'],['13:00'],['14:00'],['15:00'],['16:00'],['17:00'],
        ['18:00'],['19:00'],['20:00'],['21:00'],['22:00'],['23:00']
    ];

    var spreadsheet = SpreadsheetApp.create(spreadsheetName);

    KPI_TO_LOOK_AT.forEach(function(columnName) {

        var sheet = spreadsheet.insertSheet(columnName);
     
        var sheetHeader = [_days]
        var sheetData = data[columnName]

        var cols = 7
        var rows = 24

        sheet.getRange(1, 2, 1, cols).setValues(sheetHeader)
        sheet.getRange(2, 2, rows, cols).setValues(sheetData)
        sheet.getRange(2, 1, rows, 1).setValues(rowLabels)

        if( ! sheet.getCharts()[0]) {
            var chart = sheet.newChart()
                .setChartType(Charts.ChartType.SCATTER)
                .addRange(sheet.getRange(1, 1, rows+1, cols+1))
                .setPosition(5, cols+3, 0, 0)
                .setOption('title', columnName + ' by hour and day of week')
                .setOption('animation.duration', 500)
                .build()
            sheet.insertChart(chart);  
        }

    })
    
    spreadsheet.deleteSheet(spreadsheet.getSheets()[0]);
    
    Logger.log('Spreadsheet created for ' + account.getName() + ' | URL: ' + spreadsheet.getUrl())

}

var findInObject = function(arr, value, columnName) {
    var result = [];
    arr.forEach(function(o) {
        if (o.DayOfWeek === value.DayOfWeek && o.HourOfDay === value.HourOfDay) {
            result.push(o[columnName]);
        }
    })
    return result;
}

var getReportData = (function(ga) {
    var ga = new AdWordsReport();
    return ga.awql()
        .select(['DayOfWeek','HourOfDay'] + ',' + KPI_TO_LOOK_AT)
        .from('ACCOUNT_PERFORMANCE_REPORT')
        .during(DATE)
        .run();
})

/**
 *  AdWordsScriptsReport.min.js
 *  http://github.com/kaugesaar/adwords-scripts
 */
var AdWordsReport=function(e){e=e||{},e.limit=e.limit,e.remaining=e.remaining,e.exportToSheet=e.exportToSheet,e.zeroImpression=!0,e.awqlOptions={};var t=function(e){return"--"===e?null:e.split(";").map(Function.prototype.call,String.prototype.trim)},r=function(e){return String(e)},i=function(e){return e=String(e),e.indexOf("%")>-1?parseFloat(e.replace(/[%|<]/g,""))/100:"--"===e?parseFloat(0):parseFloat(e.replace(/,/g,""))},a={AccountCurrencyCode:r,AccountDescriptiveName:r,AccountTimeZoneId:r,ActiveViewCpm:i,ActiveViewImpressions:i,AdFormat:r,AdGroupAdDisapprovalReasons:t,AdGroupCount:i,AdGroupCreativesCount:i,AdGroupCriteriaCount:i,AdGroupCriterionStatus:r,AdGroupId:r,AdGroupName:r,AdGroupsCount:i,AdGroupStatus:r,AdId:r,AdNetworkType1:r,AdNetworkType2:r,AdType:r,AdvertiserExperimentSegmentationBin:r,AdvertiserPhoneNumber:r,AdvertisingChannelSubType:r,AdvertisingChannelType:r,AggregatorId:r,Amount:i,ApprovalStatus:r,AssociatedCampaignId:r,AssociatedCampaignName:r,AssociatedCampaignStatus:r,AttributeValues:t,AverageCpc:i,AverageCpm:i,AverageFrequency:i,AveragePageviews:i,AveragePosition:i,AverageTimeOnSite:i,AvgCostForOfflineInteraction:i,BenchmarkAverageMaxCpc:i,BenchmarkCtr:i,BiddingStrategyId:r,BiddingStrategyName:r,BiddingStrategyType:r,BidModifier:i,BidType:r,BounceRate:i,Brand:r,BudgetCampaignAssociationStatus:r,BudgetId:r,BudgetName:r,BudgetReferenceCount:i,BudgetStatus:r,CallDuration:i,CallEndTime:i,CallerCountryCallingCode:r,CallerNationalDesignatedCode:r,CallStartTime:i,CallStatus:r,CallType:r,CampaignCount:i,CampaignId:r,CampaignName:r,CampaignsCount:i,CampaignStatus:r,CanManageClients:r,Category0:r,Category1:r,Category2:r,CategoryL1:r,CategoryL2:r,CategoryL3:r,CategoryL4:r,CategoryL5:r,CategoryPaths:r,Channel:r,ChannelExclusivity:r,CityCriteriaId:r,ClickAssistedConversions:i,ClickAssistedConversionsOverLastClickConversions:i,ClickAssistedConversionValue:i,ClickConversionRate:i,ClickConversionRateSignificance:i,Clicks:i,ClickSignificance:i,ClickType:r,CombinedAdsOrganicClicks:i,CombinedAdsOrganicClicksPerQuery:i,CombinedAdsOrganicQueries:i,ContentBidCriterionTypeGroup:r,ContentBudgetLostImpressionShare:i,ContentImpressionShare:i,ContentRankLostImpressionShare:i,ConversionCategoryName:r,ConversionManyPerClickSignificance:i,ConversionRateManyPerClick:i,ConversionRateManyPerClickSignificance:i,ConversionsManyPerClick:i,ConversionTrackerId:r,ConversionTypeName:r,ConversionValue:i,ConvertedClicks:i,ConvertedClicksSignificance:i,Cost:i,CostPerConversionManyPerClick:i,CostPerConversionManyPerClickSignificance:i,CostPerConvertedClick:i,CostPerConvertedClickSignificance:i,CostPerEstimatedTotalConversion:i,CostSignificance:i,CountryCriteriaId:r,CpcBid:r,CpcBidSource:r,CpcSignificance:i,CpmBid:r,CpmBidSource:r,CpmSignificance:i,CreativeApprovalStatus:r,CreativeDestinationUrl:r,CreativeFinalAppUrls:t,CreativeFinalMobileUrls:t,CreativeFinalUrls:t,CreativeId:r,CreativeTrackingUrlTemplate:r,CreativeUrlCustomParameters:r,Criteria:r,CriteriaDestinationUrl:r,CriteriaId:r,CriteriaParameters:r,CriteriaStatus:r,CriteriaType:r,CriteriaTypeName:r,CriterionId:r,Ctr:i,CtrSignificance:i,CustomAttribute0:r,CustomAttribute1:r,CustomAttribute2:r,CustomAttribute3:r,CustomAttribute4:r,CustomerDescriptiveName:r,Date:r,DayOfWeek:r,DeliveryMethod:r,Description1:r,Description2:r,DestinationUrl:r,Device:r,DevicePreference:r,DisapprovalShortNames:t,DisplayName:r,DisplayUrl:r,DistanceBucket:r,Domain:r,EffectiveDestinationUrl:r,EndTime:r,EnhancedCpcEnabled:r,EstimatedCrossDeviceConversions:i,EstimatedTotalConversionRate:i,EstimatedTotalConversions:i,EstimatedTotalConversionValue:i,EstimatedTotalConversionValuePerClick:i,EstimatedTotalConversionValuePerCost:i,ExtensionPlaceholderCreativeId:r,ExtensionPlaceholderType:r,ExternalCustomerId:r,FeedId:r,FeedItemAttributes:t,FeedItemEndTime:r,FeedItemId:r,FeedItemStartTime:r,FeedItemStatus:r,FinalAppUrls:t,FinalMobileUrls:t,FinalUrls:t,FirstPageCpc:i,GclId:r,Headline:r,HourOfDay:i,Id:r,ImageAdUrl:r,ImageCreativeName:r,ImpressionAssistedConversions:i,ImpressionAssistedConversionsOverLastClickConversions:i,ImpressionAssistedConversionValue:i,ImpressionReach:i,Impressions:i,ImpressionSignificance:i,InvalidClickRate:i,InvalidClicks:i,IsAutoOptimized:r,IsAutoTaggingEnabled:r,IsBidOnPath:r,IsBudgetExplicitlyShared:r,IsNegative:r,IsPathExcluded:r,IsRestrict:r,IsSelfAction:r,IsTargetingLocation:r,IsTestAccount:r,KeywordId:r,KeywordMatchType:r,KeywordText:r,KeywordTextMatchingQuery:r,LabelId:r,LabelIds:t,LabelName:r,Labels:t,LanguageCriteriaId:r,Line1:r,LocationType:r,MatchType:r,MatchTypeWithVariant:r,MemberCount:i,MerchantId:r,MetroCriteriaId:r,Month:r,MonthOfYear:r,MostSpecificCriteriaId:r,Name:r,NonRemovedAdGroupCount:i,NonRemovedAdGroupCriteriaCount:i,NonRemovedCampaignCount:i,NumOfflineImpressions:i,NumOfflineInteractions:i,OfferId:r,OfflineInteractionCost:i,OfflineInteractionRate:i,OrganicAveragePosition:i,OrganicClicks:i,OrganicClicksPerQuery:i,OrganicImpressions:i,OrganicImpressionsPerQuery:i,OrganicQueries:i,Page:i,PageOnePromotedBidCeiling:i,PageOnePromotedBidChangesForRaisesOnly:r,PageOnePromotedBidModifier:i,PageOnePromotedRaiseBidWhenBudgetConstrained:r,PageOnePromotedRaiseBidWhenLowQualityScore:r,PageOnePromotedStrategyGoal:r,Parameter:r,ParentCriterionId:r,PartitionType:r,PercentNewVisitors:i,Period:r,PlaceholderType:i,PlacementUrl:r,PositionSignificance:i,PrimaryCompanyName:r,ProductCondition:r,ProductGroup:r,ProductTypeL1:r,ProductTypeL2:r,ProductTypeL3:r,ProductTypeL4:r,ProductTypeL5:r,QualityScore:i,Quarter:r,Query:r,ReferenceCount:i,RegionCriteriaId:r,RelativeCtr:i,Scheduling:r,SearchBudgetLostImpressionShare:i,SearchExactMatchImpressionShare:i,SearchImpressionShare:i,SearchQuery:r,SearchRankLostImpressionShare:i,SerpType:r,ServingStatus:r,SharedSetId:r,SharedSetName:r,SharedSetType:r,Slot:r,StartTime:r,Status:r,StoreId:r,TargetCpa:i,TargetCpaMaxCpcBidCeiling:i,TargetCpaMaxCpcBidFloor:i,TargetOutrankShare:i,TargetOutrankShareBidChangesForRaisesOnly:r,TargetOutrankShareCompetitorDomain:r,TargetOutrankShareMaxCpcBidCeiling:i,TargetOutrankShareRaiseBidWhenLowQualityScore:r,TargetRoas:i,TargetRoasBidCeiling:i,TargetRoasBidFloor:i,TargetSpendBidCeiling:i,TargetSpendSpendTarget:i,Title:r,TopOfPageCpc:i,TotalBudget:i,TotalCost:i,TrackingUrlTemplate:r,Trademarks:t,Type:r,Url:r,UrlCustomParameters:r,UserListId:r,UserListsCount:i,ValidationDetails:t,ValuePerConversionManyPerClick:i,ValuePerConvertedClick:i,ValuePerEstimatedTotalConversion:i,ViewThroughConversions:i,ViewThroughConversionsSignificance:i,Week:r,Year:r},n=function(t){return Array.isArray(t)&&(t=t.join(",")),e.awqlOptions.select=t,{from:o}},o=function(t){return e.awqlOptions.from=t,{where:s,and:d,during:C}},s=function(t){return e.awqlOptions.where=t,{and:d,during:C}},d=function(t){return e.awqlOptions.and||(e.awqlOptions.and=[]),Array.isArray(t)?e.awqlOptions.and=[].contact.apply([],e.awqlOptions.and,t):e.awqlOptions.and.push(t),{and:d,during:C}},C=function(t){return Array.isArray(t)&&(t=t.join(",")),e.awqlOptions.during=t,{run:l}},l=function(){var t=e.awqlOptions;"object"==typeof e.awqlOptions?(t="SELECT "+e.awqlOptions.select+" FROM "+e.awqlOptions.from,e.awqlOptions.where&&(t+=" WHERE "+e.awqlOptions.where),e.awqlOptions.and&&(t+=" AND "+e.awqlOptions.and.join(" AND ")),e.awqlOptions.during&&(t+=" DURING "+e.awqlOptions.during)):"String"==typeof t&&(t=t.split(", ").join(",")),options={includeZeroImpressions:e.zeroImpression},e.awqlOptions={};var r=AdWordsApp.report(t,options);return c(r)},c=function(t){var r={};r.data=[];var i=(new Date).toLocaleDateString();if(e.exportToSheet){var n=SpreadsheetApp.create("AdWordsReport - "+i);t.exportToSheet(n.getActiveSheet()),r.sheetUrl=n.getUrl(),r.sheetId=n.getId(),r.sheetName=n.getName()}for(var o=t.rows();o.hasNext();){var s=o.next(),d={},C=Object.keys(s);C.forEach(function(e){if(void 0!=a[e]){var t=s[e];return d[e]=a[e](t)}}),r.data.push(d)}return r};return this.use=function(t){if("object"!=typeof t)throw new Error('Wrong param "options"');"boolean"==typeof t.exportToSheet&&(e.exportToSheet=t.exportToSheet),"boolean"==typeof t.zeroImpression&&(e.zeroImpression=t.zeroImpression)},this.awql=function(t){return t?(e.awqlOptions=t,Array.isArray(e.awqlOptions.select)&&(e.awqlOptions.select=e.awqlOptions.select.join(",")),Array.isArray(e.awqlOptions.during)&&(e.awqlOptions.during=e.awqlOptions.during.joing(",")),{run:l}):{select:n}},this};