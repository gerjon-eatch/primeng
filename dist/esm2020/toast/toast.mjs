import { NgModule, Component, Input, Output, ViewChild, EventEmitter, ContentChildren, ChangeDetectionStrategy, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { ObjectUtils, UniqueComponentId } from 'primeng/utils';
import { RippleModule } from 'primeng/ripple';
import { trigger, state, style, transition, animate, query, animateChild } from '@angular/animations';
import { ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
import * as i3 from "primeng/api";
export class ToastItem {
    constructor(zone) {
        this.zone = zone;
        this.onClose = new EventEmitter();
    }
    ngAfterViewInit() {
        this.initTimeout();
    }
    initTimeout() {
        if (!this.message.sticky) {
            this.zone.runOutsideAngular(() => {
                this.timeout = setTimeout(() => {
                    this.onClose.emit({
                        index: this.index,
                        message: this.message
                    });
                }, this.message.life || 3000);
            });
        }
    }
    clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
    onMouseEnter() {
        this.clearTimeout();
    }
    onMouseLeave() {
        this.initTimeout();
    }
    onCloseIconClick(event) {
        this.clearTimeout();
        this.onClose.emit({
            index: this.index,
            message: this.message
        });
        event.preventDefault();
    }
    ngOnDestroy() {
        this.clearTimeout();
    }
}
ToastItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ToastItem, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
ToastItem.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: ToastItem, selector: "p-toastItem", inputs: { message: "message", index: "index", template: "template", showTransformOptions: "showTransformOptions", hideTransformOptions: "hideTransformOptions", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onClose: "onClose" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div
            #container
            [attr.id]="message.id"
            [class]="message.styleClass"
            [ngClass]="['p-toast-message-' + message.severity, 'p-toast-message']"
            [@messageState]="{ value: 'visible', params: { showTransformParams: showTransformOptions, hideTransformParams: hideTransformOptions, showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
            (mouseenter)="onMouseEnter()"
            (mouseleave)="onMouseLeave()"
        >
            <div class="p-toast-message-content" role="alert" aria-live="assertive" aria-atomic="true" [ngClass]="message.contentStyleClass">
                <ng-container *ngIf="!template">
                    <span
                        [class]="'p-toast-message-icon pi' + (message.icon ? ' ' + message.icon : '')"
                        [ngClass]="{ 'pi-info-circle': message.severity == 'info', 'pi-exclamation-triangle': message.severity == 'warn', 'pi-times-circle': message.severity == 'error', 'pi-check': message.severity == 'success' }"
                    ></span>
                    <div class="p-toast-message-text">
                        <div class="p-toast-summary">{{ message.summary }}</div>
                        <div class="p-toast-detail">{{ message.detail }}</div>
                    </div>
                </ng-container>
                <ng-container *ngTemplateOutlet="template; context: { $implicit: message }"></ng-container>
                <button type="button" class="p-toast-icon-close p-link" (click)="onCloseIconClick($event)" (keydown.enter)="onCloseIconClick($event)" *ngIf="message.closable !== false" pRipple>
                    <span class="p-toast-icon-close-icon pi pi-times"></span>
                </button>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], animations: [
        trigger('messageState', [
            state('visible', style({
                transform: 'translateY(0)',
                opacity: 1
            })),
            transition('void => *', [style({ transform: '{{showTransformParams}}', opacity: 0 }), animate('{{showTransitionParams}}')]),
            transition('* => void', [
                animate('{{hideTransitionParams}}', style({
                    height: 0,
                    opacity: 0,
                    transform: '{{hideTransformParams}}'
                }))
            ])
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ToastItem, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-toastItem',
                    template: `
        <div
            #container
            [attr.id]="message.id"
            [class]="message.styleClass"
            [ngClass]="['p-toast-message-' + message.severity, 'p-toast-message']"
            [@messageState]="{ value: 'visible', params: { showTransformParams: showTransformOptions, hideTransformParams: hideTransformOptions, showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
            (mouseenter)="onMouseEnter()"
            (mouseleave)="onMouseLeave()"
        >
            <div class="p-toast-message-content" role="alert" aria-live="assertive" aria-atomic="true" [ngClass]="message.contentStyleClass">
                <ng-container *ngIf="!template">
                    <span
                        [class]="'p-toast-message-icon pi' + (message.icon ? ' ' + message.icon : '')"
                        [ngClass]="{ 'pi-info-circle': message.severity == 'info', 'pi-exclamation-triangle': message.severity == 'warn', 'pi-times-circle': message.severity == 'error', 'pi-check': message.severity == 'success' }"
                    ></span>
                    <div class="p-toast-message-text">
                        <div class="p-toast-summary">{{ message.summary }}</div>
                        <div class="p-toast-detail">{{ message.detail }}</div>
                    </div>
                </ng-container>
                <ng-container *ngTemplateOutlet="template; context: { $implicit: message }"></ng-container>
                <button type="button" class="p-toast-icon-close p-link" (click)="onCloseIconClick($event)" (keydown.enter)="onCloseIconClick($event)" *ngIf="message.closable !== false" pRipple>
                    <span class="p-toast-icon-close-icon pi pi-times"></span>
                </button>
            </div>
        </div>
    `,
                    animations: [
                        trigger('messageState', [
                            state('visible', style({
                                transform: 'translateY(0)',
                                opacity: 1
                            })),
                            transition('void => *', [style({ transform: '{{showTransformParams}}', opacity: 0 }), animate('{{showTransitionParams}}')]),
                            transition('* => void', [
                                animate('{{hideTransitionParams}}', style({
                                    height: 0,
                                    opacity: 0,
                                    transform: '{{hideTransformParams}}'
                                }))
                            ])
                        ])
                    ],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; }, propDecorators: { message: [{
                type: Input
            }], index: [{
                type: Input
            }], template: [{
                type: Input
            }], showTransformOptions: [{
                type: Input
            }], hideTransformOptions: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], onClose: [{
                type: Output
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }] } });
export class Toast {
    constructor(document, renderer, messageService, cd, config) {
        this.document = document;
        this.renderer = renderer;
        this.messageService = messageService;
        this.cd = cd;
        this.config = config;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.position = 'top-right';
        this.preventOpenDuplicates = false;
        this.preventDuplicates = false;
        this.showTransformOptions = 'translateY(100%)';
        this.hideTransformOptions = 'translateY(-100%)';
        this.showTransitionOptions = '300ms ease-out';
        this.hideTransitionOptions = '250ms ease-in';
        this.onClose = new EventEmitter();
        this.id = UniqueComponentId();
    }
    ngOnInit() {
        this.messageSubscription = this.messageService.messageObserver.subscribe((messages) => {
            if (messages) {
                if (Array.isArray(messages)) {
                    const filteredMessages = messages.filter((m) => this.canAdd(m));
                    this.add(filteredMessages);
                }
                else if (this.canAdd(messages)) {
                    this.add([messages]);
                }
            }
        });
        this.clearSubscription = this.messageService.clearObserver.subscribe((key) => {
            if (key) {
                if (this.key === key) {
                    this.messages = null;
                }
            }
            else {
                this.messages = null;
            }
            this.cd.markForCheck();
        });
    }
    ngAfterViewInit() {
        if (this.breakpoints) {
            this.createStyle();
        }
    }
    add(messages) {
        this.messages = this.messages ? [...this.messages, ...messages] : [...messages];
        if (this.preventDuplicates) {
            this.messagesArchieve = this.messagesArchieve ? [...this.messagesArchieve, ...messages] : [...messages];
        }
        this.cd.markForCheck();
    }
    canAdd(message) {
        let allow = this.key === message.key;
        if (allow && this.preventOpenDuplicates) {
            allow = !this.containsMessage(this.messages, message);
        }
        if (allow && this.preventDuplicates) {
            allow = !this.containsMessage(this.messagesArchieve, message);
        }
        return allow;
    }
    containsMessage(collection, message) {
        if (!collection) {
            return false;
        }
        return (collection.find((m) => {
            return m.summary === message.summary && m.detail == message.detail && m.severity === message.severity;
        }) != null);
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'message':
                    this.template = item.template;
                    break;
                default:
                    this.template = item.template;
                    break;
            }
        });
    }
    onMessageClose(event) {
        this.messages.splice(event.index, 1);
        this.onClose.emit({
            message: event.message
        });
        this.cd.detectChanges();
    }
    onAnimationStart(event) {
        if (event.fromState === 'void') {
            this.renderer.setAttribute(this.containerViewChild.nativeElement, this.id, '');
            if (this.autoZIndex && this.containerViewChild.nativeElement.style.zIndex === '') {
                ZIndexUtils.set('modal', this.containerViewChild.nativeElement, this.baseZIndex || this.config.zIndex.modal);
            }
        }
    }
    onAnimationEnd(event) {
        if (event.toState === 'void') {
            if (this.autoZIndex && ObjectUtils.isEmpty(this.messages)) {
                ZIndexUtils.clear(this.containerViewChild.nativeElement);
            }
        }
    }
    createStyle() {
        if (!this.styleElement) {
            this.styleElement = this.renderer.createElement('style');
            this.styleElement.type = 'text/css';
            this.renderer.appendChild(this.document.head, this.styleElement);
            let innerHTML = '';
            for (let breakpoint in this.breakpoints) {
                let breakpointStyle = '';
                for (let styleProp in this.breakpoints[breakpoint]) {
                    breakpointStyle += styleProp + ':' + this.breakpoints[breakpoint][styleProp] + ' !important;';
                }
                innerHTML += `
                    @media screen and (max-width: ${breakpoint}) {
                        .p-toast[${this.id}] {
                           ${breakpointStyle}
                        }
                    }
                `;
            }
            this.styleElement.textContent = innerHTML;
        }
    }
    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }
    ngOnDestroy() {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.containerViewChild && this.autoZIndex) {
            ZIndexUtils.clear(this.containerViewChild.nativeElement);
        }
        if (this.clearSubscription) {
            this.clearSubscription.unsubscribe();
        }
        this.destroyStyle();
    }
}
Toast.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Toast, deps: [{ token: DOCUMENT }, { token: i0.Renderer2 }, { token: i3.MessageService }, { token: i0.ChangeDetectorRef }, { token: i3.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
Toast.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: Toast, selector: "p-toast", inputs: { key: "key", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", style: "style", styleClass: "styleClass", position: "position", preventOpenDuplicates: "preventOpenDuplicates", preventDuplicates: "preventDuplicates", showTransformOptions: "showTransformOptions", hideTransformOptions: "hideTransformOptions", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", breakpoints: "breakpoints" }, outputs: { onClose: "onClose" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="'p-toast p-component p-toast-' + position" [ngStyle]="style" [class]="styleClass">
            <p-toastItem
                *ngFor="let msg of messages; let i = index"
                [message]="msg"
                [index]="i"
                (onClose)="onMessageClose($event)"
                [template]="template"
                @toastAnimation
                (@toastAnimation.start)="onAnimationStart($event)"
                (@toastAnimation.done)="onAnimationEnd($event)"
                [showTransformOptions]="showTransformOptions"
                [hideTransformOptions]="hideTransformOptions"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
            ></p-toastItem>
        </div>
    `, isInline: true, styles: [".p-toast{position:fixed;width:25rem}.p-toast-message{overflow:hidden}.p-toast-message-content{display:flex;align-items:flex-start}.p-toast-message-text{flex:1 1 auto}.p-toast-top-right{top:20px;right:20px}.p-toast-top-left{top:20px;left:20px}.p-toast-bottom-left{bottom:20px;left:20px}.p-toast-bottom-right{bottom:20px;right:20px}.p-toast-top-center{top:20px;left:50%;transform:translate(-50%)}.p-toast-bottom-center{bottom:20px;left:50%;transform:translate(-50%)}.p-toast-center{left:50%;top:50%;min-width:20vw;transform:translate(-50%,-50%)}.p-toast-icon-close{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-toast-icon-close.p-link{cursor:pointer}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: ToastItem, selector: "p-toastItem", inputs: ["message", "index", "template", "showTransformOptions", "hideTransformOptions", "showTransitionOptions", "hideTransitionOptions"], outputs: ["onClose"] }], animations: [trigger('toastAnimation', [transition(':enter, :leave', [query('@*', animateChild())])])], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Toast, decorators: [{
            type: Component,
            args: [{ selector: 'p-toast', template: `
        <div #container [ngClass]="'p-toast p-component p-toast-' + position" [ngStyle]="style" [class]="styleClass">
            <p-toastItem
                *ngFor="let msg of messages; let i = index"
                [message]="msg"
                [index]="i"
                (onClose)="onMessageClose($event)"
                [template]="template"
                @toastAnimation
                (@toastAnimation.start)="onAnimationStart($event)"
                (@toastAnimation.done)="onAnimationEnd($event)"
                [showTransformOptions]="showTransformOptions"
                [hideTransformOptions]="hideTransformOptions"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
            ></p-toastItem>
        </div>
    `, animations: [trigger('toastAnimation', [transition(':enter, :leave', [query('@*', animateChild())])])], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-toast{position:fixed;width:25rem}.p-toast-message{overflow:hidden}.p-toast-message-content{display:flex;align-items:flex-start}.p-toast-message-text{flex:1 1 auto}.p-toast-top-right{top:20px;right:20px}.p-toast-top-left{top:20px;left:20px}.p-toast-bottom-left{bottom:20px;left:20px}.p-toast-bottom-right{bottom:20px;right:20px}.p-toast-top-center{top:20px;left:50%;transform:translate(-50%)}.p-toast-bottom-center{bottom:20px;left:50%;transform:translate(-50%)}.p-toast-center{left:50%;top:50%;min-width:20vw;transform:translate(-50%,-50%)}.p-toast-icon-close{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-toast-icon-close.p-link{cursor:pointer}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }, { type: i3.MessageService }, { type: i0.ChangeDetectorRef }, { type: i3.PrimeNGConfig }]; }, propDecorators: { key: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], position: [{
                type: Input
            }], preventOpenDuplicates: [{
                type: Input
            }], preventDuplicates: [{
                type: Input
            }], showTransformOptions: [{
                type: Input
            }], hideTransformOptions: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], breakpoints: [{
                type: Input
            }], onClose: [{
                type: Output
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class ToastModule {
}
ToastModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ToastModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ToastModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.4", ngImport: i0, type: ToastModule, declarations: [Toast, ToastItem], imports: [CommonModule, RippleModule], exports: [Toast, SharedModule] });
ToastModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ToastModule, imports: [CommonModule, RippleModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ToastModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [Toast, SharedModule],
                    declarations: [Toast, ToastItem]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvdG9hc3QvdG9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFFBQVEsRUFDUixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFNTixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFHZix1QkFBdUIsRUFHdkIsaUJBQWlCLEVBRWpCLE1BQU0sRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3pELE9BQU8sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRTFELE9BQU8sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQWtCLE1BQU0scUJBQXFCLENBQUM7QUFDdEgsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUE0RDVDLE1BQU0sT0FBTyxTQUFTO0lBcUJsQixZQUFvQixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQU50QixZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFNdkIsQ0FBQztJQUVwQyxlQUFlO1FBQ1gsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO2dCQUM3QixJQUFJLENBQUMsT0FB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RSxZQUFZLENBQUM7b0JBQzlCLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7aUJBQ25DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBOZ01vZHVsZSxcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIE9uSW5pdCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgT25EZXN0cm95LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgUXVlcnlMaXN0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIE5nWm9uZSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgICBSZW5kZXJlcjIsXG4gICAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBNZXNzYWdlLCBQcmltZU5HQ29uZmlnIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IFByaW1lVGVtcGxhdGUsIFNoYXJlZE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMsIFVuaXF1ZUNvbXBvbmVudElkIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBSaXBwbGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRyaWdnZXIsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgYW5pbWF0ZSwgcXVlcnksIGFuaW1hdGVDaGlsZCwgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10b2FzdEl0ZW0nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXZcbiAgICAgICAgICAgICNjb250YWluZXJcbiAgICAgICAgICAgIFthdHRyLmlkXT1cIm1lc3NhZ2UuaWRcIlxuICAgICAgICAgICAgW2NsYXNzXT1cIm1lc3NhZ2Uuc3R5bGVDbGFzc1wiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJbJ3AtdG9hc3QtbWVzc2FnZS0nICsgbWVzc2FnZS5zZXZlcml0eSwgJ3AtdG9hc3QtbWVzc2FnZSddXCJcbiAgICAgICAgICAgIFtAbWVzc2FnZVN0YXRlXT1cInsgdmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7IHNob3dUcmFuc2Zvcm1QYXJhbXM6IHNob3dUcmFuc2Zvcm1PcHRpb25zLCBoaWRlVHJhbnNmb3JtUGFyYW1zOiBoaWRlVHJhbnNmb3JtT3B0aW9ucywgc2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9ucyB9IH1cIlxuICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwib25Nb3VzZUVudGVyKClcIlxuICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwib25Nb3VzZUxlYXZlKClcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10b2FzdC1tZXNzYWdlLWNvbnRlbnRcIiByb2xlPVwiYWxlcnRcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIiBhcmlhLWF0b21pYz1cInRydWVcIiBbbmdDbGFzc109XCJtZXNzYWdlLmNvbnRlbnRTdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF0ZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzXT1cIidwLXRvYXN0LW1lc3NhZ2UtaWNvbiBwaScgKyAobWVzc2FnZS5pY29uID8gJyAnICsgbWVzc2FnZS5pY29uIDogJycpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3BpLWluZm8tY2lyY2xlJzogbWVzc2FnZS5zZXZlcml0eSA9PSAnaW5mbycsICdwaS1leGNsYW1hdGlvbi10cmlhbmdsZSc6IG1lc3NhZ2Uuc2V2ZXJpdHkgPT0gJ3dhcm4nLCAncGktdGltZXMtY2lyY2xlJzogbWVzc2FnZS5zZXZlcml0eSA9PSAnZXJyb3InLCAncGktY2hlY2snOiBtZXNzYWdlLnNldmVyaXR5ID09ICdzdWNjZXNzJyB9XCJcbiAgICAgICAgICAgICAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtdG9hc3QtbWVzc2FnZS10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10b2FzdC1zdW1tYXJ5XCI+e3sgbWVzc2FnZS5zdW1tYXJ5IH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10b2FzdC1kZXRhaWxcIj57eyBtZXNzYWdlLmRldGFpbCB9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBtZXNzYWdlIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInAtdG9hc3QtaWNvbi1jbG9zZSBwLWxpbmtcIiAoY2xpY2spPVwib25DbG9zZUljb25DbGljaygkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwib25DbG9zZUljb25DbGljaygkZXZlbnQpXCIgKm5nSWY9XCJtZXNzYWdlLmNsb3NhYmxlICE9PSBmYWxzZVwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10b2FzdC1pY29uLWNsb3NlLWljb24gcGkgcGktdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ21lc3NhZ2VTdGF0ZScsIFtcbiAgICAgICAgICAgIHN0YXRlKFxuICAgICAgICAgICAgICAgICd2aXNpYmxlJyxcbiAgICAgICAgICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBbc3R5bGUoeyB0cmFuc2Zvcm06ICd7e3Nob3dUcmFuc2Zvcm1QYXJhbXN9fScsIG9wYWNpdHk6IDAgfSksIGFuaW1hdGUoJ3t7c2hvd1RyYW5zaXRpb25QYXJhbXN9fScpXSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBbXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgJ3t7aGlkZVRyYW5zaXRpb25QYXJhbXN9fScsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd7e2hpZGVUcmFuc2Zvcm1QYXJhbXN9fSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgIF0sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVG9hc3RJdGVtIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBtZXNzYWdlOiBNZXNzYWdlO1xuXG4gICAgQElucHV0KCkgaW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQElucHV0KCkgc2hvd1RyYW5zZm9ybU9wdGlvbnM6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGhpZGVUcmFuc2Zvcm1PcHRpb25zOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzaG93VHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGhpZGVUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nO1xuXG4gICAgQE91dHB1dCgpIG9uQ2xvc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGFpbmVyJykgY29udGFpbmVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgdGltZW91dDogYW55O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdFRpbWVvdXQoKTtcbiAgICB9XG5cbiAgICBpbml0VGltZW91dCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1lc3NhZ2Uuc3RpY2t5KSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLm1lc3NhZ2UubGlmZSB8fCAzMDAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KCkge1xuICAgICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlRW50ZXIoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICB0aGlzLmluaXRUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgb25DbG9zZUljb25DbGljayhldmVudCkge1xuICAgICAgICB0aGlzLmNsZWFyVGltZW91dCgpO1xuXG4gICAgICAgIHRoaXMub25DbG9zZS5lbWl0KHtcbiAgICAgICAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdG9hc3QnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgI2NvbnRhaW5lciBbbmdDbGFzc109XCIncC10b2FzdCBwLWNvbXBvbmVudCBwLXRvYXN0LScgKyBwb3NpdGlvblwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxwLXRvYXN0SXRlbVxuICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBtc2cgb2YgbWVzc2FnZXM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICAgICAgICAgIFttZXNzYWdlXT1cIm1zZ1wiXG4gICAgICAgICAgICAgICAgW2luZGV4XT1cImlcIlxuICAgICAgICAgICAgICAgIChvbkNsb3NlKT1cIm9uTWVzc2FnZUNsb3NlKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFt0ZW1wbGF0ZV09XCJ0ZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgQHRvYXN0QW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgKEB0b2FzdEFuaW1hdGlvbi5zdGFydCk9XCJvbkFuaW1hdGlvblN0YXJ0KCRldmVudClcIlxuICAgICAgICAgICAgICAgIChAdG9hc3RBbmltYXRpb24uZG9uZSk9XCJvbkFuaW1hdGlvbkVuZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICBbc2hvd1RyYW5zZm9ybU9wdGlvbnNdPVwic2hvd1RyYW5zZm9ybU9wdGlvbnNcIlxuICAgICAgICAgICAgICAgIFtoaWRlVHJhbnNmb3JtT3B0aW9uc109XCJoaWRlVHJhbnNmb3JtT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgW3Nob3dUcmFuc2l0aW9uT3B0aW9uc109XCJzaG93VHJhbnNpdGlvbk9wdGlvbnNcIlxuICAgICAgICAgICAgICAgIFtoaWRlVHJhbnNpdGlvbk9wdGlvbnNdPVwiaGlkZVRyYW5zaXRpb25PcHRpb25zXCJcbiAgICAgICAgICAgID48L3AtdG9hc3RJdGVtPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCd0b2FzdEFuaW1hdGlvbicsIFt0cmFuc2l0aW9uKCc6ZW50ZXIsIDpsZWF2ZScsIFtxdWVyeSgnQConLCBhbmltYXRlQ2hpbGQoKSldKV0pXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3RvYXN0LmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUb2FzdCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBrZXk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGF1dG9aSW5kZXg6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYmFzZVpJbmRleDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwb3NpdGlvbjogc3RyaW5nID0gJ3RvcC1yaWdodCc7XG5cbiAgICBASW5wdXQoKSBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIHByZXZlbnREdXBsaWNhdGVzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBzaG93VHJhbnNmb3JtT3B0aW9uczogc3RyaW5nID0gJ3RyYW5zbGF0ZVkoMTAwJSknO1xuXG4gICAgQElucHV0KCkgaGlkZVRyYW5zZm9ybU9wdGlvbnM6IHN0cmluZyA9ICd0cmFuc2xhdGVZKC0xMDAlKSc7XG5cbiAgICBASW5wdXQoKSBzaG93VHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICczMDBtcyBlYXNlLW91dCc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcyNTBtcyBlYXNlLWluJztcblxuICAgIEBJbnB1dCgpIGJyZWFrcG9pbnRzOiBhbnk7XG5cbiAgICBAT3V0cHV0KCkgb25DbG9zZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAVmlld0NoaWxkKCdjb250YWluZXInKSBjb250YWluZXJWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBtZXNzYWdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjbGVhclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgbWVzc2FnZXM6IE1lc3NhZ2VbXTtcblxuICAgIG1lc3NhZ2VzQXJjaGlldmU6IE1lc3NhZ2VbXTtcblxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHB1YmxpYyBjb25maWc6IFByaW1lTkdDb25maWcpIHt9XG5cbiAgICBzdHlsZUVsZW1lbnQ6IGFueTtcblxuICAgIGlkOiBzdHJpbmcgPSBVbmlxdWVDb21wb25lbnRJZCgpO1xuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZVN1YnNjcmlwdGlvbiA9IHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZU9ic2VydmVyLnN1YnNjcmliZSgobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlcykge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZE1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiB0aGlzLmNhbkFkZChtKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKGZpbHRlcmVkTWVzc2FnZXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jYW5BZGQobWVzc2FnZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKFttZXNzYWdlc10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jbGVhclN1YnNjcmlwdGlvbiA9IHRoaXMubWVzc2FnZVNlcnZpY2UuY2xlYXJPYnNlcnZlci5zdWJzY3JpYmUoKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmtleSA9PT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYnJlYWtwb2ludHMpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZChtZXNzYWdlczogTWVzc2FnZVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzID8gWy4uLnRoaXMubWVzc2FnZXMsIC4uLm1lc3NhZ2VzXSA6IFsuLi5tZXNzYWdlc107XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmVudER1cGxpY2F0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZXNBcmNoaWV2ZSA9IHRoaXMubWVzc2FnZXNBcmNoaWV2ZSA/IFsuLi50aGlzLm1lc3NhZ2VzQXJjaGlldmUsIC4uLm1lc3NhZ2VzXSA6IFsuLi5tZXNzYWdlc107XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGNhbkFkZChtZXNzYWdlOiBNZXNzYWdlKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBhbGxvdyA9IHRoaXMua2V5ID09PSBtZXNzYWdlLmtleTtcblxuICAgICAgICBpZiAoYWxsb3cgJiYgdGhpcy5wcmV2ZW50T3BlbkR1cGxpY2F0ZXMpIHtcbiAgICAgICAgICAgIGFsbG93ID0gIXRoaXMuY29udGFpbnNNZXNzYWdlKHRoaXMubWVzc2FnZXMsIG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFsbG93ICYmIHRoaXMucHJldmVudER1cGxpY2F0ZXMpIHtcbiAgICAgICAgICAgIGFsbG93ID0gIXRoaXMuY29udGFpbnNNZXNzYWdlKHRoaXMubWVzc2FnZXNBcmNoaWV2ZSwgbWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsb3c7XG4gICAgfVxuXG4gICAgY29udGFpbnNNZXNzYWdlKGNvbGxlY3Rpb246IE1lc3NhZ2VbXSwgbWVzc2FnZTogTWVzc2FnZSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoKG0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbS5zdW1tYXJ5ID09PSBtZXNzYWdlLnN1bW1hcnkgJiYgbS5kZXRhaWwgPT0gbWVzc2FnZS5kZXRhaWwgJiYgbS5zZXZlcml0eSA9PT0gbWVzc2FnZS5zZXZlcml0eTtcbiAgICAgICAgICAgIH0pICE9IG51bGxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdtZXNzYWdlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbk1lc3NhZ2VDbG9zZShldmVudCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnNwbGljZShldmVudC5pbmRleCwgMSk7XG5cbiAgICAgICAgdGhpcy5vbkNsb3NlLmVtaXQoe1xuICAgICAgICAgICAgbWVzc2FnZTogZXZlbnQubWVzc2FnZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZnJvbVN0YXRlID09PSAndm9pZCcpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsIHRoaXMuaWQsICcnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9aSW5kZXggJiYgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS56SW5kZXggPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgWkluZGV4VXRpbHMuc2V0KCdtb2RhbCcsIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsIHRoaXMuYmFzZVpJbmRleCB8fCB0aGlzLmNvbmZpZy56SW5kZXgubW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BbmltYXRpb25FbmQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50b1N0YXRlID09PSAndm9pZCcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9aSW5kZXggJiYgT2JqZWN0VXRpbHMuaXNFbXB0eSh0aGlzLm1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICAgIFpJbmRleFV0aWxzLmNsZWFyKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlU3R5bGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5zdHlsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVFbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZG9jdW1lbnQuaGVhZCwgdGhpcy5zdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgbGV0IGlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgZm9yIChsZXQgYnJlYWtwb2ludCBpbiB0aGlzLmJyZWFrcG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJyZWFrcG9pbnRTdHlsZSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHN0eWxlUHJvcCBpbiB0aGlzLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnRTdHlsZSArPSBzdHlsZVByb3AgKyAnOicgKyB0aGlzLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdW3N0eWxlUHJvcF0gKyAnICFpbXBvcnRhbnQ7JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5uZXJIVE1MICs9IGBcbiAgICAgICAgICAgICAgICAgICAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogJHticmVha3BvaW50fSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLnAtdG9hc3RbJHt0aGlzLmlkfV0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJHticmVha3BvaW50U3R5bGV9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0eWxlRWxlbWVudC50ZXh0Q29udGVudCA9IGlubmVySFRNTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlc3Ryb3lTdHlsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMuZG9jdW1lbnQuaGVhZCwgdGhpcy5zdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyVmlld0NoaWxkICYmIHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jbGVhclN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jbGVhclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXN0cm95U3R5bGUoKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUmlwcGxlTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbVG9hc3QsIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbVG9hc3QsIFRvYXN0SXRlbV1cbn0pXG5leHBvcnQgY2xhc3MgVG9hc3RNb2R1bGUge31cbiJdfQ==