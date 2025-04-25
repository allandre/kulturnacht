import { fileURLToPath } from 'url'
import JSONC from 'jsonc-parser'
import path from 'path'
import fs from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const locationDataString = await fs.readFile(
  path.join(__dirname, 'data/locationData.jsonc'),
  { encoding: 'utf8' }
)
const locationData = JSONC.parse(locationDataString)
locationData.forEach(location => {
  if (!location?.id || !location?.address) {
    throw new Error(`Malformatted location: ${JSON.stringify(location)}`)
  }
})

const eventDataString = await fs.readFile(
  path.join(__dirname, 'data/eventData.jsonc'),
  { encoding: 'utf8' }
)
const eventData = JSONC.parse(eventDataString)
eventData.forEach(event => {
  if (
    !event.title ||
    !event.description ||
    !event.team ||
    !event.categories ||
    !event.times ||
    !event.location ||
    !event.host
  ) {
    throw new Error(`Malformatted event: ${JSON.stringify(event)}`)
  }

  if (typeof event.categories === 'string') {
    event.categories = [event.categories]
  }

  const location = locationData.find(location => location.id === event.location)
  if (!location) {
    throw new Error(`Unknown location in event: ${JSON.stringify(event)}`)
  }

  location.events ??= []
  location.events.push(event)
})

export { locationData }
