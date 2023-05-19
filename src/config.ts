import 'dotenv/config'
import { z } from 'zod'

const envVariables = z.object({
  //   TWITCH_OAUTH_TOKEN: z.string(),

  //   MAKER_KEY: z.string(),
  //   LIFX_KEY: z.string(),
  //   RAINBOW_SCENE_UUID: z.string(),

  NOTION_INTEGRATION_SECRET: z.string(),
  NOTION_SUB_DB: z.string(),
  NOTION_CHANGES_DB: z.string(),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

const config = envVariables.parse(process.env)

export default config
