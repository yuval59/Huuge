import tmi from 'tmi.js'
import config from '../config'
import {
  colors,
  isCommand,
  isKnownColor,
  lightRules,
  responses,
  subscriptionTypes,
} from '../constants'
import { addSubscriber } from './notion/notion'
import { changeColor } from './utils'

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },

  //Get OAUTH at https://twitchapps.com/tmi/
  identity: {
    username: config.TWITCH_USERNAME,
    password: config.TWITCH_OAUTH_TOKEN,
  },
  channels: [config.TWITCH_CHANNEL],
})

export default function startServer() {
  client.connect().catch((error) => console.error(error))
}

client.on('connected', () => {
  console.log('connected')
})

client.on('message', (channel, tags, message, self) => {
  if (self || message[0] != '!') return

  const separated = message.toLowerCase().split(' ')

  if (isCommand(separated[0])) {
    switch (separated[0]) {
      case '!colour': {
        reply(tags.id!, channel, responses.colour)
        break
      }

      case '!color': {
        if (separated[1] && separated[1] == 'list')
          return reply(tags.id!, channel, responses.list)

        if (separated[1] && isKnownColor(separated[1]))
          return changeColor({
            channel,
            messageId: tags.id!,
            username: tags['display-name']!,
            replyFunction: reply,
            colorHex: `#${colors[separated[1]]}`,
            named: true,
            colorName: separated[1],
          })

        if (
          separated[1] &&
          separated[1].match('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
        )
          return changeColor({
            channel,
            messageId: tags.id!,
            username: tags['display-name']!,
            replyFunction: reply,
            colorHex: separated[1],
          })

        reply(tags.id!, channel, responses.explainColor)

        break
      }

      case '!hype': {
        break
      }
    }
  }
})

client.on('subscription', (channel, username, methods, msg, tags) => {
  console.log('-----------subscription event has been called-----------')

  addSubscriber(username)
})
client.on('resub', (channel, username, methods, msg, tags) => {
  console.log('-----------subscription event has been called-----------')

  addSubscriber(username)
})

client.on(
  'subgift',
  (channel, username, recipient, methods, tags, userstate) => {
    console.log('-----------subgift event has been called-----------')

    if (userstate['msg-param-recipient-display-name'])
      addSubscriber(
        userstate['msg-param-recipient-display-name'],
        subscriptionTypes.gift
      )
  }
)

client.on('submysterygift', (channel, username, giftSubCount, methods, tag) => {
  console.log('-----------submysterygift event has been called-----------')

  if (giftSubCount >= lightRules.giftMinimum) {
    client.say(
      channel,
      `Hi @${username} - You have gifted five or more subs and are therefor eligible to change the stream lights color. Please use !color for further instructions.`
    )

    addSubscriber(username, subscriptionTypes.gifter)
  }
})

function reply(
  replyParentMessageId: string,
  channel: string,
  replyMessage: string
) {
  return client.raw(
    `@reply-parent-msg-id=${replyParentMessageId} PRIVMSG ${channel} :${replyMessage}`
  )
}
