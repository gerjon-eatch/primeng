import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';

class Toolbar {
    constructor(el) {
        this.el = el;
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'left':
                    this.leftTemplate = item.template;
                    break;
                case 'right':
                    this.rightTemplate = item.template;
                    break;
            }
        });
    }
}
Toolbar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Toolbar, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
Toolbar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: Toolbar, selector: "p-toolbar", inputs: { style: "style", styleClass: "styleClass" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [ngClass]="'p-toolbar p-component'" [ngStyle]="style" [class]="styleClass" role="toolbar">
            <ng-content></ng-content>
            <div class="p-toolbar-group-left" *ngIf="leftTemplate">
                <ng-container *ngTemplateOutlet="leftTemplate"></ng-container>
            </div>
            <div class="p-toolbar-group-right" *ngIf="rightTemplate">
                <ng-container *ngTemplateOutlet="rightTemplate"></ng-container>
            </div>
        </div>
    `, isInline: true, styles: [".p-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap}.p-toolbar-group-left,.p-toolbar-group-right{display:flex;align-items:center}\n"], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Toolbar, decorators: [{
            type: Component,
            args: [{ selector: 'p-toolbar', template: `
        <div [ngClass]="'p-toolbar p-component'" [ngStyle]="style" [class]="styleClass" role="toolbar">
            <ng-content></ng-content>
            <div class="p-toolbar-group-left" *ngIf="leftTemplate">
                <ng-container *ngTemplateOutlet="leftTemplate"></ng-container>
            </div>
            <div class="p-toolbar-group-right" *ngIf="rightTemplate">
                <ng-container *ngTemplateOutlet="rightTemplate"></ng-container>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap}.p-toolbar-group-left,.p-toolbar-group-right{display:flex;align-items:center}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class ToolbarModule {
}
ToolbarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ToolbarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ToolbarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ToolbarModule, declarations: [Toolbar], imports: [CommonModule], exports: [Toolbar] });
ToolbarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ToolbarModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ToolbarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Toolbar],
                    declarations: [Toolbar]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Toolbar, ToolbarModule };
//# sourceMappingURL=primeng-toolbar.mjs.map
