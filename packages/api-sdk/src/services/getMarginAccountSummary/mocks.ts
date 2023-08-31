// The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getMockDistributions() {
  const tokens = ['dai', 'eth', 'other', 'usdc'];
  let totalPercentage = 100;
  return tokens.map((token, index) => {
    let percentage;
    if (index === tokens.length - 1) {
      percentage = totalPercentage;
    } else {
      percentage = getRandomIntInclusive(5, totalPercentage);
      totalPercentage -= percentage;
    }

    const distribution = getRandomIntInclusive(200, 10000);
    const distributionUSD = distribution * 200; // Assuming a fixed conversion rate of 1 token = $200 USD

    return {
      token,
      percentage,
      distribution,
      distributionUSD,
    };
  });
}

const randomHealth = () => {
  return Math.random() * 100 > 50
    ? 'healthy'
    : Math.random() * 100 > 50
    ? 'danger'
    : 'warning';
};

export const getMarginAccountSummaryMock = () => {
  return {
    totalPortfolioMarginValueUSD: getRandomIntInclusive(200, 100000),
    totalPortfolioRealizedPNLValueUSD: getRandomIntInclusive(200, 100000),
    totalPortfolioUnrealizedPNLValueUSD: getRandomIntInclusive(-100000, 100000),
    totalPortfolioNotionalValueUSD: getRandomIntInclusive(200, 100000),
    totalPortfolioCollateralValueUSD: getRandomIntInclusive(200, 100000),
    totalPositionsCount: getRandomIntInclusive(2, 100),
    marginRatioPercentage: getRandomIntInclusive(2, 99),
    marginRatioHealth: randomHealth(),
  };
};
