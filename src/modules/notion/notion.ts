import { Client, isFullPage } from '@notionhq/client'
import day from 'dayjs'
import config from '../../config'
import { changeRefusalReasons, lightRules, notionFields } from '../../constants'
import {
  NotionChangePage,
  NotionCreateParams,
  NotionPageObjectResponse,
  NotionQueryDatabaseParameters,
  NotionSubscriptionPage,
} from './notion-types'
import { SubTypes, changeEligibility } from './types'

const client = new Client({
  auth: config.NOTION_INTEGRATION_SECRET,
})

export async function addSubscriber(
  username: string,
  subscriptionType: SubTypes = 'subscription'
) {
  const params: NotionCreateParams = {
    parent: {
      type: 'database_id',
      database_id: config.NOTION_SUB_DB,
    },

    properties: {
      [notionFields.subscriptions.username]: [
        {
          text: {
            content: username,
          },
        },
      ],

      [notionFields.subscriptions.subscriptionType]: [
        {
          text: {
            content: subscriptionType,
          },
        },
      ],

      [notionFields.subscriptions.subscribed]: { start: day().toISOString() },
    },
  }

  await client.pages.create(params)
}

export async function changeLight(username: string, color: string) {
  const params: NotionCreateParams = {
    parent: {
      type: 'database_id',
      database_id: config.NOTION_CHANGES_DB,
    },

    properties: {
      [notionFields.changes.username]: [
        {
          text: {
            content: username,
          },
        },
      ],

      [notionFields.changes.hex]: [
        {
          text: {
            content: color.toLowerCase(),
          },
        },
      ],

      [notionFields.changes.changed]: { start: day().toISOString() },
    },
  }

  await client.pages.create(params)
}

export async function isEligibleForChange(
  username: string,
  hexValue: string
): Promise<changeEligibility> {
  const latestSub = await getLatestSubEvent(username)
  if (!latestSub)
    return { canChange: false, reason: changeRefusalReasons.notSubbed }

  const latestSubTimestamp =
    latestSub.properties[notionFields.subscriptions.subscribed].date.start

  if (await wereLightsChanged(username, latestSubTimestamp))
    return { canChange: false, reason: changeRefusalReasons.alreadyChanged }

  const lastChange = await getLatestChange()

  if (
    //   If the last hexCode is the same
    lastChange &&
    lastChange.properties[notionFields.changes.hex].rich_text[0].plain_text ==
      hexValue
  )
    return { canChange: false, reason: changeRefusalReasons.sameColor }

  if (
    // If less than minimum delay minutes
    lastChange &&
    day().diff(
      day(lastChange.properties[notionFields.changes.changed].date.start),
      'minutes'
    ) < lightRules.minimumDelayInMinutes
  )
    return { canChange: false, reason: changeRefusalReasons.tooSoon }

  return { canChange: true }
}

async function getLatestSubEvent(username: string) {
  const query: NotionQueryDatabaseParameters = {
    database_id: config.NOTION_SUB_DB,

    sorts: [
      {
        property: notionFields.subscriptions.subscribed,
        direction: 'descending',
      },
    ],

    filter: {
      and: [
        {
          property: notionFields.subscriptions.username,
          rich_text: {
            equals: username,
          },
        },

        {
          property: notionFields.subscriptions.subscribed,
          date: {
            after: day()
              .subtract(lightRules.subscriptionTimeoutInDays, 'days')
              .toISOString(),
          },
        },
      ],
    },
  }

  return (
    await performNotionDatabaseQuery(query)
  )[0] as any as NotionSubscriptionPage
}

async function wereLightsChanged(
  username: string,
  latestSubTimestamp: string
): Promise<boolean> {
  const query: NotionQueryDatabaseParameters = {
    database_id: config.NOTION_CHANGES_DB,

    filter: {
      and: [
        {
          property: notionFields.changes.username,
          rich_text: {
            equals: username,
          },
        },

        {
          property: notionFields.changes.changed,
          date: {
            after: latestSubTimestamp,
          },
        },
      ],
    },
  }

  return (await performNotionDatabaseQuery(query)).length > 0
}

async function getLatestChange() {
  const query: NotionQueryDatabaseParameters = {
    database_id: config.NOTION_CHANGES_DB,

    sorts: [
      {
        property: notionFields.changes.changed,
        direction: 'descending',
      },
    ],
    page_size: 1,
  }

  return (await performNotionDatabaseQuery(query))[0] as any as NotionChangePage
}

async function performNotionDatabaseQuery(
  notionQuery: NotionQueryDatabaseParameters
): Promise<NotionPageObjectResponse[]> {
  const { results } = await client.databases.query(notionQuery)

  return results.filter(isFullPage) as NotionPageObjectResponse[]
}
