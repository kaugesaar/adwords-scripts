var BayesianTesting = function() {

    /**
     * The propability B beats A in a binary-outcome test. Based on
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
     * The propability C beats A and B in a binary-outcome test.
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