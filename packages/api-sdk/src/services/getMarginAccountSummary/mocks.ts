// The maximum is inclusive and the minimum is inclusive
import { SupportedChainId } from '@voltz-protocol/commons-v2';

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

function getRandomTwoLetterSentenceWithEmoji() {
  const twoLetterSentences = [
    'Aerial Acrobat',
    'Baking Maestro',
    'Art Lover',
    'Dancing Queen',
    'Gaming Guru',
    'Happy Hiker',
    'Joyful Juggler',
    'Kicking Kangaroo',
    'Lucky Leprechaun',
    'Magical Mermaid',
    'Sailing Captain',
    'Wandering Wizard',
    'Zesty Zebra',
    'Dynamic Diver',
    'Brave Biker',
    'Curious Coder',
    'Friendly Farmer',
    'Silly Scientist',
    'Energetic Explorer',
  ];

  const emojis = [
    '🤸‍♀️',
    '🪂',
    '🍰',
    '👨‍🍳',
    '🎨',
    '🖼️',
    '💃',
    '🎮',
    '🚶‍♂️',
    '🍀',
    '🧜‍♀️',
    '⛵',
    '🧙‍♂️',
    '🦓',
    '🛴',
    '🏇',
    '🌈',
    '🎢',
    '🎤',
    '🚀',
    '🍕',
    '👩‍🌾',
    '🔬',
    '🔭',
    '🚁',
    '🏄‍♀️',
    '🍿',
    '🍩',
    '🍹',
    '🎻',
    '🎯',
    '🎳',
    '🎲',
    '🥋',
    '🚴‍♂️',
    '🎭',
    '🏋️‍♂️',
    '🎱',
    '🌮',
    '🍔',
    '🍦',
    '🏓',
    '🥇',
    '🏆',
    '🎖️',
    '📚',
    '✈️',
    '🚒',
    '🚤',
    '🏰',
    '🚡',
    '🎡',
    '🎠',
    '🎫',
    '🎮',
    '🎯',
    '🎰',
    '🎲',
    '🎳',
  ];

  const randomSentenceIndex = Math.floor(
    Math.random() * twoLetterSentences.length,
  );
  const randomEmojiIndex = Math.floor(Math.random() * emojis.length);

  const randomSentence = twoLetterSentences[randomSentenceIndex];
  const randomEmoji = emojis[randomEmojiIndex];

  return `${randomSentence} ${randomEmoji}`;
}

const randomChainId = (): SupportedChainId => {
  const numbers: SupportedChainId[] = [1, 5, 42161, 421613, 43114, 43113];
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
};

export const getMarginAccountSummaryMock = (marginAccountId: string) => {
  return {
    id: marginAccountId,
    chainId: randomChainId(),
    name: getRandomTwoLetterSentenceWithEmoji(),
    totalPortfolioMarginValueUSD: getRandomIntInclusive(200, 100000),
    totalPortfolioRealizedPNLValueUSD: getRandomIntInclusive(200, 100000),
    totalPortfolioUnrealizedPNLValueUSD: getRandomIntInclusive(-100000, 100000),
    totalPortfolioNotionalValueUSD: getRandomIntInclusive(200, 100000),
    totalPortfolioCollateralValueUSD: getRandomIntInclusive(200, 100000),
    totalPositionsCount: getRandomIntInclusive(2, 100),
    marginRatioPercentage: getRandomIntInclusive(2, 99),
    marginRatioHealth: randomHealth(),
    distributions: getMockDistributions(),
  };
};
