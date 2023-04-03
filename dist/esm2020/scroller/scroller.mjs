import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Inject, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Scroller {
    constructor(document, platformId, renderer, cd, zone) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.cd = cd;
        this.zone = zone;
        this.onLazyLoad = new EventEmitter();
        this.onScroll = new EventEmitter();
        this.onScrollIndexChange = new EventEmitter();
        this._tabindex = 0;
        this._itemSize = 0;
        this._orientation = 'vertical';
        this._step = 0;
        this._delay = 0;
        this._resizeDelay = 10;
        this._appendOnly = false;
        this._inline = false;
        this._lazy = false;
        this._disabled = false;
        this._loaderDisabled = false;
        this._showSpacer = true;
        this._showLoader = false;
        this._autoSize = false;
        this.d_loading = false;
        this.first = 0;
        this.last = 0;
        this.page = 0;
        this.isRangeChanged = false;
        this.numItemsInViewport = 0;
        this.lastScrollPos = 0;
        this.lazyLoadState = {};
        this.loaderArr = [];
        this.spacerStyle = {};
        this.contentStyle = {};
        this.initialized = false;
    }
    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }
    get style() {
        return this._style;
    }
    set style(val) {
        this._style = val;
    }
    get styleClass() {
        return this._styleClass;
    }
    set styleClass(val) {
        this._styleClass = val;
    }
    get tabindex() {
        return this._tabindex;
    }
    set tabindex(val) {
        this._tabindex = val;
    }
    get items() {
        return this._items;
    }
    set items(val) {
        this._items = val;
    }
    get itemSize() {
        return this._itemSize;
    }
    set itemSize(val) {
        this._itemSize = val;
    }
    get scrollHeight() {
        return this._scrollHeight;
    }
    set scrollHeight(val) {
        this._scrollHeight = val;
    }
    get scrollWidth() {
        return this._scrollWidth;
    }
    set scrollWidth(val) {
        this._scrollWidth = val;
    }
    get orientation() {
        return this._orientation;
    }
    set orientation(val) {
        this._orientation = val;
    }
    get step() {
        return this._step;
    }
    set step(val) {
        this._step = val;
    }
    get delay() {
        return this._delay;
    }
    set delay(val) {
        this._delay = val;
    }
    get resizeDelay() {
        return this._resizeDelay;
    }
    set resizeDelay(val) {
        this._resizeDelay = val;
    }
    get appendOnly() {
        return this._appendOnly;
    }
    set appendOnly(val) {
        this._appendOnly = val;
    }
    get inline() {
        return this._inline;
    }
    set inline(val) {
        this._inline = val;
    }
    get lazy() {
        return this._lazy;
    }
    set lazy(val) {
        this._lazy = val;
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = val;
    }
    get loaderDisabled() {
        return this._loaderDisabled;
    }
    set loaderDisabled(val) {
        this._loaderDisabled = val;
    }
    get columns() {
        return this._columns;
    }
    set columns(val) {
        this._columns = val;
    }
    get showSpacer() {
        return this._showSpacer;
    }
    set showSpacer(val) {
        this._showSpacer = val;
    }
    get showLoader() {
        return this._showLoader;
    }
    set showLoader(val) {
        this._showLoader = val;
    }
    get numToleratedItems() {
        return this._numToleratedItems;
    }
    set numToleratedItems(val) {
        this._numToleratedItems = val;
    }
    get loading() {
        return this._loading;
    }
    set loading(val) {
        this._loading = val;
    }
    get autoSize() {
        return this._autoSize;
    }
    set autoSize(val) {
        this._autoSize = val;
    }
    get trackBy() {
        return this._trackBy;
    }
    set trackBy(val) {
        this._trackBy = val;
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        if (val && typeof val === 'object') {
            Object.entries(val).forEach(([k, v]) => this[`_${k}`] !== v && (this[`_${k}`] = v));
        }
    }
    get vertical() {
        return this._orientation === 'vertical';
    }
    get horizontal() {
        return this._orientation === 'horizontal';
    }
    get both() {
        return this._orientation === 'both';
    }
    get loadedItems() {
        if (this._items && !this.d_loading) {
            if (this.both)
                return this._items.slice(this._appendOnly ? 0 : this.first.rows, this.last.rows).map((item) => (this._columns ? item : item.slice(this._appendOnly ? 0 : this.first.cols, this.last.cols)));
            else if (this.horizontal && this._columns)
                return this._items;
            else
                return this._items.slice(this._appendOnly ? 0 : this.first, this.last);
        }
        return [];
    }
    get loadedRows() {
        return this.d_loading ? (this._loaderDisabled ? this.loaderArr : []) : this.loadedItems;
    }
    get loadedColumns() {
        if (this._columns && (this.both || this.horizontal)) {
            return this.d_loading && this._loaderDisabled ? (this.both ? this.loaderArr[0] : this.loaderArr) : this._columns.slice(this.both ? this.first.cols : this.first, this.both ? this.last.cols : this.last);
        }
        return this._columns;
    }
    get isPageChanged() {
        return this._step ? this.page !== this.getPageByFirst() : true;
    }
    ngOnInit() {
        this.setInitialState();
    }
    ngOnChanges(simpleChanges) {
        let isLoadingChanged = false;
        if (simpleChanges.loading) {
            const { previousValue, currentValue } = simpleChanges.loading;
            if (this.lazy && previousValue !== currentValue && currentValue !== this.d_loading) {
                this.d_loading = currentValue;
                isLoadingChanged = true;
            }
        }
        if (simpleChanges.orientation) {
            this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        }
        if (simpleChanges.numToleratedItems) {
            const { previousValue, currentValue } = simpleChanges.numToleratedItems;
            if (previousValue !== currentValue && currentValue !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue;
            }
        }
        if (simpleChanges.options) {
            const { previousValue, currentValue } = simpleChanges.options;
            if (this.lazy && previousValue?.loading !== currentValue?.loading && currentValue?.loading !== this.d_loading) {
                this.d_loading = currentValue.loading;
                isLoadingChanged = true;
            }
            if (previousValue?.numToleratedItems !== currentValue?.numToleratedItems && currentValue?.numToleratedItems !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue.numToleratedItems;
            }
        }
        if (this.initialized) {
            const isChanged = !isLoadingChanged && (simpleChanges.items?.previousValue?.length !== simpleChanges.items?.currentValue?.length || simpleChanges.itemSize || simpleChanges.scrollHeight || simpleChanges.scrollWidth);
            if (isChanged) {
                this.init();
                this.calculateAutoSize();
            }
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'loader':
                    this.loaderTemplate = item.template;
                    break;
                case 'loadericon':
                    this.loaderIconTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            this.viewInit();
        });
    }
    ngAfterViewChecked() {
        if (!this.initialized) {
            this.viewInit();
        }
    }
    ngOnDestroy() {
        this.unbindResizeListener();
        this.contentEl = null;
        this.initialized = false;
    }
    viewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (DomHandler.isVisible(this.elementViewChild?.nativeElement)) {
                this.setInitialState();
                this.setContentEl(this.contentEl);
                this.init();
                this.defaultWidth = DomHandler.getWidth(this.elementViewChild.nativeElement);
                this.defaultHeight = DomHandler.getHeight(this.elementViewChild.nativeElement);
                this.defaultContentWidth = DomHandler.getWidth(this.contentEl);
                this.defaultContentHeight = DomHandler.getHeight(this.contentEl);
                this.initialized = true;
            }
        }
    }
    init() {
        if (!this._disabled) {
            this.setSize();
            this.calculateOptions();
            this.setSpacerSize();
            this.bindResizeListener();
            this.cd.detectChanges();
        }
    }
    setContentEl(el) {
        this.contentEl = el || this.contentViewChild?.nativeElement || DomHandler.findSingle(this.elementViewChild?.nativeElement, '.p-scroller-content');
    }
    setInitialState() {
        this.first = this.both ? { rows: 0, cols: 0 } : 0;
        this.last = this.both ? { rows: 0, cols: 0 } : 0;
        this.numItemsInViewport = this.both ? { rows: 0, cols: 0 } : 0;
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.d_loading = this._loading || false;
        this.d_numToleratedItems = this._numToleratedItems;
        this.loaderArr = [];
        this.spacerStyle = {};
        this.contentStyle = {};
    }
    getElementRef() {
        return this.elementViewChild;
    }
    getPageByFirst() {
        return Math.floor((this.first + this.d_numToleratedItems * 4) / (this._step || 1));
    }
    scrollTo(options) {
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.elementViewChild?.nativeElement?.scrollTo(options);
    }
    scrollToIndex(index, behavior = 'auto') {
        const { numToleratedItems } = this.calculateNumItems();
        const contentPos = this.getContentPosition();
        const calculateFirst = (_index = 0, _numT) => (_index <= _numT ? 0 : _index);
        const calculateCoord = (_first, _size, _cpos) => _first * _size + _cpos;
        const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
        let newFirst = 0;
        if (this.both) {
            newFirst = { rows: calculateFirst(index[0], numToleratedItems[0]), cols: calculateFirst(index[1], numToleratedItems[1]) };
            scrollTo(calculateCoord(newFirst.cols, this._itemSize[1], contentPos.left), calculateCoord(newFirst.rows, this._itemSize[0], contentPos.top));
        }
        else {
            newFirst = calculateFirst(index, numToleratedItems);
            this.horizontal ? scrollTo(calculateCoord(newFirst, this._itemSize, contentPos.left), 0) : scrollTo(0, calculateCoord(newFirst, this._itemSize, contentPos.top));
        }
        this.isRangeChanged = this.first !== newFirst;
        this.first = newFirst;
    }
    scrollInView(index, to, behavior = 'auto') {
        if (to) {
            const { first, viewport } = this.getRenderedRange();
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            const isToStart = to === 'to-start';
            const isToEnd = to === 'to-end';
            if (isToStart) {
                if (this.both) {
                    if (viewport.first.rows - first.rows > index[0]) {
                        scrollTo(viewport.first.cols * this._itemSize[1], (viewport.first.rows - 1) * this._itemSize[0]);
                    }
                    else if (viewport.first.cols - first.cols > index[1]) {
                        scrollTo((viewport.first.cols - 1) * this._itemSize[1], viewport.first.rows * this._itemSize[0]);
                    }
                }
                else {
                    if (viewport.first - first > index) {
                        const pos = (viewport.first - 1) * this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
            else if (isToEnd) {
                if (this.both) {
                    if (viewport.last.rows - first.rows <= index[0] + 1) {
                        scrollTo(viewport.first.cols * this._itemSize[1], (viewport.first.rows + 1) * this._itemSize[0]);
                    }
                    else if (viewport.last.cols - first.cols <= index[1] + 1) {
                        scrollTo((viewport.first.cols + 1) * this._itemSize[1], viewport.first.rows * this._itemSize[0]);
                    }
                }
                else {
                    if (viewport.last - first <= index + 1) {
                        const pos = (viewport.first + 1) * this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
        }
        else {
            this.scrollToIndex(index, behavior);
        }
    }
    getRenderedRange() {
        const calculateFirstInViewport = (_pos, _size) => Math.floor(_pos / (_size || _pos));
        let firstInViewport = this.first;
        let lastInViewport = 0;
        if (this.elementViewChild?.nativeElement) {
            const { scrollTop, scrollLeft } = this.elementViewChild.nativeElement;
            if (this.both) {
                firstInViewport = { rows: calculateFirstInViewport(scrollTop, this._itemSize[0]), cols: calculateFirstInViewport(scrollLeft, this._itemSize[1]) };
                lastInViewport = { rows: firstInViewport.rows + this.numItemsInViewport.rows, cols: firstInViewport.cols + this.numItemsInViewport.cols };
            }
            else {
                const scrollPos = this.horizontal ? scrollLeft : scrollTop;
                firstInViewport = calculateFirstInViewport(scrollPos, this._itemSize);
                lastInViewport = firstInViewport + this.numItemsInViewport;
            }
        }
        return {
            first: this.first,
            last: this.last,
            viewport: {
                first: firstInViewport,
                last: lastInViewport
            }
        };
    }
    calculateNumItems() {
        const contentPos = this.getContentPosition();
        const contentWidth = this.elementViewChild?.nativeElement ? this.elementViewChild.nativeElement.offsetWidth - contentPos.left : 0;
        const contentHeight = this.elementViewChild?.nativeElement ? this.elementViewChild.nativeElement.offsetHeight - contentPos.top : 0;
        const calculateNumItemsInViewport = (_contentSize, _itemSize) => Math.ceil(_contentSize / (_itemSize || _contentSize));
        const calculateNumToleratedItems = (_numItems) => Math.ceil(_numItems / 2);
        const numItemsInViewport = this.both
            ? { rows: calculateNumItemsInViewport(contentHeight, this._itemSize[0]), cols: calculateNumItemsInViewport(contentWidth, this._itemSize[1]) }
            : calculateNumItemsInViewport(this.horizontal ? contentWidth : contentHeight, this._itemSize);
        const numToleratedItems = this.d_numToleratedItems || (this.both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
        return { numItemsInViewport, numToleratedItems };
    }
    calculateOptions() {
        const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
        const calculateLast = (_first, _num, _numT, _isCols = false) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
        const first = this.first;
        const last = this.both
            ? { rows: calculateLast(this.first.rows, numItemsInViewport.rows, numToleratedItems[0]), cols: calculateLast(this.first.cols, numItemsInViewport.cols, numToleratedItems[1], true) }
            : calculateLast(this.first, numItemsInViewport, numToleratedItems);
        this.last = last;
        this.numItemsInViewport = numItemsInViewport;
        this.d_numToleratedItems = numToleratedItems;
        if (this.showLoader) {
            this.loaderArr = this.both ? Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) : Array.from({ length: numItemsInViewport });
        }
        if (this._lazy) {
            Promise.resolve().then(() => {
                this.lazyLoadState = {
                    first: this._step ? (this.both ? { rows: 0, cols: first.cols } : 0) : first,
                    last: Math.min(this._step ? this._step : this.last, this.items.length)
                };
                this.handleEvents('onLazyLoad', this.lazyLoadState);
            });
        }
    }
    calculateAutoSize() {
        if (this._autoSize && !this.d_loading) {
            Promise.resolve().then(() => {
                if (this.contentEl) {
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = 'auto';
                    this.contentEl.style.position = 'relative';
                    this.elementViewChild.nativeElement.style.contain = 'none';
                    const [contentWidth, contentHeight] = [DomHandler.getWidth(this.contentEl), DomHandler.getHeight(this.contentEl)];
                    contentWidth !== this.defaultContentWidth && (this.elementViewChild.nativeElement.style.width = '');
                    contentHeight !== this.defaultContentHeight && (this.elementViewChild.nativeElement.style.height = '');
                    const [width, height] = [DomHandler.getWidth(this.elementViewChild.nativeElement), DomHandler.getHeight(this.elementViewChild.nativeElement)];
                    (this.both || this.horizontal) && (this.elementViewChild.nativeElement.style.width = width < this.defaultWidth ? width + 'px' : this._scrollWidth || this.defaultWidth + 'px');
                    (this.both || this.vertical) && (this.elementViewChild.nativeElement.style.height = height < this.defaultHeight ? height + 'px' : this._scrollHeight || this.defaultHeight + 'px');
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = '';
                    this.contentEl.style.position = '';
                    this.elementViewChild.nativeElement.style.contain = '';
                }
            });
        }
    }
    getLast(last = 0, isCols = false) {
        return this._items ? Math.min(isCols ? (this._columns || this._items[0]).length : this._items.length, last) : 0;
    }
    getContentPosition() {
        if (this.contentEl) {
            const style = getComputedStyle(this.contentEl);
            const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
            const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
            const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
            const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);
            return { left, right, top, bottom, x: left + right, y: top + bottom };
        }
        return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    }
    setSize() {
        if (this.elementViewChild?.nativeElement) {
            const parentElement = this.elementViewChild.nativeElement.parentElement.parentElement;
            const width = this._scrollWidth || `${this.elementViewChild.nativeElement.offsetWidth || parentElement.offsetWidth}px`;
            const height = this._scrollHeight || `${this.elementViewChild.nativeElement.offsetHeight || parentElement.offsetHeight}px`;
            const setProp = (_name, _value) => (this.elementViewChild.nativeElement.style[_name] = _value);
            if (this.both || this.horizontal) {
                setProp('height', height);
                setProp('width', width);
            }
            else {
                setProp('height', height);
            }
        }
    }
    setSpacerSize() {
        if (this._items) {
            const contentPos = this.getContentPosition();
            const setProp = (_name, _value, _size, _cpos = 0) => (this.spacerStyle = { ...this.spacerStyle, ...{ [`${_name}`]: (_value || []).length * _size + _cpos + 'px' } });
            if (this.both) {
                setProp('height', this._items, this._itemSize[0], contentPos.y);
                setProp('width', this._columns || this._items[1], this._itemSize[1], contentPos.x);
            }
            else {
                this.horizontal ? setProp('width', this._columns || this._items, this._itemSize, contentPos.x) : setProp('height', this._items, this._itemSize, contentPos.y);
            }
        }
    }
    setContentPosition(pos) {
        if (this.contentEl && !this._appendOnly) {
            const first = pos ? pos.first : this.first;
            const calculateTranslateVal = (_first, _size) => _first * _size;
            const setTransform = (_x = 0, _y = 0) => (this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } });
            if (this.both) {
                setTransform(calculateTranslateVal(first.cols, this._itemSize[1]), calculateTranslateVal(first.rows, this._itemSize[0]));
            }
            else {
                const translateVal = calculateTranslateVal(first, this._itemSize);
                this.horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
            }
        }
    }
    onScrollPositionChange(event) {
        const target = event.target;
        const contentPos = this.getContentPosition();
        const calculateScrollPos = (_pos, _cpos) => (_pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0);
        const calculateCurrentIndex = (_pos, _size) => Math.floor(_pos / (_size || _pos));
        const calculateTriggerIndex = (_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
            return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
        };
        const calculateFirst = (_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
            if (_currentIndex <= _numT)
                return 0;
            else
                return Math.max(0, _isScrollDownOrRight ? (_currentIndex < _triggerIndex ? _first : _currentIndex - _numT) : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
        };
        const calculateLast = (_currentIndex, _first, _last, _num, _numT, _isCols = false) => {
            let lastValue = _first + _num + 2 * _numT;
            if (_currentIndex >= _numT) {
                lastValue += _numT + 1;
            }
            return this.getLast(lastValue, _isCols);
        };
        const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
        const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
        let newFirst = this.both ? { rows: 0, cols: 0 } : 0;
        let newLast = this.last;
        let isRangeChanged = false;
        let newScrollPos = this.lastScrollPos;
        if (this.both) {
            const isScrollDown = this.lastScrollPos.top <= scrollTop;
            const isScrollRight = this.lastScrollPos.left <= scrollLeft;
            if (!this._appendOnly || (this._appendOnly && (isScrollDown || isScrollRight))) {
                const currentIndex = { rows: calculateCurrentIndex(scrollTop, this._itemSize[0]), cols: calculateCurrentIndex(scrollLeft, this._itemSize[1]) };
                const triggerIndex = {
                    rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };
                newFirst = {
                    rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };
                newLast = {
                    rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
                    cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
                };
                isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols || this.isRangeChanged;
                newScrollPos = { top: scrollTop, left: scrollLeft };
            }
        }
        else {
            const scrollPos = this.horizontal ? scrollLeft : scrollTop;
            const isScrollDownOrRight = this.lastScrollPos <= scrollPos;
            if (!this._appendOnly || (this._appendOnly && isScrollDownOrRight)) {
                const currentIndex = calculateCurrentIndex(scrollPos, this._itemSize);
                const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
                newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
                newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
                isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
                newScrollPos = scrollPos;
            }
        }
        return {
            first: newFirst,
            last: newLast,
            isRangeChanged,
            scrollPos: newScrollPos
        };
    }
    onScrollChange(event) {
        const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event);
        if (isRangeChanged) {
            const newState = { first, last };
            this.setContentPosition(newState);
            this.first = first;
            this.last = last;
            this.lastScrollPos = scrollPos;
            this.handleEvents('onScrollIndexChange', newState);
            if (this._lazy && this.isPageChanged) {
                const lazyLoadState = {
                    first: this._step ? Math.min(this.getPageByFirst() * this._step, this.items.length - this._step) : first,
                    last: Math.min(this._step ? (this.getPageByFirst() + 1) * this._step : last, this.items.length)
                };
                const isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;
                isLazyStateChanged && this.handleEvents('onLazyLoad', lazyLoadState);
                this.lazyLoadState = lazyLoadState;
            }
        }
    }
    onContainerScroll(event) {
        this.handleEvents('onScroll', { originalEvent: event });
        if (this._delay && this.isPageChanged) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            if (!this.d_loading && this.showLoader) {
                const { isRangeChanged } = this.onScrollPositionChange(event);
                const changed = isRangeChanged || (this._step ? this.isPageChanged : false);
                if (changed) {
                    this.d_loading = true;
                    this.cd.detectChanges();
                }
            }
            this.scrollTimeout = setTimeout(() => {
                this.onScrollChange(event);
                if (this.d_loading && this.showLoader && (!this._lazy || this._loading === undefined)) {
                    this.d_loading = false;
                    this.page = this.getPageByFirst();
                    this.cd.detectChanges();
                }
            }, this._delay);
        }
        else {
            !this.d_loading && this.onScrollChange(event);
        }
    }
    bindResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.windowResizeListener) {
                this.zone.runOutsideAngular(() => {
                    const window = this.document.defaultView;
                    const event = DomHandler.isTouchDevice() ? 'orientationchange' : 'resize';
                    this.windowResizeListener = this.renderer.listen(window, event, this.onWindowResize.bind(this));
                });
            }
        }
    }
    unbindResizeListener() {
        if (this.windowResizeListener) {
            this.windowResizeListener();
            this.windowResizeListener = null;
        }
    }
    onWindowResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            if (DomHandler.isVisible(this.elementViewChild?.nativeElement)) {
                const [width, height] = [DomHandler.getWidth(this.elementViewChild.nativeElement), DomHandler.getHeight(this.elementViewChild.nativeElement)];
                const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
                const reinit = this.both ? isDiffWidth || isDiffHeight : this.horizontal ? isDiffWidth : this.vertical ? isDiffHeight : false;
                reinit &&
                    this.zone.run(() => {
                        this.d_numToleratedItems = this._numToleratedItems;
                        this.defaultWidth = width;
                        this.defaultHeight = height;
                        this.defaultContentWidth = DomHandler.getWidth(this.contentEl);
                        this.defaultContentHeight = DomHandler.getHeight(this.contentEl);
                        this.init();
                    });
            }
        }, this._resizeDelay);
    }
    handleEvents(name, params) {
        return this.options && this.options[name] ? this.options[name](params) : this[name].emit(params);
    }
    getContentOptions() {
        return {
            contentStyleClass: `p-scroller-content ${this.d_loading ? 'p-scroller-loading' : ''}`,
            items: this.loadedItems,
            getItemOptions: (index) => this.getOptions(index),
            loading: this.d_loading,
            getLoaderOptions: (index, options) => this.getLoaderOptions(index, options),
            itemSize: this._itemSize,
            rows: this.loadedRows,
            columns: this.loadedColumns,
            spacerStyle: this.spacerStyle,
            contentStyle: this.contentStyle,
            vertical: this.vertical,
            horizontal: this.horizontal,
            both: this.both
        };
    }
    getOptions(renderedIndex) {
        const count = (this._items || []).length;
        const index = this.both ? this.first.rows + renderedIndex : this.first + renderedIndex;
        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0
        };
    }
    getLoaderOptions(index, extOptions) {
        const count = this.loaderArr.length;
        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0,
            ...extOptions
        };
    }
}
Scroller.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Scroller, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
Scroller.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: Scroller, selector: "p-scroller", inputs: { id: "id", style: "style", styleClass: "styleClass", tabindex: "tabindex", items: "items", itemSize: "itemSize", scrollHeight: "scrollHeight", scrollWidth: "scrollWidth", orientation: "orientation", step: "step", delay: "delay", resizeDelay: "resizeDelay", appendOnly: "appendOnly", inline: "inline", lazy: "lazy", disabled: "disabled", loaderDisabled: "loaderDisabled", columns: "columns", showSpacer: "showSpacer", showLoader: "showLoader", numToleratedItems: "numToleratedItems", loading: "loading", autoSize: "autoSize", trackBy: "trackBy", options: "options" }, outputs: { onLazyLoad: "onLazyLoad", onScroll: "onScroll", onScrollIndexChange: "onScrollIndexChange" }, host: { classAttribute: "p-scroller-viewport p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "elementViewChild", first: true, predicate: ["element"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <ng-container *ngIf="!_disabled; else disabledContainer">
            <div
                #element
                [attr.id]="_id"
                [attr.tabindex]="tabindex"
                [ngStyle]="_style"
                [class]="_styleClass"
                [ngClass]="{ 'p-scroller': true, 'p-scroller-inline': inline, 'p-both-scroll': both, 'p-horizontal-scroll': horizontal }"
                (scroll)="onContainerScroll($event)"
            >
                <ng-container *ngIf="contentTemplate; else buildInContent">
                    <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: loadedItems, options: getContentOptions() }"></ng-container>
                </ng-container>
                <ng-template #buildInContent>
                    <div #content class="p-scroller-content" [ngClass]="{ 'p-scroller-loading': d_loading }" [ngStyle]="contentStyle">
                        <ng-container *ngFor="let item of loadedItems; let index = index; trackBy: _trackBy || index">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        </ng-container>
                    </div>
                </ng-template>
                <div *ngIf="_showSpacer" class="p-scroller-spacer" [ngStyle]="spacerStyle"></div>
                <div *ngIf="!loaderDisabled && _showLoader && d_loading" class="p-scroller-loader" [ngClass]="{ 'p-component-overlay': !loaderTemplate }">
                    <ng-container *ngIf="loaderTemplate; else buildInLoader">
                        <ng-container *ngFor="let item of loaderArr; let index = index">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: getLoaderOptions(index, both && { numCols: _numItemsInViewport.cols }) }"></ng-container>
                        </ng-container>
                    </ng-container>
                    <ng-template #buildInLoader>
                        <ng-container *ngIf="loaderIconTemplate; else buildInLoaderIcon">
                            <ng-container *ngTemplateOutlet="loaderIconTemplate; context: { options: { styleClass: 'p-scroller-loading-icon' } }"></ng-container>
                        </ng-container>
                        <ng-template #buildInLoaderIcon>
                            <i class="p-scroller-loading-icon pi pi-spinner pi-spin"></i>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
        </ng-container>
        <ng-template #disabledContainer>
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate">
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: items, options: { rows: _items, columns: loadedColumns } }"></ng-container>
            </ng-container>
        </ng-template>
    `, isInline: true, styles: ["p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{font-size:2rem}.p-scroller-inline .p-scroller-content{position:static}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Scroller, decorators: [{
            type: Component,
            args: [{ selector: 'p-scroller', template: `
        <ng-container *ngIf="!_disabled; else disabledContainer">
            <div
                #element
                [attr.id]="_id"
                [attr.tabindex]="tabindex"
                [ngStyle]="_style"
                [class]="_styleClass"
                [ngClass]="{ 'p-scroller': true, 'p-scroller-inline': inline, 'p-both-scroll': both, 'p-horizontal-scroll': horizontal }"
                (scroll)="onContainerScroll($event)"
            >
                <ng-container *ngIf="contentTemplate; else buildInContent">
                    <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: loadedItems, options: getContentOptions() }"></ng-container>
                </ng-container>
                <ng-template #buildInContent>
                    <div #content class="p-scroller-content" [ngClass]="{ 'p-scroller-loading': d_loading }" [ngStyle]="contentStyle">
                        <ng-container *ngFor="let item of loadedItems; let index = index; trackBy: _trackBy || index">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        </ng-container>
                    </div>
                </ng-template>
                <div *ngIf="_showSpacer" class="p-scroller-spacer" [ngStyle]="spacerStyle"></div>
                <div *ngIf="!loaderDisabled && _showLoader && d_loading" class="p-scroller-loader" [ngClass]="{ 'p-component-overlay': !loaderTemplate }">
                    <ng-container *ngIf="loaderTemplate; else buildInLoader">
                        <ng-container *ngFor="let item of loaderArr; let index = index">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: getLoaderOptions(index, both && { numCols: _numItemsInViewport.cols }) }"></ng-container>
                        </ng-container>
                    </ng-container>
                    <ng-template #buildInLoader>
                        <ng-container *ngIf="loaderIconTemplate; else buildInLoaderIcon">
                            <ng-container *ngTemplateOutlet="loaderIconTemplate; context: { options: { styleClass: 'p-scroller-loading-icon' } }"></ng-container>
                        </ng-container>
                        <ng-template #buildInLoaderIcon>
                            <i class="p-scroller-loading-icon pi pi-spinner pi-spin"></i>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
        </ng-container>
        <ng-template #disabledContainer>
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate">
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: items, options: { rows: _items, columns: loadedColumns } }"></ng-container>
            </ng-container>
        </ng-template>
    `, changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-scroller-viewport p-element'
                    }, styles: ["p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{font-size:2rem}.p-scroller-inline .p-scroller-content{position:static}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { id: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], items: [{
                type: Input
            }], itemSize: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], scrollWidth: [{
                type: Input
            }], orientation: [{
                type: Input
            }], step: [{
                type: Input
            }], delay: [{
                type: Input
            }], resizeDelay: [{
                type: Input
            }], appendOnly: [{
                type: Input
            }], inline: [{
                type: Input
            }], lazy: [{
                type: Input
            }], disabled: [{
                type: Input
            }], loaderDisabled: [{
                type: Input
            }], columns: [{
                type: Input
            }], showSpacer: [{
                type: Input
            }], showLoader: [{
                type: Input
            }], numToleratedItems: [{
                type: Input
            }], loading: [{
                type: Input
            }], autoSize: [{
                type: Input
            }], trackBy: [{
                type: Input
            }], options: [{
                type: Input
            }], elementViewChild: [{
                type: ViewChild,
                args: ['element']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], onLazyLoad: [{
                type: Output
            }], onScroll: [{
                type: Output
            }], onScrollIndexChange: [{
                type: Output
            }] } });
export class ScrollerModule {
}
ScrollerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ScrollerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ScrollerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.4", ngImport: i0, type: ScrollerModule, declarations: [Scroller], imports: [CommonModule, SharedModule], exports: [Scroller, SharedModule] });
ScrollerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ScrollerModule, imports: [CommonModule, SharedModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ScrollerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule],
                    exports: [Scroller, SharedModule],
                    declarations: [Scroller]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc2Nyb2xsZXIvc2Nyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBR0gsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxlQUFlLEVBRWYsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUlSLE1BQU0sRUFDTixXQUFXLEVBS1gsU0FBUyxFQUNULGlCQUFpQixFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDOzs7QUEyRnpDLE1BQU0sT0FBTyxRQUFRO0lBMFVqQixZQUFzQyxRQUFrQixFQUErQixVQUFlLEVBQVUsUUFBbUIsRUFBVSxFQUFxQixFQUFVLElBQVk7UUFBbEosYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUErQixlQUFVLEdBQVYsVUFBVSxDQUFLO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQWhKOUssZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRW5ELGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVqRCx3QkFBbUIsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVF0RSxjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBSXRCLGNBQVMsR0FBUSxDQUFDLENBQUM7UUFNbkIsaUJBQVksR0FBVyxVQUFVLENBQUM7UUFFbEMsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUVsQixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FB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RyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN0TSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDOztnQkFDekQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9FO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzVGLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDYixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNqRCxPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJ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LFFBQVE7c0JBQWpCLE1BQU07Z0JBRUcsbUJBQW1CO3NCQUE1QixNQUFNOztBQTR1QlgsTUFBTSxPQUFPLGNBQWM7OzJHQUFkLGNBQWM7NEdBQWQsY0FBYyxpQkExNkJkLFFBQVEsYUFzNkJQLFlBQVksRUFBRSxZQUFZLGFBdDZCM0IsUUFBUSxFQXU2QkcsWUFBWTs0R0FHdkIsY0FBYyxZQUpiLFlBQVksRUFBRSxZQUFZLEVBQ2hCLFlBQVk7MkZBR3ZCLGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztvQkFDckMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQztvQkFDakMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUMzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSwgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdDaGVja2VkLFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE5nWm9uZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBQTEFURk9STV9JRCxcbiAgICBRdWVyeUxpc3QsXG4gICAgUmVuZGVyZXIyLFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuZXhwb3J0IHR5cGUgU2Nyb2xsZXJUb1R5cGUgPSAndG8tc3RhcnQnIHwgJ3RvLWVuZCcgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIFNjcm9sbGVyT3JpZW50YXRpb25UeXBlID0gJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyB8ICdib3RoJztcblxuZXhwb3J0IGludGVyZmFjZSBTY3JvbGxlck9wdGlvbnMge1xuICAgIGlkPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIHN0eWxlPzogYW55O1xuICAgIHN0eWxlQ2xhc3M/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgdGFiaW5kZXg/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgaXRlbXM/OiBhbnlbXTtcbiAgICBpdGVtU2l6ZT86IGFueTtcbiAgICBzY3JvbGxIZWlnaHQ/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgc2Nyb2xsV2lkdGg/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgb3JpZW50YXRpb24/OiBTY3JvbGxlck9yaWVudGF0aW9uVHlwZTtcbiAgICBzdGVwPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGRlbGF5PzogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIHJlc2l6ZURlbGF5PzogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGFwcGVuZE9ubHk/OiBib29sZWFuO1xuICAgIGlubGluZT86IGJvb2xlYW47XG4gICAgbGF6eT86IGJvb2xlYW47XG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIGxvYWRlckRpc2FibGVkPzogYm9vbGVhbjtcbiAgICBjb2x1bW5zPzogYW55W10gfCB1bmRlZmluZWQ7XG4gICAgc2hvd1NwYWNlcj86IGJvb2xlYW47XG4gICAgc2hvd0xvYWRlcj86IGJvb2xlYW47XG4gICAgbnVtVG9sZXJhdGVkSXRlbXM/OiBhbnk7XG4gICAgbG9hZGluZz86IGJvb2xlYW47XG4gICAgYXV0b1NpemU/OiBib29sZWFuO1xuICAgIHRyYWNrQnk/OiBhbnk7XG4gICAgb25MYXp5TG9hZD86IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xuICAgIG9uU2Nyb2xsPzogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG4gICAgb25TY3JvbGxJbmRleENoYW5nZT86IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atc2Nyb2xsZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhX2Rpc2FibGVkOyBlbHNlIGRpc2FibGVkQ29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgI2VsZW1lbnRcbiAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJfaWRcIlxuICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCJcbiAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJfc3R5bGVcIlxuICAgICAgICAgICAgICAgIFtjbGFzc109XCJfc3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1zY3JvbGxlcic6IHRydWUsICdwLXNjcm9sbGVyLWlubGluZSc6IGlubGluZSwgJ3AtYm90aC1zY3JvbGwnOiBib3RoLCAncC1ob3Jpem9udGFsLXNjcm9sbCc6IGhvcml6b250YWwgfVwiXG4gICAgICAgICAgICAgICAgKHNjcm9sbCk9XCJvbkNvbnRhaW5lclNjcm9sbCgkZXZlbnQpXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29udGVudFRlbXBsYXRlOyBlbHNlIGJ1aWxkSW5Db250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb250ZW50VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBsb2FkZWRJdGVtcywgb3B0aW9uczogZ2V0Q29udGVudE9wdGlvbnMoKSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNidWlsZEluQ29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAjY29udGVudCBjbGFzcz1cInAtc2Nyb2xsZXItY29udGVudFwiIFtuZ0NsYXNzXT1cInsgJ3Atc2Nyb2xsZXItbG9hZGluZyc6IGRfbG9hZGluZyB9XCIgW25nU3R5bGVdPVwiY29udGVudFN0eWxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIGxvYWRlZEl0ZW1zOyBsZXQgaW5kZXggPSBpbmRleDsgdHJhY2tCeTogX3RyYWNrQnkgfHwgaW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSwgb3B0aW9uczogZ2V0T3B0aW9ucyhpbmRleCkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cIl9zaG93U3BhY2VyXCIgY2xhc3M9XCJwLXNjcm9sbGVyLXNwYWNlclwiIFtuZ1N0eWxlXT1cInNwYWNlclN0eWxlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cIiFsb2FkZXJEaXNhYmxlZCAmJiBfc2hvd0xvYWRlciAmJiBkX2xvYWRpbmdcIiBjbGFzcz1cInAtc2Nyb2xsZXItbG9hZGVyXCIgW25nQ2xhc3NdPVwieyAncC1jb21wb25lbnQtb3ZlcmxheSc6ICFsb2FkZXJUZW1wbGF0ZSB9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsb2FkZXJUZW1wbGF0ZTsgZWxzZSBidWlsZEluTG9hZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIGxvYWRlckFycjsgbGV0IGluZGV4ID0gaW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwibG9hZGVyVGVtcGxhdGU7IGNvbnRleHQ6IHsgb3B0aW9uczogZ2V0TG9hZGVyT3B0aW9ucyhpbmRleCwgYm90aCAmJiB7IG51bUNvbHM6IF9udW1JdGVtc0luVmlld3BvcnQuY29scyB9KSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbGRJbkxvYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsb2FkZXJJY29uVGVtcGxhdGU7IGVsc2UgYnVpbGRJbkxvYWRlckljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwibG9hZGVySWNvblRlbXBsYXRlOyBjb250ZXh0OiB7IG9wdGlvbnM6IHsgc3R5bGVDbGFzczogJ3Atc2Nyb2xsZXItbG9hZGluZy1pY29uJyB9IH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNidWlsZEluTG9hZGVySWNvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInAtc2Nyb2xsZXItbG9hZGluZy1pY29uIHBpIHBpLXNwaW5uZXIgcGktc3BpblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGlzYWJsZWRDb250YWluZXI+XG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29udGVudFRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNvbnRlbnRUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGl0ZW1zLCBvcHRpb25zOiB7IHJvd3M6IF9pdGVtcywgY29sdW1uczogbG9hZGVkQ29sdW1ucyB9IH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vc2Nyb2xsZXIuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3Atc2Nyb2xsZXItdmlld3BvcnQgcC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsZXIgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgZ2V0IGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XG4gICAgfVxuICAgIHNldCBpZCh2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9pZCA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc3R5bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHlsZTtcbiAgICB9XG4gICAgc2V0IHN0eWxlKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX3N0eWxlID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzdHlsZUNsYXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3R5bGVDbGFzcztcbiAgICB9XG4gICAgc2V0IHN0eWxlQ2xhc3ModmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc3R5bGVDbGFzcyA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgdGFiaW5kZXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90YWJpbmRleDtcbiAgICB9XG4gICAgc2V0IHRhYmluZGV4KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3RhYmluZGV4ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBpdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zO1xuICAgIH1cbiAgICBzZXQgaXRlbXModmFsOiBhbnlbXSkge1xuICAgICAgICB0aGlzLl9pdGVtcyA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgaXRlbVNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtU2l6ZTtcbiAgICB9XG4gICAgc2V0IGl0ZW1TaXplKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX2l0ZW1TaXplID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzY3JvbGxIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxIZWlnaHQ7XG4gICAgfVxuICAgIHNldCBzY3JvbGxIZWlnaHQodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsSGVpZ2h0ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzY3JvbGxXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbFdpZHRoO1xuICAgIH1cbiAgICBzZXQgc2Nyb2xsV2lkdGgodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsV2lkdGggPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG9yaWVudGF0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZW50YXRpb247XG4gICAgfVxuICAgIHNldCBvcmllbnRhdGlvbih2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9vcmllbnRhdGlvbiA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc3RlcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0ZXA7XG4gICAgfVxuICAgIHNldCBzdGVwKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3N0ZXAgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGRlbGF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVsYXk7XG4gICAgfVxuICAgIHNldCBkZWxheSh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9kZWxheSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgcmVzaXplRGVsYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNpemVEZWxheTtcbiAgICB9XG4gICAgc2V0IHJlc2l6ZURlbGF5KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3Jlc2l6ZURlbGF5ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBhcHBlbmRPbmx5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwZW5kT25seTtcbiAgICB9XG4gICAgc2V0IGFwcGVuZE9ubHkodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2FwcGVuZE9ubHkgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGlubGluZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lubGluZTtcbiAgICB9XG4gICAgc2V0IGlubGluZSh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5faW5saW5lID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBsYXp5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGF6eTtcbiAgICB9XG4gICAgc2V0IGxhenkodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2xhenkgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gICAgfVxuICAgIHNldCBkaXNhYmxlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGxvYWRlckRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGVyRGlzYWJsZWQ7XG4gICAgfVxuICAgIHNldCBsb2FkZXJEaXNhYmxlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fbG9hZGVyRGlzYWJsZWQgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGNvbHVtbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2x1bW5zO1xuICAgIH1cbiAgICBzZXQgY29sdW1ucyh2YWw6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuX2NvbHVtbnMgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHNob3dTcGFjZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaG93U3BhY2VyO1xuICAgIH1cbiAgICBzZXQgc2hvd1NwYWNlcih2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fc2hvd1NwYWNlciA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2hvd0xvYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nob3dMb2FkZXI7XG4gICAgfVxuICAgIHNldCBzaG93TG9hZGVyKHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9zaG93TG9hZGVyID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBudW1Ub2xlcmF0ZWRJdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX251bVRvbGVyYXRlZEl0ZW1zO1xuICAgIH1cbiAgICBzZXQgbnVtVG9sZXJhdGVkSXRlbXModmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fbnVtVG9sZXJhdGVkSXRlbXMgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGxvYWRpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkaW5nO1xuICAgIH1cbiAgICBzZXQgbG9hZGluZyh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgYXV0b1NpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRvU2l6ZTtcbiAgICB9XG4gICAgc2V0IGF1dG9TaXplKHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9hdXRvU2l6ZSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgdHJhY2tCeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYWNrQnk7XG4gICAgfVxuICAgIHNldCB0cmFja0J5KHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX3RyYWNrQnkgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICAgIH1cbiAgICBzZXQgb3B0aW9ucyh2YWw6IFNjcm9sbGVyT3B0aW9ucykge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gdmFsO1xuXG4gICAgICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbCkuZm9yRWFjaCgoW2ssIHZdKSA9PiB0aGlzW2BfJHtrfWBdICE9PSB2ICYmICh0aGlzW2BfJHtrfWBdID0gdikpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQFZpZXdDaGlsZCgnZWxlbWVudCcpIGVsZW1lbnRWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdjb250ZW50JykgY29udGVudFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIEBPdXRwdXQoKSBvbkxhenlMb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNjcm9sbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TY3JvbGxJbmRleENoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBfaWQ6IHN0cmluZztcblxuICAgIF9zdHlsZTogYW55O1xuXG4gICAgX3N0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIF90YWJpbmRleDogbnVtYmVyID0gMDtcblxuICAgIF9pdGVtczogYW55W107XG5cbiAgICBfaXRlbVNpemU6IGFueSA9IDA7XG5cbiAgICBfc2Nyb2xsSGVpZ2h0OiBzdHJpbmc7XG5cbiAgICBfc2Nyb2xsV2lkdGg6IHN0cmluZztcblxuICAgIF9vcmllbnRhdGlvbjogc3RyaW5nID0gJ3ZlcnRpY2FsJztcblxuICAgIF9zdGVwOiBudW1iZXIgPSAwO1xuXG4gICAgX2RlbGF5OiBudW1iZXIgPSAwO1xuXG4gICAgX3Jlc2l6ZURlbGF5OiBudW1iZXIgPSAxMDtcblxuICAgIF9hcHBlbmRPbmx5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfaW5saW5lOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfbGF6eTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfbG9hZGVyRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9jb2x1bW5zOiBhbnlbXTtcblxuICAgIF9zaG93U3BhY2VyOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIF9zaG93TG9hZGVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfbnVtVG9sZXJhdGVkSXRlbXM6IGFueTtcblxuICAgIF9sb2FkaW5nOiBib29sZWFuO1xuXG4gICAgX2F1dG9TaXplOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfdHJhY2tCeTogYW55O1xuXG4gICAgX29wdGlvbnM6IFNjcm9sbGVyT3B0aW9ucztcblxuICAgIGRfbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZF9udW1Ub2xlcmF0ZWRJdGVtczogYW55O1xuXG4gICAgY29udGVudEVsOiBhbnk7XG5cbiAgICBjb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBsb2FkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGxvYWRlckljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZpcnN0OiBhbnkgPSAwO1xuXG4gICAgbGFzdDogYW55ID0gMDtcblxuICAgIHBhZ2U6IG51bWJlciA9IDA7XG5cbiAgICBpc1JhbmdlQ2hhbmdlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgbnVtSXRlbXNJblZpZXdwb3J0OiBhbnkgPSAwO1xuXG4gICAgbGFzdFNjcm9sbFBvczogYW55ID0gMDtcblxuICAgIGxhenlMb2FkU3RhdGU6IGFueSA9IHt9O1xuXG4gICAgbG9hZGVyQXJyOiBhbnlbXSA9IFtdO1xuXG4gICAgc3BhY2VyU3R5bGU6IGFueSA9IHt9O1xuXG4gICAgY29udGVudFN0eWxlOiBhbnkgPSB7fTtcblxuICAgIHNjcm9sbFRpbWVvdXQ6IGFueTtcblxuICAgIHJlc2l6ZVRpbWVvdXQ6IGFueTtcblxuICAgIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICB3aW5kb3dSZXNpemVMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGRlZmF1bHRXaWR0aDogbnVtYmVyO1xuXG4gICAgZGVmYXVsdEhlaWdodDogbnVtYmVyO1xuXG4gICAgZGVmYXVsdENvbnRlbnRXaWR0aDogbnVtYmVyO1xuXG4gICAgZGVmYXVsdENvbnRlbnRIZWlnaHQ6IG51bWJlcjtcblxuICAgIGdldCB2ZXJ0aWNhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yaWVudGF0aW9uID09PSAndmVydGljYWwnO1xuICAgIH1cblxuICAgIGdldCBob3Jpem9udGFsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJztcbiAgICB9XG5cbiAgICBnZXQgYm90aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yaWVudGF0aW9uID09PSAnYm90aCc7XG4gICAgfVxuXG4gICAgZ2V0IGxvYWRlZEl0ZW1zKCkge1xuICAgICAgICBpZiAodGhpcy5faXRlbXMgJiYgIXRoaXMuZF9sb2FkaW5nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ib3RoKSByZXR1cm4gdGhpcy5faXRlbXMuc2xpY2UodGhpcy5fYXBwZW5kT25seSA/IDAgOiB0aGlzLmZpcnN0LnJvd3MsIHRoaXMubGFzdC5yb3dzKS5tYXAoKGl0ZW0pID0+ICh0aGlzLl9jb2x1bW5zID8gaXRlbSA6IGl0ZW0uc2xpY2UodGhpcy5fYXBwZW5kT25seSA/IDAgOiB0aGlzLmZpcnN0LmNvbHMsIHRoaXMubGFzdC5jb2xzKSkpO1xuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5ob3Jpem9udGFsICYmIHRoaXMuX2NvbHVtbnMpIHJldHVybiB0aGlzLl9pdGVtcztcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuX2l0ZW1zLnNsaWNlKHRoaXMuX2FwcGVuZE9ubHkgPyAwIDogdGhpcy5maXJzdCwgdGhpcy5sYXN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBnZXQgbG9hZGVkUm93cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZF9sb2FkaW5nID8gKHRoaXMuX2xvYWRlckRpc2FibGVkID8gdGhpcy5sb2FkZXJBcnIgOiBbXSkgOiB0aGlzLmxvYWRlZEl0ZW1zO1xuICAgIH1cblxuICAgIGdldCBsb2FkZWRDb2x1bW5zKCkge1xuICAgICAgICBpZiAodGhpcy5fY29sdW1ucyAmJiAodGhpcy5ib3RoIHx8IHRoaXMuaG9yaXpvbnRhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRfbG9hZGluZyAmJiB0aGlzLl9sb2FkZXJEaXNhYmxlZCA/ICh0aGlzLmJvdGggPyB0aGlzLmxvYWRlckFyclswXSA6IHRoaXMubG9hZGVyQXJyKSA6IHRoaXMuX2NvbHVtbnMuc2xpY2UodGhpcy5ib3RoID8gdGhpcy5maXJzdC5jb2xzIDogdGhpcy5maXJzdCwgdGhpcy5ib3RoID8gdGhpcy5sYXN0LmNvbHMgOiB0aGlzLmxhc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbHVtbnM7XG4gICAgfVxuXG4gICAgZ2V0IGlzUGFnZUNoYW5nZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGVwID8gdGhpcy5wYWdlICE9PSB0aGlzLmdldFBhZ2VCeUZpcnN0KCkgOiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LCBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGUoKTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhzaW1wbGVDaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGxldCBpc0xvYWRpbmdDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZXMubG9hZGluZykge1xuICAgICAgICAgICAgY29uc3QgeyBwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUgfSA9IHNpbXBsZUNoYW5nZXMubG9hZGluZztcblxuICAgICAgICAgICAgaWYgKHRoaXMubGF6eSAmJiBwcmV2aW91c1ZhbHVlICE9PSBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlICE9PSB0aGlzLmRfbG9hZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZF9sb2FkaW5nID0gY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgICAgIGlzTG9hZGluZ0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZXMub3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMubGFzdFNjcm9sbFBvcyA9IHRoaXMuYm90aCA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZXMubnVtVG9sZXJhdGVkSXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlIH0gPSBzaW1wbGVDaGFuZ2VzLm51bVRvbGVyYXRlZEl0ZW1zO1xuXG4gICAgICAgICAgICBpZiAocHJldmlvdXNWYWx1ZSAhPT0gY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZSAhPT0gdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zID0gY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZXMub3B0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgeyBwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUgfSA9IHNpbXBsZUNoYW5nZXMub3B0aW9ucztcblxuICAgICAgICAgICAgaWYgKHRoaXMubGF6eSAmJiBwcmV2aW91c1ZhbHVlPy5sb2FkaW5nICE9PSBjdXJyZW50VmFsdWU/LmxvYWRpbmcgJiYgY3VycmVudFZhbHVlPy5sb2FkaW5nICE9PSB0aGlzLmRfbG9hZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZF9sb2FkaW5nID0gY3VycmVudFZhbHVlLmxvYWRpbmc7XG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcmV2aW91c1ZhbHVlPy5udW1Ub2xlcmF0ZWRJdGVtcyAhPT0gY3VycmVudFZhbHVlPy5udW1Ub2xlcmF0ZWRJdGVtcyAmJiBjdXJyZW50VmFsdWU/Lm51bVRvbGVyYXRlZEl0ZW1zICE9PSB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgPSBjdXJyZW50VmFsdWUubnVtVG9sZXJhdGVkSXRlbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgY29uc3QgaXNDaGFuZ2VkID0gIWlzTG9hZGluZ0NoYW5nZWQgJiYgKHNpbXBsZUNoYW5nZXMuaXRlbXM/LnByZXZpb3VzVmFsdWU/Lmxlbmd0aCAhPT0gc2ltcGxlQ2hhbmdlcy5pdGVtcz8uY3VycmVudFZhbHVlPy5sZW5ndGggfHwgc2ltcGxlQ2hhbmdlcy5pdGVtU2l6ZSB8fCBzaW1wbGVDaGFuZ2VzLnNjcm9sbEhlaWdodCB8fCBzaW1wbGVDaGFuZ2VzLnNjcm9sbFdpZHRoKTtcblxuICAgICAgICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQXV0b1NpemUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsb2FkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsb2FkZXJpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnZpZXdJbml0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdJbml0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRSZXNpemVMaXN0ZW5lcigpO1xuXG4gICAgICAgIHRoaXMuY29udGVudEVsID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZpZXdJbml0KCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKERvbUhhbmRsZXIuaXNWaXNpYmxlKHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEluaXRpYWxTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudEVsKHRoaXMuY29udGVudEVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFdpZHRoID0gRG9tSGFuZGxlci5nZXRXaWR0aCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0SGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRIZWlnaHQodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdENvbnRlbnRXaWR0aCA9IERvbUhhbmRsZXIuZ2V0V2lkdGgodGhpcy5jb250ZW50RWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdENvbnRlbnRIZWlnaHQgPSBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmNvbnRlbnRFbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpemUoKTtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlT3B0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5zZXRTcGFjZXJTaXplKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRSZXNpemVMaXN0ZW5lcigpO1xuXG4gICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENvbnRlbnRFbChlbD86IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuY29udGVudEVsID0gZWwgfHwgdGhpcy5jb250ZW50Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50IHx8IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQsICcucC1zY3JvbGxlci1jb250ZW50Jyk7XG4gICAgfVxuXG4gICAgc2V0SW5pdGlhbFN0YXRlKCkge1xuICAgICAgICB0aGlzLmZpcnN0ID0gdGhpcy5ib3RoID8geyByb3dzOiAwLCBjb2xzOiAwIH0gOiAwO1xuICAgICAgICB0aGlzLmxhc3QgPSB0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0ID0gdGhpcy5ib3RoID8geyByb3dzOiAwLCBjb2xzOiAwIH0gOiAwO1xuICAgICAgICB0aGlzLmxhc3RTY3JvbGxQb3MgPSB0aGlzLmJvdGggPyB7IHRvcDogMCwgbGVmdDogMCB9IDogMDtcbiAgICAgICAgdGhpcy5kX2xvYWRpbmcgPSB0aGlzLl9sb2FkaW5nIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgPSB0aGlzLl9udW1Ub2xlcmF0ZWRJdGVtcztcbiAgICAgICAgdGhpcy5sb2FkZXJBcnIgPSBbXTtcbiAgICAgICAgdGhpcy5zcGFjZXJTdHlsZSA9IHt9O1xuICAgICAgICB0aGlzLmNvbnRlbnRTdHlsZSA9IHt9O1xuICAgIH1cblxuICAgIGdldEVsZW1lbnRSZWYoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ7XG4gICAgfVxuXG4gICAgZ2V0UGFnZUJ5Rmlyc3QoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCh0aGlzLmZpcnN0ICsgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zICogNCkgLyAodGhpcy5fc3RlcCB8fCAxKSk7XG4gICAgfVxuXG4gICAgc2Nyb2xsVG8ob3B0aW9uczogU2Nyb2xsVG9PcHRpb25zKSB7XG4gICAgICAgIHRoaXMubGFzdFNjcm9sbFBvcyA9IHRoaXMuYm90aCA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAwO1xuICAgICAgICB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQ/LnNjcm9sbFRvKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNjcm9sbFRvSW5kZXgoaW5kZXg6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgICAgIGNvbnN0IHsgbnVtVG9sZXJhdGVkSXRlbXMgfSA9IHRoaXMuY2FsY3VsYXRlTnVtSXRlbXMoKTtcbiAgICAgICAgY29uc3QgY29udGVudFBvcyA9IHRoaXMuZ2V0Q29udGVudFBvc2l0aW9uKCk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUZpcnN0ID0gKF9pbmRleCA9IDAsIF9udW1UKSA9PiAoX2luZGV4IDw9IF9udW1UID8gMCA6IF9pbmRleCk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUNvb3JkID0gKF9maXJzdCwgX3NpemUsIF9jcG9zKSA9PiBfZmlyc3QgKiBfc2l6ZSArIF9jcG9zO1xuICAgICAgICBjb25zdCBzY3JvbGxUbyA9IChsZWZ0ID0gMCwgdG9wID0gMCkgPT4gdGhpcy5zY3JvbGxUbyh7IGxlZnQsIHRvcCwgYmVoYXZpb3IgfSk7XG4gICAgICAgIGxldCBuZXdGaXJzdDogYW55ID0gMDtcblxuICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICBuZXdGaXJzdCA9IHsgcm93czogY2FsY3VsYXRlRmlyc3QoaW5kZXhbMF0sIG51bVRvbGVyYXRlZEl0ZW1zWzBdKSwgY29sczogY2FsY3VsYXRlRmlyc3QoaW5kZXhbMV0sIG51bVRvbGVyYXRlZEl0ZW1zWzFdKSB9O1xuICAgICAgICAgICAgc2Nyb2xsVG8oY2FsY3VsYXRlQ29vcmQobmV3Rmlyc3QuY29scywgdGhpcy5faXRlbVNpemVbMV0sIGNvbnRlbnRQb3MubGVmdCksIGNhbGN1bGF0ZUNvb3JkKG5ld0ZpcnN0LnJvd3MsIHRoaXMuX2l0ZW1TaXplWzBdLCBjb250ZW50UG9zLnRvcCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3Rmlyc3QgPSBjYWxjdWxhdGVGaXJzdChpbmRleCwgbnVtVG9sZXJhdGVkSXRlbXMpO1xuICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID8gc2Nyb2xsVG8oY2FsY3VsYXRlQ29vcmQobmV3Rmlyc3QsIHRoaXMuX2l0ZW1TaXplLCBjb250ZW50UG9zLmxlZnQpLCAwKSA6IHNjcm9sbFRvKDAsIGNhbGN1bGF0ZUNvb3JkKG5ld0ZpcnN0LCB0aGlzLl9pdGVtU2l6ZSwgY29udGVudFBvcy50b3ApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNSYW5nZUNoYW5nZWQgPSB0aGlzLmZpcnN0ICE9PSBuZXdGaXJzdDtcbiAgICAgICAgdGhpcy5maXJzdCA9IG5ld0ZpcnN0O1xuICAgIH1cblxuICAgIHNjcm9sbEluVmlldyhpbmRleDogbnVtYmVyLCB0bzogU2Nyb2xsZXJUb1R5cGUsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgICAgICBpZiAodG8pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZmlyc3QsIHZpZXdwb3J0IH0gPSB0aGlzLmdldFJlbmRlcmVkUmFuZ2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFRvID0gKGxlZnQgPSAwLCB0b3AgPSAwKSA9PiB0aGlzLnNjcm9sbFRvKHsgbGVmdCwgdG9wLCBiZWhhdmlvciB9KTtcbiAgICAgICAgICAgIGNvbnN0IGlzVG9TdGFydCA9IHRvID09PSAndG8tc3RhcnQnO1xuICAgICAgICAgICAgY29uc3QgaXNUb0VuZCA9IHRvID09PSAndG8tZW5kJztcblxuICAgICAgICAgICAgaWYgKGlzVG9TdGFydCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0LmZpcnN0LnJvd3MgLSBmaXJzdC5yb3dzID4gaW5kZXhbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvKHZpZXdwb3J0LmZpcnN0LmNvbHMgKiB0aGlzLl9pdGVtU2l6ZVsxXSwgKHZpZXdwb3J0LmZpcnN0LnJvd3MgLSAxKSAqIHRoaXMuX2l0ZW1TaXplWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2aWV3cG9ydC5maXJzdC5jb2xzIC0gZmlyc3QuY29scyA+IGluZGV4WzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUbygodmlld3BvcnQuZmlyc3QuY29scyAtIDEpICogdGhpcy5faXRlbVNpemVbMV0sIHZpZXdwb3J0LmZpcnN0LnJvd3MgKiB0aGlzLl9pdGVtU2l6ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlld3BvcnQuZmlyc3QgLSBmaXJzdCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSAodmlld3BvcnQuZmlyc3QgLSAxKSAqIHRoaXMuX2l0ZW1TaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID8gc2Nyb2xsVG8ocG9zLCAwKSA6IHNjcm9sbFRvKDAsIHBvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzVG9FbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydC5sYXN0LnJvd3MgLSBmaXJzdC5yb3dzIDw9IGluZGV4WzBdICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG8odmlld3BvcnQuZmlyc3QuY29scyAqIHRoaXMuX2l0ZW1TaXplWzFdLCAodmlld3BvcnQuZmlyc3Qucm93cyArIDEpICogdGhpcy5faXRlbVNpemVbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZpZXdwb3J0Lmxhc3QuY29scyAtIGZpcnN0LmNvbHMgPD0gaW5kZXhbMV0gKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUbygodmlld3BvcnQuZmlyc3QuY29scyArIDEpICogdGhpcy5faXRlbVNpemVbMV0sIHZpZXdwb3J0LmZpcnN0LnJvd3MgKiB0aGlzLl9pdGVtU2l6ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlld3BvcnQubGFzdCAtIGZpcnN0IDw9IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zID0gKHZpZXdwb3J0LmZpcnN0ICsgMSkgKiB0aGlzLl9pdGVtU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA/IHNjcm9sbFRvKHBvcywgMCkgOiBzY3JvbGxUbygwLCBwb3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0luZGV4KGluZGV4LCBiZWhhdmlvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRSZW5kZXJlZFJhbmdlKCkge1xuICAgICAgICBjb25zdCBjYWxjdWxhdGVGaXJzdEluVmlld3BvcnQgPSAoX3BvcywgX3NpemUpID0+IE1hdGguZmxvb3IoX3BvcyAvIChfc2l6ZSB8fCBfcG9zKSk7XG5cbiAgICAgICAgbGV0IGZpcnN0SW5WaWV3cG9ydCA9IHRoaXMuZmlyc3Q7XG4gICAgICAgIGxldCBsYXN0SW5WaWV3cG9ydDogYW55ID0gMDtcblxuICAgICAgICBpZiAodGhpcy5lbGVtZW50Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCB7IHNjcm9sbFRvcCwgc2Nyb2xsTGVmdCB9ID0gdGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgICAgICBmaXJzdEluVmlld3BvcnQgPSB7IHJvd3M6IGNhbGN1bGF0ZUZpcnN0SW5WaWV3cG9ydChzY3JvbGxUb3AsIHRoaXMuX2l0ZW1TaXplWzBdKSwgY29sczogY2FsY3VsYXRlRmlyc3RJblZpZXdwb3J0KHNjcm9sbExlZnQsIHRoaXMuX2l0ZW1TaXplWzFdKSB9O1xuICAgICAgICAgICAgICAgIGxhc3RJblZpZXdwb3J0ID0geyByb3dzOiBmaXJzdEluVmlld3BvcnQucm93cyArIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIGNvbHM6IGZpcnN0SW5WaWV3cG9ydC5jb2xzICsgdGhpcy5udW1JdGVtc0luVmlld3BvcnQuY29scyB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGxQb3MgPSB0aGlzLmhvcml6b250YWwgPyBzY3JvbGxMZWZ0IDogc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIGZpcnN0SW5WaWV3cG9ydCA9IGNhbGN1bGF0ZUZpcnN0SW5WaWV3cG9ydChzY3JvbGxQb3MsIHRoaXMuX2l0ZW1TaXplKTtcbiAgICAgICAgICAgICAgICBsYXN0SW5WaWV3cG9ydCA9IGZpcnN0SW5WaWV3cG9ydCArIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpcnN0OiB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgbGFzdDogdGhpcy5sYXN0LFxuICAgICAgICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgICAgICAgICBmaXJzdDogZmlyc3RJblZpZXdwb3J0LFxuICAgICAgICAgICAgICAgIGxhc3Q6IGxhc3RJblZpZXdwb3J0XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlTnVtSXRlbXMoKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRQb3MgPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICBjb25zdCBjb250ZW50V2lkdGggPSB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQgPyB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCAtIGNvbnRlbnRQb3MubGVmdCA6IDA7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQgPyB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgLSBjb250ZW50UG9zLnRvcCA6IDA7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZU51bUl0ZW1zSW5WaWV3cG9ydCA9IChfY29udGVudFNpemUsIF9pdGVtU2l6ZSkgPT4gTWF0aC5jZWlsKF9jb250ZW50U2l6ZSAvIChfaXRlbVNpemUgfHwgX2NvbnRlbnRTaXplKSk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZU51bVRvbGVyYXRlZEl0ZW1zID0gKF9udW1JdGVtcykgPT4gTWF0aC5jZWlsKF9udW1JdGVtcyAvIDIpO1xuICAgICAgICBjb25zdCBudW1JdGVtc0luVmlld3BvcnQ6IGFueSA9IHRoaXMuYm90aFxuICAgICAgICAgICAgPyB7IHJvd3M6IGNhbGN1bGF0ZU51bUl0ZW1zSW5WaWV3cG9ydChjb250ZW50SGVpZ2h0LCB0aGlzLl9pdGVtU2l6ZVswXSksIGNvbHM6IGNhbGN1bGF0ZU51bUl0ZW1zSW5WaWV3cG9ydChjb250ZW50V2lkdGgsIHRoaXMuX2l0ZW1TaXplWzFdKSB9XG4gICAgICAgICAgICA6IGNhbGN1bGF0ZU51bUl0ZW1zSW5WaWV3cG9ydCh0aGlzLmhvcml6b250YWwgPyBjb250ZW50V2lkdGggOiBjb250ZW50SGVpZ2h0LCB0aGlzLl9pdGVtU2l6ZSk7XG5cbiAgICAgICAgY29uc3QgbnVtVG9sZXJhdGVkSXRlbXMgPSB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgfHwgKHRoaXMuYm90aCA/IFtjYWxjdWxhdGVOdW1Ub2xlcmF0ZWRJdGVtcyhudW1JdGVtc0luVmlld3BvcnQucm93cyksIGNhbGN1bGF0ZU51bVRvbGVyYXRlZEl0ZW1zKG51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzKV0gOiBjYWxjdWxhdGVOdW1Ub2xlcmF0ZWRJdGVtcyhudW1JdGVtc0luVmlld3BvcnQpKTtcblxuICAgICAgICByZXR1cm4geyBudW1JdGVtc0luVmlld3BvcnQsIG51bVRvbGVyYXRlZEl0ZW1zIH07XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlT3B0aW9ucygpIHtcbiAgICAgICAgY29uc3QgeyBudW1JdGVtc0luVmlld3BvcnQsIG51bVRvbGVyYXRlZEl0ZW1zIH0gPSB0aGlzLmNhbGN1bGF0ZU51bUl0ZW1zKCk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUxhc3QgPSAoX2ZpcnN0LCBfbnVtLCBfbnVtVCwgX2lzQ29scyA9IGZhbHNlKSA9PiB0aGlzLmdldExhc3QoX2ZpcnN0ICsgX251bSArIChfZmlyc3QgPCBfbnVtVCA/IDIgOiAzKSAqIF9udW1ULCBfaXNDb2xzKTtcbiAgICAgICAgY29uc3QgZmlyc3QgPSB0aGlzLmZpcnN0O1xuICAgICAgICBjb25zdCBsYXN0ID0gdGhpcy5ib3RoXG4gICAgICAgICAgICA/IHsgcm93czogY2FsY3VsYXRlTGFzdCh0aGlzLmZpcnN0LnJvd3MsIG51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzLCBudW1Ub2xlcmF0ZWRJdGVtc1swXSksIGNvbHM6IGNhbGN1bGF0ZUxhc3QodGhpcy5maXJzdC5jb2xzLCBudW1JdGVtc0luVmlld3BvcnQuY29scywgbnVtVG9sZXJhdGVkSXRlbXNbMV0sIHRydWUpIH1cbiAgICAgICAgICAgIDogY2FsY3VsYXRlTGFzdCh0aGlzLmZpcnN0LCBudW1JdGVtc0luVmlld3BvcnQsIG51bVRvbGVyYXRlZEl0ZW1zKTtcblxuICAgICAgICB0aGlzLmxhc3QgPSBsYXN0O1xuICAgICAgICB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydCA9IG51bUl0ZW1zSW5WaWV3cG9ydDtcbiAgICAgICAgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zID0gbnVtVG9sZXJhdGVkSXRlbXM7XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd0xvYWRlcikge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJBcnIgPSB0aGlzLmJvdGggPyBBcnJheS5mcm9tKHsgbGVuZ3RoOiBudW1JdGVtc0luVmlld3BvcnQucm93cyB9KS5tYXAoKCkgPT4gQXJyYXkuZnJvbSh7IGxlbmd0aDogbnVtSXRlbXNJblZpZXdwb3J0LmNvbHMgfSkpIDogQXJyYXkuZnJvbSh7IGxlbmd0aDogbnVtSXRlbXNJblZpZXdwb3J0IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhenkpIHtcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGF6eUxvYWRTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IHRoaXMuX3N0ZXAgPyAodGhpcy5ib3RoID8geyByb3dzOiAwLCBjb2xzOiBmaXJzdC5jb2xzIH0gOiAwKSA6IGZpcnN0LFxuICAgICAgICAgICAgICAgICAgICBsYXN0OiBNYXRoLm1pbih0aGlzLl9zdGVwID8gdGhpcy5fc3RlcCA6IHRoaXMubGFzdCwgdGhpcy5pdGVtcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkxhenlMb2FkJywgdGhpcy5sYXp5TG9hZFN0YXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlQXV0b1NpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvU2l6ZSAmJiAhdGhpcy5kX2xvYWRpbmcpIHtcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRFbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLmNvbnRlbnRFbC5zdHlsZS5taW5XaWR0aCA9ICdhdXRvJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RWwuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5jb250YWluID0gJ25vbmUnO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHRdID0gW0RvbUhhbmRsZXIuZ2V0V2lkdGgodGhpcy5jb250ZW50RWwpLCBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmNvbnRlbnRFbCldO1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50V2lkdGggIT09IHRoaXMuZGVmYXVsdENvbnRlbnRXaWR0aCAmJiAodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQgIT09IHRoaXMuZGVmYXVsdENvbnRlbnRIZWlnaHQgJiYgKHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9ICcnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBbd2lkdGgsIGhlaWdodF0gPSBbRG9tSGFuZGxlci5nZXRXaWR0aCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCksIERvbUhhbmRsZXIuZ2V0SGVpZ2h0KHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KV07XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvdGggfHwgdGhpcy5ob3Jpem9udGFsKSAmJiAodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCA8IHRoaXMuZGVmYXVsdFdpZHRoID8gd2lkdGggKyAncHgnIDogdGhpcy5fc2Nyb2xsV2lkdGggfHwgdGhpcy5kZWZhdWx0V2lkdGggKyAncHgnKTtcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYm90aCB8fCB0aGlzLnZlcnRpY2FsKSAmJiAodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0IDwgdGhpcy5kZWZhdWx0SGVpZ2h0ID8gaGVpZ2h0ICsgJ3B4JyA6IHRoaXMuX3Njcm9sbEhlaWdodCB8fCB0aGlzLmRlZmF1bHRIZWlnaHQgKyAncHgnKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLmNvbnRlbnRFbC5zdHlsZS5taW5XaWR0aCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5jb250YWluID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYXN0KGxhc3QgPSAwLCBpc0NvbHMgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRlbXMgPyBNYXRoLm1pbihpc0NvbHMgPyAodGhpcy5fY29sdW1ucyB8fCB0aGlzLl9pdGVtc1swXSkubGVuZ3RoIDogdGhpcy5faXRlbXMubGVuZ3RoLCBsYXN0KSA6IDA7XG4gICAgfVxuXG4gICAgZ2V0Q29udGVudFBvc2l0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5jb250ZW50RWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRlbnRFbCk7XG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBNYXRoLm1heChwYXJzZUZsb2F0KHN0eWxlLmxlZnQpIHx8IDAsIDApO1xuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCkgKyBNYXRoLm1heChwYXJzZUZsb2F0KHN0eWxlLnJpZ2h0KSB8fCAwLCAwKTtcbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBNYXRoLm1heChwYXJzZUZsb2F0KHN0eWxlLnRvcCkgfHwgMCwgMCk7XG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pICsgTWF0aC5tYXgocGFyc2VGbG9hdChzdHlsZS5ib3R0b20pIHx8IDAsIDApO1xuXG4gICAgICAgICAgICByZXR1cm4geyBsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIHg6IGxlZnQgKyByaWdodCwgeTogdG9wICsgYm90dG9tIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBsZWZ0OiAwLCByaWdodDogMCwgdG9wOiAwLCBib3R0b206IDAsIHg6IDAsIHk6IDAgfTtcbiAgICB9XG5cbiAgICBzZXRTaXplKCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9zY3JvbGxXaWR0aCB8fCBgJHt0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fCBwYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRofXB4YDtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX3Njcm9sbEhlaWdodCB8fCBgJHt0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgcGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHR9cHhgO1xuICAgICAgICAgICAgY29uc3Qgc2V0UHJvcCA9IChfbmFtZSwgX3ZhbHVlKSA9PiAodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGVbX25hbWVdID0gX3ZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYm90aCB8fCB0aGlzLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICBzZXRQcm9wKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIHNldFByb3AoJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRQcm9wKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0U3BhY2VyU2l6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2l0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHNldFByb3AgPSAoX25hbWUsIF92YWx1ZSwgX3NpemUsIF9jcG9zID0gMCkgPT4gKHRoaXMuc3BhY2VyU3R5bGUgPSB7IC4uLnRoaXMuc3BhY2VyU3R5bGUsIC4uLnsgW2Ake19uYW1lfWBdOiAoX3ZhbHVlIHx8IFtdKS5sZW5ndGggKiBfc2l6ZSArIF9jcG9zICsgJ3B4JyB9IH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICAgICAgc2V0UHJvcCgnaGVpZ2h0JywgdGhpcy5faXRlbXMsIHRoaXMuX2l0ZW1TaXplWzBdLCBjb250ZW50UG9zLnkpO1xuICAgICAgICAgICAgICAgIHNldFByb3AoJ3dpZHRoJywgdGhpcy5fY29sdW1ucyB8fCB0aGlzLl9pdGVtc1sxXSwgdGhpcy5faXRlbVNpemVbMV0sIGNvbnRlbnRQb3MueCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA/IHNldFByb3AoJ3dpZHRoJywgdGhpcy5fY29sdW1ucyB8fCB0aGlzLl9pdGVtcywgdGhpcy5faXRlbVNpemUsIGNvbnRlbnRQb3MueCkgOiBzZXRQcm9wKCdoZWlnaHQnLCB0aGlzLl9pdGVtcywgdGhpcy5faXRlbVNpemUsIGNvbnRlbnRQb3MueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDb250ZW50UG9zaXRpb24ocG9zKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRFbCAmJiAhdGhpcy5fYXBwZW5kT25seSkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBwb3MgPyBwb3MuZmlyc3QgOiB0aGlzLmZpcnN0O1xuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlVHJhbnNsYXRlVmFsID0gKF9maXJzdCwgX3NpemUpID0+IF9maXJzdCAqIF9zaXplO1xuICAgICAgICAgICAgY29uc3Qgc2V0VHJhbnNmb3JtID0gKF94ID0gMCwgX3kgPSAwKSA9PiAodGhpcy5jb250ZW50U3R5bGUgPSB7IC4uLnRoaXMuY29udGVudFN0eWxlLCAuLi57IHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCR7X3h9cHgsICR7X3l9cHgsIDApYCB9IH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICAgICAgc2V0VHJhbnNmb3JtKGNhbGN1bGF0ZVRyYW5zbGF0ZVZhbChmaXJzdC5jb2xzLCB0aGlzLl9pdGVtU2l6ZVsxXSksIGNhbGN1bGF0ZVRyYW5zbGF0ZVZhbChmaXJzdC5yb3dzLCB0aGlzLl9pdGVtU2l6ZVswXSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGVWYWwgPSBjYWxjdWxhdGVUcmFuc2xhdGVWYWwoZmlyc3QsIHRoaXMuX2l0ZW1TaXplKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPyBzZXRUcmFuc2Zvcm0odHJhbnNsYXRlVmFsLCAwKSA6IHNldFRyYW5zZm9ybSgwLCB0cmFuc2xhdGVWYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TY3JvbGxQb3NpdGlvbkNoYW5nZShldmVudCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRQb3MgPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICBjb25zdCBjYWxjdWxhdGVTY3JvbGxQb3MgPSAoX3BvcywgX2Nwb3MpID0+IChfcG9zID8gKF9wb3MgPiBfY3BvcyA/IF9wb3MgLSBfY3BvcyA6IF9wb3MpIDogMCk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUN1cnJlbnRJbmRleCA9IChfcG9zLCBfc2l6ZSkgPT4gTWF0aC5mbG9vcihfcG9zIC8gKF9zaXplIHx8IF9wb3MpKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlVHJpZ2dlckluZGV4ID0gKF9jdXJyZW50SW5kZXgsIF9maXJzdCwgX2xhc3QsIF9udW0sIF9udW1ULCBfaXNTY3JvbGxEb3duT3JSaWdodCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF9jdXJyZW50SW5kZXggPD0gX251bVQgPyBfbnVtVCA6IF9pc1Njcm9sbERvd25PclJpZ2h0ID8gX2xhc3QgLSBfbnVtIC0gX251bVQgOiBfZmlyc3QgKyBfbnVtVCAtIDE7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUZpcnN0ID0gKF9jdXJyZW50SW5kZXgsIF90cmlnZ2VySW5kZXgsIF9maXJzdCwgX2xhc3QsIF9udW0sIF9udW1ULCBfaXNTY3JvbGxEb3duT3JSaWdodCkgPT4ge1xuICAgICAgICAgICAgaWYgKF9jdXJyZW50SW5kZXggPD0gX251bVQpIHJldHVybiAwO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gTWF0aC5tYXgoMCwgX2lzU2Nyb2xsRG93bk9yUmlnaHQgPyAoX2N1cnJlbnRJbmRleCA8IF90cmlnZ2VySW5kZXggPyBfZmlyc3QgOiBfY3VycmVudEluZGV4IC0gX251bVQpIDogX2N1cnJlbnRJbmRleCA+IF90cmlnZ2VySW5kZXggPyBfZmlyc3QgOiBfY3VycmVudEluZGV4IC0gMiAqIF9udW1UKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlTGFzdCA9IChfY3VycmVudEluZGV4LCBfZmlyc3QsIF9sYXN0LCBfbnVtLCBfbnVtVCwgX2lzQ29scyA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0gX2ZpcnN0ICsgX251bSArIDIgKiBfbnVtVDtcblxuICAgICAgICAgICAgaWYgKF9jdXJyZW50SW5kZXggPj0gX251bVQpIHtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgKz0gX251bVQgKyAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMYXN0KGxhc3RWYWx1ZSwgX2lzQ29scyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gY2FsY3VsYXRlU2Nyb2xsUG9zKHRhcmdldC5zY3JvbGxUb3AsIGNvbnRlbnRQb3MudG9wKTtcbiAgICAgICAgY29uc3Qgc2Nyb2xsTGVmdCA9IGNhbGN1bGF0ZVNjcm9sbFBvcyh0YXJnZXQuc2Nyb2xsTGVmdCwgY29udGVudFBvcy5sZWZ0KTtcblxuICAgICAgICBsZXQgbmV3Rmlyc3QgPSB0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IDAgfSA6IDA7XG4gICAgICAgIGxldCBuZXdMYXN0ID0gdGhpcy5sYXN0O1xuICAgICAgICBsZXQgaXNSYW5nZUNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IG5ld1Njcm9sbFBvcyA9IHRoaXMubGFzdFNjcm9sbFBvcztcblxuICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpc1Njcm9sbERvd24gPSB0aGlzLmxhc3RTY3JvbGxQb3MudG9wIDw9IHNjcm9sbFRvcDtcbiAgICAgICAgICAgIGNvbnN0IGlzU2Nyb2xsUmlnaHQgPSB0aGlzLmxhc3RTY3JvbGxQb3MubGVmdCA8PSBzY3JvbGxMZWZ0O1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2FwcGVuZE9ubHkgfHwgKHRoaXMuX2FwcGVuZE9ubHkgJiYgKGlzU2Nyb2xsRG93biB8fCBpc1Njcm9sbFJpZ2h0KSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSB7IHJvd3M6IGNhbGN1bGF0ZUN1cnJlbnRJbmRleChzY3JvbGxUb3AsIHRoaXMuX2l0ZW1TaXplWzBdKSwgY29sczogY2FsY3VsYXRlQ3VycmVudEluZGV4KHNjcm9sbExlZnQsIHRoaXMuX2l0ZW1TaXplWzFdKSB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaWdnZXJJbmRleCA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm93czogY2FsY3VsYXRlVHJpZ2dlckluZGV4KGN1cnJlbnRJbmRleC5yb3dzLCB0aGlzLmZpcnN0LnJvd3MsIHRoaXMubGFzdC5yb3dzLCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzLCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXNbMF0sIGlzU2Nyb2xsRG93biksXG4gICAgICAgICAgICAgICAgICAgIGNvbHM6IGNhbGN1bGF0ZVRyaWdnZXJJbmRleChjdXJyZW50SW5kZXguY29scywgdGhpcy5maXJzdC5jb2xzLCB0aGlzLmxhc3QuY29scywgdGhpcy5udW1JdGVtc0luVmlld3BvcnQuY29scywgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zWzFdLCBpc1Njcm9sbFJpZ2h0KVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBuZXdGaXJzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm93czogY2FsY3VsYXRlRmlyc3QoY3VycmVudEluZGV4LnJvd3MsIHRyaWdnZXJJbmRleC5yb3dzLCB0aGlzLmZpcnN0LnJvd3MsIHRoaXMubGFzdC5yb3dzLCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzLCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXNbMF0sIGlzU2Nyb2xsRG93biksXG4gICAgICAgICAgICAgICAgICAgIGNvbHM6IGNhbGN1bGF0ZUZpcnN0KGN1cnJlbnRJbmRleC5jb2xzLCB0cmlnZ2VySW5kZXguY29scywgdGhpcy5maXJzdC5jb2xzLCB0aGlzLmxhc3QuY29scywgdGhpcy5udW1JdGVtc0luVmlld3BvcnQuY29scywgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zWzFdLCBpc1Njcm9sbFJpZ2h0KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbmV3TGFzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm93czogY2FsY3VsYXRlTGFzdChjdXJyZW50SW5kZXgucm93cywgbmV3Rmlyc3Qucm93cywgdGhpcy5sYXN0LnJvd3MsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1swXSksXG4gICAgICAgICAgICAgICAgICAgIGNvbHM6IGNhbGN1bGF0ZUxhc3QoY3VycmVudEluZGV4LmNvbHMsIG5ld0ZpcnN0LmNvbHMsIHRoaXMubGFzdC5jb2xzLCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzLCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXNbMV0sIHRydWUpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlzUmFuZ2VDaGFuZ2VkID0gbmV3Rmlyc3Qucm93cyAhPT0gdGhpcy5maXJzdC5yb3dzIHx8IG5ld0xhc3Qucm93cyAhPT0gdGhpcy5sYXN0LnJvd3MgfHwgbmV3Rmlyc3QuY29scyAhPT0gdGhpcy5maXJzdC5jb2xzIHx8IG5ld0xhc3QuY29scyAhPT0gdGhpcy5sYXN0LmNvbHMgfHwgdGhpcy5pc1JhbmdlQ2hhbmdlZDtcbiAgICAgICAgICAgICAgICBuZXdTY3JvbGxQb3MgPSB7IHRvcDogc2Nyb2xsVG9wLCBsZWZ0OiBzY3JvbGxMZWZ0IH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxQb3MgPSB0aGlzLmhvcml6b250YWwgPyBzY3JvbGxMZWZ0IDogc2Nyb2xsVG9wO1xuICAgICAgICAgICAgY29uc3QgaXNTY3JvbGxEb3duT3JSaWdodCA9IHRoaXMubGFzdFNjcm9sbFBvcyA8PSBzY3JvbGxQb3M7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fYXBwZW5kT25seSB8fCAodGhpcy5fYXBwZW5kT25seSAmJiBpc1Njcm9sbERvd25PclJpZ2h0KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGNhbGN1bGF0ZUN1cnJlbnRJbmRleChzY3JvbGxQb3MsIHRoaXMuX2l0ZW1TaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmlnZ2VySW5kZXggPSBjYWxjdWxhdGVUcmlnZ2VySW5kZXgoY3VycmVudEluZGV4LCB0aGlzLmZpcnN0LCB0aGlzLmxhc3QsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMsIGlzU2Nyb2xsRG93bk9yUmlnaHQpO1xuXG4gICAgICAgICAgICAgICAgbmV3Rmlyc3QgPSBjYWxjdWxhdGVGaXJzdChjdXJyZW50SW5kZXgsIHRyaWdnZXJJbmRleCwgdGhpcy5maXJzdCwgdGhpcy5sYXN0LCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydCwgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zLCBpc1Njcm9sbERvd25PclJpZ2h0KTtcbiAgICAgICAgICAgICAgICBuZXdMYXN0ID0gY2FsY3VsYXRlTGFzdChjdXJyZW50SW5kZXgsIG5ld0ZpcnN0LCB0aGlzLmxhc3QsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMpO1xuICAgICAgICAgICAgICAgIGlzUmFuZ2VDaGFuZ2VkID0gbmV3Rmlyc3QgIT09IHRoaXMuZmlyc3QgfHwgbmV3TGFzdCAhPT0gdGhpcy5sYXN0IHx8IHRoaXMuaXNSYW5nZUNoYW5nZWQ7XG4gICAgICAgICAgICAgICAgbmV3U2Nyb2xsUG9zID0gc2Nyb2xsUG9zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpcnN0OiBuZXdGaXJzdCxcbiAgICAgICAgICAgIGxhc3Q6IG5ld0xhc3QsXG4gICAgICAgICAgICBpc1JhbmdlQ2hhbmdlZCxcbiAgICAgICAgICAgIHNjcm9sbFBvczogbmV3U2Nyb2xsUG9zXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25TY3JvbGxDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgeyBmaXJzdCwgbGFzdCwgaXNSYW5nZUNoYW5nZWQsIHNjcm9sbFBvcyB9ID0gdGhpcy5vblNjcm9sbFBvc2l0aW9uQ2hhbmdlKGV2ZW50KTtcblxuICAgICAgICBpZiAoaXNSYW5nZUNoYW5nZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1N0YXRlID0geyBmaXJzdCwgbGFzdCB9O1xuXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnRQb3NpdGlvbihuZXdTdGF0ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZmlyc3QgPSBmaXJzdDtcbiAgICAgICAgICAgIHRoaXMubGFzdCA9IGxhc3Q7XG4gICAgICAgICAgICB0aGlzLmxhc3RTY3JvbGxQb3MgPSBzY3JvbGxQb3M7XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvblNjcm9sbEluZGV4Q2hhbmdlJywgbmV3U3RhdGUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbGF6eSAmJiB0aGlzLmlzUGFnZUNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXp5TG9hZFN0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdDogdGhpcy5fc3RlcCA/IE1hdGgubWluKHRoaXMuZ2V0UGFnZUJ5Rmlyc3QoKSAqIHRoaXMuX3N0ZXAsIHRoaXMuaXRlbXMubGVuZ3RoIC0gdGhpcy5fc3RlcCkgOiBmaXJzdCxcbiAgICAgICAgICAgICAgICAgICAgbGFzdDogTWF0aC5taW4odGhpcy5fc3RlcCA/ICh0aGlzLmdldFBhZ2VCeUZpcnN0KCkgKyAxKSAqIHRoaXMuX3N0ZXAgOiBsYXN0LCB0aGlzLml0ZW1zLmxlbmd0aClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzTGF6eVN0YXRlQ2hhbmdlZCA9IHRoaXMubGF6eUxvYWRTdGF0ZS5maXJzdCAhPT0gbGF6eUxvYWRTdGF0ZS5maXJzdCB8fCB0aGlzLmxhenlMb2FkU3RhdGUubGFzdCAhPT0gbGF6eUxvYWRTdGF0ZS5sYXN0O1xuXG4gICAgICAgICAgICAgICAgaXNMYXp5U3RhdGVDaGFuZ2VkICYmIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkxhenlMb2FkJywgbGF6eUxvYWRTdGF0ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXp5TG9hZFN0YXRlID0gbGF6eUxvYWRTdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ29udGFpbmVyU2Nyb2xsKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvblNjcm9sbCcsIHsgb3JpZ2luYWxFdmVudDogZXZlbnQgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2RlbGF5ICYmIHRoaXMuaXNQYWdlQ2hhbmdlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsVGltZW91dCkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZF9sb2FkaW5nICYmIHRoaXMuc2hvd0xvYWRlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaXNSYW5nZUNoYW5nZWQgfSA9IHRoaXMub25TY3JvbGxQb3NpdGlvbkNoYW5nZShldmVudCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhbmdlZCA9IGlzUmFuZ2VDaGFuZ2VkIHx8ICh0aGlzLl9zdGVwID8gdGhpcy5pc1BhZ2VDaGFuZ2VkIDogZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kX2xvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblNjcm9sbENoYW5nZShldmVudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kX2xvYWRpbmcgJiYgdGhpcy5zaG93TG9hZGVyICYmICghdGhpcy5fbGF6eSB8fCB0aGlzLl9sb2FkaW5nID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZF9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZSA9IHRoaXMuZ2V0UGFnZUJ5Rmlyc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcy5fZGVsYXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgIXRoaXMuZF9sb2FkaW5nICYmIHRoaXMub25TY3JvbGxDaGFuZ2UoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldyBhcyBXaW5kb3c7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCkgPyAnb3JpZW50YXRpb25jaGFuZ2UnIDogJ3Jlc2l6ZSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih3aW5kb3csIGV2ZW50LCB0aGlzLm9uV2luZG93UmVzaXplLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kUmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uV2luZG93UmVzaXplKCkge1xuICAgICAgICBpZiAodGhpcy5yZXNpemVUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZXNpemVUaW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzaXplVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKERvbUhhbmRsZXIuaXNWaXNpYmxlKHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbd2lkdGgsIGhlaWdodF0gPSBbRG9tSGFuZGxlci5nZXRXaWR0aCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCksIERvbUhhbmRsZXIuZ2V0SGVpZ2h0KHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KV07XG4gICAgICAgICAgICAgICAgY29uc3QgW2lzRGlmZldpZHRoLCBpc0RpZmZIZWlnaHRdID0gW3dpZHRoICE9PSB0aGlzLmRlZmF1bHRXaWR0aCwgaGVpZ2h0ICE9PSB0aGlzLmRlZmF1bHRIZWlnaHRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlaW5pdCA9IHRoaXMuYm90aCA/IGlzRGlmZldpZHRoIHx8IGlzRGlmZkhlaWdodCA6IHRoaXMuaG9yaXpvbnRhbCA/IGlzRGlmZldpZHRoIDogdGhpcy52ZXJ0aWNhbCA/IGlzRGlmZkhlaWdodCA6IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgcmVpbml0ICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zID0gdGhpcy5fbnVtVG9sZXJhdGVkSXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRXaWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0SGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0Q29udGVudFdpZHRoID0gRG9tSGFuZGxlci5nZXRXaWR0aCh0aGlzLmNvbnRlbnRFbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRDb250ZW50SGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRIZWlnaHQodGhpcy5jb250ZW50RWwpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuX3Jlc2l6ZURlbGF5KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFdmVudHMobmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zW25hbWVdID8gdGhpcy5vcHRpb25zW25hbWVdKHBhcmFtcykgOiB0aGlzW25hbWVdLmVtaXQocGFyYW1zKTtcbiAgICB9XG5cbiAgICBnZXRDb250ZW50T3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRlbnRTdHlsZUNsYXNzOiBgcC1zY3JvbGxlci1jb250ZW50ICR7dGhpcy5kX2xvYWRpbmcgPyAncC1zY3JvbGxlci1sb2FkaW5nJyA6ICcnfWAsXG4gICAgICAgICAgICBpdGVtczogdGhpcy5sb2FkZWRJdGVtcyxcbiAgICAgICAgICAgIGdldEl0ZW1PcHRpb25zOiAoaW5kZXgpID0+IHRoaXMuZ2V0T3B0aW9ucyhpbmRleCksXG4gICAgICAgICAgICBsb2FkaW5nOiB0aGlzLmRfbG9hZGluZyxcbiAgICAgICAgICAgIGdldExvYWRlck9wdGlvbnM6IChpbmRleCwgb3B0aW9ucz8pID0+IHRoaXMuZ2V0TG9hZGVyT3B0aW9ucyhpbmRleCwgb3B0aW9ucyksXG4gICAgICAgICAgICBpdGVtU2l6ZTogdGhpcy5faXRlbVNpemUsXG4gICAgICAgICAgICByb3dzOiB0aGlzLmxvYWRlZFJvd3MsXG4gICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmxvYWRlZENvbHVtbnMsXG4gICAgICAgICAgICBzcGFjZXJTdHlsZTogdGhpcy5zcGFjZXJTdHlsZSxcbiAgICAgICAgICAgIGNvbnRlbnRTdHlsZTogdGhpcy5jb250ZW50U3R5bGUsXG4gICAgICAgICAgICB2ZXJ0aWNhbDogdGhpcy52ZXJ0aWNhbCxcbiAgICAgICAgICAgIGhvcml6b250YWw6IHRoaXMuaG9yaXpvbnRhbCxcbiAgICAgICAgICAgIGJvdGg6IHRoaXMuYm90aFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldE9wdGlvbnMocmVuZGVyZWRJbmRleCkge1xuICAgICAgICBjb25zdCBjb3VudCA9ICh0aGlzLl9pdGVtcyB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYm90aCA/IHRoaXMuZmlyc3Qucm93cyArIHJlbmRlcmVkSW5kZXggOiB0aGlzLmZpcnN0ICsgcmVuZGVyZWRJbmRleDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgIGZpcnN0OiBpbmRleCA9PT0gMCxcbiAgICAgICAgICAgIGxhc3Q6IGluZGV4ID09PSBjb3VudCAtIDEsXG4gICAgICAgICAgICBldmVuOiBpbmRleCAlIDIgPT09IDAsXG4gICAgICAgICAgICBvZGQ6IGluZGV4ICUgMiAhPT0gMFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldExvYWRlck9wdGlvbnMoaW5kZXgsIGV4dE9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLmxvYWRlckFyci5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICBmaXJzdDogaW5kZXggPT09IDAsXG4gICAgICAgICAgICBsYXN0OiBpbmRleCA9PT0gY291bnQgLSAxLFxuICAgICAgICAgICAgZXZlbjogaW5kZXggJSAyID09PSAwLFxuICAgICAgICAgICAgb2RkOiBpbmRleCAlIDIgIT09IDAsXG4gICAgICAgICAgICAuLi5leHRPcHRpb25zXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFNoYXJlZE1vZHVsZV0sXG4gICAgZXhwb3J0czogW1Njcm9sbGVyLCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1Njcm9sbGVyXVxufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxlck1vZHVsZSB7fVxuIl19