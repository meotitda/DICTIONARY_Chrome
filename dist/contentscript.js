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
      chrome.runtime.sendMessage({
        handler: 'translate',
        word: selection
      }, function (response) {
        const translation = response.content.content;

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
  console.log('content', content);
  removePopup('transover-type-and-translate-popup');
  const $popup = createPopup('transover-popup');
  $('body').append($popup);
  $popup.on('transover-popup_content_updated', function () {
    const pos = calculatePosition(e.clientX, e.clientY, $popup);
    console.log('pos', pos);
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
  registerComponent('popup');
});

function registerComponent(component) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL3V0aWxzLmpzIiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vY29udGVudHNjcmlwdC5qcyJdLCJuYW1lcyI6WyJNT0RJRklFUl9LRVkiLCJyZXF1aXJlIiwibGFzdF9tb3VzZV9zdG9wIiwieCIsInkiLCJ0ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZUlkcyIsImxvYWRPcHRpb25zIiwiY2hyb21lIiwicnVudGltZSIsInNlbmRNZXNzYWdlIiwiaGFuZGxlciIsInJlc3BvbnNlIiwib3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsImNvbnNvbGUiLCJsb2ciLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJoaWRkZW4iLCIkIiwib24iLCJlIiwiY2xpY2siLCJ3aXRoT3B0aW9uc1NhdGlzZmllZCIsInRyYW5zbGF0ZV9ieSIsInRhcmdldCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwcm9jZXNzRXZlbnQiLCJrZXlkb3duIiwia2V5Q29kZSIsInBvcHVwX3Nob3dfdHJpZ2dlciIsInNob3dfcG9wdXBfa2V5X3ByZXNzZWQiLCJzZWxlY3Rpb24iLCJ3aW5kb3ciLCJnZXRTZWxlY3Rpb24iLCJ0b1N0cmluZyIsInNlbGVjdGlvbl9rZXlfb25seSIsIndvcmQiLCJ0cmFuc2xhdGlvbiIsImNvbnRlbnQiLCJ4eSIsImNsaWVudFgiLCJjbGllbnRZIiwibGFzdF90cmFuc2xhdGlvbiIsInNob3dQb3B1cCIsInJlbW92ZVBvcHVwIiwia2V5dXAiLCJkb19zdHVmZiIsImhpdF9lbGVtIiwiZWxlbWVudEZyb21Qb2ludCIsInNlbF9jb250YWluZXIiLCJnZXRSYW5nZUF0IiwiY29tbW9uQW5jZXN0b3JDb250YWluZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJFTEVNRU5UX05PREUiLCJwYXJlbnROb2RlIiwiaXMiLCJjb250YWlucyIsImNvbnRhaW5zTm9kZSIsImdldEhpdFdvcmQiLCJyZXN0b3JhYmxlIiwibm9kZSIsInJlcyIsImdldEV4YWN0VGV4dE5vZGUiLCJub2RlcyIsInRleHRfbm9kZXMiLCJ3cmFwIiwiaGl0X3RleHRfbm9kZSIsIm5vZGVOYW1lIiwidW53cmFwIiwiY2hpbGROb2RlcyIsIndvcmRfcmUiLCJwYXJlbnRfZm9udF9zdHlsZSIsImNzcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwiVEVYVF9OT0RFIiwiWFJlZ0V4cCIsInRlc3QiLCJub2RlVmFsdWUiLCJoaXRfd29yZCIsImh3IiwiZ2V0SGl0VGV4dCIsInRleHRDb250ZW50IiwicmVwbGFjZVdpdGgiLCJyZXBsYWNlIiwiTWF0aCIsInJvdW5kIiwiJDAiLCIkMSIsIiQyIiwibmV4dF9ub2RlIiwibWluaW1hbF90ZXh0X25vZGUiLCJoaXRfd29yZF9lbGVtIiwidGV4dCIsIiRwb3B1cCIsImNyZWF0ZVBvcHVwIiwiYXBwZW5kIiwicG9zIiwiY2FsY3VsYXRlUG9zaXRpb24iLCJlYWNoIiwic2hhZG93Um9vdCIsInF1ZXJ5U2VsZWN0b3IiLCJoaWRlIiwiYXR0ciIsInRvcCIsImxlZnQiLCJmYWRlSW4iLCJzdHJpbmdpZnkiLCJkb2N1bWVudEVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsInNlbGYiLCJmYWRlT3V0IiwicmVtb3ZlIiwicmVnaXN0ZXJDb21wb25lbnQiLCJjb21wb25lbnQiLCJodG1sIiwic2NyaXB0IiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwiZXh0ZW5zaW9uIiwiZ2V0VVJMIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwiZG9jIiwidGVtcGxhdGUiLCJpZCIsInNlbmQiLCJzIiwiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJzcmMiLCJhc3luYyIsImhlYWQiLCJtYXJnaW4iLCJhbmNob3IiLCJvdXRlcldpZHRoIiwiTnVtYmVyIiwib3V0ZXJIZWlnaHQiLCJ3aWR0aCIsIm5vbl9jb250ZW50X3giLCJoZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQU8sTUFBTUEsWUFBWSxHQUFHO0FBQ3hCLE1BQUksT0FEb0I7QUFDWCxNQUFJLE1BRE87QUFDQyxNQUFJLEtBREw7QUFDWSxNQUFJLFNBRGhCO0FBQzJCLE1BQUksU0FEL0I7QUFDMEMsTUFBSTtBQUQ5QyxDQUFyQixDOzs7Ozs7VUNBUDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7OztBQ05BLE1BQU07QUFBRUE7QUFBRixJQUFtQkMsbUJBQU8sQ0FBQyxtQ0FBRCxDQUFoQzs7QUFFQSxNQUFNQyxlQUFlLEdBQUc7QUFBQ0MsR0FBQyxFQUFFLENBQUo7QUFBT0MsR0FBQyxFQUFFO0FBQVYsQ0FBeEI7QUFDQSxNQUFNQyxTQUFTLEdBQUcsRUFBbEI7QUFDQSxNQUFNQyxXQUFXLEdBQUc7QUFDbEIscUJBQW1CLDBCQUREO0FBRWxCLHdDQUFzQztBQUZwQixDQUFwQjs7QUFLQSxTQUFTQyxXQUFULEdBQXVCO0FBQ25CQyxRQUFNLENBQUNDLE9BQVAsQ0FBZUMsV0FBZixDQUEyQjtBQUFDQyxXQUFPLEVBQUU7QUFBVixHQUEz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Q0FBQyxDQUFDZSxNQUFELENBQUQsQ0FBVThHLE1BQVYsRUFBeEMsRUFBNEQ7QUFDL0Q1QyxTQUFHLENBQUNsRyxDQUFKLEdBQVFBLENBQUMsR0FBR3dJLE1BQVo7QUFDRCxLQUZJLENBR0w7QUFISyxTQUlBO0FBQ0h0QyxXQUFHLENBQUNsRyxDQUFKLEdBQVF1SSxNQUFSO0FBQ0Q7O0FBRUQsU0FBT3JDLEdBQVA7QUFDRCxDIiwiZmlsZSI6ImNvbnRlbnRzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgTU9ESUZJRVJfS0VZID0ge1xuICAgIDE2OiAnc2hpZnQnLCAxNzogJ2N0cmwnLCAxODogJ2FsdCcsIDkxOiAnY29tbWFuZCcsIDkzOiAnY29tbWFuZCcsIDEzOiAnUmV0dXJuJ1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJjb25zdCB7IE1PRElGSUVSX0tFWSB9ID0gcmVxdWlyZShcIi4vbGliL3V0aWxzXCIpXG5cbmNvbnN0IGxhc3RfbW91c2Vfc3RvcCA9IHt4OiAwLCB5OiAwfVxuY29uc3QgdGVtcGxhdGVzID0ge31cbmNvbnN0IHRlbXBsYXRlSWRzID0ge1xuICAndHJhbnNvdmVyLXBvcHVwJzogJ3RyYW5zb3Zlci1wb3B1cC10ZW1wbGF0ZScsXG4gICd0cmFuc292ZXItdHlwZS1hbmQtdHJhbnNsYXRlLXBvcHVwJzogJ3RyYW5zb3Zlci10YXQtcG9wdXAtdGVtcGxhdGUnXG59XG5cbmZ1bmN0aW9uIGxvYWRPcHRpb25zKCkge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtoYW5kbGVyOiAnZ2V0X29wdGlvbnMnfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIG9wdGlvbnMgPSBKU09OLnBhcnNlKCByZXNwb25zZS5vcHRpb25zIClcbiAgICAgIGNvbnNvbGUubG9nKCdsb2FkT3B0aW9ucycsIHJlc3BvbnNlKVxuICAgIC8vICAgZGlzYWJsZV9vbl90aGlzX3BhZ2UgPSBpZ25vcmVUaGlzUGFnZShvcHRpb25zKVxuICAgIC8vICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2hhbmRsZXI6ICdzZXRJY29uJywgZGlzYWJsZWQ6IGRpc2FibGVfb25fdGhpc19wYWdlfSlcbiAgICB9KVxuICB9XG4gIGxvYWRPcHRpb25zKClcbiAgXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgIGxvYWRPcHRpb25zKClcbiAgICB9XG4gIH0sIGZhbHNlKVxuICBcbiAgXG5cbiAgJChkb2N1bWVudCkub24oJ21vdXNlc3RvcCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAvLyB3aXRoT3B0aW9uc1NhdGlzZmllZChlLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgLy8gdHJhbnNsYXRlIHNlbGVjdGlvbiB1bmxlc3MgJ3RyYW5zbGF0ZSBzZWxlY3Rpb24gb24gYWx0IG9ubHknIGlzIHNldFxuICAgIC8vICAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbigpLnRvU3RyaW5nKCkpIHtcbiAgICAvLyAgICAgICBpZiAoIW9wdGlvbnMuc2VsZWN0aW9uX2tleV9vbmx5KSB7XG4gICAgLy8gICAgICAgICBwcm9jZXNzRXZlbnQoZSlcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgaWYgKG9wdGlvbnMudHJhbnNsYXRlX2J5ID09ICdwb2ludCcpIHtcbiAgICAvLyAgICAgICAgIHByb2Nlc3NFdmVudChlKVxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSlcbiAgICAgICAgY29uc29sZS5sb2coJ21vdXNlc3RvcCcpXG4gICAgfVxuKVxuXG4kKGRvY3VtZW50KS5jbGljayhmdW5jdGlvbihlKSB7XG4gIHdpdGhPcHRpb25zU2F0aXNmaWVkKGUsIGZ1bmN0aW9uKCkge1xuICAgIGlmIChvcHRpb25zLnRyYW5zbGF0ZV9ieSAhPSAnY2xpY2snKVxuXG4gICAgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJ2EnKS5sZW5ndGggPiAwKSAvLyBjbG9zZWQgcGFyZW50XG4gICAgICByZXR1cm5cblxuICAgIHByb2Nlc3NFdmVudChlKVxuICB9KVxuICByZXR1cm4gdHJ1ZVxufSlcblxuJChkb2N1bWVudCkua2V5ZG93bihmdW5jdGlvbihlKSB7XG4gIGlmIChNT0RJRklFUl9LRVlbZS5rZXlDb2RlXSA9PSBvcHRpb25zLnBvcHVwX3Nob3dfdHJpZ2dlcikge1xuICAgIHNob3dfcG9wdXBfa2V5X3ByZXNzZWQgPSB0cnVlXG5cbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKVxuXG4gICAgaWYgKG9wdGlvbnMuc2VsZWN0aW9uX2tleV9vbmx5ICYmIHNlbGVjdGlvbikge1xuICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2hhbmRsZXI6ICd0cmFuc2xhdGUnLCB3b3JkOiBzZWxlY3Rpb259LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zdCB0cmFuc2xhdGlvbiA9IHJlc3BvbnNlLmNvbnRlbnQuY29udGVudFxuXG4gICAgICAgIGlmICghdHJhbnNsYXRpb24pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnc2tpcHBpbmcgZW1wdHkgdHJhbnNsYXRpb24nKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeHkgPSB7IGNsaWVudFg6IGxhc3RfbW91c2Vfc3RvcC54LCBjbGllbnRZOiBsYXN0X21vdXNlX3N0b3AueSB9XG4gICAgICAgIGxhc3RfdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvblxuICAgICAgICBzaG93UG9wdXAoeHksIHRyYW5zbGF0aW9uKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvLyBIaWRlIHRhdCBwb3B1cCBvbiBlc2NhcGVcbiAgaWYgKGUua2V5Q29kZSA9PSAyNykge1xuICAgIHJlbW92ZVBvcHVwKCd0cmFuc292ZXItdHlwZS1hbmQtdHJhbnNsYXRlLXBvcHVwJylcbiAgfVxufSkua2V5dXAoZnVuY3Rpb24oZSkge1xuICBcbiAgaWYgKE1PRElGSUVSX0tFWVtlLmtleUNvZGVdID09IG9wdGlvbnMucG9wdXBfc2hvd190cmlnZ2VyKSB7XG4gICAgc2hvd19wb3B1cF9rZXlfcHJlc3NlZCA9IGZhbHNlXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIHdpdGhPcHRpb25zU2F0aXNmaWVkKGUsIGRvX3N0dWZmKSB7XG4gICAgLy8gcHJlLWhvb2tcbiAgICBkb19zdHVmZigpXG59XG5cblxuLy90cmFuc2xhdGVcblxuZnVuY3Rpb24gcHJvY2Vzc0V2ZW50KGUpIHtcblxuICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcbiAgY29uc3QgaGl0X2VsZW0gPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUuY2xpZW50WCwgZS5jbGllbnRZKVxuICBpZiAoIWhpdF9lbGVtKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBsZXQgd29yZCA9ICcnXG4gIGlmIChzZWxlY3Rpb24udG9TdHJpbmcoKSkge1xuICAgIGlmIChvcHRpb25zLnNlbGVjdGlvbl9rZXlfb25seSkge1xuICAgICAgY29uc29sZS5sb2coJ1NraXAgYmVjYXVzZSBcInNlbGVjdGlvbl9rZXlfb25seVwiJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBzZWxfY29udGFpbmVyID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCkuY29tbW9uQW5jZXN0b3JDb250YWluZXJcbiAgICBcbiAgICB3aGlsZSAoc2VsX2NvbnRhaW5lci5ub2RlVHlwZSAhPSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgc2VsX2NvbnRhaW5lciA9IHNlbF9jb250YWluZXIucGFyZW50Tm9kZVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgICggJChoaXRfZWxlbSkuaXMoc2VsX2NvbnRhaW5lcikgfHwgJC5jb250YWlucyhzZWxfY29udGFpbmVyLCBoaXRfZWxlbSkgKVxuICAgICAgICAmJiBzZWxlY3Rpb24uY29udGFpbnNOb2RlKGhpdF9lbGVtLCB0cnVlKVxuICAgICkge1xuICAgICAgd29yZCA9IHNlbGVjdGlvbi50b1N0cmluZygpXG4gICAgfVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy50cmFuc2xhdGVfYnkgPT0gJ3BvaW50Jykge1xuICAgICAgICB3b3JkID0gZ2V0SGl0V29yZChlKVxuICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3b3JkID0gZ2V0SGl0V29yZChlKVxuICAgIH1cbiAgXG4gICAgY29uc29sZS5sb2coJ2hpdCcsIHdvcmQpXG5cbiAgICBpZiAod29yZCAhPSAnJykge1xuICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2hhbmRsZXI6ICd0cmFuc2xhdGUnLCB3b3JkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlOiAnLCByZXNwb25zZSlcblxuICAgIC8vICAgLy8gICBjb25zdCB0cmFuc2xhdGlvbiA9IFRyYW5zT3Zlci5kZXNlcmlhbGl6ZShyZXNwb25zZS50cmFuc2xhdGlvbilcblxuICAgIC8vICAgLy8gICBpZiAoIXRyYW5zbGF0aW9uKSB7XG4gICAgLy8gICAvLyAgICAgY29uc29sZS5sb2coJ3NraXBwaW5nIGVtcHR5IHRyYW5zbGF0aW9uJylcbiAgICAvLyAgIC8vICAgICByZXR1cm5cbiAgICAvLyAgIC8vICAgfVxuXG4gICAgLy8gICAvLyAgIGxhc3RfdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvblxuICAgIC8vICAgLy8gICBzaG93UG9wdXAoZSwgVHJhbnNPdmVyLmZvcm1hdFRyYW5zbGF0aW9uKHRyYW5zbGF0aW9uLCBUcmFuc092ZXJMYW5ndWFnZXNbcmVzcG9uc2UudGxdLmRpcmVjdGlvbiwgcmVzcG9uc2Uuc2wsIG9wdGlvbnMpKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0SGl0V29yZChlKSB7XG5cbiAgZnVuY3Rpb24gcmVzdG9yYWJsZShub2RlLCBkb19zdHVmZikge1xuICAgIC8vICQobm9kZSkud3JhcCgnPHRyYW5zd3JhcHBlciAvPicpXG4gICAgY29uc3QgcmVzID0gZG9fc3R1ZmYobm9kZSlcbiAgICBjb25zb2xlLmxvZygnc29tZSBUYWdnaW5nJylcbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICBmdW5jdGlvbiBnZXRFeGFjdFRleHROb2RlKG5vZGVzLCBlKSB7XG4gICAgJCh0ZXh0X25vZGVzKS53cmFwKCc8dHJhbnNibG9jayAvPicpXG4gICAgbGV0IGhpdF90ZXh0X25vZGUgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUuY2xpZW50WCwgZS5jbGllbnRZKVxuXG4gICAgLy9tZWFucyB3ZSBoaXQgYmV0d2VlbiB0aGUgbGluZXNcbiAgICBpZiAoaGl0X3RleHRfbm9kZS5ub2RlTmFtZSAhPSAnVFJBTlNCTE9DSycpIHtcbiAgICAgICQodGV4dF9ub2RlcykudW53cmFwKClcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgaGl0X3RleHRfbm9kZSA9IGhpdF90ZXh0X25vZGUuY2hpbGROb2Rlc1swXVxuXG4gICAgJCh0ZXh0X25vZGVzKS51bndyYXAoKVxuXG4gICAgcmV0dXJuIGhpdF90ZXh0X25vZGVcbiAgfVxuXG4gIGNvbnN0IGhpdF9lbGVtID0gJChkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUuY2xpZW50WCwgZS5jbGllbnRZKSlcbiAgY29uc3Qgd29yZF9yZSA9ICdcXFxccHtMfSsoPzpbXFwn4oCZXVxcXFxwe0x9KykqJ1xuICBjb25zdCBwYXJlbnRfZm9udF9zdHlsZSA9IHtcbiAgICAnbGluZS1oZWlnaHQnOiBoaXRfZWxlbS5jc3MoJ2xpbmUtaGVpZ2h0JyksXG4gICAgJ2ZvbnQtc2l6ZSc6ICcxZW0nLFxuICAgICdmb250LWZhbWlseSc6IGhpdF9lbGVtLmNzcygnZm9udC1mYW1pbHknKVxuICB9XG5cbiAgY29uc3QgdGV4dF9ub2RlcyA9IGhpdF9lbGVtLmNvbnRlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMubm9kZVR5cGUgPT0gTm9kZS5URVhUX05PREUgJiYgWFJlZ0V4cCh3b3JkX3JlKS50ZXN0KCB0aGlzLm5vZGVWYWx1ZSApXG4gIH0pXG5cbiAgaWYgKHRleHRfbm9kZXMubGVuZ3RoID09IDApIHtcbiAgICBjb25zb2xlLmxvZygnbm8gdGV4dCcpXG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBjb25zdCBoaXRfdGV4dF9ub2RlID0gZ2V0RXhhY3RUZXh0Tm9kZSh0ZXh0X25vZGVzLCBlKVxuICBpZiAoIWhpdF90ZXh0X25vZGUpIHtcbiAgICBjb25zb2xlLmxvZygnaGl0IGJldHdlZW4gbGluZXMnKVxuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgY29uc3QgaGl0X3dvcmQgPSByZXN0b3JhYmxlKGhpdF90ZXh0X25vZGUsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBodyA9ICcnXG5cbiAgICBmdW5jdGlvbiBnZXRIaXRUZXh0KG5vZGUsIHBhcmVudF9mb250X3N0eWxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnZ2V0SGl0VGV4dDogXFwnJyArIG5vZGUudGV4dENvbnRlbnQgKyAnXFwnJylcblxuICAgICAgaWYgKFhSZWdFeHAod29yZF9yZSkudGVzdCggbm9kZS50ZXh0Q29udGVudCApKSB7XG4gICAgICAgICQobm9kZSkucmVwbGFjZVdpdGgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudGV4dENvbnRlbnQucmVwbGFjZShYUmVnRXhwKCdeKC57JytNYXRoLnJvdW5kKCBub2RlLnRleHRDb250ZW50Lmxlbmd0aC8yICkrJ30oPzpcXFxccHtMfXxbXFwn4oCZXSg/PVxcXFxwe0x9KSkqKSguKiknLCAncycpLCBmdW5jdGlvbigkMCwgJDEsICQyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJDAnLCAkMCwgJyQxJywgJDEsICckMicsICQyKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgJCgndHJhbnNibG9jaycpLmNzcyhwYXJlbnRfZm9udF9zdHlsZSlcblxuICAgICAgICBjb25zdCBuZXh0X25vZGUgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUuY2xpZW50WCwgZS5jbGllbnRZKS5jaGlsZE5vZGVzWzBdXG5cbiAgICAgICAgaWYgKG5leHRfbm9kZS50ZXh0Q29udGVudCA9PSBub2RlLnRleHRDb250ZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG5leHRfbm9kZVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiBnZXRIaXRUZXh0KG5leHRfbm9kZSwgcGFyZW50X2ZvbnRfc3R5bGUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1pbmltYWxfdGV4dF9ub2RlID0gZ2V0SGl0VGV4dChoaXRfdGV4dF9ub2RlLCBwYXJlbnRfZm9udF9zdHlsZSlcblxuICAgIGlmIChtaW5pbWFsX3RleHRfbm9kZSkge1xuICAgICAgLy93cmFwIHdvcmRzIGluc2lkZSB0ZXh0IG5vZGUgaW50byA8dHJhbnNvdmVyPiBlbGVtZW50XG4gICAgICAkKG1pbmltYWxfdGV4dF9ub2RlKS5yZXBsYWNlV2l0aChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dENvbnRlbnQucmVwbGFjZShYUmVnRXhwKCcoPHw+fCZ8Jyt3b3JkX3JlKycpJywgJ2dzJyksIGZ1bmN0aW9uICgkMCwgJDEpIHtcbiAgICAgICAgICBzd2l0Y2ggKCQxKSB7XG4gICAgICAgICAgY2FzZSAnPCc6IHJldHVybiAnJmx0OydcbiAgICAgICAgICBjYXNlICc+JzogcmV0dXJuICcmZ3Q7J1xuICAgICAgICAgIGNhc2UgJyYnOiByZXR1cm4gJyZhbXA7J1xuICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiAnPHRyYW5zb3Zlcj4nKyQxKyc8L3RyYW5zb3Zlcj4nXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgJCgndHJhbnNvdmVyJykuY3NzKHBhcmVudF9mb250X3N0eWxlKVxuXG4gICAgICAvL2dldCB0aGUgZXhhY3Qgd29yZCB1bmRlciBjdXJzb3JcbiAgICAgIGNvbnN0IGhpdF93b3JkX2VsZW0gPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUuY2xpZW50WCwgZS5jbGllbnRZKVxuXG4gICAgICAvL25vIHdvcmQgdW5kZXIgY3Vyc29yPyB3ZSBhcmUgZG9uZVxuICAgICAgaWYgKGhpdF93b3JkX2VsZW0ubm9kZU5hbWUgIT0gJ1RSQU5TT1ZFUicpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ21pc3NlZCEnKVxuICAgICAgfVxuICAgICAgZWxzZSAge1xuICAgICAgICBodyA9ICQoaGl0X3dvcmRfZWxlbSkudGV4dCgpXG4gICAgICAgIGNvbnNvbGUubG9nKCdnb3QgaXQ6IFxcJycraHcrJ1xcJycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGh3XG4gIH0pXG5cbiAgcmV0dXJuIGhpdF93b3JkXG59XG5cbmZ1bmN0aW9uIHNob3dQb3B1cChlLCBjb250ZW50KSB7XG4gIGNvbnNvbGUubG9nKCdjb250ZW50JywgY29udGVudClcbiAgcmVtb3ZlUG9wdXAoJ3RyYW5zb3Zlci10eXBlLWFuZC10cmFuc2xhdGUtcG9wdXAnKVxuXG4gIGNvbnN0ICRwb3B1cCA9IGNyZWF0ZVBvcHVwKCd0cmFuc292ZXItcG9wdXAnKVxuICAkKCdib2R5JykuYXBwZW5kKCRwb3B1cClcblxuICAkcG9wdXAub24oJ3RyYW5zb3Zlci1wb3B1cF9jb250ZW50X3VwZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBwb3MgPSBjYWxjdWxhdGVQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSwgJHBvcHVwKVxuICAgIGNvbnNvbGUubG9nKCdwb3MnLCBwb3MpXG4gICAgJHBvcHVwXG4gICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignbWFpbicpKS5oaWRlKClcbiAgICAgIH0pXG4gICAgICAuYXR0cih7IHRvcDogcG9zLnksIGxlZnQ6IHBvcy54IH0pXG4gICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignbWFpbicpKS5mYWRlSW4oJ2Zhc3QnKVxuICAgICAgfSlcbiAgfSlcbiAgJHBvcHVwLmF0dHIoe2NvbnRlbnQsIG9wdGlvbnM6IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpfSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlUG9wdXAobm9kZVR5cGUpIHtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHRlbXBsYXRlc1t0ZW1wbGF0ZUlkc1tub2RlVHlwZV1dKVxuICByZXR1cm4gJCgnPCcrbm9kZVR5cGUrJz4nKVxufVxuXG5mdW5jdGlvbiByZW1vdmVQb3B1cChub2RlVHlwZSkge1xuICAkKG5vZGVUeXBlKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgJCh0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignbWFpbicpKS5mYWRlT3V0KCdmYXN0JywgZnVuY3Rpb24oKSB7IHNlbGYucmVtb3ZlKCkgfSlcbiAgfSlcbiAgJCgnIycrdGVtcGxhdGVJZHNbbm9kZVR5cGVdKS5yZW1vdmUoKVxufVxuXG4kKGZ1bmN0aW9uKCkge1xuICByZWdpc3RlckNvbXBvbmVudCgncG9wdXAnKVxufSlcblxuZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50KSB7XG4gIGNvbnN0IGh0bWwgPSBjb21wb25lbnQgKyAnLmh0bWwnXG4gIGNvbnN0IHNjcmlwdCA9IGNvbXBvbmVudCArICcuanMnXG5cbiAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgeGhyLm9wZW4oJ0dFVCcsIGNocm9tZS5leHRlbnNpb24uZ2V0VVJMKGh0bWwpLCB0cnVlKVxuICB4aHIucmVzcG9uc2VUeXBlID0gJ2RvY3VtZW50J1xuICB4aHIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgIGNvbnN0IGRvYyA9IGUudGFyZ2V0LnJlc3BvbnNlXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2MucXVlcnlTZWxlY3RvcigndGVtcGxhdGUnKVxuICAgIHRlbXBsYXRlc1t0ZW1wbGF0ZS5pZF0gPSB0ZW1wbGF0ZVxuICB9XG4gIHhoci5zZW5kKClcblxuICBjb25zdCBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbiAgcy5zcmMgPSBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChzY3JpcHQpXG4gIHMuYXN5bmMgPSB0cnVlXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQocylcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlUG9zaXRpb24oeCwgeSwgJHBvcHVwKSB7XG4gIGNvbnN0IHBvcyA9IHt9XG4gIGNvbnN0IG1hcmdpbiA9IDVcbiAgY29uc3QgYW5jaG9yID0gMTBcbiAgY29uc3Qgb3V0ZXJXaWR0aCA9IE51bWJlcigkcG9wdXAuYXR0cignb3V0ZXItd2lkdGgnKSlcbiAgY29uc3Qgb3V0ZXJIZWlnaHQgPSBOdW1iZXIoJHBvcHVwLmF0dHIoJ291dGVyLWhlaWdodCcpKVxuXG4gIC8vIHNob3cgcG9wdXAgdG8gdGhlIHJpZ2h0IG9mIHRoZSB3b3JkIGlmIGl0IGZpdHMgaW50byB3aW5kb3cgdGhpcyB3YXlcbiAgaWYgKHggKyBhbmNob3IgKyBvdXRlcldpZHRoICsgbWFyZ2luIDwgJCh3aW5kb3cpLndpZHRoKCkpIHtcbiAgICBwb3MueCA9IHggKyBhbmNob3JcbiAgfVxuICAvLyBzaG93IHBvcHVwIHRvIHRoZSBsZWZ0IG9mIHRoZSB3b3JkIGlmIGl0IGZpdHMgaW50byB3aW5kb3cgdGhpcyB3YXlcbiAgZWxzZSBpZiAoeCAtIGFuY2hvciAtIG91dGVyV2lkdGggLSBtYXJnaW4gPiAwKSB7XG4gICAgcG9zLnggPSB4IC0gYW5jaG9yIC0gb3V0ZXJXaWR0aFxuICB9XG4gIC8vIHNob3cgcG9wdXAgYXQgdGhlIHZlcnkgbGVmdCBpZiBpdCBpcyBub3Qgd2lkZXIgdGhhbiB3aW5kb3dcbiAgZWxzZSBpZiAob3V0ZXJXaWR0aCArIG1hcmdpbioyIDwgJCh3aW5kb3cpLndpZHRoKCkpIHtcbiAgICBwb3MueCA9IG1hcmdpblxuICB9XG4gIC8vIHJlc2l6ZSBwb3B1cCB3aWR0aCB0byBmaXQgaW50byB3aW5kb3cgYW5kIHBvc2l0aW9uIGl0IHRoZSB2ZXJ5IGxlZnQgb2YgdGhlIHdpbmRvd1xuICBlbHNlIHtcbiAgICBjb25zdCBub25fY29udGVudF94ID0gb3V0ZXJXaWR0aCAtIE51bWJlcigkcG9wdXAuYXR0cignY29udGVudC13aWR0aCcpKVxuXG4gICAgJHBvcHVwLmF0dHIoJ2NvbnRlbnQtd2lkdGgnLCAkKHdpbmRvdykud2lkdGgoKSAtIG1hcmdpbioyIC0gbm9uX2NvbnRlbnRfeCApXG4gICAgJHBvcHVwLmF0dHIoJ2NvbnRlbnQtaGVpZ2h0JywgTnVtYmVyKCRwb3B1cC5hdHRyKCdjb250ZW50LWhlaWdodCcpKSArIDQpXG5cbiAgICBwb3MueCA9IG1hcmdpblxuICB9XG5cbiAgLy8gc2hvdyBwb3B1cCBhYm92ZSB0aGUgd29yZCBpZiBpdCBmaXRzIGludG8gd2luZG93IHRoaXMgd2F5XG4gIGlmICh5IC0gYW5jaG9yIC0gb3V0ZXJIZWlnaHQgLSBtYXJnaW4gPiAwKSB7XG4gICAgcG9zLnkgPSB5IC0gYW5jaG9yIC0gb3V0ZXJIZWlnaHRcbiAgfVxuICAvLyBzaG93IHBvcHVwIGJlbG93IHRoZSB3b3JkIGlmIGl0IGZpdHMgaW50byB3aW5kb3cgdGhpcyB3YXlcbiAgZWxzZSBpZiAoeSArIGFuY2hvciArIG91dGVySGVpZ2h0ICsgbWFyZ2luIDwgJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgcG9zLnkgPSB5ICsgYW5jaG9yXG4gIH1cbiAgLy8gc2hvdyBwb3B1cCBhdCB0aGUgdmVyeSB0b3Agb2YgdGhlIHdpbmRvd1xuICBlbHNlIHtcbiAgICBwb3MueSA9IG1hcmdpblxuICB9XG5cbiAgcmV0dXJuIHBvc1xufSJdLCJzb3VyY2VSb290IjoiIn0=