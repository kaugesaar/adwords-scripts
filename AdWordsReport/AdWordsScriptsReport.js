function main() {
  var ga = new AdWordsReport();
    var reportData = ga.awql()
        .select(['Clicks','Impressions','Year','Cost','SearchImpressionShare'])
        .from('ACCOUNT_PERFORMANCE_REPORT')
        .where('Clicks > 0')
        .and('Impressions > 10')
        .during('20120101,20151231')
        .run();
    Logger.log(reportData);
}

var AdWordsReport = function(settings) {
    settings = settings || {}
    settings.limit = null || settings.limit;
    settings.remaining = null || settings.remaining;
    settings.exportToSheet = false || settings.exportToSheet;
    settings.zeroImpression = true || settings.zeroImpression;
    settings.awqlOptions = {};

    /**
     * Helpers for dealing with adwords scripts
     * returning everything from the report API
     * as strings and what not.
     */
    
    var _array = function(value) {
        return value.split(', ');
    }

    var _string = function(value) {
        return String(value);
    }

    var _float = function(value) {
        value = String(value);
        if(value.indexOf('%') > -1) {
            return (parseFloat(value.replace(/[%|<]/g,'')) / 100);
        }
        if(value === '---') {
            return parseFloat(0);
        }
        return parseFloat(value.replace(/,/g,''))
    }

    /**
     * All columns used in the adwords report api
     * some new ones must be missing, last checked
     * was version: v201502
     */
    var _columns = {
        AccountCurrencyCode:  _string,
        AccountDescriptiveName:  _string,
        AccountTimeZoneId:  _string,
        ActiveViewCpm:  _float,
        ActiveViewImpressions:  _float,
        AdFormat:  _string,
        AdGroupAdDisapprovalReasons:  _array,
        AdGroupCount:  _float,
        AdGroupCreativesCount:  _float,
        AdGroupCriteriaCount:  _float,
        AdGroupCriterionStatus:  _string,
        AdGroupId:  _string,
        AdGroupName:  _string,
        AdGroupsCount:  _float,
        AdGroupStatus:  _string,
        AdId:  _string,
        AdNetworkType1:  _string,
        AdNetworkType2:  _string,
        AdType:  _string,
        AdvertiserExperimentSegmentationBin:  _string,
        AdvertiserPhoneNumber:  _string,
        AdvertisingChannelSubType:  _string,
        AdvertisingChannelType:  _string,
        AggregatorId:  _string,
        Amount:  _float,
        ApprovalStatus:  _string,
        AssociatedCampaignId:  _string,
        AssociatedCampaignName:  _string,
        AssociatedCampaignStatus:  _string,
        AttributeValues:  _array,
        AverageCpc:  _float,
        AverageCpm:  _float,
        AverageFrequency:  _float,
        AveragePageviews:  _float,
        AveragePosition:  _float,
        AverageTimeOnSite:  _float,
        AvgCostForOfflineInteraction:  _float,
        BenchmarkAverageMaxCpc:  _float,
        BenchmarkCtr:  _float,
        BiddingStrategyId:  _string,
        BiddingStrategyName:  _string,
        BiddingStrategyType:  _string,
        BidModifier:  _float,
        BidType:  _string,
        BounceRate:  _float,
        Brand:  _string,
        BudgetCampaignAssociationStatus:  _string,
        BudgetId:  _string,
        BudgetName:  _string,
        BudgetReferenceCount:  _float,
        BudgetStatus:  _string,
        CallDuration:  _float,
        CallEndTime:  _float,
        CallerCountryCallingCode:  _string,
        CallerNationalDesignatedCode:  _string,
        CallStartTime:  _float,
        CallStatus:  _string,
        CallType:  _string,
        CampaignCount:  _float,
        CampaignId:  _string,
        CampaignName:  _string,
        CampaignsCount:  _float,
        CampaignStatus:  _string,
        CanManageClients:  _string,
        Category0:  _string,
        Category1:  _string,
        Category2:  _string,
        CategoryL1:  _string,
        CategoryL2:  _string,
        CategoryL3:  _string,
        CategoryL4:  _string,
        CategoryL5:  _string,
        CategoryPaths:  _string,
        Channel:  _string,
        ChannelExclusivity:  _string,
        CityCriteriaId:  _string,
        ClickAssistedConversions:  _float,
        ClickAssistedConversionsOverLastClickConversions:  _float,
        ClickAssistedConversionValue:  _float,
        ClickConversionRate:  _float,
        ClickConversionRateSignificance:  _float,
        Clicks:  _float,
        ClickSignificance:  _float,
        ClickType:  _string,
        CombinedAdsOrganicClicks:  _float,
        CombinedAdsOrganicClicksPerQuery:  _float,
        CombinedAdsOrganicQueries:  _float,
        ContentBidCriterionTypeGroup:  _string,
        ContentBudgetLostImpressionShare:  _float,
        ContentImpressionShare:  _float,
        ContentRankLostImpressionShare:  _float,
        ConversionCategoryName:  _string,
        ConversionManyPerClickSignificance:  _float,
        ConversionRateManyPerClick:  _float,
        ConversionRateManyPerClickSignificance:  _float,
        ConversionsManyPerClick:  _float,
        ConversionTrackerId:  _string,
        ConversionTypeName:  _string,
        ConversionValue:  _float,
        ConvertedClicks:  _float,
        ConvertedClicksSignificance:  _float,
        Cost:  _float,
        CostPerConversionManyPerClick:  _float,
        CostPerConversionManyPerClickSignificance:  _float,
        CostPerConvertedClick:  _float,
        CostPerConvertedClickSignificance:  _float,
        CostPerEstimatedTotalConversion:  _float,
        CostSignificance:  _float,
        CountryCriteriaId:  _string,
        CpcBid:  _string,
        CpcBidSource:  _string,
        CpcSignificance:  _float,
        CpmBid:  _string,
        CpmBidSource:  _string,
        CpmSignificance:  _float,
        CreativeApprovalStatus:  _string,
        CreativeDestinationUrl:  _string,
        CreativeFinalAppUrls:  _array,
        CreativeFinalMobileUrls:  _array,
        CreativeFinalUrls:  _array,
        CreativeId:  _string,
        CreativeTrackingUrlTemplate:  _string,
        CreativeUrlCustomParameters:  _string,
        Criteria:  _string,
        CriteriaDestinationUrl:  _string,
        CriteriaId:  _string,
        CriteriaParameters:  _string,
        CriteriaStatus:  _string,
        CriteriaType:  _string,
        CriteriaTypeName:  _string,
        CriterionId:  _string,
        Ctr:  _float,
        CtrSignificance:  _float,
        CustomAttribute0:  _string,
        CustomAttribute1:  _string,
        CustomAttribute2:  _string,
        CustomAttribute3:  _string,
        CustomAttribute4:  _string,
        CustomerDescriptiveName:  _string,
        Date:  _string,
        DayOfWeek:  _float,
        DeliveryMethod:  _string,
        Description1:  _string,
        Description2:  _string,
        DestinationUrl:  _string,
        Device:  _string,
        DevicePreference:  _string,
        DisapprovalShortNames:  _array,
        DisplayName:  _string,
        DisplayUrl:  _string,
        DistanceBucket:  _string,
        Domain:  _string,
        EffectiveDestinationUrl:  _string,
        EndTime:  _string,
        EnhancedCpcEnabled:  _string,
        EstimatedCrossDeviceConversions:  _float,
        EstimatedTotalConversionRate:  _float,
        EstimatedTotalConversions:  _float,
        EstimatedTotalConversionValue:  _float,
        EstimatedTotalConversionValuePerClick:  _float,
        EstimatedTotalConversionValuePerCost:  _float,
        ExtensionPlaceholderCreativeId:  _string,
        ExtensionPlaceholderType:  _string,
        ExternalCustomerId:  _string,
        FeedId:  _string,
        FeedItemAttributes:  _array,
        FeedItemEndTime:  _string,
        FeedItemId:  _string,
        FeedItemStartTime:  _string,
        FeedItemStatus:  _string,
        FinalAppUrls:  _array,
        FinalMobileUrls:  _array,
        FinalUrls:  _array,
        FirstPageCpc:  _float,
        GclId:  _string,
        Headline:  _string,
        HourOfDay:  _float,
        Id:  _string,
        ImageAdUrl:  _string,
        ImageCreativeName:  _string,
        ImpressionAssistedConversions:  _float,
        ImpressionAssistedConversionsOverLastClickConversions:  _float,
        ImpressionAssistedConversionValue:  _float,
        ImpressionReach:  _float,
        Impressions:  _float,
        ImpressionSignificance:  _float,
        InvalidClickRate:  _float,
        InvalidClicks:  _float,
        IsAutoOptimized:  _string,
        IsAutoTaggingEnabled:  _string,
        IsBidOnPath:  _string,
        IsBudgetExplicitlyShared:  _string,
        IsNegative:  _string,
        IsPathExcluded:  _string,
        IsRestrict:  _string,
        IsSelfAction:  _string,
        IsTargetingLocation:  _string,
        IsTestAccount:  _string,
        KeywordId:  _string,
        KeywordMatchType:  _string,
        KeywordText:  _string,
        KeywordTextMatchingQuery:  _string,
        LabelId:  _string,
        LabelIds:  _array,
        LabelName:  _string,
        Labels:  _array,
        LanguageCriteriaId:  _string,
        Line1:  _string,
        LocationType:  _string,
        MatchType:  _string,
        MatchTypeWithVariant:  _string,
        MemberCount:  _float,
        MerchantId:  _string,
        MetroCriteriaId:  _string,
        Month:  _string,
        MonthOfYear:  _string,
        MostSpecificCriteriaId:  _string,
        Name:  _string,
        NonRemovedAdGroupCount:  _float,
        NonRemovedAdGroupCriteriaCount:  _float,
        NonRemovedCampaignCount:  _float,
        NumOfflineImpressions:  _float,
        NumOfflineInteractions:  _float,
        OfferId:  _string,
        OfflineInteractionCost:  _float,
        OfflineInteractionRate:  _float,
        OrganicAveragePosition:  _float,
        OrganicClicks:  _float,
        OrganicClicksPerQuery:  _float,
        OrganicImpressions:  _float,
        OrganicImpressionsPerQuery:  _float,
        OrganicQueries:  _float,
        Page:  _float,
        PageOnePromotedBidCeiling:  _float,
        PageOnePromotedBidChangesForRaisesOnly:  _string,
        PageOnePromotedBidModifier:  _float,
        PageOnePromotedRaiseBidWhenBudgetConstrained:  _string,
        PageOnePromotedRaiseBidWhenLowQualityScore:  _string,
        PageOnePromotedStrategyGoal:  _string,
        Parameter:  _string,
        ParentCriterionId:  _string,
        PartitionType:  _string,
        PercentNewVisitors:  _float,
        Period:  _string,
        PlaceholderType:  _float,
        PlacementUrl:  _string,
        PositionSignificance:  _float,
        PrimaryCompanyName:  _string,
        ProductCondition:  _string,
        ProductGroup:  _string,
        ProductTypeL1:  _string,
        ProductTypeL2:  _string,
        ProductTypeL3:  _string,
        ProductTypeL4:  _string,
        ProductTypeL5:  _string,
        QualityScore:  _float,
        Quarter:  _string,
        Query:  _string,
        ReferenceCount:  _float,
        RegionCriteriaId:  _string,
        RelativeCtr:  _float,
        Scheduling:  _string,
        SearchBudgetLostImpressionShare:  _float,
        SearchExactMatchImpressionShare:  _float,
        SearchImpressionShare:  _float,
        SearchQuery:  _string,
        SearchRankLostImpressionShare:  _float,
        SerpType:  _string,
        ServingStatus:  _string,
        SharedSetId:  _string,
        SharedSetName:  _string,
        SharedSetType:  _string,
        Slot:  _string,
        StartTime:  _string,
        Status:  _string,
        StoreId:  _string,
        TargetCpa:  _float,
        TargetCpaMaxCpcBidCeiling:  _float,
        TargetCpaMaxCpcBidFloor:  _float,
        TargetOutrankShare:  _float,
        TargetOutrankShareBidChangesForRaisesOnly:  _string,
        TargetOutrankShareCompetitorDomain:  _string,
        TargetOutrankShareMaxCpcBidCeiling:  _float,
        TargetOutrankShareRaiseBidWhenLowQualityScore:  _string,
        TargetRoas:  _float,
        TargetRoasBidCeiling:  _float,
        TargetRoasBidFloor:  _float,
        TargetSpendBidCeiling:  _float,
        TargetSpendSpendTarget:  _float,
        Title:  _string,
        TopOfPageCpc:  _float,
        TotalBudget:  _float,
        TotalCost:  _float,
        TrackingUrlTemplate:  _string,
        Trademarks:  _array,
        Type:  _string,
        Url:  _string,
        UrlCustomParameters:  _string,
        UserListId:  _string,
        UserListsCount:  _float,
        ValidationDetails:  _array,
        ValuePerConversionManyPerClick:  _float,
        ValuePerConvertedClick:  _float,
        ValuePerEstimatedTotalConversion:  _float,
        ViewThroughConversions:  _float,
        ViewThroughConversionsSignificance:  _float,
        Week:  _string,
        Year:  _string
    }

    var selectStatement = function(rows) {
        if(Array.isArray(rows)) {
            rows = rows.join(',')
        }
        settings.awqlOptions.select = rows;
        return {
            from: fromStatement
        }
    }

    var fromStatement = function(report) {
        settings.awqlOptions.from = report;
        return {
            where: whereStatement,
            and: andStatement,
            during: duringStatement
        }
    }

    var whereStatement = function(statement) {
        settings.awqlOptions.where = statement;
        return {
            and: andStatement,
            during: duringStatement
        }
    }

    var andStatement = function(statement) {
        if(!settings.awqlOptions.and) {
            settings.awqlOptions.and = [];
        }
        if(Array.isArray(statement)) {
            settings.awqlOptions.and = [].contact.apply([],settings.awqlOptions.and, statement)
        } else {
            settings.awqlOptions.and.push(statement)
        }
        return {
            and: andStatement,
            during: duringStatement
        }
    }

    var duringStatement = function(timeframe) {
        if(Array.isArray(timeframe)) {
            timeframe = timeframe.join(',');
        }
        settings.awqlOptions.during = timeframe;
        return {
            run: runAWQL
        }
    }

    var runAWQL = function() {
        var finalAWQL = settings.awqlOptions;
        if(typeof settings.awqlOptions === 'object') {
            finalAWQL =
                'SELECT ' +
                settings.awqlOptions.select +
                ' FROM ' +
                settings.awqlOptions.from;

            if(settings.awqlOptions.where) {
                finalAWQL += ' WHERE ' + settings.awqlOptions.where;
            }
            if(settings.awqlOptions.and) {
                finalAWQL += ' AND ' + settings.awqlOptions.and.join(' AND ');
            }
            if(settings.awqlOptions.during) {
                finalAWQL += ' DURING ' + settings.awqlOptions.during;
            } 
        } else if (typeof finalAWQL === 'String') {
            finalAWQL = finalAWQL.split(', ').join(',')
        }
        options = { includeZeroImpressions: settings.zeroImpression };
        settings.awqlOptions = {};
        Logger.log(finalAWQL)
        var report = AdWordsApp.report(finalAWQL, options);
        return parseResult(report)
    }

    var parseResult = function(data) {
        var finalObject = {};
        finalObject.data = [];
        var date = new Date().toLocaleDateString();
        if(settings.exportToSheet) {
            var spreadsheet = SpreadsheetApp.create('AdWordsReport - ' + date);
            data.exportToSheet(spreadsheet.getActiveSheet());
            finalObject.sheetUrl = spreadsheet.getUrl();
            finalObject.sheetId = spreadsheet.getId();
            finalObject.sheetName = spreadsheet.getName();
        }
        var rows = data.rows();
        while(rows.hasNext()) {
            var row = rows.next();
            var rowObject = {};
            var columnNames = Object.keys(row);
            columnNames.forEach(function(columnName){
                if(_columns[columnName] != undefined) {
                    var value = row[columnName];
                    return rowObject[columnName] = _columns[columnName](value);
                }
            })
            finalObject.data.push(rowObject);
        }
        return finalObject;
    }

    this.use = function(options) {
        if (typeof options === 'object') {
            if(typeof options.exportToSheet === 'boolean') {
                settings.exportToSheet = options.exportToSheet;
            }
            if(typeof options.zeroImpression === 'boolean') {
                settings.zeroImpression = options.zeroImpression;
            }
        } else {
            throw new Error('Wrong param "options"')
        }
    }

    this.awql = function(options) {
        if(options) {
            settings.awqlOptions = options;
            if(Array.isArray(settings.awqlOptions.select)) {
                settings.awqlOptions.select = settings.awqlOptions.select.join(',');
            }
            if(Array.isArray(settings.awqlOptions.during)) {
                settings.awqlOptions.during = settings.awqlOptions.during.joing(',');
            }
            return {
                run: runAWQL
            }
        }
        return {
            select: selectStatement
        }
    }
    return this
}