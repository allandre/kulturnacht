import { JSDOM } from 'jsdom'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import categories from '../../site/resources/categories.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function tableTitleForEvent(event) {
  let title = ''

  for (const category of event.categories) {
    title += categories[category].icon
  }
  title += ' ' + event.title

  return title
}

async function addEventRow(tableBody, event, mobile = false) {
  const { document } = new JSDOM().window

  const eventRow = document.createElement('tr')
  eventRow.style.display = 'none'
  eventRow.setAttribute('data-event', event.id)
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

  const container = document.createElement('div')
  container.classList.add('event-row-container')
  eventTd.appendChild(container)

  if (event.images) {
    const imageDiv = document.createElement('div')
    imageDiv.classList.add('image-container')
    container.appendChild(imageDiv)

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

      const imageWrapper = document.createElement('div')
      imageDiv.appendChild(imageWrapper)

      const img = document.createElement('img')
      // custom lazy loading hack since normal loading="lazy" did not work.
      img.setAttribute(
        'data-src',
        'site/resources/program-images/small/' + imageFileName
      )
      imageWrapper.appendChild(img)

      if (event.image_credits) {
        const imageCredits = document.createElement('div')
        imageCredits.innerHTML = '© ' + event.image_credits
        imageWrapper.appendChild(imageCredits)
      }
    }
  }

  const contentDiv = document.createElement('div')
  contentDiv.classList.add('content-container')
  container.appendChild(contentDiv)

  const titleDiv = document.createElement('div')
  titleDiv.classList.add('title-div')
  titleDiv.innerHTML = event.title
  contentDiv.appendChild(titleDiv)

  const descriptionDiv = document.createElement('div')
  descriptionDiv.innerHTML = event.description
  contentDiv.appendChild(descriptionDiv)

  const teamDiv = document.createElement('div')
  teamDiv.innerHTML = event.team
  contentDiv.appendChild(teamDiv)

  return eventRow
}

function addShuttlebusRow(tableBody) {
  const { document } = new JSDOM().window

  const shuttleRow = document.createElement('tr')
  shuttleRow.classList.add('shuttlebus')
  tableBody.appendChild(shuttleRow)

  const shuttleTd = document.createElement('td')
  shuttleTd.innerHTML =
    '🚌 <strong>Shuttlebus</strong> zum «Museum Haus C.G. Jung»: <strong>Hinfahrt</strong> ab «Allmendstrasse» um 17.50 h, 18.50 h und 19.50 h. <strong>Rückfahrt</strong> ca. 18.40 h, 19.40 h und 20.40 h.'
  shuttleTd.colSpan = 100
  shuttleTd.classList.add('text-center')
  shuttleRow.appendChild(shuttleTd)

  return shuttleRow
}

export { tableTitleForEvent, addEventRow, addShuttlebusRow }
