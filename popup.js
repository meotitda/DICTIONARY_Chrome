const search = document.getElementById('search')
const result = document.getElementById('result')
const card__text = document.getElementById('card__text')
const DEBOUNCE_DURATION = 500; 

addEventListener('DOMContentLoaded', ()=> {
        chrome.storage.sync.get('word', function(data) {
            if(!data.word) {
                return
            }
            search.value = data.word
            searchWord(data.word)
        }); 
})



function debounce(callback, wait, context = this) {
  
    let timeout = null;
    let callbackArgs = null;

    const later = () => callback.apply(context, callbackArgs);

    return function() {
        callbackArgs = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

search.addEventListener('input', (e)=> {
    
    result.innerHTML='검색중입니다.'

    const debouncingSearchWord = debounce((word) => {
        searchWord(word); 
      }, DEBOUNCE_DURATION)

      debouncingSearchWord(e.target.value)
})


function searchWord(word) {
    chrome.runtime.sendMessage({handler: 'translate', word}, function(response) {
        card__text.innerHTML = response.content.content
    })
    result.innerHTML=''
}
