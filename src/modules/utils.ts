import { KnownColor, responses } from '../constants'
import { changeLight, isEligibleForChange } from './notion/notion'

export type ChangeColorParams = {
  username: string
  colorHex: string
  colorName?: KnownColor
  named?: boolean
  messageId: string
  channel: string
  replyFunction: Function
}

export async function changeColor(params: ChangeColorParams) {
  const {
    channel,
    colorHex,
    messageId,
    replyFunction,
    username,
    named,
    colorName,
  } = params

  const res = await isEligibleForChange(username, colorHex)

  if (!res.canChange) {
    replyFunction(messageId, channel, res.reason!)
    return
  }

  replyFunction(
    messageId,
    channel,
    named ? responses.changeNamed(colorName!) : responses.changeHex(colorHex)
  )

  changeLight(username, colorHex)
}
