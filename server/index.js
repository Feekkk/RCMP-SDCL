import { createApp } from './app.js'
import { config } from './config.js'

const app = createApp()

app.listen(config.port, () => {
  console.log(`SDCL API listening on http://localhost:${config.port}`)
  if (config.enablePasswordLogin) {
    console.log('ID/password login is ENABLED (dev-only). Disable it in production via ENABLE_PASSWORD_LOGIN=false.')
  }
})
