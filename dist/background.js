/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./background.js":
/*!***********************!*
  !*** ./background.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/options */ "./lib/options.js");


const URL = word => `http://localhost:4000/word/find/${word}`;

const URL2 = word => `http://localhost:4000/word/fuzzy/${word}`;

const translate = (word, sendResponse) => {
  $.ajax({
    url: URL(word),
    type: 'GET',
    success: function on_success(data) {
      if (!data?.content) {
        $.ajax({
          url: URL2(word),
          type: 'GET',
          success: function on_success(data) {
            console.log('data', data);
            sendResponse({
              status: true,
              type: '관련 검색어',
              content: data
            });
          }
        });
      } else {
        sendResponse({
          status: true,
          type: '찾은 단어',
          content: data
        });
      }
    },
    error: function (xhr, status, e) {
      console.log({
        e: e,
        xhr: xhr
      });
      sendResponse({
        status: true,
        e
      });
    }
  });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const except_urls = _lib_options__WEBPACK_IMPORTED_MODULE_0__.default.except_urls();
  console.log('woooord', request.word);

  switch (request.handler) {
    case 'get_options':
      sendResponse({
        options: JSON.stringify(Object.keys(_lib_options__WEBPACK_IMPORTED_MODULE_0__.default).reduce((result, key) => {
          result[key] = _lib_options__WEBPACK_IMPORTED_MODULE_0__.default[key]();
          return result;
        }, {}))
      });
      break;

    case 'translate':
      console.log('received to translate: ' + request.word);
      translate(request.word, sendResponse);
      return true;
      break;

    default:
      console.error('Unknown handler');
      sendResponse({});
  }

  return true;
});
chrome.tabs.executeScript(null, {
  file: "jquery.min.js"
}, function () {
  chrome.tabs.executeScript(null, {
    file: "contentscript.js"
  });
  chrome.tabs.executeScript(null, {
    file: "background.js"
  });
});

/***/ }),

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
/******/ 	__webpack_require__("./background.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL29wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbIlVSTCIsIndvcmQiLCJVUkwyIiwidHJhbnNsYXRlIiwic2VuZFJlc3BvbnNlIiwiJCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwic3VjY2VzcyIsIm9uX3N1Y2Nlc3MiLCJkYXRhIiwiY29udGVudCIsImNvbnNvbGUiLCJsb2ciLCJzdGF0dXMiLCJlcnJvciIsInhociIsImUiLCJjaHJvbWUiLCJydW50aW1lIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJyZXF1ZXN0Iiwic2VuZGVyIiwiZXhjZXB0X3VybHMiLCJPcHRpb25zIiwiaGFuZGxlciIsIm9wdGlvbnMiLCJKU09OIiwic3RyaW5naWZ5IiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsInJlc3VsdCIsImtleSIsInRhYnMiLCJleGVjdXRlU2NyaXB0IiwiZmlsZSIsInVybHMiLCJBcnJheSIsImxvY2FsU3RvcmFnZSIsInBhcnNlIiwic3BsaXQiLCJvbmx5X3VybHMiLCJ3b3JkX2tleV9vbmx5IiwiYXJnIiwidW5kZWZpbmVkIiwicGFyc2VJbnQiLCJzZWxlY3Rpb25fa2V5X29ubHkiLCJ0cmFuc2xhdGVfYnkiLCJkZWxheSIsIm1zIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJwb3B1cF9zaG93X3RyaWdnZXIiLCJmb250U2l6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUEsTUFBTUEsR0FBRyxHQUFJQyxJQUFELElBQVcsbUNBQWtDQSxJQUFLLEVBQTlEOztBQUNBLE1BQU1DLElBQUksR0FBSUQsSUFBRCxJQUFXLG9DQUFtQ0EsSUFBSyxFQUFoRTs7QUFFQSxNQUFNRSxTQUFTLEdBQUksQ0FBQ0YsSUFBRCxFQUFPRyxZQUFQLEtBQXdCO0FBQ3ZDQyxHQUFDLENBQUNDLElBQUYsQ0FBTztBQUNIQyxPQUFHLEVBQUVQLEdBQUcsQ0FBQ0MsSUFBRCxDQURMO0FBRUhPLFFBQUksRUFBRSxLQUZIO0FBR0hDLFdBQU8sRUFBRSxTQUFTQyxVQUFULENBQW9CQyxJQUFwQixFQUEwQjtBQUMvQixVQUFHLENBQUNBLElBQUksRUFBRUMsT0FBVixFQUFtQjtBQUNmUCxTQUFDLENBQUNDLElBQUYsQ0FBTztBQUNIQyxhQUFHLEVBQUVMLElBQUksQ0FBQ0QsSUFBRCxDQUROO0FBRUhPLGNBQUksRUFBRSxLQUZIO0FBR0hDLGlCQUFPLEVBQUUsU0FBU0MsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDL0JFLG1CQUFPLENBQUNDLEdBQVIsQ0FBWSxNQUFaLEVBQW9CSCxJQUFwQjtBQUNBUCx3QkFBWSxDQUFFO0FBQ1ZXLG9CQUFNLEVBQUcsSUFEQztBQUVWUCxrQkFBSSxFQUFFLFFBRkk7QUFHVkkscUJBQU8sRUFBRUQ7QUFIQyxhQUFGLENBQVo7QUFLSDtBQVZFLFNBQVA7QUFZSCxPQWJELE1BYU87QUFDSFAsb0JBQVksQ0FBRTtBQUNWVyxnQkFBTSxFQUFHLElBREM7QUFFVlAsY0FBSSxFQUFDLE9BRks7QUFHVkksaUJBQU8sRUFBRUQ7QUFIQyxTQUFGLENBQVo7QUFLSDtBQUNKLEtBeEJFO0FBeUJISyxTQUFLLEVBQUUsVUFBU0MsR0FBVCxFQUFjRixNQUFkLEVB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QUF5Qk0sU0FBekIsR0FBcUMsR0FBckMsR0FBMkNDLFFBQVEsQ0FBQ1AsWUFBWSxDQUFDLE9BQUQsQ0FBYixDQUExRDtBQUNELEdBcERZO0FBcURiZSxvQkFBa0IsRUFBRSxVQUFTVixHQUFULEVBQWM7QUFDaEMsUUFBSUEsR0FBRyxJQUFJQyxTQUFYLEVBQXNCO0FBQ3BCTixrQkFBWSxDQUFDLG9CQUFELENBQVosR0FBcUNLLEdBQXJDO0FBQ0Q7O0FBQ0QsV0FBT0wsWUFBWSxDQUFDLG9CQUFELENBQVosSUFBc0MsU0FBN0M7QUFDRCxHQTFEWTtBQTJEYmdCLFVBQVEsRUFBRSxVQUFTWCxHQUFULEVBQWM7QUFDdEIsUUFBSUEsR0FBRyxJQUFJQyxTQUFYLEVBQXNCO0FBQ3BCTixrQkFBWSxDQUFDLFVBQUQsQ0FBWixHQUEyQkssR0FBM0I7QUFDRDs7QUFDRCxXQUFPRSxRQUFRLENBQUNQLFlBQVksQ0FBQyxVQUFELENBQVosSUFBNEIsRUFBN0IsQ0FBZjtBQUNEO0FBaEVZLENBQWYsRTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3B0aW9ucyBmcm9tICcuL2xpYi9vcHRpb25zJ1xuXG5jb25zdCBVUkwgPSAod29yZCkgPT4gYGh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC93b3JkL2ZpbmQvJHt3b3JkfWBcbmNvbnN0IFVSTDIgPSAod29yZCkgPT4gYGh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC93b3JkL2Z1enp5LyR7d29yZH1gXG5cbmNvbnN0IHRyYW5zbGF0ZSA9ICAod29yZCwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBVUkwod29yZCksXG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBvbl9zdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICAgIGlmKCFkYXRhPy5jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBVUkwyKHdvcmQpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gb25fc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0YScsIGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UgKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICfqtIDroKgg6rKA7IOJ7Ja0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlICh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6J+ywvuydgCDri6jslrQnLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBkYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh7ZTogZSwgeGhyOiB4aHJ9KVxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXMgOiB0cnVlLFxuICAgICAgICAgICAgICAgIGUsXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pXG59XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgIGNvbnN0IGV4Y2VwdF91cmxzID0gT3B0aW9ucy5leGNlcHRfdXJscygpXG4gICAgY29uc29sZS5sb2coJ3dvb29vcmQnLCByZXF1ZXN0LndvcmQpXG4gICAgc3dpdGNoIChyZXF1ZXN0LmhhbmRsZXIpIHtcbiAgICBjYXNlICdnZXRfb3B0aW9ucyc6XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgIG9wdGlvbnM6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoT3B0aW9ucykucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBPcHRpb25zW2tleV0oKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgfSwge30pXG4gICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICBjYXNlICd0cmFuc2xhdGUnOlxuICAgICAgICBjb25zb2xlLmxvZygncmVjZWl2ZWQgdG8gdHJhbnNsYXRlOiAnICsgcmVxdWVzdC53b3JkKVxuICAgICAgICB0cmFuc2xhdGUocmVxdWVzdC53b3JkLCBzZW5kUmVzcG9uc2UpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5lcnJvcignVW5rbm93biBoYW5kbGVyJylcbiAgICAgICAgc2VuZFJlc3BvbnNlKHt9KVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxufSlcblxuXG5jaHJvbWUudGFicy5leGVjdXRlU2NyaXB0KG51bGwsIHsgZmlsZTogXCJqcXVlcnkubWluLmpzXCIgfSwgZnVuY3Rpb24oKSB7XG4gICAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdChudWxsLCB7IGZpbGU6IFwiY29udGVudHNjcmlwdC5qc1wiIH0pO1xuICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQobnVsbCwgeyBmaWxlOiBcImJhY2tncm91bmQuanNcIiB9KTtcbn0pO1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuZXhjZXB0X3VybHM6IGZ1bmN0aW9uKHVybHMpIHtcbiAgICBpZiAodXJscyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBsb2NhbFN0b3JhZ2UuZXhjZXB0X3VybHMgPSBKU09OLnN0cmluZ2lmeSh1cmxzKVxuICAgIH1cbiAgICBpZiAobG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZXhjZXB0X3VybHMpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYml0bGl0eVxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzLnNwbGl0KCcsJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdXG4gIH0sXG4gIG9ubHlfdXJsczogZnVuY3Rpb24odXJscykge1xuICAgIGlmICh1cmxzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5vbmx5X3VybHMgPSBKU09OLnN0cmluZ2lmeSh1cmxzKVxuICAgIH1cbiAgICBpZiAobG9jYWxTdG9yYWdlLm9ubHlfdXJscykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLm9ubHlfdXJscylcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaXRsaXR5XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uub25seV91cmxzLnNwbGl0KCcsJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdXG4gIH0sXG4gIHdvcmRfa2V5X29ubHk6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ3dvcmRfa2V5X29ubHknXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQoIGxvY2FsU3RvcmFnZVsnd29yZF9rZXlfb25seSddIClcbiAgfSxcbiAgc2VsZWN0aW9uX2tleV9vbmx5OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnICE9IHVuZGVmaW5lZCkge1xuICAgICAgbG9jYWxTdG9yYWdlWydzZWxlY3Rpb25fa2V5X29ubHknXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQoIGxvY2FsU3RvcmFnZVsnc2VsZWN0aW9uX2tleV9vbmx5J10gKVxuICB9LFxuICB0cmFuc2xhdGVfYnk6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgPT0gJ2NsaWNrJyB8fCBhcmcgPT0gJ3BvaW50Jykge1xuICAgICAgbG9jYWxTdG9yYWdlLnRyYW5zbGF0ZV9ieSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnRyYW5zbGF0ZV9ieSB8fCAnY2xpY2snXG4gIH0sXG4gIGRlbGF5OiBmdW5jdGlvbihtcykge1xuICAgIGlmIChtcyAhPSB1bmRlZmluZWQgJiYgIWlzTmFOKHBhcnNlRmxvYXQobXMpKSAmJiBpc0Zpbml0ZShtcykpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVsnZGVsYXknXSA9IG1zXG4gICAgfVxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2VbJ2RlbGF5J10gPT0gdW5kZWZpbmVkID8gNzAwIDogcGFyc2VJbnQobG9jYWxTdG9yYWdlWydkZWxheSddKVxuICB9LFxuICBwb3B1cF9zaG93X3RyaWdnZXI6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ3BvcHVwX3Nob3dfdHJpZ2dlciddID0gYXJnXG4gICAgfVxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2VbJ3BvcHVwX3Nob3dfdHJpZ2dlciddIHx8ICdjb21tYW5kJ1xuICB9LFxuICBmb250U2l6ZTogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKGFyZyAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVsnZm9udFNpemUnXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlWydmb250U2l6ZSddIHx8IDE0KVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL2JhY2tncm91bmQuanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9