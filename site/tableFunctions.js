;(function () {
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

    document
      .querySelectorAll('td.current')
      .forEach(e => e.classList.remove('current'))

    const eventId = element.getAttribute('data-event')
    // let eventRow = document.querySelector(`tr[data-event="${eventId}"]`)
    let eventRow = element.closest('table').querySelector(`tr[data-event="${eventId}"]`)

    const time = element.getAttribute('data-time')
    console.log("time", time)
    if (time) {
      eventRow = document.querySelector(
        `tr[data-event="${eventId}"][data-time="${time}"]`
      )
    }

    document.querySelectorAll('tr[data-event]').forEach(e => {
      e.style.display = 'none'
    })

    if (currentlyHidden) {
      element.classList.add('current')
      eventRow.style.removeProperty('display')
    }
  }

  window.toggleEventRow = toggleEventRow
})()
