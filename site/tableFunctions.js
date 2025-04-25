;(function () {
  const expandTime = clickedElement => {
    const time = clickedElement.getAttribute('data-time')

    const arrowDiv = document.querySelector(`[data-time="${time}"] .expand`)

    const currentlyCollapsed = !arrowDiv.classList.contains('collapse')

    for (const e of document.querySelectorAll('.expand')) {
      e.classList.remove('collapse')
    }

    for (const e of document.querySelectorAll('.event-row')) {
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
})()
