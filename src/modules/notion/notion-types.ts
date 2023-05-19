import {
  CreatePageParameters,
  GetPageParameters,
  PageObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints'
import { notionFields } from '../../constants'

export type NotionPageObjectResponse = PageObjectResponse
export type NotionQueryDatabaseParameters = QueryDatabaseParameters
export type NotionQueryFilter = QueryDatabaseParameters['filter']
export type NotionQueryPageParameters = GetPageParameters
export type NotionCreateParams = CreatePageParameters

export type NotionInnerText = {
  type: string
  plain_text: string
}
export type NotionTitle = {
  id: string
  type: string
  title: NotionInnerText[]
}
export type NotionText = {
  id: string
  type: string
  rich_text: NotionInnerText[]
}
export type NotionCheckbox = {
  id: string
  type: string
  checkbox: boolean
}
export type NotionDate = {
  id: string
  type: string
  date: {
    start: string
    end?: string
  }
}
export type NotionRelation = {
  id: string
  type: string
  relation: { id: string }[]
  has_more: boolean
}

export type NotionChangePage = {
  properties: {
    [notionFields.changes.username]: NotionTitle
    [notionFields.changes.hex]: NotionText
    [notionFields.changes.changed]: NotionDate
  }
}

export type NotionSubscriptionPage = {
  properties: {
    [notionFields.subscriptions.username]: NotionTitle
    [notionFields.subscriptions.subscriptionType]: NotionText
    [notionFields.subscriptions.subscribed]: NotionDate
  }
}
