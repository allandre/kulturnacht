;(function () {
  const impressionsFolder = 'site/resources/impression-images'
  const impressions = [
    '8G9A0646.jpg',
    '8G9A0204.jpg',
    '8G9A0235.jpg',
    '8G9A0282.jpg',
    '8G9A0293.jpg',
    '8G9A0296.jpg',
    '8G9A0301.jpg',
    '8G9A0309.jpg',
    '8G9A0312.jpg',
    '8G9A0327.jpg',
    '8G9A0339.jpg',
    '8G9A0394.jpg',
    '8G9A0402.jpg',
    '8G9A0423.jpg',
    '8G9A0433.jpg',
    '8G9A0472.jpg',
    '8G9A0501.jpg',
    '8G9A0574.jpg',
    '8G9A0600.jpg'
  ]
  let index = 0

  function loadImpressionGallery() {
    const cache = document.querySelector('#image-cache')
    const impression = document.querySelector('#impression-image')

    impression.src = impressionsFolder + '/' + impressions[index]
    const cacheIndex = Math.min(index + 1, impressions.length - 1)
    cache.src = impressionsFolder + '/' + impressions[cacheIndex]

    const previousButton = document.querySelector('.previous-button')
    const nextButton = document.querySelector('.next-button')
    previousButton.disabled = false
    nextButton.disabled = false
    if (index == 0) {
      previousButton.disabled = true
    }
    if (index == impressions.length - 1) {
      nextButton.disabled = true
    }
  }

  function loadPrevImage() {
    index -= 1
    if (index <= 0) {
      index = 0
    }
    loadImpressionGallery()
  }

  function loadNextImage() {
    index += 1
    if (index >= impressions.length - 1) {
      index = impressions.length - 1
    }
    loadImpressionGallery()
  }

  // global stuff
  window.addEventListener('load', () => {
    loadImpressionGallery()
  })

  // exports
  window.loadPrevImage = loadPrevImage
  window.loadNextImage = loadNextImage
})()
