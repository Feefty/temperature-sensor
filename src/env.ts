import { z } from 'zod'
import 'dotenv/config'
/*
Declare all your env variables there with their type, at runtime it will check if all required
env variables are there, if not it will stop the software
 */
const envVariables = z.object({
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    APP_PORT: z.string()
})
envVariables.parse(process.env)
declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envVariables> {}
    }
}