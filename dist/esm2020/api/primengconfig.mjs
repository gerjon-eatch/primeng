import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FilterMatchMode } from './filtermatchmode';
import * as i0 from "@angular/core";
export class PrimeNGConfig {
    constructor() {
        this.ripple = false;
        this.filterMatchModeOptions = {
            text: [
                FilterMatchMode.STARTS_WITH,
                FilterMatchMode.CONTAINS,
                FilterMatchMode.NOT_CONTAINS,
                FilterMatchMode.ENDS_WITH,
                FilterMatchMode.EQUALS,
                FilterMatchMode.NOT_EQUALS
            ],
            numeric: [
                FilterMatchMode.EQUALS,
                FilterMatchMode.NOT_EQUALS,
                FilterMatchMode.LESS_THAN,
                FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
                FilterMatchMode.GREATER_THAN,
                FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
            ],
            date: [
                FilterMatchMode.DATE_IS,
                FilterMatchMode.DATE_IS_NOT,
                FilterMatchMode.DATE_BEFORE,
                FilterMatchMode.DATE_AFTER
            ]
        };
        this.translation = {
            startsWith: 'Starts with',
            contains: 'Contains',
            notContains: 'Not contains',
            endsWith: 'Ends with',
            equals: 'Equals',
            notEquals: 'Not equals',
            noFilter: 'No Filter',
            lt: 'Less than',
            lte: 'Less than or equal to',
            gt: 'Greater than',
            gte: 'Greater than or equal to',
            is: 'Is',
            isNot: 'Is not',
            before: 'Before',
            after: 'After',
            dateIs: 'Date is',
            dateIsNot: 'Date is not',
            dateBefore: 'Date is before',
            dateAfter: 'Date is after',
            clear: 'Clear',
            apply: 'Apply',
            matchAll: 'Match All',
            matchAny: 'Match Any',
            addRule: 'Add Rule',
            removeRule: 'Remove Rule',
            accept: 'Yes',
            reject: 'No',
            choose: 'Choose',
            upload: 'Upload',
            cancel: 'Cancel',
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dateFormat: 'mm/dd/yy',
            firstDayOfWeek: 0,
            today: 'Today',
            weekHeader: 'Wk',
            weak: 'Weak',
            medium: 'Medium',
            strong: 'Strong',
            passwordPrompt: 'Enter a password',
            emptyMessage: 'No results found',
            emptyFilterMessage: 'No results found'
        };
        this.zIndex = {
            modal: 1100,
            overlay: 1000,
            menu: 1000,
            tooltip: 1100
        };
        this.translationSource = new Subject();
        this.translationObserver = this.translationSource.asObservable();
    }
    getTranslation(key) {
        return this.translation[key];
    }
    setTranslation(value) {
        this.translation = { ...this.translation, ...value };
        this.translationSource.next(this.translation);
    }
}
PrimeNGConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: PrimeNGConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PrimeNGConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: PrimeNGConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: PrimeNGConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWVuZ2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9hcGkvcHJpbWVuZ2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDOztBQUlwRCxNQUFNLE9BQU8sYUFBYTtJQUQxQjtRQUdJLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFFeEIsMkJBQXNCLEdBQUc7WUFDckIsSUFBSSxFQUFFO2dCQUNGLGVBQWUsQ0FBQyxXQUFXO2dCQUMzQixlQUFlLENBQUMsUUFBUTtnQkFDeEIsZUFBZSxDQUFDLFlBQVk7Z0JBQzVCLGVBQWUsQ0FBQyxTQUFTO2dCQUN6QixlQUFlLENBQUMsTUFBTTtnQkFDdEIsZUFBZSxDQUFDLFVBQVU7YUFDN0I7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsZUFBZSxDQUFDLE1BQU07Z0JBQ3RCLGVBQWUsQ0FBQyxVQUFVO2dCQUMxQixlQUFlLENBQUMsU0FBUztnQkFDekIsZUFBZSxDQUFDLHFCQUFxQjtnQkFDckMsZUFBZSxDQUFDLFlBQVk7Z0JBQzVCLGVBQWUsQ0FBQyx3QkFBd0I7YUFDM0M7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsZUFBZSxDQUFDLE9BQU87Z0JBQ3ZCLGVBQWUsQ0FBQyxXQUFXO2dCQUMzQixlQUFlLENBQUMsV0FBVztnQkFDM0IsZUFBZSxDQUFDLFVBQVU7YUFDN0I7U0FDSixDQUFDO1FBRU0sZ0JBQVcsR0FBZ0I7WUFDL0IsVUFBVSxFQUFFLGFBQWE7WUFDekIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsV0FBVyxFQUFFLGNBQWM7WUFDM0IsUUFBUSxFQUFFLFdBQVc7WUFDckIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsU0FBUyxFQUFF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bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRmlsdGVyTWF0Y2hNb2RlIH0gZnJvbSAnLi9maWx0ZXJtYXRjaG1vZGUnO1xuaW1wb3J0IHsgVHJhbnNsYXRpb24gfSBmcm9tICcuL3RyYW5zbGF0aW9uJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgUHJpbWVOR0NvbmZpZyB7XG5cbiAgICByaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGZpbHRlck1hdGNoTW9kZU9wdGlvbnMgPSB7XG4gICAgICAgIHRleHQ6IFtcbiAgICAgICAgICAgIEZpbHRlck1hdGNoTW9kZS5TVEFSVFNfV0lUSCxcbiAgICAgICAgICAgIEZpbHRlck1hdGNoTW9kZS5DT05UQUlOUyxcbiAgICAgICAgICAgIEZpbHRlck1hdGNoTW9kZS5OT1RfQ09OVEFJTlMsXG4gICAgICAgICAgICBGaWx0ZXJNYXRjaE1vZGUuRU5EU19XSVRILFxuICAgICAgICAgICAgRmlsdGVyTWF0Y2hNb2RlLkVRVUFMUyxcbiAgICAgICAgICAgIEZpbHRlck1hdGNoTW9kZS5OT1RfRVFVQUxTXG4gICAgICAgIF0sXG4gICAgICAgIG51bWVyaWM6IFtcbiAgICAgICAgICAgIEZpbHRlck1hdGNoTW9kZS5FUVVBTFMsXG4gICAgICAgICAgICBGaWx0ZXJNYXRjaE1vZGUuTk9UX0VRVUFMUyxcbiAgICAgICAgICAgIEZpbHRlck1hdGNoTW9kZS5MRVNTX1RIQU4sXG4gICAgICAgICAgICBGaWx0ZXJNYXRjaE1vZGUuTEVTU19USEFOX09SX0VRVUFMX1RPLFxuICAgICAgICAgICAgRmlsdGVyTWF0Y2hNb2RlLkdSRUFURVJfVEhBTixcbiAgICAgICAgICAgIEZpbHRlck1hdGNoTW9kZS5HUkVBVEVSX1RIQU5fT1JfRVFVQUxfVE9cbiAgICAgICAgXSxcbiAgICAgICAgZGF0ZTogW1xuICAgICAgICAgICAgRmlsdGVyTWF0Y2hNb2RlLkRBVEVfSVMsXG4gICAgICAgICAgICBGaWx0ZXJNYXRjaE1vZGUuREFURV9JU19OT1QsXG4gICAgICAgICAgICBGaWx0ZXJNYXRjaE1vZGUuREFURV9CRUZPUkUsXG4gICAgICAgICAgICBGaWx0ZXJNYXRjaE1vZGUuREFURV9BRlRFUlxuICAgICAgICBdXG4gICAgfTtcblxuICAgIHByaXZhdGUgdHJhbnNsYXRpb246IFRyYW5zbGF0aW9uID0ge1xuICAgICAgICBzdGFydHNXaXRoOiAnU3RhcnRzIHdpdGgnLFxuICAgICAgICBjb250YWluczogJ0NvbnRhaW5zJyxcbiAgICAgICAgbm90Q29udGFpbnM6ICdOb3QgY29udGFpbnMnLFxuICAgICAgICBlbmRzV2l0aDogJ0VuZHMgd2l0aCcsXG4gICAgICAgIGVxdWFsczogJ0VxdWFscycsXG4gICAgICAgIG5vdEVxdWFsczogJ05vdCBlcXVhbHMnLFxuICAgICAgICBub0ZpbHRlcjogJ05vIEZpbHRlcicsXG4gICAgICAgIGx0OiAnTGVzcyB0aGFuJyxcbiAgICAgICAgbHRlOiAnTGVzcyB0aGFuIG9yIGVxdWFsIHRvJyxcbiAgICAgICAgZ3Q6ICdHcmVhdGVyIHRoYW4nLFxuICAgICAgICBndGU6ICdHcmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8nLFxuICAgICAgICBpczogJ0lzJyxcbiAgICAgICAgaXNOb3Q6ICdJcyBub3QnLFxuICAgICAgICBiZWZvcmU6ICdCZWZvcmUnLFxuICAgICAgICBhZnRlcjogJ0FmdGVyJyxcbiAgICAgICAgZGF0ZUlzOiAnRGF0ZSBpcycsXG4gICAgICAgIGRhdGVJc05vdDogJ0RhdGUgaXMgbm90JyxcbiAgICAgICAgZGF0ZUJlZm9yZTogJ0RhdGUgaXMgYmVmb3JlJyxcbiAgICAgICAgZGF0ZUFmdGVyOiAnRGF0ZSBpcyBhZnRlcicsXG4gICAgICAgIGNsZWFyOiAnQ2xlYXInLFxuICAgICAgICBhcHBseTogJ0FwcGx5JyxcbiAgICAgICAgbWF0Y2hBbGw6ICdNYXRjaCBBbGwnLFxuICAgICAgICBtYXRjaEFueTogJ01hdGNoIEFueScsXG4gICAgICAgIGFkZFJ1bGU6ICdBZGQgUnVsZScsXG4gICAgICAgIHJlbW92ZVJ1bGU6ICdSZW1vdmUgUnVsZScsXG4gICAgICAgIGFjY2VwdDogJ1llcycsXG4gICAgICAgIHJlamVjdDogJ05vJyxcbiAgICAgICAgY2hvb3NlOiAnQ2hvb3NlJyxcbiAgICAgICAgdXBsb2FkOiAnVXBsb2FkJyxcbiAgICAgICAgY2FuY2VsOiAnQ2FuY2VsJyxcbiAgICAgICAgZGF5TmFtZXM6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICAgICAgICBkYXlOYW1lc1Nob3J0OiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gICAgICAgIGRheU5hbWVzTWluOiBbXCJTdVwiLFwiTW9cIixcIlR1XCIsXCJXZVwiLFwiVGhcIixcIkZyXCIsXCJTYVwiXSxcbiAgICAgICAgbW9udGhOYW1lczogW1wiSmFudWFyeVwiLFwiRmVicnVhcnlcIixcIk1hcmNoXCIsXCJBcHJpbFwiLFwiTWF5XCIsXCJKdW5lXCIsXCJKdWx5XCIsXCJBdWd1c3RcIixcIlNlcHRlbWJlclwiLFwiT2N0b2JlclwiLFwiTm92ZW1iZXJcIixcIkRlY2VtYmVyXCJdLFxuICAgICAgICBtb250aE5hbWVzU2hvcnQ6IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdLFxuICAgICAgICBkYXRlRm9ybWF0OiAnbW0vZGQveXknLFxuICAgICAgICBmaXJzdERheU9mV2VlazogMCxcbiAgICAgICAgdG9kYXk6ICdUb2RheScsXG4gICAgICAgIHdlZWtIZWFkZXI6ICdXaycsXG4gICAgICAgIHdlYWs6ICdXZWFrJyxcbiAgICAgICAgbWVkaXVtOiAnTWVkaXVtJyxcbiAgICAgICAgc3Ryb25nOiAnU3Ryb25nJyxcbiAgICAgICAgcGFzc3dvcmRQcm9tcHQ6ICdFbnRlciBhIHBhc3N3b3JkJyxcbiAgICAgICAgZW1wdHlNZXNzYWdlOiAnTm8gcmVzdWx0cyBmb3VuZCcsXG4gICAgICAgIGVtcHR5RmlsdGVyTWVzc2FnZTogJ05vIHJlc3VsdHMgZm91bmQnXG4gICAgfVxuXG4gICAgekluZGV4ID0ge1xuICAgICAgICBtb2RhbDogMTEwMCxcbiAgICAgICAgb3ZlcmxheTogMTAwMCxcbiAgICAgICAgbWVudTogMTAwMCxcbiAgICAgICAgdG9vbHRpcDogMTEwMFxuICAgIH1cblxuICAgIHByaXZhdGUgdHJhbnNsYXRpb25Tb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG5cbiAgICB0cmFuc2xhdGlvbk9ic2VydmVyID0gdGhpcy50cmFuc2xhdGlvblNvdXJjZS5hc09ic2VydmFibGUoKTtcblxuICAgIGdldFRyYW5zbGF0aW9uKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9uW2tleV07XG4gICAgfVxuXG4gICAgc2V0VHJhbnNsYXRpb24odmFsdWU6IFRyYW5zbGF0aW9uKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRpb24gPSB7Li4udGhpcy50cmFuc2xhdGlvbiwgLi4udmFsdWV9O1xuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uU291cmNlLm5leHQodGhpcy50cmFuc2xhdGlvbik7XG4gICAgfVxufVxuIl19