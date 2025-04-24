;(function () {
  const expandTime = clickedElement => {
    const time = clickedElement.getAttribute('data-time')

    const arrowDiv = document.querySelector(`[data-time="${time}"] .expand`)
    arrowDiv.classList.toggle('collapse')

    document
      .querySelectorAll(`.event-row[data-time="${time}"]`)
      .forEach(element => {
        element.style.display = 'block'
      })
  }

  window.expandTime = expandTime
})()
