var BayesianTesting = function() {

    /**
     * The propability B beats A in a binary-outcome test
     * (eg. conversion rate). Based on
     * http://www.evanmiller.org/bayesian-ab-testing.html
     * 
     * @param  {int} alphaA number of success for A
     * @param  {int} betaA  number of failures for A
     * @param  {int} alphaB number of success for B
     * @param  {int} betaB  number of failures for B
     * @return {float}
     */
    this.propability_B_beats_A = function(alphaA, betaA, alphaB, betaB) {
        alphaA += 1;
        alphaB += 1;
        betaA += 1;
        betaB += 1;

        var total = 0.0;

        for (var i = 0; i < alphaB-1; i++) {
            total += Math.exp(lbeta(alphaA+i, betaB+betaA) - Math.log(betaB+i) 
                - lbeta(1+i, betaB) - lbeta(alphaA, betaA))
        }

        return total;
    }

    /**
     * The propability C beats A and B in a 
     * binary-outcome test (eg. conversion rate).
     * 
     * @param  {int} alphaA number of success for A
     * @param  {int} betaA  number of failures for A
     * @param  {int} alphaB number of success for B
     * @param  {int} betaB  number of failures for B
     * @param  {int} alphaC number of success for C
     * @param  {int} betaC  number of failures for C
     * @return {float}
     */
    this.propability_C_beats_A_and_B = function(alphaA, betaA, alphaB, betaB, alphaC, betaC) {
        alphaA += 1;
        alphaB += 1;
        alphaC += 1;
        betaA += 1;
        betaB += 1;
        betaC += 1;

        var total = 0.0;

        for(var i = 0; i < alphaA-1; i++) {
            for(var j = 0; j < alphaB-1; j++) {
                total += Math.exp(lbeta(alphaC+i+j, betaA+betaB+betaC) - 
                    Math.log(betaA+i) - Math.log(betaB+j) -
                    lbeta(1+i, betaA) - lbeta(1+j, betaB) - lbeta(alphaC, betaC))
            }
        }

        return 1 - this.propability_B_beats_A(alphaC-1,betaC-1,alphaA-1,betaA-1)
                 - this.propability_B_beats_A(alphaC-1,betaC-1,alphaB-1,betaB-1)
                 + total;
    }

    /**
     * Function for analyzing count data. Returns the propability
     * that group 1 has a higher arrivale rate than group 2.
     * http://www.evanmiller.org/bayesian-ab-testing.html#count_ab
     * 
     * @param  {int} alpha1 total events for group one
     * @param  {int} beta1  total exposure for group one
     * @param  {int} alpha2 total events for group two
     * @param  {int} beta2  total exposure for group two
     * @return {int}
     */
    this.propability_1_beats_2 = function(alpha1,beta1,alpha2,beta2) {
        var total = 0.0;

        for(var k = 0; k < alpha1-1; k++) {
            total += Math.exp(k * Math.log(beta1) + alpha2 * Math.log(beta2)
                - (k + alpha2) * Math.log(beta1 + beta2)
                - Math.log(k + beta2) - lbeta(k + 1, alpha2))
        }

        return total;
    }

    /**
     * Function for analyzing count data. Returns the propability
     * that group 1 has a higher arrivale rate than group 2 and group 3.
     * http://www.evanmiller.org/bayesian-ab-testing.html#count_ab
     * 
     * @param  {int} alpha1 total events for group one
     * @param  {int} beta1  total exposure for group one
     * @param  {int} alpha2 total events for group two
     * @param  {int} beta2  total exposure for group two
     * @param  {int} alpha3 total events for group three
     * @param  {int} beta3  total exposure for group three
     * @return {int}
     */
    this.propability_1_beats_2_and_3 = function(alpha1,beta1,alpha2,beta2,alpha3,beta3) {
        var total = 0.0;

        for(var k = 0; k < alpha2-1; k++) {
            for(var l = 0; l < alpha3-1; l++) {
                total += Math.exp(alpha1 * Math.log(beta1) + k * Math.log(beta2) + 1 * Math.log(beta3)
                    - (k+l+beta1) * Math.log(beta1 + beta2 + beta3)
                    + lgamma(k+l+alpha1) - lgamma(k+1) - lgamma(l+1) - lgamma(alpha1))
            }
        }

        return 1 - this.propability_1_beats_2(alpha2,beta2,alpha1,beta1)
                 - this.propability_1_beats_2(alpha3,beta3,alpha1,beta1)
                 + total;
    }

    var lgamma = function(x) {
        var j = 0;
        var cof = [
            76.18009172947146, -86.50532032941677, 24.01409824083091,
            -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
        ];
        var ser = 1.000000000190015;
        var xx, y, tmp;
        tmp = (y = xx = x) + 5.5;
        tmp -= (xx + 0.5) * Math.log(tmp);
        for (; j < 6; j++)
        ser += cof[j] / ++y;
        return Math.log(2.5066282746310005 * ser / xx) - tmp;        
    }

    var lbeta = function(x,y) {
        return lgamma(x) + lgamma(y) - lgamma(x + y);  
    }

}