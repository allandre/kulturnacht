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

export { tableTitleForEvent }
