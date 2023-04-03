import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
export class MegaMenu {
    constructor(document, platformId, el, renderer, cd) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.orientation = 'horizontal';
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'start':
                    this.startTemplate = item.template;
                    break;
                case 'end':
                    this.endTemplate = item.template;
                    break;
            }
        });
    }
    onCategoryMouseEnter(event, menuitem) {
        if (menuitem.disabled) {
            event.preventDefault();
            return;
        }
        if (this.activeItem) {
            this.activeItem = menuitem;
        }
    }
    onCategoryClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (item.items) {
            if (this.activeItem && this.activeItem === item) {
                this.activeItem = null;
                this.unbindDocumentClickListener();
            }
            else {
                this.activeItem = item;
                this.bindDocumentClickListener();
            }
        }
    }
    itemClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        this.activeItem = null;
    }
    getColumnClass(menuitem) {
        let length = menuitem.items ? menuitem.items.length : 0;
        let columnClass;
        switch (length) {
            case 2:
                columnClass = 'p-megamenu-col-6';
                break;
            case 3:
                columnClass = 'p-megamenu-col-4';
                break;
            case 4:
                columnClass = 'p-megamenu-col-3';
                break;
            case 6:
                columnClass = 'p-megamenu-col-2';
                break;
            default:
                columnClass = 'p-megamenu-col-12';
                break;
        }
        return columnClass;
    }
    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener) {
                this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    if (this.el && !this.el.nativeElement.contains(event.target)) {
                        this.activeItem = null;
                        this.unbindDocumentClickListener();
                        this.cd.markForCheck();
                    }
                });
            }
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
}
MegaMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: MegaMenu, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
MegaMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: MegaMenu, selector: "p-megaMenu", inputs: { model: "model", style: "style", styleClass: "styleClass", orientation: "orientation" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="{ 'p-megamenu p-component': true, 'p-megamenu-horizontal': orientation == 'horizontal', 'p-megamenu-vertical': orientation == 'vertical' }">
            <div class="p-megamenu-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <ul class="p-megamenu-root-list" role="menubar">
                <ng-template ngFor let-category [ngForOf]="model">
                    <li *ngIf="category.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': category.visible === false }"></li>
                    <li
                        *ngIf="!category.separator"
                        [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': category == activeItem, 'p-hidden': category.visible === false }"
                        pTooltip
                        [tooltipOptions]="category.tooltipOptions"
                        (mouseenter)="onCategoryMouseEnter($event, category)"
                    >
                        <a
                            *ngIf="!category.routerLink"
                            [href]="category.url || '#'"
                            [target]="category.target"
                            [attr.title]="category.title"
                            [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)"
                            [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': category.disabled }"
                            [ngStyle]="category.style"
                            [class]="category.styleClass"
                            pRipple
                        >
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlLabel">{{ category.label }}</span>
                            <ng-template #categoryHtmlLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="category.badge" [ngClass]="category.badgeStyleClass">{{ category.badge }}</span>
                            <span *ngIf="category.items" class="p-submenu-icon pi" [ngClass]="{ 'pi-angle-down': orientation == 'horizontal', 'pi-angle-right': orientation == 'vertical' }"></span>
                        </a>
                        <a
                            *ngIf="category.routerLink"
                            [routerLink]="category.routerLink"
                            [queryParams]="category.queryParams"
                            [routerLinkActive]="'p-menuitem-link-active'"
                            [routerLinkActiveOptions]="category.routerLinkActiveOptions || { exact: false }"
                            [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [target]="category.target"
                            [attr.title]="category.title"
                            [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)"
                            [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': category.disabled }"
                            [ngStyle]="category.style"
                            [class]="category.styleClass"
                            [fragment]="category.fragment"
                            [queryParamsHandling]="category.queryParamsHandling"
                            [preserveFragment]="category.preserveFragment"
                            [skipLocationChange]="category.skipLocationChange"
                            [replaceUrl]="category.replaceUrl"
                            [state]="category.state"
                            pRipple
                        >
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlRouteLabel">{{ category.label }}</span>
                            <ng-template #categoryHtmlRouteLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="category.badge" [ngClass]="category.badgeStyleClass">{{ category.badge }}</span>
                        </a>
                        <div class="p-megamenu-panel" *ngIf="category.items">
                            <div class="p-megamenu-grid">
                                <ng-template ngFor let-column [ngForOf]="category.items">
                                    <div [class]="getColumnClass(category)">
                                        <ng-template ngFor let-submenu [ngForOf]="column">
                                            <ul class="p-megamenu-submenu" role="menu">
                                                <li class="p-megamenu-submenu-header">
                                                    <span *ngIf="submenu.escape !== false; else submenuHtmlLabel">{{ submenu.label }}</span>
                                                    <ng-template #submenuHtmlLabel><span [innerHTML]="submenu.label"></span></ng-template>
                                                    <span class="p-menuitem-badge" *ngIf="submenu.badge" [ngClass]="submenu.badgeStyleClass">{{ submenu.badge }}</span>
                                                </li>
                                                <ng-template ngFor let-item [ngForOf]="submenu.items">
                                                    <li *ngIf="item.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': item.visible === false }" role="separator"></li>
                                                    <li *ngIf="!item.separator" class="p-menuitem" [ngClass]="{ 'p-hidden': item.visible === false }" role="none" pTooltip [tooltipOptions]="item.tooltipOptions">
                                                        <a
                                                            *ngIf="!item.routerLink"
                                                            role="menuitem"
                                                            [href]="item.url || '#'"
                                                            class="p-menuitem-link"
                                                            [target]="item.target"
                                                            [attr.title]="item.title"
                                                            [attr.id]="item.id"
                                                            [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [ngClass]="{ 'p-disabled': item.disabled }"
                                                            (click)="itemClick($event, item)"
                                                            pRipple
                                                        >
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{ item.label }}</span>
                                                            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
                                                        </a>
                                                        <a
                                                            *ngIf="item.routerLink"
                                                            role="menuitem"
                                                            [routerLink]="item.routerLink"
                                                            [queryParams]="item.queryParams"
                                                            [routerLinkActive]="'p-menuitem-link-active'"
                                                            [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                                                            class="p-menuitem-link"
                                                            [target]="item.target"
                                                            [attr.title]="item.title"
                                                            [attr.id]="item.id"
                                                            [ngClass]="{ 'p-disabled': item.disabled }"
                                                            (click)="itemClick($event, item)"
                                                            [fragment]="item.fragment"
                                                            [queryParamsHandling]="item.queryParamsHandling"
                                                            [preserveFragment]="item.preserveFragment"
                                                            [skipLocationChange]="item.skipLocationChange"
                                                            [replaceUrl]="item.replaceUrl"
                                                            [state]="item.state"
                                                            pRipple
                                                        >
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{ item.label }}</span>
                                                            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
                                                        </a>
                                                    </li>
                                                </ng-template>
                                            </ul>
                                        </ng-template>
                                    </div>
                                </ng-template>
                            </div>
                        </div>
                    </li>
                </ng-template>
            </ul>
            <div class="p-megamenu-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-megamenu-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-megamenu-root-list{margin:0;padding:0;list-style:none}.p-megamenu-root-list>.p-menuitem{position:relative}.p-megamenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-megamenu .p-menuitem-text{line-height:1}.p-megamenu-panel{display:none;position:absolute;width:auto;z-index:1}.p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{display:block}.p-megamenu-submenu{margin:0;padding:0;list-style:none}.p-megamenu-submenu-header{display:flex;align-items:center}.p-megamenu-horizontal .p-megamenu-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-megamenu-vertical .p-megamenu-root-list{flex-direction:column}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{left:100%;top:0}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-submenu-icon{margin-left:auto}.p-megamenu-grid{display:flex}.p-megamenu-col-2,.p-megamenu-col-3,.p-megamenu-col-4,.p-megamenu-col-6,.p-megamenu-col-12{flex:0 0 auto;padding:.5rem}.p-megamenu-col-2{width:16.6667%}.p-megamenu-col-3{width:25%}.p-megamenu-col-4{width:33.3333%}.p-megamenu-col-6{width:50%}.p-megamenu-col-12{width:100%}.p-megamenu-horizontal .p-megamenu-end{margin-left:auto;align-self:center}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i2.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: MegaMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-megaMenu', template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="{ 'p-megamenu p-component': true, 'p-megamenu-horizontal': orientation == 'horizontal', 'p-megamenu-vertical': orientation == 'vertical' }">
            <div class="p-megamenu-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <ul class="p-megamenu-root-list" role="menubar">
                <ng-template ngFor let-category [ngForOf]="model">
                    <li *ngIf="category.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': category.visible === false }"></li>
                    <li
                        *ngIf="!category.separator"
                        [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': category == activeItem, 'p-hidden': category.visible === false }"
                        pTooltip
                        [tooltipOptions]="category.tooltipOptions"
                        (mouseenter)="onCategoryMouseEnter($event, category)"
                    >
                        <a
                            *ngIf="!category.routerLink"
                            [href]="category.url || '#'"
                            [target]="category.target"
                            [attr.title]="category.title"
                            [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)"
                            [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': category.disabled }"
                            [ngStyle]="category.style"
                            [class]="category.styleClass"
                            pRipple
                        >
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlLabel">{{ category.label }}</span>
                            <ng-template #categoryHtmlLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="category.badge" [ngClass]="category.badgeStyleClass">{{ category.badge }}</span>
                            <span *ngIf="category.items" class="p-submenu-icon pi" [ngClass]="{ 'pi-angle-down': orientation == 'horizontal', 'pi-angle-right': orientation == 'vertical' }"></span>
                        </a>
                        <a
                            *ngIf="category.routerLink"
                            [routerLink]="category.routerLink"
                            [queryParams]="category.queryParams"
                            [routerLinkActive]="'p-menuitem-link-active'"
                            [routerLinkActiveOptions]="category.routerLinkActiveOptions || { exact: false }"
                            [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [target]="category.target"
                            [attr.title]="category.title"
                            [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)"
                            [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': category.disabled }"
                            [ngStyle]="category.style"
                            [class]="category.styleClass"
                            [fragment]="category.fragment"
                            [queryParamsHandling]="category.queryParamsHandling"
                            [preserveFragment]="category.preserveFragment"
                            [skipLocationChange]="category.skipLocationChange"
                            [replaceUrl]="category.replaceUrl"
                            [state]="category.state"
                            pRipple
                        >
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlRouteLabel">{{ category.label }}</span>
                            <ng-template #categoryHtmlRouteLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="category.badge" [ngClass]="category.badgeStyleClass">{{ category.badge }}</span>
                        </a>
                        <div class="p-megamenu-panel" *ngIf="category.items">
                            <div class="p-megamenu-grid">
                                <ng-template ngFor let-column [ngForOf]="category.items">
                                    <div [class]="getColumnClass(category)">
                                        <ng-template ngFor let-submenu [ngForOf]="column">
                                            <ul class="p-megamenu-submenu" role="menu">
                                                <li class="p-megamenu-submenu-header">
                                                    <span *ngIf="submenu.escape !== false; else submenuHtmlLabel">{{ submenu.label }}</span>
                                                    <ng-template #submenuHtmlLabel><span [innerHTML]="submenu.label"></span></ng-template>
                                                    <span class="p-menuitem-badge" *ngIf="submenu.badge" [ngClass]="submenu.badgeStyleClass">{{ submenu.badge }}</span>
                                                </li>
                                                <ng-template ngFor let-item [ngForOf]="submenu.items">
                                                    <li *ngIf="item.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': item.visible === false }" role="separator"></li>
                                                    <li *ngIf="!item.separator" class="p-menuitem" [ngClass]="{ 'p-hidden': item.visible === false }" role="none" pTooltip [tooltipOptions]="item.tooltipOptions">
                                                        <a
                                                            *ngIf="!item.routerLink"
                                                            role="menuitem"
                                                            [href]="item.url || '#'"
                                                            class="p-menuitem-link"
                                                            [target]="item.target"
                                                            [attr.title]="item.title"
                                                            [attr.id]="item.id"
                                                            [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [ngClass]="{ 'p-disabled': item.disabled }"
                                                            (click)="itemClick($event, item)"
                                                            pRipple
                                                        >
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{ item.label }}</span>
                                                            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
                                                        </a>
                                                        <a
                                                            *ngIf="item.routerLink"
                                                            role="menuitem"
                                                            [routerLink]="item.routerLink"
                                                            [queryParams]="item.queryParams"
                                                            [routerLinkActive]="'p-menuitem-link-active'"
                                                            [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                                                            class="p-menuitem-link"
                                                            [target]="item.target"
                                                            [attr.title]="item.title"
                                                            [attr.id]="item.id"
                                                            [ngClass]="{ 'p-disabled': item.disabled }"
                                                            (click)="itemClick($event, item)"
                                                            [fragment]="item.fragment"
                                                            [queryParamsHandling]="item.queryParamsHandling"
                                                            [preserveFragment]="item.preserveFragment"
                                                            [skipLocationChange]="item.skipLocationChange"
                                                            [replaceUrl]="item.replaceUrl"
                                                            [state]="item.state"
                                                            pRipple
                                                        >
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{ item.label }}</span>
                                                            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
                                                        </a>
                                                    </li>
                                                </ng-template>
                                            </ul>
                                        </ng-template>
                                    </div>
                                </ng-template>
                            </div>
                        </div>
                    </li>
                </ng-template>
            </ul>
            <div class="p-megamenu-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-megamenu-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-megamenu-root-list{margin:0;padding:0;list-style:none}.p-megamenu-root-list>.p-menuitem{position:relative}.p-megamenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-megamenu .p-menuitem-text{line-height:1}.p-megamenu-panel{display:none;position:absolute;width:auto;z-index:1}.p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{display:block}.p-megamenu-submenu{margin:0;padding:0;list-style:none}.p-megamenu-submenu-header{display:flex;align-items:center}.p-megamenu-horizontal .p-megamenu-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-megamenu-vertical .p-megamenu-root-list{flex-direction:column}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{left:100%;top:0}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-submenu-icon{margin-left:auto}.p-megamenu-grid{display:flex}.p-megamenu-col-2,.p-megamenu-col-3,.p-megamenu-col-4,.p-megamenu-col-6,.p-megamenu-col-12{flex:0 0 auto;padding:.5rem}.p-megamenu-col-2{width:16.6667%}.p-megamenu-col-3{width:25%}.p-megamenu-col-4{width:33.3333%}.p-megamenu-col-6{width:50%}.p-megamenu-col-12{width:100%}.p-megamenu-horizontal .p-megamenu-end{margin-left:auto;align-self:center}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { model: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], orientation: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class MegaMenuModule {
}
MegaMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: MegaMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MegaMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.4", ngImport: i0, type: MegaMenuModule, declarations: [MegaMenu], imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule], exports: [MegaMenu, RouterModule, TooltipModule, SharedModule] });
MegaMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: MegaMenuModule, imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, RouterModule, TooltipModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: MegaMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule],
                    exports: [MegaMenu, RouterModule, TooltipModule, SharedModule],
                    declarations: [MegaMenu]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVnYW1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvbWVnYW1lbnUvbWVnYW1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFhLHVCQUF1QixFQUFFLGlCQUFpQixFQUF1QyxlQUFlLEVBQTBCLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDak8sT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBQTBCLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7OztBQXlKaEQsTUFBTSxPQUFPLFFBQVE7SUFtQmpCLFlBQXNDLFFBQWtCLEVBQStCLFVBQWUsRUFBUyxFQUFjLEVBQVMsUUFBbUIsRUFBUyxFQUFxQjtRQUFqSixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQStCLGVBQVUsR0FBVixVQUFVLENBQUs7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBWjlLLGdCQUFXLEdBQVcsWUFBWSxDQUFDO0lBWThJLENBQUM7SUFFM0wsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDcEIsS0FBSyxPQUFPO29CQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcs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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQTRJVCxtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxRQUUvQjt3QkFDRixLQUFLLEVBQUUsV0FBVztxQkFDckI7OzBCQXFCWSxNQUFNOzJCQUFDLFFBQVE7OzBCQUErQixNQUFNOzJCQUFDLFdBQVc7NkhBbEJwRSxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsV0FBVztzQkFBbkIsS0FBSztnQkFFMEIsU0FBUztzQkFBeEMsZUFBZTt1QkFBQyxhQUFhOztBQTRJbEMsTUFBTSxPQUFPLGNBQWM7OzJHQUFkLGNBQWM7NEdBQWQsY0FBYyxpQkFySmQsUUFBUSxhQWlKUCxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxhQWpKdEUsUUFBUSxFQWtKRyxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVk7NEdBR3BELGNBQWMsWUFKYixZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUMzRCxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVk7MkZBR3BELGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQztvQkFDaEYsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDO29CQUM5RCxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIFJlbmRlcmVyMiwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBDaGFuZ2VEZXRlY3RvclJlZiwgQWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIFRlbXBsYXRlUmVmLCBJbmplY3QsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBNZWdhTWVudUl0ZW0sIE1lbnVJdGVtLCBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgVG9vbHRpcE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvdG9vbHRpcCc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtbWVnYU1lbnUnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtuZ0NsYXNzXT1cInsgJ3AtbWVnYW1lbnUgcC1jb21wb25lbnQnOiB0cnVlLCAncC1tZWdhbWVudS1ob3Jpem9udGFsJzogb3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnLCAncC1tZWdhbWVudS12ZXJ0aWNhbCc6IG9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgfVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVnYW1lbnUtc3RhcnRcIiAqbmdJZj1cInN0YXJ0VGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic3RhcnRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJwLW1lZ2FtZW51LXJvb3QtbGlzdFwiIHJvbGU9XCJtZW51YmFyXCI+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1jYXRlZ29yeSBbbmdGb3JPZl09XCJtb2RlbFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCJjYXRlZ29yeS5zZXBhcmF0b3JcIiBjbGFzcz1cInAtbWVudS1zZXBhcmF0b3JcIiBbbmdDbGFzc109XCJ7ICdwLWhpZGRlbic6IGNhdGVnb3J5LnZpc2libGUgPT09IGZhbHNlIH1cIj48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiIWNhdGVnb3J5LnNlcGFyYXRvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLW1lbnVpdGVtJzogdHJ1ZSwgJ3AtbWVudWl0ZW0tYWN0aXZlJzogY2F0ZWdvcnkgPT0gYWN0aXZlSXRlbSwgJ3AtaGlkZGVuJzogY2F0ZWdvcnkudmlzaWJsZSA9PT0gZmFsc2UgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBwVG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgW3Rvb2x0aXBPcHRpb25zXT1cImNhdGVnb3J5LnRvb2x0aXBPcHRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cIm9uQ2F0ZWdvcnlNb3VzZUVudGVyKCRldmVudCwgY2F0ZWdvcnkpXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdJZj1cIiFjYXRlZ29yeS5yb3V0ZXJMaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbaHJlZl09XCJjYXRlZ29yeS51cmwgfHwgJyMnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdGFyZ2V0XT1cImNhdGVnb3J5LnRhcmdldFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiY2F0ZWdvcnkudGl0bGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cImNhdGVnb3J5LmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25DYXRlZ29yeUNsaWNrKCRldmVudCwgY2F0ZWdvcnkpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJjYXRlZ29yeS50YWJpbmRleCA/IGNhdGVnb3J5LnRhYmluZGV4IDogJzAnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLW1lbnVpdGVtLWxpbmsnOiB0cnVlLCAncC1kaXNhYmxlZCc6IGNhdGVnb3J5LmRpc2FibGVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImNhdGVnb3J5LnN0eWxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3NdPVwiY2F0ZWdvcnkuc3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgKm5nSWY9XCJjYXRlZ29yeS5pY29uXCIgW25nQ2xhc3NdPVwiY2F0ZWdvcnkuaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiY2F0ZWdvcnkuZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBjYXRlZ29yeUh0bWxMYWJlbFwiPnt7IGNhdGVnb3J5LmxhYmVsIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjY2F0ZWdvcnlIdG1sTGFiZWw+PHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiBbaW5uZXJIVE1MXT1cImNhdGVnb3J5LmxhYmVsXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWJhZGdlXCIgKm5nSWY9XCJjYXRlZ29yeS5iYWRnZVwiIFtuZ0NsYXNzXT1cImNhdGVnb3J5LmJhZGdlU3R5bGVDbGFzc1wiPnt7IGNhdGVnb3J5LmJhZGdlIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiY2F0ZWdvcnkuaXRlbXNcIiBjbGFzcz1cInAtc3VibWVudS1pY29uIHBpXCIgW25nQ2xhc3NdPVwieyAncGktYW5nbGUtZG93bic6IG9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJywgJ3BpLWFuZ2xlLXJpZ2h0Jzogb3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdJZj1cImNhdGVnb3J5LnJvdXRlckxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cImNhdGVnb3J5LnJvdXRlckxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtxdWVyeVBhcmFtc109XCJjYXRlZ29yeS5xdWVyeVBhcmFtc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVdPVwiJ3AtbWVudWl0ZW0tbGluay1hY3RpdmUnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwiY2F0ZWdvcnkucm91dGVyTGlua0FjdGl2ZU9wdGlvbnMgfHwgeyBleGFjdDogZmFsc2UgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiY2F0ZWdvcnkudGFiaW5kZXggPyBjYXRlZ29yeS50YWJpbmRleCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhcmdldF09XCJjYXRlZ29yeS50YXJnZXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cImNhdGVnb3J5LnRpdGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJjYXRlZ29yeS5pZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uQ2F0ZWdvcnlDbGljaygkZXZlbnQsIGNhdGVnb3J5KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1tZW51aXRlbS1saW5rJzogdHJ1ZSwgJ3AtZGlzYWJsZWQnOiBjYXRlZ29yeS5kaXNhYmxlZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJjYXRlZ29yeS5zdHlsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzXT1cImNhdGVnb3J5LnN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmcmFnbWVudF09XCJjYXRlZ29yeS5mcmFnbWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3F1ZXJ5UGFyYW1zSGFuZGxpbmddPVwiY2F0ZWdvcnkucXVlcnlQYXJhbXNIYW5kbGluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ByZXNlcnZlRnJhZ21lbnRdPVwiY2F0ZWdvcnkucHJlc2VydmVGcmFnbWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NraXBMb2NhdGlvbkNoYW5nZV09XCJjYXRlZ29yeS5za2lwTG9jYXRpb25DaGFuZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyZXBsYWNlVXJsXT1cImNhdGVnb3J5LnJlcGxhY2VVcmxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGF0ZV09XCJjYXRlZ29yeS5zdGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgKm5nSWY9XCJjYXRlZ29yeS5pY29uXCIgW25nQ2xhc3NdPVwiY2F0ZWdvcnkuaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiY2F0ZWdvcnkuZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBjYXRlZ29yeUh0bWxSb3V0ZUxhYmVsXCI+e3sgY2F0ZWdvcnkubGFiZWwgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNjYXRlZ29yeUh0bWxSb3V0ZUxhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJjYXRlZ29yeS5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1iYWRnZVwiICpuZ0lmPVwiY2F0ZWdvcnkuYmFkZ2VcIiBbbmdDbGFzc109XCJjYXRlZ29yeS5iYWRnZVN0eWxlQ2xhc3NcIj57eyBjYXRlZ29yeS5iYWRnZSB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLW1lZ2FtZW51LXBhbmVsXCIgKm5nSWY9XCJjYXRlZ29yeS5pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLW1lZ2FtZW51LWdyaWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1jb2x1bW4gW25nRm9yT2ZdPVwiY2F0ZWdvcnkuaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgW2NsYXNzXT1cImdldENvbHVtbkNsYXNzKGNhdGVnb3J5KVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtc3VibWVudSBbbmdGb3JPZl09XCJjb2x1bW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwicC1tZWdhbWVudS1zdWJtZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInAtbWVnYW1lbnUtc3VibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cInN1Ym1lbnUuZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBzdWJtZW51SHRtbExhYmVsXCI+e3sgc3VibWVudS5sYWJlbCB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI3N1Ym1lbnVIdG1sTGFiZWw+PHNwYW4gW2lubmVySFRNTF09XCJzdWJtZW51LmxhYmVsXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWJhZGdlXCIgKm5nSWY9XCJzdWJtZW51LmJhZGdlXCIgW25nQ2xhc3NdPVwic3VibWVudS5iYWRnZVN0eWxlQ2xhc3NcIj57eyBzdWJtZW51LmJhZGdlIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtaXRlbSBbbmdGb3JPZl09XCJzdWJtZW51Lml0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpICpuZ0lmPVwiaXRlbS5zZXBhcmF0b3JcIiBjbGFzcz1cInAtbWVudS1zZXBhcmF0b3JcIiBbbmdDbGFzc109XCJ7ICdwLWhpZGRlbic6IGl0ZW0udmlzaWJsZSA9PT0gZmFsc2UgfVwiIHJvbGU9XCJzZXBhcmF0b3JcIj48L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSAqbmdJZj1cIiFpdGVtLnNlcGFyYXRvclwiIGNsYXNzPVwicC1tZW51aXRlbVwiIFtuZ0NsYXNzXT1cInsgJ3AtaGlkZGVuJzogaXRlbS52aXNpYmxlID09PSBmYWxzZSB9XCIgcm9sZT1cIm5vbmVcIiBwVG9vbHRpcCBbdG9vbHRpcE9wdGlvbnNdPVwiaXRlbS50b29sdGlwT3B0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCIhaXRlbS5yb3V0ZXJMaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJtZW51aXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbaHJlZl09XCJpdGVtLnVybCB8fCAnIydcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLW1lbnVpdGVtLWxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhcmdldF09XCJpdGVtLnRhcmdldFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50aXRsZV09XCJpdGVtLnRpdGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cIml0ZW0uaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS50YWJpbmRleCA/IGl0ZW0udGFiaW5kZXggOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1kaXNhYmxlZCc6IGl0ZW0uZGlzYWJsZWQgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiaXRlbUNsaWNrKCRldmVudCwgaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nQ2xhc3NdPVwiaXRlbS5pY29uXCIgW25nU3R5bGVdPVwiaXRlbS5pY29uU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiaXRlbS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxMYWJlbFwiPnt7IGl0ZW0ubGFiZWwgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2h0bWxMYWJlbD48c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiIFtpbm5lckhUTUxdPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWJhZGdlXCIgKm5nSWY9XCJpdGVtLmJhZGdlXCIgW25nQ2xhc3NdPVwiaXRlbS5iYWRnZVN0eWxlQ2xhc3NcIj57eyBpdGVtLmJhZGdlIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdJZj1cIml0ZW0ucm91dGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3JvdXRlckxpbmtdPVwiaXRlbS5yb3V0ZXJMaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtxdWVyeVBhcmFtc109XCJpdGVtLnF1ZXJ5UGFyYW1zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rQWN0aXZlXT1cIidwLW1lbnVpdGVtLWxpbmstYWN0aXZlJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJpdGVtLnRhYmluZGV4ID8gaXRlbS50YWJpbmRleCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwiaXRlbS5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9ucyB8fCB7IGV4YWN0OiBmYWxzZSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0YXJnZXRdPVwiaXRlbS50YXJnZXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiaXRlbS50aXRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJpdGVtLmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtZGlzYWJsZWQnOiBpdGVtLmRpc2FibGVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIml0ZW1DbGljaygkZXZlbnQsIGl0ZW0pXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmcmFnbWVudF09XCJpdGVtLmZyYWdtZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtxdWVyeVBhcmFtc0hhbmRsaW5nXT1cIml0ZW0ucXVlcnlQYXJhbXNIYW5kbGluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcHJlc2VydmVGcmFnbWVudF09XCJpdGVtLnByZXNlcnZlRnJhZ21lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NraXBMb2NhdGlvbkNoYW5nZV09XCJpdGVtLnNraXBMb2NhdGlvbkNoYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVwbGFjZVVybF09XCJpdGVtLnJlcGxhY2VVcmxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXRlXT1cIml0ZW0uc3RhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nQ2xhc3NdPVwiaXRlbS5pY29uXCIgW25nU3R5bGVdPVwiaXRlbS5pY29uU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiaXRlbS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxSb3V0ZUxhYmVsXCI+e3sgaXRlbS5sYWJlbCB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaHRtbFJvdXRlTGFiZWw+PHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiBbaW5uZXJIVE1MXT1cIml0ZW0ubGFiZWxcIj48L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1iYWRnZVwiICpuZ0lmPVwiaXRlbS5iYWRnZVwiIFtuZ0NsYXNzXT1cIml0ZW0uYmFkZ2VTdHlsZUNsYXNzXCI+e3sgaXRlbS5iYWRnZSB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVnYW1lbnUtZW5kXCIgKm5nSWY9XCJlbmRUZW1wbGF0ZTsgZWxzZSBsZWdhY3lcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZW5kVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNsZWdhY3k+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVnYW1lbnUtZW5kXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9tZWdhbWVudS5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgTWVnYU1lbnUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgICBASW5wdXQoKSBtb2RlbDogTWVnYU1lbnVJdGVtW107XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgb3JpZW50YXRpb246IHN0cmluZyA9ICdob3Jpem9udGFsJztcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIGFjdGl2ZUl0ZW06IGFueTtcblxuICAgIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogKCkgPT4gdm9pZCB8IG51bGw7XG5cbiAgICBzdGFydFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZW5kVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCwgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzdGFydCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkNhdGVnb3J5TW91c2VFbnRlcihldmVudCwgbWVudWl0ZW06IE1lZ2FNZW51SXRlbSkge1xuICAgICAgICBpZiAobWVudWl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBtZW51aXRlbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2F0ZWdvcnlDbGljayhldmVudCwgaXRlbTogTWVudUl0ZW0gfCBNZWdhTWVudUl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWl0ZW0udXJsICYmICFpdGVtLnJvdXRlckxpbmspIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgICBpdGVtLmNvbW1hbmQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uaXRlbXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUl0ZW0gJiYgdGhpcy5hY3RpdmVJdGVtID09PSBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBpdGVtO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXRlbUNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50LCBpdGVtOiBNZW51SXRlbSB8IE1lZ2FNZW51SXRlbSkge1xuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXRlbS51cmwgJiYgIWl0ZW0ucm91dGVyTGluaykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmNvbW1hbmQpIHtcbiAgICAgICAgICAgIGl0ZW0uY29tbWFuZCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBudWxsO1xuICAgIH1cblxuICAgIGdldENvbHVtbkNsYXNzKG1lbnVpdGVtOiBNZWdhTWVudUl0ZW0pIHtcbiAgICAgICAgbGV0IGxlbmd0aCA9IG1lbnVpdGVtLml0ZW1zID8gbWVudWl0ZW0uaXRlbXMubGVuZ3RoIDogMDtcbiAgICAgICAgbGV0IGNvbHVtbkNsYXNzO1xuICAgICAgICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNvbHVtbkNsYXNzID0gJ3AtbWVnYW1lbnUtY29sLTYnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgY29sdW1uQ2xhc3MgPSAncC1tZWdhbWVudS1jb2wtNCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb2x1bW5DbGFzcyA9ICdwLW1lZ2FtZW51LWNvbC0zJztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIGNvbHVtbkNsYXNzID0gJ3AtbWVnYW1lbnUtY29sLTInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbHVtbkNsYXNzID0gJ3AtbWVnYW1lbnUtY29sLTEyJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2x1bW5DbGFzcztcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsICYmICF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFJpcHBsZU1vZHVsZSwgVG9vbHRpcE1vZHVsZSwgU2hhcmVkTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbTWVnYU1lbnUsIFJvdXRlck1vZHVsZSwgVG9vbHRpcE1vZHVsZSwgU2hhcmVkTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtNZWdhTWVudV1cbn0pXG5leHBvcnQgY2xhc3MgTWVnYU1lbnVNb2R1bGUge31cbiJdfQ==