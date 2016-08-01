"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
var lodash_1 = require('lodash');
var Observable_1 = require('rxjs/Observable');
var Subscriber_1 = require('rxjs/Subscriber');
function lodashDebounce(duration, options) {
    return this.lift(new LodashDebounceOperator(duration, options || {}));
}
exports.lodashDebounce = lodashDebounce;
Observable_1.Observable.prototype.lodashDebounce = lodashDebounce;
var LodashDebounceOperator = (function () {
    function LodashDebounceOperator(duration, options) {
        this._duration = duration;
        this._options = options;
    }
    LodashDebounceOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new LodashDebounceSubscriber(subscriber, this._duration, this._options));
    };
    return LodashDebounceOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var LodashDebounceSubscriber = (function (_super) {
    __extends(LodashDebounceSubscriber, _super);
    function LodashDebounceSubscriber(destination, duration, options) {
        _super.call(this, destination);
        this._duration = duration;
        this._method = lodash_1.debounce(lodash_1.bind(this._dispatchNext, this));
    }
    /* tslint:disable-next-line */
    LodashDebounceSubscriber.prototype._next = function (value) {
        this._method(value);
    };
    LodashDebounceSubscriber.prototype._dispatchNext = function (value) {
        if (this.closed) {
            return;
        }
        this.destination.next(value);
    };
    return LodashDebounceSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9kYXNoRGVib3VuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcnhqcy9Mb2Rhc2hEZWJvdW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsMkJBQTJCO0FBQzNCLHVCQUFnRCxRQUFRLENBQUMsQ0FBQTtBQUN6RCwyQkFBMkIsaUJBQWlCLENBQUMsQ0FBQTtBQUU3QywyQkFBMkIsaUJBQWlCLENBQUMsQ0FBQTtBQUc3Qyx3QkFBdUQsUUFBZ0IsRUFBRSxPQUF5QjtJQUM5RixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixDQUFJLFFBQVEsRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRmUsc0JBQWMsaUJBRTdCLENBQUE7QUFTRCx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0FBRXJEO0lBR0ksZ0NBQVksUUFBZ0IsRUFBRSxPQUF3QjtRQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRU0scUNBQUksR0FBWCxVQUFZLFVBQXlCLEVBQUUsTUFBVztRQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLENBQUM7SUFDTCw2QkFBQztBQUFELENBQUMsQUFYRCxJQVdDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQTBDLDRDQUFhO0lBSW5ELGtDQUFZLFdBQTBCLEVBQUUsUUFBZ0IsRUFBRSxPQUF3QjtRQUM5RSxrQkFBTSxXQUFXLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLGlCQUFRLENBQUMsYUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsOEJBQThCO0lBQ3BCLHdDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTyxnREFBYSxHQUFyQixVQUFzQixLQUFRO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDTCwrQkFBQztBQUFELENBQUMsQUFyQkQsQ0FBMEMsdUJBQVUsR0FxQm5EIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXHJcbmltcG9ydCB7IERlYm91bmNlT3B0aW9ucywgYmluZCwgZGVib3VuY2UgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICdyeGpzL09wZXJhdG9yJztcclxuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMvU3Vic2NyaWJlcic7XHJcbmltcG9ydCB7IFRlYXJkb3duTG9naWMgfSBmcm9tICdyeGpzL1N1YnNjcmlwdGlvbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9kYXNoRGVib3VuY2U8VD4odGhpczogT2JzZXJ2YWJsZTxUPiwgZHVyYXRpb246IG51bWJlciwgb3B0aW9ucz86IERlYm91bmNlT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGlmdChuZXcgTG9kYXNoRGVib3VuY2VPcGVyYXRvcjxUPihkdXJhdGlvbiwgb3B0aW9ucyB8fCB7fSkpO1xyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSAncnhqcy9PYnNlcnZhYmxlJyB7XHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6aW50ZXJmYWNlLW5hbWUgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbG9kYXNoRGVib3VuY2U6IHR5cGVvZiBsb2Rhc2hEZWJvdW5jZTtcclxuICAgIH1cclxufVxyXG5cclxuT2JzZXJ2YWJsZS5wcm90b3R5cGUubG9kYXNoRGVib3VuY2UgPSBsb2Rhc2hEZWJvdW5jZTtcclxuXHJcbmNsYXNzIExvZGFzaERlYm91bmNlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XHJcbiAgICBwcml2YXRlIF9kdXJhdGlvbjogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfb3B0aW9uczogRGVib3VuY2VPcHRpb25zO1xyXG4gICAgY29uc3RydWN0b3IoZHVyYXRpb246IG51bWJlciwgb3B0aW9uczogRGVib3VuY2VPcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xyXG4gICAgICAgIHJldHVybiBzb3VyY2UuX3N1YnNjcmliZShuZXcgTG9kYXNoRGVib3VuY2VTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9vcHRpb25zKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxyXG4gKiBAaWdub3JlXHJcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxyXG4gKi9cclxuY2xhc3MgTG9kYXNoRGVib3VuY2VTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XHJcbiAgICBwcml2YXRlIF9tZXRob2Q6ICh2YWx1ZTogVCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgX2R1cmF0aW9uOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sIGR1cmF0aW9uOiBudW1iZXIsIG9wdGlvbnM6IERlYm91bmNlT3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcclxuICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG4gICAgICAgIHRoaXMuX21ldGhvZCA9IGRlYm91bmNlKGJpbmQodGhpcy5fZGlzcGF0Y2hOZXh0LCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lICovXHJcbiAgICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9tZXRob2QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2Rpc3BhdGNoTmV4dCh2YWx1ZTogVCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCEodmFsdWUpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==