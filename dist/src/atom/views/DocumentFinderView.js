"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 *
 */
var _ = require('lodash');
var atom_languageservices_1 = require('atom-languageservices');
var constants_1 = require('../../constants');
var FilterSelectListView_1 = require('./FilterSelectListView');
var DocumentFinderView = (function (_super) {
    __extends(DocumentFinderView, _super);
    function DocumentFinderView(commands, navigation, results) {
        var _this = this;
        _super.call(this, commands);
        this._navigation = navigation;
        this._subscription = results.subscribe(function (items) {
            _this.setFilterItems(items);
        });
        this._filterEditorView.getModel().buffer.onDidChange(function () {
            _this.populateList(_this._filterEditorView.getModel().getText());
        });
        this.storeFocusedElement();
        this._panel = atom.workspace.addModalPanel({ item: this.root });
        this.focusFilterEditor();
    }
    Object.defineProperty(DocumentFinderView.prototype, "filterKeys", {
        get: function () {
            return [
                { name: 'filterText', weight: 0.4 },
                { name: 'name', weight: 0.6 }
            ];
        },
        enumerable: true,
        configurable: true
    });
    DocumentFinderView.prototype.cancelled = function () {
        this._subscription.unsubscribe();
        this._panel.destroy();
    };
    DocumentFinderView.prototype.confirmed = function (item) {
        this._subscription.unsubscribe();
        this._navigation.navigateTo(item);
    };
    DocumentFinderView.prototype.viewForItem = function (result) {
        var item = result.item, matches = result.matches;
        var li = document.createElement('li');
        var filename = atom.project.relativizePath(item.filePath)[1];
        if (item.location) {
            filename += ': ' + item.location.row;
        }
        var filenameContent = filename;
        var nameContent = item.name;
        // const pathMatches = _.find(matches!, { key: 'filePath' });
        // if (pathMatches) {
        //     filenameContent = this._getMatchString(filenameContent, pathMatches);
        // }
        var nameMatches = _.find(matches, { key: 'name' });
        if (nameMatches) {
            nameContent = this._getMatchString(nameContent, nameMatches);
        }
        /* tslint:disable-next-line:no-inner-html */
        li.innerHTML = "\n            <span>" + (item.iconHTML || this._renderIcon(item)) + "<span>" + nameContent + "</span></span><br/>\n            <span class=\"filename\">" + filenameContent + "</span>\n            ";
        return li;
    };
    DocumentFinderView.prototype._getMatchString = function (text, match) {
        _.each(_.reverse(match.indices), function (_a) {
            var start = _a[0], end = _a[1];
            var endStr = text.substr(end + 1);
            var replace = "<span class=\"character-match\">" + text.substr(start, end - start + 1) + "</span>";
            var startStr = text.substr(0, start);
            text = "" + startStr + replace + endStr;
        });
        return text;
    };
    DocumentFinderView.prototype._renderIcon = function (completionItem) {
        return "<img height=\"16px\" width=\"16px\" src=\"atom://" + constants_1.packageName + "/styles/icons/" + atom_languageservices_1.Autocomplete.getIconFromSuggestionType(completionItem.type) + ".svg\" />";
    };
    return DocumentFinderView;
}(FilterSelectListView_1.FilterSelectListView));
exports.DocumentFinderView = DocumentFinderView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRGaW5kZXJWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2F0b20vdmlld3MvRG9jdW1lbnRGaW5kZXJWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztHQUVHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFFNUIsc0NBQXFDLHVCQUF1QixDQUFDLENBQUE7QUFDN0QsMEJBQTRCLGlCQUFpQixDQUFDLENBQUE7QUFHOUMscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFFOUQ7SUFBd0Msc0NBQXNDO0lBSTFFLDRCQUFZLFFBQXNCLEVBQUUsVUFBMEIsRUFBRSxPQUF1QztRQUozRyxpQkE2RUM7UUF4RU8sa0JBQU0sUUFBUSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSztZQUN4QyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDakQsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELHNCQUFXLDBDQUFV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Q0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQTdFRCxDQUF3QywyQ0FBb0IsR0E2RTNEO0FBN0VZLDBCQUFrQixxQkE2RTlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICpcclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dG9jb21wbGV0ZSwgRmluZGVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBBdG9tTmF2aWdhdGlvbiB9IGZyb20gJy4uL0F0b21OYXZpZ2F0aW9uJztcclxuaW1wb3J0IHsgRmlsdGVyU2VsZWN0TGlzdFZpZXcgfSBmcm9tICcuL0ZpbHRlclNlbGVjdExpc3RWaWV3JztcclxuXHJcbmV4cG9ydCBjbGFzcyBEb2N1bWVudEZpbmRlclZpZXcgZXh0ZW5kcyBGaWx0ZXJTZWxlY3RMaXN0VmlldzxGaW5kZXIuSVJlc3BvbnNlPiB7XHJcbiAgICBwcml2YXRlIF9uYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbjtcclxuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gICAgcHJpdmF0ZSBfcGFuZWw6IEF0b20uUGFuZWw7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb21tYW5kczogQXRvbUNvbW1hbmRzLCBuYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbiwgcmVzdWx0czogT2JzZXJ2YWJsZTxGaW5kZXIuSVJlc3BvbnNlW10+KSB7XHJcbiAgICAgICAgc3VwZXIoY29tbWFuZHMpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IHJlc3VsdHMuc3Vic2NyaWJlKGl0ZW1zID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRGaWx0ZXJJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZmlsdGVyRWRpdG9yVmlldy5nZXRNb2RlbCgpLmJ1ZmZlci5vbkRpZENoYW5nZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVMaXN0KHRoaXMuX2ZpbHRlckVkaXRvclZpZXcuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlRm9jdXNlZEVsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLl9wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzLnJvb3QgfSk7XHJcbiAgICAgICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZmlsdGVyS2V5cygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IG5hbWU6ICdmaWx0ZXJUZXh0Jywgd2VpZ2h0OiAwLjQgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHdlaWdodDogMC42IH1cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYW5jZWxsZWQoKSB7XHJcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgdGhpcy5fcGFuZWwuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb25maXJtZWQoaXRlbTogRmluZGVyLklSZXNwb25zZSkge1xyXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24ubmF2aWdhdGVUbyhpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdmlld0Zvckl0ZW0ocmVzdWx0OiBmdXNlLlJlc3VsdDxGaW5kZXIuSVJlc3BvbnNlPikge1xyXG4gICAgICAgIGNvbnN0IHtpdGVtLCBtYXRjaGVzfSA9IHJlc3VsdDtcclxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgbGV0IGZpbGVuYW1lID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGl0ZW0uZmlsZVBhdGgpWzFdO1xyXG4gICAgICAgIGlmIChpdGVtLmxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIGZpbGVuYW1lICs9ICc6ICcgKyBpdGVtLmxvY2F0aW9uLnJvdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZpbGVuYW1lQ29udGVudCA9IGZpbGVuYW1lO1xyXG4gICAgICAgIGxldCBuYW1lQ29udGVudCA9IGl0ZW0ubmFtZTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgcGF0aE1hdGNoZXMgPSBfLmZpbmQobWF0Y2hlcyEsIHsga2V5OiAnZmlsZVBhdGgnIH0pO1xyXG4gICAgICAgIC8vIGlmIChwYXRoTWF0Y2hlcykge1xyXG4gICAgICAgIC8vICAgICBmaWxlbmFtZUNvbnRlbnQgPSB0aGlzLl9nZXRNYXRjaFN0cmluZyhmaWxlbmFtZUNvbnRlbnQsIHBhdGhNYXRjaGVzKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgY29uc3QgbmFtZU1hdGNoZXMgPSBfLmZpbmQobWF0Y2hlcyEsIHsga2V5OiAnbmFtZScgfSk7XHJcbiAgICAgICAgaWYgKG5hbWVNYXRjaGVzKSB7XHJcbiAgICAgICAgICAgIG5hbWVDb250ZW50ID0gdGhpcy5fZ2V0TWF0Y2hTdHJpbmcobmFtZUNvbnRlbnQsIG5hbWVNYXRjaGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWlubmVyLWh0bWwgKi9cclxuICAgICAgICBsaS5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxzcGFuPiR7aXRlbS5pY29uSFRNTCB8fCB0aGlzLl9yZW5kZXJJY29uKGl0ZW0pfTxzcGFuPiR7bmFtZUNvbnRlbnR9PC9zcGFuPjwvc3Bhbj48YnIvPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZpbGVuYW1lXCI+JHtmaWxlbmFtZUNvbnRlbnR9PC9zcGFuPlxyXG4gICAgICAgICAgICBgO1xyXG5cclxuICAgICAgICByZXR1cm4gbGk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0TWF0Y2hTdHJpbmcodGV4dDogc3RyaW5nLCBtYXRjaDogZnVzZS5NYXRjaCkge1xyXG4gICAgICAgIF8uZWFjaChfLnJldmVyc2UobWF0Y2guaW5kaWNlcyksIChbc3RhcnQsIGVuZF0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZW5kU3RyID0gdGV4dC5zdWJzdHIoZW5kICsgMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcGxhY2UgPSBgPHNwYW4gY2xhc3M9XCJjaGFyYWN0ZXItbWF0Y2hcIj4ke3RleHQuc3Vic3RyKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpfTwvc3Bhbj5gO1xyXG4gICAgICAgICAgICBjb25zdCBzdGFydFN0ciA9IHRleHQuc3Vic3RyKDAsIHN0YXJ0KTtcclxuICAgICAgICAgICAgdGV4dCA9IGAke3N0YXJ0U3RyfSR7cmVwbGFjZX0ke2VuZFN0cn1gO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlbmRlckljb24oY29tcGxldGlvbkl0ZW06IHsgdHlwZT86IEF1dG9jb21wbGV0ZS5TdWdnZXN0aW9uVHlwZTsgfSkge1xyXG4gICAgICAgIHJldHVybiBgPGltZyBoZWlnaHQ9XCIxNnB4XCIgd2lkdGg9XCIxNnB4XCIgc3JjPVwiYXRvbTovLyR7cGFja2FnZU5hbWV9L3N0eWxlcy9pY29ucy8ke0F1dG9jb21wbGV0ZS5nZXRJY29uRnJvbVN1Z2dlc3Rpb25UeXBlKGNvbXBsZXRpb25JdGVtLnR5cGUhKX0uc3ZnXCIgLz5gO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==