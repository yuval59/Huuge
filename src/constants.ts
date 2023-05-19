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
export type KnownColor = keyof typeof colors

export function isKnownColor(color: string): color is KnownColor {
  if (colors[color as KnownColor]) return true
  return false
}

export const commands = ['!color', '!colour', '!hype'] as const
export type CommandType = (typeof commands)[number]

export function isCommand(command: string): command is CommandType {
  if (commands.includes(command as CommandType)) return true
  return false
}

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

export const responses = {
  colour: 'No.',
  list: `The known colors are [${Object.keys(colors).join(', ')}]`,
  explainColor: `Use the command like so: "!color [hexRGB value]" or "!color [from color list]"`,
  changeHex: (hex: string) => `Changing the light color to ${hex}`,
  changeNamed: (color: KnownColor) =>
    `Changing the light color to ${color} [ #${colors[color]} ]`,
} as const
