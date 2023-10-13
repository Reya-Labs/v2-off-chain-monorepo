import { GetMarginAccountsForSwapLPResponse } from './types';
import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { Tokens } from '../../types';

// The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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

function randomToken() {
  const tokens: (Tokens | null)[] = [
    null,
    'dai',
    'eth',
    'reth',
    'steth',
    'usdc',
    'usdt',
  ];
  const randomIndex = Math.floor(Math.random() * tokens.length);
  return tokens[randomIndex];
}

const randomMarginAccountForSwapLP = (
  index: number,
): GetMarginAccountsForSwapLPResponse['marginAccounts'][0] => {
  const balance = getRandomIntInclusive(500, 150300);
  return {
    id: `ma_${index}`,
    chainId: randomChainId(),
    name: getRandomTwoLetterSentenceWithEmoji(),
    balance,
    initialMarginPreTrade: getRandomIntInclusive(500, 150300),
    settlementToken: randomToken(),
  };
};

export const mockedMarginAccounts: GetMarginAccountsForSwapLPResponse['marginAccounts'] =
  new Array(Math.floor(getRandomIntInclusive(5, 100)))
    .fill(0)
    .map((item, index) => randomMarginAccountForSwapLP(index));
