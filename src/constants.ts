export const colors = {
  red: 'ff0000',
  green: '00ff00',
  blue: '0000ff',
  yellow: 'ffff00',
  magenta: 'ff00ff',
  purple: 'bf00ff',
  pink: 'ff00bf',
  cyan: '00ffff',
  white: 'ffffff',
  orange: 'ff8000',
} as const

export const lightRules = {
  subscriptionTimeoutInDays: 5,
  minimumDelayInMinutes: 5,
  giftMinimum: 5,
} as const

export const notionFields = {
  subscriptions: {
    username: 'username',
    subscribed: 'subscribed',
    subscriptionType: 'subscription-type',
  },
  changes: {
    username: 'username',
    hex: 'hex',
    changed: 'changed',
  },
} as const

export const changeRefusalReasons = {
  alreadyChanged: 'You have already changed the color of the lights!',
  tooSoon: `Please wait ${lightRules.minimumDelayInMinutes} minutes before changing the color of the lights.`,
  sameColor:
    'The color you are trying to change to is the current color. Please change to a new color.',
  notSubbed: `You have not subscribed in the last ${lightRules.subscriptionTimeoutInDays} days.`,
} as const

export const subscriptionTypes = {
  subscription: 'subscription',
  gift: 'gift',
  gifter: 'gifter',
} as const
