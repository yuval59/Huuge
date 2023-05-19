import { subscriptionTypes } from '../../constants'

export type SubTypes =
  (typeof subscriptionTypes)[keyof typeof subscriptionTypes]

export type changeEligibility = {
  canChange: boolean
  reason?: string
}
