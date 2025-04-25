import { JSDOM } from 'jsdom'

const { document } = new JSDOM().window

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

  event.categories.forEach(category => {
    title += getIconForCategory(category)
  })
  title += ' ' + event.title

  return title
}

function addEventRow(tableBody, event, mobile = false) {
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

  const imageDiv = document.createElement('div')
  eventTd.appendChild(imageDiv)

  event.images.forEach(image => {
    
  })

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
