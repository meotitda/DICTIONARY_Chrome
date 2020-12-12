const search = document.getElementById('search')
const versatile = document.getElementById('versatile')
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
    
    versatile.innerHTML='검색중입니다.'

    const debouncingSearchWord = debounce((word) => {
        searchWord(word); 
      }, DEBOUNCE_DURATION)

      debouncingSearchWord(e.target.value)
})

versatile.addEventListener('click' ,(e)=> {
    search.value = e.target.innerText
    searchWord(search.value)
})


const NO_CONTENT_ELEMENT = `
                   <div>
                    <span>검색 결과가 없습니다.</span>
                    <a target="_blank" href="https://meotitda.github.io/DICTIONARY-EDITOR/">→ 새로운 단어 추가하기</a>
                    <a target="_blank" href="https://github.com/meotitda/DICTIONARY">→ 단어 추가 메뉴얼</a>
                   </div>
                   `;
function searchWord(word) {
    chrome.runtime.sendMessage(
        {handler: 'translate', word}, function(response) {
        
        switch(response.type) {
            case 'recommand':
                versatile.innerHTML="추천 검색어<br>"
               response.recommands.map((recommand)=> {
                   const element = document.createElement('span')
                   element.innerText = recommand.title + " "
                   versatile.appendChild(element)
                   card__text.innerHTML = NO_CONTENT_ELEMENT
                   return
                })
                break
            case 'find':
                versatile.innerHTML=''
                card__text.innerHTML = response.word.content.replaceAll('<br />', '<br /><br />')
                break
            default:
                versatile.innerHTML=''
                card__text.innerHTML = NO_CONTENT_ELEMENT
        }
        return true

    })
    versatile.innerHTML=''
    card__text.innerHTML = NO_CONTENT_ELEMENT
}
