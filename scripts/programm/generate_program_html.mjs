// call like "node generate_program_html.mjs"

import fs from 'node:fs/promises'

import path from 'path'
import { fileURLToPath } from 'url'
import JSONC from 'jsonc-parser'
import { JSDOM } from 'jsdom'
import { prettify } from 'htmlfy'

const { document } = new JSDOM().window

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const eventDataString = await fs.readFile(
  path.join(__dirname, 'eventData.jsonc'),
  { encoding: 'utf8' }
)
const eventData = JSONC.parse(eventDataString)

const locationDataString = await fs.readFile(
  path.join(__dirname, 'locationData.jsonc'),
  { encoding: 'utf8' }
)
const locationData = JSONC.parse(locationDataString)

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
addHeaderRowElement('18:00')
addHeaderRowElement('19:00')
addHeaderRowElement('20:00')
addHeaderRowElement('21:00')
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
})

await fs.writeFile(
  path.join(__dirname, '../../site/generated/program-table.html'),
  prettify(document.body.innerHTML)
)
