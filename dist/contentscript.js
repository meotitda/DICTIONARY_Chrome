/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/utils.js":
/*!**********************!*
  !*** ./lib/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MODIFIER_KEY": () => /* binding */ MODIFIER_KEY
/* harmony export */ });
const MODIFIER_KEY = {
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  91: 'command',
  93: 'command',
  13: 'Return'
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
(() => {
/*!**************************!*
  !*** ./contentscript.js ***!
  \**************************/
const {
  MODIFIER_KEY
} = __webpack_require__(/*! ./lib/utils */ "./lib/utils.js");

const last_mouse_stop = {
  x: 0,
  y: 0
};
const templates = {};
const templateIds = {
  'transover-popup': 'transover-popup-template',
  'transover-type-and-translate-popup': 'transover-tat-popup-template'
};

function loadOptions() {
  chrome.runtime.sendMessage({
    handler: 'get_options'
  }, function (response) {
    options = JSON.parse(response.options);
    console.log('loadOptions', response); //   disable_on_this_page = ignoreThisPage(options)
    //   chrome.runtime.sendMessage({handler: 'setIcon', disabled: disable_on_this_page})
  });
}

loadOptions();
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) {
    loadOptions();
  }
}, false);
$(document).on('mousestop', function (e) {
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
  console.log('mousestop');
});
$(document).click(function (e) {
  withOptionsSatisfied(e, function () {
    if (options.translate_by != 'click') if ($(e.target).closest('a').length > 0) // closed parent
      return;
    processEvent(e);
  });
  return true;
});
$(document).keydown(function (e) {
  if (MODIFIER_KEY[e.keyCode] == options.popup_show_trigger) {
    show_popup_key_pressed = true;
    const selection = window.getSelection().toString();

    if (options.selection_key_only && selection) {
      console.log('Got selection_key_only');
      chrome.runtime.sendMessage({
        handler: 'translate',
        word: selection
      }, function (response) {
        console.log('response: ', response);
        const translation = response;

        if (!translation) {
          console.log('skipping empty translation');
          return;
        }

        const xy = {
          clientX: last_mouse_stop.x,
          clientY: last_mouse_stop.y
        };
        last_translation = translation;
        showPopup(xy, translation);
      });
    }
  } // Hide tat popup on escape


  if (e.keyCode == 27) {
    removePopup('transover-type-and-translate-popup');
  }
}).keyup(function (e) {
  if (MODIFIER_KEY[e.keyCode] == options.popup_show_trigger) {
    show_popup_key_pressed = false;
  }
});

function withOptionsSatisfied(e, do_stuff) {
  // pre-hook
  do_stuff();
} //translate


function processEvent(e) {
  const selection = window.getSelection();
  const hit_elem = document.elementFromPoint(e.clientX, e.clientY);

  if (!hit_elem) {
    return;
  }

  let word = '';

  if (selection.toString()) {
    if (options.selection_key_only) {
      console.log('Skip because "selection_key_only"');
      return;
    }

    let sel_container = selection.getRangeAt(0).commonAncestorContainer;

    while (sel_container.nodeType != Node.ELEMENT_NODE) {
      sel_container = sel_container.parentNode;
    }

    if (($(hit_elem).is(sel_container) || $.contains(sel_container, hit_elem)) && selection.containsNode(hit_elem, true)) {
      word = selection.toString();
    } else if (options.translate_by == 'point') {
      word = getHitWord(e);
    } else {
      word = getHitWord(e);
    }

    console.log('hit', word);

    if (word != '') {
      chrome.runtime.sendMessage({
        handler: 'translate',
        word
      }, function (response) {
        console.log('response: ', response); //   //   const translation = TransOver.deserialize(response.translation)
        //   //   if (!translation) {
        //   //     console.log('skipping empty translation')
        //   //     return
        //   //   }
        //   //   last_translation = translation
        //   //   showPopup(e, TransOver.formatTranslation(translation, TransOverLanguages[response.tl].direction, response.sl, options))
      });
    }
  }
}

function getHitWord(e) {
  function restorable(node, do_stuff) {
    // $(node).wrap('<transwrapper />')
    const res = do_stuff(node);
    console.log('some Tagging');
    return res;
  }

  function getExactTextNode(nodes, e) {
    $(text_nodes).wrap('<transblock />');
    let hit_text_node = document.elementFromPoint(e.clientX, e.clientY); //means we hit between the lines

    if (hit_text_node.nodeName != 'TRANSBLOCK') {
      $(text_nodes).unwrap();
      return null;
    }

    hit_text_node = hit_text_node.childNodes[0];
    $(text_nodes).unwrap();
    return hit_text_node;
  }

  const hit_elem = $(document.elementFromPoint(e.clientX, e.clientY));
  const word_re = '\\p{L}+(?:[\'’]\\p{L}+)*';
  const parent_font_style = {
    'line-height': hit_elem.css('line-height'),
    'font-size': '1em',
    'font-family': hit_elem.css('font-family')
  };
  const text_nodes = hit_elem.contents().filter(function () {
    return this.nodeType == Node.TEXT_NODE && XRegExp(word_re).test(this.nodeValue);
  });

  if (text_nodes.length == 0) {
    console.log('no text');
    return '';
  }

  const hit_text_node = getExactTextNode(text_nodes, e);

  if (!hit_text_node) {
    console.log('hit between lines');
    return '';
  }

  const hit_word = restorable(hit_text_node, function () {
    let hw = '';

    function getHitText(node, parent_font_style) {
      console.log('getHitText: \'' + node.textContent + '\'');

      if (XRegExp(word_re).test(node.textContent)) {
        $(node).replaceWith(function () {
          return this.textContent.replace(XRegExp('^(.{' + Math.round(node.textContent.length / 2) + '}(?:\\p{L}|[\'’](?=\\p{L}))*)(.*)', 's'), function ($0, $1, $2) {
            console.log('$0', $0, '$1', $1, '$2', $2);
          });
        });
        $('transblock').css(parent_font_style);
        const next_node = document.elementFromPoint(e.clientX, e.clientY).childNodes[0];

        if (next_node.textContent == node.textContent) {
          return next_node;
        } else {
          return getHitText(next_node, parent_font_style);
        }
      } else {
        return null;
      }
    }

    const minimal_text_node = getHitText(hit_text_node, parent_font_style);

    if (minimal_text_node) {
      //wrap words inside text node into <transover> element
      $(minimal_text_node).replaceWith(function () {
        return this.textContent.replace(XRegExp('(<|>|&|' + word_re + ')', 'gs'), function ($0, $1) {
          switch ($1) {
            case '<':
              return '&lt;';

            case '>':
              return '&gt;';

            case '&':
              return '&amp;';

            default:
              return '<transover>' + $1 + '</transover>';
          }
        });
      });
      $('transover').css(parent_font_style); //get the exact word under cursor

      const hit_word_elem = document.elementFromPoint(e.clientX, e.clientY); //no word under cursor? we are done

      if (hit_word_elem.nodeName != 'TRANSOVER') {
        console.log('missed!');
      } else {
        hw = $(hit_word_elem).text();
        console.log('got it: \'' + hw + '\'');
      }
    }

    return hw;
  });
  return hit_word;
}

function showPopup(e, content) {
  removePopup('transover-type-and-translate-popup');
  const $popup = createPopup('transover-popup');
  $('body').append($popup);
  $popup.on('transover-popup_content_updated', function () {
    const pos = calculatePosition(e.clientX, e.clientY, $popup);
    $popup.each(function () {
      $(this.shadowRoot.querySelector('main')).hide();
    }).attr({
      top: pos.y,
      left: pos.x
    }).each(function () {
      $(this.shadowRoot.querySelector('main')).fadeIn('fast');
    });
  });
  $popup.attr({
    content,
    options: JSON.stringify(options)
  });
}

function createPopup(nodeType) {
  console.log('templates', templates);
  console.log('templateIds', templateIds);
  console.log('nodeType', nodeType);
  console.log('templates[templateIds[nodeType]]', templates[templateIds[nodeType]]);
  document.documentElement.appendChild(templates[templateIds[nodeType]]);
  return $('<' + nodeType + '>');
}

function removePopup(nodeType) {
  $(nodeType).each(function () {
    const self = this;
    $(this.shadowRoot.querySelector('main')).fadeOut('fast', function () {
      self.remove();
    });
  });
  $('#' + templateIds[nodeType]).remove();
}

$(function () {
  registerTransoverComponent('popup');
});

function registerTransoverComponent(component) {
  const html = component + '.html';
  const script = component + '.js';
  const xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.extension.getURL(html), true);
  xhr.responseType = 'document';

  xhr.onload = function (e) {
    const doc = e.target.response;
    const template = doc.querySelector('template');
    templates[template.id] = template;
  };

  xhr.send();
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = chrome.extension.getURL(script);
  s.async = true;
  document.head.appendChild(s);
}

function calculatePosition(x, y, $popup) {
  const pos = {};
  const margin = 5;
  const anchor = 10;
  const outerWidth = Number($popup.attr('outer-width'));
  const outerHeight = Number($popup.attr('outer-height')); // show popup to the right of the word if it fits into window this way

  if (x + anchor + outerWidth + margin < $(window).width()) {
    pos.x = x + anchor;
  } // show popup to the left of the word if it fits into window this way
  else if (x - anchor - outerWidth - margin > 0) {
      pos.x = x - anchor - outerWidth;
    } // show popup at the very left if it is not wider than window
    else if (outerWidth + margin * 2 < $(window).width()) {
        pos.x = margin;
      } // resize popup width to fit into window and position it the very left of the window
      else {
          const non_content_x = outerWidth - Number($popup.attr('content-width'));
          $popup.attr('content-width', $(window).width() - margin * 2 - non_content_x);
          $popup.attr('content-height', Number($popup.attr('content-height')) + 4);
          pos.x = margin;
        } // show popup above the word if it fits into window this way


  if (y - anchor - outerHeight - margin > 0) {
    pos.y = y - anchor - outerHeight;
  } // show popup below the word if it fits into window this way
  else if (y + anchor + outerHeight + margin < $(window).height()) {
      pos.y = y + anchor;
    } // show popup at the very top of the window
    else {
        pos.y = margin;
      }

  return pos;
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL3V0aWxzLmpzIiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vY29udGVudHNjcmlwdC5qcyJdLCJuYW1lcyI6WyJNT0RJRklFUl9LRVkiLCJyZXF1aXJlIiwibGFzdF9tb3VzZV9zdG9wIiwieCIsInkiLCJ0ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZUlkcyIsImxvYWRPcHRpb25zIiwiY2hyb21lIiwicnVudGltZSIsInNlbmRNZXNzYWdlIiwiaGFuZGxlciIsInJlc3BvbnNlIiwib3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsImNvbnNvbGUiLCJsb2ciLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJoaWRkZW4iLCIkIiwib24iLCJlIiwiY2xpY2siLCJ3aXRoT3B0aW9uc1NhdGlzZmllZCIsInRyYW5zbGF0ZV9ieSIsInRhcmdldCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwcm9jZXNzRXZlbnQiLCJrZXlkb3duIiwia2V5Q29kZSIsInBvcHVwX3Nob3dfdHJpZ2dlciIsInNob3dfcG9wdXBfa2V5X3ByZXNzZWQiLCJzZWxlY3Rpb24iLCJ3aW5kb3ciLCJnZXRTZWxlY3Rpb24iLCJ0b1N0cmluZyIsInNlbGVjdGlvbl9rZXlfb25seSIsIndvcmQiLCJ0cmFuc2xhdGlvbiIsInh5IiwiY2xpZW50WCIsImNsaWVudFkiLCJsYXN0X3RyYW5zbGF0aW9uIiwic2hvd1BvcHVwIiwicmVtb3ZlUG9wdXAiLCJrZXl1cCIsImRvX3N0dWZmIiwiaGl0X2VsZW0iLCJlbGVtZW50RnJvbVBvaW50Iiwic2VsX2NvbnRhaW5lciIsImdldFJhbmdlQXQiLCJjb21tb25BbmNlc3RvckNvbnRhaW5lciIsIm5vZGVUeXBlIiwiTm9kZSIsIkVMRU1FTlRfTk9ERSIsInBhcmVudE5vZGUiLCJpcyIsImNvbnRhaW5zIiwiY29udGFpbnNOb2RlIiwiZ2V0SGl0V29yZCIsInJlc3RvcmFibGUiLCJub2RlIiwicmVzIiwiZ2V0RXhhY3RUZXh0Tm9kZSIsIm5vZGVzIiwidGV4dF9ub2RlcyIsIndyYXAiLCJoaXRfdGV4dF9ub2RlIiwibm9kZU5hbWUiLCJ1bndyYXAiLCJjaGlsZE5vZGVzIiwid29yZF9yZSIsInBhcmVudF9mb250X3N0eWxlIiwiY3NzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJURVhUX05PREUiLCJYUmVnRXhwIiwidGVzdCIsIm5vZGVWYWx1ZSIsImhpdF93b3JkIiwiaHciLCJnZXRIaXRUZXh0IiwidGV4dENvbnRlbnQiLCJyZXBsYWNlV2l0aCIsInJlcGxhY2UiLCJNYXRoIiwicm91bmQiLCIkMCIsIiQxIiwiJDIiLCJuZXh0X25vZGUiLCJtaW5pbWFsX3RleHRfbm9kZSIsImhpdF93b3JkX2VsZW0iLCJ0ZXh0IiwiY29udGVudCIsIiRwb3B1cCIsImNyZWF0ZVBvcHVwIiwiYXBwZW5kIiwicG9zIiwiY2FsY3VsYXRlUG9zaXRpb24iLCJlYWNoIiwic2hhZG93Um9vdCIsInF1ZXJ5U2VsZWN0b3IiLCJoaWRlIiwiYXR0ciIsInRvcCIsImxlZnQiLCJmYWRlSW4iLCJzdHJpbmdpZnkiLCJkb2N1bWVudEVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsInNlbGYiLCJmYWRlT3V0IiwicmVtb3ZlIiwicmVnaXN0ZXJUcmFuc292ZXJDb21wb25lbnQiLCJjb21wb25lbnQiLCJodG1sIiwic2NyaXB0IiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwiZXh0ZW5zaW9uIiwiZ2V0VVJMIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwiZG9jIiwidGVtcGxhdGUiLCJpZCIsInNlbmQiLCJzIiwiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJzcmMiLCJhc3luYyIsImhlYWQiLCJtYXJnaW4iLCJhbmNob3IiLCJvdXRlcldpZHRoIiwiTnVtYmVyIiwib3V0ZXJIZWlnaHQiLCJ3aWR0aCIsIm5vbl9jb250ZW50X3giLCJoZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQU8sTUFBTUEsWUFBWSxHQUFHO0FBQ3hCLE1BQUksT0FEb0I7QUFDWCxNQUFJLE1BRE87QUFDQyxNQUFJLEtBREw7QUFDWSxNQUFJLFNBRGhCO0FBQzJCLE1BQUksU0FEL0I7QUFDMEMsTUFBSTtBQUQ5QyxDQUFyQixDOzs7Ozs7VUNBUDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7OztBQ05BLE1BQU07QUFBRUE7QUFBRixJQUFtQkMsbUJBQU8sQ0FBQyxtQ0FBRCxDQUFoQzs7QUFFQSxNQUFNQyxlQUFlLEdBQUc7QUFBQ0MsR0FBQyxFQUFFLENBQUo7QUFBT0MsR0FBQyxFQUFFO0FBQVYsQ0FBeEI7QUFDQSxNQUFNQyxTQUFTLEdBQUcsRUFBbEI7QUFDQSxNQUFNQyxXQUFXLEdBQUc7QUFDbEIscUJBQW1CLDBCQUREO0FBRWxCLHdDQUFzQztBQUZwQixDQUFwQjs7QUFLQSxTQUFTQyxXQUFULEdBQXVCO0FBQ25CQyxRQUFNLENBQUNDLE9BQVAsQ0FBZUMsV0FBZixDQUEyQjtBQUFDQyxXQUFPLEVBQUU7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SixHQUFhRyxXQUFiLEdBQTJCSixNQUEzQixHQUFvQyxDQUF4QyxFQUEyQztBQUN6Q3JDLE9BQUcsQ0FBQ2xHLENBQUosR0FBUUEsQ0FBQyxHQUFHd0ksTUFBSixHQUFhRyxXQUFyQjtBQUNELEdBRkQsQ0FHQTtBQUhBLE9BSUssSUFBSTNJLENBQUMsR0FBR3dJLE1BQUosR0FBYUcsV0FBYixHQUEyQkosTUFBM0IsR0FBb0N0SCxDQUFDLENBQUNlLE1BQUQsQ0FBRCxDQUFVOEcsTUFBVixFQUF4QyxFQUE0RDtBQUMvRDVDLFNBQUcsQ0FBQ2xHLENBQUosR0FBUUEsQ0FBQyxHQUFHd0ksTUFBWjtBQUNELEtBRkksQ0FHTDtBQUhLLFNBSUE7QUFDSHRDLFdBQUcsQ0FBQ2xHLENBQUosR0FBUXVJLE1BQVI7QUFDRDs7QUFFRCxTQUFPckMsR0FBUDtBQUNELEMiLCJmaWxlIjoiY29udGVudHNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBNT0RJRklFUl9LRVkgPSB7XG4gICAgMTY6ICdzaGlmdCcsIDE3OiAnY3RybCcsIDE4OiAnYWx0JywgOTE6ICdjb21tYW5kJywgOTM6ICdjb21tYW5kJywgMTM6ICdSZXR1cm4nXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImNvbnN0IHsgTU9ESUZJRVJfS0VZIH0gPSByZXF1aXJlKFwiLi9saWIvdXRpbHNcIilcblxuY29uc3QgbGFzdF9tb3VzZV9zdG9wID0ge3g6IDAsIHk6IDB9XG5jb25zdCB0ZW1wbGF0ZXMgPSB7fVxuY29uc3QgdGVtcGxhdGVJZHMgPSB7XG4gICd0cmFuc292ZXItcG9wdXAnOiAndHJhbnNvdmVyLXBvcHVwLXRlbXBsYXRlJyxcbiAgJ3RyYW5zb3Zlci10eXBlLWFuZC10cmFuc2xhdGUtcG9wdXAnOiAndHJhbnNvdmVyLXRhdC1wb3B1cC10ZW1wbGF0ZSdcbn1cblxuZnVuY3Rpb24gbG9hZE9wdGlvbnMoKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2hhbmRsZXI6ICdnZXRfb3B0aW9ucyd9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgb3B0aW9ucyA9IEpTT04ucGFyc2UoIHJlc3BvbnNlLm9wdGlvbnMgKVxuICAgICAgY29uc29sZS5sb2coJ2xvYWRPcHRpb25zJywgcmVzcG9uc2UpXG4gICAgLy8gICBkaXNhYmxlX29uX3RoaXNfcGFnZSA9IGlnbm9yZVRoaXNQYWdlKG9wdGlvbnMpXG4gICAgLy8gICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7aGFuZGxlcjogJ3NldEljb24nLCBkaXNhYmxlZDogZGlzYWJsZV9vbl90aGlzX3BhZ2V9KVxuICAgIH0pXG4gIH1cbiAgbG9hZE9wdGlvbnMoKVxuICBcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWRvY3VtZW50LmhpZGRlbikge1xuICAgICAgbG9hZE9wdGlvbnMoKVxuICAgIH1cbiAgfSwgZmFsc2UpXG4gIFxuICBcblxuICAkKGRvY3VtZW50KS5vbignbW91c2VzdG9wJywgZnVuY3Rpb24oZSkge1xuICAgIC8vIHdpdGhPcHRpb25zU2F0aXNmaWVkKGUsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAvLyB0cmFuc2xhdGUgc2VsZWN0aW9uIHVubGVzcyAndHJhbnNsYXRlIHNlbGVjdGlvbiBvbiBhbHQgb25seScgaXMgc2V0XG4gICAgLy8gICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKSkge1xuICAgIC8vICAgICAgIGlmICghb3B0aW9ucy5zZWxlY3Rpb25fa2V5X29ubHkpIHtcbiAgICAvLyAgICAgICAgIHByb2Nlc3NFdmVudChlKVxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICBpZiAob3B0aW9ucy50cmFuc2xhdGVfYnkgPT0gJ3BvaW50Jykge1xuICAgIC8vICAgICAgICAgcHJvY2Vzc0V2ZW50KGUpXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICB9KVxuICAgICAgICBjb25zb2xlLmxvZygnbW91c2VzdG9wJylcbiAgICB9XG4pXG5cbiQoZG9jdW1lbnQpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgd2l0aE9wdGlvbnNTYXRpc2ZpZWQoZSwgZnVuY3Rpb24oKSB7XG4gICAgaWYgKG9wdGlvbnMudHJhbnNsYXRlX2J5ICE9ICdjbGljaycpXG5cbiAgICBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnYScpLmxlbmd0aCA+IDApIC8vIGNsb3NlZCBwYXJlbnRcbiAgICAgIHJldHVyblxuXG4gICAgcHJvY2Vzc0V2ZW50KGUpXG4gIH0pXG4gIHJldHVybiB0cnVlXG59KVxuXG4kKGRvY3VtZW50KS5rZXlkb3duKGZ1bmN0aW9uKGUpIHtcbiAgaWYgKE1PRElGSUVSX0tFWVtlLmtleUNvZGVdID09IG9wdGlvbnMucG9wdXBfc2hvd190cmlnZ2VyKSB7XG4gICAgc2hvd19wb3B1cF9rZXlfcHJlc3NlZCA9IHRydWVcblxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpXG5cbiAgICBpZiAob3B0aW9ucy5zZWxlY3Rpb25fa2V5X29ubHkgJiYgc2VsZWN0aW9uKSB7XG4gICAgICBjb25zb2xlLmxvZygnR290IHNlbGVjdGlvbl9rZXlfb25seScpXG5cbiAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtoYW5kbGVyOiAndHJhbnNsYXRlJywgd29yZDogc2VsZWN0aW9ufSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlOiAnLCByZXNwb25zZSlcblxuICAgICAgICBjb25zdCB0cmFuc2xhdGlvbiA9IHJlc3BvbnNlXG5cbiAgICAgICAgaWYgKCF0cmFuc2xhdGlvbikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdza2lwcGluZyBlbXB0eSB0cmFuc2xhdGlvbicpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB4eSA9IHsgY2xpZW50WDogbGFzdF9tb3VzZV9zdG9wLngsIGNsaWVudFk6IGxhc3RfbW91c2Vfc3RvcC55IH1cbiAgICAgICAgbGFzdF90cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uXG4gICAgICAgIHNob3dQb3B1cCh4eSwgdHJhbnNsYXRpb24pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIEhpZGUgdGF0IHBvcHVwIG9uIGVzY2FwZVxuICBpZiAoZS5rZXlDb2RlID09IDI3KSB7XG4gICAgcmVtb3ZlUG9wdXAoJ3RyYW5zb3Zlci10eXBlLWFuZC10cmFuc2xhdGUtcG9wdXAnKVxuICB9XG59KS5rZXl1cChmdW5jdGlvbihlKSB7XG4gIFxuICBpZiAoTU9ESUZJRVJfS0VZW2Uua2V5Q29kZV0gPT0gb3B0aW9ucy5wb3B1cF9zaG93X3RyaWdnZXIpIHtcbiAgICBzaG93X3BvcHVwX2tleV9wcmVzc2VkID0gZmFsc2VcbiAgfVxufSlcblxuZnVuY3Rpb24gd2l0aE9wdGlvbnNTYXRpc2ZpZWQoZSwgZG9fc3R1ZmYpIHtcbiAgICAvLyBwcmUtaG9va1xuICAgIGRvX3N0dWZmKClcbn1cblxuXG4vL3RyYW5zbGF0ZVxuXG5mdW5jdGlvbiBwcm9jZXNzRXZlbnQoZSkge1xuXG4gIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICBjb25zdCBoaXRfZWxlbSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5jbGllbnRYLCBlLmNsaWVudFkpXG4gIGlmICghaGl0X2VsZW0pIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGxldCB3b3JkID0gJydcbiAgaWYgKHNlbGVjdGlvbi50b1N0cmluZygpKSB7XG4gICAgaWYgKG9wdGlvbnMuc2VsZWN0aW9uX2tleV9vbmx5KSB7XG4gICAgICBjb25zb2xlLmxvZygnU2tpcCBiZWNhdXNlIFwic2VsZWN0aW9uX2tleV9vbmx5XCInKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IHNlbF9jb250YWluZXIgPSBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKS5jb21tb25BbmNlc3RvckNvbnRhaW5lclxuICAgIFxuICAgIHdoaWxlIChzZWxfY29udGFpbmVyLm5vZGVUeXBlICE9IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICBzZWxfY29udGFpbmVyID0gc2VsX2NvbnRhaW5lci5wYXJlbnROb2RlXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgKCAkKGhpdF9lbGVtKS5pcyhzZWxfY29udGFpbmVyKSB8fCAkLmNvbnRhaW5zKHNlbF9jb250YWluZXIsIGhpdF9lbGVtKSApXG4gICAgICAgICYmIHNlbGVjdGlvbi5jb250YWluc05vZGUoaGl0X2VsZW0sIHRydWUpXG4gICAgKSB7XG4gICAgICB3b3JkID0gc2VsZWN0aW9uLnRvU3RyaW5nKClcbiAgICB9XG4gICAgICBlbHNlIGlmIChvcHRpb25zLnRyYW5zbGF0ZV9ieSA9PSAncG9pbnQnKSB7XG4gICAgICAgIHdvcmQgPSBnZXRIaXRXb3JkKGUpXG4gICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdvcmQgPSBnZXRIaXRXb3JkKGUpXG4gICAgfVxuICBcbiAgICBjb25zb2xlLmxvZygnaGl0Jywgd29yZClcblxuICAgIGlmICh3b3JkICE9ICcnKSB7XG4gICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7aGFuZGxlcjogJ3RyYW5zbGF0ZScsIHdvcmR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2U6ICcsIHJlc3BvbnNlKVxuXG4gICAgLy8gICAvLyAgIGNvbnN0IHRyYW5zbGF0aW9uID0gVHJhbnNPdmVyLmRlc2VyaWFsaXplKHJlc3BvbnNlLnRyYW5zbGF0aW9uKVxuXG4gICAgLy8gICAvLyAgIGlmICghdHJhbnNsYXRpb24pIHtcbiAgICAvLyAgIC8vICAgICBjb25zb2xlLmxvZygnc2tpcHBpbmcgZW1wdHkgdHJhbnNsYXRpb24nKVxuICAgIC8vICAgLy8gICAgIHJldHVyblxuICAgIC8vICAgLy8gICB9XG5cbiAgICAvLyAgIC8vICAgbGFzdF90cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uXG4gICAgLy8gICAvLyAgIHNob3dQb3B1cChlLCBUcmFuc092ZXIuZm9ybWF0VHJhbnNsYXRpb24odHJhbnNsYXRpb24sIFRyYW5zT3Zlckxhbmd1YWdlc1tyZXNwb25zZS50bF0uZGlyZWN0aW9uLCByZXNwb25zZS5zbCwgb3B0aW9ucykpXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRIaXRXb3JkKGUpIHtcblxuICBmdW5jdGlvbiByZXN0b3JhYmxlKG5vZGUsIGRvX3N0dWZmKSB7XG4gICAgLy8gJChub2RlKS53cmFwKCc8dHJhbnN3cmFwcGVyIC8+JylcbiAgICBjb25zdCByZXMgPSBkb19zdHVmZihub2RlKVxuICAgIGNvbnNvbGUubG9nKCdzb21lIFRhZ2dpbmcnKVxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV4YWN0VGV4dE5vZGUobm9kZXMsIGUpIHtcbiAgICAkKHRleHRfbm9kZXMpLndyYXAoJzx0cmFuc2Jsb2NrIC8+JylcbiAgICBsZXQgaGl0X3RleHRfbm9kZSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5jbGllbnRYLCBlLmNsaWVudFkpXG5cbiAgICAvL21lYW5zIHdlIGhpdCBiZXR3ZWVuIHRoZSBsaW5lc1xuICAgIGlmIChoaXRfdGV4dF9ub2RlLm5vZGVOYW1lICE9ICdUUkFOU0JMT0NLJykge1xuICAgICAgJCh0ZXh0X25vZGVzKS51bndyYXAoKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBoaXRfdGV4dF9ub2RlID0gaGl0X3RleHRfbm9kZS5jaGlsZE5vZGVzWzBdXG5cbiAgICAkKHRleHRfbm9kZXMpLnVud3JhcCgpXG5cbiAgICByZXR1cm4gaGl0X3RleHRfbm9kZVxuICB9XG5cbiAgY29uc3QgaGl0X2VsZW0gPSAkKGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5jbGllbnRYLCBlLmNsaWVudFkpKVxuICBjb25zdCB3b3JkX3JlID0gJ1xcXFxwe0x9Kyg/OltcXCfigJldXFxcXHB7TH0rKSonXG4gIGNvbnN0IHBhcmVudF9mb250X3N0eWxlID0ge1xuICAgICdsaW5lLWhlaWdodCc6IGhpdF9lbGVtLmNzcygnbGluZS1oZWlnaHQnKSxcbiAgICAnZm9udC1zaXplJzogJzFlbScsXG4gICAgJ2ZvbnQtZmFtaWx5JzogaGl0X2VsZW0uY3NzKCdmb250LWZhbWlseScpXG4gIH1cblxuICBjb25zdCB0ZXh0X25vZGVzID0gaGl0X2VsZW0uY29udGVudHMoKS5maWx0ZXIoZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5ub2RlVHlwZSA9PSBOb2RlLlRFWFRfTk9ERSAmJiBYUmVnRXhwKHdvcmRfcmUpLnRlc3QoIHRoaXMubm9kZVZhbHVlIClcbiAgfSlcblxuICBpZiAodGV4dF9ub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgIGNvbnNvbGUubG9nKCdubyB0ZXh0JylcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGNvbnN0IGhpdF90ZXh0X25vZGUgPSBnZXRFeGFjdFRleHROb2RlKHRleHRfbm9kZXMsIGUpXG4gIGlmICghaGl0X3RleHRfbm9kZSkge1xuICAgIGNvbnNvbGUubG9nKCdoaXQgYmV0d2VlbiBsaW5lcycpXG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBjb25zdCBoaXRfd29yZCA9IHJlc3RvcmFibGUoaGl0X3RleHRfbm9kZSwgZnVuY3Rpb24oKSB7XG4gICAgbGV0IGh3ID0gJydcblxuICAgIGZ1bmN0aW9uIGdldEhpdFRleHQobm9kZSwgcGFyZW50X2ZvbnRfc3R5bGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdnZXRIaXRUZXh0OiBcXCcnICsgbm9kZS50ZXh0Q29udGVudCArICdcXCcnKVxuXG4gICAgICBpZiAoWFJlZ0V4cCh3b3JkX3JlKS50ZXN0KCBub2RlLnRleHRDb250ZW50ICkpIHtcbiAgICAgICAgJChub2RlKS5yZXBsYWNlV2l0aChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0Q29udGVudC5yZXBsYWNlKFhSZWdFeHAoJ14oLnsnK01hdGgucm91bmQoIG5vZGUudGV4dENvbnRlbnQubGVuZ3RoLzIgKSsnfSg/OlxcXFxwe0x9fFtcXCfigJldKD89XFxcXHB7TH0pKSopKC4qKScsICdzJyksIGZ1bmN0aW9uKCQwLCAkMSwgJDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCckMCcsICQwLCAnJDEnLCAkMSwgJyQyJywgJDIpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICAkKCd0cmFuc2Jsb2NrJykuY3NzKHBhcmVudF9mb250X3N0eWxlKVxuXG4gICAgICAgIGNvbnN0IG5leHRfbm9kZSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5jbGllbnRYLCBlLmNsaWVudFkpLmNoaWxkTm9kZXNbMF1cblxuICAgICAgICBpZiAobmV4dF9ub2RlLnRleHRDb250ZW50ID09IG5vZGUudGV4dENvbnRlbnQpIHtcbiAgICAgICAgICByZXR1cm4gbmV4dF9ub2RlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGdldEhpdFRleHQobmV4dF9ub2RlLCBwYXJlbnRfZm9udF9zdHlsZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWluaW1hbF90ZXh0X25vZGUgPSBnZXRIaXRUZXh0KGhpdF90ZXh0X25vZGUsIHBhcmVudF9mb250X3N0eWxlKVxuXG4gICAgaWYgKG1pbmltYWxfdGV4dF9ub2RlKSB7XG4gICAgICAvL3dyYXAgd29yZHMgaW5zaWRlIHRleHQgbm9kZSBpbnRvIDx0cmFuc292ZXI+IGVsZW1lbnRcbiAgICAgICQobWluaW1hbF90ZXh0X25vZGUpLnJlcGxhY2VXaXRoKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0Q29udGVudC5yZXBsYWNlKFhSZWdFeHAoJyg8fD58JnwnK3dvcmRfcmUrJyknLCAnZ3MnKSwgZnVuY3Rpb24gKCQwLCAkMSkge1xuICAgICAgICAgIHN3aXRjaCAoJDEpIHtcbiAgICAgICAgICBjYXNlICc8JzogcmV0dXJuICcmbHQ7J1xuICAgICAgICAgIGNhc2UgJz4nOiByZXR1cm4gJyZndDsnXG4gICAgICAgICAgY2FzZSAnJic6IHJldHVybiAnJmFtcDsnXG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuICc8dHJhbnNvdmVyPicrJDErJzwvdHJhbnNvdmVyPidcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAkKCd0cmFuc292ZXInKS5jc3MocGFyZW50X2ZvbnRfc3R5bGUpXG5cbiAgICAgIC8vZ2V0IHRoZSBleGFjdCB3b3JkIHVuZGVyIGN1cnNvclxuICAgICAgY29uc3QgaGl0X3dvcmRfZWxlbSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5jbGllbnRYLCBlLmNsaWVudFkpXG5cbiAgICAgIC8vbm8gd29yZCB1bmRlciBjdXJzb3I/IHdlIGFyZSBkb25lXG4gICAgICBpZiAoaGl0X3dvcmRfZWxlbS5ub2RlTmFtZSAhPSAnVFJBTlNPVkVSJykge1xuICAgICAgICBjb25zb2xlLmxvZygnbWlzc2VkIScpXG4gICAgICB9XG4gICAgICBlbHNlICB7XG4gICAgICAgIGh3ID0gJChoaXRfd29yZF9lbGVtKS50ZXh0KClcbiAgICAgICAgY29uc29sZS5sb2coJ2dvdCBpdDogXFwnJytodysnXFwnJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaHdcbiAgfSlcblxuICByZXR1cm4gaGl0X3dvcmRcbn1cblxuZnVuY3Rpb24gc2hvd1BvcHVwKGUsIGNvbnRlbnQpIHtcbiAgcmVtb3ZlUG9wdXAoJ3RyYW5zb3Zlci10eXBlLWFuZC10cmFuc2xhdGUtcG9wdXAnKVxuXG4gIGNvbnN0ICRwb3B1cCA9IGNyZWF0ZVBvcHVwKCd0cmFuc292ZXItcG9wdXAnKVxuICAkKCdib2R5JykuYXBwZW5kKCRwb3B1cClcblxuICAkcG9wdXAub24oJ3RyYW5zb3Zlci1wb3B1cF9jb250ZW50X3VwZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBwb3MgPSBjYWxjdWxhdGVQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSwgJHBvcHVwKVxuICAgICRwb3B1cFxuICAgICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSkuaGlkZSgpXG4gICAgICB9KVxuICAgICAgLmF0dHIoeyB0b3A6IHBvcy55LCBsZWZ0OiBwb3MueCB9KVxuICAgICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSkuZmFkZUluKCdmYXN0JylcbiAgICAgIH0pXG4gIH0pXG4gICRwb3B1cC5hdHRyKHtjb250ZW50LCBvcHRpb25zOiBKU09OLnN0cmluZ2lmeShvcHRpb25zKX0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBvcHVwKG5vZGVUeXBlKSB7XG5cbiAgY29uc29sZS5sb2coJ3RlbXBsYXRlcycsIHRlbXBsYXRlcylcbiAgY29uc29sZS5sb2coJ3RlbXBsYXRlSWRzJywgdGVtcGxhdGVJZHMpXG4gIGNvbnNvbGUubG9nKCdub2RlVHlwZScsIG5vZGVUeXBlKVxuICBjb25zb2xlLmxvZygndGVtcGxhdGVzW3RlbXBsYXRlSWRzW25vZGVUeXBlXV0nLCB0ZW1wbGF0ZXNbdGVtcGxhdGVJZHNbbm9kZVR5cGVdXSlcblxuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGVtcGxhdGVzW3RlbXBsYXRlSWRzW25vZGVUeXBlXV0pXG4gIHJldHVybiAkKCc8Jytub2RlVHlwZSsnPicpXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVBvcHVwKG5vZGVUeXBlKSB7XG4gICQobm9kZVR5cGUpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICAkKHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdtYWluJykpLmZhZGVPdXQoJ2Zhc3QnLCBmdW5jdGlvbigpIHsgc2VsZi5yZW1vdmUoKSB9KVxuICB9KVxuICAkKCcjJyt0ZW1wbGF0ZUlkc1tub2RlVHlwZV0pLnJlbW92ZSgpXG59XG5cbiQoZnVuY3Rpb24oKSB7XG4gIHJlZ2lzdGVyVHJhbnNvdmVyQ29tcG9uZW50KCdwb3B1cCcpXG59KVxuXG5mdW5jdGlvbiByZWdpc3RlclRyYW5zb3ZlckNvbXBvbmVudChjb21wb25lbnQpIHtcbiAgY29uc3QgaHRtbCA9IGNvbXBvbmVudCArICcuaHRtbCdcbiAgY29uc3Qgc2NyaXB0ID0gY29tcG9uZW50ICsgJy5qcydcblxuICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICB4aHIub3BlbignR0VUJywgY2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoaHRtbCksIHRydWUpXG4gIHhoci5yZXNwb25zZVR5cGUgPSAnZG9jdW1lbnQnXG4gIHhoci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgY29uc3QgZG9jID0gZS50YXJnZXQucmVzcG9uc2VcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvYy5xdWVyeVNlbGVjdG9yKCd0ZW1wbGF0ZScpXG4gICAgdGVtcGxhdGVzW3RlbXBsYXRlLmlkXSA9IHRlbXBsYXRlXG4gIH1cbiAgeGhyLnNlbmQoKVxuXG4gIGNvbnN0IHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICBzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICBzLnNyYyA9IGNocm9tZS5leHRlbnNpb24uZ2V0VVJMKHNjcmlwdClcbiAgcy5hc3luYyA9IHRydWVcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzKVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVQb3NpdGlvbih4LCB5LCAkcG9wdXApIHtcbiAgY29uc3QgcG9zID0ge31cbiAgY29uc3QgbWFyZ2luID0gNVxuICBjb25zdCBhbmNob3IgPSAxMFxuICBjb25zdCBvdXRlcldpZHRoID0gTnVtYmVyKCRwb3B1cC5hdHRyKCdvdXRlci13aWR0aCcpKVxuICBjb25zdCBvdXRlckhlaWdodCA9IE51bWJlcigkcG9wdXAuYXR0cignb3V0ZXItaGVpZ2h0JykpXG5cbiAgLy8gc2hvdyBwb3B1cCB0byB0aGUgcmlnaHQgb2YgdGhlIHdvcmQgaWYgaXQgZml0cyBpbnRvIHdpbmRvdyB0aGlzIHdheVxuICBpZiAoeCArIGFuY2hvciArIG91dGVyV2lkdGggKyBtYXJnaW4gPCAkKHdpbmRvdykud2lkdGgoKSkge1xuICAgIHBvcy54ID0geCArIGFuY2hvclxuICB9XG4gIC8vIHNob3cgcG9wdXAgdG8gdGhlIGxlZnQgb2YgdGhlIHdvcmQgaWYgaXQgZml0cyBpbnRvIHdpbmRvdyB0aGlzIHdheVxuICBlbHNlIGlmICh4IC0gYW5jaG9yIC0gb3V0ZXJXaWR0aCAtIG1hcmdpbiA+IDApIHtcbiAgICBwb3MueCA9IHggLSBhbmNob3IgLSBvdXRlcldpZHRoXG4gIH1cbiAgLy8gc2hvdyBwb3B1cCBhdCB0aGUgdmVyeSBsZWZ0IGlmIGl0IGlzIG5vdCB3aWRlciB0aGFuIHdpbmRvd1xuICBlbHNlIGlmIChvdXRlcldpZHRoICsgbWFyZ2luKjIgPCAkKHdpbmRvdykud2lkdGgoKSkge1xuICAgIHBvcy54ID0gbWFyZ2luXG4gIH1cbiAgLy8gcmVzaXplIHBvcHVwIHdpZHRoIHRvIGZpdCBpbnRvIHdpbmRvdyBhbmQgcG9zaXRpb24gaXQgdGhlIHZlcnkgbGVmdCBvZiB0aGUgd2luZG93XG4gIGVsc2Uge1xuICAgIGNvbnN0IG5vbl9jb250ZW50X3ggPSBvdXRlcldpZHRoIC0gTnVtYmVyKCRwb3B1cC5hdHRyKCdjb250ZW50LXdpZHRoJykpXG5cbiAgICAkcG9wdXAuYXR0cignY29udGVudC13aWR0aCcsICQod2luZG93KS53aWR0aCgpIC0gbWFyZ2luKjIgLSBub25fY29udGVudF94IClcbiAgICAkcG9wdXAuYXR0cignY29udGVudC1oZWlnaHQnLCBOdW1iZXIoJHBvcHVwLmF0dHIoJ2NvbnRlbnQtaGVpZ2h0JykpICsgNClcblxuICAgIHBvcy54ID0gbWFyZ2luXG4gIH1cblxuICAvLyBzaG93IHBvcHVwIGFib3ZlIHRoZSB3b3JkIGlmIGl0IGZpdHMgaW50byB3aW5kb3cgdGhpcyB3YXlcbiAgaWYgKHkgLSBhbmNob3IgLSBvdXRlckhlaWdodCAtIG1hcmdpbiA+IDApIHtcbiAgICBwb3MueSA9IHkgLSBhbmNob3IgLSBvdXRlckhlaWdodFxuICB9XG4gIC8vIHNob3cgcG9wdXAgYmVsb3cgdGhlIHdvcmQgaWYgaXQgZml0cyBpbnRvIHdpbmRvdyB0aGlzIHdheVxuICBlbHNlIGlmICh5ICsgYW5jaG9yICsgb3V0ZXJIZWlnaHQgKyBtYXJnaW4gPCAkKHdpbmRvdykuaGVpZ2h0KCkpIHtcbiAgICBwb3MueSA9IHkgKyBhbmNob3JcbiAgfVxuICAvLyBzaG93IHBvcHVwIGF0IHRoZSB2ZXJ5IHRvcCBvZiB0aGUgd2luZG93XG4gIGVsc2Uge1xuICAgIHBvcy55ID0gbWFyZ2luXG4gIH1cblxuICByZXR1cm4gcG9zXG59Il0sInNvdXJjZVJvb3QiOiIifQ==