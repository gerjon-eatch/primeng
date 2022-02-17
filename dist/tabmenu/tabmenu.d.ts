import { QueryList, AfterContentInit, AfterViewInit, AfterViewChecked, TemplateRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/api";
import * as i4 from "primeng/ripple";
import * as i5 from "primeng/tooltip";
export declare class TabMenu implements AfterContentInit, AfterViewInit, AfterViewChecked {
    private router;
    private route;
    private cd;
    model: MenuItem[];
    activeItem: MenuItem;
    scrollable: boolean;
    popup: boolean;
    style: any;
    styleClass: string;
    content: ElementRef;
    navbar: ElementRef;
    inkbar: ElementRef;
    prevBtn: ElementRef;
    nextBtn: ElementRef;
    templates: QueryList<any>;
    itemTemplate: TemplateRef<any>;
    tabChanged: boolean;
    backwardIsDisabled: boolean;
    forwardIsDisabled: boolean;
    constructor(router: Router, route: ActivatedRoute, cd: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    isActive(item: MenuItem): boolean;
    itemClick(event: Event, item: MenuItem): void;
    updateInkBar(): void;
    getVisibleButtonWidths(): any;
    updateButtonState(): void;
    updateScrollBar(index: any): void;
    onScroll(event: any): void;
    navBackward(): void;
    navForward(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabMenu, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TabMenu, "p-tabMenu", never, { "model": "model"; "activeItem": "activeItem"; "scrollable": "scrollable"; "popup": "popup"; "style": "style"; "styleClass": "styleClass"; }, {}, ["templates"], never>;
}
export declare class TabMenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<TabMenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TabMenuModule, [typeof TabMenu], [typeof i1.CommonModule, typeof i2.RouterModule, typeof i3.SharedModule, typeof i4.RippleModule, typeof i5.TooltipModule], [typeof TabMenu, typeof i2.RouterModule, typeof i3.SharedModule, typeof i5.TooltipModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TabMenuModule>;
}
