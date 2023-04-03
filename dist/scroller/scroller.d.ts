import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, QueryList, Renderer2, SimpleChanges, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
export declare type ScrollerToType = 'to-start' | 'to-end' | undefined;
export declare type ScrollerOrientationType = 'vertical' | 'horizontal' | 'both';
export interface ScrollerOptions {
    id?: string | undefined;
    style?: any;
    styleClass?: string | undefined;
    tabindex?: number | undefined;
    items?: any[];
    itemSize?: any;
    scrollHeight?: string | undefined;
    scrollWidth?: string | undefined;
    orientation?: ScrollerOrientationType;
    step?: number | undefined;
    delay?: number | undefined;
    resizeDelay?: number | undefined;
    appendOnly?: boolean;
    inline?: boolean;
    lazy?: boolean;
    disabled?: boolean;
    loaderDisabled?: boolean;
    columns?: any[] | undefined;
    showSpacer?: boolean;
    showLoader?: boolean;
    numToleratedItems?: any;
    loading?: boolean;
    autoSize?: boolean;
    trackBy?: any;
    onLazyLoad?: Function | undefined;
    onScroll?: Function | undefined;
    onScrollIndexChange?: Function | undefined;
}
export declare class Scroller implements OnInit, AfterContentInit, AfterViewChecked, OnDestroy {
    private document;
    private platformId;
    private renderer;
    private cd;
    private zone;
    get id(): string;
    set id(val: string);
    get style(): any;
    set style(val: any);
    get styleClass(): string;
    set styleClass(val: string);
    get tabindex(): number;
    set tabindex(val: number);
    get items(): any[];
    set items(val: any[]);
    get itemSize(): any;
    set itemSize(val: any);
    get scrollHeight(): string;
    set scrollHeight(val: string);
    get scrollWidth(): string;
    set scrollWidth(val: string);
    get orientation(): string;
    set orientation(val: string);
    get step(): number;
    set step(val: number);
    get delay(): number;
    set delay(val: number);
    get resizeDelay(): number;
    set resizeDelay(val: number);
    get appendOnly(): boolean;
    set appendOnly(val: boolean);
    get inline(): boolean;
    set inline(val: boolean);
    get lazy(): boolean;
    set lazy(val: boolean);
    get disabled(): boolean;
    set disabled(val: boolean);
    get loaderDisabled(): boolean;
    set loaderDisabled(val: boolean);
    get columns(): any[];
    set columns(val: any[]);
    get showSpacer(): boolean;
    set showSpacer(val: boolean);
    get showLoader(): boolean;
    set showLoader(val: boolean);
    get numToleratedItems(): number;
    set numToleratedItems(val: number);
    get loading(): boolean;
    set loading(val: boolean);
    get autoSize(): boolean;
    set autoSize(val: boolean);
    get trackBy(): any;
    set trackBy(val: any);
    get options(): ScrollerOptions;
    set options(val: ScrollerOptions);
    elementViewChild: ElementRef;
    contentViewChild: ElementRef;
    templates: QueryList<any>;
    onLazyLoad: EventEmitter<any>;
    onScroll: EventEmitter<any>;
    onScrollIndexChange: EventEmitter<any>;
    _id: string;
    _style: any;
    _styleClass: string;
    _tabindex: number;
    _items: any[];
    _itemSize: any;
    _scrollHeight: string;
    _scrollWidth: string;
    _orientation: string;
    _step: number;
    _delay: number;
    _resizeDelay: number;
    _appendOnly: boolean;
    _inline: boolean;
    _lazy: boolean;
    _disabled: boolean;
    _loaderDisabled: boolean;
    _columns: any[];
    _showSpacer: boolean;
    _showLoader: boolean;
    _numToleratedItems: any;
    _loading: boolean;
    _autoSize: boolean;
    _trackBy: any;
    _options: ScrollerOptions;
    d_loading: boolean;
    d_numToleratedItems: any;
    contentEl: any;
    contentTemplate: TemplateRef<any>;
    itemTemplate: TemplateRef<any>;
    loaderTemplate: TemplateRef<any>;
    loaderIconTemplate: TemplateRef<any>;
    first: any;
    last: any;
    page: number;
    isRangeChanged: boolean;
    numItemsInViewport: any;
    lastScrollPos: any;
    lazyLoadState: any;
    loaderArr: any[];
    spacerStyle: any;
    contentStyle: any;
    scrollTimeout: any;
    resizeTimeout: any;
    initialized: boolean;
    windowResizeListener: VoidFunction | null;
    defaultWidth: number;
    defaultHeight: number;
    defaultContentWidth: number;
    defaultContentHeight: number;
    get vertical(): boolean;
    get horizontal(): boolean;
    get both(): boolean;
    get loadedItems(): any[];
    get loadedRows(): any[];
    get loadedColumns(): any;
    get isPageChanged(): boolean;
    constructor(document: Document, platformId: any, renderer: Renderer2, cd: ChangeDetectorRef, zone: NgZone);
    ngOnInit(): void;
    ngOnChanges(simpleChanges: SimpleChanges): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    viewInit(): void;
    init(): void;
    setContentEl(el?: HTMLElement): void;
    setInitialState(): void;
    getElementRef(): ElementRef<any>;
    getPageByFirst(): number;
    scrollTo(options: ScrollToOptions): void;
    scrollToIndex(index: number, behavior?: ScrollBehavior): void;
    scrollInView(index: number, to: ScrollerToType, behavior?: ScrollBehavior): void;
    getRenderedRange(): {
        first: any;
        last: any;
        viewport: {
            first: any;
            last: any;
        };
    };
    calculateNumItems(): {
        numItemsInViewport: any;
        numToleratedItems: any;
    };
    calculateOptions(): void;
    calculateAutoSize(): void;
    getLast(last?: number, isCols?: boolean): number;
    getContentPosition(): {
        left: number;
        right: number;
        top: number;
        bottom: number;
        x: number;
        y: number;
    };
    setSize(): void;
    setSpacerSize(): void;
    setContentPosition(pos: any): void;
    onScrollPositionChange(event: any): {
        first: number | {
            rows: number;
            cols: number;
        };
        last: any;
        isRangeChanged: boolean;
        scrollPos: any;
    };
    onScrollChange(event: any): void;
    onContainerScroll(event: any): void;
    bindResizeListener(): void;
    unbindResizeListener(): void;
    onWindowResize(): void;
    handleEvents(name: any, params: any): any;
    getContentOptions(): {
        contentStyleClass: string;
        items: any[];
        getItemOptions: (index: any) => {
            index: any;
            count: number;
            first: boolean;
            last: boolean;
            even: boolean;
            odd: boolean;
        };
        loading: boolean;
        getLoaderOptions: (index: any, options?: any) => any;
        itemSize: any;
        rows: any[];
        columns: any;
        spacerStyle: any;
        contentStyle: any;
        vertical: boolean;
        horizontal: boolean;
        both: boolean;
    };
    getOptions(renderedIndex: any): {
        index: any;
        count: number;
        first: boolean;
        last: boolean;
        even: boolean;
        odd: boolean;
    };
    getLoaderOptions(index: any, extOptions: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<Scroller, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Scroller, "p-scroller", never, { "id": "id"; "style": "style"; "styleClass": "styleClass"; "tabindex": "tabindex"; "items": "items"; "itemSize": "itemSize"; "scrollHeight": "scrollHeight"; "scrollWidth": "scrollWidth"; "orientation": "orientation"; "step": "step"; "delay": "delay"; "resizeDelay": "resizeDelay"; "appendOnly": "appendOnly"; "inline": "inline"; "lazy": "lazy"; "disabled": "disabled"; "loaderDisabled": "loaderDisabled"; "columns": "columns"; "showSpacer": "showSpacer"; "showLoader": "showLoader"; "numToleratedItems": "numToleratedItems"; "loading": "loading"; "autoSize": "autoSize"; "trackBy": "trackBy"; "options": "options"; }, { "onLazyLoad": "onLazyLoad"; "onScroll": "onScroll"; "onScrollIndexChange": "onScrollIndexChange"; }, ["templates"], ["*"], false, never>;
}
export declare class ScrollerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ScrollerModule, [typeof Scroller], [typeof i1.CommonModule, typeof i2.SharedModule], [typeof Scroller, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ScrollerModule>;
}
