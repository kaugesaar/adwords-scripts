/**
 * Propability B beats A, a bayesian 
 * method for a/b testing. Based on 
 * http://www.evanmiller.org/bayesian-ab-testing.html
 * 
 * @param  {number} alphaA [is the number of successes for a]
 * @param  {number} betaA  [is the number of failures for a]
 * @param  {number} alphaB [is the number of successes for b]
 * @param  {number} betaB  [is the number of failures for b]
 * @return {number}        [the propability B beats A]
 */
function bayesianAB(alphaA, betaA, alphaB, betaB) {
    
    alphaA += 1;
    alphaB += 1;
    betaA  += 1;
    betaB  += 1;

    total = 0.0;

    for (var i = 0; i < alphaB-1; i++) {
        
        total += Math.exp(lbeta(alphaA+i, betaB+betaA) - 
                          Math.log(betaB+i) - 
                          lbeta(1+i, betaB) - 
                          lbeta(alphaA, betaA))
    }

    return total;

}

/**
 * Log Gamma Function
 */
function lgamma(x) {
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

/**
 * Log Beta Function
 */
function lbeta(x,y){
    return lgamma(x) + lgamma(y) - lgamma(x + y);    
}