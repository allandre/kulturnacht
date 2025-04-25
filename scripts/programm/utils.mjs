import { JSDOM } from 'jsdom'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

function tableTitleForEvent(event) {
  let title = ''

  for (const category of event.categories) {
    title += getIconForCategory(category)
  }
  title += ' ' + event.title

  return title
}

async function addEventRow(tableBody, event, mobile = false) {
  const { document } = new JSDOM().window

  const eventRow = document.createElement('tr')
  tableBody.appendChild(eventRow)

  if (!mobile) {
    const locationTd = document.createElement('td')
    locationTd.colSpan = 2
    eventRow.appendChild(locationTd)
  }

  const eventTd = document.createElement('td')
  eventTd.colSpan = 100
  eventTd.classList.add('event-row')
  eventRow.appendChild(eventTd)

  if (event.images) {
    const imageDiv = document.createElement('div')
    eventTd.appendChild(imageDiv)

    const imagesFolder = path.join(
      __dirname,
      '../../site/resources/program-images/small'
    )
    const allImages = await fs.readdir(imagesFolder)
    for (const image of event.images) {
      const files = allImages.filter(elm => elm.match(new RegExp(image)))

      if (files.length !== 1) {
        throw new Error(`Error: Could not find image ${image}`)
      }

      const imageFileName = path.basename(files[0])

      const img = document.createElement('img')
      img.src = imageFileName
      imageDiv.appendChild(img)
    }
  }

  const contentDiv = document.createElement('div')
  eventTd.appendChild(contentDiv)

  const titleDiv = document.createElement('div')
  titleDiv.innerHTML = event.title
  contentDiv.appendChild(titleDiv)

  const descriptionDiv = document.createElement('div')
  descriptionDiv.innerHTML = event.description
  contentDiv.appendChild(descriptionDiv)

  const teamDiv = document.createElement('div')
  teamDiv.innerHTML = event.team
  contentDiv.appendChild(teamDiv)
}

export { tableTitleForEvent, addEventRow }
