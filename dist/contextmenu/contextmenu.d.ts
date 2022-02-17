import { ElementRef, AfterViewInit, OnDestroy, Renderer2, NgZone, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MenuItem, ContextMenuService, PrimeNGConfig } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
export declare class ContextMenuSub {
    item: MenuItem;
    root: boolean;
    parentItemKey: any;
    leafClick: EventEmitter<any>;
    sublistViewChild: ElementRef;
    menuitemViewChild: ElementRef;
    contextMenu: ContextMenu;
    activeItemKey: string;
    hideTimeout: any;
    activeItemKeyChangeSubscription: Subscription;
    constructor(contextMenu: any);
    ngOnInit(): void;
    onItemMouseEnter(event: any, item: any, key: any): void;
    onItemMouseLeave(event: any, item: any): void;
    onItemClick(event: any, item: any, menuitem: any, key: any): void;
    onLeafClick(): void;
    getKey(index: any): string;
    isActive(key: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenuSub, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContextMenuSub, "p-contextMenuSub", never, { "item": "item"; "root": "root"; "parentItemKey": "parentItemKey"; }, { "leafClick": "leafClick"; }, never, never>;
}
export declare class ContextMenu implements AfterViewInit, OnDestroy {
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    zone: NgZone;
    contextMenuService: ContextMenuService;
    private config;
    model: MenuItem[];
    global: boolean;
    target: any;
    style: any;
    styleClass: string;
    appendTo: any;
    autoZIndex: boolean;
    baseZIndex: number;
    triggerEvent: string;
    onShow: EventEmitter<any>;
    onHide: EventEmitter<any>;
    containerViewChild: ElementRef;
    documentClickListener: any;
    documentTriggerListener: any;
    documentKeydownListener: any;
    windowResizeListener: any;
    triggerEventListener: any;
    ngDestroy$: Subject<unknown>;
    preventDocumentDefault: boolean;
    constructor(el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, zone: NgZone, contextMenuService: ContextMenuService, config: PrimeNGConfig);
    ngAfterViewInit(): void;
    show(event?: MouseEvent): void;
    hide(): void;
    moveOnTop(): void;
    toggle(event?: MouseEvent): void;
    position(event?: MouseEvent): void;
    positionSubmenu(sublist: any): void;
    isItemMatched(menuitem: any): boolean;
    findNextItem(menuitem: any, isRepeated?: any): any;
    findPrevItem(menuitem: any, isRepeated?: any): any;
    getActiveItem(): any;
    clearActiveItem(): void;
    removeActiveFromSubLists(el: any): void;
    removeActiveFromSublist(menuitem: any): void;
    bindGlobalListeners(): void;
    findModelItemFromKey(key: any): any;
    handleItemClick(event: any, item: any, menuitem: any): void;
    unbindGlobalListeners(): void;
    onWindowResize(event: any): void;
    isOutsideClicked(event: Event): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenu, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContextMenu, "p-contextMenu", never, { "model": "model"; "global": "global"; "target": "target"; "style": "style"; "styleClass": "styleClass"; "appendTo": "appendTo"; "autoZIndex": "autoZIndex"; "baseZIndex": "baseZIndex"; "triggerEvent": "triggerEvent"; }, { "onShow": "onShow"; "onHide": "onHide"; }, never, never>;
}
export declare class ContextMenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ContextMenuModule, [typeof ContextMenu, typeof ContextMenuSub], [typeof i1.CommonModule, typeof i2.RouterModule, typeof i3.RippleModule, typeof i4.TooltipModule], [typeof ContextMenu, typeof i2.RouterModule, typeof i4.TooltipModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ContextMenuModule>;
}
