import { ElementRef, OnDestroy, EventEmitter, QueryList, TemplateRef, OnInit, OnChanges, AfterContentChecked, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AnimationEvent } from '@angular/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
import * as i3 from "primeng/ripple";
export declare class Galleria implements OnChanges, OnDestroy {
    element: ElementRef;
    cd: ChangeDetectorRef;
    config: PrimeNGConfig;
    get activeIndex(): number;
    set activeIndex(activeIndex: number);
    fullScreen: boolean;
    id: string;
    value: any[];
    numVisible: number;
    responsiveOptions: any[];
    showItemNavigators: boolean;
    showThumbnailNavigators: boolean;
    showItemNavigatorsOnHover: boolean;
    changeItemOnIndicatorHover: boolean;
    circular: boolean;
    autoPlay: boolean;
    transitionInterval: number;
    showThumbnails: boolean;
    thumbnailsPosition: string;
    verticalThumbnailViewPortHeight: string;
    showIndicators: boolean;
    showIndicatorsOnItem: boolean;
    indicatorsPosition: string;
    baseZIndex: number;
    maskClass: string;
    containerClass: string;
    containerStyle: any;
    showTransitionOptions: string;
    hideTransitionOptions: string;
    mask: ElementRef;
    get visible(): boolean;
    set visible(visible: boolean);
    activeIndexChange: EventEmitter<any>;
    visibleChange: EventEmitter<any>;
    templates: QueryList<any>;
    _visible: boolean;
    _activeIndex: number;
    headerFacet: any;
    footerFacet: any;
    indicatorFacet: any;
    captionFacet: any;
    maskVisible: boolean;
    constructor(element: ElementRef, cd: ChangeDetectorRef, config: PrimeNGConfig);
    ngAfterContentInit(): void;
    ngOnChanges(simpleChanges: SimpleChanges): void;
    onMaskHide(): void;
    onActiveItemChange(index: any): void;
    onAnimationStart(event: AnimationEvent): void;
    onAnimationEnd(event: AnimationEvent): void;
    enableModality(): void;
    disableModality(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Galleria, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Galleria, "p-galleria", never, { "activeIndex": "activeIndex"; "fullScreen": "fullScreen"; "id": "id"; "value": "value"; "numVisible": "numVisible"; "responsiveOptions": "responsiveOptions"; "showItemNavigators": "showItemNavigators"; "showThumbnailNavigators": "showThumbnailNavigators"; "showItemNavigatorsOnHover": "showItemNavigatorsOnHover"; "changeItemOnIndicatorHover": "changeItemOnIndicatorHover"; "circular": "circular"; "autoPlay": "autoPlay"; "transitionInterval": "transitionInterval"; "showThumbnails": "showThumbnails"; "thumbnailsPosition": "thumbnailsPosition"; "verticalThumbnailViewPortHeight": "verticalThumbnailViewPortHeight"; "showIndicators": "showIndicators"; "showIndicatorsOnItem": "showIndicatorsOnItem"; "indicatorsPosition": "indicatorsPosition"; "baseZIndex": "baseZIndex"; "maskClass": "maskClass"; "containerClass": "containerClass"; "containerStyle": "containerStyle"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; "visible": "visible"; }, { "activeIndexChange": "activeIndexChange"; "visibleChange": "visibleChange"; }, ["templates"], never>;
}
export declare class GalleriaContent {
    galleria: Galleria;
    cd: ChangeDetectorRef;
    get activeIndex(): number;
    set activeIndex(activeIndex: number);
    value: any[];
    numVisible: number;
    maskHide: EventEmitter<any>;
    activeItemChange: EventEmitter<any>;
    id: string;
    slideShowActicve: boolean;
    _activeIndex: number;
    slideShowActive: boolean;
    interval: any;
    styleClass: string;
    constructor(galleria: Galleria, cd: ChangeDetectorRef);
    galleriaClass(): string;
    startSlideShow(): void;
    stopSlideShow(): void;
    getPositionClass(preClassName: any, position: any): string;
    isVertical(): boolean;
    onActiveIndexChange(index: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GalleriaContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GalleriaContent, "p-galleriaContent", never, { "activeIndex": "activeIndex"; "value": "value"; "numVisible": "numVisible"; }, { "maskHide": "maskHide"; "activeItemChange": "activeItemChange"; }, never, never>;
}
export declare class GalleriaItemSlot {
    templates: QueryList<any>;
    index: number;
    get item(): any;
    set item(item: any);
    type: string;
    contentTemplate: TemplateRef<any>;
    context: any;
    _item: any;
    ngAfterContentInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GalleriaItemSlot, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GalleriaItemSlot, "p-galleriaItemSlot", never, { "templates": "templates"; "index": "index"; "item": "item"; "type": "type"; }, {}, never, never>;
}
export declare class GalleriaItem implements OnInit {
    circular: boolean;
    value: any[];
    showItemNavigators: boolean;
    showIndicators: boolean;
    slideShowActive: boolean;
    changeItemOnIndicatorHover: boolean;
    autoPlay: boolean;
    templates: QueryList<any>;
    indicatorFacet: any;
    captionFacet: any;
    startSlideShow: EventEmitter<any>;
    stopSlideShow: EventEmitter<any>;
    onActiveIndexChange: EventEmitter<any>;
    get activeIndex(): number;
    set activeIndex(activeIndex: number);
    _activeIndex: number;
    activeItem: any;
    ngOnInit(): void;
    next(): void;
    prev(): void;
    stopTheSlideShow(): void;
    navForward(e: any): void;
    navBackward(e: any): void;
    onIndicatorClick(index: any): void;
    onIndicatorMouseEnter(index: any): void;
    onIndicatorKeyDown(index: any): void;
    isNavForwardDisabled(): boolean;
    isNavBackwardDisabled(): boolean;
    isIndicatorItemActive(index: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<GalleriaItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GalleriaItem, "p-galleriaItem", never, { "circular": "circular"; "value": "value"; "showItemNavigators": "showItemNavigators"; "showIndicators": "showIndicators"; "slideShowActive": "slideShowActive"; "changeItemOnIndicatorHover": "changeItemOnIndicatorHover"; "autoPlay": "autoPlay"; "templates": "templates"; "indicatorFacet": "indicatorFacet"; "captionFacet": "captionFacet"; "activeIndex": "activeIndex"; }, { "startSlideShow": "startSlideShow"; "stopSlideShow": "stopSlideShow"; "onActiveIndexChange": "onActiveIndexChange"; }, never, never>;
}
export declare class GalleriaThumbnails implements OnInit, AfterContentChecked, AfterViewInit, OnDestroy {
    private cd;
    containerId: string;
    value: any[];
    isVertical: boolean;
    slideShowActive: boolean;
    circular: boolean;
    responsiveOptions: any[];
    contentHeight: string;
    showThumbnailNavigators: boolean;
    templates: QueryList<any>;
    onActiveIndexChange: EventEmitter<any>;
    stopSlideShow: EventEmitter<any>;
    itemsContainer: ElementRef;
    get numVisible(): number;
    set numVisible(numVisible: number);
    get activeIndex(): number;
    set activeIndex(activeIndex: number);
    index: number;
    startPos: any;
    thumbnailsStyle: any;
    sortedResponsiveOptions: any;
    totalShiftedItems: number;
    page: number;
    documentResizeListener: any;
    _numVisible: number;
    d_numVisible: number;
    _oldNumVisible: number;
    _activeIndex: number;
    _oldactiveIndex: number;
    constructor(cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    createStyle(): void;
    calculatePosition(): void;
    getTabIndex(index: any): number;
    navForward(e: any): void;
    navBackward(e: any): void;
    onItemClick(index: any): void;
    step(dir: any): void;
    stopTheSlideShow(): void;
    changePageOnTouch(e: any, diff: any): void;
    getTotalPageNumber(): number;
    getMedianItemIndex(): number;
    onTransitionEnd(): void;
    onTouchEnd(e: any): void;
    onTouchMove(e: any): void;
    onTouchStart(e: any): void;
    isNavBackwardDisabled(): boolean;
    isNavForwardDisabled(): boolean;
    firstItemAciveIndex(): number;
    lastItemActiveIndex(): number;
    isItemActive(index: any): boolean;
    bindDocumentListeners(): void;
    unbindDocumentListeners(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GalleriaThumbnails, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GalleriaThumbnails, "p-galleriaThumbnails", never, { "containerId": "containerId"; "value": "value"; "isVertical": "isVertical"; "slideShowActive": "slideShowActive"; "circular": "circular"; "responsiveOptions": "responsiveOptions"; "contentHeight": "contentHeight"; "showThumbnailNavigators": "showThumbnailNavigators"; "templates": "templates"; "numVisible": "numVisible"; "activeIndex": "activeIndex"; }, { "onActiveIndexChange": "onActiveIndexChange"; "stopSlideShow": "stopSlideShow"; }, never, never>;
}
export declare class GalleriaModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<GalleriaModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<GalleriaModule, [typeof Galleria, typeof GalleriaContent, typeof GalleriaItemSlot, typeof GalleriaItem, typeof GalleriaThumbnails], [typeof i1.CommonModule, typeof i2.SharedModule, typeof i3.RippleModule], [typeof i1.CommonModule, typeof Galleria, typeof GalleriaContent, typeof GalleriaItemSlot, typeof GalleriaItem, typeof GalleriaThumbnails, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<GalleriaModule>;
}
