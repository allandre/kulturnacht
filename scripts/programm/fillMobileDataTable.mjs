import { JSDOM } from 'jsdom'
import { tableTitleForEvent } from './utils.mjs'

const fillMobileDataTable = (tableElement, data) => {
  const { document } = new JSDOM().window

  const tableBody = document.createElement('tbody')
  tableElement.appendChild(tableBody)

  Object.keys(data).forEach(time => {
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

    data[time].forEach(singleData => {
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
      eventTd.innerHTML = tableTitleForEvent(singleData.event)
      singleRow.appendChild(eventTd)
    })
  })
}

export default fillMobileDataTable
