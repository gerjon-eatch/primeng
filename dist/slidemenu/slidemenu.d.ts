import { ElementRef, AfterViewChecked, OnDestroy, Renderer2, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { MenuItem, OverlayService, PrimeNGConfig } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/tooltip";
export declare class SlideMenuSub implements OnDestroy {
    item: MenuItem;
    root: boolean;
    backLabel: string;
    menuWidth: number;
    effectDuration: any;
    easing: string;
    index: number;
    sublistViewChild: ElementRef;
    slideMenu: SlideMenu;
    transitionEndListener: any;
    constructor(slideMenu: any);
    activeItem: any;
    itemClick(event: any, item: MenuItem, listitem: any): void;
    focusNextList(listitem: any): void;
    onItemKeyDown(event: any): void;
    unbindTransitionEndListener(): void;
    ngOnDestroy(): void;
    get isActive(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<SlideMenuSub, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SlideMenuSub, "p-slideMenuSub", never, { "item": "item"; "root": "root"; "backLabel": "backLabel"; "menuWidth": "menuWidth"; "effectDuration": "effectDuration"; "easing": "easing"; "index": "index"; }, {}, never, never>;
}
export declare class SlideMenu implements AfterViewChecked, OnDestroy {
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    config: PrimeNGConfig;
    overlayService: OverlayService;
    model: MenuItem[];
    popup: boolean;
    style: any;
    styleClass: string;
    menuWidth: number;
    viewportHeight: number;
    effectDuration: any;
    easing: string;
    backLabel: string;
    appendTo: any;
    autoZIndex: boolean;
    baseZIndex: number;
    showTransitionOptions: string;
    hideTransitionOptions: string;
    onShow: EventEmitter<any>;
    onHide: EventEmitter<any>;
    containerViewChild: ElementRef;
    backwardViewChild: ElementRef;
    slideMenuContentViewChild: ElementRef;
    documentClickListener: any;
    documentResizeListener: any;
    preventDocumentDefault: boolean;
    scrollHandler: any;
    left: number;
    animating: boolean;
    target: any;
    visible: boolean;
    viewportUpdated: boolean;
    constructor(el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, config: PrimeNGConfig, overlayService: OverlayService);
    ngAfterViewChecked(): void;
    set container(element: ElementRef);
    set backward(element: ElementRef);
    set slideMenuContent(element: ElementRef);
    updateViewPort(): void;
    toggle(event: any): void;
    show(event: any): void;
    onOverlayClick(event: any): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    onOverlayAnimationEnd(event: AnimationEvent): void;
    appendOverlay(): void;
    restoreOverlayAppend(): void;
    moveOnTop(): void;
    hide(): void;
    onWindowResize(): void;
    goBack(): void;
    onBackwardKeydown(event: any): void;
    bindDocumentClickListener(): void;
    unbindDocumentClickListener(): void;
    bindDocumentResizeListener(): void;
    unbindDocumentResizeListener(): void;
    bindScrollListener(): void;
    unbindScrollListener(): void;
    onOverlayHide(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SlideMenu, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SlideMenu, "p-slideMenu", never, { "model": "model"; "popup": "popup"; "style": "style"; "styleClass": "styleClass"; "menuWidth": "menuWidth"; "viewportHeight": "viewportHeight"; "effectDuration": "effectDuration"; "easing": "easing"; "backLabel": "backLabel"; "appendTo": "appendTo"; "autoZIndex": "autoZIndex"; "baseZIndex": "baseZIndex"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; }, { "onShow": "onShow"; "onHide": "onHide"; }, never, never>;
}
export declare class SlideMenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<SlideMenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<SlideMenuModule, [typeof SlideMenu, typeof SlideMenuSub], [typeof i1.CommonModule, typeof i2.RouterModule, typeof i3.TooltipModule], [typeof SlideMenu, typeof i2.RouterModule, typeof i3.TooltipModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<SlideMenuModule>;
}
