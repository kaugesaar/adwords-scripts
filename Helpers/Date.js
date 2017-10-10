/**
* Return a query friendly date string
* from a Date Object.
*/
if(! Date.toAdWordsString) {
    Date.prototype.toAdWordsString = function () {
        var y = String(this.getFullYear());
        var m = this.getMonth() + 1;
        var d = this.getDate();
        m = (m < 10) ? '0' + m : String(m);
        d = (d < 10) ? '0' + d : String(d);
        return y + m + d;
    };
}

/**
* Convert the Date object so that it reflects the accounts
* time zone and current time rather than the local time of
* google adwords scripts environment.
*/
if(! Date.setToAccountTimeZone) {
    Date.prototype.setToAccountTimeZone = function () {
        return new Date(Utilities.formatDate(this,
            AdWordsApp.currentAccount().getTimeZone(),
            "MMM dd,yyyy HH:mm:ss")
        );
    };
}
