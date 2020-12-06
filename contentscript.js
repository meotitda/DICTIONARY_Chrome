const { MODIFIER_KEY } = require("./lib/utils")

const last_mouse_stop = {x: 0, y: 0}
const templates = {}
const templateIds = {
  'transover-popup': 'transover-popup-template',
  'transover-type-and-translate-popup': 'transover-tat-popup-template'
}

function loadOptions() {
    chrome.runtime.sendMessage({handler: 'get_options'}, function(response) {
      options = JSON.parse( response.options )
      console.log('loadOptions', response)
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
  
  

  $(document).on('mousestop', function(e) {
    // withOptionsSatisfied(e, function() {
    //     // translate selection unless 'translate selection on alt only' is set
    //     if (window.getSelection().toString()) {
    //       if (!options.selection_key_only) {
    //         processEvent(e)
    //       }
    //     } else {
    //       if (options.translate_by == 'point') {
    //         processEvent(e)
    //       }
    //     }
    //   })
        console.log('mousestop')
    }
)

$(document).click(function(e) {
  withOptionsSatisfied(e, function() {
    if (options.translate_by != 'click')

    if ($(e.target).closest('a').length > 0) // closed parent
      return

    processEvent(e)
  })
  return true
})

$(document).keydown(function(e) {
  if (MODIFIER_KEY[e.keyCode] == options.popup_show_trigger) {
    show_popup_key_pressed = true

    const selection = window.getSelection().toString()

    if (options.selection_key_only && selection) {
      console.log('Got selection_key_only')

      chrome.runtime.sendMessage({handler: 'translate', word: selection}, function(response) {
        console.log('response: ', response)

        const translation = response

        if (!translation) {
          console.log('skipping empty translation')
          return
        }

        const xy = { clientX: last_mouse_stop.x, clientY: last_mouse_stop.y }
        last_translation = translation
        showPopup(xy, translation)
      })
    }
  }

  // Hide tat popup on escape
  if (e.keyCode == 27) {
    removePopup('transover-type-and-translate-popup')
  }
}).keyup(function(e) {
  
  if (MODIFIER_KEY[e.keyCode] == options.popup_show_trigger) {
    show_popup_key_pressed = false
  }
})

function withOptionsSatisfied(e, do_stuff) {
    // pre-hook
    do_stuff()
}


//translate

function processEvent(e) {

  const selection = window.getSelection()
  const hit_elem = document.elementFromPoint(e.clientX, e.clientY)
  if (!hit_elem) {
    return
  }

  let word = ''
  if (selection.toString()) {
    if (options.selection_key_only) {
      console.log('Skip because "selection_key_only"')
      return
    }

    let sel_container = selection.getRangeAt(0).commonAncestorContainer
    
    while (sel_container.nodeType != Node.ELEMENT_NODE) {
      sel_container = sel_container.parentNode
    }

    if (
      ( $(hit_elem).is(sel_container) || $.contains(sel_container, hit_elem) )
        && selection.containsNode(hit_elem, true)
    ) {
      word = selection.toString()
    }
      else if (options.translate_by == 'point') {
        word = getHitWord(e)
    }
      else {
        word = getHitWord(e)
    }
  
    console.log('hit', word)

    if (word != '') {
      chrome.runtime.sendMessage({handler: 'translate', word}, function(response) {
        console.log('response: ', response)

    //   //   const translation = TransOver.deserialize(response.translation)

    //   //   if (!translation) {
    //   //     console.log('skipping empty translation')
    //   //     return
    //   //   }

    //   //   last_translation = translation
    //   //   showPopup(e, TransOver.formatTranslation(translation, TransOverLanguages[response.tl].direction, response.sl, options))
      })
    }
  }
}

function getHitWord(e) {

  function restorable(node, do_stuff) {
    // $(node).wrap('<transwrapper />')
    const res = do_stuff(node)
    console.log('some Tagging')
    return res
  }

  function getExactTextNode(nodes, e) {
    $(text_nodes).wrap('<transblock />')
    let hit_text_node = document.elementFromPoint(e.clientX, e.clientY)

    //means we hit between the lines
    if (hit_text_node.nodeName != 'TRANSBLOCK') {
      $(text_nodes).unwrap()
      return null
    }

    hit_text_node = hit_text_node.childNodes[0]

    $(text_nodes).unwrap()

    return hit_text_node
  }

  const hit_elem = $(document.elementFromPoint(e.clientX, e.clientY))
  const word_re = '\\p{L}+(?:[\'’]\\p{L}+)*'
  const parent_font_style = {
    'line-height': hit_elem.css('line-height'),
    'font-size': '1em',
    'font-family': hit_elem.css('font-family')
  }

  const text_nodes = hit_elem.contents().filter(function(){
    return this.nodeType == Node.TEXT_NODE && XRegExp(word_re).test( this.nodeValue )
  })

  if (text_nodes.length == 0) {
    console.log('no text')
    return ''
  }

  const hit_text_node = getExactTextNode(text_nodes, e)
  if (!hit_text_node) {
    console.log('hit between lines')
    return ''
  }

  const hit_word = restorable(hit_text_node, function() {
    let hw = ''

    function getHitText(node, parent_font_style) {
      console.log('getHitText: \'' + node.textContent + '\'')

      if (XRegExp(word_re).test( node.textContent )) {
        $(node).replaceWith(function() {
          return this.textContent.replace(XRegExp('^(.{'+Math.round( node.textContent.length/2 )+'}(?:\\p{L}|[\'’](?=\\p{L}))*)(.*)', 's'), function($0, $1, $2) {
            console.log('$0', $0, '$1', $1, '$2', $2)
          })
        })

        $('transblock').css(parent_font_style)

        const next_node = document.elementFromPoint(e.clientX, e.clientY).childNodes[0]

        if (next_node.textContent == node.textContent) {
          return next_node
        }
        else {
          return getHitText(next_node, parent_font_style)
        }
      }
      else {
        return null
      }
    }

    const minimal_text_node = getHitText(hit_text_node, parent_font_style)

    if (minimal_text_node) {
      //wrap words inside text node into <transover> element
      $(minimal_text_node).replaceWith(function() {
        return this.textContent.replace(XRegExp('(<|>|&|'+word_re+')', 'gs'), function ($0, $1) {
          switch ($1) {
          case '<': return '&lt;'
          case '>': return '&gt;'
          case '&': return '&amp;'
          default: return '<transover>'+$1+'</transover>'
          }
        })
      })

      $('transover').css(parent_font_style)

      //get the exact word under cursor
      const hit_word_elem = document.elementFromPoint(e.clientX, e.clientY)

      //no word under cursor? we are done
      if (hit_word_elem.nodeName != 'TRANSOVER') {
        console.log('missed!')
      }
      else  {
        hw = $(hit_word_elem).text()
        console.log('got it: \''+hw+'\'')
      }
    }

    return hw
  })

  return hit_word
}

function showPopup(e, content) {
  removePopup('transover-type-and-translate-popup')

  const $popup = createPopup('transover-popup')
  $('body').append($popup)

  $popup.on('transover-popup_content_updated', function() {
    const pos = calculatePosition(e.clientX, e.clientY, $popup)
    $popup
      .each(function() {
        $(this.shadowRoot.querySelector('main')).hide()
      })
      .attr({ top: pos.y, left: pos.x })
      .each(function() {
        $(this.shadowRoot.querySelector('main')).fadeIn('fast')
      })
  })
  $popup.attr({content, options: JSON.stringify(options)})
}

function createPopup(nodeType) {

  console.log('templates', templates)
  console.log('templateIds', templateIds)
  console.log('nodeType', nodeType)
  console.log('templates[templateIds[nodeType]]', templates[templateIds[nodeType]])

  document.documentElement.appendChild(templates[templateIds[nodeType]])
  return $('<'+nodeType+'>')
}

function removePopup(nodeType) {
  $(nodeType).each(function() {
    const self = this
    $(this.shadowRoot.querySelector('main')).fadeOut('fast', function() { self.remove() })
  })
  $('#'+templateIds[nodeType]).remove()
}

$(function() {
  registerTransoverComponent('popup')
})

function registerTransoverComponent(component) {
  const html = component + '.html'
  const script = component + '.js'

  const xhr = new XMLHttpRequest()
  xhr.open('GET', chrome.extension.getURL(html), true)
  xhr.responseType = 'document'
  xhr.onload = function(e) {
    const doc = e.target.response
    const template = doc.querySelector('template')
    templates[template.id] = template
  }
  xhr.send()

  const s = document.createElement('script')
  s.type = 'text/javascript'
  s.src = chrome.extension.getURL(script)
  s.async = true
  document.head.appendChild(s)
}

function calculatePosition(x, y, $popup) {
  const pos = {}
  const margin = 5
  const anchor = 10
  const outerWidth = Number($popup.attr('outer-width'))
  const outerHeight = Number($popup.attr('outer-height'))

  // show popup to the right of the word if it fits into window this way
  if (x + anchor + outerWidth + margin < $(window).width()) {
    pos.x = x + anchor
  }
  // show popup to the left of the word if it fits into window this way
  else if (x - anchor - outerWidth - margin > 0) {
    pos.x = x - anchor - outerWidth
  }
  // show popup at the very left if it is not wider than window
  else if (outerWidth + margin*2 < $(window).width()) {
    pos.x = margin
  }
  // resize popup width to fit into window and position it the very left of the window
  else {
    const non_content_x = outerWidth - Number($popup.attr('content-width'))

    $popup.attr('content-width', $(window).width() - margin*2 - non_content_x )
    $popup.attr('content-height', Number($popup.attr('content-height')) + 4)

    pos.x = margin
  }

  // show popup above the word if it fits into window this way
  if (y - anchor - outerHeight - margin > 0) {
    pos.y = y - anchor - outerHeight
  }
  // show popup below the word if it fits into window this way
  else if (y + anchor + outerHeight + margin < $(window).height()) {
    pos.y = y + anchor
  }
  // show popup at the very top of the window
  else {
    pos.y = margin
  }

  return pos
}