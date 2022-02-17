import { ElementRef, AfterContentInit, TemplateRef, QueryList, NgZone, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
import * as i3 from "primeng/ripple";
export declare class Carousel implements AfterContentInit {
    el: ElementRef;
    zone: NgZone;
    cd: ChangeDetectorRef;
    get page(): number;
    set page(val: number);
    get numVisible(): number;
    set numVisible(val: number);
    get numScroll(): number;
    set numScroll(val: number);
    responsiveOptions: any[];
    orientation: string;
    verticalViewPortHeight: string;
    contentClass: string;
    indicatorsContentClass: string;
    indicatorsContentStyle: any;
    indicatorStyleClass: string;
    indicatorStyle: any;
    get value(): any[];
    set value(val: any[]);
    circular: boolean;
    showIndicators: boolean;
    showNavigators: boolean;
    autoplayInterval: number;
    style: any;
    styleClass: string;
    onPage: EventEmitter<any>;
    itemsContainer: ElementRef;
    headerFacet: any;
    footerFacet: any;
    templates: QueryList<any>;
    _numVisible: number;
    _numScroll: number;
    _oldNumScroll: number;
    prevState: any;
    defaultNumScroll: number;
    defaultNumVisible: number;
    _page: number;
    _value: any[];
    carouselStyle: any;
    id: string;
    totalShiftedItems: any;
    isRemainingItemsAdded: boolean;
    animationTimeout: any;
    translateTimeout: any;
    remainingItems: number;
    _items: any[];
    startPos: any;
    documentResizeListener: any;
    clonedItemsForStarting: any[];
    clonedItemsForFinishing: any[];
    allowAutoplay: boolean;
    interval: any;
    isCreated: boolean;
    swipeThreshold: number;
    itemTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    footerTemplate: TemplateRef<any>;
    constructor(el: ElementRef, zone: NgZone, cd: ChangeDetectorRef);
    ngOnChanges(simpleChange: SimpleChanges): void;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    createStyle(): void;
    calculatePosition(): void;
    setCloneItems(): void;
    firstIndex(): number;
    lastIndex(): number;
    totalDots(): number;
    totalDotsArray(): any[];
    isVertical(): boolean;
    isCircular(): boolean;
    isAutoplay(): boolean;
    isForwardNavDisabled(): boolean;
    isBackwardNavDisabled(): boolean;
    isEmpty(): boolean;
    navForward(e: any, index?: any): void;
    navBackward(e: any, index?: any): void;
    onDotClick(e: any, index: any): void;
    step(dir: any, page: any): void;
    startAutoplay(): void;
    stopAutoplay(): void;
    onTransitionEnd(): void;
    onTouchStart(e: any): void;
    onTouchMove(e: any): void;
    onTouchEnd(e: any): void;
    changePageOnTouch(e: any, diff: any): void;
    bindDocumentListeners(): void;
    unbindDocumentListeners(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Carousel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Carousel, "p-carousel", never, { "page": "page"; "numVisible": "numVisible"; "numScroll": "numScroll"; "responsiveOptions": "responsiveOptions"; "orientation": "orientation"; "verticalViewPortHeight": "verticalViewPortHeight"; "contentClass": "contentClass"; "indicatorsContentClass": "indicatorsContentClass"; "indicatorsContentStyle": "indicatorsContentStyle"; "indicatorStyleClass": "indicatorStyleClass"; "indicatorStyle": "indicatorStyle"; "value": "value"; "circular": "circular"; "showIndicators": "showIndicators"; "showNavigators": "showNavigators"; "autoplayInterval": "autoplayInterval"; "style": "style"; "styleClass": "styleClass"; }, { "onPage": "onPage"; }, ["headerFacet", "footerFacet", "templates"], ["p-header", "p-footer"]>;
}
export declare class CarouselModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CarouselModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CarouselModule, [typeof Carousel], [typeof i1.CommonModule, typeof i2.SharedModule, typeof i3.RippleModule], [typeof i1.CommonModule, typeof Carousel, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CarouselModule>;
}
