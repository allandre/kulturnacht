// dont pollute global namespace. Also this way we can better check what is used inside and what outside of this script.
;(function () {
  // calculate days until eventDate, and display on title image
  function showCountdown() {
    const eventDate = new Date(2025, 8, 5) // 5.9.25 // month is 0 indexed.

    // get remaining days until event
    const oneDay = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    const today = Date.now()
    const diffDays = Math.round((eventDate - today + oneDay) / oneDay)

    const countdownElement = document.getElementById('countdown')
    if (countdownElement) {
      let text = 'Noch ' + diffDays + ' Tage'

      switch (diffDays) {
        case 2:
          text = 'Übermorgen ist die'
          break
        case 1:
          text = 'Morgen ist die'
          break
        case 0:
          text = 'Heute ist die'
          break
      }

      if (diffDays < 0) {
        text = "Das war's! Bis zum nächsten Mal!"
      }

      countdownElement.innerHTML = text
    }
  }

  async function insertProgramLegend(element) {
    const response = await fetch('site/resources/categories.json')
    const categories = await response.json()

    const header = document.createElement('h6')
    header.innerHTML = 'Legende:'
    element.appendChild(header)

    for (const category of [
      'exposition',
      'guide',
      'music',
      'theater',
      'language',
      'food',
      'finale'
    ]) {
      let categoryText = ''

      if (category === 'food') {
        for (const subcategory of [
          'food-brezel',
          'food',
          'food-ice',
          'food-cake',
          'food-coffee',
          'food-vine'
        ]) {
          categoryText += categories[subcategory].icon
        }

        categoryText += ' '
      } else {
        categoryText += categories[category].icon + ' '
      }

      categoryText += categories[category].name

      const categoryDiv = document.createElement('div')
      categoryDiv.innerHTML = categoryText
      element.appendChild(categoryDiv)
    }
  }

  async function loadProgramTable() {
    const programLegend = document.querySelector('#program-legend')
    const programTable = document.querySelector('#program-table')

    if (!programTable) {
      // eslint-disable-next-line no-console
      console.log('Error: Could not find the program table element.')
      return
    }

    try {
      try {
        await insertProgramLegend(programLegend)
      } catch (e) {
        programLegend.innerHTML = ''
        throw e
      }

      const response = await fetch('site/generated/program-table.html')
      programTable.innerHTML = await response.text()
    } catch (e) {
      programTable.innerHTML =
        '&#x26A0;&#xFE0F; Leider ist ein Fehler beim Laden des Programms aufgetreten.'
      throw e
    }
  }

  window.addEventListener('load', () => {
    showCountdown()
    loadProgramTable()
  })
})()
