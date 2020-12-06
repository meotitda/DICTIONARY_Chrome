import Options from './lib/options'

const URL = (word) => `http://localhost:4000/word/find/${word}`
const URL2 = (word) => `http://localhost:4000/word/fuzzy/${word}`

const translate =  (word, sendResponse) => {
    $.ajax({
        url: URL(word),
        type: 'GET',
        success: function on_success(data) {
            if(!data?.content) {
                $.ajax({
                    url: URL2(word),
                    type: 'GET',
                    success: function on_success(data) {
                        console.log('data', data)
                        sendResponse ({
                            status : true,
                            type: '관련 검색어',
                            content: data
                        })
                    }
                })
            } else {
                sendResponse ({
                    status : true,
                    type:'찾은 단어',
                    content: data
                })
            }
        },
        error: function(xhr, status, e) {
            console.log({e: e, xhr: xhr})
            sendResponse({
                status : true,
                e,
            })
        }
        
    })
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const except_urls = Options.except_urls()
    console.log('woooord', request.word)
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
    case 'translate':
        translate(request.word, sendResponse)
        return true
    default:
        sendResponse({})
    }
    return true
})


chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "contentscript.js" });
    chrome.tabs.executeScript(null, { file: "background.js" });
});
