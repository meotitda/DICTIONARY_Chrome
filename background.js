import Options from './lib/options'

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    const except_urls = Options.except_urls()
    console.log('except_urls', except_urls)
    switch (request.handler) {
    case 'get_options':
      sendResponse({
        options: JSON.stringify(
          Object.keys(Options).reduce((result, key) => {
            result[key] = Options[key]()
            return result
          }, {})
        )
      })
      break
    default:
      console.error('Unknown handler')
      sendResponse({})
    }
  })
  
  