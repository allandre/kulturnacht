;(function () {
  const impressionsFolder = 'archive/2017/ressources/impressions'
  var impressions = [
    'Artischock Seehof 2.jpg',
    'Artischock Seehof.jpg',
    'fanfare terrible.jpg',
    'fanfare terrible2.jpg',
    'fanfare terrible5.jpg',
    'Haus CG Jung 1.jpg',
    'Haus CG Jung 2.jpg',
    'IMG_1416.jpg',
    'IMG_1420.jpg',
    'IMG_1422.jpg',
    'IMG_1424.jpg',
    'IMG_1426.jpg',
    'IMG_1428.jpg',
    'IMG_1429.jpg',
    'IMG_1433.jpg',
    'IMG_1434.jpg',
    'IMG_1435.jpg',
    'IMG_1436.jpg',
    'IMG_1437.jpg',
    'IMG_1439.jpg',
    'IMG_1440.jpg',
    'IMG_1442.jpg',
    'IMG_1453.jpg',
    'IMG_1454.jpg',
    'IMG_1455.jpg',
    'IMG_1456.jpg',
    'IMG_1457.jpg',
    'IMG_1458.jpg',
    'IMG_1460.jpg',
    'IMG_1463.jpg',
    'IMG_1465.jpg',
    'IMG_1469.jpg',
    'IMG_1473.jpg',
    'IMG_1477.jpg',
    'IMG_1482.jpg',
    'IMG_1485.jpg',
    'IMG_1487.jpg',
    'IMG_1489.jpg',
    'IMG_1490.jpg',
    'IMG_1496.jpg',
    'IMG_1499.jpg',
    'IMG_1500.jpg',
    'IMG_1501.jpg',
    'IMG_1506.jpg',
    'IMG_1507.jpg',
    'IMG_1508.jpg',
    'IMG_1526.jpg',
    'IMG_6802.jpg',
    'IMG_8558.jpg',
    'IMG_8566.jpg',
    'IMG_8577.jpg',
    'IMG_8592.jpg',
    'IMG_8599.jpg',
    'IMG_8602.jpg',
    'Lesung1.jpg'
  ]
  var index = 0

  function loadImpressionGallery(index) {
    var $cache = $('#image-cache')
    var $impression = $('#impression-image')

    $impression.attr('src', impressionsFolder + '/' + impressions[index])
    $cache.attr(
      'src',
      impressionsFolder + '/' + impressions[++index & impressions.length]
    )
  }

  function loadPrevImage() {
    index -= 1
    if (index < 0) {
      index = impressions.length - 1
    }
    loadImpressionGallery(index)
  }

  function loadNextImage() {
    loadImpressionGallery(++index % impressions.length)
  }

  // global stuff
  $(document).ready(function () {
    loadImpressionGallery(index)
  })

  // exports
  window.loadPrevImage = loadPrevImage
  window.loadNextImage = loadNextImage
})()
