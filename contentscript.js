
function loadOptions() {
    chrome.runtime.sendMessage({handler: 'get_options'}, function(response) {
      options = JSON.parse( response.options )
      console.log('options', options)
    //   disable_on_this_page = ignoreThisPage(options)
    //   chrome.runtime.sendMessage({handler: 'setIcon', disabled: disable_on_this_page})
    })
  }
  loadOptions()
  
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      loadOptions()
    }
  }, false)
  
  