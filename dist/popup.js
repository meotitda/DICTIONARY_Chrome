/******/ (() => { // webpackBootstrap
/*!**********************!*
  !*** ./lib/popup.js ***!
  \**********************/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

let Popup = /*#__PURE__*/function (_HTMLElement) {
  _inherits(Popup, _HTMLElement);

  var _super = _createSuper(Popup);

  _createClass(Popup, null, [{
    key: "observedAttributes",
    get: function () {
      return ['content', 'top', 'left', 'width', 'height', 'options'];
    }
  }]);

  function Popup() {
    var _this;

    _classCallCheck(this, Popup);

    _this = _super.call(this);
    const t = document.querySelector('#transover-popup-template').content.cloneNode(true);

    _this.attachShadow({
      mode: 'open'
    }).appendChild(t);

    return _this;
  }

  _createClass(Popup, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(attribute, oldVal, newVal) {
      const main = this.shadowRoot.querySelector('main');

      if (attribute == 'content') {
        main.innerHTML = newVal;
        setTimeout(function () {
          const main = this.shadowRoot.querySelector('main');
          const style = window.getComputedStyle(main);
          this.setAttribute('content-width', parseFloat(style.width));
          this.setAttribute('content-height', parseFloat(style.height));
          this.setAttribute('outer-width', main.offsetWidth);
          this.setAttribute('outer-height', main.offsetHeight);
          const e = new CustomEvent('transover-popup_content_updated');
          this.dispatchEvent(e);
        }.bind(this), 0);
      } else if (attribute == 'options') {
        const {
          fontSize
        } = JSON.parse(newVal);
        main.style['font-size'] = fontSize + 'px';
      } else if (attribute == 'top') {
        main.style.top = newVal + 'px';
      } else if (attribute == 'left') {
        main.style.left = newVal + 'px';
      } else if (attribute == 'width') {
        main.style.width = newVal + 'px';
      } else if (attribute == 'height') {
        main.style.height = newVal + 'px';
      }
    }
  }]);

  return Popup;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

window.customElements.define('transover-popup', Popup);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsb19leHRlbnNpb25zLy4vbGliL3BvcHVwLmpzIl0sIm5hbWVzIjpbIlBvcHVwIiwidCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNvbnRlbnQiLCJjbG9uZU5vZGUiLCJhdHRhY2hTaGFkb3ciLCJtb2RlIiwiYXBwZW5kQ2hpbGQiLCJhdHRyaWJ1dGUiLCJvbGRWYWwiLCJuZXdWYWwiLCJtYWluIiwic2hhZG93Um9vdCIsImlubmVySFRNTCIsInNldFRpbWVvdXQiLCJzdHlsZSIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJzZXRBdHRyaWJ1dGUiLCJwYXJzZUZsb2F0Iiwid2lkdGgiLCJoZWlnaHQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImUiLCJDdXN0b21FdmVudCIsImRpc3BhdGNoRXZlbnQiLCJiaW5kIiwiZm9udFNpemUiLCJKU09OIiwicGFyc2UiLCJ0b3AiLCJsZWZ0IiwiSFRNTEVsZW1lbnQiLCJjdXN0b21FbGVtZW50cyIsImRlZmluZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BLEs7Ozs7Ozs7cUJBQzRCO0FBQzlCLGFBQU8sQ0FBQyxTQUFELEVBQVksS0FBWixFQUFtQixNQUFuQixFQUEyQixPQUEzQixFQUFvQyxRQUFwQyxFQUE4QyxTQUE5QyxDQUFQO0FBQ0Q7OztBQUVELG1CQUFjO0FBQUE7O0FBQUE7O0FBQ1o7QUFDQSxVQUFNQyxDQUFDLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QiwyQkFBdkIsRUFBb0RDLE9BQXBELENBQTREQyxTQUE1RCxDQUFzRSxJQUF0RSxDQUFWOztBQUNBLFVBQUtDLFlBQUwsQ0FBa0I7QUFBQ0MsVUFBSSxFQUFFO0FBQVAsS0FBbEIsRUFBa0NDLFdBQWxDLENBQThDUCxDQUE5Qzs7QUFIWTtBQUliOzs7OzZDQUV3QlEsUyxFQUFXQyxNLEVBQVFDLE0sRUFBUTtBQUNsRCxZQUFNQyxJQUFJLEdBQUcsS0FBS0MsVUFBTCxDQUFnQlYsYUFBaEIsQ0FBOEIsTUFBOUIsQ0FBYjs7QUFFQSxVQUFJTSxTQUFTLElBQUksU0FBakIsRUFBNEI7QUFDMUJHLFlBQUksQ0FBQ0UsU0FBTCxHQUFpQkgsTUFBakI7QUFFQUksa0JBQVUsQ0FBQyxZQUFXO0FBQ3BCLGdCQUFNSCxJQUFJLEdBQUcsS0FBS0MsVUFBTCxDQUFnQlYsYUFBaEIsQ0FBOEIsTUFBOUIsQ0FBYjtBQUNBLGdCQUFNYSxLQUFLLEdBQUdDLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0JOLElBQXhCLENBQWQ7QUFFQSxlQUFLTyxZQUFMLENBQWtCLGVBQWxCLEVBQW1DQyxVQUFVLENBQUNKLEtBQUssQ0FBQ0ssS0FBUCxDQUE3QztBQUNBLGVBQUtGLFlBQUwsQ0FBa0IsZ0JBQWxCLEVBQW9DQyxVQUFVLENBQUNKLEtBQUssQ0FBQ00sTUFBUCxDQUE5QztBQUVBLGVBQUtILFlBQUwsQ0FBa0IsYUFBbEIsRUFBaUNQLElBQUksQ0FBQ1csV0FBdEM7QUFDQSxlQUFLSixZQUFMLENBQWtCLGNBQWxCLEVBQWtDUCxJQUFJLENBQUNZLFlBQXZDO0FBRUEsZ0JBQU1DLENBQUMsR0FBRyxJQUFJQyxXQUFKLENBQWdCLGlDQUFoQixDQUFWO0FBQ0EsZUFBS0MsYUFBTCxDQUFtQkYsQ0FBbkI7QUFDRCxTQVpVLENBWVRHLElBWlMsQ0FZSixJQVpJLENBQUQsRUFZSSxDQVpKLENBQVY7QUFjRCxPQWpCRCxNQWlCTyxJQUFJbkIsU0FBUyxJQUFJLFNBQWpCLEVBQTRCO0FBQ2pDLGNBQU07QUFBQ29CO0FBQUQsWUFBYUMsSUFBSSxDQUFDQyxLQUFMLENBQVdwQixNQUFYLENBQW5CO0FBQ0FDLFlBQUksQ0FBQ0ksS0FBTCxDQUFXLFdBQVgsSUFBMEJhLFFBQVEsR0FBRyxJQUFyQztBQUNELE9BSE0sTUFHQSxJQUFJcEIsU0FBUyxJQUFJLEtBQWpCLEVBQXdCO0FBQzdCRyxZQUFJLENBQUNJLEtBQUwsQ0FBV2dCLEdBQVgsR0FBaUJyQixNQUFNLEdBQUcsSUFBMUI7QUFDRCxPQUZNLE1BRUEsSUFBSUYsU0FBUyxJQUFJLE1BQWpCLEVBQXlCO0FBQzlCRyxZQUFJLENBQUNJLEtBQUwsQ0FBV2lCLElBQVgsR0FBa0J0QixNQUFNLEdBQUcsSUFBM0I7QUFDRCxPQUZNLE1BRUEsSUFBSUYsU0FBUyxJQUFJLE9BQWpCLEVBQTBCO0FBQy9CRyxZQUFJLENBQUNJLEtBQUwsQ0FBV0ssS0FBWCxHQUFtQlYsTUFBTSxHQUFHLElBQTVCO0FBQ0QsT0FGTSxNQUVBLElBQUlGLFNBQVMsSUFBSSxRQUFqQixFQUEyQjtBQUNoQ0csWUFBSSxDQUFDSSxLQUFMLENBQVdNLE1BQVgsR0FBb0JYLE1BQU0sR0FBRyxJQUE3QjtBQUNEO0FBQ0Y7Ozs7aUNBM0NpQnVCLFc7O0FBOENwQmpCLE1BQU0sQ0FBQ2tCLGNBQVAsQ0FBc0JDLE1BQXRCLENBQTZCLGlCQUE3QixFQUFnRHBDLEtBQWhELEUiLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQb3B1cCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIFsnY29udGVudCcsICd0b3AnLCAnbGVmdCcsICd3aWR0aCcsICdoZWlnaHQnLCAnb3B0aW9ucyddXG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0cmFuc292ZXItcG9wdXAtdGVtcGxhdGUnKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKVxuICAgIHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KS5hcHBlbmRDaGlsZCh0KVxuICB9XG5cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZSwgb2xkVmFsLCBuZXdWYWwpIHtcbiAgICBjb25zdCBtYWluID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKVxuXG4gICAgaWYgKGF0dHJpYnV0ZSA9PSAnY29udGVudCcpIHtcbiAgICAgIG1haW4uaW5uZXJIVE1MID0gbmV3VmFsXG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1haW4gPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignbWFpbicpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobWFpbilcblxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnY29udGVudC13aWR0aCcsIHBhcnNlRmxvYXQoc3R5bGUud2lkdGgpKVxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnY29udGVudC1oZWlnaHQnLCBwYXJzZUZsb2F0KHN0eWxlLmhlaWdodCkpXG5cbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ291dGVyLXdpZHRoJywgbWFpbi5vZmZzZXRXaWR0aClcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ291dGVyLWhlaWdodCcsIG1haW4ub2Zmc2V0SGVpZ2h0KVxuXG4gICAgICAgIGNvbnN0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoJ3RyYW5zb3Zlci1wb3B1cF9jb250ZW50X3VwZGF0ZWQnKVxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZSlcbiAgICAgIH0uYmluZCh0aGlzKSwgMClcblxuICAgIH0gZWxzZSBpZiAoYXR0cmlidXRlID09ICdvcHRpb25zJykge1xuICAgICAgY29uc3Qge2ZvbnRTaXplfSA9IEpTT04ucGFyc2UobmV3VmFsKVxuICAgICAgbWFpbi5zdHlsZVsnZm9udC1zaXplJ10gPSBmb250U2l6ZSArICdweCdcbiAgICB9IGVsc2UgaWYgKGF0dHJpYnV0ZSA9PSAndG9wJykge1xuICAgICAgbWFpbi5zdHlsZS50b3AgPSBuZXdWYWwgKyAncHgnXG4gICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUgPT0gJ2xlZnQnKSB7XG4gICAgICBtYWluLnN0eWxlLmxlZnQgPSBuZXdWYWwgKyAncHgnXG4gICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUgPT0gJ3dpZHRoJykge1xuICAgICAgbWFpbi5zdHlsZS53aWR0aCA9IG5ld1ZhbCArICdweCdcbiAgICB9IGVsc2UgaWYgKGF0dHJpYnV0ZSA9PSAnaGVpZ2h0Jykge1xuICAgICAgbWFpbi5zdHlsZS5oZWlnaHQgPSBuZXdWYWwgKyAncHgnXG4gICAgfVxuICB9XG59XG5cbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3RyYW5zb3Zlci1wb3B1cCcsIFBvcHVwKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==