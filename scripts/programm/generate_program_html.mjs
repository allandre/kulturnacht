// call like "node generate_program_html.mjs"

import fs from 'node:fs/promises'

import path from 'path'
import { fileURLToPath } from 'url'
import JSONC from 'jsonc-parser'
import { JSDOM } from 'jsdom'
import { prettify } from 'htmlfy'

function getIconForCategory(category) {
  const iconForCategory = {
    guide: '&#x1F46E;',
    music: '&#x1F3B5;',
    language: '&#x1F4AC;',
    exposition: '&#x1F5BC;',
    theater: '&#x1F3AD;',
    food: '&#x1F374;',
    'food-brezel': '&#x1F968;',
    'food-ice': '&#x1F374;',
    'food-vine': '&#x1F377;',
    'food-cake': '&#x1F370;',
    'food-coffee': '&#x2615;',
    finale: '&#x1F386;'
  }

  const icon = iconForCategory[category]

  if (!icon) {
    throw new Error(`Missing icon for category ${category}`)
  }

  return icon
}

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

const programTable = document.createElement('table')
document.body.appendChild(programTable)

const tableBody = document.createElement('tbody')
programTable.appendChild(tableBody)

const headerRow = document.createElement('tr')
tableBody.appendChild(headerRow)

const addHeaderRowElement = (content, colspan = 1) => {
  const th = document.createElement('th')
  th.innerHTML = content
  th.colSpan = colspan
  headerRow.appendChild(th)
}

addHeaderRowElement('Ort', 2)
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

  const addRowElement = (content, colspan = 1) => {
    const td = document.createElement('td')
    td.innerHTML = content
    td.colSpan = colspan
    row.appendChild(td)
  }

  const introEventIndex = location.events.findIndex(
    event => event.times === 1630
  )

  if (introEventIndex >= 0) {
    addRowElement(location.address)

    const introEvent = location.events[introEventIndex] 
    let title = '16.30: '
    introEvent.categories.forEach(category => {
      title += getIconForCategory(category)
    })
    title += ' ' + introEvent.title

    addRowElement(title)
    location.events.splice(introEventIndex, 1)
  } else {
    addRowElement(location.address, 2)
  }

  let times = [
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
        if (eventTimes > 23) {
          throw new Error(`We currently cannot handle times like ${eventTimes}`)
        }

        eventTimes = [eventTimes]
      }

      eventTimes.forEach(time => {
        const timesIndex = time - 17
        if (times[timesIndex] !== '') {
          throw new Error(`Time ${time} already set for location ${JSON.stringify(location)}`) // eslint-disable-line prettier/prettier
        } else {
          event.categories.forEach(category => {
            times[timesIndex] += getIconForCategory(category)
          })
          times[timesIndex] += ' ' + event.title
        }
      })
    } else {
      // case "18-19"
      if (times.some(time => time !== '')) {
        // eslint-disable-next-line prettier/prettier
        throw new Error(`Two events are overlapping for locatio ${JSON.stringify(location)}`)
      }

      const time = event.times
      const start = time.substring(0, 2)
      const end = time.substring(3, 5)

      if (`${start}-${end}` !== time) {
        throw new Error(`Something went wrong when parsing ${time}`)
      }

      const startIndex = start - 17
      const endIndex = end - 17
      const length = end - start

      for (let i = 0; i < startIndex; i++) {
        addRowElement('')
      }

      let title = ''
      event.categories.forEach(category => {
        title += getIconForCategory(category)
      })
      title += ' ' + event.title
      addRowElement(title, length)

      for (let i = endIndex; i < times.length; i++) {
        addRowElement('')
      }

      times = [] // clean times so that rows are not filled again
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
