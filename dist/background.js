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
      translate(request.word, sendResponse);
      return true;

    default:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL29wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaGVsbG9fZXh0ZW5zaW9ucy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2hlbGxvX2V4dGVuc2lvbnMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbIlVSTCIsIndvcmQiLCJVUkwyIiwidHJhbnNsYXRlIiwic2VuZFJlc3BvbnNlIiwiJCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwic3VjY2VzcyIsIm9uX3N1Y2Nlc3MiLCJkYXRhIiwiY29udGVudCIsImNvbnNvbGUiLCJsb2ciLCJzdGF0dXMiLCJlcnJvciIsInhociIsImUiLCJjaHJvbWUiLCJydW50aW1lIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJyZXF1ZXN0Iiwic2VuZGVyIiwiZXhjZXB0X3VybHMiLCJPcHRpb25zIiwiaGFuZGxlciIsIm9wdGlvbnMiLCJKU09OIiwic3RyaW5naWZ5IiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsInJlc3VsdCIsImtleSIsInRhYnMiLCJleGVjdXRlU2NyaXB0IiwiZmlsZSIsInVybHMiLCJBcnJheSIsImxvY2FsU3RvcmFnZSIsInBhcnNlIiwic3BsaXQiLCJvbmx5X3VybHMiLCJ3b3JkX2tleV9vbmx5IiwiYXJnIiwidW5kZWZpbmVkIiwicGFyc2VJbnQiLCJzZWxlY3Rpb25fa2V5X29ubHkiLCJ0cmFuc2xhdGVfYnkiLCJkZWxheSIsIm1zIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJwb3B1cF9zaG93X3RyaWdnZXIiLCJmb250U2l6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUEsTUFBTUEsR0FBRyxHQUFJQyxJQUFELElBQVcsbUNBQWtDQSxJQUFLLEVBQTlEOztBQUNBLE1BQU1DLElBQUksR0FBSUQsSUFBRCxJQUFXLG9DQUFtQ0EsSUFBSyxFQUFoRTs7QUFFQSxNQUFNRSxTQUFTLEdBQUksQ0FBQ0YsSUFBRCxFQUFPRyxZQUFQLEtBQXdCO0FBQ3ZDQyxHQUFDLENBQUNDLElBQUYsQ0FBTztBQUNIQyxPQUFHLEVBQUVQLEdBQUcsQ0FBQ0MsSUFBRCxDQURMO0FBRUhPLFFBQUksRUFBRSxLQUZIO0FBR0hDLFdBQU8sRUFBRSxTQUFTQyxVQUFULENBQW9CQyxJQUFwQixFQUEwQjtBQUMvQixVQUFHLENBQUNBLElBQUksRUFBRUMsT0FBVixFQUFtQjtBQUNmUCxTQUFDLENBQUNDLElBQUYsQ0FBTztBQUNIQyxhQUFHLEVBQUVMLElBQUksQ0FBQ0QsSUFBRCxDQUROO0FBRUhPLGNBQUksRUFBRSxLQUZIO0FBR0hDLGlCQUFPLEVBQUUsU0FBU0MsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDL0JFLG1CQUFPLENBQUNDLEdBQVIsQ0FBWSxNQUFaLEVBQW9CSCxJQUFwQjtBQUNBUCx3QkFBWSxDQUFFO0FBQ1ZXLG9CQUFNLEVBQUcsSUFEQztBQUVWUCxrQkFBSSxFQUFFLFFBRkk7QUFHVkkscUJBQU8sRUFBRUQ7QUFIQyxhQUFGLENBQVo7QUFLSDtBQVZFLFNBQVA7QUFZSCxPQWJELE1BYU87QUFDSFAsb0JBQVksQ0FBRTtBQUNWVyxnQkFBTSxFQUFHLElBREM7QUFFVlAsY0FBSSxFQUFDLE9BRks7QUFHVkksaUJBQU8sRUFBRUQ7QUFIQyxTQUFGLENBQVo7QUFLSDtBQUNKLEtBeEJFO0FBeUJISyxTQUFLLEVBQUUsVUFBU0MsR0FBVCxFQUFjRixNQUFkLEVB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LEVBQUUsVUFBU1YsR0FBVCxFQUFjO0FBQ2hDLFFBQUlBLEdBQUcsSUFBSUMsU0FBWCxFQUFzQjtBQUNwQk4sa0JBQVksQ0FBQyxvQkFBRCxDQUFaLEdBQXFDSyxHQUFyQztBQUNEOztBQUNELFdBQU9MLFlBQVksQ0FBQyxvQkFBRCxDQUFaLElBQXNDLFNBQTdDO0FBQ0QsR0ExRFk7QUEyRGJnQixVQUFRLEVBQUUsVUFBU1gsR0FBVCxFQUFjO0FBQ3RCLFFBQUlBLEdBQUcsSUFBSUMsU0FBWCxFQUFzQjtBQUNwQk4sa0JBQVksQ0FBQyxVQUFELENBQVosR0FBMkJLLEdBQTNCO0FBQ0Q7O0FBQ0QsV0FBT0UsUUFBUSxDQUFDUCxZQUFZLENBQUMsVUFBRCxDQUFaLElBQTRCLEVBQTdCLENBQWY7QUFDRDtBQWhFWSxDQUFmLEU7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9saWIvb3B0aW9ucydcblxuY29uc3QgVVJMID0gKHdvcmQpID0+IGBodHRwOi8vbG9jYWxob3N0OjQwMDAvd29yZC9maW5kLyR7d29yZH1gXG5jb25zdCBVUkwyID0gKHdvcmQpID0+IGBodHRwOi8vbG9jYWxob3N0OjQwMDAvd29yZC9mdXp6eS8ke3dvcmR9YFxuXG5jb25zdCB0cmFuc2xhdGUgPSAgKHdvcmQsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogVVJMKHdvcmQpLFxuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gb25fc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICBpZighZGF0YT8uY29udGVudCkge1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogVVJMMih3b3JkKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIG9uX3N1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAn6rSA66CoIOqygOyDieyWtCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSAoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOifssL7snYAg64uo7Ja0JyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogZGF0YVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coe2U6IGUsIHhocjogeGhyfSlcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgc3RhdHVzIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9KVxufVxuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICBjb25zdCBleGNlcHRfdXJscyA9IE9wdGlvbnMuZXhjZXB0X3VybHMoKVxuICAgIGNvbnNvbGUubG9nKCd3b29vb3JkJywgcmVxdWVzdC53b3JkKVxuICAgIHN3aXRjaCAocmVxdWVzdC5oYW5kbGVyKSB7XG4gICAgY2FzZSAnZ2V0X29wdGlvbnMnOlxuICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICBvcHRpb25zOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKE9wdGlvbnMpLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gT3B0aW9uc1trZXldKClcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgY2FzZSAndHJhbnNsYXRlJzpcbiAgICAgICAgdHJhbnNsYXRlKHJlcXVlc3Qud29yZCwgc2VuZFJlc3BvbnNlKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICAgIHNlbmRSZXNwb25zZSh7fSlcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbn0pXG5cblxuY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdChudWxsLCB7IGZpbGU6IFwianF1ZXJ5Lm1pbi5qc1wiIH0sIGZ1bmN0aW9uKCkge1xuICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQobnVsbCwgeyBmaWxlOiBcImNvbnRlbnRzY3JpcHQuanNcIiB9KTtcbiAgICBjaHJvbWUudGFicy5leGVjdXRlU2NyaXB0KG51bGwsIHsgZmlsZTogXCJiYWNrZ3JvdW5kLmpzXCIgfSk7XG59KTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbmV4Y2VwdF91cmxzOiBmdW5jdGlvbih1cmxzKSB7XG4gICAgaWYgKHVybHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgbG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzID0gSlNPTi5zdHJpbmdpZnkodXJscylcbiAgICB9XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5leGNlcHRfdXJscykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmV4Y2VwdF91cmxzKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpdGxpdHlcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5leGNlcHRfdXJscy5zcGxpdCgnLCcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9LFxuICBvbmx5X3VybHM6IGZ1bmN0aW9uKHVybHMpIHtcbiAgICBpZiAodXJscyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uub25seV91cmxzID0gSlNPTi5zdHJpbmdpZnkodXJscylcbiAgICB9XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5vbmx5X3VybHMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5vbmx5X3VybHMpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYml0bGl0eVxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLm9ubHlfdXJscy5zcGxpdCgnLCcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9LFxuICB3b3JkX2tleV9vbmx5OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnICE9IHVuZGVmaW5lZCkge1xuICAgICAgbG9jYWxTdG9yYWdlWyd3b3JkX2tleV9vbmx5J10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KCBsb2NhbFN0b3JhZ2VbJ3dvcmRfa2V5X29ubHknXSApXG4gIH0sXG4gIHNlbGVjdGlvbl9rZXlfb25seTogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKGFyZyAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVsnc2VsZWN0aW9uX2tleV9vbmx5J10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KCBsb2NhbFN0b3JhZ2VbJ3NlbGVjdGlvbl9rZXlfb25seSddIClcbiAgfSxcbiAgdHJhbnNsYXRlX2J5OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnID09ICdjbGljaycgfHwgYXJnID09ICdwb2ludCcpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS50cmFuc2xhdGVfYnkgPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS50cmFuc2xhdGVfYnkgfHwgJ2NsaWNrJ1xuICB9LFxuICBkZWxheTogZnVuY3Rpb24obXMpIHtcbiAgICBpZiAobXMgIT0gdW5kZWZpbmVkICYmICFpc05hTihwYXJzZUZsb2F0KG1zKSkgJiYgaXNGaW5pdGUobXMpKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ2RlbGF5J10gPSBtc1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlWydkZWxheSddID09IHVuZGVmaW5lZCA/IDcwMCA6IHBhcnNlSW50KGxvY2FsU3RvcmFnZVsnZGVsYXknXSlcbiAgfSxcbiAgcG9wdXBfc2hvd190cmlnZ2VyOiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAoYXJnICE9IHVuZGVmaW5lZCkge1xuICAgICAgbG9jYWxTdG9yYWdlWydwb3B1cF9zaG93X3RyaWdnZXInXSA9IGFyZ1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlWydwb3B1cF9zaG93X3RyaWdnZXInXSB8fCAnY29tbWFuZCdcbiAgfSxcbiAgZm9udFNpemU6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmIChhcmcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VbJ2ZvbnRTaXplJ10gPSBhcmdcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KGxvY2FsU3RvcmFnZVsnZm9udFNpemUnXSB8fCAxNClcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9iYWNrZ3JvdW5kLmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==