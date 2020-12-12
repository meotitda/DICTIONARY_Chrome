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
      console.log('data', data);

      if (!data?.content) {
        $.ajax({
          url: URL2(word),
          type: 'GET',
          success: function on_success(data) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL29wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbIlVSTCIsIndvcmQiLCJVUkwyIiwidHJhbnNsYXRlIiwic2VuZFJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsIiQiLCJhamF4IiwidXJsIiwidHlwZSIsInN1Y2Nlc3MiLCJvbl9zdWNjZXNzIiwiZGF0YSIsImNvbnRlbnQiLCJzdGF0dXMiLCJlcnJvciIsInhociIsImUiLCJjaHJvbWUiLCJydW50aW1lIiwib25JbnN0YWxsZWQiLCJhZGRMaXN0ZW5lciIsIm9wdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwiT3B0aW9ucyIsInJlZHVjZSIsInJlc3VsdCIsImtleSIsInN0b3JhZ2UiLCJzeW5jIiwic2V0Iiwib25NZXNzYWdlIiwicmVxdWVzdCIsInNlbmRlciIsImhhbmRsZXIiLCJKU09OIiwic3RyaW5naWZ5IiwiY29tbWFuZHMiLCJvbkNvbW1hbmQiLCJjb21tYW5kIiwidGFicyIsImRlY2xhcmF0aXZlQ29udGVudCIsIm9uUGFnZUNoYW5nZWQiLCJyZW1vdmVSdWxlcyIsInVuZGVmaW5lZCIsImFkZFJ1bGVzIiwiY29uZGl0aW9ucyIsIlBhZ2VTdGF0ZU1hdGNoZXIiLCJhY3Rpb25zIiwiU2hvd1BhZ2VBY3Rpb24iLCJleGNlcHRfdXJscyIsInVybHMiLCJBcnJheSIsImxvY2FsU3RvcmFnZSIsInBhcnNlIiwic3BsaXQiLCJvbmx5X3VybHMiLCJ3b3JkX2tleV9vbmx5IiwiYXJnIiwicGFyc2VJbnQiLCJzZWxlY3Rpb25fa2V5X29ubHkiLCJ0cmFuc2xhdGVfYnkiLCJkZWxheSIsIm1zIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJwb3B1cF9zaG93X3RyaWdnZXIiLCJmb250U2l6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUEsTUFBTUEsR0FBRyxHQUFJQyxJQUFELElBQVcsbUNBQWtDQSxJQUFLLEVBQTlEOztBQUNBLE1BQU1DLElBQUksR0FBSUQsSUFBRCxJQUFXLG9DQUFtQ0EsSUFBSyxFQUFoRTs7QUFFQSxNQUFNRSxTQUFTLEdBQUksQ0FBQ0YsSUFBRCxFQUFPRyxZQUFQLEtBQXdCO0FBQ3ZDQyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxNQUFaLEVBQW9CTCxJQUFwQjtBQUNBTSxHQUFDLENBQUNDLElBQUYsQ0FBTztBQUNIQyxPQUFHLEVBQUVULEdBQUcsQ0FBQ0MsSUFBRCxDQURMO0FBRUhTLFFBQUksRUFBRSxLQUZIO0FBR0hDLFdBQU8sRUFBRSxTQUFTQyxVQUFULENBQW9CQyxJQUFwQixFQUEwQjtBQUMvQlIsYUFBTyxDQUFDQyxHQUFSLENBQVksTUFBWixFQUFvQk8sSUFBcEI7O0FBQ0EsVUFBRyxDQUFDQSxJQUFJLEVBQUVDLE9BQVYsRUFBbUI7QUFDZlAsU0FBQyxDQUFDQyxJQUFGLENBQU87QUFDSEMsYUFBRyxFQUFFUCxJQUFJLENBQUNELElBQUQsQ0FETjtBQUVIUyxjQUFJLEVBQUUsS0FGSDtBQUdIQyxpQkFBTyxFQUFFLFNBQVNDLFVBQVQsQ0FBb0JDLElBQXBCLEVBQTBCO0FBQy9CVCx3QkFBWSxDQUFFO0FBQ1ZXLG9CQUFNLEVBQUcsSUFEQztBQUVWTCxrQkFBSSxFQUFFLFFBRkk7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QUFZLENBQUMsb0JBQUQsQ0FBWixJQUFzQyxTQUE3QztBQUNELEdBMURZO0FBMkRiZSxVQUFRLEVBQUUsVUFBU1YsR0FBVCxFQUFjO0FBQ3RCLFFBQUlBLEdBQUcsSUFBSWQsU0FBWCxFQUFzQjtBQUNwQlMsa0JBQVksQ0FBQyxVQUFELENBQVosR0FBMkJLLEdBQTNCO0FBQ0Q7O0FBQ0QsV0FBT0MsUUFBUSxDQUFDTixZQUFZLENBQUMsVUFBRCxDQUFaLElBQTRCLEVBQTdCLENBQWY7QUFDRDtBQWhFWSxDQUFmLEU7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9saWIvb3B0aW9ucydcblxuY29uc3QgVVJMID0gKHdvcmQpID0+IGBodHRwOi8vbG9jYWxob3N0OjQwMDAvd29yZC9maW5kLyR7d29yZH1gXG5jb25zdCBVUkwyID0gKHdvcmQpID0+IGBodHRwOi8vbG9jYWxob3N0OjQwMDAvd29yZC9mdXp6eS8ke3dvcmR9YFxuXG5jb25zdCB0cmFuc2xhdGUgPSAgKHdvcmQsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCd3b3JkJywgd29yZClcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFVSTCh3b3JkKSxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIG9uX3N1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxuICAgICAgICAgICAgaWYoIWRhdGE/LmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFVSTDIod29yZCksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBvbl9zdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cyA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ+q0gOugqCDqsoDsg4nslrQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UgKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTon7LC+7J2AIOuLqOyWtCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGRhdGFcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHtlOiBlLCB4aHI6IHhocn0pXG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIHN0YXR1cyA6IHRydWUsXG4gICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSlcbn1cblxuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbigpIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmtleXMoT3B0aW9ucykucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuICAgICAgICByZXN1bHRba2V5XSA9IE9wdGlvbnNba2V5XSgpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSwge30pXG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe29wdGlvbnN9LCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBzZXR0aW5nOiAke29wdGlvbnN9YCk7XG4gICAgfSk7XG59KTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgc3dpdGNoIChyZXF1ZXN0LmhhbmRsZXIpIHtcbiAgICBjYXNlICdnZXRfb3B0aW9ucyc6XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgIG9wdGlvbnM6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoT3B0aW9ucykucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBPcHRpb25zW2tleV0oKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgfSwge30pXG4gICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICBjYXNlICd0cmFuc2xhdGUnOlxuICAgICAgICB0cmFuc2xhdGUocmVxdWVzdC53b3JkLCBzZW5kUmVzcG9uc2UpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgICAgc2VuZFJlc3BvbnNlKHt9KVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxufSlcblxuY2hyb21lLmNvbW1hbmRzLm9uQ29tbWFuZC5hZGRMaXN0ZW5lcihmdW5jdGlvbihjb21tYW5kLCB0YWJzKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbW1hbmQnLCBjb21tYW5kKVxuICAgIGNvbnNvbGUubG9nKCd0YWJzJywgdGFicylcbiAgICAvLyBjaHJvbWUucGFnZUFjdGlvbi5zaG93KHt9LCgpPT57fSlcbn0pO1xuXG5cbmNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQub25QYWdlQ2hhbmdlZC5yZW1vdmVSdWxlcyh1bmRlZmluZWQsIGZ1bmN0aW9uKCkge1xuY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLmFkZFJ1bGVzKFt7XG4gICAgY29uZGl0aW9uczogW25ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlBhZ2VTdGF0ZU1hdGNoZXIoe1xuICAgIH0pXG4gICAgXSxcbiAgICAgICAgYWN0aW9uczogW25ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlNob3dQYWdlQWN0aW9uKCldXG59XSk7XG59KTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbmV4Y2VwdF91cmxzOiBmdW5jdGlvbih1cmxzKSB7XG4gICAgaWYgKHVybHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgbG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzID0gSlNPTi5zdHJpbmdpZnkodXJscylcbiAgICB9XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5leGNlcHRfdXJscykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpdGxpdHlcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5leGNlcHRfdXJscy5zcGxpdCgnLCcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9LFxuICBvbmx5X3VybHM6IGZ1bmN0aW9uKHVybHMpIHtcbiAgICBpZiAodXJscyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uub25seV91cmxzID0gSlNPTi5zdHJpbmdpZnkodXJscylcbiAgICB9XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5vbmx5X3VybHMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5vbmx5X3VybHMpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYml0bGl0eVxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLm9ubHlfdXJscy5zcGxpdCgnLCcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9LFxuICB3b3JkX2tleV9vbmx5OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnICE9IHVuZGVmaW5lZCkge1xuICAgICAgbG9jYWxTdG9yYWdlWyd3b3JkX2tleV9vbmx5J10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KCBsb2NhbFN0b3JhZ2VbJ3dvcmRfa2V5X29ubHknXSApXG4gIH0sXG4gIHNlbGVjdGlvbl9rZXlfb25seTogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKGFyZyAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVsnc2VsZWN0aW9uX2tleV9vbmx5J10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KCBsb2NhbFN0b3JhZ2VbJ3NlbGVjdGlvbl9rZXlfb25seSddIClcbiAgfSxcbiAgdHJhbnNsYXRlX2J5OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnID09ICdjbGljaycgfHwgYXJnID09ICdwb2ludCcpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS50cmFuc2xhdGVfYnkgPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS50cmFuc2xhdGVfYnkgfHwgJ2NsaWNrJ1xuICB9LFxuICBkZWxheTogZnVuY3Rpb24obXMpIHtcbiAgICBpZiAobXMgIT0gdW5kZWZpbmVkICYmICFpc05hTihwYXJzZUZsb2F0KG1zKSkgJiYgaXNGaW5pdGUobXMpKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ2RlbGF5J10gPSBtc1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlWydkZWxheSddID09IHVuZGVmaW5lZCA/IDcwMCA6IHBhcnNlSW50KGxvY2FsU3RvcmFnZVsnZGVsYXknXSlcbiAgfSxcbiAgcG9wdXBfc2hvd190cmlnZ2VyOiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnICE9IHVuZGVmaW5lZCkge1xuICAgICAgbG9jYWxTdG9yYWdlWydwb3B1cF9zaG93X3RyaWdnZXInXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlWydwb3B1cF9zaG93X3RyaWdnZXInXSB8fCAnY29tbWFuZCdcbiAgfSxcbiAgZm9udFNpemU6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ2ZvbnRTaXplJ10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KGxvY2FsU3RvcmFnZVsnZm9udFNpemUnXSB8fCAxNClcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9iYWNrZ3JvdW5kLmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==