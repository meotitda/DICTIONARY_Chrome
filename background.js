import Options from './lib/options'

const URL = (word) => `http://localhost:4000/word/find/${word}`
const URL2 = (word) => `http://localhost:4000/word/fuzzy/${word}`

const translate =  (word, sendResponse) => {
    console.log('word', word)
    $.ajax({
        url: URL(word),
        type: 'GET',
        success: function on_success(data) {
            console.log('data', data)
            if(!data?.content) {
                $.ajax({
                    url: URL2(word),
                    type: 'GET',
                    success: function on_success(data) {
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


chrome.runtime.onInstalled.addListener(function() {
    const options = Object.keys(Options).reduce((result, key) => {
        result[key] = Options[key]()
        return result
        }, {})
    chrome.storage.sync.set({options}, function() {
      console.log(`setting: ${options}`);
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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

chrome.commands.onCommand.addListener(function(command, tabs) {
    console.log('command', command)
    console.log('tabs', tabs)
    // chrome.pageAction.show({},()=>{})
});


chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
    })
    ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
}]);
});
