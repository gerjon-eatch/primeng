import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
export class Dock {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.model = null;
        this.position = "bottom";
        this.currentIndex = -3;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    onListMouseLeave() {
        this.currentIndex = -3;
        this.cd.markForCheck();
    }
    onItemMouseEnter(index) {
        this.currentIndex = index;
        if (index === 1) {
        }
        this.cd.markForCheck();
    }
    onItemClick(e, item) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }
    }
    get containerClass() {
        return {
            ['p-dock p-component ' + ` p-dock-${this.position}`]: true
        };
    }
    isClickableRouterLink(item) {
        return item.routerLink && !item.disabled;
    }
    itemClass(index) {
        return {
            'p-dock-item': true,
            'p-dock-item-second-prev': (this.currentIndex - 2) === index,
            'p-dock-item-prev': (this.currentIndex - 1) === index,
            'p-dock-item-current': this.currentIndex === index,
            'p-dock-item-next': (this.currentIndex + 1) === index,
            'p-dock-item-second-next': (this.currentIndex + 2) === index
        };
    }
}
Dock.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Dock, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Dock.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: Dock, selector: "p-dock", inputs: { id: "id", style: "style", styleClass: "styleClass", model: "model", position: "position" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [attr.id]="id" [ngClass]="containerClass" [ngStyle]="style" [class]="styleClass">
            <div class="p-dock-list-container">
                <ul #list class="p-dock-list" role="menu" (mouseleave)="onListMouseLeave()">
                    <li *ngFor="let item of model; let i = index" [ngClass]="itemClass(i)" (mouseenter)="onItemMouseEnter(i)">
                        <a *ngIf="isClickableRouterLink(item); else elseBlock" pRipple [routerLink]="item.routerLink" [queryParams]="item.queryParams"
                            [ngClass]="{'p-disabled':item.disabled}" class="p-dock-action"  role="menuitem" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" (click)="onItemClick($event, item)" (keydown.enter)="onItemClick($event, item, i)"
                            [attr.target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled || readonly ? null : (item.tabindex ? item.tabindex : '0')"  pTooltip [tooltipOptions]="item.tooltipOptions"
                            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                        </a>
                        <ng-template #elseBlock>
                            <a [tooltipPosition]="item.tooltipPosition" [attr.href]="item.url||null" class="p-dock-action"  role="menuitem" pRipple (click)="onItemClick($event, item)"  pTooltip [tooltipOptions]="item.tooltipOptions"
                                [ngClass]="{'p-disabled':item.disabled}" (keydown.enter)="onItemClick($event, item, i)" [attr.target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled||(i !== activeIndex && readonly) ? null : (item.tabindex ? item.tabindex : '0')">
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                            </a>
                        </ng-template>
                    </li>
                </ul>
            </div>
        </div>
    `, isInline: true, styles: [".p-dock{position:absolute;z-index:1;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dock-list-container{display:flex;pointer-events:auto}.p-dock-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center}.p-dock-item{transition:all .2s cubic-bezier(.4,0,.2,1);will-change:transform}.p-dock-action{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:default}.p-dock-item-second-prev,.p-dock-item-second-next{transform:scale(1.2)}.p-dock-item-prev,.p-dock-item-next{transform:scale(1.4)}.p-dock-item-current{transform:scale(1.6);z-index:1}.p-dock-top{left:0;top:0;width:100%}.p-dock-top .p-dock-item{transform-origin:center top}.p-dock-bottom{left:0;bottom:0;width:100%}.p-dock-bottom .p-dock-item{transform-origin:center bottom}.p-dock-right{right:0;top:0;height:100%}.p-dock-right .p-dock-item{transform-origin:center right}.p-dock-right .p-dock-list{flex-direction:column}.p-dock-left{left:0;top:0;height:100%}.p-dock-left .p-dock-item{transform-origin:center left}.p-dock-left .p-dock-list{flex-direction:column}\n"], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { type: i3.Ripple, selector: "[pRipple]" }, { type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Dock, decorators: [{
            type: Component,
            args: [{ selector: 'p-dock', template: `
        <div [attr.id]="id" [ngClass]="containerClass" [ngStyle]="style" [class]="styleClass">
            <div class="p-dock-list-container">
                <ul #list class="p-dock-list" role="menu" (mouseleave)="onListMouseLeave()">
                    <li *ngFor="let item of model; let i = index" [ngClass]="itemClass(i)" (mouseenter)="onItemMouseEnter(i)">
                        <a *ngIf="isClickableRouterLink(item); else elseBlock" pRipple [routerLink]="item.routerLink" [queryParams]="item.queryParams"
                            [ngClass]="{'p-disabled':item.disabled}" class="p-dock-action"  role="menuitem" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" (click)="onItemClick($event, item)" (keydown.enter)="onItemClick($event, item, i)"
                            [attr.target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled || readonly ? null : (item.tabindex ? item.tabindex : '0')"  pTooltip [tooltipOptions]="item.tooltipOptions"
                            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                        </a>
                        <ng-template #elseBlock>
                            <a [tooltipPosition]="item.tooltipPosition" [attr.href]="item.url||null" class="p-dock-action"  role="menuitem" pRipple (click)="onItemClick($event, item)"  pTooltip [tooltipOptions]="item.tooltipOptions"
                                [ngClass]="{'p-disabled':item.disabled}" (keydown.enter)="onItemClick($event, item, i)" [attr.target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled||(i !== activeIndex && readonly) ? null : (item.tabindex ? item.tabindex : '0')">
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                            </a>
                        </ng-template>
                    </li>
                </ul>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-dock{position:absolute;z-index:1;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dock-list-container{display:flex;pointer-events:auto}.p-dock-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center}.p-dock-item{transition:all .2s cubic-bezier(.4,0,.2,1);will-change:transform}.p-dock-action{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:default}.p-dock-item-second-prev,.p-dock-item-second-next{transform:scale(1.2)}.p-dock-item-prev,.p-dock-item-next{transform:scale(1.4)}.p-dock-item-current{transform:scale(1.6);z-index:1}.p-dock-top{left:0;top:0;width:100%}.p-dock-top .p-dock-item{transform-origin:center top}.p-dock-bottom{left:0;bottom:0;width:100%}.p-dock-bottom .p-dock-item{transform-origin:center bottom}.p-dock-right{right:0;top:0;height:100%}.p-dock-right .p-dock-item{transform-origin:center right}.p-dock-right .p-dock-list{flex-direction:column}.p-dock-left{left:0;top:0;height:100%}.p-dock-left .p-dock-item{transform-origin:center left}.p-dock-left .p-dock-list{flex-direction:column}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { id: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], model: [{
                type: Input
            }], position: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class DockModule {
}
DockModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DockModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DockModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DockModule, declarations: [Dock], imports: [CommonModule, RouterModule, RippleModule, TooltipModule], exports: [Dock, SharedModule, TooltipModule, RouterModule] });
DockModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DockModule, imports: [[CommonModule, RouterModule, RippleModule, TooltipModule], SharedModule, TooltipModule, RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DockModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
                    exports: [Dock, SharedModule, TooltipModule, RouterModule],
                    declarations: [Dock]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9kb2NrL2RvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUE0Qix1QkFBdUIsRUFBRSxpQkFBaUIsRUFBaUMsZUFBZSxFQUFnQyxNQUFNLGVBQWUsQ0FBQztBQUMvTSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7OztBQW1DaEQsTUFBTSxPQUFPLElBQUk7SUFrQmIsWUFBb0IsRUFBYyxFQUFTLEVBQXFCO1FBQTVDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVZ2RCxVQUFLLEdBQVUsSUFBSSxDQUFDO1FBRXBCLGFBQVEsR0FBVyxRQUFRLENBQUM7UUFTakMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDbkIsS0FBSyxNQUFNO29CQUNQLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDdEMsTUFBTTtnQkFFTjtvQkFDSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3RDLE1BQU07YUFD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bnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgSW5wdXQsIEVsZW1lbnRSZWYsIENvbnRlbnRDaGlsZCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBUZW1wbGF0ZVJlZiwgQWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IFRvb2x0aXBNb2R1bGUgfSBmcm9tICdwcmltZW5nL3Rvb2x0aXAnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZG9jaycsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbYXR0ci5pZF09XCJpZFwiIFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZG9jay1saXN0LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDx1bCAjbGlzdCBjbGFzcz1cInAtZG9jay1saXN0XCIgcm9sZT1cIm1lbnVcIiAobW91c2VsZWF2ZSk9XCJvbkxpc3RNb3VzZUxlYXZlKClcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBpdGVtIG9mIG1vZGVsOyBsZXQgaSA9IGluZGV4XCIgW25nQ2xhc3NdPVwiaXRlbUNsYXNzKGkpXCIgKG1vdXNlZW50ZXIpPVwib25JdGVtTW91c2VFbnRlcihpKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgKm5nSWY9XCJpc0NsaWNrYWJsZVJvdXRlckxpbmsoaXRlbSk7IGVsc2UgZWxzZUJsb2NrXCIgcFJpcHBsZSBbcm91dGVyTGlua109XCJpdGVtLnJvdXRlckxpbmtcIiBbcXVlcnlQYXJhbXNdPVwiaXRlbS5xdWVyeVBhcmFtc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLWRpc2FibGVkJzppdGVtLmRpc2FibGVkfVwiIGNsYXNzPVwicC1kb2NrLWFjdGlvblwiICByb2xlPVwibWVudWl0ZW1cIiBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwiaXRlbS5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc3x8e2V4YWN0OmZhbHNlfVwiIChjbGljayk9XCJvbkl0ZW1DbGljaygkZXZlbnQsIGl0ZW0pXCIgKGtleWRvd24uZW50ZXIpPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtLCBpKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCIgW2F0dHIuaWRdPVwiaXRlbS5pZFwiIFthdHRyLnRhYmluZGV4XT1cIml0ZW0uZGlzYWJsZWQgfHwgcmVhZG9ubHkgPyBudWxsIDogKGl0ZW0udGFiaW5kZXggPyBpdGVtLnRhYmluZGV4IDogJzAnKVwiICBwVG9vbHRpcCBbdG9vbHRpcE9wdGlvbnNdPVwiaXRlbS50b29sdGlwT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZyYWdtZW50XT1cIml0ZW0uZnJhZ21lbnRcIiBbcXVlcnlQYXJhbXNIYW5kbGluZ109XCJpdGVtLnF1ZXJ5UGFyYW1zSGFuZGxpbmdcIiBbcHJlc2VydmVGcmFnbWVudF09XCJpdGVtLnByZXNlcnZlRnJhZ21lbnRcIiBbc2tpcExvY2F0aW9uQ2hhbmdlXT1cIml0ZW0uc2tpcExvY2F0aW9uQ2hhbmdlXCIgW3JlcGxhY2VVcmxdPVwiaXRlbS5yZXBsYWNlVXJsXCIgW3N0YXRlXT1cIml0ZW0uc3RhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWRvY2stYWN0aW9uLWljb25cIiAqbmdJZj1cIml0ZW0uaWNvbiAmJiAhaXRlbVRlbXBsYXRlXCIgW25nQ2xhc3NdPVwiaXRlbS5pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBpdGVtfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNlbHNlQmxvY2s+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgW3Rvb2x0aXBQb3NpdGlvbl09XCJpdGVtLnRvb2x0aXBQb3NpdGlvblwiIFthdHRyLmhyZWZdPVwiaXRlbS51cmx8fG51bGxcIiBjbGFzcz1cInAtZG9jay1hY3Rpb25cIiAgcm9sZT1cIm1lbnVpdGVtXCIgcFJpcHBsZSAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtKVwiICBwVG9vbHRpcCBbdG9vbHRpcE9wdGlvbnNdPVwiaXRlbS50b29sdGlwT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsncC1kaXNhYmxlZCc6aXRlbS5kaXNhYmxlZH1cIiAoa2V5ZG93bi5lbnRlcik9XCJvbkl0ZW1DbGljaygkZXZlbnQsIGl0ZW0sIGkpXCIgW2F0dHIudGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCIgW2F0dHIuaWRdPVwiaXRlbS5pZFwiIFthdHRyLnRhYmluZGV4XT1cIml0ZW0uZGlzYWJsZWR8fChpICE9PSBhY3RpdmVJbmRleCAmJiByZWFkb25seSkgPyBudWxsIDogKGl0ZW0udGFiaW5kZXggPyBpdGVtLnRhYmluZGV4IDogJzAnKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtZG9jay1hY3Rpb24taWNvblwiICpuZ0lmPVwiaXRlbS5pY29uICYmICFpdGVtVGVtcGxhdGVcIiBbbmdDbGFzc109XCJpdGVtLmljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IGl0ZW19XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9kb2NrLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIERvY2sgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcblxuICAgIEBJbnB1dCgpIGlkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbW9kZWw6IGFueVtdID0gbnVsbDtcblxuICAgIEBJbnB1dCgpIHBvc2l0aW9uOiBzdHJpbmcgPSBcImJvdHRvbVwiO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgY3VycmVudEluZGV4OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gLTM7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2goaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdpdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkxpc3RNb3VzZUxlYXZlKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IC0zO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIG9uSXRlbU1vdXNlRW50ZXIoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBpbmRleDtcblxuICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayhlLCBpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLmNvbW1hbmQpIHtcbiAgICAgICAgICAgIGl0ZW0uY29tbWFuZCh7IG9yaWdpbmFsRXZlbnQ6IGUsIGl0ZW0gfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgY29udGFpbmVyQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBbJ3AtZG9jayBwLWNvbXBvbmVudCAnICsgYCBwLWRvY2stJHt0aGlzLnBvc2l0aW9ufWBdOiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaXNDbGlja2FibGVSb3V0ZXJMaW5rKGl0ZW06IGFueSkge1xuICAgICAgICByZXR1cm4gaXRlbS5yb3V0ZXJMaW5rICYmICFpdGVtLmRpc2FibGVkO1xuICAgIH1cblxuICAgIGl0ZW1DbGFzcyhpbmRleCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3AtZG9jay1pdGVtJzogdHJ1ZSxcbiAgICAgICAgICAgICdwLWRvY2staXRlbS1zZWNvbmQtcHJldic6ICh0aGlzLmN1cnJlbnRJbmRleCAtIDIpID09PSBpbmRleCxcbiAgICAgICAgICAgICdwLWRvY2staXRlbS1wcmV2JzogKHRoaXMuY3VycmVudEluZGV4IC0gMSkgPT09IGluZGV4LFxuICAgICAgICAgICAgJ3AtZG9jay1pdGVtLWN1cnJlbnQnOiB0aGlzLmN1cnJlbnRJbmRleCA9PT0gaW5kZXgsXG4gICAgICAgICAgICAncC1kb2NrLWl0ZW0tbmV4dCc6ICh0aGlzLmN1cnJlbnRJbmRleCArIDEpID09PSBpbmRleCxcbiAgICAgICAgICAgICdwLWRvY2staXRlbS1zZWNvbmQtbmV4dCc6ICh0aGlzLmN1cnJlbnRJbmRleCArIDIpID09PSBpbmRleFxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUm91dGVyTW9kdWxlLCBSaXBwbGVNb2R1bGUsIFRvb2x0aXBNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtEb2NrLCBTaGFyZWRNb2R1bGUsIFRvb2x0aXBNb2R1bGUsIFJvdXRlck1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbRG9ja11cbn0pXG5leHBvcnQgY2xhc3MgRG9ja01vZHVsZSB7IH1cbiJdfQ==