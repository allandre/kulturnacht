import { JSDOM } from 'jsdom'
import { addEventRow, addShuttlebusRow, tableTitleForEvent } from './utils.mjs'

async function fillMobileDataTable(tableElement, data) {
  const { document } = new JSDOM().window

  const tableBody = document.createElement('tbody')
  tableElement.appendChild(tableBody)

  for (const time of Object.keys(data)) {
    const row = document.createElement('tr')
    tableBody.appendChild(row)

    const th = document.createElement('th')
    th.classList.add('time-cell')
    th.colSpan = 2
    th.setAttribute('data-time', time)
    th.setAttribute('onclick', 'expandTime(this)')
    row.appendChild(th)

    const expandDiv = document.createElement('div')
    expandDiv.classList.add('expand')
    expandDiv.innerHTML = '❯'
    th.appendChild(expandDiv)

    const timeSpan = document.createElement('span')
    timeSpan.innerHTML = time
    th.appendChild(timeSpan)

    for (const singleData of data[time]) {
      const event = singleData.event

      const singleRow = document.createElement('tr')
      singleRow.style.display = 'none'
      singleRow.classList.add('event-row')
      singleRow.setAttribute('data-time', time)
      tableBody.appendChild(singleRow)

      const locationTd = document.createElement('td')
      locationTd.innerHTML = singleData.location.address
      locationTd.classList.add('locationCell')
      singleRow.appendChild(locationTd)

      const eventTd = document.createElement('td')
      eventTd.innerHTML = tableTitleForEvent(event)
      eventTd.setAttribute('data-event', event.id)
      eventTd.setAttribute('data-time', time)
      eventTd.setAttribute('onclick', 'toggleEventRow(this)')
      singleRow.appendChild(eventTd)

      if (event.location === 'museum_haus_c_g_jung') {
        const shuttleRow = addShuttlebusRow(tableBody)
        shuttleRow.style.display = 'none'
        shuttleRow.setAttribute('data-time', time)
        shuttleRow.classList.add('event-row')
      }

      const eventRow = await addEventRow(tableBody, event, true)
      eventRow.setAttribute('data-time', time)
    }
  }
}

export default fillMobileDataTable
