import { GetMarginAccountsResponse } from './types';
import { SupportedChainId } from '@voltz-protocol/commons-v2';

// The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const randomHealth = () => {
  return Math.random() * 100 > 50
    ? 'healthy'
    : Math.random() * 100 > 50
    ? 'danger'
    : 'warning';
};

const randomChainId = (): SupportedChainId => {
  const numbers: SupportedChainId[] = [1, 5, 42161, 421613, 43114, 43113];
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
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

const randomMarginAccount = (
  index: number,
): GetMarginAccountsResponse['marginAccounts'][0] => ({
  id: `ma_${index}`,
  chainId: randomChainId(),
  name: getRandomTwoLetterSentenceWithEmoji(),
  balance: getRandomIntInclusive(500, 150300),
  positionsCount: getRandomIntInclusive(4, 11),
  marginRatioPercentage: getRandomIntInclusive(2, 99),
  marginRatioHealth: randomHealth(),
});

export const mockedMarginAccounts: GetMarginAccountsResponse['marginAccounts'] =
  new Array(Math.floor(getRandomIntInclusive(5, 100)))
    .fill(0)
    .map((item, index) => randomMarginAccount(index));
