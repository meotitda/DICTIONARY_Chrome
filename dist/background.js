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
  console.log('word', word);
  $.ajax({
    url: URL(word),
    type: 'GET',
    success: function on_success(data) {
      if (!data?.content) {
        $.ajax({
          url: URL2(word),
          type: 'GET',
          success: function on_success(data) {
            if (!data.length) sendResponse({
              type: 'nothing'
            });
            sendResponse({
              status: true,
              type: 'recommand',
              recommands: data
            });
          }
        });
      } else {
        sendResponse({
          status: true,
          type: 'find',
          word: data
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

chrome.runtime.onInstalled.addListener(function () {
  const options = Object.keys(_lib_options__WEBPACK_IMPORTED_MODULE_0__.default).reduce((result, key) => {
    result[key] = _lib_options__WEBPACK_IMPORTED_MODULE_0__.default[key]();
    return result;
  }, {});
  chrome.storage.sync.set({
    options
  }, function () {
    console.log(`setting: ${options}`);
  });
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
      translate(request.word, sendResponse);
      return true;

    default:
      sendResponse({});
  }

  return true;
});
chrome.commands.onCommand.addListener(function (command, tabs) {
  console.log('command', command);
  console.log('tabs', tabs); // chrome.pageAction.show({},()=>{})
});
chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({})],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL29wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbIlVSTCIsIndvcmQiLCJVUkwyIiwidHJhbnNsYXRlIiwic2VuZFJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsIiQiLCJhamF4IiwidXJsIiwidHlwZSIsInN1Y2Nlc3MiLCJvbl9zdWNjZXNzIiwiZGF0YSIsImNvbnRlbnQiLCJsZW5ndGgiLCJzdGF0dXMiLCJyZWNvbW1hbmRzIiwiZXJyb3IiLCJ4aHIiLCJlIiwiY2hyb21lIiwicnVudGltZSIsIm9uSW5zdGFsbGVkIiwiYWRkTGlzdGVuZXIiLCJvcHRpb25zIiwiT2JqZWN0Iiwia2V5cyIsIk9wdGlvbnMiLCJyZWR1Y2UiLCJyZXN1bHQiLCJrZXkiLCJzdG9yYWdlIiwic3luYyIsInNldCIsIm9uTWVzc2FnZSIsInJlcXVlc3QiLCJzZW5kZXIiLCJoYW5kbGVyIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbW1hbmRzIiwib25Db21tYW5kIiwiY29tbWFuZCIsInRhYnMiLCJkZWNsYXJhdGl2ZUNvbnRlbnQiLCJvblBhZ2VDaGFuZ2VkIiwicmVtb3ZlUnVsZXMiLCJ1bmRlZmluZWQiLCJhZGRSdWxlcyIsImNvbmRpdGlvbnMiLCJQYWdlU3RhdGVNYXRjaGVyIiwiYWN0aW9ucyIsIlNob3dQYWdlQWN0aW9uIiwiZXhjZXB0X3VybHMiLCJ1cmxzIiwiQXJyYXkiLCJsb2NhbFN0b3JhZ2UiLCJwYXJzZSIsInNwbGl0Iiwib25seV91cmxzIiwid29yZF9rZXlfb25seSIsImFyZyIsInBhcnNlSW50Iiwic2VsZWN0aW9uX2tleV9vbmx5IiwidHJhbnNsYXRlX2J5IiwiZGVsYXkiLCJtcyIsImlzTmFOIiwicGFyc2VGbG9hdCIsImlzRmluaXRlIiwicG9wdXBfc2hvd190cmlnZ2VyIiwiZm9udFNpemUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBLE1BQU1BLEdBQUcsR0FBSUMsSUFBRCxJQUFXLG1DQUFrQ0EsSUFBSyxFQUE5RDs7QUFDQSxNQUFNQyxJQUFJLEdBQUlELElBQUQsSUFBVyxvQ0FBbUNBLElBQUssRUFBaEU7O0FBRUEsTUFBTUUsU0FBUyxHQUFJLENBQUNGLElBQUQsRUFBT0csWUFBUCxLQUF3QjtBQUN2Q0MsU0FBTyxDQUFDQyxHQUFSLENBQVksTUFBWixFQUFvQkwsSUFBcEI7QUFDQU0sR0FBQyxDQUFDQyxJQUFGLENBQU87QUFDSEMsT0FBRyxFQUFFVCxHQUFHLENBQUNDLElBQUQsQ0FETDtBQUVIUyxRQUFJLEVBQUUsS0FGSDtBQUdIQyxXQUFPLEVBQUUsU0FBU0MsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDL0IsVUFBRyxDQUFDQSxJQUFJLEVBQUVDLE9BQVYsRUFBbUI7QUFDZlAsU0FBQyxDQUFDQyxJQUFGLENBQU87QUFDSEMsYUFBRyxFQUFFUCxJQUFJLENBQUNELElBQUQsQ0FETjtBQUVIUyxjQUFJLEVBQUUsS0FGSDtBQUdIQyxpQkFBTyxFQUFFLFNBQVNDLFVBQVQsQ0FBb0JDLElBQXBCLEVBQTBCO0FBQy9CLGdCQUFHLENBQUNBLElBQUksQ0FBQ0UsTUFBVCxFQUFpQlgsWUFBWSxDQUFDO0FBQUNNLGtCQUFJLEVBQUU7QUFBUCxhQUFELENBQVo7QUFD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QUNwQlMsa0JBQVksQ0FBQyxvQkFBRCxDQUFaLEdBQXFDSyxHQUFyQztBQUNEOztBQUNELFdBQU9MLFlBQVksQ0FBQyxvQkFBRCxDQUFaLElBQXNDLFNBQTdDO0FBQ0QsR0ExRFk7QUEyRGJlLFVBQVEsRUFBRSxVQUFTVixHQUFULEVBQWM7QUFDdEIsUUFBSUEsR0FBRyxJQUFJZCxTQUFYLEVBQXNCO0FBQ3BCUyxrQkFBWSxDQUFDLFVBQUQsQ0FBWixHQUEyQkssR0FBM0I7QUFDRDs7QUFDRCxXQUFPQyxRQUFRLENBQUNOLFlBQVksQ0FBQyxVQUFELENBQVosSUFBNEIsRUFBN0IsQ0FBZjtBQUNEO0FBaEVZLENBQWYsRTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3B0aW9ucyBmcm9tICcuL2xpYi9vcHRpb25zJ1xuXG5jb25zdCBVUkwgPSAod29yZCkgPT4gYGh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC93b3JkL2ZpbmQvJHt3b3JkfWBcbmNvbnN0IFVSTDIgPSAod29yZCkgPT4gYGh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC93b3JkL2Z1enp5LyR7d29yZH1gXG5cbmNvbnN0IHRyYW5zbGF0ZSA9ICAod29yZCwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3dvcmQnLCB3b3JkKVxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogVVJMKHdvcmQpLFxuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gb25fc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICBpZighZGF0YT8uY29udGVudCkge1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogVVJMMih3b3JkKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIG9uX3N1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWRhdGEubGVuZ3RoKSBzZW5kUmVzcG9uc2Uoe3R5cGU6ICdub3RoaW5nJ30pXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UgKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdyZWNvbW1hbmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWFuZHM6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UgKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTonZmluZCcsXG4gICAgICAgICAgICAgICAgICAgIHdvcmQ6IGRhdGFcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHtlOiBlLCB4aHI6IHhocn0pXG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIHN0YXR1cyA6IHRydWUsXG4gICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSlcbn1cblxuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbigpIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmtleXMoT3B0aW9ucykucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuICAgICAgICByZXN1bHRba2V5XSA9IE9wdGlvbnNba2V5XSgpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSwge30pXG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe29wdGlvbnN9LCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBzZXR0aW5nOiAke29wdGlvbnN9YCk7XG4gICAgfSk7XG59KTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgc3dpdGNoIChyZXF1ZXN0LmhhbmRsZXIpIHtcbiAgICBjYXNlICdnZXRfb3B0aW9ucyc6XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgIG9wdGlvbnM6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoT3B0aW9ucykucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBPcHRpb25zW2tleV0oKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgfSwge30pXG4gICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICBjYXNlICd0cmFuc2xhdGUnOlxuICAgICAgICB0cmFuc2xhdGUocmVxdWVzdC53b3JkLCBzZW5kUmVzcG9uc2UpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgICAgc2VuZFJlc3BvbnNlKHt9KVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxufSlcblxuY2hyb21lLmNvbW1hbmRzLm9uQ29tbWFuZC5hZGRMaXN0ZW5lcihmdW5jdGlvbihjb21tYW5kLCB0YWJzKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbW1hbmQnLCBjb21tYW5kKVxuICAgIGNvbnNvbGUubG9nKCd0YWJzJywgdGFicylcbiAgICAvLyBjaHJvbWUucGFnZUFjdGlvbi5zaG93KHt9LCgpPT57fSlcbn0pO1xuXG5cbmNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQub25QYWdlQ2hhbmdlZC5yZW1vdmVSdWxlcyh1bmRlZmluZWQsIGZ1bmN0aW9uKCkge1xuY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLmFkZFJ1bGVzKFt7XG4gICAgY29uZGl0aW9uczogW25ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlBhZ2VTdGF0ZU1hdGNoZXIoe1xuICAgIH0pXG4gICAgXSxcbiAgICAgICAgYWN0aW9uczogW25ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlNob3dQYWdlQWN0aW9uKCldXG59XSk7XG59KTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbmV4Y2VwdF91cmxzOiBmdW5jdGlvbih1cmxzKSB7XG4gICAgaWYgKHVybHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgbG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzID0gSlNPTi5zdHJpbmdpZnkodXJscylcbiAgICB9XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5leGNlcHRfdXJscykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpdGxpdHlcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5leGNlcHRfdXJscy5zcGxpdCgnLCcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9LFxuICBvbmx5X3VybHM6IGZ1bmN0aW9uKHVybHMpIHtcbiAgICBpZiAodXJscyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uub25seV91cmxzID0gSlNPTi5zdHJpbmdpZnkodXJscylcbiAgICB9XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5vbmx5X3VybHMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5vbmx5X3VybHMpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYml0bGl0eVxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLm9ubHlfdXJscy5zcGxpdCgnLCcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9LFxuICB3b3JkX2tleV9vbmx5OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnICE9IHVuZGVmaW5lZCkge1xuICAgICAgbG9jYWxTdG9yYWdlWyd3b3JkX2tleV9vbmx5J10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KCBsb2NhbFN0b3JhZ2VbJ3dvcmRfa2V5X29ubHknXSApXG4gIH0sXG4gIHNlbGVjdGlvbl9rZXlfb25seTogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKGFyZyAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVsnc2VsZWN0aW9uX2tleV9vbmx5J10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KCBsb2NhbFN0b3JhZ2VbJ3NlbGVjdGlvbl9rZXlfb25seSddIClcbiAgfSxcbiAgdHJhbnNsYXRlX2J5OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnID09ICdjbGljaycgfHwgYXJnID09ICdwb2ludCcpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS50cmFuc2xhdGVfYnkgPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS50cmFuc2xhdGVfYnkgfHwgJ2NsaWNrJ1xuICB9LFxuICBkZWxheTogZnVuY3Rpb24obXMpIHtcbiAgICBpZiAobXMgIT0gdW5kZWZpbmVkICYmICFpc05hTihwYXJzZUZsb2F0KG1zKSkgJiYgaXNGaW5pdGUobXMpKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ2RlbGF5J10gPSBtc1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlWydkZWxheSddID09IHVuZGVmaW5lZCA/IDcwMCA6IHBhcnNlSW50KGxvY2FsU3RvcmFnZVsnZGVsYXknXSlcbiAgfSxcbiAgcG9wdXBfc2hvd190cmlnZ2VyOiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnICE9IHVuZGVmaW5lZCkge1xuICAgICAgbG9jYWxTdG9yYWdlWydwb3B1cF9zaG93X3RyaWdnZXInXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlWydwb3B1cF9zaG93X3RyaWdnZXInXSB8fCAnY29tbWFuZCdcbiAgfSxcbiAgZm9udFNpemU6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ2ZvbnRTaXplJ10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KGxvY2FsU3RvcmFnZVsnZm9udFNpemUnXSB8fCAxNClcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9iYWNrZ3JvdW5kLmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==