/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/options.js":
/*!************************!*
  !*** ./lib/options.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  except_urls: function (urls) {
    if (urls instanceof Array) {
      localStorage.except_urls = JSON.stringify(urls);
    }

    if (localStorage.except_urls) {
      try {
        return JSON.parse(localStorage.except_urls);
      } catch (e) {
        // backwards compatibitlity
        return localStorage.except_urls.split(',');
      }
    }

    return [];
  },
  only_urls: function (urls) {
    if (urls instanceof Array) {
      localStorage.only_urls = JSON.stringify(urls);
    }

    if (localStorage.only_urls) {
      try {
        return JSON.parse(localStorage.only_urls);
      } catch (e) {
        // backwards compatibitlity
        return localStorage.only_urls.split(',');
      }
    }

    return [];
  },
  word_key_only: function (arg) {
    if (arg != undefined) {
      localStorage['word_key_only'] = arg;
    }

    return parseInt(localStorage['word_key_only']);
  },
  selection_key_only: function (arg) {
    if (arg != undefined) {
      localStorage['selection_key_only'] = arg;
    }

    return parseInt(localStorage['selection_key_only']);
  },
  translate_by: function (arg) {
    if (arg == 'click' || arg == 'point') {
      localStorage.translate_by = arg;
    }

    return localStorage.translate_by || 'click';
  },
  delay: function (ms) {
    if (ms != undefined && !isNaN(parseFloat(ms)) && isFinite(ms)) {
      localStorage['delay'] = ms;
    }

    return localStorage['delay'] == undefined ? 700 : parseInt(localStorage['delay']);
  },
  popup_show_trigger: function (arg) {
    if (arg != undefined) {
      localStorage['popup_show_trigger'] = arg;
    }

    return localStorage['popup_show_trigger'] || 'command';
  },
  fontSize: function (arg) {
    if (arg != undefined) {
      localStorage['fontSize'] = arg;
    }

    return parseInt(localStorage['fontSize'] || 14);
  }
});

/***/ }),

/***/ "./lib/options_script.js":
/*!*******************************!*
  !*** ./lib/options_script.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./options */ "./lib/options.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./lib/utils.js");



function save_options() {
  function get_except_urls() {
    let except_urls = [];
    except_urls = $('.except_url_input').filter(function () {
      return this.value;
    }).map(function () {
      return this.value;
    }).get();
    return except_urls;
  }

  function get_only_urls() {
    let only_urls = [];
    only_urls = $('.only_url_input').filter(function () {
      return this.value;
    }).map(function () {
      return this.value;
    }).get();
    return only_urls;
  }

  _options__WEBPACK_IMPORTED_MODULE_0__.default.except_urls(get_except_urls());
  _options__WEBPACK_IMPORTED_MODULE_0__.default.only_urls(get_only_urls());
  _options__WEBPACK_IMPORTED_MODULE_0__.default.word_key_only($('#word_key_only:checked').val() ? 1 : 0);
  _options__WEBPACK_IMPORTED_MODULE_0__.default.selection_key_only($('#selection_key_only:checked').val() ? 1 : 0);
  _options__WEBPACK_IMPORTED_MODULE_0__.default.delay($('#delay').val());
  _options__WEBPACK_IMPORTED_MODULE_0__.default.fontSize($('#fontSize').val());
  _options__WEBPACK_IMPORTED_MODULE_0__.default.popup_show_trigger($('#word_key_only_key').val());
  $('#status').fadeIn().delay(3000).fadeOut();
}

function populate_except_urls() {
  function add_exc_url(url) {
    let button;
    const input = $('<input type="text" class="except_url_input">').attr('size', 100).val(url);

    const rm_callback = function () {
      $(this).closest('tr').fadeOut('fast', function () {
        $(this).remove();
      });
    };

    if (url) {
      button = $('<button>', {
        text: 'X'
      }).click(rm_callback);
    } else {
      button = $('<button>', {
        text: '+'
      }).click(function () {
        if ($('.except_url_input', $(this).closest('tr')).val() > '') {
          $(this).text('X').off('click').click(rm_callback);
          add_exc_url();
        }
      });
    }

    $('<tr>', {
      css: {
        display: 'none'
      }
    }).fadeIn().append($('<td>').append(input)).append($('<td>').append(button)).appendTo($('#exc_urls_table'));
  }

  const saved_except_urls = _options__WEBPACK_IMPORTED_MODULE_0__.default.except_urls();
  saved_except_urls.forEach(function (url) {
    add_exc_url(url);
  });
  add_exc_url();
}

function populate_only_urls() {
  function add_only_url(url) {
    let button;
    const input = $('<input type="text" class="only_url_input">').attr('size', 100).val(url);

    const rm_callback = function () {
      $(this).closest('tr').fadeOut('fast', function () {
        $(this).remove();
      });
    };

    if (url) {
      button = $('<button>', {
        text: 'X'
      }).click(rm_callback);
    } else {
      button = $('<button>', {
        text: '+'
      }).click(function () {
        if ($('.only_url_input', $(this).closest('tr')).val() > '') {
          $(this).text('X').off('click').click(rm_callback);
          add_only_url();
        }
      });
    }

    $('<tr>', {
      css: {
        display: 'none'
      }
    }).fadeIn().append($('<td>').append(input)).append($('<td>').append(button)).appendTo($('#only_urls_table'));
  }

  const saved_only_urls = _options__WEBPACK_IMPORTED_MODULE_0__.default.only_urls();
  saved_only_urls.forEach(function (url) {
    add_only_url(url);
  });
  add_only_url();
}

function populate_popup_show_trigger() {
  const saved_popup_show_trigger = _options__WEBPACK_IMPORTED_MODULE_0__.default.popup_show_trigger();
  [...new Set(Object.values(_utils__WEBPACK_IMPORTED_MODULE_1__.MODIFIER_KEY))].forEach(function (key) {
    $('#word_key_only_key, #selection_key_only_key').each(function () {
      $(this).append($('<option>', {
        value: key
      }).text(key).prop('selected', saved_popup_show_trigger == key));
    });
  });
  $('#word_key_only_key, #selection_key_only_key').change(function () {
    $('#word_key_only_key, #selection_key_only_key').val(this.value);
  });
}

$(function () {
  populate_except_urls();
  populate_only_urls();
  populate_popup_show_trigger();

  if (_options__WEBPACK_IMPORTED_MODULE_0__.default.word_key_only()) {
    $('#delay').attr('disabled', true).parent().addClass('disabled');
  }

  $('#word_key_only').attr('checked', _options__WEBPACK_IMPORTED_MODULE_0__.default.word_key_only() ? true : false).click(function () {
    if ($('#translate_by').val() == 'point' && !$(this).attr('checked')) {
      $('#delay').attr('disabled', false).parent().removeClass('disabled');
    } else {
      $('#delay').attr('disabled', true).parent().addClass('disabled');
    }
  });
  $('#selection_key_only').attr('checked', _options__WEBPACK_IMPORTED_MODULE_0__.default.selection_key_only() ? true : false);
  $('#delay').val(_options__WEBPACK_IMPORTED_MODULE_0__.default.delay());
  $('#fontSize').val(_options__WEBPACK_IMPORTED_MODULE_0__.default.fontSize());
  $('#save_button').click(function () {
    save_options();
  });
  $(document).on('keydown', function (e) {
    if (e.keyCode == 13) {
      save_options();
    }
  });
  $('#more_options_link').on('click', function () {
    $('#more_options_link').hide();
    $('#more_options').fadeIn();
    return false;
  });
  $('.set_hotkey').on('click', function () {
    chrome.tabs.create({
      url: 'chrome://extensions/configureCommands'
    });
    return false;
  });
});

/***/ }),

/***/ "./lib/utils.js":
/*!**********************!*
  !*** ./lib/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./lib/options_script.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL29wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy8uL2xpYi9vcHRpb25zX3NjcmlwdC5qcyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL3V0aWxzLmpzIiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6WyJleGNlcHRfdXJscyIsInVybHMiLCJBcnJheSIsImxvY2FsU3RvcmFnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZSIsImUiLCJzcGxpdCIsIm9ubHlfdXJscyIsIndvcmRfa2V5X29ubHkiLCJhcmciLCJ1bmRlZmluZWQiLCJwYXJzZUludCIsInNlbGVjdGlvbl9rZXlfb25seSIsInRyYW5zbGF0ZV9ieSIsImRlbGF5IiwibXMiLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsInBvcHVwX3Nob3dfdHJpZ2dlciIsImZvbnRTaXplIiwic2F2ZV9vcHRpb25zIiwiZ2V0X2V4Y2VwdF91cmxzIiwiJCIsImZpbHRlciIsInZhbHVlIiwibWFwIiwiZ2V0IiwiZ2V0X29ubHlfdXJscyIsIk9wdGlvbnMiLCJ2YWwiLCJmYWRlSW4iLCJmYWRlT3V0IiwicG9wdWxhdGVfZXhjZXB0X3VybHMiLCJhZGRfZXhjX3VybCIsInVybCIsImJ1dHRvbiIsImlucHV0IiwiYXR0ciIsInJtX2NhbGxiYWNrIiwiY2xvc2VzdCIsInJlbW92ZSIsInRleHQiLCJjbGljayIsIm9mZiIsImNzcyIsImRpc3BsYXkiLCJhcHBlbmQiLCJhcHBlbmRUbyIsInNhdmVkX2V4Y2VwdF91cmxzIiwiZm9yRWFjaCIsInBvcHVsYXRlX29ubHlfdXJscyIsImFkZF9vbmx5X3VybCIsInNhdmVkX29ubHlfdXJscyIsInBvcHVsYXRlX3BvcHVwX3Nob3dfdHJpZ2dlciIsInNhdmVkX3BvcHVwX3Nob3dfdHJpZ2dlciIsIlNldCIsIk9iamVjdCIsInZhbHVlcyIsIk1PRElGSUVSX0tFWSIsImtleSIsImVhY2giLCJwcm9wIiwiY2hhbmdlIiwicGFyZW50IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImRvY3VtZW50Iiwib24iLCJrZXlDb2RlIiwiaGlkZSIsImNocm9tZSIsInRhYnMiLCJjcmVhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWU7QUFDZkEsYUFBVyxFQUFFLFVBQVNDLElBQVQsRUFBZTtBQUN4QixRQUFJQSxJQUFJLFlBQVlDLEtBQXBCLEVBQTJCO0FBQ3pCQyxrQkFBWSxDQUFDSCxXQUFiLEdBQTJCSSxJQUFJLENBQUNDLFNBQUwsQ0FBZUosSUFBZixDQUEzQjtBQUNEOztBQUNELFFBQUlFLFlBQVksQ0FBQ0gsV0FBakIsRUFBOEI7QUFDNUIsVUFBSTtBQUNGLGVBQU9JLElBQUksQ0FBQ0UsS0FBTCxDQUFXSCxZQUFZLENBQUNILFdBQXhCLENBQVA7QUFDRCxPQUZELENBRUUsT0FBT08sQ0FBUCxFQUFVO0FBQ1Y7QUFDQSxlQUFPSixZQUFZLENBQUNILFdBQWIsQ0FBeUJRLEtBQXpCLENBQStCLEdBQS9CLENBQVA7QUFDRDtBQUNGOztBQUNELFdBQU8sRUFBUDtBQUNELEdBZFk7QUFlYkMsV0FBUyxFQUFFLFVBQVNSLElBQVQsRUFBZTtBQUN4QixRQUFJQSxJQUFJLFlBQVlDLEtBQXBCLEVBQTJCO0FBQ3pCQyxrQkFBWSxDQUFDTSxTQUFiLEdB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VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im9wdGlvbnNfc2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuZXhjZXB0X3VybHM6IGZ1bmN0aW9uKHVybHMpIHtcbiAgICBpZiAodXJscyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBsb2NhbFN0b3JhZ2UuZXhjZXB0X3VybHMgPSBKU09OLnN0cmluZ2lmeSh1cmxzKVxuICAgIH1cbiAgICBpZiAobG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZXhjZXB0X3VybHMpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYml0bGl0eVxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzLnNwbGl0KCcsJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdXG4gIH0sXG4gIG9ubHlfdXJsczogZnVuY3Rpb24odXJscykge1xuICAgIGlmICh1cmxzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5vbmx5X3VybHMgPSBKU09OLnN0cmluZ2lmeSh1cmxzKVxuICAgIH1cbiAgICBpZiAobG9jYWxTdG9yYWdlLm9ubHlfdXJscykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLm9ubHlfdXJscylcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaXRsaXR5XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uub25seV91cmxzLnNwbGl0KCcsJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdXG4gIH0sXG4gIHdvcmRfa2V5X29ubHk6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ3dvcmRfa2V5X29ubHknXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQoIGxvY2FsU3RvcmFnZVsnd29yZF9rZXlfb25seSddIClcbiAgfSxcbiAgc2VsZWN0aW9uX2tleV9vbmx5OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnICE9IHVuZGVmaW5lZCkge1xuICAgICAgbG9jYWxTdG9yYWdlWydzZWxlY3Rpb25fa2V5X29ubHknXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQoIGxvY2FsU3RvcmFnZVsnc2VsZWN0aW9uX2tleV9vbmx5J10gKVxuICB9LFxuICB0cmFuc2xhdGVfYnk6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgPT0gJ2NsaWNrJyB8fCBhcmcgPT0gJ3BvaW50Jykge1xuICAgICAgbG9jYWxTdG9yYWdlLnRyYW5zbGF0ZV9ieSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnRyYW5zbGF0ZV9ieSB8fCAnY2xpY2snXG4gIH0sXG4gIGRlbGF5OiBmdW5jdGlvbihtcykge1xuICAgIGlmIChtcyAhPSB1bmRlZmluZWQgJiYgIWlzTmFOKHBhcnNlRmxvYXQobXMpKSAmJiBpc0Zpbml0ZShtcykpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVsnZGVsYXknXSA9IG1zXG4gICAgfVxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2VbJ2RlbGF5J10gPT0gdW5kZWZpbmVkID8gNzAwIDogcGFyc2VJbnQobG9jYWxTdG9yYWdlWydkZWxheSddKVxuICB9LFxuICBwb3B1cF9zaG93X3RyaWdnZXI6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ3BvcHVwX3Nob3dfdHJpZ2dlciddID0gYXJnXG4gICAgfVxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2VbJ3BvcHVwX3Nob3dfdHJpZ2dlciddIHx8ICdjb21tYW5kJ1xuICB9LFxuICBmb250U2l6ZTogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKGFyZyAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVsnZm9udFNpemUnXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlWydmb250U2l6ZSddIHx8IDE0KVxuICB9XG59XG4iLCJpbXBvcnQgT3B0aW9ucyBmcm9tICcuL29wdGlvbnMnXG5pbXBvcnQgeyBNT0RJRklFUl9LRVkgfSBmcm9tICcuL3V0aWxzJ1xuXG5mdW5jdGlvbiBzYXZlX29wdGlvbnMoKSB7XG4gIGZ1bmN0aW9uIGdldF9leGNlcHRfdXJscygpIHtcbiAgICBsZXQgZXhjZXB0X3VybHMgPSBbXVxuICAgIGV4Y2VwdF91cmxzID0gJCgnLmV4Y2VwdF91cmxfaW5wdXQnKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgIH0pLm1hcChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlXG4gICAgfSkuZ2V0KClcblxuICAgIHJldHVybiBleGNlcHRfdXJsc1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0X29ubHlfdXJscygpIHtcbiAgICBsZXQgb25seV91cmxzID0gW11cbiAgICBvbmx5X3VybHMgPSAkKCcub25seV91cmxfaW5wdXQnKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgIH0pLm1hcChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlXG4gICAgfSkuZ2V0KClcblxuICAgIHJldHVybiBvbmx5X3VybHNcbiAgfVxuXG4gIE9wdGlvbnMuZXhjZXB0X3VybHMoZ2V0X2V4Y2VwdF91cmxzKCkpXG4gIE9wdGlvbnMub25seV91cmxzKGdldF9vbmx5X3VybHMoKSlcblxuICBPcHRpb25zLndvcmRfa2V5X29ubHkoJCgnI3dvcmRfa2V5X29ubHk6Y2hlY2tlZCcpLnZhbCgpID8gMSA6IDApXG4gIE9wdGlvbnMuc2VsZWN0aW9uX2tleV9vbmx5KCQoJyNzZWxlY3Rpb25fa2V5X29ubHk6Y2hlY2tlZCcpLnZhbCgpID8gMSA6IDApXG4gIFxuXG4gIE9wdGlvbnMuZGVsYXkoJCgnI2RlbGF5JykudmFsKCkpXG4gIE9wdGlvbnMuZm9udFNpemUoJCgnI2ZvbnRTaXplJykudmFsKCkpXG5cbiAgT3B0aW9ucy5wb3B1cF9zaG93X3RyaWdnZXIoJCgnI3dvcmRfa2V5X29ubHlfa2V5JykudmFsKCkpXG5cbiAgJCgnI3N0YXR1cycpLmZhZGVJbigpLmRlbGF5KDMwMDApLmZhZGVPdXQoKVxufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZV9leGNlcHRfdXJscygpIHtcbiAgZnVuY3Rpb24gYWRkX2V4Y191cmwodXJsKSB7XG4gICAgbGV0IGJ1dHRvblxuICAgIGNvbnN0IGlucHV0ID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJleGNlcHRfdXJsX2lucHV0XCI+JykuYXR0cignc2l6ZScsIDEwMCkudmFsKHVybClcbiAgICBjb25zdCBybV9jYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZmFkZU91dCgnZmFzdCcsIGZ1bmN0aW9uKCkgeyQodGhpcykucmVtb3ZlKCl9KSB9XG5cbiAgICBpZiAodXJsKSB7XG4gICAgICBidXR0b24gPSAkKCc8YnV0dG9uPicsIHt0ZXh0OiAnWCd9KS5jbGljayhybV9jYWxsYmFjaylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBidXR0b24gPSAkKCc8YnV0dG9uPicsIHt0ZXh0OiAnKyd9KS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoJy5leGNlcHRfdXJsX2lucHV0JywgJCh0aGlzKS5jbG9zZXN0KCd0cicpICkudmFsKCkgPiAnJykge1xuICAgICAgICAgICQodGhpcykudGV4dCgnWCcpLm9mZignY2xpY2snKS5jbGljayhybV9jYWxsYmFjaylcbiAgICAgICAgICBhZGRfZXhjX3VybCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgICQoJzx0cj4nLCB7Y3NzOiB7ZGlzcGxheTogJ25vbmUnfX0pLmZhZGVJbigpXG4gICAgICAuYXBwZW5kKCQoJzx0ZD4nKS5hcHBlbmQoaW5wdXQpKVxuICAgICAgLmFwcGVuZCgkKCc8dGQ+JykuYXBwZW5kKGJ1dHRvbikpXG4gICAgICAuYXBwZW5kVG8oJCgnI2V4Y191cmxzX3RhYmxlJykpXG4gIH1cblxuICBjb25zdCBzYXZlZF9leGNlcHRfdXJscyA9IE9wdGlvbnMuZXhjZXB0X3VybHMoKVxuXG4gIHNhdmVkX2V4Y2VwdF91cmxzLmZvckVhY2goZnVuY3Rpb24odXJsKSB7XG4gICAgYWRkX2V4Y191cmwodXJsKVxuICB9KVxuICBhZGRfZXhjX3VybCgpXG59XG5cblxuZnVuY3Rpb24gcG9wdWxhdGVfb25seV91cmxzKCkge1xuICBmdW5jdGlvbiBhZGRfb25seV91cmwodXJsKSB7XG4gICAgbGV0IGJ1dHRvblxuICAgIGNvbnN0IGlucHV0ID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJvbmx5X3VybF9pbnB1dFwiPicpLmF0dHIoJ3NpemUnLCAxMDApLnZhbCh1cmwpXG4gICAgY29uc3Qgcm1fY2FsbGJhY2sgPSBmdW5jdGlvbigpIHsgJCh0aGlzKS5jbG9zZXN0KCd0cicpLmZhZGVPdXQoJ2Zhc3QnLCBmdW5jdGlvbigpIHskKHRoaXMpLnJlbW92ZSgpfSkgfVxuXG4gICAgaWYgKHVybCkge1xuICAgICAgYnV0dG9uID0gJCgnPGJ1dHRvbj4nLCB7dGV4dDogJ1gnfSkuY2xpY2socm1fY2FsbGJhY2spXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYnV0dG9uID0gJCgnPGJ1dHRvbj4nLCB7dGV4dDogJysnfSkuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKCcub25seV91cmxfaW5wdXQnLCAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykgKS52YWwoKSA+ICcnKSB7XG4gICAgICAgICAgJCh0aGlzKS50ZXh0KCdYJykub2ZmKCdjbGljaycpLmNsaWNrKHJtX2NhbGxiYWNrKVxuICAgICAgICAgIGFkZF9vbmx5X3VybCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgICQoJzx0cj4nLCB7Y3NzOiB7ZGlzcGxheTogJ25vbmUnfX0pLmZhZGVJbigpXG4gICAgICAuYXBwZW5kKCQoJzx0ZD4nKS5hcHBlbmQoaW5wdXQpKVxuICAgICAgLmFwcGVuZCgkKCc8dGQ+JykuYXBwZW5kKGJ1dHRvbikpXG4gICAgICAuYXBwZW5kVG8oJCgnI29ubHlfdXJsc190YWJsZScpKVxuICB9XG5cbiAgY29uc3Qgc2F2ZWRfb25seV91cmxzID0gT3B0aW9ucy5vbmx5X3VybHMoKVxuXG4gIHNhdmVkX29ubHlfdXJscy5mb3JFYWNoKGZ1bmN0aW9uKHVybCkge1xuICAgIGFkZF9vbmx5X3VybCh1cmwpXG4gIH0pXG4gIGFkZF9vbmx5X3VybCgpXG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlX3BvcHVwX3Nob3dfdHJpZ2dlcigpIHtcbiAgICBjb25zdCBzYXZlZF9wb3B1cF9zaG93X3RyaWdnZXIgPSBPcHRpb25zLnBvcHVwX3Nob3dfdHJpZ2dlcigpXG4gIFxuICAgIDtbLi4ubmV3IFNldChPYmplY3QudmFsdWVzKE1PRElGSUVSX0tFWSkpXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgJCgnI3dvcmRfa2V5X29ubHlfa2V5LCAjc2VsZWN0aW9uX2tleV9vbmx5X2tleScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcykuYXBwZW5kKCQoJzxvcHRpb24+Jywge3ZhbHVlOiBrZXl9KS50ZXh0KGtleSkucHJvcCgnc2VsZWN0ZWQnLCBzYXZlZF9wb3B1cF9zaG93X3RyaWdnZXIgPT0ga2V5KSlcbiAgICAgIH0pXG4gICAgfSlcbiAgXG4gICAgJCgnI3dvcmRfa2V5X29ubHlfa2V5LCAjc2VsZWN0aW9uX2tleV9vbmx5X2tleScpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgICQoJyN3b3JkX2tleV9vbmx5X2tleSwgI3NlbGVjdGlvbl9rZXlfb25seV9rZXknKS52YWwodGhpcy52YWx1ZSlcbiAgICB9KVxuICB9XG5cbiQoZnVuY3Rpb24oKSB7XG4gIHBvcHVsYXRlX2V4Y2VwdF91cmxzKClcbiAgcG9wdWxhdGVfb25seV91cmxzKClcbiAgcG9wdWxhdGVfcG9wdXBfc2hvd190cmlnZ2VyKClcblxuICBpZiAoT3B0aW9ucy53b3JkX2tleV9vbmx5KCkpIHtcbiAgICAkKCcjZGVsYXknKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpLnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpXG4gIH1cblxuXG4gICQoJyN3b3JkX2tleV9vbmx5JykuYXR0cignY2hlY2tlZCcsIE9wdGlvbnMud29yZF9rZXlfb25seSgpID8gdHJ1ZSA6IGZhbHNlKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBpZiAoJCgnI3RyYW5zbGF0ZV9ieScpLnZhbCgpID09ICdwb2ludCcgJiYgISQodGhpcykuYXR0cignY2hlY2tlZCcpKSB7XG4gICAgICAkKCcjZGVsYXknKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICQoJyNkZWxheScpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSkucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICB9XG4gIH0pXG5cbiAgJCgnI3NlbGVjdGlvbl9rZXlfb25seScpLmF0dHIoJ2NoZWNrZWQnLCBPcHRpb25zLnNlbGVjdGlvbl9rZXlfb25seSgpID8gdHJ1ZSA6IGZhbHNlKVxuXG4gICQoJyNkZWxheScpLnZhbChPcHRpb25zLmRlbGF5KCkpXG4gICQoJyNmb250U2l6ZScpLnZhbChPcHRpb25zLmZvbnRTaXplKCkpXG5cbiAgJCgnI3NhdmVfYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oKSB7IHNhdmVfb3B0aW9ucygpIH0pXG4gICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgIHNhdmVfb3B0aW9ucygpXG4gICAgfVxuICB9KVxuXG4gICQoJyNtb3JlX29wdGlvbnNfbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICQoJyNtb3JlX29wdGlvbnNfbGluaycpLmhpZGUoKVxuICAgICQoJyNtb3JlX29wdGlvbnMnKS5mYWRlSW4oKVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxuXG4gICQoJy5zZXRfaG90a2V5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHt1cmw6J2Nocm9tZTovL2V4dGVuc2lvbnMvY29uZmlndXJlQ29tbWFuZHMnfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn0pXG4iLCJleHBvcnQgY29uc3QgTU9ESUZJRVJfS0VZID0ge1xuICAgIDE2OiAnc2hpZnQnLCAxNzogJ2N0cmwnLCAxODogJ2FsdCcsIDkxOiAnY29tbWFuZCcsIDkzOiAnY29tbWFuZCcsIDEzOiAnUmV0dXJuJ1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vbGliL29wdGlvbnNfc2NyaXB0LmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==