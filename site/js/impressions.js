;(function () {
  let impressionsFolder
  let impressionsFileNames
  let index = 0

  const impressionImg = document.createElement('img')
  const imageCache = document.createElement('img')
  const previousButton = document.createElement('button')
  const nextButton = document.createElement('button')
  const counter = document.createElement('div')

  function loadImpressionGallery() {
    impressionImg.src = impressionsFolder + '/' + impressionsFileNames[index]
    const cacheIndex = Math.min(index + 1, impressionsFileNames.length - 1)
    imageCache.src = impressionsFolder + '/' + impressionsFileNames[cacheIndex]

    previousButton.disabled = false
    nextButton.disabled = false
    if (index == 0) {
      previousButton.disabled = true
    }
    if (index == impressionsFileNames.length - 1) {
      nextButton.disabled = true
    }

    counter.innerHTML = `${index + 1} / ${impressionsFileNames.length}`
  }

  function loadPreviousImage() {
    index -= 1
    if (index <= 0) {
      index = 0
    }
    loadImpressionGallery()
  }

  function loadNextImage() {
    index += 1
    if (index >= impressionsFileNames.length - 1) {
      index = impressionsFileNames.length - 1
    }
    loadImpressionGallery()
  }

  function createImpressionsDom() {
    const impressionsDiv = document.querySelector('#impressions')

    const imageDiv = document.createElement('div')
    imageDiv.id = 'impressions-div'
    imageDiv.onload = loadNextImage
    impressionsDiv.appendChild(imageDiv)

    impressionImg.id = 'impressions-image'
    imageDiv.appendChild(impressionImg)

    imageCache.id = 'image-cache'
    impressionsDiv.appendChild(imageCache)

    const controls = document.createElement('div')
    controls.id = 'controls'
    impressionsDiv.appendChild(controls)

    previousButton.type = 'button'
    previousButton.onclick = loadPreviousImage
    previousButton.innerHTML = '&lt;'
    controls.appendChild(previousButton)

    counter.classList.add('counter')
    controls.appendChild(counter)

    nextButton.type = 'button'
    nextButton.onclick = loadNextImage
    nextButton.innerHTML = '&gt;'
    controls.appendChild(nextButton)
  }

  // global stuff
  window.addEventListener('load', () => {
    impressionsFolder = window.impressionsFolder
    impressionsFileNames = window.impressionsFileNames
    createImpressionsDom()
    loadImpressionGallery()
  })
})()
