export default {
  except_urls: function(urls) {
    if (urls instanceof Array) {
      localStorage.except_urls = JSON.stringify(urls)
    }
    if (localStorage.except_urls) {
      try {
        return JSON.parse(localStorage.except_urls)
      } catch (e) {
        // backwards compatibitlity
        return localStorage.except_urls.split(',')
      }
    }
    return []
  }
}
