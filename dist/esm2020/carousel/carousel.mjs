import { Component, Input, ViewChild, ContentChildren, NgModule, EventEmitter, Output, ContentChild, ChangeDetectionStrategy, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { PrimeTemplate, SharedModule, Header, Footer } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { UniqueComponentId } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
export class Carousel {
    constructor(el, zone, cd, renderer, document, platformId) {
        this.el = el;
        this.zone = zone;
        this.cd = cd;
        this.renderer = renderer;
        this.document = document;
        this.platformId = platformId;
        this.orientation = 'horizontal';
        this.verticalViewPortHeight = '300px';
        this.contentClass = '';
        this.indicatorsContentClass = '';
        this.indicatorStyleClass = '';
        this.circular = false;
        this.showIndicators = true;
        this.showNavigators = true;
        this.autoplayInterval = 0;
        this.onPage = new EventEmitter();
        this._numVisible = 1;
        this._numScroll = 1;
        this._oldNumScroll = 0;
        this.prevState = {
            numScroll: 0,
            numVisible: 0,
            value: []
        };
        this.defaultNumScroll = 1;
        this.defaultNumVisible = 1;
        this._page = 0;
        this.isRemainingItemsAdded = false;
        this.remainingItems = 0;
        this.swipeThreshold = 20;
        this.totalShiftedItems = this.page * this.numScroll * -1;
        this.window = this.document.defaultView;
    }
    get page() {
        return this._page;
    }
    set page(val) {
        if (this.isCreated && val !== this._page) {
            if (this.autoplayInterval) {
                this.stopAutoplay();
                this.allowAutoplay = false;
            }
            if (val > this._page && val <= this.totalDots() - 1) {
                this.step(-1, val);
            }
            else if (val < this._page) {
                this.step(1, val);
            }
        }
        this._page = val;
    }
    get numVisible() {
        return this._numVisible;
    }
    set numVisible(val) {
        this._numVisible = val;
    }
    get numScroll() {
        return this._numVisible;
    }
    set numScroll(val) {
        this._numScroll = val;
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.value) {
            if (this.circular && this._value) {
                this.setCloneItems();
            }
        }
        if (this.isCreated) {
            if (simpleChange.numVisible) {
                if (this.responsiveOptions) {
                    this.defaultNumVisible = this.numVisible;
                }
                if (this.isCircular()) {
                    this.setCloneItems();
                }
                this.createStyle();
                this.calculatePosition();
            }
            if (simpleChange.numScroll) {
                if (this.responsiveOptions) {
                    this.defaultNumScroll = this.numScroll;
                }
            }
        }
    }
    ngAfterContentInit() {
        this.id = UniqueComponentId();
        this.allowAutoplay = !!this.autoplayInterval;
        if (this.circular) {
            this.setCloneItems();
        }
        if (this.responsiveOptions) {
            this.defaultNumScroll = this._numScroll;
            this.defaultNumVisible = this._numVisible;
        }
        this.createStyle();
        this.calculatePosition();
        if (this.responsiveOptions) {
            this.bindDocumentListeners();
        }
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterContentChecked() {
        const isCircular = this.isCircular();
        let totalShiftedItems = this.totalShiftedItems;
        if (this.value && this.itemsContainer && (this.prevState.numScroll !== this._numScroll || this.prevState.numVisible !== this._numVisible || this.prevState.value.length !== this.value.length)) {
            if (this.autoplayInterval) {
                this.stopAutoplay();
            }
            this.remainingItems = (this.value.length - this._numVisible) % this._numScroll;
            let page = this._page;
            if (this.totalDots() !== 0 && page >= this.totalDots()) {
                page = this.totalDots() - 1;
                this._page = page;
                this.onPage.emit({
                    page: this.page
                });
            }
            totalShiftedItems = page * this._numScroll * -1;
            if (isCircular) {
                totalShiftedItems -= this._numVisible;
            }
            if (page === this.totalDots() - 1 && this.remainingItems > 0) {
                totalShiftedItems += -1 * this.remainingItems + this._numScroll;
                this.isRemainingItemsAdded = true;
            }
            else {
                this.isRemainingItemsAdded = false;
            }
            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }
            this._oldNumScroll = this._numScroll;
            this.prevState.numScroll = this._numScroll;
            this.prevState.numVisible = this._numVisible;
            this.prevState.value = [...this._value];
            if (this.totalDots() > 0 && this.itemsContainer.nativeElement) {
                this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            }
            this.isCreated = true;
            if (this.autoplayInterval && this.isAutoplay()) {
                this.startAutoplay();
            }
        }
        if (isCircular) {
            if (this.page === 0) {
                totalShiftedItems = -1 * this._numVisible;
            }
            else if (totalShiftedItems === 0) {
                totalShiftedItems = -1 * this.value.length;
                if (this.remainingItems > 0) {
                    this.isRemainingItemsAdded = true;
                }
            }
            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }
        }
    }
    createStyle() {
        if (!this.carouselStyle) {
            this.carouselStyle = this.renderer.createElement('style');
            this.carouselStyle.type = 'text/css';
            this.renderer.appendChild(this.document.head, this.carouselStyle);
        }
        let innerHTML = `
            #${this.id} .p-carousel-item {
				flex: 1 0 ${100 / this.numVisible}%
			}
        `;
        if (this.responsiveOptions) {
            this.responsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result = null;
                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string')
                    result = value1.localeCompare(value2, undefined, { numeric: true });
                else
                    result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
                return -1 * result;
            });
            for (let i = 0; i < this.responsiveOptions.length; i++) {
                let res = this.responsiveOptions[i];
                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }
        this.carouselStyle.textContent = innerHTML;
    }
    calculatePosition() {
        if (this.responsiveOptions) {
            let matchedResponsiveData = {
                numVisible: this.defaultNumVisible,
                numScroll: this.defaultNumScroll
            };
            if (typeof window !== 'undefined') {
                let windowWidth = window.innerWidth;
                for (let i = 0; i < this.responsiveOptions.length; i++) {
                    let res = this.responsiveOptions[i];
                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }
            }
            if (this._numScroll !== matchedResponsiveData.numScroll) {
                let page = this._page;
                page = Math.floor((page * this._numScroll) / matchedResponsiveData.numScroll);
                let totalShiftedItems = matchedResponsiveData.numScroll * this.page * -1;
                if (this.isCircular()) {
                    totalShiftedItems -= matchedResponsiveData.numVisible;
                }
                this.totalShiftedItems = totalShiftedItems;
                this._numScroll = matchedResponsiveData.numScroll;
                this._page = page;
                this.onPage.emit({
                    page: this.page
                });
            }
            if (this._numVisible !== matchedResponsiveData.numVisible) {
                this._numVisible = matchedResponsiveData.numVisible;
                this.setCloneItems();
            }
            this.cd.markForCheck();
        }
    }
    setCloneItems() {
        this.clonedItemsForStarting = [];
        this.clonedItemsForFinishing = [];
        if (this.isCircular()) {
            this.clonedItemsForStarting.push(...this.value.slice(-1 * this._numVisible));
            this.clonedItemsForFinishing.push(...this.value.slice(0, this._numVisible));
        }
    }
    firstIndex() {
        return this.isCircular() ? -1 * (this.totalShiftedItems + this.numVisible) : this.totalShiftedItems * -1;
    }
    lastIndex() {
        return this.firstIndex() + this.numVisible - 1;
    }
    totalDots() {
        return this.value?.length ? Math.ceil((this.value.length - this._numVisible) / this._numScroll) + 1 : 0;
    }
    totalDotsArray() {
        const totalDots = this.totalDots();
        return totalDots <= 0 ? [] : Array(totalDots).fill(0);
    }
    isVertical() {
        return this.orientation === 'vertical';
    }
    isCircular() {
        return this.circular && this.value && this.value.length >= this.numVisible;
    }
    isAutoplay() {
        return this.autoplayInterval && this.allowAutoplay;
    }
    isForwardNavDisabled() {
        return this.isEmpty() || (this._page >= this.totalDots() - 1 && !this.isCircular());
    }
    isBackwardNavDisabled() {
        return this.isEmpty() || (this._page <= 0 && !this.isCircular());
    }
    isEmpty() {
        return !this.value || this.value.length === 0;
    }
    navForward(e, index) {
        if (this.isCircular() || this._page < this.totalDots() - 1) {
            this.step(-1, index);
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    navBackward(e, index) {
        if (this.isCircular() || this._page !== 0) {
            this.step(1, index);
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    onDotClick(e, index) {
        let page = this._page;
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (index > page) {
            this.navForward(e, index);
        }
        else if (index < page) {
            this.navBackward(e, index);
        }
    }
    step(dir, page) {
        let totalShiftedItems = this.totalShiftedItems;
        const isCircular = this.isCircular();
        if (page != null) {
            totalShiftedItems = this._numScroll * page * -1;
            if (isCircular) {
                totalShiftedItems -= this._numVisible;
            }
            this.isRemainingItemsAdded = false;
        }
        else {
            totalShiftedItems += this._numScroll * dir;
            if (this.isRemainingItemsAdded) {
                totalShiftedItems += this.remainingItems - this._numScroll * dir;
                this.isRemainingItemsAdded = false;
            }
            let originalShiftedItems = isCircular ? totalShiftedItems + this._numVisible : totalShiftedItems;
            page = Math.abs(Math.floor(originalShiftedItems / this._numScroll));
        }
        if (isCircular && this.page === this.totalDots() - 1 && dir === -1) {
            totalShiftedItems = -1 * (this.value.length + this._numVisible);
            page = 0;
        }
        else if (isCircular && this.page === 0 && dir === 1) {
            totalShiftedItems = 0;
            page = this.totalDots() - 1;
        }
        else if (page === this.totalDots() - 1 && this.remainingItems > 0) {
            totalShiftedItems += this.remainingItems * -1 - this._numScroll * dir;
            this.isRemainingItemsAdded = true;
        }
        if (this.itemsContainer) {
            this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }
        this.totalShiftedItems = totalShiftedItems;
        this._page = page;
        this.onPage.emit({
            page: this.page
        });
    }
    startAutoplay() {
        this.interval = setInterval(() => {
            if (this.totalDots() > 0) {
                if (this.page === this.totalDots() - 1) {
                    this.step(-1, 0);
                }
                else {
                    this.step(-1, this.page + 1);
                }
            }
        }, this.autoplayInterval);
    }
    stopAutoplay() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    onTransitionEnd() {
        if (this.itemsContainer) {
            this.itemsContainer.nativeElement.style.transition = '';
            if ((this.page === 0 || this.page === this.totalDots() - 1) && this.isCircular()) {
                this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${this.totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            }
        }
    }
    onTouchStart(e) {
        let touchobj = e.changedTouches[0];
        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }
    onTouchMove(e) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    onTouchEnd(e) {
        let touchobj = e.changedTouches[0];
        if (this.isVertical()) {
            this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
        }
        else {
            this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
        }
    }
    changePageOnTouch(e, diff) {
        if (Math.abs(diff) > this.swipeThreshold) {
            if (diff < 0) {
                this.navForward(e);
            }
            else {
                this.navBackward(e);
            }
        }
    }
    bindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentResizeListener) {
                this.documentResizeListener = this.renderer.listen(this.window, 'resize', (event) => {
                    this.calculatePosition();
                });
            }
        }
    }
    unbindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.documentResizeListener) {
                this.documentResizeListener();
                this.documentResizeListener = null;
            }
        }
    }
    ngOnDestroy() {
        if (this.responsiveOptions) {
            this.unbindDocumentListeners();
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
        }
    }
}
Carousel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Carousel, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
Carousel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: Carousel, selector: "p-carousel", inputs: { page: "page", numVisible: "numVisible", numScroll: "numScroll", responsiveOptions: "responsiveOptions", orientation: "orientation", verticalViewPortHeight: "verticalViewPortHeight", contentClass: "contentClass", indicatorsContentClass: "indicatorsContentClass", indicatorsContentStyle: "indicatorsContentStyle", indicatorStyleClass: "indicatorStyleClass", indicatorStyle: "indicatorStyle", value: "value", circular: "circular", showIndicators: "showIndicators", showNavigators: "showNavigators", autoplayInterval: "autoplayInterval", style: "style", styleClass: "styleClass" }, outputs: { onPage: "onPage" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "headerFacet", first: true, predicate: Header, descendants: true }, { propertyName: "footerFacet", first: true, predicate: Footer, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "itemsContainer", first: true, predicate: ["itemsContainer"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <div [attr.id]="id" [ngClass]="{ 'p-carousel p-component': true, 'p-carousel-vertical': isVertical(), 'p-carousel-horizontal': !isVertical() }" [ngStyle]="style" [class]="styleClass">
            <div class="p-carousel-header" *ngIf="headerFacet || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div [class]="contentClass" [ngClass]="'p-carousel-content'">
                <div class="p-carousel-container">
                    <button type="button" *ngIf="showNavigators" [ngClass]="{ 'p-carousel-prev p-link': true, 'p-disabled': isBackwardNavDisabled() }" [disabled]="isBackwardNavDisabled()" (click)="navBackward($event)" pRipple>
                        <span [ngClass]="{ 'p-carousel-prev-icon pi': true, 'pi-chevron-left': !isVertical(), 'pi-chevron-up': isVertical() }"></span>
                    </button>
                    <div class="p-carousel-items-content" [ngStyle]="{ height: isVertical() ? verticalViewPortHeight : 'auto' }">
                        <div #itemsContainer class="p-carousel-items-container" (transitionend)="onTransitionEnd()" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                            <div
                                *ngFor="let item of clonedItemsForStarting; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-cloned': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === value.length,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForStarting.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of value; let index = index"
                                [ngClass]="{ 'p-carousel-item': true, 'p-carousel-item-active': firstIndex() <= index && lastIndex() >= index, 'p-carousel-item-start': firstIndex() === index, 'p-carousel-item-end': lastIndex() === index }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of clonedItemsForFinishing; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-cloned': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === numVisible,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForFinishing.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                        </div>
                    </div>
                    <button type="button" *ngIf="showNavigators" [ngClass]="{ 'p-carousel-next p-link': true, 'p-disabled': isForwardNavDisabled() }" [disabled]="isForwardNavDisabled()" (click)="navForward($event)" pRipple>
                        <span [ngClass]="{ 'p-carousel-prev-icon pi': true, 'pi-chevron-right': !isVertical(), 'pi-chevron-down': isVertical() }"></span>
                    </button>
                </div>
                <ul [ngClass]="'p-carousel-indicators p-reset'" [class]="indicatorsContentClass" [ngStyle]="indicatorsContentStyle" *ngIf="showIndicators">
                    <li *ngFor="let totalDot of totalDotsArray(); let i = index" [ngClass]="{ 'p-carousel-indicator': true, 'p-highlight': _page === i }">
                        <button type="button" [ngClass]="'p-link'" (click)="onDotClick($event, i)" [class]="indicatorStyleClass" [ngStyle]="indicatorStyle"></button>
                    </li>
                </ul>
            </div>
            <div class="p-carousel-footer" *ngIf="footerFacet || footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </div>
    `, isInline: true, styles: [".p-carousel{display:flex;flex-direction:column}.p-carousel-content{display:flex;flex-direction:column;overflow:auto}.p-carousel-prev,.p-carousel-next{align-self:center;flex-grow:0;flex-shrink:0;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-carousel-container{display:flex;flex-direction:row}.p-carousel-items-content{overflow:hidden;width:100%}.p-carousel-items-container{display:flex;flex-direction:row}.p-carousel-indicators{display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap}.p-carousel-indicator>button{display:flex;align-items:center;justify-content:center}.p-carousel-vertical .p-carousel-container{flex-direction:column}.p-carousel-vertical .p-carousel-items-container{flex-direction:column;height:100%}.p-items-hidden .p-carousel-item{visibility:hidden}.p-items-hidden .p-carousel-item.p-carousel-item-active{visibility:visible}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Carousel, decorators: [{
            type: Component,
            args: [{ selector: 'p-carousel', template: `
        <div [attr.id]="id" [ngClass]="{ 'p-carousel p-component': true, 'p-carousel-vertical': isVertical(), 'p-carousel-horizontal': !isVertical() }" [ngStyle]="style" [class]="styleClass">
            <div class="p-carousel-header" *ngIf="headerFacet || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div [class]="contentClass" [ngClass]="'p-carousel-content'">
                <div class="p-carousel-container">
                    <button type="button" *ngIf="showNavigators" [ngClass]="{ 'p-carousel-prev p-link': true, 'p-disabled': isBackwardNavDisabled() }" [disabled]="isBackwardNavDisabled()" (click)="navBackward($event)" pRipple>
                        <span [ngClass]="{ 'p-carousel-prev-icon pi': true, 'pi-chevron-left': !isVertical(), 'pi-chevron-up': isVertical() }"></span>
                    </button>
                    <div class="p-carousel-items-content" [ngStyle]="{ height: isVertical() ? verticalViewPortHeight : 'auto' }">
                        <div #itemsContainer class="p-carousel-items-container" (transitionend)="onTransitionEnd()" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                            <div
                                *ngFor="let item of clonedItemsForStarting; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-cloned': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === value.length,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForStarting.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of value; let index = index"
                                [ngClass]="{ 'p-carousel-item': true, 'p-carousel-item-active': firstIndex() <= index && lastIndex() >= index, 'p-carousel-item-start': firstIndex() === index, 'p-carousel-item-end': lastIndex() === index }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of clonedItemsForFinishing; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-cloned': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === numVisible,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForFinishing.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                        </div>
                    </div>
                    <button type="button" *ngIf="showNavigators" [ngClass]="{ 'p-carousel-next p-link': true, 'p-disabled': isForwardNavDisabled() }" [disabled]="isForwardNavDisabled()" (click)="navForward($event)" pRipple>
                        <span [ngClass]="{ 'p-carousel-prev-icon pi': true, 'pi-chevron-right': !isVertical(), 'pi-chevron-down': isVertical() }"></span>
                    </button>
                </div>
                <ul [ngClass]="'p-carousel-indicators p-reset'" [class]="indicatorsContentClass" [ngStyle]="indicatorsContentStyle" *ngIf="showIndicators">
                    <li *ngFor="let totalDot of totalDotsArray(); let i = index" [ngClass]="{ 'p-carousel-indicator': true, 'p-highlight': _page === i }">
                        <button type="button" [ngClass]="'p-link'" (click)="onDotClick($event, i)" [class]="indicatorStyleClass" [ngStyle]="indicatorStyle"></button>
                    </li>
                </ul>
            </div>
            <div class="p-carousel-footer" *ngIf="footerFacet || footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-carousel{display:flex;flex-direction:column}.p-carousel-content{display:flex;flex-direction:column;overflow:auto}.p-carousel-prev,.p-carousel-next{align-self:center;flex-grow:0;flex-shrink:0;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-carousel-container{display:flex;flex-direction:row}.p-carousel-items-content{overflow:hidden;width:100%}.p-carousel-items-container{display:flex;flex-direction:row}.p-carousel-indicators{display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap}.p-carousel-indicator>button{display:flex;align-items:center;justify-content:center}.p-carousel-vertical .p-carousel-container{flex-direction:column}.p-carousel-vertical .p-carousel-items-container{flex-direction:column;height:100%}.p-items-hidden .p-carousel-item{visibility:hidden}.p-items-hidden .p-carousel-item.p-carousel-item-active{visibility:visible}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { page: [{
                type: Input
            }], numVisible: [{
                type: Input
            }], numScroll: [{
                type: Input
            }], responsiveOptions: [{
                type: Input
            }], orientation: [{
                type: Input
            }], verticalViewPortHeight: [{
                type: Input
            }], contentClass: [{
                type: Input
            }], indicatorsContentClass: [{
                type: Input
            }], indicatorsContentStyle: [{
                type: Input
            }], indicatorStyleClass: [{
                type: Input
            }], indicatorStyle: [{
                type: Input
            }], value: [{
                type: Input
            }], circular: [{
                type: Input
            }], showIndicators: [{
                type: Input
            }], showNavigators: [{
                type: Input
            }], autoplayInterval: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], onPage: [{
                type: Output
            }], itemsContainer: [{
                type: ViewChild,
                args: ['itemsContainer']
            }], headerFacet: [{
                type: ContentChild,
                args: [Header]
            }], footerFacet: [{
                type: ContentChild,
                args: [Footer]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class CarouselModule {
}
CarouselModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: CarouselModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CarouselModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.4", ngImport: i0, type: CarouselModule, declarations: [Carousel], imports: [CommonModule, SharedModule, RippleModule], exports: [CommonModule, Carousel, SharedModule] });
CarouselModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: CarouselModule, imports: [CommonModule, SharedModule, RippleModule, CommonModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: CarouselModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RippleModule],
                    exports: [CommonModule, Carousel, SharedModule],
                    declarations: [Carousel]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY2Fyb3VzZWwvY2Fyb3VzZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFDVCxLQUFLLEVBRUwsU0FBUyxFQUdULGVBQWUsRUFFZixRQUFRLEVBRVIsWUFBWSxFQUNaLE1BQU0sRUFDTixZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUlqQixNQUFNLEVBQ04sV0FBVyxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDNUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBdUVsRCxNQUFNLE9BQU8sUUFBUTtJQTRJakIsWUFBbUIsRUFBYyxFQUFTLElBQVksRUFBUyxFQUFxQixFQUFVLFFBQW1CLEVBQTRCLFFBQWtCLEVBQStCLFVBQWU7UUFBMUwsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBNEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUErQixlQUFVLEdBQVYsVUFBVSxDQUFLO1FBdkdwTSxnQkFBVyxHQUFHLFlBQVksQ0FBQztRQUUzQiwyQkFBc0IsR0FBRyxPQUFPLENBQUM7UUFFakMsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFFMUIsMkJBQXNCLEdBQVcsRUFBRSxDQUFDO1FBSXBDLHdCQUFtQixHQUFXLEVBQUUs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R3JDLGNBQWMsWUFKYixZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFDeEMsWUFBWSxFQUFZLFlBQVk7MkZBR3JDLGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUM7b0JBQ25ELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDO29CQUMvQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXQsXG4gICAgRWxlbWVudFJlZixcbiAgICBWaWV3Q2hpbGQsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgUXVlcnlMaXN0LFxuICAgIE5nTW9kdWxlLFxuICAgIE5nWm9uZSxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgT3V0cHV0LFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFJlbmRlcmVyMixcbiAgICBJbmplY3QsXG4gICAgUExBVEZPUk1fSURcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUsIEhlYWRlciwgRm9vdGVyIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVW5pcXVlQ29tcG9uZW50SWQgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jYXJvdXNlbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbYXR0ci5pZF09XCJpZFwiIFtuZ0NsYXNzXT1cInsgJ3AtY2Fyb3VzZWwgcC1jb21wb25lbnQnOiB0cnVlLCAncC1jYXJvdXNlbC12ZXJ0aWNhbCc6IGlzVmVydGljYWwoKSwgJ3AtY2Fyb3VzZWwtaG9yaXpvbnRhbCc6ICFpc1ZlcnRpY2FsKCkgfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWNhcm91c2VsLWhlYWRlclwiICpuZ0lmPVwiaGVhZGVyRmFjZXQgfHwgaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWhlYWRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaGVhZGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBbY2xhc3NdPVwiY29udGVudENsYXNzXCIgW25nQ2xhc3NdPVwiJ3AtY2Fyb3VzZWwtY29udGVudCdcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1jYXJvdXNlbC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKm5nSWY9XCJzaG93TmF2aWdhdG9yc1wiIFtuZ0NsYXNzXT1cInsgJ3AtY2Fyb3VzZWwtcHJldiBwLWxpbmsnOiB0cnVlLCAncC1kaXNhYmxlZCc6IGlzQmFja3dhcmROYXZEaXNhYmxlZCgpIH1cIiBbZGlzYWJsZWRdPVwiaXNCYWNrd2FyZE5hdkRpc2FibGVkKClcIiAoY2xpY2spPVwibmF2QmFja3dhcmQoJGV2ZW50KVwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCJ7ICdwLWNhcm91c2VsLXByZXYtaWNvbiBwaSc6IHRydWUsICdwaS1jaGV2cm9uLWxlZnQnOiAhaXNWZXJ0aWNhbCgpLCAncGktY2hldnJvbi11cCc6IGlzVmVydGljYWwoKSB9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtY2Fyb3VzZWwtaXRlbXMtY29udGVudFwiIFtuZ1N0eWxlXT1cInsgaGVpZ2h0OiBpc1ZlcnRpY2FsKCkgPyB2ZXJ0aWNhbFZpZXdQb3J0SGVpZ2h0IDogJ2F1dG8nIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgI2l0ZW1zQ29udGFpbmVyIGNsYXNzPVwicC1jYXJvdXNlbC1pdGVtcy1jb250YWluZXJcIiAodHJhbnNpdGlvbmVuZCk9XCJvblRyYW5zaXRpb25FbmQoKVwiICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiICh0b3VjaG1vdmUpPVwib25Ub3VjaE1vdmUoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgY2xvbmVkSXRlbXNGb3JTdGFydGluZzsgbGV0IGluZGV4ID0gaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncC1jYXJvdXNlbC1pdGVtIHAtY2Fyb3VzZWwtaXRlbS1jbG9uZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3AtY2Fyb3VzZWwtaXRlbS1hY3RpdmUnOiB0b3RhbFNoaWZ0ZWRJdGVtcyAqIC0xID09PSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncC1jYXJvdXNlbC1pdGVtLXN0YXJ0JzogMCA9PT0gaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncC1jYXJvdXNlbC1pdGVtLWVuZCc6IGNsb25lZEl0ZW1zRm9yU3RhcnRpbmcubGVuZ3RoIC0gMSA9PT0gaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgaXRlbSBvZiB2YWx1ZTsgbGV0IGluZGV4ID0gaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLWNhcm91c2VsLWl0ZW0nOiB0cnVlLCAncC1jYXJvdXNlbC1pdGVtLWFjdGl2ZSc6IGZpcnN0SW5kZXgoKSA8PSBpbmRleCAmJiBsYXN0SW5kZXgoKSA+PSBpbmRleCwgJ3AtY2Fyb3VzZWwtaXRlbS1zdGFydCc6IGZpcnN0SW5kZXgoKSA9PT0gaW5kZXgsICdwLWNhcm91c2VsLWl0ZW0tZW5kJzogbGFzdEluZGV4KCkgPT09IGluZGV4IH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGl0ZW0gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgY2xvbmVkSXRlbXNGb3JGaW5pc2hpbmc7IGxldCBpbmRleCA9IGluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3AtY2Fyb3VzZWwtaXRlbSBwLWNhcm91c2VsLWl0ZW0tY2xvbmVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWNhcm91c2VsLWl0ZW0tYWN0aXZlJzogdG90YWxTaGlmdGVkSXRlbXMgKiAtMSA9PT0gbnVtVmlzaWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWNhcm91c2VsLWl0ZW0tc3RhcnQnOiAwID09PSBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWNhcm91c2VsLWl0ZW0tZW5kJzogY2xvbmVkSXRlbXNGb3JGaW5pc2hpbmcubGVuZ3RoIC0gMSA9PT0gaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiICpuZ0lmPVwic2hvd05hdmlnYXRvcnNcIiBbbmdDbGFzc109XCJ7ICdwLWNhcm91c2VsLW5leHQgcC1saW5rJzogdHJ1ZSwgJ3AtZGlzYWJsZWQnOiBpc0ZvcndhcmROYXZEaXNhYmxlZCgpIH1cIiBbZGlzYWJsZWRdPVwiaXNGb3J3YXJkTmF2RGlzYWJsZWQoKVwiIChjbGljayk9XCJuYXZGb3J3YXJkKCRldmVudClcIiBwUmlwcGxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gW25nQ2xhc3NdPVwieyAncC1jYXJvdXNlbC1wcmV2LWljb24gcGknOiB0cnVlLCAncGktY2hldnJvbi1yaWdodCc6ICFpc1ZlcnRpY2FsKCksICdwaS1jaGV2cm9uLWRvd24nOiBpc1ZlcnRpY2FsKCkgfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHVsIFtuZ0NsYXNzXT1cIidwLWNhcm91c2VsLWluZGljYXRvcnMgcC1yZXNldCdcIiBbY2xhc3NdPVwiaW5kaWNhdG9yc0NvbnRlbnRDbGFzc1wiIFtuZ1N0eWxlXT1cImluZGljYXRvcnNDb250ZW50U3R5bGVcIiAqbmdJZj1cInNob3dJbmRpY2F0b3JzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSAqbmdGb3I9XCJsZXQgdG90YWxEb3Qgb2YgdG90YWxEb3RzQXJyYXkoKTsgbGV0IGkgPSBpbmRleFwiIFtuZ0NsYXNzXT1cInsgJ3AtY2Fyb3VzZWwtaW5kaWNhdG9yJzogdHJ1ZSwgJ3AtaGlnaGxpZ2h0JzogX3BhZ2UgPT09IGkgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgW25nQ2xhc3NdPVwiJ3AtbGluaydcIiAoY2xpY2spPVwib25Eb3RDbGljaygkZXZlbnQsIGkpXCIgW2NsYXNzXT1cImluZGljYXRvclN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJpbmRpY2F0b3JTdHlsZVwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWNhcm91c2VsLWZvb3RlclwiICpuZ0lmPVwiZm9vdGVyRmFjZXQgfHwgZm9vdGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZm9vdGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2Fyb3VzZWwuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIENhcm91c2VsIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgQElucHV0KCkgZ2V0IHBhZ2UoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2U7XG4gICAgfVxuICAgIHNldCBwYWdlKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ3JlYXRlZCAmJiB2YWwgIT09IHRoaXMuX3BhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9wbGF5SW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BBdXRvcGxheSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxsb3dBdXRvcGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsID4gdGhpcy5fcGFnZSAmJiB2YWwgPD0gdGhpcy50b3RhbERvdHMoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXAoLTEsIHZhbCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbCA8IHRoaXMuX3BhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXAoMSwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3BhZ2UgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG51bVZpc2libGUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX251bVZpc2libGU7XG4gICAgfVxuICAgIHNldCBudW1WaXNpYmxlKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX251bVZpc2libGUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG51bVNjcm9sbCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fbnVtVmlzaWJsZTtcbiAgICB9XG4gICAgc2V0IG51bVNjcm9sbCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9udW1TY3JvbGwgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgcmVzcG9uc2l2ZU9wdGlvbnM6IGFueVtdO1xuXG4gICAgQElucHV0KCkgb3JpZW50YXRpb24gPSAnaG9yaXpvbnRhbCc7XG5cbiAgICBASW5wdXQoKSB2ZXJ0aWNhbFZpZXdQb3J0SGVpZ2h0ID0gJzMwMHB4JztcblxuICAgIEBJbnB1dCgpIGNvbnRlbnRDbGFzczogc3RyaW5nID0gJyc7XG5cbiAgICBASW5wdXQoKSBpbmRpY2F0b3JzQ29udGVudENsYXNzOiBzdHJpbmcgPSAnJztcblxuICAgIEBJbnB1dCgpIGluZGljYXRvcnNDb250ZW50U3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGluZGljYXRvclN0eWxlQ2xhc3M6IHN0cmluZyA9ICcnO1xuXG4gICAgQElucHV0KCkgaW5kaWNhdG9yU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGdldCB2YWx1ZSgpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gICAgc2V0IHZhbHVlKHZhbCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBjaXJjdWxhcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgc2hvd0luZGljYXRvcnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2hvd05hdmlnYXRvcnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYXV0b3BsYXlJbnRlcnZhbDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KCkgb25QYWdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2l0ZW1zQ29udGFpbmVyJykgaXRlbXNDb250YWluZXI6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkKEhlYWRlcikgaGVhZGVyRmFjZXQ7XG5cbiAgICBAQ29udGVudENoaWxkKEZvb3RlcikgZm9vdGVyRmFjZXQ7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBfbnVtVmlzaWJsZTogbnVtYmVyID0gMTtcblxuICAgIF9udW1TY3JvbGw6IG51bWJlciA9IDE7XG5cbiAgICBfb2xkTnVtU2Nyb2xsOiBudW1iZXIgPSAwO1xuXG4gICAgcHJldlN0YXRlOiBhbnkgPSB7XG4gICAgICAgIG51bVNjcm9sbDogMCxcbiAgICAgICAgbnVtVmlzaWJsZTogMCxcbiAgICAgICAgdmFsdWU6IFtdXG4gICAgfTtcblxuICAgIGRlZmF1bHROdW1TY3JvbGw6IG51bWJlciA9IDE7XG5cbiAgICBkZWZhdWx0TnVtVmlzaWJsZTogbnVtYmVyID0gMTtcblxuICAgIF9wYWdlOiBudW1iZXIgPSAwO1xuXG4gICAgX3ZhbHVlOiBhbnlbXTtcblxuICAgIGNhcm91c2VsU3R5bGU6IGFueTtcblxuICAgIGlkOiBzdHJpbmc7XG5cbiAgICB0b3RhbFNoaWZ0ZWRJdGVtcztcblxuICAgIGlzUmVtYWluaW5nSXRlbXNBZGRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgYW5pbWF0aW9uVGltZW91dDogYW55O1xuXG4gICAgdHJhbnNsYXRlVGltZW91dDogYW55O1xuXG4gICAgcmVtYWluaW5nSXRlbXM6IG51bWJlciA9IDA7XG5cbiAgICBfaXRlbXM6IGFueVtdO1xuXG4gICAgc3RhcnRQb3M6IGFueTtcblxuICAgIGRvY3VtZW50UmVzaXplTGlzdGVuZXI6IGFueTtcblxuICAgIGNsb25lZEl0ZW1zRm9yU3RhcnRpbmc6IGFueVtdO1xuXG4gICAgY2xvbmVkSXRlbXNGb3JGaW5pc2hpbmc6IGFueVtdO1xuXG4gICAgYWxsb3dBdXRvcGxheTogYm9vbGVhbjtcblxuICAgIGludGVydmFsOiBhbnk7XG5cbiAgICBpc0NyZWF0ZWQ6IGJvb2xlYW47XG5cbiAgICBzd2lwZVRocmVzaG9sZDogbnVtYmVyID0gMjA7XG5cbiAgICBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgd2luZG93OiBXaW5kb3c7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55KSB7XG4gICAgICAgIHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0aGlzLnBhZ2UgKiB0aGlzLm51bVNjcm9sbCAqIC0xO1xuICAgICAgICB0aGlzLndpbmRvdyA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcgYXMgV2luZG93O1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZTogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaXJjdWxhciAmJiB0aGlzLl92YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2xvbmVJdGVtcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNDcmVhdGVkKSB7XG4gICAgICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLm51bVZpc2libGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXNwb25zaXZlT3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHROdW1WaXNpYmxlID0gdGhpcy5udW1WaXNpYmxlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQ2lyY3VsYXIoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENsb25lSXRlbXMoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVN0eWxlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLm51bVNjcm9sbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdE51bVNjcm9sbCA9IHRoaXMubnVtU2Nyb2xsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy5pZCA9IFVuaXF1ZUNvbXBvbmVudElkKCk7XG4gICAgICAgIHRoaXMuYWxsb3dBdXRvcGxheSA9ICEhdGhpcy5hdXRvcGxheUludGVydmFsO1xuXG4gICAgICAgIGlmICh0aGlzLmNpcmN1bGFyKSB7XG4gICAgICAgICAgICB0aGlzLnNldENsb25lSXRlbXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHROdW1TY3JvbGwgPSB0aGlzLl9udW1TY3JvbGw7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHROdW1WaXNpYmxlID0gdGhpcy5fbnVtVmlzaWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudExpc3RlbmVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2l0ZW0nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZm9vdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb290ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgICAgICBjb25zdCBpc0NpcmN1bGFyID0gdGhpcy5pc0NpcmN1bGFyKCk7XG4gICAgICAgIGxldCB0b3RhbFNoaWZ0ZWRJdGVtcyA9IHRoaXMudG90YWxTaGlmdGVkSXRlbXM7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy5pdGVtc0NvbnRhaW5lciAmJiAodGhpcy5wcmV2U3RhdGUubnVtU2Nyb2xsICE9PSB0aGlzLl9udW1TY3JvbGwgfHwgdGhpcy5wcmV2U3RhdGUubnVtVmlzaWJsZSAhPT0gdGhpcy5fbnVtVmlzaWJsZSB8fCB0aGlzLnByZXZTdGF0ZS52YWx1ZS5sZW5ndGggIT09IHRoaXMudmFsdWUubGVuZ3RoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcEF1dG9wbGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVtYWluaW5nSXRlbXMgPSAodGhpcy52YWx1ZS5sZW5ndGggLSB0aGlzLl9udW1WaXNpYmxlKSAlIHRoaXMuX251bVNjcm9sbDtcblxuICAgICAgICAgICAgbGV0IHBhZ2UgPSB0aGlzLl9wYWdlO1xuICAgICAgICAgICAgaWYgKHRoaXMudG90YWxEb3RzKCkgIT09IDAgJiYgcGFnZSA+PSB0aGlzLnRvdGFsRG90cygpKSB7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHRoaXMudG90YWxEb3RzKCkgLSAxO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSBwYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMub25QYWdlLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiB0aGlzLnBhZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgPSBwYWdlICogdGhpcy5fbnVtU2Nyb2xsICogLTE7XG4gICAgICAgICAgICBpZiAoaXNDaXJjdWxhcikge1xuICAgICAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zIC09IHRoaXMuX251bVZpc2libGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwYWdlID09PSB0aGlzLnRvdGFsRG90cygpIC0gMSAmJiB0aGlzLnJlbWFpbmluZ0l0ZW1zID4gMCkge1xuICAgICAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zICs9IC0xICogdGhpcy5yZW1haW5pbmdJdGVtcyArIHRoaXMuX251bVNjcm9sbDtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUmVtYWluaW5nSXRlbXNBZGRlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b3RhbFNoaWZ0ZWRJdGVtcyAhPT0gdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcykge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0b3RhbFNoaWZ0ZWRJdGVtcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fb2xkTnVtU2Nyb2xsID0gdGhpcy5fbnVtU2Nyb2xsO1xuICAgICAgICAgICAgdGhpcy5wcmV2U3RhdGUubnVtU2Nyb2xsID0gdGhpcy5fbnVtU2Nyb2xsO1xuICAgICAgICAgICAgdGhpcy5wcmV2U3RhdGUubnVtVmlzaWJsZSA9IHRoaXMuX251bVZpc2libGU7XG4gICAgICAgICAgICB0aGlzLnByZXZTdGF0ZS52YWx1ZSA9IFsuLi50aGlzLl92YWx1ZV07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsRG90cygpID4gMCAmJiB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gdGhpcy5pc1ZlcnRpY2FsKCkgPyBgdHJhbnNsYXRlM2QoMCwgJHt0b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAgLyB0aGlzLl9udW1WaXNpYmxlKX0lLCAwKWAgOiBgdHJhbnNsYXRlM2QoJHt0b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAgLyB0aGlzLl9udW1WaXNpYmxlKX0lLCAwLCAwKWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNDcmVhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCAmJiB0aGlzLmlzQXV0b3BsYXkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBdXRvcGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IC0xICogdGhpcy5fbnVtVmlzaWJsZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG90YWxTaGlmdGVkSXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IC0xICogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVtYWluaW5nSXRlbXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b3RhbFNoaWZ0ZWRJdGVtcyAhPT0gdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcykge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0b3RhbFNoaWZ0ZWRJdGVtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVN0eWxlKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2Fyb3VzZWxTdHlsZSkge1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbFN0eWxlID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbFN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmRvY3VtZW50LmhlYWQsIHRoaXMuY2Fyb3VzZWxTdHlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgIyR7dGhpcy5pZH0gLnAtY2Fyb3VzZWwtaXRlbSB7XG5cdFx0XHRcdGZsZXg6IDEgMCAkezEwMCAvIHRoaXMubnVtVmlzaWJsZX0lXG5cdFx0XHR9XG4gICAgICAgIGA7XG5cbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUxID0gZGF0YTEuYnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZTIgPSBkYXRhMi5icmVha3BvaW50O1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlMSA9PSBudWxsICYmIHZhbHVlMiAhPSBudWxsKSByZXN1bHQgPSAtMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZTEgIT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbCkgcmVzdWx0ID0gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZTEgPT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbCkgcmVzdWx0ID0gMDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUxID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgdmFsdWUyID09PSAnc3RyaW5nJykgcmVzdWx0ID0gdmFsdWUxLmxvY2FsZUNvbXBhcmUodmFsdWUyLCB1bmRlZmluZWQsIHsgbnVtZXJpYzogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICBlbHNlIHJlc3VsdCA9IHZhbHVlMSA8IHZhbHVlMiA/IC0xIDogdmFsdWUxID4gdmFsdWUyID8gMSA6IDA7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gLTEgKiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlc3BvbnNpdmVPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlcyA9IHRoaXMucmVzcG9uc2l2ZU9wdGlvbnNbaV07XG5cbiAgICAgICAgICAgICAgICBpbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgICAgICBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAke3Jlcy5icmVha3BvaW50fSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIyR7dGhpcy5pZH0gLnAtY2Fyb3VzZWwtaXRlbSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMSAwICR7MTAwIC8gcmVzLm51bVZpc2libGV9JVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2Fyb3VzZWxTdHlsZS50ZXh0Q29udGVudCA9IGlubmVySFRNTDtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaGVkUmVzcG9uc2l2ZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgbnVtVmlzaWJsZTogdGhpcy5kZWZhdWx0TnVtVmlzaWJsZSxcbiAgICAgICAgICAgICAgICBudW1TY3JvbGw6IHRoaXMuZGVmYXVsdE51bVNjcm9sbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlc3BvbnNpdmVPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSB0aGlzLnJlc3BvbnNpdmVPcHRpb25zW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUludChyZXMuYnJlYWtwb2ludCwgMTApID49IHdpbmRvd1dpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUmVzcG9uc2l2ZURhdGEgPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9udW1TY3JvbGwgIT09IG1hdGNoZWRSZXNwb25zaXZlRGF0YS5udW1TY3JvbGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHRoaXMuX3BhZ2U7XG4gICAgICAgICAgICAgICAgcGFnZSA9IE1hdGguZmxvb3IoKHBhZ2UgKiB0aGlzLl9udW1TY3JvbGwpIC8gbWF0Y2hlZFJlc3BvbnNpdmVEYXRhLm51bVNjcm9sbCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgdG90YWxTaGlmdGVkSXRlbXMgPSBtYXRjaGVkUmVzcG9uc2l2ZURhdGEubnVtU2Nyb2xsICogdGhpcy5wYWdlICogLTE7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0NpcmN1bGFyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgLT0gbWF0Y2hlZFJlc3BvbnNpdmVEYXRhLm51bVZpc2libGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyA9IHRvdGFsU2hpZnRlZEl0ZW1zO1xuICAgICAgICAgICAgICAgIHRoaXMuX251bVNjcm9sbCA9IG1hdGNoZWRSZXNwb25zaXZlRGF0YS5udW1TY3JvbGw7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9wYWdlID0gcGFnZTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGFnZS5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogdGhpcy5wYWdlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9udW1WaXNpYmxlICE9PSBtYXRjaGVkUmVzcG9uc2l2ZURhdGEubnVtVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX251bVZpc2libGUgPSBtYXRjaGVkUmVzcG9uc2l2ZURhdGEubnVtVmlzaWJsZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENsb25lSXRlbXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENsb25lSXRlbXMoKSB7XG4gICAgICAgIHRoaXMuY2xvbmVkSXRlbXNGb3JTdGFydGluZyA9IFtdO1xuICAgICAgICB0aGlzLmNsb25lZEl0ZW1zRm9yRmluaXNoaW5nID0gW107XG4gICAgICAgIGlmICh0aGlzLmlzQ2lyY3VsYXIoKSkge1xuICAgICAgICAgICAgdGhpcy5jbG9uZWRJdGVtc0ZvclN0YXJ0aW5nLnB1c2goLi4udGhpcy52YWx1ZS5zbGljZSgtMSAqIHRoaXMuX251bVZpc2libGUpKTtcbiAgICAgICAgICAgIHRoaXMuY2xvbmVkSXRlbXNGb3JGaW5pc2hpbmcucHVzaCguLi50aGlzLnZhbHVlLnNsaWNlKDAsIHRoaXMuX251bVZpc2libGUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpcnN0SW5kZXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQ2lyY3VsYXIoKSA/IC0xICogKHRoaXMudG90YWxTaGlmdGVkSXRlbXMgKyB0aGlzLm51bVZpc2libGUpIDogdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyAqIC0xO1xuICAgIH1cblxuICAgIGxhc3RJbmRleCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlyc3RJbmRleCgpICsgdGhpcy5udW1WaXNpYmxlIC0gMTtcbiAgICB9XG5cbiAgICB0b3RhbERvdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlPy5sZW5ndGggPyBNYXRoLmNlaWwoKHRoaXMudmFsdWUubGVuZ3RoIC0gdGhpcy5fbnVtVmlzaWJsZSkgLyB0aGlzLl9udW1TY3JvbGwpICsgMSA6IDA7XG4gICAgfVxuXG4gICAgdG90YWxEb3RzQXJyYXkoKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsRG90cyA9IHRoaXMudG90YWxEb3RzKCk7XG4gICAgICAgIHJldHVybiB0b3RhbERvdHMgPD0gMCA/IFtdIDogQXJyYXkodG90YWxEb3RzKS5maWxsKDApO1xuICAgIH1cblxuICAgIGlzVmVydGljYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnO1xuICAgIH1cblxuICAgIGlzQ2lyY3VsYXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNpcmN1bGFyICYmIHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGggPj0gdGhpcy5udW1WaXNpYmxlO1xuICAgIH1cblxuICAgIGlzQXV0b3BsYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dG9wbGF5SW50ZXJ2YWwgJiYgdGhpcy5hbGxvd0F1dG9wbGF5O1xuICAgIH1cblxuICAgIGlzRm9yd2FyZE5hdkRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0VtcHR5KCkgfHwgKHRoaXMuX3BhZ2UgPj0gdGhpcy50b3RhbERvdHMoKSAtIDEgJiYgIXRoaXMuaXNDaXJjdWxhcigpKTtcbiAgICB9XG5cbiAgICBpc0JhY2t3YXJkTmF2RGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRW1wdHkoKSB8fCAodGhpcy5fcGFnZSA8PSAwICYmICF0aGlzLmlzQ2lyY3VsYXIoKSk7XG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnZhbHVlIHx8IHRoaXMudmFsdWUubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIG5hdkZvcndhcmQoZSwgaW5kZXg/KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2lyY3VsYXIoKSB8fCB0aGlzLl9wYWdlIDwgdGhpcy50b3RhbERvdHMoKSAtIDEpIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcCgtMSwgaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQXV0b3BsYXkoKTtcbiAgICAgICAgICAgIHRoaXMuYWxsb3dBdXRvcGxheSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUgJiYgZS5jYW5jZWxhYmxlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuYXZCYWNrd2FyZChlLCBpbmRleD8pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDaXJjdWxhcigpIHx8IHRoaXMuX3BhZ2UgIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcCgxLCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdXRvcGxheUludGVydmFsKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBdXRvcGxheSgpO1xuICAgICAgICAgICAgdGhpcy5hbGxvd0F1dG9wbGF5ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZSAmJiBlLmNhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRG90Q2xpY2soZSwgaW5kZXgpIHtcbiAgICAgICAgbGV0IHBhZ2UgPSB0aGlzLl9wYWdlO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9wbGF5SW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEF1dG9wbGF5KCk7XG4gICAgICAgICAgICB0aGlzLmFsbG93QXV0b3BsYXkgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA+IHBhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMubmF2Rm9yd2FyZChlLCBpbmRleCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBwYWdlKSB7XG4gICAgICAgICAgICB0aGlzLm5hdkJhY2t3YXJkKGUsIGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0ZXAoZGlyLCBwYWdlKSB7XG4gICAgICAgIGxldCB0b3RhbFNoaWZ0ZWRJdGVtcyA9IHRoaXMudG90YWxTaGlmdGVkSXRlbXM7XG4gICAgICAgIGNvbnN0IGlzQ2lyY3VsYXIgPSB0aGlzLmlzQ2lyY3VsYXIoKTtcblxuICAgICAgICBpZiAocGFnZSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IHRoaXMuX251bVNjcm9sbCAqIHBhZ2UgKiAtMTtcblxuICAgICAgICAgICAgaWYgKGlzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyAtPSB0aGlzLl9udW1WaXNpYmxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlzUmVtYWluaW5nSXRlbXNBZGRlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgKz0gdGhpcy5fbnVtU2Nyb2xsICogZGlyO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkKSB7XG4gICAgICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgKz0gdGhpcy5yZW1haW5pbmdJdGVtcyAtIHRoaXMuX251bVNjcm9sbCAqIGRpcjtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUmVtYWluaW5nSXRlbXNBZGRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgb3JpZ2luYWxTaGlmdGVkSXRlbXMgPSBpc0NpcmN1bGFyID8gdG90YWxTaGlmdGVkSXRlbXMgKyB0aGlzLl9udW1WaXNpYmxlIDogdG90YWxTaGlmdGVkSXRlbXM7XG4gICAgICAgICAgICBwYWdlID0gTWF0aC5hYnMoTWF0aC5mbG9vcihvcmlnaW5hbFNoaWZ0ZWRJdGVtcyAvIHRoaXMuX251bVNjcm9sbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQ2lyY3VsYXIgJiYgdGhpcy5wYWdlID09PSB0aGlzLnRvdGFsRG90cygpIC0gMSAmJiBkaXIgPT09IC0xKSB7XG4gICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IC0xICogKHRoaXMudmFsdWUubGVuZ3RoICsgdGhpcy5fbnVtVmlzaWJsZSk7XG4gICAgICAgICAgICBwYWdlID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChpc0NpcmN1bGFyICYmIHRoaXMucGFnZSA9PT0gMCAmJiBkaXIgPT09IDEpIHtcbiAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zID0gMDtcbiAgICAgICAgICAgIHBhZ2UgPSB0aGlzLnRvdGFsRG90cygpIC0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChwYWdlID09PSB0aGlzLnRvdGFsRG90cygpIC0gMSAmJiB0aGlzLnJlbWFpbmluZ0l0ZW1zID4gMCkge1xuICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgKz0gdGhpcy5yZW1haW5pbmdJdGVtcyAqIC0xIC0gdGhpcy5fbnVtU2Nyb2xsICogZGlyO1xuICAgICAgICAgICAgdGhpcy5pc1JlbWFpbmluZ0l0ZW1zQWRkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXRlbXNDb250YWluZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSB0aGlzLmlzVmVydGljYWwoKSA/IGB0cmFuc2xhdGUzZCgwLCAke3RvdGFsU2hpZnRlZEl0ZW1zICogKDEwMCAvIHRoaXMuX251bVZpc2libGUpfSUsIDApYCA6IGB0cmFuc2xhdGUzZCgke3RvdGFsU2hpZnRlZEl0ZW1zICogKDEwMCAvIHRoaXMuX251bVZpc2libGUpfSUsIDAsIDApYDtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJ3RyYW5zZm9ybSA1MDBtcyBlYXNlIDBzJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0b3RhbFNoaWZ0ZWRJdGVtcztcbiAgICAgICAgdGhpcy5fcGFnZSA9IHBhZ2U7XG4gICAgICAgIHRoaXMub25QYWdlLmVtaXQoe1xuICAgICAgICAgICAgcGFnZTogdGhpcy5wYWdlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXJ0QXV0b3BsYXkoKSB7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy50b3RhbERvdHMoKSA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlID09PSB0aGlzLnRvdGFsRG90cygpIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZXAoLTEsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlcCgtMSwgdGhpcy5wYWdlICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLmF1dG9wbGF5SW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIHN0b3BBdXRvcGxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRyYW5zaXRpb25FbmQoKSB7XG4gICAgICAgIGlmICh0aGlzLml0ZW1zQ29udGFpbmVyKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICcnO1xuXG4gICAgICAgICAgICBpZiAoKHRoaXMucGFnZSA9PT0gMCB8fCB0aGlzLnBhZ2UgPT09IHRoaXMudG90YWxEb3RzKCkgLSAxKSAmJiB0aGlzLmlzQ2lyY3VsYXIoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSB0aGlzLmlzVmVydGljYWwoKSA/IGB0cmFuc2xhdGUzZCgwLCAke3RoaXMudG90YWxTaGlmdGVkSXRlbXMgKiAoMTAwIC8gdGhpcy5fbnVtVmlzaWJsZSl9JSwgMClgIDogYHRyYW5zbGF0ZTNkKCR7dGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAgLyB0aGlzLl9udW1WaXNpYmxlKX0lLCAwLCAwKWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvdWNoU3RhcnQoZSkge1xuICAgICAgICBsZXQgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgICAgIHRoaXMuc3RhcnRQb3MgPSB7XG4gICAgICAgICAgICB4OiB0b3VjaG9iai5wYWdlWCxcbiAgICAgICAgICAgIHk6IHRvdWNob2JqLnBhZ2VZXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25Ub3VjaE1vdmUoZSkge1xuICAgICAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25Ub3VjaEVuZChlKSB7XG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2VPblRvdWNoKGUsIHRvdWNob2JqLnBhZ2VZIC0gdGhpcy5zdGFydFBvcy55KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFnZU9uVG91Y2goZSwgdG91Y2hvYmoucGFnZVggLSB0aGlzLnN0YXJ0UG9zLngpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhbmdlUGFnZU9uVG91Y2goZSwgZGlmZikge1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZikgPiB0aGlzLnN3aXBlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5hdkZvcndhcmQoZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubmF2QmFja3dhcmQoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMud2luZG93LCAncmVzaXplJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50TGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hdXRvcGxheUludGVydmFsKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBdXRvcGxheSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFNoYXJlZE1vZHVsZSwgUmlwcGxlTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDYXJvdXNlbCwgU2hhcmVkTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtDYXJvdXNlbF1cbn0pXG5leHBvcnQgY2xhc3MgQ2Fyb3VzZWxNb2R1bGUge31cbiJdfQ==