import { ElementRef, OnDestroy, OnInit, EventEmitter, Renderer2, ChangeDetectorRef, TemplateRef, QueryList, NgZone } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { PrimeNGConfig, OverlayService } from 'primeng/api';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/api";
import * as i4 from "primeng/ripple";
export declare const CALENDAR_VALUE_ACCESSOR: any;
export interface LocaleSettings {
    firstDayOfWeek?: number;
    dayNames?: string[];
    dayNamesShort?: string[];
    dayNamesMin?: string[];
    monthNames?: string[];
    monthNamesShort?: string[];
    today?: string;
    clear?: string;
    dateFormat?: string;
    weekHeader?: string;
}
export declare class Calendar implements OnInit, OnDestroy, ControlValueAccessor {
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    private zone;
    private config;
    overlayService: OverlayService;
    style: any;
    styleClass: string;
    inputStyle: any;
    inputId: string;
    name: string;
    inputStyleClass: string;
    placeholder: string;
    ariaLabelledBy: string;
    iconAriaLabel: string;
    disabled: any;
    dateFormat: string;
    multipleSeparator: string;
    rangeSeparator: string;
    inline: boolean;
    showOtherMonths: boolean;
    selectOtherMonths: boolean;
    showIcon: boolean;
    icon: string;
    appendTo: any;
    readonlyInput: boolean;
    shortYearCutoff: any;
    monthNavigator: boolean;
    yearNavigator: boolean;
    hourFormat: string;
    timeOnly: boolean;
    stepHour: number;
    stepMinute: number;
    stepSecond: number;
    showSeconds: boolean;
    required: boolean;
    showOnFocus: boolean;
    showWeek: boolean;
    dataType: string;
    selectionMode: string;
    maxDateCount: number;
    showButtonBar: boolean;
    todayButtonStyleClass: string;
    clearButtonStyleClass: string;
    autoZIndex: boolean;
    baseZIndex: number;
    panelStyleClass: string;
    panelStyle: any;
    keepInvalid: boolean;
    hideOnDateTimeSelect: boolean;
    touchUI: boolean;
    timeSeparator: string;
    focusTrap: boolean;
    showTransitionOptions: string;
    hideTransitionOptions: string;
    onFocus: EventEmitter<any>;
    onBlur: EventEmitter<any>;
    onClose: EventEmitter<any>;
    onSelect: EventEmitter<any>;
    onInput: EventEmitter<any>;
    onTodayClick: EventEmitter<any>;
    onClearClick: EventEmitter<any>;
    onMonthChange: EventEmitter<any>;
    onYearChange: EventEmitter<any>;
    onClickOutside: EventEmitter<any>;
    onShow: EventEmitter<any>;
    templates: QueryList<any>;
    tabindex: number;
    containerViewChild: ElementRef;
    inputfieldViewChild: ElementRef;
    set content(content: ElementRef);
    contentViewChild: ElementRef;
    value: any;
    dates: any[];
    months: any[];
    weekDays: string[];
    currentMonth: number;
    currentYear: number;
    currentHour: number;
    currentMinute: number;
    currentSecond: number;
    pm: boolean;
    mask: HTMLDivElement;
    maskClickListener: Function;
    overlay: HTMLDivElement;
    responsiveStyleElement: any;
    overlayVisible: boolean;
    onModelChange: Function;
    onModelTouched: Function;
    calendarElement: any;
    timePickerTimer: any;
    documentClickListener: any;
    animationEndListener: any;
    ticksTo1970: number;
    yearOptions: number[];
    focus: boolean;
    isKeydown: boolean;
    filled: boolean;
    inputFieldValue: string;
    _minDate: Date;
    _maxDate: Date;
    _showTime: boolean;
    _yearRange: string;
    preventDocumentListener: boolean;
    dateTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    footerTemplate: TemplateRef<any>;
    disabledDateTemplate: TemplateRef<any>;
    decadeTemplate: TemplateRef<any>;
    _disabledDates: Array<Date>;
    _disabledDays: Array<number>;
    selectElement: any;
    todayElement: any;
    focusElement: any;
    scrollHandler: any;
    documentResizeListener: any;
    navigationState: any;
    isMonthNavigate: boolean;
    initialized: boolean;
    translationSubscription: Subscription;
    _locale: LocaleSettings;
    _responsiveOptions: any[];
    currentView: string;
    attributeSelector: string;
    _numberOfMonths: number;
    _firstDayOfWeek: number;
    _view: string;
    preventFocus: boolean;
    get view(): string;
    set view(view: string);
    get defaultDate(): Date;
    set defaultDate(defaultDate: Date);
    _defaultDate: Date;
    get minDate(): Date;
    set minDate(date: Date);
    get maxDate(): Date;
    set maxDate(date: Date);
    get disabledDates(): Date[];
    set disabledDates(disabledDates: Date[]);
    get disabledDays(): number[];
    set disabledDays(disabledDays: number[]);
    get yearRange(): string;
    set yearRange(yearRange: string);
    get showTime(): boolean;
    set showTime(showTime: boolean);
    get locale(): LocaleSettings;
    get responsiveOptions(): any[];
    set responsiveOptions(responsiveOptions: any[]);
    get numberOfMonths(): number;
    set numberOfMonths(numberOfMonths: number);
    get firstDayOfWeek(): number;
    set firstDayOfWeek(firstDayOfWeek: number);
    set locale(newLocale: LocaleSettings);
    constructor(el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, zone: NgZone, config: PrimeNGConfig, overlayService: OverlayService);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    getTranslation(option: string): any;
    populateYearOptions(start: any, end: any): void;
    createWeekDays(): void;
    monthPickerValues(): any[];
    yearPickerValues(): any[];
    createMonths(month: number, year: number): void;
    getWeekNumber(date: Date): number;
    createMonth(month: number, year: number): {
        month: number;
        year: number;
        dates: any[];
        weekNumbers: any[];
    };
    initTime(date: Date): void;
    navBackward(event: any): void;
    navForward(event: any): void;
    decrementYear(): void;
    decrementDecade(): void;
    incrementDecade(): void;
    incrementYear(): void;
    switchToMonthView(event: any): void;
    switchToYearView(event: any): void;
    onDateSelect(event: any, dateMeta: any): void;
    shouldSelectDate(dateMeta: any): boolean;
    onMonthSelect(event: any, index: any): void;
    onYearSelect(event: any, year: any): void;
    updateInputfield(): void;
    formatDateTime(date: any): any;
    setCurrentHourPM(hours: number): void;
    selectDate(dateMeta: any): void;
    updateModel(value: any): void;
    getFirstDayOfMonthIndex(month: number, year: number): number;
    getDaysCountInMonth(month: number, year: number): number;
    getDaysCountInPrevMonth(month: number, year: number): number;
    getPreviousMonthAndYear(month: number, year: number): {
        month: any;
        year: any;
    };
    getNextMonthAndYear(month: number, year: number): {
        month: any;
        year: any;
    };
    getSundayIndex(): number;
    isSelected(dateMeta: any): boolean;
    isComparable(): boolean;
    isMonthSelected(month: any): boolean;
    isYearSelected(year: any): boolean;
    isDateEquals(value: any, dateMeta: any): boolean;
    isDateBetween(start: any, end: any, dateMeta: any): boolean;
    isSingleSelection(): boolean;
    isRangeSelection(): boolean;
    isMultipleSelection(): boolean;
    isToday(today: any, day: any, month: any, year: any): boolean;
    isSelectable(day: any, month: any, year: any, otherMonth: any): boolean;
    isDateDisabled(day: number, month: number, year: number): boolean;
    isDayDisabled(day: number, month: number, year: number): boolean;
    onInputFocus(event: Event): void;
    onInputClick(): void;
    onInputBlur(event: Event): void;
    onButtonClick(event: any, inputfield: any): void;
    onOverlayClick(event: any): void;
    getMonthName(index: any): any;
    getYear(month: any): any;
    switchViewButtonDisabled(): any;
    onPrevButtonClick(event: any): void;
    onNextButtonClick(event: any): void;
    onContainerButtonKeydown(event: any): void;
    onInputKeydown(event: any): void;
    onDateCellKeydown(event: any, date: any, groupIndex: any): void;
    onMonthCellKeydown(event: any, index: any): void;
    onYearCellKeydown(event: any, index: any): void;
    navigateToMonth(prev: any, groupIndex: any): void;
    updateFocus(): void;
    initFocusableCell(): void;
    trapFocus(event: any): void;
    onMonthDropdownChange(m: string): void;
    onYearDropdownChange(y: string): void;
    convertTo24Hour: (hours: number, pm: boolean) => number;
    validateTime(hour: number, minute: number, second: number, pm: boolean): boolean;
    incrementHour(event: any): void;
    onTimePickerElementMouseDown(event: Event, type: number, direction: number): void;
    onTimePickerElementMouseUp(event: Event): void;
    onTimePickerElementMouseLeave(): void;
    repeat(event: Event, interval: number, type: number, direction: number): void;
    clearTimePickerTimer(): void;
    decrementHour(event: any): void;
    incrementMinute(event: any): void;
    decrementMinute(event: any): void;
    incrementSecond(event: any): void;
    decrementSecond(event: any): void;
    updateTime(): void;
    toggleAMPM(event: any): void;
    onUserInput(event: any): void;
    isValidSelection(value: any): boolean;
    parseValueFromString(text: string): Date | Date[];
    parseDateTime(text: any): Date;
    populateTime(value: any, timeString: any, ampm: any): void;
    isValidDate(date: any): boolean;
    updateUI(): void;
    showOverlay(): void;
    hideOverlay(): void;
    toggle(): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    onOverlayAnimationDone(event: AnimationEvent): void;
    appendOverlay(): void;
    restoreOverlayAppend(): void;
    alignOverlay(): void;
    enableModality(element: any): void;
    disableModality(): void;
    destroyMask(): void;
    unbindMaskClickListener(): void;
    unbindAnimationEndListener(): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    getDateFormat(): any;
    getFirstDateOfWeek(): any;
    formatDate(date: any, format: any): string;
    formatTime(date: any): string;
    parseTime(value: any): {
        hour: number;
        minute: number;
        second: number;
    };
    parseDate(value: any, format: any): any;
    daylightSavingAdjust(date: any): any;
    updateFilledState(): void;
    onTodayButtonClick(event: any): void;
    onClearButtonClick(event: any): void;
    createResponsiveStyle(): void;
    destroyResponsiveStyleElement(): void;
    bindDocumentClickListener(): void;
    unbindDocumentClickListener(): void;
    bindDocumentResizeListener(): void;
    unbindDocumentResizeListener(): void;
    bindScrollListener(): void;
    unbindScrollListener(): void;
    isOutsideClicked(event: Event): boolean;
    isNavIconClicked(event: Event): boolean;
    onWindowResize(): void;
    onOverlayHide(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Calendar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Calendar, "p-calendar", never, { "style": "style"; "styleClass": "styleClass"; "inputStyle": "inputStyle"; "inputId": "inputId"; "name": "name"; "inputStyleClass": "inputStyleClass"; "placeholder": "placeholder"; "ariaLabelledBy": "ariaLabelledBy"; "iconAriaLabel": "iconAriaLabel"; "disabled": "disabled"; "dateFormat": "dateFormat"; "multipleSeparator": "multipleSeparator"; "rangeSeparator": "rangeSeparator"; "inline": "inline"; "showOtherMonths": "showOtherMonths"; "selectOtherMonths": "selectOtherMonths"; "showIcon": "showIcon"; "icon": "icon"; "appendTo": "appendTo"; "readonlyInput": "readonlyInput"; "shortYearCutoff": "shortYearCutoff"; "monthNavigator": "monthNavigator"; "yearNavigator": "yearNavigator"; "hourFormat": "hourFormat"; "timeOnly": "timeOnly"; "stepHour": "stepHour"; "stepMinute": "stepMinute"; "stepSecond": "stepSecond"; "showSeconds": "showSeconds"; "required": "required"; "showOnFocus": "showOnFocus"; "showWeek": "showWeek"; "dataType": "dataType"; "selectionMode": "selectionMode"; "maxDateCount": "maxDateCount"; "showButtonBar": "showButtonBar"; "todayButtonStyleClass": "todayButtonStyleClass"; "clearButtonStyleClass": "clearButtonStyleClass"; "autoZIndex": "autoZIndex"; "baseZIndex": "baseZIndex"; "panelStyleClass": "panelStyleClass"; "panelStyle": "panelStyle"; "keepInvalid": "keepInvalid"; "hideOnDateTimeSelect": "hideOnDateTimeSelect"; "touchUI": "touchUI"; "timeSeparator": "timeSeparator"; "focusTrap": "focusTrap"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; "tabindex": "tabindex"; "view": "view"; "defaultDate": "defaultDate"; "minDate": "minDate"; "maxDate": "maxDate"; "disabledDates": "disabledDates"; "disabledDays": "disabledDays"; "yearRange": "yearRange"; "showTime": "showTime"; "responsiveOptions": "responsiveOptions"; "numberOfMonths": "numberOfMonths"; "firstDayOfWeek": "firstDayOfWeek"; "locale": "locale"; }, { "onFocus": "onFocus"; "onBlur": "onBlur"; "onClose": "onClose"; "onSelect": "onSelect"; "onInput": "onInput"; "onTodayClick": "onTodayClick"; "onClearClick": "onClearClick"; "onMonthChange": "onMonthChange"; "onYearChange": "onYearChange"; "onClickOutside": "onClickOutside"; "onShow": "onShow"; }, ["templates"], ["p-header", "p-footer"]>;
}
export declare class CalendarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CalendarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CalendarModule, [typeof Calendar], [typeof i1.CommonModule, typeof i2.ButtonModule, typeof i3.SharedModule, typeof i4.RippleModule], [typeof Calendar, typeof i2.ButtonModule, typeof i3.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CalendarModule>;
}
