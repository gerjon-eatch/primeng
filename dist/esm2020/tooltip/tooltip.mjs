import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Directive, HostListener, Inject, Input, NgModule, PLATFORM_ID } from '@angular/core';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
export class Tooltip {
    constructor(platformId, el, zone, config, renderer, changeDetector) {
        this.platformId = platformId;
        this.el = el;
        this.zone = zone;
        this.config = config;
        this.renderer = renderer;
        this.changeDetector = changeDetector;
        this.escape = true;
        this.autoHide = true;
        this.fitContent = true;
        this.hideOnEscape = true;
        this._tooltipOptions = {
            tooltipPosition: 'right',
            tooltipEvent: 'hover',
            appendTo: 'body',
            tooltipZIndex: 'auto',
            escape: true,
            positionTop: 0,
            positionLeft: 0,
            autoHide: true,
            hideOnEscape: false
        };
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = val;
        this.deactivate();
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                if (this.getOption('tooltipEvent') === 'hover') {
                    this.mouseEnterListener = this.onMouseEnter.bind(this);
                    this.mouseLeaveListener = this.onMouseLeave.bind(this);
                    this.clickListener = this.onInputClick.bind(this);
                    this.el.nativeElement.addEventListener('mouseenter', this.mouseEnterListener);
                    this.el.nativeElement.addEventListener('click', this.clickListener);
                    this.el.nativeElement.addEventListener('mouseleave', this.mouseLeaveListener);
                }
                else if (this.getOption('tooltipEvent') === 'focus') {
                    this.focusListener = this.onFocus.bind(this);
                    this.blurListener = this.onBlur.bind(this);
                    let target = this.getTarget(this.el.nativeElement);
                    target.addEventListener('focus', this.focusListener);
                    target.addEventListener('blur', this.blurListener);
                }
            });
        }
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.tooltipPosition) {
            this.setOption({ tooltipPosition: simpleChange.tooltipPosition.currentValue });
        }
        if (simpleChange.tooltipEvent) {
            this.setOption({ tooltipEvent: simpleChange.tooltipEvent.currentValue });
        }
        if (simpleChange.appendTo) {
            this.setOption({ appendTo: simpleChange.appendTo.currentValue });
        }
        if (simpleChange.positionStyle) {
            this.setOption({ positionStyle: simpleChange.positionStyle.currentValue });
        }
        if (simpleChange.tooltipStyleClass) {
            this.setOption({ tooltipStyleClass: simpleChange.tooltipStyleClass.currentValue });
        }
        if (simpleChange.tooltipZIndex) {
            this.setOption({ tooltipZIndex: simpleChange.tooltipZIndex.currentValue });
        }
        if (simpleChange.escape) {
            this.setOption({ escape: simpleChange.escape.currentValue });
        }
        if (simpleChange.showDelay) {
            this.setOption({ showDelay: simpleChange.showDelay.currentValue });
        }
        if (simpleChange.hideDelay) {
            this.setOption({ hideDelay: simpleChange.hideDelay.currentValue });
        }
        if (simpleChange.life) {
            this.setOption({ life: simpleChange.life.currentValue });
        }
        if (simpleChange.positionTop) {
            this.setOption({ positionTop: simpleChange.positionTop.currentValue });
        }
        if (simpleChange.positionLeft) {
            this.setOption({ positionLeft: simpleChange.positionLeft.currentValue });
        }
        if (simpleChange.disabled) {
            this.setOption({ disabled: simpleChange.disabled.currentValue });
        }
        if (simpleChange.text) {
            this.setOption({ tooltipLabel: simpleChange.text.currentValue });
            if (this.active) {
                if (simpleChange.text.currentValue) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    }
                    else {
                        this.show();
                    }
                }
                else {
                    this.hide();
                }
            }
        }
        if (simpleChange.autoHide) {
            this.setOption({ autoHide: simpleChange.autoHide.currentValue });
        }
        if (simpleChange.tooltipOptions) {
            this._tooltipOptions = { ...this._tooltipOptions, ...simpleChange.tooltipOptions.currentValue };
            this.deactivate();
            if (this.active) {
                if (this.getOption('tooltipLabel')) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    }
                    else {
                        this.show();
                    }
                }
                else {
                    this.hide();
                }
            }
        }
    }
    isAutoHide() {
        return this.getOption('autoHide');
    }
    onMouseEnter(e) {
        if (!this.container && !this.showTimeout) {
            this.activate();
        }
    }
    onMouseLeave(e) {
        if (!this.isAutoHide()) {
            const valid = DomHandler.hasClass(e.toElement, 'p-tooltip') || DomHandler.hasClass(e.toElement, 'p-tooltip-arrow') || DomHandler.hasClass(e.toElement, 'p-tooltip-text') || DomHandler.hasClass(e.relatedTarget, 'p-tooltip');
            !valid && this.deactivate();
        }
        else {
            this.deactivate();
        }
    }
    onFocus(e) {
        this.activate();
    }
    onBlur(e) {
        this.deactivate();
    }
    onInputClick(e) {
        this.deactivate();
    }
    onPressEscape() {
        if (this.hideOnEscape) {
            this.deactivate();
        }
    }
    activate() {
        this.active = true;
        this.clearHideTimeout();
        if (this.getOption('showDelay'))
            this.showTimeout = setTimeout(() => {
                this.show();
            }, this.getOption('showDelay'));
        else
            this.show();
        if (this.getOption('life')) {
            let duration = this.getOption('showDelay') ? this.getOption('life') + this.getOption('showDelay') : this.getOption('life');
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, duration);
        }
    }
    deactivate() {
        this.active = false;
        this.clearShowTimeout();
        if (this.getOption('hideDelay')) {
            this.clearHideTimeout(); //life timeout
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, this.getOption('hideDelay'));
        }
        else {
            this.hide();
        }
    }
    create() {
        if (this.container) {
            this.clearHideTimeout();
            this.remove();
        }
        this.container = document.createElement('div');
        let tooltipArrow = document.createElement('div');
        tooltipArrow.className = 'p-tooltip-arrow';
        this.container.appendChild(tooltipArrow);
        this.tooltipText = document.createElement('div');
        this.tooltipText.className = 'p-tooltip-text';
        this.updateText();
        if (this.getOption('positionStyle')) {
            this.container.style.position = this.getOption('positionStyle');
        }
        this.container.appendChild(this.tooltipText);
        if (this.getOption('appendTo') === 'body')
            document.body.appendChild(this.container);
        else if (this.getOption('appendTo') === 'target')
            DomHandler.appendChild(this.container, this.el.nativeElement);
        else
            DomHandler.appendChild(this.container, this.getOption('appendTo'));
        this.container.style.display = 'inline-block';
        if (this.fitContent) {
            this.container.style.width = 'fit-content';
        }
        if (!this.isAutoHide()) {
            this.bindContainerMouseleaveListener();
        }
    }
    bindContainerMouseleaveListener() {
        if (!this.containerMouseleaveListener) {
            const targetEl = this.container ?? this.container.nativeElement;
            this.containerMouseleaveListener = this.renderer.listen(targetEl, 'mouseleave', (e) => {
                this.deactivate();
            });
        }
    }
    unbindContainerMouseleaveListener() {
        if (this.containerMouseleaveListener) {
            this.bindContainerMouseleaveListener();
            this.containerMouseleaveListener = null;
        }
    }
    show() {
        if (!this.getOption('tooltipLabel') || this.getOption('disabled')) {
            return;
        }
        this.create();
        this.align();
        DomHandler.fadeIn(this.container, 250);
        if (this.getOption('tooltipZIndex') === 'auto')
            ZIndexUtils.set('tooltip', this.container, this.config.zIndex.tooltip);
        else
            this.container.style.zIndex = this.getOption('tooltipZIndex');
        this.bindDocumentResizeListener();
        this.bindScrollListener();
    }
    hide() {
        if (this.getOption('tooltipZIndex') === 'auto') {
            ZIndexUtils.clear(this.container);
        }
        this.remove();
    }
    updateText() {
        if (this.getOption('escape')) {
            this.tooltipText.textValue = this.getOption('tooltipLabel');
        }
        else {
            this.tooltipText.innerHTML = this.getOption('tooltipLabel');
        }
    }
    align() {
        let position = this.getOption('tooltipPosition');
        switch (position) {
            case 'top':
                this.alignTop();
                if (this.isOutOfBounds()) {
                    this.alignBottom();
                    if (this.isOutOfBounds()) {
                        this.alignRight();
                        if (this.isOutOfBounds()) {
                            this.alignLeft();
                        }
                    }
                }
                break;
            case 'bottom':
                this.alignBottom();
                if (this.isOutOfBounds()) {
                    this.alignTop();
                    if (this.isOutOfBounds()) {
                        this.alignRight();
                        if (this.isOutOfBounds()) {
                            this.alignLeft();
                        }
                    }
                }
                break;
            case 'left':
                this.alignLeft();
                if (this.isOutOfBounds()) {
                    this.alignRight();
                    if (this.isOutOfBounds()) {
                        this.alignTop();
                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;
            case 'right':
                this.alignRight();
                if (this.isOutOfBounds()) {
                    this.alignLeft();
                    if (this.isOutOfBounds()) {
                        this.alignTop();
                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;
        }
    }
    getHostOffset() {
        if (this.getOption('appendTo') === 'body' || this.getOption('appendTo') === 'target') {
            let offset = this.el.nativeElement.getBoundingClientRect();
            let targetLeft = offset.left + DomHandler.getWindowScrollLeft();
            let targetTop = offset.top + DomHandler.getWindowScrollTop();
            return { left: targetLeft, top: targetTop };
        }
        else {
            return { left: 0, top: 0 };
        }
    }
    alignRight() {
        this.preAlign('right');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + DomHandler.getOuterWidth(this.el.nativeElement);
        let top = hostOffset.top + (DomHandler.getOuterHeight(this.el.nativeElement) - DomHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignLeft() {
        this.preAlign('left');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left - DomHandler.getOuterWidth(this.container);
        let top = hostOffset.top + (DomHandler.getOuterHeight(this.el.nativeElement) - DomHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignTop() {
        this.preAlign('top');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (DomHandler.getOuterWidth(this.el.nativeElement) - DomHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top - DomHandler.getOuterHeight(this.container);
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignBottom() {
        this.preAlign('bottom');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (DomHandler.getOuterWidth(this.el.nativeElement) - DomHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top + DomHandler.getOuterHeight(this.el.nativeElement);
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    setOption(option) {
        this._tooltipOptions = { ...this._tooltipOptions, ...option };
    }
    getOption(option) {
        return this._tooltipOptions[option];
    }
    getTarget(el) {
        return DomHandler.hasClass(el, 'p-inputwrapper') ? DomHandler.findSingle(el, 'input') : el;
    }
    preAlign(position) {
        this.container.style.left = -999 + 'px';
        this.container.style.top = -999 + 'px';
        let defaultClassName = 'p-tooltip p-component p-tooltip-' + position;
        this.container.className = this.getOption('tooltipStyleClass') ? defaultClassName + ' ' + this.getOption('tooltipStyleClass') : defaultClassName;
    }
    isOutOfBounds() {
        let offset = this.container.getBoundingClientRect();
        let targetTop = offset.top;
        let targetLeft = offset.left;
        let width = DomHandler.getOuterWidth(this.container);
        let height = DomHandler.getOuterHeight(this.container);
        let viewport = DomHandler.getViewport();
        return targetLeft + width > viewport.width || targetLeft < 0 || targetTop < 0 || targetTop + height > viewport.height;
    }
    onWindowResize(e) {
        this.hide();
    }
    bindDocumentResizeListener() {
        this.zone.runOutsideAngular(() => {
            this.resizeListener = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.resizeListener);
        });
    }
    unbindDocumentResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                if (this.container) {
                    this.hide();
                }
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    unbindEvents() {
        if (this.getOption('tooltipEvent') === 'hover') {
            this.el.nativeElement.removeEventListener('mouseenter', this.mouseEnterListener);
            this.el.nativeElement.removeEventListener('mouseleave', this.mouseLeaveListener);
            this.el.nativeElement.removeEventListener('click', this.clickListener);
        }
        else if (this.getOption('tooltipEvent') === 'focus') {
            let target = this.getTarget(this.el.nativeElement);
            target.removeEventListener('focus', this.focusListener);
            target.removeEventListener('blur', this.blurListener);
        }
        this.unbindDocumentResizeListener();
    }
    remove() {
        if (this.container && this.container.parentElement) {
            if (this.getOption('appendTo') === 'body')
                document.body.removeChild(this.container);
            else if (this.getOption('appendTo') === 'target')
                this.el.nativeElement.removeChild(this.container);
            else
                DomHandler.removeChild(this.container, this.getOption('appendTo'));
        }
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.unbindContainerMouseleaveListener();
        this.clearTimeouts();
        this.container = null;
        this.scrollHandler = null;
    }
    clearShowTimeout() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }
    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
    clearTimeouts() {
        this.clearShowTimeout();
        this.clearHideTimeout();
    }
    ngOnDestroy() {
        this.unbindEvents();
        if (this.container) {
            ZIndexUtils.clear(this.container);
        }
        this.remove();
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
    }
}
Tooltip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Tooltip, deps: [{ token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.PrimeNGConfig }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
Tooltip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: Tooltip, selector: "[pTooltip]", inputs: { tooltipPosition: "tooltipPosition", tooltipEvent: "tooltipEvent", appendTo: "appendTo", positionStyle: "positionStyle", tooltipStyleClass: "tooltipStyleClass", tooltipZIndex: "tooltipZIndex", escape: "escape", showDelay: "showDelay", hideDelay: "hideDelay", life: "life", positionTop: "positionTop", positionLeft: "positionLeft", autoHide: "autoHide", fitContent: "fitContent", hideOnEscape: "hideOnEscape", text: ["pTooltip", "text"], disabled: ["tooltipDisabled", "disabled"], tooltipOptions: "tooltipOptions" }, host: { listeners: { "document:keydown.escape": "onPressEscape($event)" }, classAttribute: "p-element" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Tooltip, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pTooltip]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.PrimeNGConfig }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { tooltipPosition: [{
                type: Input
            }], tooltipEvent: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], positionStyle: [{
                type: Input
            }], tooltipStyleClass: [{
                type: Input
            }], tooltipZIndex: [{
                type: Input
            }], escape: [{
                type: Input
            }], showDelay: [{
                type: Input
            }], hideDelay: [{
                type: Input
            }], life: [{
                type: Input
            }], positionTop: [{
                type: Input
            }], positionLeft: [{
                type: Input
            }], autoHide: [{
                type: Input
            }], fitContent: [{
                type: Input
            }], hideOnEscape: [{
                type: Input
            }], text: [{
                type: Input,
                args: ['pTooltip']
            }], disabled: [{
                type: Input,
                args: ['tooltipDisabled']
            }], tooltipOptions: [{
                type: Input
            }], onPressEscape: [{
                type: HostListener,
                args: ['document:keydown.escape', ['$event']]
            }] } });
export class TooltipModule {
}
TooltipModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TooltipModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.4", ngImport: i0, type: TooltipModule, declarations: [Tooltip], imports: [CommonModule], exports: [Tooltip] });
TooltipModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TooltipModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Tooltip],
                    declarations: [Tooltip]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xFLE9BQU8sRUFBb0MsU0FBUyxFQUFjLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBcUIsV0FBVyxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUV6TCxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQTJCNUMsTUFBTSxPQUFPLE9BQU87SUFxRmhCLFlBQXlDLFVBQWUsRUFBUyxFQUFjLEVBQVMsSUFBWSxFQUFTLE1BQXFCLEVBQVUsUUFBbUIsRUFBVSxjQUFpQztRQUFqSyxlQUFVLEdBQVYsVUFBVSxDQUFLO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFtQjtRQXhFak0sV0FBTSxHQUFZLElBQUksQ0FBQztRQVl2QixhQUFRLEdBQVksSUFBSSxDQUFDO1FBRXpCLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFM0IsaUJBQVksR0FBWSxJQUFJLENBQUM7UUFjdEMsb0JBQWUsR0FBbUI7WUFDOUIsZUFBZSxFQUFFLE9BQU87WUFDeEIsWUFBWSxFQUFFLE9BQU87WUFDckIsUUFBUSxFQUFFLE1BQU07WUFDaEIsYUFBYSxFQUFFLE1BQU07WUFDckIsTUFBTSxFQUFFLElBQUk7WUFDWixXQUFXLEVBQUUsQ0FBQztZQUNkLFlBQVksRUFBRSxDQUFDO1lBQ2YsUUFB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d3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdCwgSW5wdXQsIE5nTW9kdWxlLCBOZ1pvbmUsIE9uRGVzdHJveSwgUExBVEZPUk1fSUQsIFJlbmRlcmVyMiwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVOR0NvbmZpZyB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyLCBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgWkluZGV4VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBUb29sdGlwT3B0aW9ucyB7XG4gICAgdG9vbHRpcExhYmVsPzogc3RyaW5nO1xuICAgIHRvb2x0aXBQb3NpdGlvbj86IHN0cmluZztcbiAgICB0b29sdGlwRXZlbnQ/OiBzdHJpbmc7XG4gICAgYXBwZW5kVG8/OiBhbnk7XG4gICAgcG9zaXRpb25TdHlsZT86IHN0cmluZztcbiAgICB0b29sdGlwU3R5bGVDbGFzcz86IHN0cmluZztcbiAgICB0b29sdGlwWkluZGV4Pzogc3RyaW5nO1xuICAgIGVzY2FwZT86IGJvb2xlYW47XG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIHNob3dEZWxheT86IG51bWJlcjtcbiAgICBoaWRlRGVsYXk/OiBudW1iZXI7XG4gICAgcG9zaXRpb25Ub3A/OiBudW1iZXI7XG4gICAgcG9zaXRpb25MZWZ0PzogbnVtYmVyO1xuICAgIGxpZmU/OiBudW1iZXI7XG4gICAgYXV0b0hpZGU/OiBib29sZWFuO1xuICAgIGhpZGVPbkVzY2FwZT86IGJvb2xlYW47XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BUb29sdGlwXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRvb2x0aXAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIHRvb2x0aXBQb3NpdGlvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdG9vbHRpcEV2ZW50OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcHBlbmRUbzogYW55O1xuXG4gICAgQElucHV0KCkgcG9zaXRpb25TdHlsZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdG9vbHRpcFN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRvb2x0aXBaSW5kZXg6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGVzY2FwZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzaG93RGVsYXk6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGhpZGVEZWxheTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbGlmZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcG9zaXRpb25Ub3A6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHBvc2l0aW9uTGVmdDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgYXV0b0hpZGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgZml0Q29udGVudDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBoaWRlT25Fc2NhcGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCdwVG9vbHRpcCcpIHRleHQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgndG9vbHRpcERpc2FibGVkJykgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gICAgfVxuICAgIHNldCBkaXNhYmxlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWw7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHRvb2x0aXBPcHRpb25zOiBUb29sdGlwT3B0aW9ucztcblxuICAgIF90b29sdGlwT3B0aW9uczogVG9vbHRpcE9wdGlvbnMgPSB7XG4gICAgICAgIHRvb2x0aXBQb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgdG9vbHRpcEV2ZW50OiAnaG92ZXInLFxuICAgICAgICBhcHBlbmRUbzogJ2JvZHknLFxuICAgICAgICB0b29sdGlwWkluZGV4OiAnYXV0bycsXG4gICAgICAgIGVzY2FwZTogdHJ1ZSxcbiAgICAgICAgcG9zaXRpb25Ub3A6IDAsXG4gICAgICAgIHBvc2l0aW9uTGVmdDogMCxcbiAgICAgICAgYXV0b0hpZGU6IHRydWUsXG4gICAgICAgIGhpZGVPbkVzY2FwZTogZmFsc2VcbiAgICB9O1xuXG4gICAgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gICAgY29udGFpbmVyOiBhbnk7XG5cbiAgICBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICB0b29sdGlwVGV4dDogYW55O1xuXG4gICAgc2hvd1RpbWVvdXQ6IGFueTtcblxuICAgIGhpZGVUaW1lb3V0OiBhbnk7XG5cbiAgICBhY3RpdmU6IGJvb2xlYW47XG5cbiAgICBtb3VzZUVudGVyTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gICAgbW91c2VMZWF2ZUxpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGNvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgICBjbGlja0xpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGZvY3VzTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gICAgYmx1ckxpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIHNjcm9sbEhhbmRsZXI6IGFueTtcblxuICAgIHJlc2l6ZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lLCBwdWJsaWMgY29uZmlnOiBQcmltZU5HQ29uZmlnLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3Rvb2x0aXBFdmVudCcpID09PSAnaG92ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VFbnRlckxpc3RlbmVyID0gdGhpcy5vbk1vdXNlRW50ZXIuYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZUxlYXZlTGlzdGVuZXIgPSB0aGlzLm9uTW91c2VMZWF2ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWNrTGlzdGVuZXIgPSB0aGlzLm9uSW5wdXRDbGljay5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMubW91c2VFbnRlckxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGlja0xpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLm1vdXNlTGVhdmVMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdldE9wdGlvbigndG9vbHRpcEV2ZW50JykgPT09ICdmb2N1cycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb2N1c0xpc3RlbmVyID0gdGhpcy5vbkZvY3VzLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmx1ckxpc3RlbmVyID0gdGhpcy5vbkJsdXIuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5mb2N1c0xpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmJsdXJMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhzaW1wbGVDaGFuZ2U6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS50b29sdGlwUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgdG9vbHRpcFBvc2l0aW9uOiBzaW1wbGVDaGFuZ2UudG9vbHRpcFBvc2l0aW9uLmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UudG9vbHRpcEV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IHRvb2x0aXBFdmVudDogc2ltcGxlQ2hhbmdlLnRvb2x0aXBFdmVudC5jdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IGFwcGVuZFRvOiBzaW1wbGVDaGFuZ2UuYXBwZW5kVG8uY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5wb3NpdGlvblN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IHBvc2l0aW9uU3R5bGU6IHNpbXBsZUNoYW5nZS5wb3NpdGlvblN0eWxlLmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UudG9vbHRpcFN0eWxlQ2xhc3MpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgdG9vbHRpcFN0eWxlQ2xhc3M6IHNpbXBsZUNoYW5nZS50b29sdGlwU3R5bGVDbGFzcy5jdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnRvb2x0aXBaSW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgdG9vbHRpcFpJbmRleDogc2ltcGxlQ2hhbmdlLnRvb2x0aXBaSW5kZXguY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5lc2NhcGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgZXNjYXBlOiBzaW1wbGVDaGFuZ2UuZXNjYXBlLmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2Uuc2hvd0RlbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IHNob3dEZWxheTogc2ltcGxlQ2hhbmdlLnNob3dEZWxheS5jdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmhpZGVEZWxheSkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyBoaWRlRGVsYXk6IHNpbXBsZUNoYW5nZS5oaWRlRGVsYXkuY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5saWZlKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IGxpZmU6IHNpbXBsZUNoYW5nZS5saWZlLmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UucG9zaXRpb25Ub3ApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgcG9zaXRpb25Ub3A6IHNpbXBsZUNoYW5nZS5wb3NpdGlvblRvcC5jdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnBvc2l0aW9uTGVmdCkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyBwb3NpdGlvbkxlZnQ6IHNpbXBsZUNoYW5nZS5wb3NpdGlvbkxlZnQuY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyBkaXNhYmxlZDogc2ltcGxlQ2hhbmdlLmRpc2FibGVkLmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UudGV4dCkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyB0b29sdGlwTGFiZWw6IHNpbXBsZUNoYW5nZS50ZXh0LmN1cnJlbnRWYWx1ZSB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS50ZXh0LmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250YWluZXIgJiYgdGhpcy5jb250YWluZXIub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5hdXRvSGlkZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyBhdXRvSGlkZTogc2ltcGxlQ2hhbmdlLmF1dG9IaWRlLmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UudG9vbHRpcE9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX3Rvb2x0aXBPcHRpb25zID0geyAuLi50aGlzLl90b29sdGlwT3B0aW9ucywgLi4uc2ltcGxlQ2hhbmdlLnRvb2x0aXBPcHRpb25zLmN1cnJlbnRWYWx1ZSB9O1xuICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldE9wdGlvbigndG9vbHRpcExhYmVsJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICYmIHRoaXMuY29udGFpbmVyLm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzQXV0b0hpZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE9wdGlvbignYXV0b0hpZGUnKTtcbiAgICB9XG5cbiAgICBvbk1vdXNlRW50ZXIoZTogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5lciAmJiAhdGhpcy5zaG93VGltZW91dCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb3VzZUxlYXZlKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQXV0b0hpZGUoKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsaWQgPSBEb21IYW5kbGVyLmhhc0NsYXNzKGUudG9FbGVtZW50LCAncC10b29sdGlwJykgfHwgRG9tSGFuZGxlci5oYXNDbGFzcyhlLnRvRWxlbWVudCwgJ3AtdG9vbHRpcC1hcnJvdycpIHx8IERvbUhhbmRsZXIuaGFzQ2xhc3MoZS50b0VsZW1lbnQsICdwLXRvb2x0aXAtdGV4dCcpIHx8IERvbUhhbmRsZXIuaGFzQ2xhc3MoZS5yZWxhdGVkVGFyZ2V0LCAncC10b29sdGlwJyk7XG4gICAgICAgICAgICAhdmFsaWQgJiYgdGhpcy5kZWFjdGl2YXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRm9jdXMoZTogRXZlbnQpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xuICAgIH1cblxuICAgIG9uQmx1cihlOiBFdmVudCkge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICB9XG5cbiAgICBvbklucHV0Q2xpY2soZTogRXZlbnQpIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5ZG93bi5lc2NhcGUnLCBbJyRldmVudCddKVxuICAgIG9uUHJlc3NFc2NhcGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhpZGVPbkVzY2FwZSkge1xuICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhY3RpdmF0ZSgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsZWFySGlkZVRpbWVvdXQoKTtcblxuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3Nob3dEZWxheScpKVxuICAgICAgICAgICAgdGhpcy5zaG93VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgfSwgdGhpcy5nZXRPcHRpb24oJ3Nob3dEZWxheScpKTtcbiAgICAgICAgZWxzZSB0aGlzLnNob3coKTtcblxuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ2xpZmUnKSkge1xuICAgICAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRPcHRpb24oJ3Nob3dEZWxheScpID8gdGhpcy5nZXRPcHRpb24oJ2xpZmUnKSArIHRoaXMuZ2V0T3B0aW9uKCdzaG93RGVsYXknKSA6IHRoaXMuZ2V0T3B0aW9uKCdsaWZlJyk7XG4gICAgICAgICAgICB0aGlzLmhpZGVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWFjdGl2YXRlKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsZWFyU2hvd1RpbWVvdXQoKTtcblxuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ2hpZGVEZWxheScpKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFySGlkZVRpbWVvdXQoKTsgLy9saWZlIHRpbWVvdXRcbiAgICAgICAgICAgIHRoaXMuaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0T3B0aW9uKCdoaWRlRGVsYXknKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFySGlkZVRpbWVvdXQoKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIGxldCB0b29sdGlwQXJyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdG9vbHRpcEFycm93LmNsYXNzTmFtZSA9ICdwLXRvb2x0aXAtYXJyb3cnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0b29sdGlwQXJyb3cpO1xuXG4gICAgICAgIHRoaXMudG9vbHRpcFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy50b29sdGlwVGV4dC5jbGFzc05hbWUgPSAncC10b29sdGlwLXRleHQnO1xuXG4gICAgICAgIHRoaXMudXBkYXRlVGV4dCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmdldE9wdGlvbigncG9zaXRpb25TdHlsZScpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IHRoaXMuZ2V0T3B0aW9uKCdwb3NpdGlvblN0eWxlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnRvb2x0aXBUZXh0KTtcblxuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ2FwcGVuZFRvJykgPT09ICdib2R5JykgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZ2V0T3B0aW9uKCdhcHBlbmRUbycpID09PSAndGFyZ2V0JykgRG9tSGFuZGxlci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lciwgdGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgZWxzZSBEb21IYW5kbGVyLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyLCB0aGlzLmdldE9wdGlvbignYXBwZW5kVG8nKSk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuXG4gICAgICAgIGlmICh0aGlzLmZpdENvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gJ2ZpdC1jb250ZW50JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc0F1dG9IaWRlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZENvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZENvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcikge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0RWw6IGFueSA9IHRoaXMuY29udGFpbmVyID8/IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyTW91c2VsZWF2ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGFyZ2V0RWwsICdtb3VzZWxlYXZlJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kQ29udGFpbmVyTW91c2VsZWF2ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXJNb3VzZWxlYXZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZENvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJNb3VzZWxlYXZlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdldE9wdGlvbigndG9vbHRpcExhYmVsJykgfHwgdGhpcy5nZXRPcHRpb24oJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuYWxpZ24oKTtcbiAgICAgICAgRG9tSGFuZGxlci5mYWRlSW4odGhpcy5jb250YWluZXIsIDI1MCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCd0b29sdGlwWkluZGV4JykgPT09ICdhdXRvJykgWkluZGV4VXRpbHMuc2V0KCd0b29sdGlwJywgdGhpcy5jb250YWluZXIsIHRoaXMuY29uZmlnLnpJbmRleC50b29sdGlwKTtcbiAgICAgICAgZWxzZSB0aGlzLmNvbnRhaW5lci5zdHlsZS56SW5kZXggPSB0aGlzLmdldE9wdGlvbigndG9vbHRpcFpJbmRleCcpO1xuXG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3Rvb2x0aXBaSW5kZXgnKSA9PT0gJ2F1dG8nKSB7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRleHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldE9wdGlvbignZXNjYXBlJykpIHtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFRleHQudGV4dFZhbHVlID0gdGhpcy5nZXRPcHRpb24oJ3Rvb2x0aXBMYWJlbCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50b29sdGlwVGV4dC5pbm5lckhUTUwgPSB0aGlzLmdldE9wdGlvbigndG9vbHRpcExhYmVsJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGlnbigpIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5nZXRPcHRpb24oJ3Rvb2x0aXBQb3NpdGlvbicpO1xuXG4gICAgICAgIHN3aXRjaCAocG9zaXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgdGhpcy5hbGlnblRvcCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduQm90dG9tKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnblJpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25MZWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICAgICAgdGhpcy5hbGlnbkJvdHRvbSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduVG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnblJpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25MZWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25MZWZ0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPdXRPZkJvdW5kcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25SaWdodCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnblRvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduQm90dG9tKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICB0aGlzLmFsaWduUmlnaHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnbkxlZnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25Ub3AoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPdXRPZkJvdW5kcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnbkJvdHRvbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SG9zdE9mZnNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdhcHBlbmRUbycpID09PSAnYm9keScgfHwgdGhpcy5nZXRPcHRpb24oJ2FwcGVuZFRvJykgPT09ICd0YXJnZXQnKSB7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgbGV0IHRhcmdldExlZnQgPSBvZmZzZXQubGVmdCArIERvbUhhbmRsZXIuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICAgICAgbGV0IHRhcmdldFRvcCA9IG9mZnNldC50b3AgKyBEb21IYW5kbGVyLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICByZXR1cm4geyBsZWZ0OiB0YXJnZXRMZWZ0LCB0b3A6IHRhcmdldFRvcCB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogMCwgdG9wOiAwIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGlnblJpZ2h0KCkge1xuICAgICAgICB0aGlzLnByZUFsaWduKCdyaWdodCcpO1xuICAgICAgICBsZXQgaG9zdE9mZnNldCA9IHRoaXMuZ2V0SG9zdE9mZnNldCgpO1xuICAgICAgICBsZXQgbGVmdCA9IGhvc3RPZmZzZXQubGVmdCArIERvbUhhbmRsZXIuZ2V0T3V0ZXJXaWR0aCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICBsZXQgdG9wID0gaG9zdE9mZnNldC50b3AgKyAoRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIC0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLmNvbnRhaW5lcikpIC8gMjtcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IGxlZnQgKyB0aGlzLmdldE9wdGlvbigncG9zaXRpb25MZWZ0JykgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0b3AgKyB0aGlzLmdldE9wdGlvbigncG9zaXRpb25Ub3AnKSArICdweCc7XG4gICAgfVxuXG4gICAgYWxpZ25MZWZ0KCkge1xuICAgICAgICB0aGlzLnByZUFsaWduKCdsZWZ0Jyk7XG4gICAgICAgIGxldCBob3N0T2Zmc2V0ID0gdGhpcy5nZXRIb3N0T2Zmc2V0KCk7XG4gICAgICAgIGxldCBsZWZ0ID0gaG9zdE9mZnNldC5sZWZ0IC0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgbGV0IHRvcCA9IGhvc3RPZmZzZXQudG9wICsgKERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5lbC5uYXRpdmVFbGVtZW50KSAtIERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXIpKSAvIDI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgdGhpcy5nZXRPcHRpb24oJ3Bvc2l0aW9uTGVmdCcpICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdG9wICsgdGhpcy5nZXRPcHRpb24oJ3Bvc2l0aW9uVG9wJykgKyAncHgnO1xuICAgIH1cblxuICAgIGFsaWduVG9wKCkge1xuICAgICAgICB0aGlzLnByZUFsaWduKCd0b3AnKTtcbiAgICAgICAgbGV0IGhvc3RPZmZzZXQgPSB0aGlzLmdldEhvc3RPZmZzZXQoKTtcbiAgICAgICAgbGV0IGxlZnQgPSBob3N0T2Zmc2V0LmxlZnQgKyAoRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuZWwubmF0aXZlRWxlbWVudCkgLSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5jb250YWluZXIpKSAvIDI7XG4gICAgICAgIGxldCB0b3AgPSBob3N0T2Zmc2V0LnRvcCAtIERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gbGVmdCArIHRoaXMuZ2V0T3B0aW9uKCdwb3NpdGlvbkxlZnQnKSArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRvcCArIHRoaXMuZ2V0T3B0aW9uKCdwb3NpdGlvblRvcCcpICsgJ3B4JztcbiAgICB9XG5cbiAgICBhbGlnbkJvdHRvbSgpIHtcbiAgICAgICAgdGhpcy5wcmVBbGlnbignYm90dG9tJyk7XG4gICAgICAgIGxldCBob3N0T2Zmc2V0ID0gdGhpcy5nZXRIb3N0T2Zmc2V0KCk7XG4gICAgICAgIGxldCBsZWZ0ID0gaG9zdE9mZnNldC5sZWZ0ICsgKERvbUhhbmRsZXIuZ2V0T3V0ZXJXaWR0aCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIC0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuY29udGFpbmVyKSkgLyAyO1xuICAgICAgICBsZXQgdG9wID0gaG9zdE9mZnNldC50b3AgKyBEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgdGhpcy5nZXRPcHRpb24oJ3Bvc2l0aW9uTGVmdCcpICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdG9wICsgdGhpcy5nZXRPcHRpb24oJ3Bvc2l0aW9uVG9wJykgKyAncHgnO1xuICAgIH1cblxuICAgIHNldE9wdGlvbihvcHRpb246IFRvb2x0aXBPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3Rvb2x0aXBPcHRpb25zID0geyAuLi50aGlzLl90b29sdGlwT3B0aW9ucywgLi4ub3B0aW9uIH07XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9uKG9wdGlvbjogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90b29sdGlwT3B0aW9uc1tvcHRpb25dO1xuICAgIH1cblxuICAgIGdldFRhcmdldChlbCkge1xuICAgICAgICByZXR1cm4gRG9tSGFuZGxlci5oYXNDbGFzcyhlbCwgJ3AtaW5wdXR3cmFwcGVyJykgPyBEb21IYW5kbGVyLmZpbmRTaW5nbGUoZWwsICdpbnB1dCcpIDogZWw7XG4gICAgfVxuXG4gICAgcHJlQWxpZ24ocG9zaXRpb246IHN0cmluZykge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gLTk5OSArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IC05OTkgKyAncHgnO1xuXG4gICAgICAgIGxldCBkZWZhdWx0Q2xhc3NOYW1lID0gJ3AtdG9vbHRpcCBwLWNvbXBvbmVudCBwLXRvb2x0aXAtJyArIHBvc2l0aW9uO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgPSB0aGlzLmdldE9wdGlvbigndG9vbHRpcFN0eWxlQ2xhc3MnKSA/IGRlZmF1bHRDbGFzc05hbWUgKyAnICcgKyB0aGlzLmdldE9wdGlvbigndG9vbHRpcFN0eWxlQ2xhc3MnKSA6IGRlZmF1bHRDbGFzc05hbWU7XG4gICAgfVxuXG4gICAgaXNPdXRPZkJvdW5kcygpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBsZXQgdGFyZ2V0VG9wID0gb2Zmc2V0LnRvcDtcbiAgICAgICAgbGV0IHRhcmdldExlZnQgPSBvZmZzZXQubGVmdDtcbiAgICAgICAgbGV0IHdpZHRoID0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgbGV0IGhlaWdodCA9IERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXIpO1xuICAgICAgICBsZXQgdmlld3BvcnQgPSBEb21IYW5kbGVyLmdldFZpZXdwb3J0KCk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldExlZnQgKyB3aWR0aCA+IHZpZXdwb3J0LndpZHRoIHx8IHRhcmdldExlZnQgPCAwIHx8IHRhcmdldFRvcCA8IDAgfHwgdGFyZ2V0VG9wICsgaGVpZ2h0ID4gdmlld3BvcnQuaGVpZ2h0O1xuICAgIH1cblxuICAgIG9uV2luZG93UmVzaXplKGU6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cblxuICAgIGJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNpemVMaXN0ZW5lciA9IHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZFNjcm9sbExpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbmV3IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRFdmVudHMoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldE9wdGlvbigndG9vbHRpcEV2ZW50JykgPT09ICdob3ZlcicpIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5tb3VzZUVudGVyTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLm1vdXNlTGVhdmVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrTGlzdGVuZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0T3B0aW9uKCd0b29sdGlwRXZlbnQnKSA9PT0gJ2ZvY3VzJykge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMuZ2V0VGFyZ2V0KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG5cbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuZm9jdXNMaXN0ZW5lcik7XG4gICAgICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYmx1ckxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICYmIHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldE9wdGlvbignYXBwZW5kVG8nKSA9PT0gJ2JvZHknKSBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZ2V0T3B0aW9uKCdhcHBlbmRUbycpID09PSAndGFyZ2V0JykgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgICAgIGVsc2UgRG9tSGFuZGxlci5yZW1vdmVDaGlsZCh0aGlzLmNvbnRhaW5lciwgdGhpcy5nZXRPcHRpb24oJ2FwcGVuZFRvJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmRDb250YWluZXJNb3VzZWxlYXZlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVvdXRzKCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjbGVhclNob3dUaW1lb3V0KCkge1xuICAgICAgICBpZiAodGhpcy5zaG93VGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2hvd1RpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5zaG93VGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhckhpZGVUaW1lb3V0KCkge1xuICAgICAgICBpZiAodGhpcy5oaWRlVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZVRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5oaWRlVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXRzKCkge1xuICAgICAgICB0aGlzLmNsZWFyU2hvd1RpbWVvdXQoKTtcbiAgICAgICAgdGhpcy5jbGVhckhpZGVUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtUb29sdGlwXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtUb29sdGlwXVxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwTW9kdWxlIHt9XG4iXX0=