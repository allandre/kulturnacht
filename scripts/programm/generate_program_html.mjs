/* eslint-disable no-console */
// call like "node generate_program_html.mjs"

import fs from 'node:fs/promises'
import path from 'path'
import { JSDOM } from 'jsdom'
import { prettify } from 'htmlfy'
import fillMobileDataTable from './fillMobileDataTable.mjs'
import { addEventRow, addShuttlebusRow, tableTitleForEvent } from './utils.mjs'
import { fileURLToPath } from 'node:url'
import { locationData } from './readData.mjs'
import locationNumberSpan from '../../site/js/serverAndClientHelpers.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const currentNodeVersion = process.versions.node
const wantedNodeVersion = (
  await fs.readFile(path.join(__dirname, '../../.nvmrc'), { encoding: 'utf8' })
).replace(/^v/, '')
if (!currentNodeVersion.startsWith(wantedNodeVersion)) {
  console.log(
    `Error: current Node version is ${currentNodeVersion}, but should match ${wantedNodeVersion}. You probably need to run 'nvm use'.`
  )
}

const { document } = new JSDOM().window

const programTableMobile = document.createElement('table')
programTableMobile.classList.add('mobile')
document.body.appendChild(programTableMobile)

const programTableDesktop = document.createElement('table')
programTableDesktop.classList.add('desktop')
document.body.appendChild(programTableDesktop)

const tableBodyDesktop = document.createElement('tbody')
programTableDesktop.appendChild(tableBodyDesktop)

const headerRowDesktop = document.createElement('tr')
tableBodyDesktop.appendChild(headerRowDesktop)

const addHeaderRowElementDesktop = (content, colspan = 1) => {
  const th = document.createElement('th')
  th.innerHTML = content
  th.colSpan = colspan
  headerRowDesktop.appendChild(th)
}

addHeaderRowElementDesktop('Ort', 2)
addHeaderRowElementDesktop('17.00')
addHeaderRowElementDesktop('18.00')
addHeaderRowElementDesktop('19.00')
addHeaderRowElementDesktop('20.00')
addHeaderRowElementDesktop('21.00')
addHeaderRowElementDesktop('22.00')

const mobileData = {
  '17.00': [],
  '18.00': [],
  '19.00': [],
  '20.00': [],
  '21.00': [],
  '22.00': []
}

for (const location of locationData) {
  const rowDesktop = document.createElement('tr')
  tableBodyDesktop.appendChild(rowDesktop)

  const addRowElementDesktop = (content, colspan = 1) => {
    const td = document.createElement('td')
    td.innerHTML = content
    td.colSpan = colspan
    rowDesktop.appendChild(td)

    return td
  }

  if (location.events === undefined) {
    console.log(`Warning: location ${location.id} does not have any events`)
    continue
  }

  addRowElementDesktop(locationNumberSpan(location.number))

  const locationCell = addRowElementDesktop(location.address)
  locationCell.classList.add('locationCell')

  let times = [
    undefined, // 17
    undefined, // 18
    undefined, // 19
    undefined, // 20
    undefined, // 21
    undefined // 22
  ]

  for (const event of location.events) {
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

      for (const time of eventTimes) {
        const timesIndex = time - 17
        if (times[timesIndex]) {
          throw new Error(
            `Time ${time} already set for location ${JSON.stringify(location)}`
          )
        }

        times[timesIndex] = event

        mobileData[`${time}.00`].push({
          event: event,
          location: location
        })
      }
    } else {
      // case "18-19"
      if (times.some(time => time !== undefined)) {
        throw new Error(
          `Two events are overlapping for location ${JSON.stringify(location)}`
        )
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
        addRowElementDesktop('')
      }

      const eventElement = addRowElementDesktop(
        tableTitleForEvent(event),
        length
      )
      eventElement.setAttribute('data-event', event.id)
      eventElement.setAttribute('onclick', 'toggleEventRow(this)')
      eventElement.classList.add('text-center')

      for (let i = endIndex; i < times.length; i++) {
        addRowElementDesktop('')
      }

      times = [] // clean times so that rows are not filled again

      // fill mobileData
      for (let i = start; i < end; i++) {
        mobileData[`${i}.00`].push({
          event: event,
          location: location
        })
      }
    }

    // add event row which is shown when clicking on an event
    await addEventRow(tableBodyDesktop, event)

    if (location.id === 'museum_haus_c_g_jung') {
      addShuttlebusRow(tableBodyDesktop)
    }
  }

  for (const event of times) {
    if (event) {
      const eventElement = addRowElementDesktop(tableTitleForEvent(event))
      eventElement.setAttribute('data-event', event.id)
      eventElement.setAttribute('onclick', 'toggleEventRow(this)')
    } else {
      addRowElementDesktop('')
    }
  }
}

await fillMobileDataTable(programTableMobile, mobileData)

await fs.writeFile(
  path.join(__dirname, '../../site/generated/program-table.html'),
  prettify(document.body.innerHTML)
)
