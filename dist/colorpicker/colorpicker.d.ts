import { ElementRef, OnDestroy, EventEmitter, Renderer2, ChangeDetectorRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { ControlValueAccessor } from '@angular/forms';
import { OverlayService, PrimeNGConfig } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare const COLORPICKER_VALUE_ACCESSOR: any;
export declare class ColorPicker implements ControlValueAccessor, OnDestroy {
    private document;
    private platformId;
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    config: PrimeNGConfig;
    overlayService: OverlayService;
    style: any;
    styleClass: string;
    inline: boolean;
    format: string;
    appendTo: any;
    disabled: boolean;
    tabindex: string;
    inputId: string;
    autoZIndex: boolean;
    baseZIndex: number;
    showTransitionOptions: string;
    hideTransitionOptions: string;
    onChange: EventEmitter<any>;
    onShow: EventEmitter<any>;
    onHide: EventEmitter<any>;
    containerViewChild: ElementRef;
    inputViewChild: ElementRef;
    value: any;
    inputBgColor: string;
    shown: boolean;
    overlayVisible: boolean;
    defaultColor: string;
    onModelChange: Function;
    onModelTouched: Function;
    documentClickListener: Function;
    documentResizeListener: any;
    documentMousemoveListener: Function;
    documentMouseupListener: Function;
    documentHueMoveListener: Function;
    scrollHandler: any;
    selfClick: boolean;
    colorDragging: boolean;
    hueDragging: boolean;
    overlay: HTMLDivElement;
    colorSelectorViewChild: ElementRef;
    colorHandleViewChild: ElementRef;
    hueViewChild: ElementRef;
    hueHandleViewChild: ElementRef;
    window: Window;
    constructor(document: Document, platformId: any, el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, config: PrimeNGConfig, overlayService: OverlayService);
    set colorSelector(element: ElementRef);
    set colorHandle(element: ElementRef);
    set hue(element: ElementRef);
    set hueHandle(element: ElementRef);
    onHueMousedown(event: MouseEvent): void;
    onHueTouchStart(event: any): void;
    onColorTouchStart(event: any): void;
    pickHue(event: any, position?: any): void;
    onColorMousedown(event: MouseEvent): void;
    onMove(event: any): void;
    onDragEnd(): void;
    pickColor(event: any, position?: any): void;
    getValueToUpdate(): any;
    updateModel(): void;
    writeValue(value: any): void;
    updateColorSelector(): void;
    updateUI(): void;
    onInputFocus(): void;
    show(): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    onOverlayAnimationEnd(event: AnimationEvent): void;
    appendOverlay(): void;
    restoreOverlayAppend(): void;
    alignOverlay(): void;
    hide(): void;
    onInputClick(): void;
    togglePanel(): void;
    onInputKeydown(event: KeyboardEvent): void;
    onOverlayClick(event: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    bindDocumentClickListener(): void;
    unbindDocumentClickListener(): void;
    bindDocumentMousemoveListener(): void;
    unbindDocumentMousemoveListener(): void;
    bindDocumentMouseupListener(): void;
    unbindDocumentMouseupListener(): void;
    bindDocumentResizeListener(): void;
    unbindDocumentResizeListener(): void;
    onWindowResize(): void;
    bindScrollListener(): void;
    unbindScrollListener(): void;
    validateHSB(hsb: any): {
        h: number;
        s: number;
        b: number;
    };
    validateRGB(rgb: any): {
        r: number;
        g: number;
        b: number;
    };
    validateHEX(hex: any): any;
    HEXtoRGB(hex: any): {
        r: number;
        g: number;
        b: number;
    };
    HEXtoHSB(hex: any): {
        h: number;
        s: number;
        b: number;
    };
    RGBtoHSB(rgb: any): {
        h: number;
        s: number;
        b: number;
    };
    HSBtoRGB(hsb: any): {
        r: number;
        g: number;
        b: number;
    };
    RGBtoHEX(rgb: any): string;
    HSBtoHEX(hsb: any): string;
    onOverlayHide(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ColorPicker, "p-colorPicker", never, { "style": "style"; "styleClass": "styleClass"; "inline": "inline"; "format": "format"; "appendTo": "appendTo"; "disabled": "disabled"; "tabindex": "tabindex"; "inputId": "inputId"; "autoZIndex": "autoZIndex"; "baseZIndex": "baseZIndex"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; }, { "onChange": "onChange"; "onShow": "onShow"; "onHide": "onHide"; }, never, never, false, never>;
}
export declare class ColorPickerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPickerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ColorPickerModule, [typeof ColorPicker], [typeof i1.CommonModule], [typeof ColorPicker]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ColorPickerModule>;
}
