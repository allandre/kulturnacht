;(function () {
  function collapseAllEventDetailRows() {
    document.querySelectorAll('tr[data-event]').forEach(e => {
      e.style.display = 'none'
    })

    document
      .querySelectorAll('td.current')
      .forEach(e => e.classList.remove('current'))
  }

  const expandTime = clickedElement => {
    const time = clickedElement.getAttribute('data-time')

    const arrowDiv = document.querySelector(`[data-time="${time}"] .expand`)

    const currentlyCollapsed = !arrowDiv.classList.contains('collapse')

    for (const e of document.querySelectorAll('.expand')) {
      e.classList.remove('collapse')
    }

    for (const e of document.querySelectorAll('tr.event-row')) {
      e.style.display = 'none'
    }

    collapseAllEventDetailRows()

    if (currentlyCollapsed) {
      arrowDiv.classList.add('collapse')

      for (const element of document.querySelectorAll(
        `.event-row[data-time="${time}"]`
      )) {
        element.style.removeProperty('display')
      }
    }
  }

  window.expandTime = expandTime

  function toggleEventRow(element) {
    const currentlyHidden = !element.classList.contains('current')
    const oldXPosition = element.getBoundingClientRect().left
    const oldYPosition = element.getBoundingClientRect().top

    collapseAllEventDetailRows()

    const eventId = element.getAttribute('data-event')

    let eventRow = element
      .closest('table')
      .querySelector(`tr[data-event="${eventId}"]`)

    const time = element.getAttribute('data-time')

    if (time) {
      eventRow = document.querySelector(
        `tr[data-event="${eventId}"][data-time="${time}"]`
      )
    }

    if (currentlyHidden) {
      eventRow.querySelectorAll('img').forEach(img => {
        const dataSrc = img.getAttribute('data-src')
        if (dataSrc) {
          img.src = dataSrc
          img.removeAttribute('data-src')
        }
      })

      element.classList.add('current')
      eventRow.style.removeProperty('display')
    }

    const newXPosition = element.getBoundingClientRect().left
    const newYPosition = element.getBoundingClientRect().top

    if (newXPosition !== oldXPosition || newYPosition !== oldYPosition) {
      // On macOS Firefox after the above code somehow the window often (not always) scrolls down to the Anreise section. When it happens, it only happens on the first click on an event element after loading the page.
      window.scrollBy(newXPosition - oldXPosition, newYPosition - oldYPosition)
    }
  }

  window.toggleEventRow = toggleEventRow

  function toggleStartEndEvent(element) {
    const arrowElement = element.querySelector('.arrow')
    arrowElement.classList.toggle('arrow-open')

    element.querySelectorAll('.toggle').forEach(e => {
      e.classList.toggle('toggle-on')
    })

    arrowElement.parentElement
      .querySelector('.location-number')
      .classList.toggle('hidden')
  }

  window.toggleStartEndEvent = toggleStartEndEvent
})()
