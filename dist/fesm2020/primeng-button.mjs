import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Directive, Inject, Input, EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, Output, NgModule } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i2 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import { ObjectUtils } from 'primeng/utils';

const INTERNAL_BUTTON_CLASSES = {
    button: 'p-button',
    component: 'p-component',
    iconOnly: 'p-button-icon-only',
    disabled: 'p-disabled',
    loading: 'p-button-loading',
    labelOnly: 'p-button-loading-label-only'
};
class ButtonDirective {
    constructor(el, document) {
        this.el = el;
        this.document = document;
        this.iconPos = 'left';
        this.loadingIcon = 'pi pi-spinner pi-spin';
        this._loading = false;
        this._internalClasses = Object.values(INTERNAL_BUTTON_CLASSES);
    }
    get label() {
        return this._label;
    }
    set label(val) {
        this._label = val;
        if (this.initialized) {
            this.updateLabel();
            this.updateIcon();
            this.setStyleClass();
        }
    }
    get icon() {
        return this._icon;
    }
    set icon(val) {
        this._icon = val;
        if (this.initialized) {
            this.updateIcon();
            this.setStyleClass();
        }
    }
    get loading() {
        return this._loading;
    }
    set loading(val) {
        this._loading = val;
        if (this.initialized) {
            this.updateIcon();
            this.setStyleClass();
        }
    }
    get htmlElement() {
        return this.el.nativeElement;
    }
    ngAfterViewInit() {
        DomHandler.addMultipleClasses(this.htmlElement, this.getStyleClass().join(' '));
        this.createIcon();
        this.createLabel();
        this.initialized = true;
    }
    getStyleClass() {
        const styleClass = [INTERNAL_BUTTON_CLASSES.button, INTERNAL_BUTTON_CLASSES.component];
        if (this.icon && !this.label && ObjectUtils.isEmpty(this.htmlElement.textContent)) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.iconOnly);
        }
        if (this.loading) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.disabled, INTERNAL_BUTTON_CLASSES.loading);
            if (!this.icon && this.label) {
                styleClass.push(INTERNAL_BUTTON_CLASSES.labelOnly);
            }
        }
        return styleClass;
    }
    setStyleClass() {
        const styleClass = this.getStyleClass();
        this.htmlElement.classList.remove(...this._internalClasses);
        this.htmlElement.classList.add(...styleClass);
    }
    createLabel() {
        if (this.label) {
            let labelElement = this.document.createElement('span');
            if (this.icon && !this.label) {
                labelElement.setAttribute('aria-hidden', 'true');
            }
            labelElement.className = 'p-button-label';
            labelElement.appendChild(this.document.createTextNode(this.label));
            this.htmlElement.appendChild(labelElement);
        }
    }
    createIcon() {
        if (this.icon || this.loading) {
            let iconElement = this.document.createElement('span');
            iconElement.className = 'p-button-icon';
            iconElement.setAttribute('aria-hidden', 'true');
            let iconPosClass = this.label ? 'p-button-icon-' + this.iconPos : null;
            if (iconPosClass) {
                DomHandler.addClass(iconElement, iconPosClass);
            }
            let iconClass = this.getIconClass();
            if (iconClass) {
                DomHandler.addMultipleClasses(iconElement, iconClass);
            }
            this.htmlElement.insertBefore(iconElement, this.htmlElement.firstChild);
        }
    }
    updateLabel() {
        let labelElement = DomHandler.findSingle(this.htmlElement, '.p-button-label');
        if (!this.label) {
            labelElement && this.htmlElement.removeChild(labelElement);
            return;
        }
        labelElement ? (labelElement.textContent = this.label) : this.createLabel();
    }
    updateIcon() {
        let iconElement = DomHandler.findSingle(this.htmlElement, '.p-button-icon');
        if (!this.icon && !this.loading) {
            iconElement && this.htmlElement.removeChild(iconElement);
            return;
        }
        if (iconElement) {
            if (this.iconPos)
                iconElement.className = 'p-button-icon p-button-icon-' + this.iconPos + ' ' + this.getIconClass();
            else
                iconElement.className = 'p-button-icon ' + this.getIconClass();
        }
        else {
            this.createIcon();
        }
    }
    getIconClass() {
        return this.loading ? 'p-button-loading-icon ' + this.loadingIcon : this._icon;
    }
    ngOnDestroy() {
        this.initialized = false;
    }
}
ButtonDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ButtonDirective, deps: [{ token: i0.ElementRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
ButtonDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: ButtonDirective, selector: "[pButton]", inputs: { iconPos: "iconPos", loadingIcon: "loadingIcon", label: "label", icon: "icon", loading: "loading" }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pButton]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { iconPos: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], label: [{
                type: Input
            }], icon: [{
                type: Input
            }], loading: [{
                type: Input
            }] } });
class Button {
    constructor() {
        this.type = 'button';
        this.iconPos = 'left';
        this.loading = false;
        this.loadingIcon = 'pi pi-spinner pi-spin';
        this.onClick = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    badgeStyleClass() {
        return {
            'p-badge p-component': true,
            'p-badge-no-gutter': this.badge && String(this.badge).length === 1
        };
    }
}
Button.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Button, deps: [], target: i0.ɵɵFactoryTarget.Component });
Button.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: Button, selector: "p-button", inputs: { type: "type", iconPos: "iconPos", icon: "icon", badge: "badge", label: "label", disabled: "disabled", loading: "loading", loadingIcon: "loadingIcon", style: "style", styleClass: "styleClass", badgeClass: "badgeClass", ariaLabel: "ariaLabel" }, outputs: { onClick: "onClick", onFocus: "onFocus", onBlur: "onBlur" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <button
            [attr.type]="type"
            [attr.aria-label]="ariaLabel"
            [class]="styleClass"
            [ngStyle]="style"
            [disabled]="disabled || loading"
            [ngClass]="{
                'p-button p-component': true,
                'p-button-icon-only': icon && !label,
                'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label,
                'p-disabled': this.disabled || this.loading,
                'p-button-loading': this.loading,
                'p-button-loading-label-only': this.loading && !this.icon && this.label
            }"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <span
                [ngClass]="{
                    'p-button-icon': true,
                    'p-button-icon-left': iconPos === 'left' && label,
                    'p-button-icon-right': iconPos === 'right' && label,
                    'p-button-icon-top': iconPos === 'top' && label,
                    'p-button-icon-bottom': iconPos === 'bottom' && label
                }"
                [class]="loading ? 'p-button-loading-icon ' + loadingIcon : icon"
                *ngIf="!contentTemplate && (icon || loading)"
                [attr.aria-hidden]="true"
            ></span>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label" *ngIf="!contentTemplate && label">{{ label }}</span>
            <span [ngClass]="badgeStyleClass()" [class]="badgeClass" *ngIf="!contentTemplate && badge">{{ badge }}</span>
        </button>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Button, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-button',
                    template: `
        <button
            [attr.type]="type"
            [attr.aria-label]="ariaLabel"
            [class]="styleClass"
            [ngStyle]="style"
            [disabled]="disabled || loading"
            [ngClass]="{
                'p-button p-component': true,
                'p-button-icon-only': icon && !label,
                'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label,
                'p-disabled': this.disabled || this.loading,
                'p-button-loading': this.loading,
                'p-button-loading-label-only': this.loading && !this.icon && this.label
            }"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <span
                [ngClass]="{
                    'p-button-icon': true,
                    'p-button-icon-left': iconPos === 'left' && label,
                    'p-button-icon-right': iconPos === 'right' && label,
                    'p-button-icon-top': iconPos === 'top' && label,
                    'p-button-icon-bottom': iconPos === 'bottom' && label
                }"
                [class]="loading ? 'p-button-loading-icon ' + loadingIcon : icon"
                *ngIf="!contentTemplate && (icon || loading)"
                [attr.aria-hidden]="true"
            ></span>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label" *ngIf="!contentTemplate && label">{{ label }}</span>
            <span [ngClass]="badgeStyleClass()" [class]="badgeClass" *ngIf="!contentTemplate && badge">{{ badge }}</span>
        </button>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], propDecorators: { type: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], icon: [{
                type: Input
            }], badge: [{
                type: Input
            }], label: [{
                type: Input
            }], disabled: [{
                type: Input
            }], loading: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], badgeClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], onClick: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }] } });
class ButtonModule {
}
ButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.4", ngImport: i0, type: ButtonModule, declarations: [ButtonDirective, Button], imports: [CommonModule, RippleModule], exports: [ButtonDirective, Button] });
ButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ButtonModule, imports: [CommonModule, RippleModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [ButtonDirective, Button],
                    declarations: [ButtonDirective, Button]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Button, ButtonDirective, ButtonModule };
//# sourceMappingURL=primeng-button.mjs.map
//# sourceMappingURL=primeng-button.mjs.map
