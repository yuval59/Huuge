import 'dotenv'
import { z } from 'zod'

const envVariables = z.object({
  TWITCH_OAUTH_TOKEN: z.string(),
  MAKER_KEY: z.string(),
  LIFX_KEY: z.string(),
  RAINBOW_SCENE_UUID: z.string(),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

const config = envVariables.parse(process.env)

export default config
