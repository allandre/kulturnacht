;(function () {
  const expandTime = clickedElement => {
    const time = clickedElement.getAttribute('data-time')

    const arrowDiv = document.querySelector(`[data-time="${time}"] .expand`)

    const currentlyCollapsed = !arrowDiv.classList.contains('collapse')

    document.querySelectorAll('.expand').forEach(e => {
      e.classList.remove('collapse')
    })

    document.querySelectorAll('.event-row').forEach(e => {
      e.style.display = 'none'
    })

    if (currentlyCollapsed) {
      arrowDiv.classList.add('collapse')

      document
        .querySelectorAll(`.event-row[data-time="${time}"]`)
        .forEach(element => {
          element.style.removeProperty('display')
        })
    }
  }

  window.expandTime = expandTime
})()
