// call like "node generate_program_html.mjs"

import fs from 'node:fs/promises'

import path from 'path'
import { fileURLToPath } from 'url'
import JSONC from 'jsonc-parser'
import { JSDOM } from 'jsdom'
import { prettify } from 'htmlfy'

const { document } = new JSDOM().window

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const locationDataString = await fs.readFile(
  path.join(__dirname, 'locationData.jsonc'),
  { encoding: 'utf8' }
)
const locationData = JSONC.parse(locationDataString)
locationData.forEach(location => {
  if (!location?.id || !location?.address) {
    throw new Error(`Malformatted location: ${JSON.stringify(location)}`)
  }
})

const eventDataString = await fs.readFile(
  path.join(__dirname, 'eventData.jsonc'),
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

  const location = locationData.find(location => location.id === event.location)
  if (!location) {
    throw new Error(`Unknown location in event: ${JSON.stringify(event)}`)
  }

  location.events ??= []
  location.events.push(event)
})

const programTable = document.createElement('table')
document.body.appendChild(programTable)

const tableBody = document.createElement('tbody')
programTable.appendChild(tableBody)

const headerRow = document.createElement('tr')
tableBody.appendChild(headerRow)

const addHeaderRowElement = content => {
  const th = document.createElement('th')
  th.innerHTML = content
  headerRow.appendChild(th)
}

addHeaderRowElement('Ort')
addHeaderRowElement('17:00')
addHeaderRowElement('18:00')
addHeaderRowElement('19:00')
addHeaderRowElement('20:00')
addHeaderRowElement('21:00')
addHeaderRowElement('22:00')
addHeaderRowElement('23:00')

locationData.forEach(location => {
  const row = document.createElement('tr')
  tableBody.appendChild(row)

  const addRowElement = content => {
    const td = document.createElement('td')
    td.innerHTML = content
    row.appendChild(td)
  }

  addRowElement(location.address)

  const times = [
    '', // 17
    '', // 18
    '', // 19
    '', // 20
    '', // 21
    '', // 22
    '' // 23
  ]

  location.events.forEach(event => {
    if (typeof event.times !== 'string' || !event.times.includes('-')) {
      let eventTimes = event.times
      if (typeof eventTimes === 'string') {
        eventTimes = [parseInt(eventTimes)]
      } else if (typeof eventTimes === 'number') {
        if (eventTimes === 1630) {
          console.warn(`Event ${event.title} is skipped, because of time ${eventTimes}`) // eslint-disable-line prettier/prettier
          return // skip this case for now
        }

        eventTimes = [eventTimes]
      }

      eventTimes.forEach(time => {
        const timesIndex = time - 17
        if (times[timesIndex] !== '') {
          throw new Error(`Time ${time} already set for location ${JSON.stringify(location)}`) // eslint-disable-line prettier/prettier
        } else {
          times[timesIndex] = event.title
        }
      })
    } else {
      console.warn(`Time handling not yet implemeted for ${event.times}`)
      // case "18-19"
    }
  })

  times.forEach(time => {
    addRowElement(time)
  })
})

await fs.writeFile(
  path.join(__dirname, '../../site/generated/program-table.html'),
  prettify(document.body.innerHTML)
)
