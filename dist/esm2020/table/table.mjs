import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, EventEmitter, HostListener, Inject, Injectable, Input, NgModule, Optional, Output, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterMatchMode, FilterOperator, PrimeTemplate, SharedModule, TranslationKeys } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ScrollerModule } from 'primeng/scroller';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { ObjectUtils, UniqueComponentId, ZIndexUtils } from 'primeng/utils';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/paginator";
import * as i4 from "primeng/scroller";
import * as i5 from "primeng/dropdown";
import * as i6 from "@angular/forms";
import * as i7 from "primeng/button";
import * as i8 from "primeng/inputnumber";
import * as i9 from "primeng/inputtext";
import * as i10 from "primeng/calendar";
import * as i11 from "primeng/tristatecheckbox";
export class TableService {
    constructor() {
        this.sortSource = new Subject();
        this.selectionSource = new Subject();
        this.contextMenuSource = new Subject();
        this.valueSource = new Subject();
        this.totalRecordsSource = new Subject();
        this.columnsSource = new Subject();
        this.resetSource = new Subject();
        this.sortSource$ = this.sortSource.asObservable();
        this.selectionSource$ = this.selectionSource.asObservable();
        this.contextMenuSource$ = this.contextMenuSource.asObservable();
        this.valueSource$ = this.valueSource.asObservable();
        this.totalRecordsSource$ = this.totalRecordsSource.asObservable();
        this.columnsSource$ = this.columnsSource.asObservable();
        this.resetSource$ = this.resetSource.asObservable();
    }
    onSort(sortMeta) {
        this.sortSource.next(sortMeta);
    }
    onSelectionChange() {
        this.selectionSource.next(null);
    }
    onResetChange() {
        this.resetSource.next(null);
    }
    onContextMenu(data) {
        this.contextMenuSource.next(data);
    }
    onValueChange(value) {
        this.valueSource.next(value);
    }
    onTotalRecordsChange(value) {
        this.totalRecordsSource.next(value);
    }
    onColumnsChange(columns) {
        this.columnsSource.next(columns);
    }
}
TableService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TableService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableService, decorators: [{
            type: Injectable
        }] });
export class Table {
    constructor(document, platformId, renderer, el, zone, tableService, cd, filterService, overlayService) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.el = el;
        this.zone = zone;
        this.tableService = tableService;
        this.cd = cd;
        this.filterService = filterService;
        this.overlayService = overlayService;
        this.pageLinks = 5;
        this.alwaysShowPaginator = true;
        this.paginatorPosition = 'bottom';
        this.paginatorDropdownScrollHeight = '200px';
        this.currentPageReportTemplate = '{currentPage} of {totalPages}';
        this.showFirstLastIcon = true;
        this.showPageLinks = true;
        this.defaultSortOrder = 1;
        this.sortMode = 'single';
        this.resetPageOnSort = true;
        this.selectAllChange = new EventEmitter();
        this.selectionChange = new EventEmitter();
        this.contextMenuSelectionChange = new EventEmitter();
        this.contextMenuSelectionMode = 'separate';
        this.rowTrackBy = (index, item) => item;
        this.lazy = false;
        this.lazyLoadOnInit = true;
        this.compareSelectionBy = 'deepEquals';
        this.csvSeparator = ',';
        this.exportFilename = 'download';
        this.filters = {};
        this.filterDelay = 300;
        this.expandedRowKeys = {};
        this.editingRowKeys = {};
        this.rowExpandMode = 'multiple';
        this.scrollDirection = 'vertical';
        this.virtualScrollDelay = 250;
        this.columnResizeMode = 'fit';
        this.loadingIcon = 'pi pi-spinner';
        this.showLoader = true;
        this.showInitialSortBadge = true;
        this.stateStorage = 'session';
        this.editMode = 'cell';
        this.groupRowsByOrder = 1;
        this.responsiveLayout = 'scroll';
        this.breakpoint = '960px';
        this.onRowSelect = new EventEmitter();
        this.onRowUnselect = new EventEmitter();
        this.onPage = new EventEmitter();
        this.onSort = new EventEmitter();
        this.onFilter = new EventEmitter();
        this.onLazyLoad = new EventEmitter();
        this.onRowExpand = new EventEmitter();
        this.onRowCollapse = new EventEmitter();
        this.onContextMenuSelect = new EventEmitter();
        this.onColResize = new EventEmitter();
        this.onColReorder = new EventEmitter();
        this.onRowReorder = new EventEmitter();
        this.onEditInit = new EventEmitter();
        this.onEditComplete = new EventEmitter();
        this.onEditCancel = new EventEmitter();
        this.onHeaderCheckboxToggle = new EventEmitter();
        this.sortFunction = new EventEmitter();
        this.firstChange = new EventEmitter();
        this.rowsChange = new EventEmitter();
        this.onStateSave = new EventEmitter();
        this.onStateRestore = new EventEmitter();
        /* @deprecated */
        this._virtualRowHeight = 28;
        this._value = [];
        this._totalRecords = 0;
        this._first = 0;
        this.selectionKeys = {};
        this._sortOrder = 1;
        this._selectAll = null;
        this.columnResizing = false;
        this.rowGroupHeaderStyleObject = {};
        this.id = UniqueComponentId();
        this.window = this.document.defaultView;
    }
    get responsive() {
        return this._responsive;
    }
    set responsive(val) {
        this._responsive = val;
        console.warn('responsive propery is deprecated as table is always responsive with scrollable behavior.');
    }
    get virtualRowHeight() {
        return this._virtualRowHeight;
    }
    set virtualRowHeight(val) {
        this._virtualRowHeight = val;
        console.warn('The virtualRowHeight property is deprecated, use virtualScrollItemSize property instead.');
    }
    ngOnInit() {
        if (this.lazy && this.lazyLoadOnInit) {
            if (!this.virtualScroll) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            if (this.restoringFilter) {
                this.restoringFilter = false;
            }
        }
        if (this.responsiveLayout === 'stack' && !this.scrollable) {
            this.createResponsiveStyle();
        }
        this.initialized = true;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'caption':
                    this.captionTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'headergrouped':
                    this.headerGroupedTemplate = item.template;
                    break;
                case 'body':
                    this.bodyTemplate = item.template;
                    break;
                case 'loadingbody':
                    this.loadingBodyTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                case 'footergrouped':
                    this.footerGroupedTemplate = item.template;
                    break;
                case 'summary':
                    this.summaryTemplate = item.template;
                    break;
                case 'colgroup':
                    this.colGroupTemplate = item.template;
                    break;
                case 'rowexpansion':
                    this.expandedRowTemplate = item.template;
                    break;
                case 'groupheader':
                    this.groupHeaderTemplate = item.template;
                    break;
                case 'rowspan':
                    this.rowspanTemplate = item.template;
                    break;
                case 'groupfooter':
                    this.groupFooterTemplate = item.template;
                    break;
                case 'frozenrows':
                    this.frozenRowsTemplate = item.template;
                    break;
                case 'frozenheader':
                    this.frozenHeaderTemplate = item.template;
                    break;
                case 'frozenbody':
                    this.frozenBodyTemplate = item.template;
                    break;
                case 'frozenfooter':
                    this.frozenFooterTemplate = item.template;
                    break;
                case 'frozencolgroup':
                    this.frozenColGroupTemplate = item.template;
                    break;
                case 'frozenrowexpansion':
                    this.frozenExpandedRowTemplate = item.template;
                    break;
                case 'emptymessage':
                    this.emptyMessageTemplate = item.template;
                    break;
                case 'paginatorleft':
                    this.paginatorLeftTemplate = item.template;
                    break;
                case 'paginatorright':
                    this.paginatorRightTemplate = item.template;
                    break;
                case 'paginatordropdownitem':
                    this.paginatorDropdownItemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        if (this.isStateful() && this.resizableColumns) {
            this.restoreColumnWidths();
        }
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.value) {
            if (this.isStateful() && !this.stateRestored) {
                this.restoreState();
            }
            this._value = simpleChange.value.currentValue;
            if (!this.lazy) {
                this.totalRecords = this._value ? this._value.length : 0;
                if (this.sortMode == 'single' && (this.sortField || this.groupRowsBy))
                    this.sortSingle();
                else if (this.sortMode == 'multiple' && (this.multiSortMeta || this.groupRowsBy))
                    this.sortMultiple();
                else if (this.hasFilter())
                    //sort already filters
                    this._filter();
            }
            this.tableService.onValueChange(simpleChange.value.currentValue);
        }
        if (simpleChange.columns) {
            this._columns = simpleChange.columns.currentValue;
            this.tableService.onColumnsChange(simpleChange.columns.currentValue);
            if (this._columns && this.isStateful() && this.reorderableColumns && !this.columnOrderStateRestored) {
                this.restoreColumnOrder();
            }
        }
        if (simpleChange.sortField) {
            this._sortField = simpleChange.sortField.currentValue;
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                if (this.sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }
        if (simpleChange.groupRowsBy) {
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                if (this.sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }
        if (simpleChange.sortOrder) {
            this._sortOrder = simpleChange.sortOrder.currentValue;
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                if (this.sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }
        if (simpleChange.groupRowsByOrder) {
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                if (this.sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }
        if (simpleChange.multiSortMeta) {
            this._multiSortMeta = simpleChange.multiSortMeta.currentValue;
            if (this.sortMode === 'multiple' && (this.initialized || (!this.lazy && !this.virtualScroll))) {
                this.sortMultiple();
            }
        }
        if (simpleChange.selection) {
            this._selection = simpleChange.selection.currentValue;
            if (!this.preventSelectionSetterPropagation) {
                this.updateSelectionKeys();
                this.tableService.onSelectionChange();
            }
            this.preventSelectionSetterPropagation = false;
        }
        if (simpleChange.selectAll) {
            this._selectAll = simpleChange.selectAll.currentValue;
            if (!this.preventSelectionSetterPropagation) {
                this.updateSelectionKeys();
                this.tableService.onSelectionChange();
                if (this.isStateful()) {
                    this.saveState();
                }
            }
            this.preventSelectionSetterPropagation = false;
        }
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
    }
    get columns() {
        return this._columns;
    }
    set columns(cols) {
        this._columns = cols;
    }
    get first() {
        return this._first;
    }
    set first(val) {
        this._first = val;
    }
    get rows() {
        return this._rows;
    }
    set rows(val) {
        this._rows = val;
    }
    get totalRecords() {
        return this._totalRecords;
    }
    set totalRecords(val) {
        this._totalRecords = val;
        this.tableService.onTotalRecordsChange(this._totalRecords);
    }
    get sortField() {
        return this._sortField;
    }
    set sortField(val) {
        this._sortField = val;
    }
    get sortOrder() {
        return this._sortOrder;
    }
    set sortOrder(val) {
        this._sortOrder = val;
    }
    get multiSortMeta() {
        return this._multiSortMeta;
    }
    set multiSortMeta(val) {
        this._multiSortMeta = val;
    }
    get selection() {
        return this._selection;
    }
    set selection(val) {
        this._selection = val;
    }
    get selectAll() {
        return this._selection;
    }
    set selectAll(val) {
        this._selection = val;
    }
    get processedData() {
        return this.filteredValue || this.value || [];
    }
    dataToRender(data) {
        const _data = data || this.processedData;
        if (_data && this.paginator) {
            const first = this.lazy ? 0 : this.first;
            return _data.slice(first, first + this.rows);
        }
        return _data;
    }
    updateSelectionKeys() {
        if (this.dataKey && this._selection) {
            this.selectionKeys = {};
            if (Array.isArray(this._selection)) {
                for (let data of this._selection) {
                    this.selectionKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
                }
            }
            else {
                this.selectionKeys[String(ObjectUtils.resolveFieldData(this._selection, this.dataKey))] = 1;
            }
        }
    }
    onPageChange(event) {
        this.first = event.first;
        this.rows = event.rows;
        this.onPage.emit({
            first: this.first,
            rows: this.rows
        });
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        this.firstChange.emit(this.first);
        this.rowsChange.emit(this.rows);
        this.tableService.onValueChange(this.value);
        if (this.isStateful()) {
            this.saveState();
        }
        this.anchorRowIndex = null;
        if (this.scrollable) {
            this.resetScrollTop();
        }
    }
    sort(event) {
        let originalEvent = event.originalEvent;
        if (this.sortMode === 'single') {
            this._sortOrder = this.sortField === event.field ? this.sortOrder * -1 : this.defaultSortOrder;
            this._sortField = event.field;
            if (this.resetPageOnSort) {
                this._first = 0;
                this.firstChange.emit(this._first);
                if (this.scrollable) {
                    this.resetScrollTop();
                }
            }
            this.sortSingle();
        }
        if (this.sortMode === 'multiple') {
            let metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
            let sortMeta = this.getSortMeta(event.field);
            if (sortMeta) {
                if (!metaKey) {
                    this._multiSortMeta = [{ field: event.field, order: sortMeta.order * -1 }];
                    if (this.resetPageOnSort) {
                        this._first = 0;
                        this.firstChange.emit(this._first);
                        if (this.scrollable) {
                            this.resetScrollTop();
                        }
                    }
                }
                else {
                    sortMeta.order = sortMeta.order * -1;
                }
            }
            else {
                if (!metaKey || !this.multiSortMeta) {
                    this._multiSortMeta = [];
                    if (this.resetPageOnSort) {
                        this._first = 0;
                        this.firstChange.emit(this._first);
                    }
                }
                this._multiSortMeta.push({ field: event.field, order: this.defaultSortOrder });
            }
            this.sortMultiple();
        }
        if (this.isStateful()) {
            this.saveState();
        }
        this.anchorRowIndex = null;
    }
    sortSingle() {
        let field = this.sortField || this.groupRowsBy;
        let order = this.sortField ? this.sortOrder : this.groupRowsByOrder;
        if (this.groupRowsBy && this.sortField && this.groupRowsBy !== this.sortField) {
            this._multiSortMeta = [this.getGroupRowsMeta(), { field: this.sortField, order: this.sortOrder }];
            this.sortMultiple();
            return;
        }
        if (field && order) {
            if (this.restoringSort) {
                this.restoringSort = false;
            }
            if (this.lazy) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            else if (this.value) {
                if (this.customSort) {
                    this.sortFunction.emit({
                        data: this.value,
                        mode: this.sortMode,
                        field: field,
                        order: order
                    });
                }
                else {
                    this.value.sort((data1, data2) => {
                        let value1 = ObjectUtils.resolveFieldData(data1, field);
                        let value2 = ObjectUtils.resolveFieldData(data2, field);
                        let result = null;
                        if (value1 == null && value2 != null)
                            result = -1;
                        else if (value1 != null && value2 == null)
                            result = 1;
                        else if (value1 == null && value2 == null)
                            result = 0;
                        else if (typeof value1 === 'string' && typeof value2 === 'string')
                            result = value1.localeCompare(value2);
                        else
                            result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
                        return order * result;
                    });
                    this._value = [...this.value];
                }
                if (this.hasFilter()) {
                    this._filter();
                }
            }
            let sortMeta = {
                field: field,
                order: order
            };
            this.onSort.emit(sortMeta);
            this.tableService.onSort(sortMeta);
        }
    }
    sortMultiple() {
        if (this.groupRowsBy) {
            if (!this._multiSortMeta)
                this._multiSortMeta = [this.getGroupRowsMeta()];
            else if (this.multiSortMeta[0].field !== this.groupRowsBy)
                this._multiSortMeta = [this.getGroupRowsMeta(), ...this._multiSortMeta];
        }
        if (this.multiSortMeta) {
            if (this.lazy) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            else if (this.value) {
                if (this.customSort) {
                    this.sortFunction.emit({
                        data: this.value,
                        mode: this.sortMode,
                        multiSortMeta: this.multiSortMeta
                    });
                }
                else {
                    this.value.sort((data1, data2) => {
                        return this.multisortField(data1, data2, this.multiSortMeta, 0);
                    });
                    this._value = [...this.value];
                }
                if (this.hasFilter()) {
                    this._filter();
                }
            }
            this.onSort.emit({
                multisortmeta: this.multiSortMeta
            });
            this.tableService.onSort(this.multiSortMeta);
        }
    }
    multisortField(data1, data2, multiSortMeta, index) {
        const value1 = ObjectUtils.resolveFieldData(data1, multiSortMeta[index].field);
        const value2 = ObjectUtils.resolveFieldData(data2, multiSortMeta[index].field);
        if (ObjectUtils.compare(value1, value2, this.filterLocale) === 0) {
            return multiSortMeta.length - 1 > index ? this.multisortField(data1, data2, multiSortMeta, index + 1) : 0;
        }
        return this.compareValuesOnSort(value1, value2, multiSortMeta[index].order);
    }
    compareValuesOnSort(value1, value2, order) {
        return ObjectUtils.sort(value1, value2, order, this.filterLocale, this.sortOrder);
    }
    getSortMeta(field) {
        if (this.multiSortMeta && this.multiSortMeta.length) {
            for (let i = 0; i < this.multiSortMeta.length; i++) {
                if (this.multiSortMeta[i].field === field) {
                    return this.multiSortMeta[i];
                }
            }
        }
        return null;
    }
    isSorted(field) {
        if (this.sortMode === 'single') {
            return this.sortField && this.sortField === field;
        }
        else if (this.sortMode === 'multiple') {
            let sorted = false;
            if (this.multiSortMeta) {
                for (let i = 0; i < this.multiSortMeta.length; i++) {
                    if (this.multiSortMeta[i].field == field) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }
    handleRowClick(event) {
        let target = event.originalEvent.target;
        let targetNode = target.nodeName;
        let parentNode = target.parentElement && target.parentElement.nodeName;
        if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' || parentNode == 'INPUT' || parentNode == 'BUTTON' || parentNode == 'A' || DomHandler.hasClass(event.originalEvent.target, 'p-clickable')) {
            return;
        }
        if (this.selectionMode) {
            let rowData = event.rowData;
            let rowIndex = event.rowIndex;
            this.preventSelectionSetterPropagation = true;
            if (this.isMultipleSelectionMode() && event.originalEvent.shiftKey && this.anchorRowIndex != null) {
                DomHandler.clearSelection();
                if (this.rangeRowIndex != null) {
                    this.clearSelectionRange(event.originalEvent);
                }
                this.rangeRowIndex = rowIndex;
                this.selectRange(event.originalEvent, rowIndex);
            }
            else {
                let selected = this.isSelected(rowData);
                if (!selected && !this.isRowSelectable(rowData, rowIndex)) {
                    return;
                }
                let metaSelection = this.rowTouched ? false : this.metaKeySelection;
                let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey)) : null;
                this.anchorRowIndex = rowIndex;
                this.rangeRowIndex = rowIndex;
                if (metaSelection) {
                    let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;
                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this._selection = null;
                            this.selectionKeys = {};
                            this.selectionChange.emit(null);
                        }
                        else {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this._selection = this.selection.filter((val, i) => i != selectionIndex);
                            this.selectionChange.emit(this.selection);
                            if (dataKeyValue) {
                                delete this.selectionKeys[dataKeyValue];
                            }
                        }
                        this.onRowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row' });
                    }
                    else {
                        if (this.isSingleSelectionMode()) {
                            this._selection = rowData;
                            this.selectionChange.emit(rowData);
                            if (dataKeyValue) {
                                this.selectionKeys = {};
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                        else if (this.isMultipleSelectionMode()) {
                            if (metaKey) {
                                this._selection = this.selection || [];
                            }
                            else {
                                this._selection = [];
                                this.selectionKeys = {};
                            }
                            this._selection = [...this.selection, rowData];
                            this.selectionChange.emit(this.selection);
                            if (dataKeyValue) {
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                        this.onRowSelect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: rowIndex });
                    }
                }
                else {
                    if (this.selectionMode === 'single') {
                        if (selected) {
                            this._selection = null;
                            this.selectionKeys = {};
                            this.selectionChange.emit(this.selection);
                            this.onRowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: rowIndex });
                        }
                        else {
                            this._selection = rowData;
                            this.selectionChange.emit(this.selection);
                            this.onRowSelect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: rowIndex });
                            if (dataKeyValue) {
                                this.selectionKeys = {};
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                    }
                    else if (this.selectionMode === 'multiple') {
                        if (selected) {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this._selection = this.selection.filter((val, i) => i != selectionIndex);
                            this.selectionChange.emit(this.selection);
                            this.onRowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: rowIndex });
                            if (dataKeyValue) {
                                delete this.selectionKeys[dataKeyValue];
                            }
                        }
                        else {
                            this._selection = this.selection ? [...this.selection, rowData] : [rowData];
                            this.selectionChange.emit(this.selection);
                            this.onRowSelect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: rowIndex });
                            if (dataKeyValue) {
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                    }
                }
            }
            this.tableService.onSelectionChange();
            if (this.isStateful()) {
                this.saveState();
            }
        }
        this.rowTouched = false;
    }
    handleRowTouchEnd(event) {
        this.rowTouched = true;
    }
    handleRowRightClick(event) {
        if (this.contextMenu) {
            const rowData = event.rowData;
            const rowIndex = event.rowIndex;
            if (this.contextMenuSelectionMode === 'separate') {
                this.contextMenuSelection = rowData;
                this.contextMenuSelectionChange.emit(rowData);
                this.onContextMenuSelect.emit({ originalEvent: event.originalEvent, data: rowData, index: event.rowIndex });
                this.contextMenu.show(event.originalEvent);
                this.tableService.onContextMenu(rowData);
            }
            else if (this.contextMenuSelectionMode === 'joint') {
                this.preventSelectionSetterPropagation = true;
                let selected = this.isSelected(rowData);
                let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey)) : null;
                if (!selected) {
                    if (!this.isRowSelectable(rowData, rowIndex)) {
                        return;
                    }
                    if (this.isSingleSelectionMode()) {
                        this.selection = rowData;
                        this.selectionChange.emit(rowData);
                        if (dataKeyValue) {
                            this.selectionKeys = {};
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    }
                    else if (this.isMultipleSelectionMode()) {
                        this._selection = this.selection ? [...this.selection, rowData] : [rowData];
                        this.selectionChange.emit(this.selection);
                        if (dataKeyValue) {
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    }
                }
                this.tableService.onSelectionChange();
                this.contextMenu.show(event.originalEvent);
                this.onContextMenuSelect.emit({ originalEvent: event, data: rowData, index: event.rowIndex });
            }
        }
    }
    selectRange(event, rowIndex) {
        let rangeStart, rangeEnd;
        if (this.anchorRowIndex > rowIndex) {
            rangeStart = rowIndex;
            rangeEnd = this.anchorRowIndex;
        }
        else if (this.anchorRowIndex < rowIndex) {
            rangeStart = this.anchorRowIndex;
            rangeEnd = rowIndex;
        }
        else {
            rangeStart = rowIndex;
            rangeEnd = rowIndex;
        }
        if (this.lazy && this.paginator) {
            rangeStart -= this.first;
            rangeEnd -= this.first;
        }
        let rangeRowsData = [];
        for (let i = rangeStart; i <= rangeEnd; i++) {
            let rangeRowData = this.filteredValue ? this.filteredValue[i] : this.value[i];
            if (!this.isSelected(rangeRowData)) {
                if (!this.isRowSelectable(rangeRowData, rowIndex)) {
                    continue;
                }
                rangeRowsData.push(rangeRowData);
                this._selection = [...this.selection, rangeRowData];
                let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey)) : null;
                if (dataKeyValue) {
                    this.selectionKeys[dataKeyValue] = 1;
                }
            }
        }
        this.selectionChange.emit(this.selection);
        this.onRowSelect.emit({ originalEvent: event, data: rangeRowsData, type: 'row' });
    }
    clearSelectionRange(event) {
        let rangeStart, rangeEnd;
        if (this.rangeRowIndex > this.anchorRowIndex) {
            rangeStart = this.anchorRowIndex;
            rangeEnd = this.rangeRowIndex;
        }
        else if (this.rangeRowIndex < this.anchorRowIndex) {
            rangeStart = this.rangeRowIndex;
            rangeEnd = this.anchorRowIndex;
        }
        else {
            rangeStart = this.rangeRowIndex;
            rangeEnd = this.rangeRowIndex;
        }
        for (let i = rangeStart; i <= rangeEnd; i++) {
            let rangeRowData = this.value[i];
            let selectionIndex = this.findIndexInSelection(rangeRowData);
            this._selection = this.selection.filter((val, i) => i != selectionIndex);
            let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey)) : null;
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
            this.onRowUnselect.emit({ originalEvent: event, data: rangeRowData, type: 'row' });
        }
    }
    isSelected(rowData) {
        if (rowData && this.selection) {
            if (this.dataKey) {
                return this.selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== undefined;
            }
            else {
                if (Array.isArray(this.selection))
                    return this.findIndexInSelection(rowData) > -1;
                else
                    return this.equals(rowData, this.selection);
            }
        }
        return false;
    }
    findIndexInSelection(rowData) {
        let index = -1;
        if (this.selection && this.selection.length) {
            for (let i = 0; i < this.selection.length; i++) {
                if (this.equals(rowData, this.selection[i])) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    isRowSelectable(data, index) {
        if (this.rowSelectable && !this.rowSelectable({ data, index })) {
            return false;
        }
        return true;
    }
    toggleRowWithRadio(event, rowData) {
        this.preventSelectionSetterPropagation = true;
        if (this.selection != rowData) {
            if (!this.isRowSelectable(rowData, event.rowIndex)) {
                return;
            }
            this._selection = rowData;
            this.selectionChange.emit(this.selection);
            this.onRowSelect.emit({ originalEvent: event.originalEvent, index: event.rowIndex, data: rowData, type: 'radiobutton' });
            if (this.dataKey) {
                this.selectionKeys = {};
                this.selectionKeys[String(ObjectUtils.resolveFieldData(rowData, this.dataKey))] = 1;
            }
        }
        else {
            this._selection = null;
            this.selectionChange.emit(this.selection);
            this.onRowUnselect.emit({ originalEvent: event.originalEvent, index: event.rowIndex, data: rowData, type: 'radiobutton' });
        }
        this.tableService.onSelectionChange();
        if (this.isStateful()) {
            this.saveState();
        }
    }
    toggleRowWithCheckbox(event, rowData) {
        this.selection = this.selection || [];
        let selected = this.isSelected(rowData);
        let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey)) : null;
        this.preventSelectionSetterPropagation = true;
        if (selected) {
            let selectionIndex = this.findIndexInSelection(rowData);
            this._selection = this.selection.filter((val, i) => i != selectionIndex);
            this.selectionChange.emit(this.selection);
            this.onRowUnselect.emit({ originalEvent: event.originalEvent, index: event.rowIndex, data: rowData, type: 'checkbox' });
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
        }
        else {
            if (!this.isRowSelectable(rowData, event.rowIndex)) {
                return;
            }
            this._selection = this.selection ? [...this.selection, rowData] : [rowData];
            this.selectionChange.emit(this.selection);
            this.onRowSelect.emit({ originalEvent: event.originalEvent, index: event.rowIndex, data: rowData, type: 'checkbox' });
            if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
            }
        }
        this.tableService.onSelectionChange();
        if (this.isStateful()) {
            this.saveState();
        }
    }
    toggleRowsWithCheckbox(event, check) {
        if (this._selectAll !== null) {
            this.selectAllChange.emit({ originalEvent: event, checked: check });
        }
        else {
            const data = this.selectionPageOnly ? this.dataToRender(this.processedData) : this.processedData;
            let selection = this.selectionPageOnly && this._selection ? this._selection.filter((s) => !data.some((d) => this.equals(s, d))) : [];
            if (check) {
                selection = this.frozenValue ? [...selection, ...this.frozenValue, ...data] : [...selection, ...data];
                selection = this.rowSelectable ? selection.filter((data, index) => this.rowSelectable({ data, index })) : selection;
            }
            this._selection = selection;
            this.preventSelectionSetterPropagation = true;
            this.updateSelectionKeys();
            this.selectionChange.emit(this._selection);
            this.tableService.onSelectionChange();
            this.onHeaderCheckboxToggle.emit({ originalEvent: event, checked: check });
            if (this.isStateful()) {
                this.saveState();
            }
        }
    }
    equals(data1, data2) {
        return this.compareSelectionBy === 'equals' ? data1 === data2 : ObjectUtils.equals(data1, data2, this.dataKey);
    }
    /* Legacy Filtering for custom elements */
    filter(value, field, matchMode) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }
        if (!this.isFilterBlank(value)) {
            this.filters[field] = { value: value, matchMode: matchMode };
        }
        else if (this.filters[field]) {
            delete this.filters[field];
        }
        this.filterTimeout = setTimeout(() => {
            this._filter();
            this.filterTimeout = null;
        }, this.filterDelay);
        this.anchorRowIndex = null;
    }
    filterGlobal(value, matchMode) {
        this.filter(value, 'global', matchMode);
    }
    isFilterBlank(filter) {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (Array.isArray(filter) && filter.length == 0))
                return true;
            else
                return false;
        }
        return true;
    }
    _filter() {
        if (!this.restoringFilter) {
            this.first = 0;
            this.firstChange.emit(this.first);
        }
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            if (!this.value) {
                return;
            }
            if (!this.hasFilter()) {
                this.filteredValue = null;
                if (this.paginator) {
                    this.totalRecords = this.value ? this.value.length : 0;
                }
            }
            else {
                let globalFilterFieldsArray;
                if (this.filters['global']) {
                    if (!this.columns && !this.globalFilterFields)
                        throw new Error('Global filtering requires dynamic columns or globalFilterFields to be defined.');
                    else
                        globalFilterFieldsArray = this.globalFilterFields || this.columns;
                }
                this.filteredValue = [];
                for (let i = 0; i < this.value.length; i++) {
                    let localMatch = true;
                    let globalMatch = false;
                    let localFiltered = false;
                    for (let prop in this.filters) {
                        if (this.filters.hasOwnProperty(prop) && prop !== 'global') {
                            localFiltered = true;
                            let filterField = prop;
                            let filterMeta = this.filters[filterField];
                            if (Array.isArray(filterMeta)) {
                                for (let meta of filterMeta) {
                                    localMatch = this.executeLocalFilter(filterField, this.value[i], meta);
                                    if ((meta.operator === FilterOperator.OR && localMatch) || (meta.operator === FilterOperator.AND && !localMatch)) {
                                        break;
                                    }
                                }
                            }
                            else {
                                localMatch = this.executeLocalFilter(filterField, this.value[i], filterMeta);
                            }
                            if (!localMatch) {
                                break;
                            }
                        }
                    }
                    if (this.filters['global'] && !globalMatch && globalFilterFieldsArray) {
                        for (let j = 0; j < globalFilterFieldsArray.length; j++) {
                            let globalFilterField = globalFilterFieldsArray[j].field || globalFilterFieldsArray[j];
                            globalMatch = this.filterService.filters[this.filters['global'].matchMode](ObjectUtils.resolveFieldData(this.value[i], globalFilterField), this.filters['global'].value, this.filterLocale);
                            if (globalMatch) {
                                break;
                            }
                        }
                    }
                    let matches;
                    if (this.filters['global']) {
                        matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
                    }
                    else {
                        matches = localFiltered && localMatch;
                    }
                    if (matches) {
                        this.filteredValue.push(this.value[i]);
                    }
                }
                if (this.filteredValue.length === this.value.length) {
                    this.filteredValue = null;
                }
                if (this.paginator) {
                    this.totalRecords = this.filteredValue ? this.filteredValue.length : this.value ? this.value.length : 0;
                }
            }
        }
        this.onFilter.emit({
            filters: this.filters,
            filteredValue: this.filteredValue || this.value
        });
        this.tableService.onValueChange(this.value);
        if (this.isStateful() && !this.restoringFilter) {
            this.saveState();
        }
        if (this.restoringFilter) {
            this.restoringFilter = false;
        }
        this.cd.markForCheck();
        if (this.scrollable) {
            this.resetScrollTop();
        }
    }
    executeLocalFilter(field, rowData, filterMeta) {
        let filterValue = filterMeta.value;
        let filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
        let dataFieldValue = ObjectUtils.resolveFieldData(rowData, field);
        let filterConstraint = this.filterService.filters[filterMatchMode];
        return filterConstraint(dataFieldValue, filterValue, this.filterLocale);
    }
    hasFilter() {
        let empty = true;
        for (let prop in this.filters) {
            if (this.filters.hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }
        return !empty;
    }
    createLazyLoadMetadata() {
        return {
            first: this.first,
            rows: this.rows,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            filters: this.filters,
            globalFilter: this.filters && this.filters['global'] ? this.filters['global'].value : null,
            multiSortMeta: this.multiSortMeta,
            forceUpdate: () => this.cd.detectChanges()
        };
    }
    clear() {
        this._sortField = null;
        this._sortOrder = this.defaultSortOrder;
        this._multiSortMeta = null;
        this.tableService.onSort(null);
        if (this.filters['global']) {
            this.filters['global'].value = null;
        }
        this.filteredValue = null;
        this.tableService.onResetChange();
        this.first = 0;
        this.firstChange.emit(this.first);
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            this.totalRecords = this._value ? this._value.length : 0;
        }
    }
    reset() {
        this.clear();
    }
    getExportHeader(column) {
        return column[this.exportHeader] || column.header || column.field;
    }
    exportCSV(options) {
        let data;
        let csv = '';
        let columns = this.columns;
        if (options && options.selectionOnly) {
            data = this.selection || [];
        }
        else if (options && options.allValues) {
            data = this.value || [];
        }
        else {
            data = this.filteredValue || this.value;
            if (this.frozenValue) {
                data = data ? [...this.frozenValue, ...data] : this.frozenValue;
            }
        }
        //headers
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            if (column.exportable !== false && column.field) {
                csv += '"' + this.getExportHeader(column) + '"';
                if (i < columns.length - 1) {
                    csv += this.csvSeparator;
                }
            }
        }
        //body
        data.forEach((record, i) => {
            csv += '\n';
            for (let i = 0; i < columns.length; i++) {
                let column = columns[i];
                if (column.exportable !== false && column.field) {
                    let cellData = ObjectUtils.resolveFieldData(record, column.field);
                    if (cellData != null) {
                        if (this.exportFunction) {
                            cellData = this.exportFunction({
                                data: cellData,
                                field: column.field
                            });
                        }
                        else
                            cellData = String(cellData).replace(/"/g, '""');
                    }
                    else
                        cellData = '';
                    csv += '"' + cellData + '"';
                    if (i < columns.length - 1) {
                        csv += this.csvSeparator;
                    }
                }
            }
        });
        let blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;'
        });
        let link = this.renderer.createElement('a');
        link.style.display = 'none';
        this.renderer.appendChild(this.document.body, link);
        if (link.download !== undefined) {
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', this.exportFilename + '.csv');
            link.click();
        }
        else {
            csv = 'data:text/csv;charset=utf-8,' + csv;
            this.window.open(encodeURI(csv));
        }
        this.renderer.removeChild(this.document.body, link);
    }
    onLazyItemLoad(event) {
        this.onLazyLoad.emit({
            ...this.createLazyLoadMetadata(),
            ...event,
            rows: event.last - event.first
        });
    }
    resetScrollTop() {
        if (this.virtualScroll)
            this.scrollToVirtualIndex(0);
        else
            this.scrollTo({ top: 0 });
    }
    scrollToVirtualIndex(index) {
        this.virtualScroll && this.scroller.scrollToIndex(index);
    }
    scrollTo(options) {
        if (this.virtualScroll) {
            this.scroller.scrollTo(options);
        }
        else if (this.wrapperViewChild && this.wrapperViewChild.nativeElement) {
            if (this.wrapperViewChild.nativeElement.scrollTo) {
                this.wrapperViewChild.nativeElement.scrollTo(options);
            }
            else {
                this.wrapperViewChild.nativeElement.scrollLeft = options.left;
                this.wrapperViewChild.nativeElement.scrollTop = options.top;
            }
        }
    }
    updateEditingCell(cell, data, field, index) {
        this.editingCell = cell;
        this.editingCellData = data;
        this.editingCellField = field;
        this.editingCellRowIndex = index;
        this.bindDocumentEditListener();
    }
    isEditingCellValid() {
        return this.editingCell && DomHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length === 0;
    }
    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = this.renderer.listen(this.document, 'click', (event) => {
                if (this.editingCell && !this.selfClick && this.isEditingCellValid()) {
                    DomHandler.removeClass(this.editingCell, 'p-cell-editing');
                    this.editingCell = null;
                    this.onEditComplete.emit({ field: this.editingCellField, data: this.editingCellData, originalEvent: event, index: this.editingCellRowIndex });
                    this.editingCellField = null;
                    this.editingCellData = null;
                    this.editingCellRowIndex = null;
                    this.unbindDocumentEditListener();
                    this.cd.markForCheck();
                    if (this.overlaySubscription) {
                        this.overlaySubscription.unsubscribe();
                    }
                }
                this.selfClick = false;
            });
        }
    }
    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            this.documentEditListener();
            this.documentEditListener = null;
        }
    }
    initRowEdit(rowData) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey));
        this.editingRowKeys[dataKeyValue] = true;
    }
    saveRowEdit(rowData, rowElement) {
        if (DomHandler.find(rowElement, '.ng-invalid.ng-dirty').length === 0) {
            let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey));
            delete this.editingRowKeys[dataKeyValue];
        }
    }
    cancelRowEdit(rowData) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey));
        delete this.editingRowKeys[dataKeyValue];
    }
    toggleRow(rowData, event) {
        if (!this.dataKey) {
            throw new Error('dataKey must be defined to use row expansion');
        }
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey));
        if (this.expandedRowKeys[dataKeyValue] != null) {
            delete this.expandedRowKeys[dataKeyValue];
            this.onRowCollapse.emit({
                originalEvent: event,
                data: rowData
            });
        }
        else {
            if (this.rowExpandMode === 'single') {
                this.expandedRowKeys = {};
            }
            this.expandedRowKeys[dataKeyValue] = true;
            this.onRowExpand.emit({
                originalEvent: event,
                data: rowData
            });
        }
        if (event) {
            event.preventDefault();
        }
        if (this.isStateful()) {
            this.saveState();
        }
    }
    isRowExpanded(rowData) {
        return this.expandedRowKeys[String(ObjectUtils.resolveFieldData(rowData, this.dataKey))] === true;
    }
    isRowEditing(rowData) {
        return this.editingRowKeys[String(ObjectUtils.resolveFieldData(rowData, this.dataKey))] === true;
    }
    isSingleSelectionMode() {
        return this.selectionMode === 'single';
    }
    isMultipleSelectionMode() {
        return this.selectionMode === 'multiple';
    }
    onColumnResizeBegin(event) {
        let containerLeft = DomHandler.getOffset(this.containerViewChild.nativeElement).left;
        this.resizeColumnElement = event.target.parentElement;
        this.columnResizing = true;
        this.lastResizerHelperX = event.pageX - containerLeft + this.containerViewChild.nativeElement.scrollLeft;
        this.onColumnResize(event);
        event.preventDefault();
    }
    onColumnResize(event) {
        let containerLeft = DomHandler.getOffset(this.containerViewChild.nativeElement).left;
        DomHandler.addClass(this.containerViewChild.nativeElement, 'p-unselectable-text');
        this.resizeHelperViewChild.nativeElement.style.height = this.containerViewChild.nativeElement.offsetHeight + 'px';
        this.resizeHelperViewChild.nativeElement.style.top = 0 + 'px';
        this.resizeHelperViewChild.nativeElement.style.left = event.pageX - containerLeft + this.containerViewChild.nativeElement.scrollLeft + 'px';
        this.resizeHelperViewChild.nativeElement.style.display = 'block';
    }
    onColumnResizeEnd() {
        let delta = this.resizeHelperViewChild.nativeElement.offsetLeft - this.lastResizerHelperX;
        let columnWidth = this.resizeColumnElement.offsetWidth;
        let newColumnWidth = columnWidth + delta;
        let minWidth = this.resizeColumnElement.style.minWidth.replace(/[^\d.]/g, '') || 15;
        if (newColumnWidth >= minWidth) {
            if (this.columnResizeMode === 'fit') {
                let nextColumn = this.resizeColumnElement.nextElementSibling;
                let nextColumnWidth = nextColumn.offsetWidth - delta;
                if (newColumnWidth > 15 && nextColumnWidth > 15) {
                    this.resizeTableCells(newColumnWidth, nextColumnWidth);
                }
            }
            else if (this.columnResizeMode === 'expand') {
                let tableWidth = this.tableViewChild.nativeElement.offsetWidth + delta;
                this.setResizeTableWidth(tableWidth + 'px');
                this.resizeTableCells(newColumnWidth, null);
            }
            this.onColResize.emit({
                element: this.resizeColumnElement,
                delta: delta
            });
            if (this.isStateful()) {
                this.saveState();
            }
        }
        this.resizeHelperViewChild.nativeElement.style.display = 'none';
        DomHandler.removeClass(this.containerViewChild.nativeElement, 'p-unselectable-text');
    }
    resizeTableCells(newColumnWidth, nextColumnWidth) {
        let colIndex = DomHandler.index(this.resizeColumnElement);
        let widths = [];
        const tableHead = DomHandler.findSingle(this.containerViewChild.nativeElement, '.p-datatable-thead');
        let headers = DomHandler.find(tableHead, 'tr > th');
        headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
        this.destroyStyleElement();
        this.createStyleElement();
        let innerHTML = '';
        widths.forEach((width, index) => {
            let colWidth = index === colIndex ? newColumnWidth : nextColumnWidth && index === colIndex + 1 ? nextColumnWidth : width;
            let style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important;`;
            innerHTML += `
                #${this.id}-table > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                #${this.id}-table > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                #${this.id}-table > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                    ${style}
                }
            `;
        });
        this.styleElement.textContent = innerHTML;
    }
    onColumnDragStart(event, columnElement) {
        this.reorderIconWidth = DomHandler.getHiddenElementOuterWidth(this.reorderIndicatorUpViewChild.nativeElement);
        this.reorderIconHeight = DomHandler.getHiddenElementOuterHeight(this.reorderIndicatorDownViewChild.nativeElement);
        this.draggedColumn = columnElement;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }
    onColumnDragEnter(event, dropHeader) {
        if (this.reorderableColumns && this.draggedColumn && dropHeader) {
            event.preventDefault();
            let containerOffset = DomHandler.getOffset(this.containerViewChild.nativeElement);
            let dropHeaderOffset = DomHandler.getOffset(dropHeader);
            if (this.draggedColumn != dropHeader) {
                let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'preorderablecolumn');
                let dropIndex = DomHandler.indexWithinGroup(dropHeader, 'preorderablecolumn');
                let targetLeft = dropHeaderOffset.left - containerOffset.left;
                let targetTop = containerOffset.top - dropHeaderOffset.top;
                let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
                this.reorderIndicatorUpViewChild.nativeElement.style.top = dropHeaderOffset.top - containerOffset.top - (this.reorderIconHeight - 1) + 'px';
                this.reorderIndicatorDownViewChild.nativeElement.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';
                if (event.pageX > columnCenter) {
                    this.reorderIndicatorUpViewChild.nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.reorderIconWidth / 2) + 'px';
                    this.reorderIndicatorDownViewChild.nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = 1;
                }
                else {
                    this.reorderIndicatorUpViewChild.nativeElement.style.left = targetLeft - Math.ceil(this.reorderIconWidth / 2) + 'px';
                    this.reorderIndicatorDownViewChild.nativeElement.style.left = targetLeft - Math.ceil(this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = -1;
                }
                this.reorderIndicatorUpViewChild.nativeElement.style.display = 'block';
                this.reorderIndicatorDownViewChild.nativeElement.style.display = 'block';
            }
            else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
    }
    onColumnDragLeave(event) {
        if (this.reorderableColumns && this.draggedColumn) {
            event.preventDefault();
        }
    }
    onColumnDrop(event, dropColumn) {
        event.preventDefault();
        if (this.draggedColumn) {
            let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'preorderablecolumn');
            let dropIndex = DomHandler.indexWithinGroup(dropColumn, 'preorderablecolumn');
            let allowDrop = dragIndex != dropIndex;
            if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
                allowDrop = false;
            }
            if (allowDrop && dropIndex < dragIndex && this.dropPosition === 1) {
                dropIndex = dropIndex + 1;
            }
            if (allowDrop && dropIndex > dragIndex && this.dropPosition === -1) {
                dropIndex = dropIndex - 1;
            }
            if (allowDrop) {
                ObjectUtils.reorderArray(this.columns, dragIndex, dropIndex);
                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: this.columns
                });
                if (this.isStateful()) {
                    this.zone.runOutsideAngular(() => {
                        setTimeout(() => {
                            this.saveState();
                        });
                    });
                }
            }
            this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
            this.reorderIndicatorDownViewChild.nativeElement.style.display = 'none';
            this.draggedColumn.draggable = false;
            this.draggedColumn = null;
            this.dropPosition = null;
        }
    }
    onRowDragStart(event, index) {
        this.rowDragging = true;
        this.draggedRowIndex = index;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }
    onRowDragOver(event, index, rowElement) {
        if (this.rowDragging && this.draggedRowIndex !== index) {
            let rowY = DomHandler.getOffset(rowElement).top + DomHandler.getWindowScrollTop();
            let pageY = event.pageY;
            let rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
            let prevRowElement = rowElement.previousElementSibling;
            if (pageY < rowMidY) {
                DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');
                this.droppedRowIndex = index;
                if (prevRowElement)
                    DomHandler.addClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else
                    DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');
            }
            else {
                if (prevRowElement)
                    DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else
                    DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');
                this.droppedRowIndex = index + 1;
                DomHandler.addClass(rowElement, 'p-datatable-dragpoint-bottom');
            }
        }
    }
    onRowDragLeave(event, rowElement) {
        let prevRowElement = rowElement.previousElementSibling;
        if (prevRowElement) {
            DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
        }
        DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');
        DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-top');
    }
    onRowDragEnd(event) {
        this.rowDragging = false;
        this.draggedRowIndex = null;
        this.droppedRowIndex = null;
    }
    onRowDrop(event, rowElement) {
        if (this.droppedRowIndex != null) {
            let dropIndex = this.draggedRowIndex > this.droppedRowIndex ? this.droppedRowIndex : this.droppedRowIndex === 0 ? 0 : this.droppedRowIndex - 1;
            ObjectUtils.reorderArray(this.value, this.draggedRowIndex, dropIndex);
            if (this.virtualScroll) {
                // TODO: Check
                this._value = [...this._value];
            }
            this.onRowReorder.emit({
                dragIndex: this.draggedRowIndex,
                dropIndex: dropIndex
            });
        }
        //cleanup
        this.onRowDragLeave(event, rowElement);
        this.onRowDragEnd(event);
    }
    isEmpty() {
        let data = this.filteredValue || this.value;
        return data == null || data.length == 0;
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    getStorage() {
        if (isPlatformBrowser(this.platformId)) {
            switch (this.stateStorage) {
                case 'local':
                    return window.localStorage;
                case 'session':
                    return window.sessionStorage;
                default:
                    throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        }
        else {
            throw new Error('Browser storage is not available in the server side.');
        }
    }
    isStateful() {
        return this.stateKey != null;
    }
    saveState() {
        const storage = this.getStorage();
        let state = {};
        if (this.paginator) {
            state.first = this.first;
            state.rows = this.rows;
        }
        if (this.sortField) {
            state.sortField = this.sortField;
            state.sortOrder = this.sortOrder;
        }
        if (this.multiSortMeta) {
            state.multiSortMeta = this.multiSortMeta;
        }
        if (this.hasFilter()) {
            state.filters = this.filters;
        }
        if (this.resizableColumns) {
            this.saveColumnWidths(state);
        }
        if (this.reorderableColumns) {
            this.saveColumnOrder(state);
        }
        if (this.selection) {
            state.selection = this.selection;
        }
        if (Object.keys(this.expandedRowKeys).length) {
            state.expandedRowKeys = this.expandedRowKeys;
        }
        storage.setItem(this.stateKey, JSON.stringify(state));
        this.onStateSave.emit(state);
    }
    clearState() {
        const storage = this.getStorage();
        if (this.stateKey) {
            storage.removeItem(this.stateKey);
        }
    }
    restoreState() {
        const storage = this.getStorage();
        const stateString = storage.getItem(this.stateKey);
        const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
        const reviver = function (key, value) {
            if (typeof value === 'string' && dateFormat.test(value)) {
                return new Date(value);
            }
            return value;
        };
        if (stateString) {
            let state = JSON.parse(stateString, reviver);
            if (this.paginator) {
                if (this.first !== undefined) {
                    this.first = state.first;
                    this.firstChange.emit(this.first);
                }
                if (this.rows !== undefined) {
                    this.rows = state.rows;
                    this.rowsChange.emit(this.rows);
                }
            }
            if (state.sortField) {
                this.restoringSort = true;
                this._sortField = state.sortField;
                this._sortOrder = state.sortOrder;
            }
            if (state.multiSortMeta) {
                this.restoringSort = true;
                this._multiSortMeta = state.multiSortMeta;
            }
            if (state.filters) {
                this.restoringFilter = true;
                this.filters = state.filters;
            }
            if (this.resizableColumns) {
                this.columnWidthsState = state.columnWidths;
                this.tableWidthState = state.tableWidth;
            }
            if (state.expandedRowKeys) {
                this.expandedRowKeys = state.expandedRowKeys;
            }
            if (state.selection) {
                Promise.resolve(null).then(() => this.selectionChange.emit(state.selection));
            }
            this.stateRestored = true;
            this.onStateRestore.emit(state);
        }
    }
    saveColumnWidths(state) {
        let widths = [];
        let headers = DomHandler.find(this.containerViewChild.nativeElement, '.p-datatable-thead > tr > th');
        headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
        state.columnWidths = widths.join(',');
        if (this.columnResizeMode === 'expand') {
            state.tableWidth = DomHandler.getOuterWidth(this.tableViewChild.nativeElement);
        }
    }
    setResizeTableWidth(width) {
        this.tableViewChild.nativeElement.style.width = width;
        this.tableViewChild.nativeElement.style.minWidth = width;
    }
    restoreColumnWidths() {
        if (this.columnWidthsState) {
            let widths = this.columnWidthsState.split(',');
            if (this.columnResizeMode === 'expand' && this.tableWidthState) {
                this.setResizeTableWidth(this.tableWidthState + 'px');
            }
            if (ObjectUtils.isNotEmpty(widths)) {
                this.createStyleElement();
                let innerHTML = '';
                widths.forEach((width, index) => {
                    let style = `width: ${width}px !important; max-width: ${width}px !important`;
                    innerHTML += `
                        #${this.id}-table > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                        #${this.id}-table > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                        #${this.id}-table > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                            ${style}
                        }
                    `;
                });
                this.styleElement.textContent = innerHTML;
            }
        }
    }
    saveColumnOrder(state) {
        if (this.columns) {
            let columnOrder = [];
            this.columns.map((column) => {
                columnOrder.push(column.field || column.key);
            });
            state.columnOrder = columnOrder;
        }
    }
    restoreColumnOrder() {
        const storage = this.getStorage();
        const stateString = storage.getItem(this.stateKey);
        if (stateString) {
            let state = JSON.parse(stateString);
            let columnOrder = state.columnOrder;
            if (columnOrder) {
                let reorderedColumns = [];
                columnOrder.map((key) => {
                    let col = this.findColumnByKey(key);
                    if (col) {
                        reorderedColumns.push(col);
                    }
                });
                this.columnOrderStateRestored = true;
                this.columns = reorderedColumns;
            }
        }
    }
    findColumnByKey(key) {
        if (this.columns) {
            for (let col of this.columns) {
                if (col.key === key || col.field === key)
                    return col;
                else
                    continue;
            }
        }
        else {
            return null;
        }
    }
    createStyleElement() {
        this.styleElement = this.renderer.createElement('style');
        this.styleElement.type = 'text/css';
        this.renderer.appendChild(this.document.head, this.styleElement);
    }
    getGroupRowsMeta() {
        return { field: this.groupRowsBy, order: this.groupRowsByOrder };
    }
    createResponsiveStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.responsiveStyleElement) {
                this.responsiveStyleElement = this.renderer.createElement('style');
                this.responsiveStyleElement.type = 'text/css';
                this.renderer.appendChild(this.document.head, this.responsiveStyleElement);
                let innerHTML = `
    @media screen and (max-width: ${this.breakpoint}) {
        #${this.id}-table > .p-datatable-thead > tr > th,
        #${this.id}-table > .p-datatable-tfoot > tr > td {
            display: none !important;
        }
    
        #${this.id}-table > .p-datatable-tbody > tr > td {
            display: flex;
            width: 100% !important;
            align-items: center;
            justify-content: space-between;
        }
    
        #${this.id}-table > .p-datatable-tbody > tr > td:not(:last-child) {
            border: 0 none;
        }
    
        #${this.id}.p-datatable-gridlines > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody > tr > td:last-child {
            border-top: 0;
            border-right: 0;
            border-left: 0;
        }
    
        #${this.id}-table > .p-datatable-tbody > tr > td > .p-column-title {
            display: block;
        }
    }
    `;
                this.responsiveStyleElement.textContent = innerHTML;
            }
        }
    }
    destroyResponsiveStyle() {
        if (this.responsiveStyleElement) {
            this.renderer.removeChild(this.document.head, this.responsiveStyleElement);
            this.responsiveStyleElement = null;
        }
    }
    destroyStyleElement() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }
    ngOnDestroy() {
        this.unbindDocumentEditListener();
        this.editingCell = null;
        this.initialized = null;
        this.destroyStyleElement();
        this.destroyResponsiveStyle();
    }
}
Table.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Table, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: TableService }, { token: i0.ChangeDetectorRef }, { token: i1.FilterService }, { token: i1.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
Table.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: Table, selector: "p-table", inputs: { frozenColumns: "frozenColumns", frozenValue: "frozenValue", style: "style", styleClass: "styleClass", tableStyle: "tableStyle", tableStyleClass: "tableStyleClass", paginator: "paginator", pageLinks: "pageLinks", rowsPerPageOptions: "rowsPerPageOptions", alwaysShowPaginator: "alwaysShowPaginator", paginatorPosition: "paginatorPosition", paginatorDropdownAppendTo: "paginatorDropdownAppendTo", paginatorDropdownScrollHeight: "paginatorDropdownScrollHeight", currentPageReportTemplate: "currentPageReportTemplate", showCurrentPageReport: "showCurrentPageReport", showJumpToPageDropdown: "showJumpToPageDropdown", showJumpToPageInput: "showJumpToPageInput", showFirstLastIcon: "showFirstLastIcon", showPageLinks: "showPageLinks", defaultSortOrder: "defaultSortOrder", sortMode: "sortMode", resetPageOnSort: "resetPageOnSort", selectionMode: "selectionMode", selectionPageOnly: "selectionPageOnly", contextMenuSelection: "contextMenuSelection", contextMenuSelectionMode: "contextMenuSelectionMode", dataKey: "dataKey", metaKeySelection: "metaKeySelection", rowSelectable: "rowSelectable", rowTrackBy: "rowTrackBy", lazy: "lazy", lazyLoadOnInit: "lazyLoadOnInit", compareSelectionBy: "compareSelectionBy", csvSeparator: "csvSeparator", exportFilename: "exportFilename", filters: "filters", globalFilterFields: "globalFilterFields", filterDelay: "filterDelay", filterLocale: "filterLocale", expandedRowKeys: "expandedRowKeys", editingRowKeys: "editingRowKeys", rowExpandMode: "rowExpandMode", scrollable: "scrollable", scrollDirection: "scrollDirection", rowGroupMode: "rowGroupMode", scrollHeight: "scrollHeight", virtualScroll: "virtualScroll", virtualScrollItemSize: "virtualScrollItemSize", virtualScrollOptions: "virtualScrollOptions", virtualScrollDelay: "virtualScrollDelay", frozenWidth: "frozenWidth", responsive: "responsive", contextMenu: "contextMenu", resizableColumns: "resizableColumns", columnResizeMode: "columnResizeMode", reorderableColumns: "reorderableColumns", loading: "loading", loadingIcon: "loadingIcon", showLoader: "showLoader", rowHover: "rowHover", customSort: "customSort", showInitialSortBadge: "showInitialSortBadge", autoLayout: "autoLayout", exportFunction: "exportFunction", exportHeader: "exportHeader", stateKey: "stateKey", stateStorage: "stateStorage", editMode: "editMode", groupRowsBy: "groupRowsBy", groupRowsByOrder: "groupRowsByOrder", responsiveLayout: "responsiveLayout", breakpoint: "breakpoint", virtualRowHeight: "virtualRowHeight", value: "value", columns: "columns", first: "first", rows: "rows", totalRecords: "totalRecords", sortField: "sortField", sortOrder: "sortOrder", multiSortMeta: "multiSortMeta", selection: "selection", selectAll: "selectAll" }, outputs: { selectAllChange: "selectAllChange", selectionChange: "selectionChange", contextMenuSelectionChange: "contextMenuSelectionChange", onRowSelect: "onRowSelect", onRowUnselect: "onRowUnselect", onPage: "onPage", onSort: "onSort", onFilter: "onFilter", onLazyLoad: "onLazyLoad", onRowExpand: "onRowExpand", onRowCollapse: "onRowCollapse", onContextMenuSelect: "onContextMenuSelect", onColResize: "onColResize", onColReorder: "onColReorder", onRowReorder: "onRowReorder", onEditInit: "onEditInit", onEditComplete: "onEditComplete", onEditCancel: "onEditCancel", onHeaderCheckboxToggle: "onHeaderCheckboxToggle", sortFunction: "sortFunction", firstChange: "firstChange", rowsChange: "rowsChange", onStateSave: "onStateSave", onStateRestore: "onStateRestore" }, host: { classAttribute: "p-element" }, providers: [TableService], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }, { propertyName: "resizeHelperViewChild", first: true, predicate: ["resizeHelper"], descendants: true }, { propertyName: "reorderIndicatorUpViewChild", first: true, predicate: ["reorderIndicatorUp"], descendants: true }, { propertyName: "reorderIndicatorDownViewChild", first: true, predicate: ["reorderIndicatorDown"], descendants: true }, { propertyName: "wrapperViewChild", first: true, predicate: ["wrapper"], descendants: true }, { propertyName: "tableViewChild", first: true, predicate: ["table"], descendants: true }, { propertyName: "tableHeaderViewChild", first: true, predicate: ["thead"], descendants: true }, { propertyName: "tableFooterViewChild", first: true, predicate: ["tfoot"], descendants: true }, { propertyName: "scroller", first: true, predicate: ["scroller"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <div
            #container
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{ 'p-datatable p-component': true, 'p-datatable-hoverable-rows': rowHover || selectionMode, 'p-datatable-scrollable': scrollable, 'p-datatable-flex-scrollable': scrollable && scrollHeight === 'flex' }"
            [attr.id]="id"
        >
            <div class="p-datatable-loading-overlay p-component-overlay" *ngIf="loading && showLoader">
                <i [class]="'p-datatable-loading-icon pi-spin ' + loadingIcon"></i>
            </div>
            <div *ngIf="captionTemplate" class="p-datatable-header">
                <ng-container *ngTemplateOutlet="captionTemplate"></ng-container>
            </div>
            <p-paginator
                [rows]="rows"
                [first]="first"
                [totalRecords]="totalRecords"
                [pageLinkSize]="pageLinks"
                styleClass="p-paginator-top"
                [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions"
                *ngIf="paginator && (paginatorPosition === 'top' || paginatorPosition == 'both')"
                [templateLeft]="paginatorLeftTemplate"
                [templateRight]="paginatorRightTemplate"
                [dropdownAppendTo]="paginatorDropdownAppendTo"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight"
                [currentPageReportTemplate]="currentPageReportTemplate"
                [showFirstLastIcon]="showFirstLastIcon"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate"
                [showCurrentPageReport]="showCurrentPageReport"
                [showJumpToPageDropdown]="showJumpToPageDropdown"
                [showJumpToPageInput]="showJumpToPageInput"
                [showPageLinks]="showPageLinks"
            ></p-paginator>

            <div #wrapper class="p-datatable-wrapper" [ngStyle]="{ maxHeight: virtualScroll ? '' : scrollHeight }">
                <p-scroller
                    #scroller
                    *ngIf="virtualScroll"
                    [items]="processedData"
                    [columns]="columns"
                    [style]="{ height: scrollHeight !== 'flex' ? scrollHeight : undefined }"
                    [scrollHeight]="scrollHeight !== 'flex' ? undefined : '100%'"
                    [itemSize]="virtualScrollItemSize || _virtualRowHeight"
                    [step]="rows"
                    [delay]="lazy ? virtualScrollDelay : 0"
                    [inline]="true"
                    [lazy]="lazy"
                    (onLazyLoad)="onLazyItemLoad($event)"
                    [loaderDisabled]="true"
                    [showSpacer]="false"
                    [showLoader]="loadingBodyTemplate"
                    [options]="virtualScrollOptions"
                    [autoSize]="true"
                >
                    <ng-template pTemplate="content" let-items let-scrollerOptions="options">
                        <ng-container *ngTemplateOutlet="buildInTable; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                    </ng-template>
                </p-scroller>
                <ng-container *ngIf="!virtualScroll">
                    <ng-container *ngTemplateOutlet="buildInTable; context: { $implicit: processedData, options: { columns } }"></ng-container>
                </ng-container>

                <ng-template #buildInTable let-items let-scrollerOptions="options">
                    <table
                        #table
                        role="table"
                        [ngClass]="{ 'p-datatable-table': true, 'p-datatable-scrollable-table': scrollable, 'p-datatable-resizable-table': resizableColumns, 'p-datatable-resizable-table-fit': resizableColumns && columnResizeMode === 'fit' }"
                        [class]="tableStyleClass"
                        [style]="tableStyle"
                        [attr.id]="id + '-table'"
                    >
                        <ng-container *ngTemplateOutlet="colGroupTemplate; context: { $implicit: scrollerOptions.columns }"></ng-container>
                        <thead #thead class="p-datatable-thead">
                            <ng-container *ngTemplateOutlet="headerGroupedTemplate || headerTemplate; context: { $implicit: scrollerOptions.columns }"></ng-container>
                        </thead>
                        <tbody
                            class="p-datatable-tbody p-datatable-frozen-tbody"
                            *ngIf="frozenValue || frozenBodyTemplate"
                            [value]="frozenValue"
                            [frozenRows]="true"
                            [pTableBody]="scrollerOptions.columns"
                            [pTableBodyTemplate]="frozenBodyTemplate"
                            [frozen]="true"
                        ></tbody>
                        <tbody
                            class="p-datatable-tbody"
                            [ngClass]="scrollerOptions.contentStyleClass"
                            [style]="scrollerOptions.contentStyle"
                            [value]="dataToRender(scrollerOptions.rows)"
                            [pTableBody]="scrollerOptions.columns"
                            [pTableBodyTemplate]="bodyTemplate"
                            [scrollerOptions]="scrollerOptions"
                        ></tbody>
                        <tbody *ngIf="scrollerOptions.spacerStyle" [style]="'height: calc(' + scrollerOptions.spacerStyle.height + ' - ' + scrollerOptions.rows.length * scrollerOptions.itemSize + 'px);'" class="p-datatable-scroller-spacer"></tbody>
                        <tfoot *ngIf="footerGroupedTemplate || footerTemplate" #tfoot class="p-datatable-tfoot">
                            <ng-container *ngTemplateOutlet="footerGroupedTemplate || footerTemplate; context: { $implicit: scrollerOptions.columns }"></ng-container>
                        </tfoot>
                    </table>
                </ng-template>
            </div>

            <p-paginator
                [rows]="rows"
                [first]="first"
                [totalRecords]="totalRecords"
                [pageLinkSize]="pageLinks"
                styleClass="p-paginator-bottom"
                [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions"
                *ngIf="paginator && (paginatorPosition === 'bottom' || paginatorPosition == 'both')"
                [templateLeft]="paginatorLeftTemplate"
                [templateRight]="paginatorRightTemplate"
                [dropdownAppendTo]="paginatorDropdownAppendTo"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight"
                [currentPageReportTemplate]="currentPageReportTemplate"
                [showFirstLastIcon]="showFirstLastIcon"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate"
                [showCurrentPageReport]="showCurrentPageReport"
                [showJumpToPageDropdown]="showJumpToPageDropdown"
                [showJumpToPageInput]="showJumpToPageInput"
                [showPageLinks]="showPageLinks"
            ></p-paginator>

            <div *ngIf="summaryTemplate" class="p-datatable-footer">
                <ng-container *ngTemplateOutlet="summaryTemplate"></ng-container>
            </div>

            <div #resizeHelper class="p-column-resizer-helper" style="display:none" *ngIf="resizableColumns"></div>
            <span #reorderIndicatorUp class="pi pi-arrow-down p-datatable-reorder-indicator-up" style="display: none;" *ngIf="reorderableColumns"></span>
            <span #reorderIndicatorDown class="pi pi-arrow-up p-datatable-reorder-indicator-down" style="display: none;" *ngIf="reorderableColumns"></span>
        </div>
    `, isInline: true, styles: [".p-datatable{position:relative}.p-datatable>.p-datatable-wrapper{overflow:auto}.p-datatable-table{border-spacing:0px;width:100%}.p-datatable .p-sortable-column{cursor:pointer;-webkit-user-select:none;user-select:none}.p-datatable .p-sortable-column .p-column-title,.p-datatable .p-sortable-column .p-sortable-column-icon,.p-datatable .p-sortable-column .p-sortable-column-badge{vertical-align:middle}.p-datatable .p-sortable-column .p-sortable-column-badge{display:inline-flex;align-items:center;justify-content:center}.p-datatable-hoverable-rows .p-selectable-row{cursor:pointer}.p-datatable-scrollable>.p-datatable-wrapper{position:relative}.p-datatable-scrollable-table>.p-datatable-thead{position:sticky;top:0;z-index:1}.p-datatable-scrollable-table>.p-datatable-frozen-tbody{position:sticky;z-index:1}.p-datatable-scrollable-table>.p-datatable-tfoot{position:sticky;bottom:0;z-index:1}.p-datatable-scrollable .p-frozen-column{position:sticky;background:inherit}.p-datatable-scrollable th.p-frozen-column{z-index:1}.p-datatable-flex-scrollable{display:flex;flex-direction:column;height:100%}.p-datatable-flex-scrollable>.p-datatable-wrapper{display:flex;flex-direction:column;flex:1;height:100%}.p-datatable-scrollable-table>.p-datatable-tbody>.p-rowgroup-header{position:sticky;z-index:1}.p-datatable-resizable-table>.p-datatable-thead>tr>th,.p-datatable-resizable-table>.p-datatable-tfoot>tr>td,.p-datatable-resizable-table>.p-datatable-tbody>tr>td{overflow:hidden;white-space:nowrap}.p-datatable-resizable-table>.p-datatable-thead>tr>th.p-resizable-column:not(.p-frozen-column){background-clip:padding-box;position:relative}.p-datatable-resizable-table-fit>.p-datatable-thead>tr>th.p-resizable-column:last-child .p-column-resizer{display:none}.p-datatable .p-column-resizer{display:block;position:absolute!important;top:0;right:0;margin:0;width:.5rem;height:100%;padding:0;cursor:col-resize;border:1px solid transparent}.p-datatable .p-column-resizer-helper{width:1px;position:absolute;z-index:10;display:none}.p-datatable .p-row-editor-init,.p-datatable .p-row-editor-save,.p-datatable .p-row-editor-cancel,.p-datatable .p-row-toggler{display:inline-flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-datatable-reorder-indicator-up,.p-datatable-reorder-indicator-down{position:absolute}.p-datatable-reorderablerow-handle,[pReorderableColumn]{cursor:move}.p-datatable .p-datatable-loading-overlay{position:absolute;display:flex;align-items:center;justify-content:center;z-index:2}.p-column-filter-row{display:flex;align-items:center;width:100%}.p-column-filter-menu{display:inline-flex}.p-column-filter-row p-columnfilterformelement{flex:1 1 auto;width:1%}.p-column-filter-menu-button,.p-column-filter-clear-button{display:inline-flex;justify-content:center;align-items:center;cursor:pointer;text-decoration:none;overflow:hidden;position:relative}.p-column-filter-overlay{position:absolute;top:0;left:0}.p-column-filter-row-items{margin:0;padding:0;list-style:none}.p-column-filter-row-item{cursor:pointer}.p-column-filter-add-button,.p-column-filter-remove-button{justify-content:center}.p-column-filter-add-button .p-button-label,.p-column-filter-remove-button .p-button-label{flex-grow:0}.p-column-filter-buttonbar{display:flex;align-items:center;justify-content:space-between}.p-column-filter-buttonbar .p-button{width:auto}.p-datatable-tbody>tr>td>.p-column-title{display:none}.p-datatable-scroller-spacer{display:flex}.p-datatable .p-scroller .p-scroller-loading{transform:none!important;min-height:0;position:sticky;top:0;left:0}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return i3.Paginator; }), selector: "p-paginator", inputs: ["pageLinkSize", "style", "styleClass", "alwaysShow", "templateLeft", "templateRight", "dropdownAppendTo", "dropdownScrollHeight", "currentPageReportTemplate", "showCurrentPageReport", "showFirstLastIcon", "totalRecords", "rows", "rowsPerPageOptions", "showJumpToPageDropdown", "showJumpToPageInput", "showPageLinks", "dropdownItemTemplate", "first"], outputs: ["onPageChange"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.PrimeTemplate; }), selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "component", type: i0.forwardRef(function () { return i4.Scroller; }), selector: "p-scroller", inputs: ["id", "style", "styleClass", "tabindex", "items", "itemSize", "scrollHeight", "scrollWidth", "orientation", "step", "delay", "resizeDelay", "appendOnly", "inline", "lazy", "disabled", "loaderDisabled", "columns", "showSpacer", "showLoader", "numToleratedItems", "loading", "autoSize", "trackBy", "options"], outputs: ["onLazyLoad", "onScroll", "onScrollIndexChange"] }, { kind: "component", type: i0.forwardRef(function () { return TableBody; }), selector: "[pTableBody]", inputs: ["pTableBody", "pTableBodyTemplate", "value", "frozen", "frozenRows", "scrollerOptions"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: Table, decorators: [{
            type: Component,
            args: [{ selector: 'p-table', template: `
        <div
            #container
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{ 'p-datatable p-component': true, 'p-datatable-hoverable-rows': rowHover || selectionMode, 'p-datatable-scrollable': scrollable, 'p-datatable-flex-scrollable': scrollable && scrollHeight === 'flex' }"
            [attr.id]="id"
        >
            <div class="p-datatable-loading-overlay p-component-overlay" *ngIf="loading && showLoader">
                <i [class]="'p-datatable-loading-icon pi-spin ' + loadingIcon"></i>
            </div>
            <div *ngIf="captionTemplate" class="p-datatable-header">
                <ng-container *ngTemplateOutlet="captionTemplate"></ng-container>
            </div>
            <p-paginator
                [rows]="rows"
                [first]="first"
                [totalRecords]="totalRecords"
                [pageLinkSize]="pageLinks"
                styleClass="p-paginator-top"
                [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions"
                *ngIf="paginator && (paginatorPosition === 'top' || paginatorPosition == 'both')"
                [templateLeft]="paginatorLeftTemplate"
                [templateRight]="paginatorRightTemplate"
                [dropdownAppendTo]="paginatorDropdownAppendTo"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight"
                [currentPageReportTemplate]="currentPageReportTemplate"
                [showFirstLastIcon]="showFirstLastIcon"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate"
                [showCurrentPageReport]="showCurrentPageReport"
                [showJumpToPageDropdown]="showJumpToPageDropdown"
                [showJumpToPageInput]="showJumpToPageInput"
                [showPageLinks]="showPageLinks"
            ></p-paginator>

            <div #wrapper class="p-datatable-wrapper" [ngStyle]="{ maxHeight: virtualScroll ? '' : scrollHeight }">
                <p-scroller
                    #scroller
                    *ngIf="virtualScroll"
                    [items]="processedData"
                    [columns]="columns"
                    [style]="{ height: scrollHeight !== 'flex' ? scrollHeight : undefined }"
                    [scrollHeight]="scrollHeight !== 'flex' ? undefined : '100%'"
                    [itemSize]="virtualScrollItemSize || _virtualRowHeight"
                    [step]="rows"
                    [delay]="lazy ? virtualScrollDelay : 0"
                    [inline]="true"
                    [lazy]="lazy"
                    (onLazyLoad)="onLazyItemLoad($event)"
                    [loaderDisabled]="true"
                    [showSpacer]="false"
                    [showLoader]="loadingBodyTemplate"
                    [options]="virtualScrollOptions"
                    [autoSize]="true"
                >
                    <ng-template pTemplate="content" let-items let-scrollerOptions="options">
                        <ng-container *ngTemplateOutlet="buildInTable; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                    </ng-template>
                </p-scroller>
                <ng-container *ngIf="!virtualScroll">
                    <ng-container *ngTemplateOutlet="buildInTable; context: { $implicit: processedData, options: { columns } }"></ng-container>
                </ng-container>

                <ng-template #buildInTable let-items let-scrollerOptions="options">
                    <table
                        #table
                        role="table"
                        [ngClass]="{ 'p-datatable-table': true, 'p-datatable-scrollable-table': scrollable, 'p-datatable-resizable-table': resizableColumns, 'p-datatable-resizable-table-fit': resizableColumns && columnResizeMode === 'fit' }"
                        [class]="tableStyleClass"
                        [style]="tableStyle"
                        [attr.id]="id + '-table'"
                    >
                        <ng-container *ngTemplateOutlet="colGroupTemplate; context: { $implicit: scrollerOptions.columns }"></ng-container>
                        <thead #thead class="p-datatable-thead">
                            <ng-container *ngTemplateOutlet="headerGroupedTemplate || headerTemplate; context: { $implicit: scrollerOptions.columns }"></ng-container>
                        </thead>
                        <tbody
                            class="p-datatable-tbody p-datatable-frozen-tbody"
                            *ngIf="frozenValue || frozenBodyTemplate"
                            [value]="frozenValue"
                            [frozenRows]="true"
                            [pTableBody]="scrollerOptions.columns"
                            [pTableBodyTemplate]="frozenBodyTemplate"
                            [frozen]="true"
                        ></tbody>
                        <tbody
                            class="p-datatable-tbody"
                            [ngClass]="scrollerOptions.contentStyleClass"
                            [style]="scrollerOptions.contentStyle"
                            [value]="dataToRender(scrollerOptions.rows)"
                            [pTableBody]="scrollerOptions.columns"
                            [pTableBodyTemplate]="bodyTemplate"
                            [scrollerOptions]="scrollerOptions"
                        ></tbody>
                        <tbody *ngIf="scrollerOptions.spacerStyle" [style]="'height: calc(' + scrollerOptions.spacerStyle.height + ' - ' + scrollerOptions.rows.length * scrollerOptions.itemSize + 'px);'" class="p-datatable-scroller-spacer"></tbody>
                        <tfoot *ngIf="footerGroupedTemplate || footerTemplate" #tfoot class="p-datatable-tfoot">
                            <ng-container *ngTemplateOutlet="footerGroupedTemplate || footerTemplate; context: { $implicit: scrollerOptions.columns }"></ng-container>
                        </tfoot>
                    </table>
                </ng-template>
            </div>

            <p-paginator
                [rows]="rows"
                [first]="first"
                [totalRecords]="totalRecords"
                [pageLinkSize]="pageLinks"
                styleClass="p-paginator-bottom"
                [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions"
                *ngIf="paginator && (paginatorPosition === 'bottom' || paginatorPosition == 'both')"
                [templateLeft]="paginatorLeftTemplate"
                [templateRight]="paginatorRightTemplate"
                [dropdownAppendTo]="paginatorDropdownAppendTo"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight"
                [currentPageReportTemplate]="currentPageReportTemplate"
                [showFirstLastIcon]="showFirstLastIcon"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate"
                [showCurrentPageReport]="showCurrentPageReport"
                [showJumpToPageDropdown]="showJumpToPageDropdown"
                [showJumpToPageInput]="showJumpToPageInput"
                [showPageLinks]="showPageLinks"
            ></p-paginator>

            <div *ngIf="summaryTemplate" class="p-datatable-footer">
                <ng-container *ngTemplateOutlet="summaryTemplate"></ng-container>
            </div>

            <div #resizeHelper class="p-column-resizer-helper" style="display:none" *ngIf="resizableColumns"></div>
            <span #reorderIndicatorUp class="pi pi-arrow-down p-datatable-reorder-indicator-up" style="display: none;" *ngIf="reorderableColumns"></span>
            <span #reorderIndicatorDown class="pi pi-arrow-up p-datatable-reorder-indicator-down" style="display: none;" *ngIf="reorderableColumns"></span>
        </div>
    `, providers: [TableService], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-datatable{position:relative}.p-datatable>.p-datatable-wrapper{overflow:auto}.p-datatable-table{border-spacing:0px;width:100%}.p-datatable .p-sortable-column{cursor:pointer;-webkit-user-select:none;user-select:none}.p-datatable .p-sortable-column .p-column-title,.p-datatable .p-sortable-column .p-sortable-column-icon,.p-datatable .p-sortable-column .p-sortable-column-badge{vertical-align:middle}.p-datatable .p-sortable-column .p-sortable-column-badge{display:inline-flex;align-items:center;justify-content:center}.p-datatable-hoverable-rows .p-selectable-row{cursor:pointer}.p-datatable-scrollable>.p-datatable-wrapper{position:relative}.p-datatable-scrollable-table>.p-datatable-thead{position:sticky;top:0;z-index:1}.p-datatable-scrollable-table>.p-datatable-frozen-tbody{position:sticky;z-index:1}.p-datatable-scrollable-table>.p-datatable-tfoot{position:sticky;bottom:0;z-index:1}.p-datatable-scrollable .p-frozen-column{position:sticky;background:inherit}.p-datatable-scrollable th.p-frozen-column{z-index:1}.p-datatable-flex-scrollable{display:flex;flex-direction:column;height:100%}.p-datatable-flex-scrollable>.p-datatable-wrapper{display:flex;flex-direction:column;flex:1;height:100%}.p-datatable-scrollable-table>.p-datatable-tbody>.p-rowgroup-header{position:sticky;z-index:1}.p-datatable-resizable-table>.p-datatable-thead>tr>th,.p-datatable-resizable-table>.p-datatable-tfoot>tr>td,.p-datatable-resizable-table>.p-datatable-tbody>tr>td{overflow:hidden;white-space:nowrap}.p-datatable-resizable-table>.p-datatable-thead>tr>th.p-resizable-column:not(.p-frozen-column){background-clip:padding-box;position:relative}.p-datatable-resizable-table-fit>.p-datatable-thead>tr>th.p-resizable-column:last-child .p-column-resizer{display:none}.p-datatable .p-column-resizer{display:block;position:absolute!important;top:0;right:0;margin:0;width:.5rem;height:100%;padding:0;cursor:col-resize;border:1px solid transparent}.p-datatable .p-column-resizer-helper{width:1px;position:absolute;z-index:10;display:none}.p-datatable .p-row-editor-init,.p-datatable .p-row-editor-save,.p-datatable .p-row-editor-cancel,.p-datatable .p-row-toggler{display:inline-flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-datatable-reorder-indicator-up,.p-datatable-reorder-indicator-down{position:absolute}.p-datatable-reorderablerow-handle,[pReorderableColumn]{cursor:move}.p-datatable .p-datatable-loading-overlay{position:absolute;display:flex;align-items:center;justify-content:center;z-index:2}.p-column-filter-row{display:flex;align-items:center;width:100%}.p-column-filter-menu{display:inline-flex}.p-column-filter-row p-columnfilterformelement{flex:1 1 auto;width:1%}.p-column-filter-menu-button,.p-column-filter-clear-button{display:inline-flex;justify-content:center;align-items:center;cursor:pointer;text-decoration:none;overflow:hidden;position:relative}.p-column-filter-overlay{position:absolute;top:0;left:0}.p-column-filter-row-items{margin:0;padding:0;list-style:none}.p-column-filter-row-item{cursor:pointer}.p-column-filter-add-button,.p-column-filter-remove-button{justify-content:center}.p-column-filter-add-button .p-button-label,.p-column-filter-remove-button .p-button-label{flex-grow:0}.p-column-filter-buttonbar{display:flex;align-items:center;justify-content:space-between}.p-column-filter-buttonbar .p-button{width:auto}.p-datatable-tbody>tr>td>.p-column-title{display:none}.p-datatable-scroller-spacer{display:flex}.p-datatable .p-scroller .p-scroller-loading{transform:none!important;min-height:0;position:sticky;top:0;left:0}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: TableService }, { type: i0.ChangeDetectorRef }, { type: i1.FilterService }, { type: i1.OverlayService }]; }, propDecorators: { frozenColumns: [{
                type: Input
            }], frozenValue: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], tableStyle: [{
                type: Input
            }], tableStyleClass: [{
                type: Input
            }], paginator: [{
                type: Input
            }], pageLinks: [{
                type: Input
            }], rowsPerPageOptions: [{
                type: Input
            }], alwaysShowPaginator: [{
                type: Input
            }], paginatorPosition: [{
                type: Input
            }], paginatorDropdownAppendTo: [{
                type: Input
            }], paginatorDropdownScrollHeight: [{
                type: Input
            }], currentPageReportTemplate: [{
                type: Input
            }], showCurrentPageReport: [{
                type: Input
            }], showJumpToPageDropdown: [{
                type: Input
            }], showJumpToPageInput: [{
                type: Input
            }], showFirstLastIcon: [{
                type: Input
            }], showPageLinks: [{
                type: Input
            }], defaultSortOrder: [{
                type: Input
            }], sortMode: [{
                type: Input
            }], resetPageOnSort: [{
                type: Input
            }], selectionMode: [{
                type: Input
            }], selectionPageOnly: [{
                type: Input
            }], selectAllChange: [{
                type: Output
            }], selectionChange: [{
                type: Output
            }], contextMenuSelection: [{
                type: Input
            }], contextMenuSelectionChange: [{
                type: Output
            }], contextMenuSelectionMode: [{
                type: Input
            }], dataKey: [{
                type: Input
            }], metaKeySelection: [{
                type: Input
            }], rowSelectable: [{
                type: Input
            }], rowTrackBy: [{
                type: Input
            }], lazy: [{
                type: Input
            }], lazyLoadOnInit: [{
                type: Input
            }], compareSelectionBy: [{
                type: Input
            }], csvSeparator: [{
                type: Input
            }], exportFilename: [{
                type: Input
            }], filters: [{
                type: Input
            }], globalFilterFields: [{
                type: Input
            }], filterDelay: [{
                type: Input
            }], filterLocale: [{
                type: Input
            }], expandedRowKeys: [{
                type: Input
            }], editingRowKeys: [{
                type: Input
            }], rowExpandMode: [{
                type: Input
            }], scrollable: [{
                type: Input
            }], scrollDirection: [{
                type: Input
            }], rowGroupMode: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], virtualScroll: [{
                type: Input
            }], virtualScrollItemSize: [{
                type: Input
            }], virtualScrollOptions: [{
                type: Input
            }], virtualScrollDelay: [{
                type: Input
            }], frozenWidth: [{
                type: Input
            }], responsive: [{
                type: Input
            }], contextMenu: [{
                type: Input
            }], resizableColumns: [{
                type: Input
            }], columnResizeMode: [{
                type: Input
            }], reorderableColumns: [{
                type: Input
            }], loading: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], showLoader: [{
                type: Input
            }], rowHover: [{
                type: Input
            }], customSort: [{
                type: Input
            }], showInitialSortBadge: [{
                type: Input
            }], autoLayout: [{
                type: Input
            }], exportFunction: [{
                type: Input
            }], exportHeader: [{
                type: Input
            }], stateKey: [{
                type: Input
            }], stateStorage: [{
                type: Input
            }], editMode: [{
                type: Input
            }], groupRowsBy: [{
                type: Input
            }], groupRowsByOrder: [{
                type: Input
            }], responsiveLayout: [{
                type: Input
            }], breakpoint: [{
                type: Input
            }], onRowSelect: [{
                type: Output
            }], onRowUnselect: [{
                type: Output
            }], onPage: [{
                type: Output
            }], onSort: [{
                type: Output
            }], onFilter: [{
                type: Output
            }], onLazyLoad: [{
                type: Output
            }], onRowExpand: [{
                type: Output
            }], onRowCollapse: [{
                type: Output
            }], onContextMenuSelect: [{
                type: Output
            }], onColResize: [{
                type: Output
            }], onColReorder: [{
                type: Output
            }], onRowReorder: [{
                type: Output
            }], onEditInit: [{
                type: Output
            }], onEditComplete: [{
                type: Output
            }], onEditCancel: [{
                type: Output
            }], onHeaderCheckboxToggle: [{
                type: Output
            }], sortFunction: [{
                type: Output
            }], firstChange: [{
                type: Output
            }], rowsChange: [{
                type: Output
            }], onStateSave: [{
                type: Output
            }], onStateRestore: [{
                type: Output
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }], resizeHelperViewChild: [{
                type: ViewChild,
                args: ['resizeHelper']
            }], reorderIndicatorUpViewChild: [{
                type: ViewChild,
                args: ['reorderIndicatorUp']
            }], reorderIndicatorDownViewChild: [{
                type: ViewChild,
                args: ['reorderIndicatorDown']
            }], wrapperViewChild: [{
                type: ViewChild,
                args: ['wrapper']
            }], tableViewChild: [{
                type: ViewChild,
                args: ['table']
            }], tableHeaderViewChild: [{
                type: ViewChild,
                args: ['thead']
            }], tableFooterViewChild: [{
                type: ViewChild,
                args: ['tfoot']
            }], scroller: [{
                type: ViewChild,
                args: ['scroller']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], virtualRowHeight: [{
                type: Input
            }], value: [{
                type: Input
            }], columns: [{
                type: Input
            }], first: [{
                type: Input
            }], rows: [{
                type: Input
            }], totalRecords: [{
                type: Input
            }], sortField: [{
                type: Input
            }], sortOrder: [{
                type: Input
            }], multiSortMeta: [{
                type: Input
            }], selection: [{
                type: Input
            }], selectAll: [{
                type: Input
            }] } });
export class TableBody {
    constructor(dt, tableService, cd, el) {
        this.dt = dt;
        this.tableService = tableService;
        this.cd = cd;
        this.el = el;
        this.subscription = this.dt.tableService.valueSource$.subscribe(() => {
            if (this.dt.virtualScroll) {
                this.cd.detectChanges();
            }
        });
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
        if (this.frozenRows) {
            this.updateFrozenRowStickyPosition();
        }
        if (this.dt.scrollable && this.dt.rowGroupMode === 'subheader') {
            this.updateFrozenRowGroupHeaderStickyPosition();
        }
    }
    ngAfterViewInit() {
        if (this.frozenRows) {
            this.updateFrozenRowStickyPosition();
        }
        if (this.dt.scrollable && this.dt.rowGroupMode === 'subheader') {
            this.updateFrozenRowGroupHeaderStickyPosition();
        }
    }
    shouldRenderRowGroupHeader(value, rowData, i) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dt.groupRowsBy);
        let prevRowData = value[i - 1];
        if (prevRowData) {
            let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.dt.groupRowsBy);
            return currentRowFieldData !== previousRowFieldData;
        }
        else {
            return true;
        }
    }
    shouldRenderRowGroupFooter(value, rowData, i) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dt.groupRowsBy);
        let nextRowData = value[i + 1];
        if (nextRowData) {
            let nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.dt.groupRowsBy);
            return currentRowFieldData !== nextRowFieldData;
        }
        else {
            return true;
        }
    }
    shouldRenderRowspan(value, rowData, i) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dt.groupRowsBy);
        let prevRowData = value[i - 1];
        if (prevRowData) {
            let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.dt.groupRowsBy);
            return currentRowFieldData !== previousRowFieldData;
        }
        else {
            return true;
        }
    }
    calculateRowGroupSize(value, rowData, index) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dt.groupRowsBy);
        let nextRowFieldData = currentRowFieldData;
        let groupRowSpan = 0;
        while (currentRowFieldData === nextRowFieldData) {
            groupRowSpan++;
            let nextRowData = value[++index];
            if (nextRowData) {
                nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.dt.groupRowsBy);
            }
            else {
                break;
            }
        }
        return groupRowSpan === 1 ? null : groupRowSpan;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    updateFrozenRowStickyPosition() {
        this.el.nativeElement.style.top = DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling) + 'px';
    }
    updateFrozenRowGroupHeaderStickyPosition() {
        if (this.el.nativeElement.previousElementSibling) {
            let tableHeaderHeight = DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling);
            this.dt.rowGroupHeaderStyleObject.top = tableHeaderHeight + 'px';
        }
    }
    getScrollerOption(option, options) {
        if (this.dt.virtualScroll) {
            options = options || this.scrollerOptions;
            return options ? options[option] : null;
        }
        return null;
    }
    getRowIndex(rowIndex) {
        const index = this.dt.paginator ? this.dt.first + rowIndex : rowIndex;
        const getItemOptions = this.getScrollerOption('getItemOptions');
        return getItemOptions ? getItemOptions(index).index : index;
    }
}
TableBody.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableBody, deps: [{ token: Table }, { token: TableService }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
TableBody.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: TableBody, selector: "[pTableBody]", inputs: { columns: ["pTableBody", "columns"], template: ["pTableBodyTemplate", "template"], value: "value", frozen: "frozen", frozenRows: "frozenRows", scrollerOptions: "scrollerOptions" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <ng-container *ngIf="!dt.expandedRowTemplate">
            <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="value" [ngForTrackBy]="dt.rowTrackBy">
                <ng-container *ngIf="dt.groupHeaderTemplate && !dt.virtualScroll && dt.rowGroupMode === 'subheader' && shouldRenderRowGroupHeader(value, rowData, rowIndex)" role="row">
                    <ng-container
                        *ngTemplateOutlet="dt.groupHeaderTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.rowGroupMode !== 'rowspan'">
                    <ng-container
                        *ngTemplateOutlet="rowData ? template : dt.loadingBodyTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.rowGroupMode === 'rowspan'">
                    <ng-container
                        *ngTemplateOutlet="
                            rowData ? template : dt.loadingBodyTemplate;
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns,
                                editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                                frozen: frozen,
                                rowgroup: shouldRenderRowspan(value, rowData, rowIndex),
                                rowspan: calculateRowGroupSize(value, rowData, rowIndex)
                            }
                        "
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.groupFooterTemplate && !dt.virtualScroll && dt.rowGroupMode === 'subheader' && shouldRenderRowGroupFooter(value, rowData, rowIndex)" role="row">
                    <ng-container
                        *ngTemplateOutlet="dt.groupFooterTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                    ></ng-container>
                </ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="dt.expandedRowTemplate && !(frozen && dt.frozenExpandedRowTemplate)">
            <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="value" [ngForTrackBy]="dt.rowTrackBy">
                <ng-container *ngIf="!dt.groupHeaderTemplate">
                    <ng-container
                        *ngTemplateOutlet="template; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, expanded: dt.isRowExpanded(rowData), editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.groupHeaderTemplate && dt.rowGroupMode === 'subheader' && shouldRenderRowGroupHeader(value, rowData, getRowIndex(rowIndex))" role="row">
                    <ng-container
                        *ngTemplateOutlet="
                            dt.groupHeaderTemplate;
                            context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, expanded: dt.isRowExpanded(rowData), editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }
                        "
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.isRowExpanded(rowData)">
                    <ng-container *ngTemplateOutlet="dt.expandedRowTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, frozen: frozen }"></ng-container>
                    <ng-container *ngIf="dt.groupFooterTemplate && dt.rowGroupMode === 'subheader' && shouldRenderRowGroupFooter(value, rowData, getRowIndex(rowIndex))" role="row">
                        <ng-container
                            *ngTemplateOutlet="
                                dt.groupFooterTemplate;
                                context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, expanded: dt.isRowExpanded(rowData), editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }
                            "
                        ></ng-container>
                    </ng-container>
                </ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="dt.frozenExpandedRowTemplate && frozen">
            <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="value" [ngForTrackBy]="dt.rowTrackBy">
                <ng-container
                    *ngTemplateOutlet="template; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, expanded: dt.isRowExpanded(rowData), editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                ></ng-container>
                <ng-container *ngIf="dt.isRowExpanded(rowData)">
                    <ng-container *ngTemplateOutlet="dt.frozenExpandedRowTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, frozen: frozen }"></ng-container>
                </ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="dt.loading">
            <ng-container *ngTemplateOutlet="dt.loadingBodyTemplate; context: { $implicit: columns, frozen: frozen }"></ng-container>
        </ng-container>
        <ng-container *ngIf="dt.isEmpty() && !dt.loading">
            <ng-container *ngTemplateOutlet="dt.emptyMessageTemplate; context: { $implicit: columns, frozen: frozen }"></ng-container>
        </ng-container>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableBody, decorators: [{
            type: Component,
            args: [{
                    selector: '[pTableBody]',
                    template: `
        <ng-container *ngIf="!dt.expandedRowTemplate">
            <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="value" [ngForTrackBy]="dt.rowTrackBy">
                <ng-container *ngIf="dt.groupHeaderTemplate && !dt.virtualScroll && dt.rowGroupMode === 'subheader' && shouldRenderRowGroupHeader(value, rowData, rowIndex)" role="row">
                    <ng-container
                        *ngTemplateOutlet="dt.groupHeaderTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.rowGroupMode !== 'rowspan'">
                    <ng-container
                        *ngTemplateOutlet="rowData ? template : dt.loadingBodyTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.rowGroupMode === 'rowspan'">
                    <ng-container
                        *ngTemplateOutlet="
                            rowData ? template : dt.loadingBodyTemplate;
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns,
                                editing: dt.editMode === 'row' && dt.isRowEditing(rowData),
                                frozen: frozen,
                                rowgroup: shouldRenderRowspan(value, rowData, rowIndex),
                                rowspan: calculateRowGroupSize(value, rowData, rowIndex)
                            }
                        "
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.groupFooterTemplate && !dt.virtualScroll && dt.rowGroupMode === 'subheader' && shouldRenderRowGroupFooter(value, rowData, rowIndex)" role="row">
                    <ng-container
                        *ngTemplateOutlet="dt.groupFooterTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                    ></ng-container>
                </ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="dt.expandedRowTemplate && !(frozen && dt.frozenExpandedRowTemplate)">
            <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="value" [ngForTrackBy]="dt.rowTrackBy">
                <ng-container *ngIf="!dt.groupHeaderTemplate">
                    <ng-container
                        *ngTemplateOutlet="template; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, expanded: dt.isRowExpanded(rowData), editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.groupHeaderTemplate && dt.rowGroupMode === 'subheader' && shouldRenderRowGroupHeader(value, rowData, getRowIndex(rowIndex))" role="row">
                    <ng-container
                        *ngTemplateOutlet="
                            dt.groupHeaderTemplate;
                            context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, expanded: dt.isRowExpanded(rowData), editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }
                        "
                    ></ng-container>
                </ng-container>
                <ng-container *ngIf="dt.isRowExpanded(rowData)">
                    <ng-container *ngTemplateOutlet="dt.expandedRowTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, frozen: frozen }"></ng-container>
                    <ng-container *ngIf="dt.groupFooterTemplate && dt.rowGroupMode === 'subheader' && shouldRenderRowGroupFooter(value, rowData, getRowIndex(rowIndex))" role="row">
                        <ng-container
                            *ngTemplateOutlet="
                                dt.groupFooterTemplate;
                                context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, expanded: dt.isRowExpanded(rowData), editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }
                            "
                        ></ng-container>
                    </ng-container>
                </ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="dt.frozenExpandedRowTemplate && frozen">
            <ng-template ngFor let-rowData let-rowIndex="index" [ngForOf]="value" [ngForTrackBy]="dt.rowTrackBy">
                <ng-container
                    *ngTemplateOutlet="template; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, expanded: dt.isRowExpanded(rowData), editing: dt.editMode === 'row' && dt.isRowEditing(rowData), frozen: frozen }"
                ></ng-container>
                <ng-container *ngIf="dt.isRowExpanded(rowData)">
                    <ng-container *ngTemplateOutlet="dt.frozenExpandedRowTemplate; context: { $implicit: rowData, rowIndex: getRowIndex(rowIndex), columns: columns, frozen: frozen }"></ng-container>
                </ng-container>
            </ng-template>
        </ng-container>
        <ng-container *ngIf="dt.loading">
            <ng-container *ngTemplateOutlet="dt.loadingBodyTemplate; context: { $implicit: columns, frozen: frozen }"></ng-container>
        </ng-container>
        <ng-container *ngIf="dt.isEmpty() && !dt.loading">
            <ng-container *ngTemplateOutlet="dt.emptyMessageTemplate; context: { $implicit: columns, frozen: frozen }"></ng-container>
        </ng-container>
    `,
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: TableService }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { columns: [{
                type: Input,
                args: ['pTableBody']
            }], template: [{
                type: Input,
                args: ['pTableBodyTemplate']
            }], value: [{
                type: Input
            }], frozen: [{
                type: Input
            }], frozenRows: [{
                type: Input
            }], scrollerOptions: [{
                type: Input
            }] } });
export class RowGroupHeader {
    constructor(dt) {
        this.dt = dt;
    }
    get getFrozenRowGroupHeaderStickyPosition() {
        return this.dt.rowGroupHeaderStyleObject ? this.dt.rowGroupHeaderStyleObject.top : '';
    }
}
RowGroupHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: RowGroupHeader, deps: [{ token: Table }], target: i0.ɵɵFactoryTarget.Directive });
RowGroupHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: RowGroupHeader, selector: "[pRowGroupHeader]", host: { properties: { "style.top": "getFrozenRowGroupHeaderStickyPosition" }, classAttribute: "p-rowgroup-header p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: RowGroupHeader, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pRowGroupHeader]',
                    host: {
                        class: 'p-rowgroup-header p-element',
                        '[style.top]': 'getFrozenRowGroupHeaderStickyPosition'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }]; } });
export class FrozenColumn {
    constructor(el) {
        this.el = el;
        this.alignFrozen = 'left';
        this._frozen = true;
    }
    get frozen() {
        return this._frozen;
    }
    set frozen(val) {
        this._frozen = val;
        this.updateStickyPosition();
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.updateStickyPosition();
        }, 1000);
    }
    updateStickyPosition() {
        if (this._frozen) {
            if (this.alignFrozen === 'right') {
                let right = 0;
                let next = this.el.nativeElement.nextElementSibling;
                if (next) {
                    right = DomHandler.getOuterWidth(next) + (parseFloat(next.style.right) || 0);
                }
                this.el.nativeElement.style.right = right + 'px';
            }
            else {
                let left = 0;
                let prev = this.el.nativeElement.previousElementSibling;
                if (prev) {
                    left = DomHandler.getOuterWidth(prev) + (parseFloat(prev.style.left) || 0);
                }
                this.el.nativeElement.style.left = left + 'px';
            }
            let filterRow = this.el.nativeElement.parentElement.nextElementSibling;
            if (filterRow) {
                let index = DomHandler.index(this.el.nativeElement);
                if (filterRow.children && filterRow.children[index]) {
                    filterRow.children[index].style.left = this.el.nativeElement.style.left;
                    filterRow.children[index].style.right = this.el.nativeElement.style.right;
                }
            }
        }
    }
}
FrozenColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: FrozenColumn, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
FrozenColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: FrozenColumn, selector: "[pFrozenColumn]", inputs: { frozen: "frozen", alignFrozen: "alignFrozen" }, host: { properties: { "class.p-frozen-column": "frozen" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: FrozenColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pFrozenColumn]',
                    host: {
                        class: 'p-element',
                        '[class.p-frozen-column]': 'frozen'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { frozen: [{
                type: Input
            }], alignFrozen: [{
                type: Input
            }] } });
export class SortableColumn {
    constructor(dt) {
        this.dt = dt;
        if (this.isEnabled()) {
            this.subscription = this.dt.tableService.sortSource$.subscribe((sortMeta) => {
                this.updateSortState();
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.updateSortState();
        }
    }
    updateSortState() {
        this.sorted = this.dt.isSorted(this.field);
        this.sortOrder = this.sorted ? (this.dt.sortOrder === 1 ? 'ascending' : 'descending') : 'none';
    }
    onClick(event) {
        if (this.isEnabled() && !this.isFilterElement(event.target)) {
            this.updateSortState();
            this.dt.sort({
                originalEvent: event,
                field: this.field
            });
            DomHandler.clearSelection();
        }
    }
    onEnterKey(event) {
        this.onClick(event);
    }
    isEnabled() {
        return this.pSortableColumnDisabled !== true;
    }
    isFilterElement(element) {
        return DomHandler.hasClass(element, 'pi-filter-icon') || DomHandler.hasClass(element, 'p-column-filter-menu-button');
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SortableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SortableColumn, deps: [{ token: Table }], target: i0.ɵɵFactoryTarget.Directive });
SortableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: SortableColumn, selector: "[pSortableColumn]", inputs: { field: ["pSortableColumn", "field"], pSortableColumnDisabled: "pSortableColumnDisabled" }, host: { listeners: { "click": "onClick($event)", "keydown.enter": "onEnterKey($event)" }, properties: { "class.p-sortable-column": "isEnabled()", "class.p-highlight": "sorted", "attr.tabindex": "isEnabled() ? \"0\" : null", "attr.role": "\"columnheader\"", "attr.aria-sort": "sortOrder" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SortableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pSortableColumn]',
                    host: {
                        class: 'p-element',
                        '[class.p-sortable-column]': 'isEnabled()',
                        '[class.p-highlight]': 'sorted',
                        '[attr.tabindex]': 'isEnabled() ? "0" : null',
                        '[attr.role]': '"columnheader"',
                        '[attr.aria-sort]': 'sortOrder'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }]; }, propDecorators: { field: [{
                type: Input,
                args: ['pSortableColumn']
            }], pSortableColumnDisabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onEnterKey: [{
                type: HostListener,
                args: ['keydown.enter', ['$event']]
            }] } });
export class SortIcon {
    constructor(dt, cd) {
        this.dt = dt;
        this.cd = cd;
        this.subscription = this.dt.tableService.sortSource$.subscribe((sortMeta) => {
            this.updateSortState();
        });
    }
    ngOnInit() {
        this.updateSortState();
    }
    onClick(event) {
        event.preventDefault();
    }
    updateSortState() {
        if (this.dt.sortMode === 'single') {
            this.sortOrder = this.dt.isSorted(this.field) ? this.dt.sortOrder : 0;
        }
        else if (this.dt.sortMode === 'multiple') {
            let sortMeta = this.dt.getSortMeta(this.field);
            this.sortOrder = sortMeta ? sortMeta.order : 0;
        }
        this.cd.markForCheck();
    }
    getMultiSortMetaIndex() {
        let multiSortMeta = this.dt._multiSortMeta;
        let index = -1;
        if (multiSortMeta && this.dt.sortMode === 'multiple' && (this.dt.showInitialSortBadge || multiSortMeta.length > 1)) {
            for (let i = 0; i < multiSortMeta.length; i++) {
                let meta = multiSortMeta[i];
                if (meta.field === this.field || meta.field === this.field) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    getBadgeValue() {
        let index = this.getMultiSortMetaIndex();
        return this.dt.groupRowsBy && index > -1 ? index : index + 1;
    }
    isMultiSorted() {
        return this.dt.sortMode === 'multiple' && this.getMultiSortMetaIndex() > -1;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SortIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SortIcon, deps: [{ token: Table }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
SortIcon.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: SortIcon, selector: "p-sortIcon", inputs: { field: "field" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <i class="p-sortable-column-icon pi pi-fw" [ngClass]="{ 'pi-sort-amount-up-alt': sortOrder === 1, 'pi-sort-amount-down': sortOrder === -1, 'pi-sort-alt': sortOrder === 0 }"></i>
        <span *ngIf="isMultiSorted()" class="p-sortable-column-badge">{{ getBadgeValue() }}</span>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SortIcon, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-sortIcon',
                    template: `
        <i class="p-sortable-column-icon pi pi-fw" [ngClass]="{ 'pi-sort-amount-up-alt': sortOrder === 1, 'pi-sort-amount-down': sortOrder === -1, 'pi-sort-alt': sortOrder === 0 }"></i>
        <span *ngIf="isMultiSorted()" class="p-sortable-column-badge">{{ getBadgeValue() }}</span>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { field: [{
                type: Input
            }] } });
export class SelectableRow {
    constructor(dt, tableService) {
        this.dt = dt;
        this.tableService = tableService;
        if (this.isEnabled()) {
            this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
                this.selected = this.dt.isSelected(this.data);
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.selected = this.dt.isSelected(this.data);
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.dt.handleRowClick({
                originalEvent: event,
                rowData: this.data,
                rowIndex: this.index
            });
        }
    }
    onTouchEnd(event) {
        if (this.isEnabled()) {
            this.dt.handleRowTouchEnd(event);
        }
    }
    onArrowDownKeyDown(event) {
        if (!this.isEnabled()) {
            return;
        }
        const row = event.currentTarget;
        const nextRow = this.findNextSelectableRow(row);
        if (nextRow) {
            nextRow.focus();
        }
        event.preventDefault();
    }
    onArrowUpKeyDown(event) {
        if (!this.isEnabled()) {
            return;
        }
        const row = event.currentTarget;
        const prevRow = this.findPrevSelectableRow(row);
        if (prevRow) {
            prevRow.focus();
        }
        event.preventDefault();
    }
    onEnterKeyDown(event) {
        if (!this.isEnabled()) {
            return;
        }
        this.dt.handleRowClick({
            originalEvent: event,
            rowData: this.data,
            rowIndex: this.index
        });
    }
    onPageDownKeyDown() {
        if (this.dt.virtualScroll) {
            this.dt.scroller.elementViewChild.nativeElement.focus();
        }
    }
    onSpaceKeydown() {
        if (this.dt.virtualScroll && !this.dt.editingCell) {
            this.dt.scroller.elementViewChild.nativeElement.focus();
        }
    }
    findNextSelectableRow(row) {
        let nextRow = row.nextElementSibling;
        if (nextRow) {
            if (DomHandler.hasClass(nextRow, 'p-selectable-row'))
                return nextRow;
            else
                return this.findNextSelectableRow(nextRow);
        }
        else {
            return null;
        }
    }
    findPrevSelectableRow(row) {
        let prevRow = row.previousElementSibling;
        if (prevRow) {
            if (DomHandler.hasClass(prevRow, 'p-selectable-row'))
                return prevRow;
            else
                return this.findPrevSelectableRow(prevRow);
        }
        else {
            return null;
        }
    }
    isEnabled() {
        return this.pSelectableRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SelectableRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SelectableRow, deps: [{ token: Table }, { token: TableService }], target: i0.ɵɵFactoryTarget.Directive });
SelectableRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: SelectableRow, selector: "[pSelectableRow]", inputs: { data: ["pSelectableRow", "data"], index: ["pSelectableRowIndex", "index"], pSelectableRowDisabled: "pSelectableRowDisabled" }, host: { listeners: { "click": "onClick($event)", "touchend": "onTouchEnd($event)", "keydown.arrowdown": "onArrowDownKeyDown($event)", "keydown.arrowup": "onArrowUpKeyDown($event)", "keydown.enter": "onEnterKeyDown($event)", "keydown.shift.enter": "onEnterKeyDown($event)", "keydown.meta.enter": "onEnterKeyDown($event)", "keydown.pagedown": "onPageDownKeyDown()", "keydown.pageup": "onPageDownKeyDown()", "keydown.home": "onPageDownKeyDown()", "keydown.end": "onPageDownKeyDown()", "keydown.space": "onSpaceKeydown()" }, properties: { "class.p-selectable-row": "isEnabled()", "class.p-highlight": "selected", "attr.tabindex": "isEnabled() ? 0 : undefined" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SelectableRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pSelectableRow]',
                    host: {
                        class: 'p-element',
                        '[class.p-selectable-row]': 'isEnabled()',
                        '[class.p-highlight]': 'selected',
                        '[attr.tabindex]': 'isEnabled() ? 0 : undefined'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: TableService }]; }, propDecorators: { data: [{
                type: Input,
                args: ['pSelectableRow']
            }], index: [{
                type: Input,
                args: ['pSelectableRowIndex']
            }], pSelectableRowDisabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onTouchEnd: [{
                type: HostListener,
                args: ['touchend', ['$event']]
            }], onArrowDownKeyDown: [{
                type: HostListener,
                args: ['keydown.arrowdown', ['$event']]
            }], onArrowUpKeyDown: [{
                type: HostListener,
                args: ['keydown.arrowup', ['$event']]
            }], onEnterKeyDown: [{
                type: HostListener,
                args: ['keydown.enter', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.shift.enter', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.meta.enter', ['$event']]
            }], onPageDownKeyDown: [{
                type: HostListener,
                args: ['keydown.pagedown']
            }, {
                type: HostListener,
                args: ['keydown.pageup']
            }, {
                type: HostListener,
                args: ['keydown.home']
            }, {
                type: HostListener,
                args: ['keydown.end']
            }], onSpaceKeydown: [{
                type: HostListener,
                args: ['keydown.space']
            }] } });
export class SelectableRowDblClick {
    constructor(dt, tableService) {
        this.dt = dt;
        this.tableService = tableService;
        if (this.isEnabled()) {
            this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
                this.selected = this.dt.isSelected(this.data);
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.selected = this.dt.isSelected(this.data);
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.dt.handleRowClick({
                originalEvent: event,
                rowData: this.data,
                rowIndex: this.index
            });
        }
    }
    isEnabled() {
        return this.pSelectableRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SelectableRowDblClick.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SelectableRowDblClick, deps: [{ token: Table }, { token: TableService }], target: i0.ɵɵFactoryTarget.Directive });
SelectableRowDblClick.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: SelectableRowDblClick, selector: "[pSelectableRowDblClick]", inputs: { data: ["pSelectableRowDblClick", "data"], index: ["pSelectableRowIndex", "index"], pSelectableRowDisabled: "pSelectableRowDisabled" }, host: { listeners: { "dblclick": "onClick($event)" }, properties: { "class.p-selectable-row": "isEnabled()", "class.p-highlight": "selected" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SelectableRowDblClick, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pSelectableRowDblClick]',
                    host: {
                        class: 'p-element',
                        '[class.p-selectable-row]': 'isEnabled()',
                        '[class.p-highlight]': 'selected'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: TableService }]; }, propDecorators: { data: [{
                type: Input,
                args: ['pSelectableRowDblClick']
            }], index: [{
                type: Input,
                args: ['pSelectableRowIndex']
            }], pSelectableRowDisabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['dblclick', ['$event']]
            }] } });
export class ContextMenuRow {
    constructor(dt, tableService, el) {
        this.dt = dt;
        this.tableService = tableService;
        this.el = el;
        if (this.isEnabled()) {
            this.subscription = this.dt.tableService.contextMenuSource$.subscribe((data) => {
                this.selected = this.dt.equals(this.data, data);
            });
        }
    }
    onContextMenu(event) {
        if (this.isEnabled()) {
            this.dt.handleRowRightClick({
                originalEvent: event,
                rowData: this.data,
                rowIndex: this.index
            });
            this.el.nativeElement.focus();
            event.preventDefault();
        }
    }
    isEnabled() {
        return this.pContextMenuRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
ContextMenuRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ContextMenuRow, deps: [{ token: Table }, { token: TableService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ContextMenuRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: ContextMenuRow, selector: "[pContextMenuRow]", inputs: { data: ["pContextMenuRow", "data"], index: ["pContextMenuRowIndex", "index"], pContextMenuRowDisabled: "pContextMenuRowDisabled" }, host: { listeners: { "contextmenu": "onContextMenu($event)" }, properties: { "class.p-highlight-contextmenu": "selected", "attr.tabindex": "isEnabled() ? 0 : undefined" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ContextMenuRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pContextMenuRow]',
                    host: {
                        class: 'p-element',
                        '[class.p-highlight-contextmenu]': 'selected',
                        '[attr.tabindex]': 'isEnabled() ? 0 : undefined'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: TableService }, { type: i0.ElementRef }]; }, propDecorators: { data: [{
                type: Input,
                args: ['pContextMenuRow']
            }], index: [{
                type: Input,
                args: ['pContextMenuRowIndex']
            }], pContextMenuRowDisabled: [{
                type: Input
            }], onContextMenu: [{
                type: HostListener,
                args: ['contextmenu', ['$event']]
            }] } });
export class RowToggler {
    constructor(dt) {
        this.dt = dt;
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.dt.toggleRow(this.data, event);
            event.preventDefault();
        }
    }
    isEnabled() {
        return this.pRowTogglerDisabled !== true;
    }
}
RowToggler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: RowToggler, deps: [{ token: Table }], target: i0.ɵɵFactoryTarget.Directive });
RowToggler.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: RowToggler, selector: "[pRowToggler]", inputs: { data: ["pRowToggler", "data"], pRowTogglerDisabled: "pRowTogglerDisabled" }, host: { listeners: { "click": "onClick($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: RowToggler, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pRowToggler]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }]; }, propDecorators: { data: [{
                type: Input,
                args: ['pRowToggler']
            }], pRowTogglerDisabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
export class ResizableColumn {
    constructor(document, platformId, renderer, dt, el, zone) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.dt = dt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isEnabled()) {
                DomHandler.addClass(this.el.nativeElement, 'p-resizable-column');
                this.resizer = this.renderer.createElement('span');
                this.renderer.addClass(this.resizer, 'p-column-resizer');
                this.renderer.appendChild(this.el.nativeElement, this.resizer);
                this.zone.runOutsideAngular(() => {
                    this.resizerMouseDownListener = this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown.bind(this));
                });
            }
        }
    }
    bindDocumentEvents() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(this.document, 'mousemove', this.onDocumentMouseMove.bind(this));
            this.documentMouseUpListener = this.renderer.listen(this.document, 'mouseup', this.onDocumentMouseUp.bind(this));
        });
    }
    unbindDocumentEvents() {
        if (this.documentMouseMoveListener) {
            this.documentMouseMoveListener();
            this.documentMouseMoveListener = null;
        }
        if (this.documentMouseUpListener) {
            this.documentMouseUpListener();
            this.documentMouseUpListener = null;
        }
    }
    onMouseDown(event) {
        if (event.which === 1) {
            this.dt.onColumnResizeBegin(event);
            this.bindDocumentEvents();
        }
    }
    onDocumentMouseMove(event) {
        this.dt.onColumnResize(event);
    }
    onDocumentMouseUp(event) {
        this.dt.onColumnResizeEnd();
        this.unbindDocumentEvents();
    }
    isEnabled() {
        return this.pResizableColumnDisabled !== true;
    }
    ngOnDestroy() {
        if (this.resizerMouseDownListener) {
            this.resizerMouseDownListener();
            this.resizerMouseDownListener = null;
        }
        this.unbindDocumentEvents();
    }
}
ResizableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ResizableColumn, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: Table }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
ResizableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: ResizableColumn, selector: "[pResizableColumn]", inputs: { pResizableColumnDisabled: "pResizableColumnDisabled" }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ResizableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pResizableColumn]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: Table }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { pResizableColumnDisabled: [{
                type: Input
            }] } });
export class ReorderableColumn {
    constructor(platformId, renderer, dt, el, zone) {
        this.platformId = platformId;
        this.renderer = renderer;
        this.dt = dt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            this.bindEvents();
        }
    }
    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));
                this.dragStartListener = this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this));
                this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragOver.bind(this));
                this.dragEnterListener = this.renderer.listen(this.el.nativeElement, 'dragenter', this.onDragEnter.bind(this));
                this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
            });
        }
    }
    unbindEvents() {
        if (this.mouseDownListener) {
            this.mouseDownListener();
            this.mouseDownListener = null;
        }
        if (this.dragStartListener) {
            this.dragStartListener();
            this.dragStartListener = null;
        }
        if (this.dragOverListener) {
            this.dragOverListener();
            this.dragOverListener = null;
        }
        if (this.dragEnterListener) {
            this.dragEnterListener();
            this.dragEnterListener = null;
        }
        if (this.dragLeaveListener) {
            this.dragLeaveListener();
            this.dragLeaveListener = null;
        }
    }
    onMouseDown(event) {
        if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA' || DomHandler.hasClass(event.target, 'p-column-resizer'))
            this.el.nativeElement.draggable = false;
        else
            this.el.nativeElement.draggable = true;
    }
    onDragStart(event) {
        this.dt.onColumnDragStart(event, this.el.nativeElement);
    }
    onDragOver(event) {
        event.preventDefault();
    }
    onDragEnter(event) {
        this.dt.onColumnDragEnter(event, this.el.nativeElement);
    }
    onDragLeave(event) {
        this.dt.onColumnDragLeave(event);
    }
    onDrop(event) {
        if (this.isEnabled()) {
            this.dt.onColumnDrop(event, this.el.nativeElement);
        }
    }
    isEnabled() {
        return this.pReorderableColumnDisabled !== true;
    }
    ngOnDestroy() {
        this.unbindEvents();
    }
}
ReorderableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ReorderableColumn, deps: [{ token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: Table }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
ReorderableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: ReorderableColumn, selector: "[pReorderableColumn]", inputs: { pReorderableColumnDisabled: "pReorderableColumnDisabled" }, host: { listeners: { "drop": "onDrop($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ReorderableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pReorderableColumn]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: Table }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { pReorderableColumnDisabled: [{
                type: Input
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });
export class EditableColumn {
    constructor(dt, el, zone) {
        this.dt = dt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            DomHandler.addClass(this.el.nativeElement, 'p-editable-column');
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.dt.selfClick = true;
            if (this.dt.editingCell) {
                if (this.dt.editingCell !== this.el.nativeElement) {
                    if (!this.dt.isEditingCellValid()) {
                        return;
                    }
                    this.closeEditingCell(true, event);
                    this.openCell();
                }
            }
            else {
                this.openCell();
            }
        }
    }
    openCell() {
        this.dt.updateEditingCell(this.el.nativeElement, this.data, this.field, this.rowIndex);
        DomHandler.addClass(this.el.nativeElement, 'p-cell-editing');
        this.dt.onEditInit.emit({ field: this.field, data: this.data, index: this.rowIndex });
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let focusCellSelector = this.pFocusCellSelector || 'input, textarea, select';
                let focusableElement = DomHandler.findSingle(this.el.nativeElement, focusCellSelector);
                if (focusableElement) {
                    focusableElement.focus();
                }
            }, 50);
        });
        this.overlayEventListener = (e) => {
            if (this.el && this.el.nativeElement.contains(e.target)) {
                this.dt.selfClick = true;
            }
        };
        this.dt.overlaySubscription = this.dt.overlayService.clickObservable.subscribe(this.overlayEventListener);
    }
    closeEditingCell(completed, event) {
        const eventData = { field: this.dt.editingCellField, data: this.dt.editingCellData, originalEvent: event, index: this.dt.editingCellRowIndex };
        if (completed) {
            this.dt.onEditComplete.emit(eventData);
        }
        else {
            this.dt.onEditCancel.emit(eventData);
            this.dt.value.forEach((element) => {
                if (element[this.dt.editingCellField] === this.data) {
                    element[this.dt.editingCellField] = this.dt.editingCellData;
                }
            });
        }
        DomHandler.removeClass(this.dt.editingCell, 'p-cell-editing');
        this.dt.editingCell = null;
        this.dt.editingCellData = null;
        this.dt.editingCellField = null;
        this.dt.unbindDocumentEditListener();
        if (this.dt.overlaySubscription) {
            this.dt.overlaySubscription.unsubscribe();
        }
    }
    onEnterKeyDown(event) {
        if (this.isEnabled()) {
            if (this.dt.isEditingCellValid()) {
                this.closeEditingCell(true, event);
            }
            event.preventDefault();
        }
    }
    onTabKeyDown(event) {
        if (this.isEnabled()) {
            if (this.dt.isEditingCellValid()) {
                this.closeEditingCell(true, event);
            }
            event.preventDefault();
        }
    }
    onEscapeKeyDown(event) {
        if (this.isEnabled()) {
            if (this.dt.isEditingCellValid()) {
                this.closeEditingCell(false, event);
            }
            event.preventDefault();
        }
    }
    onShiftKeyDown(event) {
        if (this.isEnabled()) {
            if (event.shiftKey)
                this.moveToPreviousCell(event);
            else {
                this.moveToNextCell(event);
            }
        }
    }
    onArrowDown(event) {
        if (this.isEnabled()) {
            let currentCell = this.findCell(event.target);
            if (currentCell) {
                let cellIndex = DomHandler.index(currentCell);
                let targetCell = this.findNextEditableColumnByIndex(currentCell, cellIndex);
                if (targetCell) {
                    if (this.dt.isEditingCellValid()) {
                        this.closeEditingCell(true, event);
                    }
                    DomHandler.invokeElementMethod(event.target, 'blur');
                    DomHandler.invokeElementMethod(targetCell, 'click');
                }
                event.preventDefault();
            }
        }
    }
    onArrowUp(event) {
        if (this.isEnabled()) {
            let currentCell = this.findCell(event.target);
            if (currentCell) {
                let cellIndex = DomHandler.index(currentCell);
                let targetCell = this.findPrevEditableColumnByIndex(currentCell, cellIndex);
                if (targetCell) {
                    if (this.dt.isEditingCellValid()) {
                        this.closeEditingCell(true, event);
                    }
                    DomHandler.invokeElementMethod(event.target, 'blur');
                    DomHandler.invokeElementMethod(targetCell, 'click');
                }
                event.preventDefault();
            }
        }
    }
    onArrowLeft(event) {
        if (this.isEnabled()) {
            this.moveToPreviousCell(event);
        }
    }
    onArrowRight(event) {
        if (this.isEnabled()) {
            this.moveToNextCell(event);
        }
    }
    findCell(element) {
        if (element) {
            let cell = element;
            while (cell && !DomHandler.hasClass(cell, 'p-cell-editing')) {
                cell = cell.parentElement;
            }
            return cell;
        }
        else {
            return null;
        }
    }
    moveToPreviousCell(event) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findPreviousEditableColumn(currentCell);
            if (targetCell) {
                if (this.dt.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }
                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            }
        }
    }
    moveToNextCell(event) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findNextEditableColumn(currentCell);
            if (targetCell) {
                if (this.dt.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }
                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            }
        }
    }
    findPreviousEditableColumn(cell) {
        let prevCell = cell.previousElementSibling;
        if (!prevCell) {
            let previousRow = cell.parentElement.previousElementSibling;
            if (previousRow) {
                prevCell = previousRow.lastElementChild;
            }
        }
        if (prevCell) {
            if (DomHandler.hasClass(prevCell, 'p-editable-column'))
                return prevCell;
            else
                return this.findPreviousEditableColumn(prevCell);
        }
        else {
            return null;
        }
    }
    findNextEditableColumn(cell) {
        let nextCell = cell.nextElementSibling;
        if (!nextCell) {
            let nextRow = cell.parentElement.nextElementSibling;
            if (nextRow) {
                nextCell = nextRow.firstElementChild;
            }
        }
        if (nextCell) {
            if (DomHandler.hasClass(nextCell, 'p-editable-column'))
                return nextCell;
            else
                return this.findNextEditableColumn(nextCell);
        }
        else {
            return null;
        }
    }
    findNextEditableColumnByIndex(cell, index) {
        let nextRow = cell.parentElement.nextElementSibling;
        if (nextRow) {
            let nextCell = nextRow.children[index];
            if (nextCell && DomHandler.hasClass(nextCell, 'p-editable-column')) {
                return nextCell;
            }
            return null;
        }
        else {
            return null;
        }
    }
    findPrevEditableColumnByIndex(cell, index) {
        let prevRow = cell.parentElement.previousElementSibling;
        if (prevRow) {
            let prevCell = prevRow.children[index];
            if (prevCell && DomHandler.hasClass(prevCell, 'p-editable-column')) {
                return prevCell;
            }
            return null;
        }
        else {
            return null;
        }
    }
    isEnabled() {
        return this.pEditableColumnDisabled !== true;
    }
    ngOnDestroy() {
        if (this.dt.overlaySubscription) {
            this.dt.overlaySubscription.unsubscribe();
        }
    }
}
EditableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: EditableColumn, deps: [{ token: Table }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
EditableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: EditableColumn, selector: "[pEditableColumn]", inputs: { data: ["pEditableColumn", "data"], field: ["pEditableColumnField", "field"], rowIndex: ["pEditableColumnRowIndex", "rowIndex"], pEditableColumnDisabled: "pEditableColumnDisabled", pFocusCellSelector: "pFocusCellSelector" }, host: { listeners: { "click": "onClick($event)", "keydown.enter": "onEnterKeyDown($event)", "keydown.tab": "onShiftKeyDown($event)", "keydown.escape": "onEscapeKeyDown($event)", "keydown.shift.tab": "onShiftKeyDown($event)", "keydown.meta.tab": "onShiftKeyDown($event)", "keydown.arrowdown": "onArrowDown($event)", "keydown.arrowup": "onArrowUp($event)", "keydown.arrowleft": "onArrowLeft($event)", "keydown.arrowright": "onArrowRight($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: EditableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pEditableColumn]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { data: [{
                type: Input,
                args: ['pEditableColumn']
            }], field: [{
                type: Input,
                args: ['pEditableColumnField']
            }], rowIndex: [{
                type: Input,
                args: ['pEditableColumnRowIndex']
            }], pEditableColumnDisabled: [{
                type: Input
            }], pFocusCellSelector: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onEnterKeyDown: [{
                type: HostListener,
                args: ['keydown.enter', ['$event']]
            }], onTabKeyDown: [{
                type: HostListener,
                args: ['keydown.tab', ['$event']]
            }], onEscapeKeyDown: [{
                type: HostListener,
                args: ['keydown.escape', ['$event']]
            }], onShiftKeyDown: [{
                type: HostListener,
                args: ['keydown.tab', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.shift.tab', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.meta.tab', ['$event']]
            }], onArrowDown: [{
                type: HostListener,
                args: ['keydown.arrowdown', ['$event']]
            }], onArrowUp: [{
                type: HostListener,
                args: ['keydown.arrowup', ['$event']]
            }], onArrowLeft: [{
                type: HostListener,
                args: ['keydown.arrowleft', ['$event']]
            }], onArrowRight: [{
                type: HostListener,
                args: ['keydown.arrowright', ['$event']]
            }] } });
export class EditableRow {
    constructor(el) {
        this.el = el;
    }
    isEnabled() {
        return this.pEditableRowDisabled !== true;
    }
}
EditableRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: EditableRow, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
EditableRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: EditableRow, selector: "[pEditableRow]", inputs: { data: ["pEditableRow", "data"], pEditableRowDisabled: "pEditableRowDisabled" }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: EditableRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pEditableRow]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { data: [{
                type: Input,
                args: ['pEditableRow']
            }], pEditableRowDisabled: [{
                type: Input
            }] } });
export class InitEditableRow {
    constructor(dt, editableRow) {
        this.dt = dt;
        this.editableRow = editableRow;
    }
    onClick(event) {
        this.dt.initRowEdit(this.editableRow.data);
        event.preventDefault();
    }
}
InitEditableRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: InitEditableRow, deps: [{ token: Table }, { token: EditableRow }], target: i0.ɵɵFactoryTarget.Directive });
InitEditableRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: InitEditableRow, selector: "[pInitEditableRow]", host: { listeners: { "click": "onClick($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: InitEditableRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pInitEditableRow]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: EditableRow }]; }, propDecorators: { onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
export class SaveEditableRow {
    constructor(dt, editableRow) {
        this.dt = dt;
        this.editableRow = editableRow;
    }
    onClick(event) {
        this.dt.saveRowEdit(this.editableRow.data, this.editableRow.el.nativeElement);
        event.preventDefault();
    }
}
SaveEditableRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SaveEditableRow, deps: [{ token: Table }, { token: EditableRow }], target: i0.ɵɵFactoryTarget.Directive });
SaveEditableRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: SaveEditableRow, selector: "[pSaveEditableRow]", host: { listeners: { "click": "onClick($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: SaveEditableRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pSaveEditableRow]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: EditableRow }]; }, propDecorators: { onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
export class CancelEditableRow {
    constructor(dt, editableRow) {
        this.dt = dt;
        this.editableRow = editableRow;
    }
    onClick(event) {
        this.dt.cancelRowEdit(this.editableRow.data);
        event.preventDefault();
    }
}
CancelEditableRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: CancelEditableRow, deps: [{ token: Table }, { token: EditableRow }], target: i0.ɵɵFactoryTarget.Directive });
CancelEditableRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: CancelEditableRow, selector: "[pCancelEditableRow]", host: { listeners: { "click": "onClick($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: CancelEditableRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pCancelEditableRow]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: EditableRow }]; }, propDecorators: { onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
export class CellEditor {
    constructor(dt, editableColumn, editableRow) {
        this.dt = dt;
        this.editableColumn = editableColumn;
        this.editableRow = editableRow;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'input':
                    this.inputTemplate = item.template;
                    break;
                case 'output':
                    this.outputTemplate = item.template;
                    break;
            }
        });
    }
    get editing() {
        return (this.dt.editingCell && this.editableColumn && this.dt.editingCell === this.editableColumn.el.nativeElement) || (this.editableRow && this.dt.editMode === 'row' && this.dt.isRowEditing(this.editableRow.data));
    }
}
CellEditor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: CellEditor, deps: [{ token: Table }, { token: EditableColumn, optional: true }, { token: EditableRow, optional: true }], target: i0.ɵɵFactoryTarget.Component });
CellEditor.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: CellEditor, selector: "p-cellEditor", host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <ng-container *ngIf="editing">
            <ng-container *ngTemplateOutlet="inputTemplate"></ng-container>
        </ng-container>
        <ng-container *ngIf="!editing">
            <ng-container *ngTemplateOutlet="outputTemplate"></ng-container>
        </ng-container>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: CellEditor, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-cellEditor',
                    template: `
        <ng-container *ngIf="editing">
            <ng-container *ngTemplateOutlet="inputTemplate"></ng-container>
        </ng-container>
        <ng-container *ngIf="!editing">
            <ng-container *ngTemplateOutlet="outputTemplate"></ng-container>
        </ng-container>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: EditableColumn, decorators: [{
                    type: Optional
                }] }, { type: EditableRow, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class TableRadioButton {
    constructor(dt, cd) {
        this.dt = dt;
        this.cd = cd;
        this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.dt.isSelected(this.value);
            this.cd.markForCheck();
        });
    }
    ngOnInit() {
        this.checked = this.dt.isSelected(this.value);
    }
    onClick(event) {
        if (!this.disabled) {
            this.dt.toggleRowWithRadio({
                originalEvent: event,
                rowIndex: this.index
            }, this.value);
            this.inputViewChild.nativeElement?.focus();
        }
        DomHandler.clearSelection();
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TableRadioButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableRadioButton, deps: [{ token: Table }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TableRadioButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: TableRadioButton, selector: "p-tableRadioButton", inputs: { disabled: "disabled", value: "value", index: "index", inputId: "inputId", name: "name", ariaLabel: "ariaLabel" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "inputViewChild", first: true, predicate: ["rb"], descendants: true }], ngImport: i0, template: `
        <div class="p-radiobutton p-component" [ngClass]="{ 'p-radiobutton-focused': focused, 'p-radiobutton-checked': checked, 'p-radiobutton-disabled': disabled }" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input #rb type="radio" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="disabled" [attr.aria-label]="ariaLabel" />
            </div>
            <div #box [ngClass]="{ 'p-radiobutton-box p-component': true, 'p-highlight': checked, 'p-focus': focused, 'p-disabled': disabled }" role="radio" [attr.aria-checked]="checked">
                <div class="p-radiobutton-icon"></div>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableRadioButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-tableRadioButton',
                    template: `
        <div class="p-radiobutton p-component" [ngClass]="{ 'p-radiobutton-focused': focused, 'p-radiobutton-checked': checked, 'p-radiobutton-disabled': disabled }" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input #rb type="radio" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="disabled" [attr.aria-label]="ariaLabel" />
            </div>
            <div #box [ngClass]="{ 'p-radiobutton-box p-component': true, 'p-highlight': checked, 'p-focus': focused, 'p-disabled': disabled }" role="radio" [attr.aria-checked]="checked">
                <div class="p-radiobutton-icon"></div>
            </div>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], value: [{
                type: Input
            }], index: [{
                type: Input
            }], inputId: [{
                type: Input
            }], name: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], inputViewChild: [{
                type: ViewChild,
                args: ['rb']
            }] } });
export class TableCheckbox {
    constructor(dt, tableService, cd) {
        this.dt = dt;
        this.tableService = tableService;
        this.cd = cd;
        this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.dt.isSelected(this.value);
            this.cd.markForCheck();
        });
    }
    ngOnInit() {
        this.checked = this.dt.isSelected(this.value);
    }
    onClick(event) {
        if (!this.disabled) {
            this.dt.toggleRowWithCheckbox({
                originalEvent: event,
                rowIndex: this.index
            }, this.value);
        }
        DomHandler.clearSelection();
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TableCheckbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableCheckbox, deps: [{ token: Table }, { token: TableService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TableCheckbox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: TableCheckbox, selector: "p-tableCheckbox", inputs: { disabled: "disabled", value: "value", index: "index", inputId: "inputId", name: "name", required: "required", ariaLabel: "ariaLabel" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div class="p-checkbox p-component" [ngClass]="{ 'p-checkbox-focused': focused, 'p-checkbox-disabled': disabled }" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input type="checkbox" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="disabled" [attr.required]="required" [attr.aria-label]="ariaLabel" />
            </div>
            <div #box [ngClass]="{ 'p-checkbox-box p-component': true, 'p-highlight': checked, 'p-focus': focused, 'p-disabled': disabled }" role="checkbox" [attr.aria-checked]="checked">
                <span class="p-checkbox-icon" [ngClass]="{ 'pi pi-check': checked }"></span>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableCheckbox, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-tableCheckbox',
                    template: `
        <div class="p-checkbox p-component" [ngClass]="{ 'p-checkbox-focused': focused, 'p-checkbox-disabled': disabled }" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input type="checkbox" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="disabled" [attr.required]="required" [attr.aria-label]="ariaLabel" />
            </div>
            <div #box [ngClass]="{ 'p-checkbox-box p-component': true, 'p-highlight': checked, 'p-focus': focused, 'p-disabled': disabled }" role="checkbox" [attr.aria-checked]="checked">
                <span class="p-checkbox-icon" [ngClass]="{ 'pi pi-check': checked }"></span>
            </div>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: TableService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], value: [{
                type: Input
            }], index: [{
                type: Input
            }], inputId: [{
                type: Input
            }], name: [{
                type: Input
            }], required: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }] } });
export class TableHeaderCheckbox {
    constructor(dt, tableService, cd) {
        this.dt = dt;
        this.tableService = tableService;
        this.cd = cd;
        this.valueChangeSubscription = this.dt.tableService.valueSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });
        this.selectionChangeSubscription = this.dt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });
    }
    ngOnInit() {
        this.checked = this.updateCheckedState();
    }
    onClick(event) {
        if (!this.disabled) {
            if (this.dt.value && this.dt.value.length > 0) {
                this.dt.toggleRowsWithCheckbox(event, !this.checked);
            }
        }
        DomHandler.clearSelection();
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
    }
    isDisabled() {
        return this.disabled || !this.dt.value || !this.dt.value.length;
    }
    ngOnDestroy() {
        if (this.selectionChangeSubscription) {
            this.selectionChangeSubscription.unsubscribe();
        }
        if (this.valueChangeSubscription) {
            this.valueChangeSubscription.unsubscribe();
        }
    }
    updateCheckedState() {
        this.cd.markForCheck();
        if (this.dt._selectAll !== null) {
            return this.dt._selectAll;
        }
        else {
            const data = this.dt.selectionPageOnly ? this.dt.dataToRender(this.dt.processedData) : this.dt.processedData;
            const val = this.dt.frozenValue ? [...this.dt.frozenValue, ...data] : data;
            const selectableVal = this.dt.rowSelectable ? val.filter((data, index) => this.dt.rowSelectable({ data, index })) : val;
            return ObjectUtils.isNotEmpty(selectableVal) && ObjectUtils.isNotEmpty(this.dt.selection) && selectableVal.every((v) => this.dt.selection.some((s) => this.dt.equals(v, s)));
        }
    }
}
TableHeaderCheckbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableHeaderCheckbox, deps: [{ token: Table }, { token: TableService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TableHeaderCheckbox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: TableHeaderCheckbox, selector: "p-tableHeaderCheckbox", inputs: { disabled: "disabled", inputId: "inputId", name: "name", ariaLabel: "ariaLabel" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div class="p-checkbox p-component" [ngClass]="{ 'p-checkbox-focused': focused, 'p-checkbox-disabled': isDisabled() }" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input #cb type="checkbox" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="isDisabled()" [attr.aria-label]="ariaLabel" />
            </div>
            <div #box [ngClass]="{ 'p-checkbox-box': true, 'p-highlight': checked, 'p-focus': focused, 'p-disabled': isDisabled() }" role="checkbox" [attr.aria-checked]="checked">
                <span class="p-checkbox-icon" [ngClass]="{ 'pi pi-check': checked }"></span>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableHeaderCheckbox, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-tableHeaderCheckbox',
                    template: `
        <div class="p-checkbox p-component" [ngClass]="{ 'p-checkbox-focused': focused, 'p-checkbox-disabled': isDisabled() }" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input #cb type="checkbox" [attr.id]="inputId" [attr.name]="name" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="isDisabled()" [attr.aria-label]="ariaLabel" />
            </div>
            <div #box [ngClass]="{ 'p-checkbox-box': true, 'p-highlight': checked, 'p-focus': focused, 'p-disabled': isDisabled() }" role="checkbox" [attr.aria-checked]="checked">
                <span class="p-checkbox-icon" [ngClass]="{ 'pi pi-check': checked }"></span>
            </div>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: TableService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], inputId: [{
                type: Input
            }], name: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }] } });
export class ReorderableRowHandle {
    constructor(el) {
        this.el = el;
    }
    ngAfterViewInit() {
        DomHandler.addClass(this.el.nativeElement, 'p-datatable-reorderablerow-handle');
    }
}
ReorderableRowHandle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ReorderableRowHandle, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ReorderableRowHandle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: ReorderableRowHandle, selector: "[pReorderableRowHandle]", host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ReorderableRowHandle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pReorderableRowHandle]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });
export class ReorderableRow {
    constructor(renderer, dt, el, zone) {
        this.renderer = renderer;
        this.dt = dt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            this.el.nativeElement.droppable = true;
            this.bindEvents();
        }
    }
    bindEvents() {
        this.zone.runOutsideAngular(() => {
            this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));
            this.dragStartListener = this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this));
            this.dragEndListener = this.renderer.listen(this.el.nativeElement, 'dragend', this.onDragEnd.bind(this));
            this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragOver.bind(this));
            this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
        });
    }
    unbindEvents() {
        if (this.mouseDownListener) {
            this.mouseDownListener();
            this.mouseDownListener = null;
        }
        if (this.dragStartListener) {
            this.dragStartListener();
            this.dragStartListener = null;
        }
        if (this.dragEndListener) {
            this.dragEndListener();
            this.dragEndListener = null;
        }
        if (this.dragOverListener) {
            this.dragOverListener();
            this.dragOverListener = null;
        }
        if (this.dragLeaveListener) {
            this.dragLeaveListener();
            this.dragLeaveListener = null;
        }
    }
    onMouseDown(event) {
        if (DomHandler.hasClass(event.target, 'p-datatable-reorderablerow-handle'))
            this.el.nativeElement.draggable = true;
        else
            this.el.nativeElement.draggable = false;
    }
    onDragStart(event) {
        this.dt.onRowDragStart(event, this.index);
    }
    onDragEnd(event) {
        this.dt.onRowDragEnd(event);
        this.el.nativeElement.draggable = false;
    }
    onDragOver(event) {
        this.dt.onRowDragOver(event, this.index, this.el.nativeElement);
        event.preventDefault();
    }
    onDragLeave(event) {
        this.dt.onRowDragLeave(event, this.el.nativeElement);
    }
    isEnabled() {
        return this.pReorderableRowDisabled !== true;
    }
    onDrop(event) {
        if (this.isEnabled() && this.dt.rowDragging) {
            this.dt.onRowDrop(event, this.el.nativeElement);
        }
        event.preventDefault();
    }
    ngOnDestroy() {
        this.unbindEvents();
    }
}
ReorderableRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ReorderableRow, deps: [{ token: i0.Renderer2 }, { token: Table }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
ReorderableRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: ReorderableRow, selector: "[pReorderableRow]", inputs: { index: ["pReorderableRow", "index"], pReorderableRowDisabled: "pReorderableRowDisabled" }, host: { listeners: { "drop": "onDrop($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ReorderableRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pReorderableRow]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: Table }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { index: [{
                type: Input,
                args: ['pReorderableRow']
            }], pReorderableRowDisabled: [{
                type: Input
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });
export class ColumnFilter {
    constructor(document, el, dt, renderer, config, overlayService) {
        this.document = document;
        this.el = el;
        this.dt = dt;
        this.renderer = renderer;
        this.config = config;
        this.overlayService = overlayService;
        this.type = 'text';
        this.display = 'row';
        this.showMenu = true;
        this.operator = FilterOperator.AND;
        this.showOperator = true;
        this.showClearButton = true;
        this.showApplyButton = true;
        this.showMatchModes = true;
        this.showAddButton = true;
        this.hideOnClear = false;
        this.maxConstraints = 2;
        this.useGrouping = true;
        this.showButtons = true;
        this.window = this.document.defaultView;
    }
    ngOnInit() {
        if (!this.dt.filters[this.field]) {
            this.initFieldFilterConstraint();
        }
        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.generateMatchModeOptions();
            this.generateOperatorOptions();
        });
        this.resetSubscription = this.dt.tableService.resetSource$.subscribe(() => {
            this.initFieldFilterConstraint();
        });
        this.generateMatchModeOptions();
        this.generateOperatorOptions();
    }
    generateMatchModeOptions() {
        this.matchModes =
            this.matchModeOptions ||
                this.config.filterMatchModeOptions[this.type]?.map((key) => {
                    return { label: this.config.getTranslation(key), value: key };
                });
    }
    generateOperatorOptions() {
        this.operatorOptions = [
            { label: this.config.getTranslation(TranslationKeys.MATCH_ALL), value: FilterOperator.AND },
            { label: this.config.getTranslation(TranslationKeys.MATCH_ANY), value: FilterOperator.OR }
        ];
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'filter':
                    this.filterTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                default:
                    this.filterTemplate = item.template;
                    break;
            }
        });
    }
    initFieldFilterConstraint() {
        let defaultMatchMode = this.getDefaultMatchMode();
        this.dt.filters[this.field] = this.display == 'row' ? { value: null, matchMode: defaultMatchMode } : [{ value: null, matchMode: defaultMatchMode, operator: this.operator }];
    }
    onMenuMatchModeChange(value, filterMeta) {
        filterMeta.matchMode = value;
        if (!this.showApplyButton) {
            this.dt._filter();
        }
    }
    onRowMatchModeChange(matchMode) {
        this.dt.filters[this.field].matchMode = matchMode;
        this.dt._filter();
        this.hide();
    }
    onRowMatchModeKeyDown(event) {
        let item = event.target;
        switch (event.key) {
            case 'ArrowDown':
                var nextItem = this.findNextItem(item);
                if (nextItem) {
                    item.removeAttribute('tabindex');
                    nextItem.tabIndex = '0';
                    nextItem.focus();
                }
                event.preventDefault();
                break;
            case 'ArrowUp':
                var prevItem = this.findPrevItem(item);
                if (prevItem) {
                    item.removeAttribute('tabindex');
                    prevItem.tabIndex = '0';
                    prevItem.focus();
                }
                event.preventDefault();
                break;
        }
    }
    onRowClearItemClick() {
        this.clearFilter();
        this.hide();
    }
    isRowMatchModeSelected(matchMode) {
        return this.dt.filters[this.field].matchMode === matchMode;
    }
    addConstraint() {
        this.dt.filters[this.field].push({ value: null, matchMode: this.getDefaultMatchMode(), operator: this.getDefaultOperator() });
    }
    removeConstraint(filterMeta) {
        this.dt.filters[this.field] = this.dt.filters[this.field].filter((meta) => meta !== filterMeta);
        this.dt._filter();
    }
    onOperatorChange(value) {
        this.dt.filters[this.field].forEach((filterMeta) => {
            filterMeta.operator = value;
            this.operator = value;
        });
        if (!this.showApplyButton) {
            this.dt._filter();
        }
    }
    toggleMenu() {
        this.overlayVisible = !this.overlayVisible;
    }
    onToggleButtonKeyDown(event) {
        switch (event.key) {
            case 'Escape':
            case 'Tab':
                this.overlayVisible = false;
                break;
            case 'ArrowDown':
                if (this.overlayVisible) {
                    let focusable = DomHandler.getFocusableElements(this.overlay);
                    if (focusable) {
                        focusable[0].focus();
                    }
                    event.preventDefault();
                }
                else if (event.altKey) {
                    this.overlayVisible = true;
                    event.preventDefault();
                }
                break;
        }
    }
    onEscape() {
        this.overlayVisible = false;
        this.icon.nativeElement.focus();
    }
    findNextItem(item) {
        let nextItem = item.nextElementSibling;
        if (nextItem)
            return DomHandler.hasClass(nextItem, 'p-column-filter-separator') ? this.findNextItem(nextItem) : nextItem;
        else
            return item.parentElement.firstElementChild;
    }
    findPrevItem(item) {
        let prevItem = item.previousElementSibling;
        if (prevItem)
            return DomHandler.hasClass(prevItem, 'p-column-filter-separator') ? this.findPrevItem(prevItem) : prevItem;
        else
            return item.parentElement.lastElementChild;
    }
    onContentClick() {
        this.selfClick = true;
    }
    onOverlayAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.overlay = event.element;
                this.renderer.appendChild(this.document.body, this.overlay);
                ZIndexUtils.set('overlay', this.overlay, this.config.zIndex.overlay);
                DomHandler.absolutePosition(this.overlay, this.icon.nativeElement);
                this.bindDocumentClickListener();
                this.bindDocumentResizeListener();
                this.bindScrollListener();
                this.overlayEventListener = (e) => {
                    if (this.overlay && this.overlay.contains(e.target)) {
                        this.selfClick = true;
                    }
                };
                this.overlaySubscription = this.overlayService.clickObservable.subscribe(this.overlayEventListener);
                break;
            case 'void':
                this.onOverlayHide();
                if (this.overlaySubscription) {
                    this.overlaySubscription.unsubscribe();
                }
                break;
        }
    }
    onOverlayAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                ZIndexUtils.clear(event.element);
                break;
        }
    }
    getDefaultMatchMode() {
        if (this.matchMode) {
            return this.matchMode;
        }
        else {
            if (this.type === 'text')
                return FilterMatchMode.STARTS_WITH;
            else if (this.type === 'numeric')
                return FilterMatchMode.EQUALS;
            else if (this.type === 'date')
                return FilterMatchMode.DATE_IS;
            else
                return FilterMatchMode.CONTAINS;
        }
    }
    getDefaultOperator() {
        return this.dt.filters ? this.dt.filters[this.field][0].operator : this.operator;
    }
    hasRowFilter() {
        return this.dt.filters[this.field] && !this.dt.isFilterBlank(this.dt.filters[this.field].value);
    }
    get fieldConstraints() {
        return this.dt.filters ? this.dt.filters[this.field] : null;
    }
    get showRemoveIcon() {
        return this.fieldConstraints ? this.fieldConstraints.length > 1 : false;
    }
    get showMenuButton() {
        return this.showMenu && (this.display === 'row' ? this.type !== 'boolean' : true);
    }
    get isShowOperator() {
        return this.showOperator && this.type !== 'boolean';
    }
    get isShowAddConstraint() {
        return this.showAddButton && this.type !== 'boolean' && this.fieldConstraints && this.fieldConstraints.length < this.maxConstraints;
    }
    get applyButtonLabel() {
        return this.config.getTranslation(TranslationKeys.APPLY);
    }
    get clearButtonLabel() {
        return this.config.getTranslation(TranslationKeys.CLEAR);
    }
    get addRuleButtonLabel() {
        return this.config.getTranslation(TranslationKeys.ADD_RULE);
    }
    get removeRuleButtonLabel() {
        return this.config.getTranslation(TranslationKeys.REMOVE_RULE);
    }
    get noFilterLabel() {
        return this.config.getTranslation(TranslationKeys.NO_FILTER);
    }
    hasFilter() {
        let fieldFilter = this.dt.filters[this.field];
        if (fieldFilter) {
            if (Array.isArray(fieldFilter))
                return !this.dt.isFilterBlank(fieldFilter[0].value);
            else
                return !this.dt.isFilterBlank(fieldFilter.value);
        }
        return false;
    }
    isOutsideClicked(event) {
        return !(this.overlay.isSameNode(event.target) ||
            this.overlay.contains(event.target) ||
            this.icon.nativeElement.isSameNode(event.target) ||
            this.icon.nativeElement.contains(event.target) ||
            DomHandler.hasClass(event.target, 'p-column-filter-add-button') ||
            DomHandler.hasClass(event.target.parentElement, 'p-column-filter-add-button') ||
            DomHandler.hasClass(event.target, 'p-column-filter-remove-button') ||
            DomHandler.hasClass(event.target.parentElement, 'p-column-filter-remove-button'));
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
                if (this.overlayVisible && !this.selfClick && this.isOutsideClicked(event)) {
                    this.hide();
                }
                this.selfClick = false;
            });
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
            this.selfClick = false;
        }
    }
    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen(this.window, 'resize', (event) => {
                if (this.overlayVisible && !DomHandler.isTouchDevice()) {
                    this.hide();
                }
            });
        }
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.icon.nativeElement, () => {
                if (this.overlayVisible) {
                    this.hide();
                }
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    hide() {
        this.overlayVisible = false;
    }
    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.overlay = null;
    }
    clearFilter() {
        this.initFieldFilterConstraint();
        this.dt._filter();
        if (this.hideOnClear)
            this.hide();
    }
    applyFilter() {
        this.dt._filter();
        this.hide();
    }
    ngOnDestroy() {
        if (this.overlay) {
            this.renderer.appendChild(this.el.nativeElement, this.overlay);
            ZIndexUtils.clear(this.overlay);
            this.onOverlayHide();
        }
        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
        if (this.resetSubscription) {
            this.resetSubscription.unsubscribe();
        }
        if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
        }
    }
}
ColumnFilter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ColumnFilter, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: Table }, { token: i0.Renderer2 }, { token: i1.PrimeNGConfig }, { token: i1.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
ColumnFilter.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: ColumnFilter, selector: "p-columnFilter", inputs: { field: "field", type: "type", display: "display", showMenu: "showMenu", matchMode: "matchMode", operator: "operator", showOperator: "showOperator", showClearButton: "showClearButton", showApplyButton: "showApplyButton", showMatchModes: "showMatchModes", showAddButton: "showAddButton", hideOnClear: "hideOnClear", placeholder: "placeholder", matchModeOptions: "matchModeOptions", maxConstraints: "maxConstraints", minFractionDigits: "minFractionDigits", maxFractionDigits: "maxFractionDigits", prefix: "prefix", suffix: "suffix", locale: "locale", localeMatcher: "localeMatcher", currency: "currency", currencyDisplay: "currencyDisplay", useGrouping: "useGrouping", showButtons: "showButtons" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "icon", first: true, predicate: ["icon"], descendants: true }], ngImport: i0, template: `
        <div class="p-column-filter" [ngClass]="{ 'p-column-filter-row': display === 'row', 'p-column-filter-menu': display === 'menu' }">
            <p-columnFilterFormElement
                *ngIf="display === 'row'"
                class="p-fluid"
                [type]="type"
                [field]="field"
                [filterConstraint]="dt.filters[field]"
                [filterTemplate]="filterTemplate"
                [placeholder]="placeholder"
                [minFractionDigits]="minFractionDigits"
                [maxFractionDigits]="maxFractionDigits"
                [prefix]="prefix"
                [suffix]="suffix"
                [locale]="locale"
                [localeMatcher]="localeMatcher"
                [currency]="currency"
                [currencyDisplay]="currencyDisplay"
                [useGrouping]="useGrouping"
                [showButtons]="showButtons"
            ></p-columnFilterFormElement>
            <button
                #icon
                *ngIf="showMenuButton"
                type="button"
                class="p-column-filter-menu-button p-link"
                aria-haspopup="true"
                [attr.aria-expanded]="overlayVisible"
                [ngClass]="{ 'p-column-filter-menu-button-open': overlayVisible, 'p-column-filter-menu-button-active': hasFilter() }"
                (click)="toggleMenu()"
                (keydown)="onToggleButtonKeyDown($event)"
            >
                <span class="pi pi-filter-icon pi-filter"></span>
            </button>
            <button #icon *ngIf="showClearButton && display === 'row'" [ngClass]="{ 'p-hidden-space': !hasRowFilter() }" type="button" class="p-column-filter-clear-button p-link" (click)="clearFilter()">
                <span class="pi pi-filter-slash"></span>
            </button>
            <div
                *ngIf="showMenu && overlayVisible"
                [ngClass]="{ 'p-column-filter-overlay p-component p-fluid': true, 'p-column-filter-overlay-menu': display === 'menu' }"
                (click)="onContentClick()"
                [@overlayAnimation]="'visible'"
                (@overlayAnimation.start)="onOverlayAnimationStart($event)"
                (@overlayAnimation.done)="onOverlayAnimationEnd($event)"
                (keydown.escape)="onEscape()"
            >
                <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: field }"></ng-container>
                <ul *ngIf="display === 'row'; else menu" class="p-column-filter-row-items">
                    <li
                        class="p-column-filter-row-item"
                        *ngFor="let matchMode of matchModes; let i = index"
                        (click)="onRowMatchModeChange(matchMode.value)"
                        (keydown)="onRowMatchModeKeyDown($event)"
                        (keydown.enter)="this.onRowMatchModeChange(matchMode.value)"
                        [ngClass]="{ 'p-highlight': isRowMatchModeSelected(matchMode.value) }"
                        [attr.tabindex]="i === 0 ? '0' : null"
                    >
                        {{ matchMode.label }}
                    </li>
                    <li class="p-column-filter-separator"></li>
                    <li class="p-column-filter-row-item" (click)="onRowClearItemClick()" (keydown)="onRowMatchModeKeyDown($event)" (keydown.enter)="onRowClearItemClick()">{{ noFilterLabel }}</li>
                </ul>
                <ng-template #menu>
                    <div class="p-column-filter-operator" *ngIf="isShowOperator">
                        <p-dropdown [options]="operatorOptions" [ngModel]="operator" (ngModelChange)="onOperatorChange($event)" styleClass="p-column-filter-operator-dropdown"></p-dropdown>
                    </div>
                    <div class="p-column-filter-constraints">
                        <div *ngFor="let fieldConstraint of fieldConstraints; let i = index" class="p-column-filter-constraint">
                            <p-dropdown
                                *ngIf="showMatchModes && matchModes"
                                [options]="matchModes"
                                [ngModel]="fieldConstraint.matchMode"
                                (ngModelChange)="onMenuMatchModeChange($event, fieldConstraint)"
                                styleClass="p-column-filter-matchmode-dropdown"
                            ></p-dropdown>
                            <p-columnFilterFormElement
                                [type]="type"
                                [field]="field"
                                [filterConstraint]="fieldConstraint"
                                [filterTemplate]="filterTemplate"
                                [placeholder]="placeholder"
                                [minFractionDigits]="minFractionDigits"
                                [maxFractionDigits]="maxFractionDigits"
                                [prefix]="prefix"
                                [suffix]="suffix"
                                [locale]="locale"
                                [localeMatcher]="localeMatcher"
                                [currency]="currency"
                                [currencyDisplay]="currencyDisplay"
                                [useGrouping]="useGrouping"
                            ></p-columnFilterFormElement>
                            <div>
                                <button
                                    *ngIf="showRemoveIcon"
                                    type="button"
                                    pButton
                                    icon="pi pi-trash"
                                    class="p-column-filter-remove-button p-button-text p-button-danger p-button-sm"
                                    (click)="removeConstraint(fieldConstraint)"
                                    pRipple
                                    [label]="removeRuleButtonLabel"
                                ></button>
                            </div>
                        </div>
                    </div>
                    <div class="p-column-filter-add-rule" *ngIf="isShowAddConstraint">
                        <button type="button" pButton [label]="addRuleButtonLabel" icon="pi pi-plus" class="p-column-filter-add-button p-button-text p-button-sm" (click)="addConstraint()" pRipple></button>
                    </div>
                    <div class="p-column-filter-buttonbar">
                        <button *ngIf="showClearButton" type="button" pButton class="p-button-outlined p-button-sm" (click)="clearFilter()" [label]="clearButtonLabel" pRipple></button>
                        <button *ngIf="showApplyButton" type="button" pButton (click)="applyFilter()" class="p-button-sm" [label]="applyButtonLabel" pRipple></button>
                    </div>
                </ng-template>
                <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: field }"></ng-container>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i0.forwardRef(function () { return i5.Dropdown; }), selector: "p-dropdown", inputs: ["scrollHeight", "filter", "name", "style", "panelStyle", "styleClass", "panelStyleClass", "readonly", "required", "editable", "appendTo", "tabindex", "placeholder", "filterPlaceholder", "filterLocale", "inputId", "selectId", "dataKey", "filterBy", "autofocus", "resetFilterOnHide", "dropdownIcon", "optionLabel", "optionValue", "optionDisabled", "optionGroupLabel", "optionGroupChildren", "autoDisplayFirst", "group", "showClear", "emptyFilterMessage", "emptyMessage", "lazy", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "overlayOptions", "ariaFilterLabel", "ariaLabel", "ariaLabelledBy", "filterMatchMode", "maxlength", "tooltip", "tooltipPosition", "tooltipPositionStyle", "tooltipStyleClass", "autofocusFilter", "overlayDirection", "disabled", "itemSize", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions", "options", "filterValue"], outputs: ["onChange", "onFilter", "onFocus", "onBlur", "onClick", "onShow", "onHide", "onClear", "onLazyLoad"] }, { kind: "directive", type: i0.forwardRef(function () { return i6.NgControlStatus; }), selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i0.forwardRef(function () { return i6.NgModel; }), selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i0.forwardRef(function () { return i7.ButtonDirective; }), selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "component", type: i0.forwardRef(function () { return ColumnFilterFormElement; }), selector: "p-columnFilterFormElement", inputs: ["field", "type", "filterConstraint", "filterTemplate", "placeholder", "minFractionDigits", "maxFractionDigits", "prefix", "suffix", "locale", "localeMatcher", "currency", "currencyDisplay", "useGrouping"] }], animations: [trigger('overlayAnimation', [transition(':enter', [style({ opacity: 0, transform: 'scaleY(0.8)' }), animate('.12s cubic-bezier(0, 0, 0.2, 1)')]), transition(':leave', [animate('.1s linear', style({ opacity: 0 }))])])], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ColumnFilter, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-columnFilter',
                    template: `
        <div class="p-column-filter" [ngClass]="{ 'p-column-filter-row': display === 'row', 'p-column-filter-menu': display === 'menu' }">
            <p-columnFilterFormElement
                *ngIf="display === 'row'"
                class="p-fluid"
                [type]="type"
                [field]="field"
                [filterConstraint]="dt.filters[field]"
                [filterTemplate]="filterTemplate"
                [placeholder]="placeholder"
                [minFractionDigits]="minFractionDigits"
                [maxFractionDigits]="maxFractionDigits"
                [prefix]="prefix"
                [suffix]="suffix"
                [locale]="locale"
                [localeMatcher]="localeMatcher"
                [currency]="currency"
                [currencyDisplay]="currencyDisplay"
                [useGrouping]="useGrouping"
                [showButtons]="showButtons"
            ></p-columnFilterFormElement>
            <button
                #icon
                *ngIf="showMenuButton"
                type="button"
                class="p-column-filter-menu-button p-link"
                aria-haspopup="true"
                [attr.aria-expanded]="overlayVisible"
                [ngClass]="{ 'p-column-filter-menu-button-open': overlayVisible, 'p-column-filter-menu-button-active': hasFilter() }"
                (click)="toggleMenu()"
                (keydown)="onToggleButtonKeyDown($event)"
            >
                <span class="pi pi-filter-icon pi-filter"></span>
            </button>
            <button #icon *ngIf="showClearButton && display === 'row'" [ngClass]="{ 'p-hidden-space': !hasRowFilter() }" type="button" class="p-column-filter-clear-button p-link" (click)="clearFilter()">
                <span class="pi pi-filter-slash"></span>
            </button>
            <div
                *ngIf="showMenu && overlayVisible"
                [ngClass]="{ 'p-column-filter-overlay p-component p-fluid': true, 'p-column-filter-overlay-menu': display === 'menu' }"
                (click)="onContentClick()"
                [@overlayAnimation]="'visible'"
                (@overlayAnimation.start)="onOverlayAnimationStart($event)"
                (@overlayAnimation.done)="onOverlayAnimationEnd($event)"
                (keydown.escape)="onEscape()"
            >
                <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: field }"></ng-container>
                <ul *ngIf="display === 'row'; else menu" class="p-column-filter-row-items">
                    <li
                        class="p-column-filter-row-item"
                        *ngFor="let matchMode of matchModes; let i = index"
                        (click)="onRowMatchModeChange(matchMode.value)"
                        (keydown)="onRowMatchModeKeyDown($event)"
                        (keydown.enter)="this.onRowMatchModeChange(matchMode.value)"
                        [ngClass]="{ 'p-highlight': isRowMatchModeSelected(matchMode.value) }"
                        [attr.tabindex]="i === 0 ? '0' : null"
                    >
                        {{ matchMode.label }}
                    </li>
                    <li class="p-column-filter-separator"></li>
                    <li class="p-column-filter-row-item" (click)="onRowClearItemClick()" (keydown)="onRowMatchModeKeyDown($event)" (keydown.enter)="onRowClearItemClick()">{{ noFilterLabel }}</li>
                </ul>
                <ng-template #menu>
                    <div class="p-column-filter-operator" *ngIf="isShowOperator">
                        <p-dropdown [options]="operatorOptions" [ngModel]="operator" (ngModelChange)="onOperatorChange($event)" styleClass="p-column-filter-operator-dropdown"></p-dropdown>
                    </div>
                    <div class="p-column-filter-constraints">
                        <div *ngFor="let fieldConstraint of fieldConstraints; let i = index" class="p-column-filter-constraint">
                            <p-dropdown
                                *ngIf="showMatchModes && matchModes"
                                [options]="matchModes"
                                [ngModel]="fieldConstraint.matchMode"
                                (ngModelChange)="onMenuMatchModeChange($event, fieldConstraint)"
                                styleClass="p-column-filter-matchmode-dropdown"
                            ></p-dropdown>
                            <p-columnFilterFormElement
                                [type]="type"
                                [field]="field"
                                [filterConstraint]="fieldConstraint"
                                [filterTemplate]="filterTemplate"
                                [placeholder]="placeholder"
                                [minFractionDigits]="minFractionDigits"
                                [maxFractionDigits]="maxFractionDigits"
                                [prefix]="prefix"
                                [suffix]="suffix"
                                [locale]="locale"
                                [localeMatcher]="localeMatcher"
                                [currency]="currency"
                                [currencyDisplay]="currencyDisplay"
                                [useGrouping]="useGrouping"
                            ></p-columnFilterFormElement>
                            <div>
                                <button
                                    *ngIf="showRemoveIcon"
                                    type="button"
                                    pButton
                                    icon="pi pi-trash"
                                    class="p-column-filter-remove-button p-button-text p-button-danger p-button-sm"
                                    (click)="removeConstraint(fieldConstraint)"
                                    pRipple
                                    [label]="removeRuleButtonLabel"
                                ></button>
                            </div>
                        </div>
                    </div>
                    <div class="p-column-filter-add-rule" *ngIf="isShowAddConstraint">
                        <button type="button" pButton [label]="addRuleButtonLabel" icon="pi pi-plus" class="p-column-filter-add-button p-button-text p-button-sm" (click)="addConstraint()" pRipple></button>
                    </div>
                    <div class="p-column-filter-buttonbar">
                        <button *ngIf="showClearButton" type="button" pButton class="p-button-outlined p-button-sm" (click)="clearFilter()" [label]="clearButtonLabel" pRipple></button>
                        <button *ngIf="showApplyButton" type="button" pButton (click)="applyFilter()" class="p-button-sm" [label]="applyButtonLabel" pRipple></button>
                    </div>
                </ng-template>
                <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: field }"></ng-container>
            </div>
        </div>
    `,
                    animations: [trigger('overlayAnimation', [transition(':enter', [style({ opacity: 0, transform: 'scaleY(0.8)' }), animate('.12s cubic-bezier(0, 0, 0.2, 1)')]), transition(':leave', [animate('.1s linear', style({ opacity: 0 }))])])],
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: Table }, { type: i0.Renderer2 }, { type: i1.PrimeNGConfig }, { type: i1.OverlayService }]; }, propDecorators: { field: [{
                type: Input
            }], type: [{
                type: Input
            }], display: [{
                type: Input
            }], showMenu: [{
                type: Input
            }], matchMode: [{
                type: Input
            }], operator: [{
                type: Input
            }], showOperator: [{
                type: Input
            }], showClearButton: [{
                type: Input
            }], showApplyButton: [{
                type: Input
            }], showMatchModes: [{
                type: Input
            }], showAddButton: [{
                type: Input
            }], hideOnClear: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], matchModeOptions: [{
                type: Input
            }], maxConstraints: [{
                type: Input
            }], minFractionDigits: [{
                type: Input
            }], maxFractionDigits: [{
                type: Input
            }], prefix: [{
                type: Input
            }], suffix: [{
                type: Input
            }], locale: [{
                type: Input
            }], localeMatcher: [{
                type: Input
            }], currency: [{
                type: Input
            }], currencyDisplay: [{
                type: Input
            }], useGrouping: [{
                type: Input
            }], showButtons: [{
                type: Input
            }], icon: [{
                type: ViewChild,
                args: ['icon']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class ColumnFilterFormElement {
    constructor(dt, colFilter) {
        this.dt = dt;
        this.colFilter = colFilter;
        this.useGrouping = true;
    }
    get showButtons() {
        return this.colFilter.showButtons;
    }
    ngOnInit() {
        this.filterCallback = (value) => {
            this.filterConstraint.value = value;
            this.dt._filter();
        };
    }
    onModelChange(value) {
        this.filterConstraint.value = value;
        if (this.type === 'boolean' || value === '') {
            this.dt._filter();
        }
    }
    onTextInputEnterKeyDown(event) {
        this.dt._filter();
        event.preventDefault();
    }
    onNumericInputKeyDown(event) {
        if (event.key === 'Enter') {
            this.dt._filter();
            event.preventDefault();
        }
    }
}
ColumnFilterFormElement.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ColumnFilterFormElement, deps: [{ token: Table }, { token: ColumnFilter }], target: i0.ɵɵFactoryTarget.Component });
ColumnFilterFormElement.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: ColumnFilterFormElement, selector: "p-columnFilterFormElement", inputs: { field: "field", type: "type", filterConstraint: "filterConstraint", filterTemplate: "filterTemplate", placeholder: "placeholder", minFractionDigits: "minFractionDigits", maxFractionDigits: "maxFractionDigits", prefix: "prefix", suffix: "suffix", locale: "locale", localeMatcher: "localeMatcher", currency: "currency", currencyDisplay: "currencyDisplay", useGrouping: "useGrouping" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <ng-container *ngIf="filterTemplate; else builtInElement">
            <ng-container
                *ngTemplateOutlet="
                    filterTemplate;
                    context: {
                        $implicit: filterConstraint.value,
                        filterCallback: filterCallback,
                        type: type,
                        field: field,
                        filterConstraint: filterConstraint,
                        placeholder: placeholder,
                        minFractionDigits: minFractionDigits,
                        maxFractionDigits: maxFractionDigits,
                        prefix: prefix,
                        suffix: suffix,
                        locale: locale,
                        localeMatcher: localeMatcher,
                        currency: currency,
                        currencyDisplay: currencyDisplay,
                        useGrouping: useGrouping,
                        showButtons: showButtons
                    }
                "
            ></ng-container>
        </ng-container>
        <ng-template #builtInElement>
            <ng-container [ngSwitch]="type">
                <input *ngSwitchCase="'text'" type="text" pInputText [value]="filterConstraint?.value" (input)="onModelChange($event.target.value)" (keydown.enter)="onTextInputEnterKeyDown($event)" [attr.placeholder]="placeholder" />
                <p-inputNumber
                    *ngSwitchCase="'numeric'"
                    [ngModel]="filterConstraint?.value"
                    (ngModelChange)="onModelChange($event)"
                    (onKeyDown)="onNumericInputKeyDown($event)"
                    [showButtons]="showButtons"
                    [minFractionDigits]="minFractionDigits"
                    [maxFractionDigits]="maxFractionDigits"
                    [prefix]="prefix"
                    [suffix]="suffix"
                    [placeholder]="placeholder"
                    [mode]="currency ? 'currency' : 'decimal'"
                    [locale]="locale"
                    [localeMatcher]="localeMatcher"
                    [currency]="currency"
                    [currencyDisplay]="currencyDisplay"
                    [useGrouping]="useGrouping"
                ></p-inputNumber>
                <p-triStateCheckbox *ngSwitchCase="'boolean'" [ngModel]="filterConstraint?.value" (ngModelChange)="onModelChange($event)"></p-triStateCheckbox>
                <p-calendar *ngSwitchCase="'date'" [placeholder]="placeholder" [ngModel]="filterConstraint?.value" (ngModelChange)="onModelChange($event)"></p-calendar>
            </ng-container>
        </ng-template>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i2.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "component", type: i8.InputNumber, selector: "p-inputNumber", inputs: ["showButtons", "format", "buttonLayout", "inputId", "styleClass", "style", "placeholder", "size", "maxlength", "tabindex", "title", "ariaLabel", "ariaRequired", "name", "required", "autocomplete", "min", "max", "incrementButtonClass", "decrementButtonClass", "incrementButtonIcon", "decrementButtonIcon", "readonly", "step", "allowEmpty", "locale", "localeMatcher", "mode", "currency", "currencyDisplay", "useGrouping", "minFractionDigits", "maxFractionDigits", "prefix", "suffix", "inputStyle", "inputStyleClass", "showClear", "disabled"], outputs: ["onInput", "onFocus", "onBlur", "onKeyDown", "onClear"] }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i9.InputText, selector: "[pInputText]" }, { kind: "component", type: i10.Calendar, selector: "p-calendar", inputs: ["style", "styleClass", "inputStyle", "inputId", "name", "inputStyleClass", "placeholder", "ariaLabelledBy", "iconAriaLabel", "disabled", "dateFormat", "multipleSeparator", "rangeSeparator", "inline", "showOtherMonths", "selectOtherMonths", "showIcon", "icon", "appendTo", "readonlyInput", "shortYearCutoff", "monthNavigator", "yearNavigator", "hourFormat", "timeOnly", "stepHour", "stepMinute", "stepSecond", "showSeconds", "required", "showOnFocus", "showWeek", "showClear", "dataType", "selectionMode", "maxDateCount", "showButtonBar", "todayButtonStyleClass", "clearButtonStyleClass", "autoZIndex", "baseZIndex", "panelStyleClass", "panelStyle", "keepInvalid", "hideOnDateTimeSelect", "touchUI", "timeSeparator", "focusTrap", "showTransitionOptions", "hideTransitionOptions", "tabindex", "view", "defaultDate", "minDate", "maxDate", "disabledDates", "disabledDays", "yearRange", "showTime", "responsiveOptions", "numberOfMonths", "firstDayOfWeek", "locale"], outputs: ["onFocus", "onBlur", "onClose", "onSelect", "onClear", "onInput", "onTodayClick", "onClearClick", "onMonthChange", "onYearChange", "onClickOutside", "onShow"] }, { kind: "component", type: i11.TriStateCheckbox, selector: "p-triStateCheckbox", inputs: ["disabled", "name", "ariaLabelledBy", "tabindex", "inputId", "style", "styleClass", "label", "readonly", "checkboxTrueIcon", "checkboxFalseIcon"], outputs: ["onChange"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: ColumnFilterFormElement, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-columnFilterFormElement',
                    template: `
        <ng-container *ngIf="filterTemplate; else builtInElement">
            <ng-container
                *ngTemplateOutlet="
                    filterTemplate;
                    context: {
                        $implicit: filterConstraint.value,
                        filterCallback: filterCallback,
                        type: type,
                        field: field,
                        filterConstraint: filterConstraint,
                        placeholder: placeholder,
                        minFractionDigits: minFractionDigits,
                        maxFractionDigits: maxFractionDigits,
                        prefix: prefix,
                        suffix: suffix,
                        locale: locale,
                        localeMatcher: localeMatcher,
                        currency: currency,
                        currencyDisplay: currencyDisplay,
                        useGrouping: useGrouping,
                        showButtons: showButtons
                    }
                "
            ></ng-container>
        </ng-container>
        <ng-template #builtInElement>
            <ng-container [ngSwitch]="type">
                <input *ngSwitchCase="'text'" type="text" pInputText [value]="filterConstraint?.value" (input)="onModelChange($event.target.value)" (keydown.enter)="onTextInputEnterKeyDown($event)" [attr.placeholder]="placeholder" />
                <p-inputNumber
                    *ngSwitchCase="'numeric'"
                    [ngModel]="filterConstraint?.value"
                    (ngModelChange)="onModelChange($event)"
                    (onKeyDown)="onNumericInputKeyDown($event)"
                    [showButtons]="showButtons"
                    [minFractionDigits]="minFractionDigits"
                    [maxFractionDigits]="maxFractionDigits"
                    [prefix]="prefix"
                    [suffix]="suffix"
                    [placeholder]="placeholder"
                    [mode]="currency ? 'currency' : 'decimal'"
                    [locale]="locale"
                    [localeMatcher]="localeMatcher"
                    [currency]="currency"
                    [currencyDisplay]="currencyDisplay"
                    [useGrouping]="useGrouping"
                ></p-inputNumber>
                <p-triStateCheckbox *ngSwitchCase="'boolean'" [ngModel]="filterConstraint?.value" (ngModelChange)="onModelChange($event)"></p-triStateCheckbox>
                <p-calendar *ngSwitchCase="'date'" [placeholder]="placeholder" [ngModel]="filterConstraint?.value" (ngModelChange)="onModelChange($event)"></p-calendar>
            </ng-container>
        </ng-template>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Table }, { type: ColumnFilter }]; }, propDecorators: { field: [{
                type: Input
            }], type: [{
                type: Input
            }], filterConstraint: [{
                type: Input
            }], filterTemplate: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], minFractionDigits: [{
                type: Input
            }], maxFractionDigits: [{
                type: Input
            }], prefix: [{
                type: Input
            }], suffix: [{
                type: Input
            }], locale: [{
                type: Input
            }], localeMatcher: [{
                type: Input
            }], currency: [{
                type: Input
            }], currencyDisplay: [{
                type: Input
            }], useGrouping: [{
                type: Input
            }] } });
export class TableModule {
}
TableModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TableModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.4", ngImport: i0, type: TableModule, declarations: [Table, SortableColumn, FrozenColumn, RowGroupHeader, SelectableRow, RowToggler, ContextMenuRow, ResizableColumn, ReorderableColumn, EditableColumn, CellEditor, TableBody, SortIcon, TableRadioButton, TableCheckbox, TableHeaderCheckbox, ReorderableRowHandle, ReorderableRow, SelectableRowDblClick, EditableRow, InitEditableRow, SaveEditableRow, CancelEditableRow, ColumnFilter, ColumnFilterFormElement], imports: [CommonModule, PaginatorModule, InputTextModule, DropdownModule, FormsModule, ButtonModule, SelectButtonModule, CalendarModule, InputNumberModule, TriStateCheckboxModule, ScrollerModule], exports: [Table, SharedModule, SortableColumn, FrozenColumn, RowGroupHeader, SelectableRow, RowToggler, ContextMenuRow, ResizableColumn, ReorderableColumn, EditableColumn, CellEditor, SortIcon, TableRadioButton, TableCheckbox, TableHeaderCheckbox, ReorderableRowHandle, ReorderableRow, SelectableRowDblClick, EditableRow, InitEditableRow, SaveEditableRow, CancelEditableRow, ColumnFilter, ColumnFilterFormElement, ScrollerModule] });
TableModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableModule, imports: [CommonModule, PaginatorModule, InputTextModule, DropdownModule, FormsModule, ButtonModule, SelectButtonModule, CalendarModule, InputNumberModule, TriStateCheckboxModule, ScrollerModule, SharedModule,
        ScrollerModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: TableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, PaginatorModule, InputTextModule, DropdownModule, FormsModule, ButtonModule, SelectButtonModule, CalendarModule, InputNumberModule, TriStateCheckboxModule, ScrollerModule],
                    exports: [
                        Table,
                        SharedModule,
                        SortableColumn,
                        FrozenColumn,
                        RowGroupHeader,
                        SelectableRow,
                        RowToggler,
                        ContextMenuRow,
                        ResizableColumn,
                        ReorderableColumn,
                        EditableColumn,
                        CellEditor,
                        SortIcon,
                        TableRadioButton,
                        TableCheckbox,
                        TableHeaderCheckbox,
                        ReorderableRowHandle,
                        ReorderableRow,
                        SelectableRowDblClick,
                        EditableRow,
                        InitEditableRow,
                        SaveEditableRow,
                        CancelEditableRow,
                        ColumnFilter,
                        ColumnFilterFormElement,
                        ScrollerModule
                    ],
                    declarations: [
                        Table,
                        SortableColumn,
                        FrozenColumn,
                        RowGroupHeader,
                        SelectableRow,
                        RowToggler,
                        ContextMenuRow,
                        ResizableColumn,
                        ReorderableColumn,
                        EditableColumn,
                        CellEditor,
                        TableBody,
                        SortIcon,
                        TableRadioButton,
                        TableCheckbox,
                        TableHeaderCheckbox,
                        ReorderableRowHandle,
                        ReorderableRow,
                        SelectableRowDblClick,
                        EditableRow,
                        InitEditableRow,
                        SaveEditableRow,
                        CancelEditableRow,
                        ColumnFilter,
                        ColumnFilterFormElement
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvdGFibGUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBa0IsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRixPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVFLE9BQU8sRUFHSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBRVQsWUFBWSxFQUNaLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUNWLEtBQUssRUFDTCxRQUFRLEVBS1IsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBS1gsU0FBUyxFQUNULGlCQUFpQixFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFlLGVBQWUsRUFBa0IsY0FBYyxFQUFnRCxhQUFhLEVBQWMsWUFBWSxFQUF3QixlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDek4sT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9B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d0JBQ2IsVUFBVTt3QkFDVixjQUFjO3dCQUNkLGVBQWU7d0JBQ2YsaUJBQWlCO3dCQUNqQixjQUFjO3dCQUNkLFVBQVU7d0JBQ1YsUUFBUTt3QkFDUixnQkFBZ0I7d0JBQ2hCLGFBQWE7d0JBQ2IsbUJBQW1CO3dCQUNuQixvQkFBb0I7d0JBQ3BCLGNBQWM7d0JBQ2QscUJBQXFCO3dCQUNyQixXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLFlBQVk7d0JBQ1osdUJBQXVCO3dCQUN2QixjQUFjO3FCQUNqQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1YsS0FBSzt3QkFDTCxjQUFjO3dCQUNkLFlBQVk7d0JBQ1osY0FBYzt3QkFDZCxhQUFhO3dCQUNiLFVBQVU7d0JBQ1YsY0FBYzt3QkFDZCxlQUFlO3dCQUNmLGlCQUFpQjt3QkFDakIsY0FBYzt3QkFDZCxVQUFVO3dCQUNWLFNBQVM7d0JBQ1QsUUFBUTt3QkFDUixnQkFBZ0I7d0JBQ2hCLGFBQWE7d0JBQ2IsbUJBQW1CO3dCQUNuQixvQkFBb0I7d0JBQ3BCLGNBQWM7d0JBQ2QscUJBQXFCO3dCQUNyQixXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLFlBQVk7d0JBQ1osdUJBQXVCO3FCQUMxQjtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIEFuaW1hdGlvbkV2ZW50LCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBEaXJlY3RpdmUsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIEluamVjdCxcbiAgICBJbmplY3RhYmxlLFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE5nWm9uZSxcbiAgICBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBPcHRpb25hbCxcbiAgICBPdXRwdXQsXG4gICAgUExBVEZPUk1fSUQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFJlbmRlcmVyMixcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQmxvY2thYmxlVUksIEZpbHRlck1hdGNoTW9kZSwgRmlsdGVyTWV0YWRhdGEsIEZpbHRlck9wZXJhdG9yLCBGaWx0ZXJTZXJ2aWNlLCBPdmVybGF5U2VydmljZSwgUHJpbWVOR0NvbmZpZywgUHJpbWVUZW1wbGF0ZSwgU2VsZWN0SXRlbSwgU2hhcmVkTW9kdWxlLCBTb3J0TWV0YSwgVGFibGVTdGF0ZSwgVHJhbnNsYXRpb25LZXlzIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHsgQ2FsZW5kYXJNb2R1bGUgfSBmcm9tICdwcmltZW5nL2NhbGVuZGFyJztcbmltcG9ydCB7IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyLCBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgRHJvcGRvd25Nb2R1bGUgfSBmcm9tICdwcmltZW5nL2Ryb3Bkb3duJztcbmltcG9ydCB7IElucHV0TnVtYmVyTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9pbnB1dG51bWJlcic7XG5pbXBvcnQgeyBJbnB1dFRleHRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2lucHV0dGV4dCc7XG5pbXBvcnQgeyBQYWdpbmF0b3JNb2R1bGUgfSBmcm9tICdwcmltZW5nL3BhZ2luYXRvcic7XG5pbXBvcnQgeyBTY3JvbGxlciwgU2Nyb2xsZXJNb2R1bGUsIFNjcm9sbGVyT3B0aW9ucyB9IGZyb20gJ3ByaW1lbmcvc2Nyb2xsZXInO1xuaW1wb3J0IHsgU2VsZWN0QnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9zZWxlY3RidXR0b24nO1xuaW1wb3J0IHsgVHJpU3RhdGVDaGVja2JveE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvdHJpc3RhdGVjaGVja2JveCc7XG5pbXBvcnQgeyBPYmplY3RVdGlscywgVW5pcXVlQ29tcG9uZW50SWQsIFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRhYmxlU2VydmljZSB7XG4gICAgcHJpdmF0ZSBzb3J0U291cmNlID0gbmV3IFN1YmplY3Q8U29ydE1ldGEgfCBTb3J0TWV0YVtdPigpO1xuICAgIHByaXZhdGUgc2VsZWN0aW9uU291cmNlID0gbmV3IFN1YmplY3QoKTtcbiAgICBwcml2YXRlIGNvbnRleHRNZW51U291cmNlID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICAgIHByaXZhdGUgdmFsdWVTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gICAgcHJpdmF0ZSB0b3RhbFJlY29yZHNTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gICAgcHJpdmF0ZSBjb2x1bW5zU291cmNlID0gbmV3IFN1YmplY3QoKTtcbiAgICBwcml2YXRlIHJlc2V0U291cmNlID0gbmV3IFN1YmplY3QoKTtcblxuICAgIHNvcnRTb3VyY2UkID0gdGhpcy5zb3J0U291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHNlbGVjdGlvblNvdXJjZSQgPSB0aGlzLnNlbGVjdGlvblNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgICBjb250ZXh0TWVudVNvdXJjZSQgPSB0aGlzLmNvbnRleHRNZW51U291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHZhbHVlU291cmNlJCA9IHRoaXMudmFsdWVTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgdG90YWxSZWNvcmRzU291cmNlJCA9IHRoaXMudG90YWxSZWNvcmRzU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIGNvbHVtbnNTb3VyY2UkID0gdGhpcy5jb2x1bW5zU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHJlc2V0U291cmNlJCA9IHRoaXMucmVzZXRTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBvblNvcnQoc29ydE1ldGE6IFNvcnRNZXRhIHwgU29ydE1ldGFbXSkge1xuICAgICAgICB0aGlzLnNvcnRTb3VyY2UubmV4dChzb3J0TWV0YSk7XG4gICAgfVxuXG4gICAgb25TZWxlY3Rpb25DaGFuZ2UoKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU291cmNlLm5leHQobnVsbCk7XG4gICAgfVxuXG4gICAgb25SZXNldENoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5yZXNldFNvdXJjZS5uZXh0KG51bGwpO1xuICAgIH1cblxuICAgIG9uQ29udGV4dE1lbnUoZGF0YTogYW55KSB7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVTb3VyY2UubmV4dChkYXRhKTtcbiAgICB9XG5cbiAgICBvblZhbHVlQ2hhbmdlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy52YWx1ZVNvdXJjZS5uZXh0KHZhbHVlKTtcbiAgICB9XG5cbiAgICBvblRvdGFsUmVjb3Jkc0NoYW5nZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudG90YWxSZWNvcmRzU291cmNlLm5leHQodmFsdWUpO1xuICAgIH1cblxuICAgIG9uQ29sdW1uc0NoYW5nZShjb2x1bW5zOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmNvbHVtbnNTb3VyY2UubmV4dChjb2x1bW5zKTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10YWJsZScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgI2NvbnRhaW5lclxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1kYXRhdGFibGUgcC1jb21wb25lbnQnOiB0cnVlLCAncC1kYXRhdGFibGUtaG92ZXJhYmxlLXJvd3MnOiByb3dIb3ZlciB8fCBzZWxlY3Rpb25Nb2RlLCAncC1kYXRhdGFibGUtc2Nyb2xsYWJsZSc6IHNjcm9sbGFibGUsICdwLWRhdGF0YWJsZS1mbGV4LXNjcm9sbGFibGUnOiBzY3JvbGxhYmxlICYmIHNjcm9sbEhlaWdodCA9PT0gJ2ZsZXgnIH1cIlxuICAgICAgICAgICAgW2F0dHIuaWRdPVwiaWRcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1kYXRhdGFibGUtbG9hZGluZy1vdmVybGF5IHAtY29tcG9uZW50LW92ZXJsYXlcIiAqbmdJZj1cImxvYWRpbmcgJiYgc2hvd0xvYWRlclwiPlxuICAgICAgICAgICAgICAgIDxpIFtjbGFzc109XCIncC1kYXRhdGFibGUtbG9hZGluZy1pY29uIHBpLXNwaW4gJyArIGxvYWRpbmdJY29uXCI+PC9pPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiY2FwdGlvblRlbXBsYXRlXCIgY2xhc3M9XCJwLWRhdGF0YWJsZS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY2FwdGlvblRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxwLXBhZ2luYXRvclxuICAgICAgICAgICAgICAgIFtyb3dzXT1cInJvd3NcIlxuICAgICAgICAgICAgICAgIFtmaXJzdF09XCJmaXJzdFwiXG4gICAgICAgICAgICAgICAgW3RvdGFsUmVjb3Jkc109XCJ0b3RhbFJlY29yZHNcIlxuICAgICAgICAgICAgICAgIFtwYWdlTGlua1NpemVdPVwicGFnZUxpbmtzXCJcbiAgICAgICAgICAgICAgICBzdHlsZUNsYXNzPVwicC1wYWdpbmF0b3ItdG9wXCJcbiAgICAgICAgICAgICAgICBbYWx3YXlzU2hvd109XCJhbHdheXNTaG93UGFnaW5hdG9yXCJcbiAgICAgICAgICAgICAgICAob25QYWdlQ2hhbmdlKT1cIm9uUGFnZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICBbcm93c1BlclBhZ2VPcHRpb25zXT1cInJvd3NQZXJQYWdlT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJwYWdpbmF0b3IgJiYgKHBhZ2luYXRvclBvc2l0aW9uID09PSAndG9wJyB8fCBwYWdpbmF0b3JQb3NpdGlvbiA9PSAnYm90aCcpXCJcbiAgICAgICAgICAgICAgICBbdGVtcGxhdGVMZWZ0XT1cInBhZ2luYXRvckxlZnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgW3RlbXBsYXRlUmlnaHRdPVwicGFnaW5hdG9yUmlnaHRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgW2Ryb3Bkb3duQXBwZW5kVG9dPVwicGFnaW5hdG9yRHJvcGRvd25BcHBlbmRUb1wiXG4gICAgICAgICAgICAgICAgW2Ryb3Bkb3duU2Nyb2xsSGVpZ2h0XT1cInBhZ2luYXRvckRyb3Bkb3duU2Nyb2xsSGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbY3VycmVudFBhZ2VSZXBvcnRUZW1wbGF0ZV09XCJjdXJyZW50UGFnZVJlcG9ydFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbc2hvd0ZpcnN0TGFzdEljb25dPVwic2hvd0ZpcnN0TGFzdEljb25cIlxuICAgICAgICAgICAgICAgIFtkcm9wZG93bkl0ZW1UZW1wbGF0ZV09XCJwYWdpbmF0b3JEcm9wZG93bkl0ZW1UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgW3Nob3dDdXJyZW50UGFnZVJlcG9ydF09XCJzaG93Q3VycmVudFBhZ2VSZXBvcnRcIlxuICAgICAgICAgICAgICAgIFtzaG93SnVtcFRvUGFnZURyb3Bkb3duXT1cInNob3dKdW1wVG9QYWdlRHJvcGRvd25cIlxuICAgICAgICAgICAgICAgIFtzaG93SnVtcFRvUGFnZUlucHV0XT1cInNob3dKdW1wVG9QYWdlSW5wdXRcIlxuICAgICAgICAgICAgICAgIFtzaG93UGFnZUxpbmtzXT1cInNob3dQYWdlTGlua3NcIlxuICAgICAgICAgICAgPjwvcC1wYWdpbmF0b3I+XG5cbiAgICAgICAgICAgIDxkaXYgI3dyYXBwZXIgY2xhc3M9XCJwLWRhdGF0YWJsZS13cmFwcGVyXCIgW25nU3R5bGVdPVwieyBtYXhIZWlnaHQ6IHZpcnR1YWxTY3JvbGwgPyAnJyA6IHNjcm9sbEhlaWdodCB9XCI+XG4gICAgICAgICAgICAgICAgPHAtc2Nyb2xsZXJcbiAgICAgICAgICAgICAgICAgICAgI3Njcm9sbGVyXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwidmlydHVhbFNjcm9sbFwiXG4gICAgICAgICAgICAgICAgICAgIFtpdGVtc109XCJwcm9jZXNzZWREYXRhXCJcbiAgICAgICAgICAgICAgICAgICAgW2NvbHVtbnNdPVwiY29sdW1uc1wiXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XCJ7IGhlaWdodDogc2Nyb2xsSGVpZ2h0ICE9PSAnZmxleCcgPyBzY3JvbGxIZWlnaHQgOiB1bmRlZmluZWQgfVwiXG4gICAgICAgICAgICAgICAgICAgIFtzY3JvbGxIZWlnaHRdPVwic2Nyb2xsSGVpZ2h0ICE9PSAnZmxleCcgPyB1bmRlZmluZWQgOiAnMTAwJSdcIlxuICAgICAgICAgICAgICAgICAgICBbaXRlbVNpemVdPVwidmlydHVhbFNjcm9sbEl0ZW1TaXplIHx8IF92aXJ0dWFsUm93SGVpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgW3N0ZXBdPVwicm93c1wiXG4gICAgICAgICAgICAgICAgICAgIFtkZWxheV09XCJsYXp5ID8gdmlydHVhbFNjcm9sbERlbGF5IDogMFwiXG4gICAgICAgICAgICAgICAgICAgIFtpbmxpbmVdPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgIFtsYXp5XT1cImxhenlcIlxuICAgICAgICAgICAgICAgICAgICAob25MYXp5TG9hZCk9XCJvbkxhenlJdGVtTG9hZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgW2xvYWRlckRpc2FibGVkXT1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICBbc2hvd1NwYWNlcl09XCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgICAgIFtzaG93TG9hZGVyXT1cImxvYWRpbmdCb2R5VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc109XCJ2aXJ0dWFsU2Nyb2xsT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgIFthdXRvU2l6ZV09XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJjb250ZW50XCIgbGV0LWl0ZW1zIGxldC1zY3JvbGxlck9wdGlvbnM9XCJvcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiYnVpbGRJblRhYmxlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbXMsIG9wdGlvbnM6IHNjcm9sbGVyT3B0aW9ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9wLXNjcm9sbGVyPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhdmlydHVhbFNjcm9sbFwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiYnVpbGRJblRhYmxlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogcHJvY2Vzc2VkRGF0YSwgb3B0aW9uczogeyBjb2x1bW5zIH0gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNidWlsZEluVGFibGUgbGV0LWl0ZW1zIGxldC1zY3JvbGxlck9wdGlvbnM9XCJvcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgI3RhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwidGFibGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1kYXRhdGFibGUtdGFibGUnOiB0cnVlLCAncC1kYXRhdGFibGUtc2Nyb2xsYWJsZS10YWJsZSc6IHNjcm9sbGFibGUsICdwLWRhdGF0YWJsZS1yZXNpemFibGUtdGFibGUnOiByZXNpemFibGVDb2x1bW5zLCAncC1kYXRhdGFibGUtcmVzaXphYmxlLXRhYmxlLWZpdCc6IHJlc2l6YWJsZUNvbHVtbnMgJiYgY29sdW1uUmVzaXplTW9kZSA9PT0gJ2ZpdCcgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3NdPVwidGFibGVTdHlsZUNsYXNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XCJ0YWJsZVN0eWxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cImlkICsgJy10YWJsZSdcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29sR3JvdXBUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IHNjcm9sbGVyT3B0aW9ucy5jb2x1bW5zIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZCAjdGhlYWQgY2xhc3M9XCJwLWRhdGF0YWJsZS10aGVhZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJHcm91cGVkVGVtcGxhdGUgfHwgaGVhZGVyVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBzY3JvbGxlck9wdGlvbnMuY29sdW1ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLWRhdGF0YWJsZS10Ym9keSBwLWRhdGF0YWJsZS1mcm96ZW4tdGJvZHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiZnJvemVuVmFsdWUgfHwgZnJvemVuQm9keVRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdmFsdWVdPVwiZnJvemVuVmFsdWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmcm96ZW5Sb3dzXT1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwVGFibGVCb2R5XT1cInNjcm9sbGVyT3B0aW9ucy5jb2x1bW5zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcFRhYmxlQm9keVRlbXBsYXRlXT1cImZyb3plbkJvZHlUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Zyb3plbl09XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID48L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLWRhdGF0YWJsZS10Ym9keVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwic2Nyb2xsZXJPcHRpb25zLmNvbnRlbnRTdHlsZUNsYXNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVwic2Nyb2xsZXJPcHRpb25zLmNvbnRlbnRTdHlsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ZhbHVlXT1cImRhdGFUb1JlbmRlcihzY3JvbGxlck9wdGlvbnMucm93cylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwVGFibGVCb2R5XT1cInNjcm9sbGVyT3B0aW9ucy5jb2x1bW5zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcFRhYmxlQm9keVRlbXBsYXRlXT1cImJvZHlUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Njcm9sbGVyT3B0aW9uc109XCJzY3JvbGxlck9wdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPjwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHkgKm5nSWY9XCJzY3JvbGxlck9wdGlvbnMuc3BhY2VyU3R5bGVcIiBbc3R5bGVdPVwiJ2hlaWdodDogY2FsYygnICsgc2Nyb2xsZXJPcHRpb25zLnNwYWNlclN0eWxlLmhlaWdodCArICcgLSAnICsgc2Nyb2xsZXJPcHRpb25zLnJvd3MubGVuZ3RoICogc2Nyb2xsZXJPcHRpb25zLml0ZW1TaXplICsgJ3B4KTsnXCIgY2xhc3M9XCJwLWRhdGF0YWJsZS1zY3JvbGxlci1zcGFjZXJcIj48L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRmb290ICpuZ0lmPVwiZm9vdGVyR3JvdXBlZFRlbXBsYXRlIHx8IGZvb3RlclRlbXBsYXRlXCIgI3Rmb290IGNsYXNzPVwicC1kYXRhdGFibGUtdGZvb3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZm9vdGVyR3JvdXBlZFRlbXBsYXRlIHx8IGZvb3RlclRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogc2Nyb2xsZXJPcHRpb25zLmNvbHVtbnMgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Zm9vdD5cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxwLXBhZ2luYXRvclxuICAgICAgICAgICAgICAgIFtyb3dzXT1cInJvd3NcIlxuICAgICAgICAgICAgICAgIFtmaXJzdF09XCJmaXJzdFwiXG4gICAgICAgICAgICAgICAgW3RvdGFsUmVjb3Jkc109XCJ0b3RhbFJlY29yZHNcIlxuICAgICAgICAgICAgICAgIFtwYWdlTGlua1NpemVdPVwicGFnZUxpbmtzXCJcbiAgICAgICAgICAgICAgICBzdHlsZUNsYXNzPVwicC1wYWdpbmF0b3ItYm90dG9tXCJcbiAgICAgICAgICAgICAgICBbYWx3YXlzU2hvd109XCJhbHdheXNTaG93UGFnaW5hdG9yXCJcbiAgICAgICAgICAgICAgICAob25QYWdlQ2hhbmdlKT1cIm9uUGFnZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICBbcm93c1BlclBhZ2VPcHRpb25zXT1cInJvd3NQZXJQYWdlT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJwYWdpbmF0b3IgJiYgKHBhZ2luYXRvclBvc2l0aW9uID09PSAnYm90dG9tJyB8fCBwYWdpbmF0b3JQb3NpdGlvbiA9PSAnYm90aCcpXCJcbiAgICAgICAgICAgICAgICBbdGVtcGxhdGVMZWZ0XT1cInBhZ2luYXRvckxlZnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgW3RlbXBsYXRlUmlnaHRdPVwicGFnaW5hdG9yUmlnaHRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgW2Ryb3Bkb3duQXBwZW5kVG9dPVwicGFnaW5hdG9yRHJvcGRvd25BcHBlbmRUb1wiXG4gICAgICAgICAgICAgICAgW2Ryb3Bkb3duU2Nyb2xsSGVpZ2h0XT1cInBhZ2luYXRvckRyb3Bkb3duU2Nyb2xsSGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbY3VycmVudFBhZ2VSZXBvcnRUZW1wbGF0ZV09XCJjdXJyZW50UGFnZVJlcG9ydFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbc2hvd0ZpcnN0TGFzdEljb25dPVwic2hvd0ZpcnN0TGFzdEljb25cIlxuICAgICAgICAgICAgICAgIFtkcm9wZG93bkl0ZW1UZW1wbGF0ZV09XCJwYWdpbmF0b3JEcm9wZG93bkl0ZW1UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgW3Nob3dDdXJyZW50UGFnZVJlcG9ydF09XCJzaG93Q3VycmVudFBhZ2VSZXBvcnRcIlxuICAgICAgICAgICAgICAgIFtzaG93SnVtcFRvUGFnZURyb3Bkb3duXT1cInNob3dKdW1wVG9QYWdlRHJvcGRvd25cIlxuICAgICAgICAgICAgICAgIFtzaG93SnVtcFRvUGFnZUlucHV0XT1cInNob3dKdW1wVG9QYWdlSW5wdXRcIlxuICAgICAgICAgICAgICAgIFtzaG93UGFnZUxpbmtzXT1cInNob3dQYWdlTGlua3NcIlxuICAgICAgICAgICAgPjwvcC1wYWdpbmF0b3I+XG5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJzdW1tYXJ5VGVtcGxhdGVcIiBjbGFzcz1cInAtZGF0YXRhYmxlLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJzdW1tYXJ5VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2ICNyZXNpemVIZWxwZXIgY2xhc3M9XCJwLWNvbHVtbi1yZXNpemVyLWhlbHBlclwiIHN0eWxlPVwiZGlzcGxheTpub25lXCIgKm5nSWY9XCJyZXNpemFibGVDb2x1bW5zXCI+PC9kaXY+XG4gICAgICAgICAgICA8c3BhbiAjcmVvcmRlckluZGljYXRvclVwIGNsYXNzPVwicGkgcGktYXJyb3ctZG93biBwLWRhdGF0YWJsZS1yZW9yZGVyLWluZGljYXRvci11cFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiAqbmdJZj1cInJlb3JkZXJhYmxlQ29sdW1uc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuICNyZW9yZGVySW5kaWNhdG9yRG93biBjbGFzcz1cInBpIHBpLWFycm93LXVwIHAtZGF0YXRhYmxlLXJlb3JkZXItaW5kaWNhdG9yLWRvd25cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCIgKm5nSWY9XCJyZW9yZGVyYWJsZUNvbHVtbnNcIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbVGFibGVTZXJ2aWNlXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi90YWJsZS5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVGFibGUgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIEFmdGVyQ29udGVudEluaXQsIEJsb2NrYWJsZVVJLCBPbkNoYW5nZXMge1xuICAgIEBJbnB1dCgpIGZyb3plbkNvbHVtbnM6IGFueVtdO1xuXG4gICAgQElucHV0KCkgZnJvemVuVmFsdWU6IGFueVtdO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRhYmxlU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHRhYmxlU3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcGFnaW5hdG9yOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgcGFnZUxpbmtzOiBudW1iZXIgPSA1O1xuXG4gICAgQElucHV0KCkgcm93c1BlclBhZ2VPcHRpb25zOiBhbnlbXTtcblxuICAgIEBJbnB1dCgpIGFsd2F5c1Nob3dQYWdpbmF0b3I6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgcGFnaW5hdG9yUG9zaXRpb246IHN0cmluZyA9ICdib3R0b20nO1xuXG4gICAgQElucHV0KCkgcGFnaW5hdG9yRHJvcGRvd25BcHBlbmRUbzogYW55O1xuXG4gICAgQElucHV0KCkgcGFnaW5hdG9yRHJvcGRvd25TY3JvbGxIZWlnaHQ6IHN0cmluZyA9ICcyMDBweCc7XG5cbiAgICBASW5wdXQoKSBjdXJyZW50UGFnZVJlcG9ydFRlbXBsYXRlOiBzdHJpbmcgPSAne2N1cnJlbnRQYWdlfSBvZiB7dG90YWxQYWdlc30nO1xuXG4gICAgQElucHV0KCkgc2hvd0N1cnJlbnRQYWdlUmVwb3J0OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc2hvd0p1bXBUb1BhZ2VEcm9wZG93bjogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHNob3dKdW1wVG9QYWdlSW5wdXQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzaG93Rmlyc3RMYXN0SWNvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzaG93UGFnZUxpbmtzOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGRlZmF1bHRTb3J0T3JkZXI6IG51bWJlciA9IDE7XG5cbiAgICBASW5wdXQoKSBzb3J0TW9kZTogc3RyaW5nID0gJ3NpbmdsZSc7XG5cbiAgICBASW5wdXQoKSByZXNldFBhZ2VPblNvcnQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2VsZWN0aW9uTW9kZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc2VsZWN0aW9uUGFnZU9ubHk6IGJvb2xlYW47XG5cbiAgICBAT3V0cHV0KCkgc2VsZWN0QWxsQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBzZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCkgY29udGV4dE1lbnVTZWxlY3Rpb246IGFueTtcblxuICAgIEBPdXRwdXQoKSBjb250ZXh0TWVudVNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASW5wdXQoKSBjb250ZXh0TWVudVNlbGVjdGlvbk1vZGU6IHN0cmluZyA9ICdzZXBhcmF0ZSc7XG5cbiAgICBASW5wdXQoKSBkYXRhS2V5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBtZXRhS2V5U2VsZWN0aW9uOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgcm93U2VsZWN0YWJsZTtcblxuICAgIEBJbnB1dCgpIHJvd1RyYWNrQnk6IEZ1bmN0aW9uID0gKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gaXRlbTtcblxuICAgIEBJbnB1dCgpIGxhenk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGxhenlMb2FkT25Jbml0OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGNvbXBhcmVTZWxlY3Rpb25CeTogc3RyaW5nID0gJ2RlZXBFcXVhbHMnO1xuXG4gICAgQElucHV0KCkgY3N2U2VwYXJhdG9yOiBzdHJpbmcgPSAnLCc7XG5cbiAgICBASW5wdXQoKSBleHBvcnRGaWxlbmFtZTogc3RyaW5nID0gJ2Rvd25sb2FkJztcblxuICAgIEBJbnB1dCgpIGZpbHRlcnM6IHsgW3M6IHN0cmluZ106IEZpbHRlck1ldGFkYXRhIHwgRmlsdGVyTWV0YWRhdGFbXSB8IHVuZGVmaW5lZCB9ID0ge307XG5cbiAgICBASW5wdXQoKSBnbG9iYWxGaWx0ZXJGaWVsZHM6IHN0cmluZ1tdO1xuXG4gICAgQElucHV0KCkgZmlsdGVyRGVsYXk6IG51bWJlciA9IDMwMDtcblxuICAgIEBJbnB1dCgpIGZpbHRlckxvY2FsZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZXhwYW5kZWRSb3dLZXlzOiB7IFtzOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuICAgIEBJbnB1dCgpIGVkaXRpbmdSb3dLZXlzOiB7IFtzOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuICAgIEBJbnB1dCgpIHJvd0V4cGFuZE1vZGU6IHN0cmluZyA9ICdtdWx0aXBsZSc7XG5cbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc2Nyb2xsRGlyZWN0aW9uOiBzdHJpbmcgPSAndmVydGljYWwnO1xuXG4gICAgQElucHV0KCkgcm93R3JvdXBNb2RlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzY3JvbGxIZWlnaHQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGw6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB2aXJ0dWFsU2Nyb2xsSXRlbVNpemU6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGxPcHRpb25zOiBTY3JvbGxlck9wdGlvbnM7XG5cbiAgICBASW5wdXQoKSB2aXJ0dWFsU2Nyb2xsRGVsYXk6IG51bWJlciA9IDI1MDtcblxuICAgIEBJbnB1dCgpIGZyb3plbldpZHRoOiBzdHJpbmc7XG5cbiAgICAvKiBAZGVwcmVjYXRlZCAqL1xuICAgIF9yZXNwb25zaXZlOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGdldCByZXNwb25zaXZlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2l2ZTtcbiAgICB9XG4gICAgc2V0IHJlc3BvbnNpdmUodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Jlc3BvbnNpdmUgPSB2YWw7XG4gICAgICAgIGNvbnNvbGUud2FybigncmVzcG9uc2l2ZSBwcm9wZXJ5IGlzIGRlcHJlY2F0ZWQgYXMgdGFibGUgaXMgYWx3YXlzIHJlc3BvbnNpdmUgd2l0aCBzY3JvbGxhYmxlIGJlaGF2aW9yLicpO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGNvbnRleHRNZW51OiBhbnk7XG5cbiAgICBASW5wdXQoKSByZXNpemFibGVDb2x1bW5zOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgY29sdW1uUmVzaXplTW9kZTogc3RyaW5nID0gJ2ZpdCc7XG5cbiAgICBASW5wdXQoKSByZW9yZGVyYWJsZUNvbHVtbnM6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBsb2FkaW5nOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbG9hZGluZ0ljb246IHN0cmluZyA9ICdwaSBwaS1zcGlubmVyJztcblxuICAgIEBJbnB1dCgpIHNob3dMb2FkZXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgcm93SG92ZXI6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBjdXN0b21Tb3J0OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc2hvd0luaXRpYWxTb3J0QmFkZ2U6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYXV0b0xheW91dDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGV4cG9ydEZ1bmN0aW9uO1xuXG4gICAgQElucHV0KCkgZXhwb3J0SGVhZGVyOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdGF0ZUtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc3RhdGVTdG9yYWdlOiBzdHJpbmcgPSAnc2Vzc2lvbic7XG5cbiAgICBASW5wdXQoKSBlZGl0TW9kZTogc3RyaW5nID0gJ2NlbGwnO1xuXG4gICAgQElucHV0KCkgZ3JvdXBSb3dzQnk6IGFueTtcblxuICAgIEBJbnB1dCgpIGdyb3VwUm93c0J5T3JkZXI6IG51bWJlciA9IDE7XG5cbiAgICBASW5wdXQoKSByZXNwb25zaXZlTGF5b3V0OiBzdHJpbmcgPSAnc2Nyb2xsJztcblxuICAgIEBJbnB1dCgpIGJyZWFrcG9pbnQ6IHN0cmluZyA9ICc5NjBweCc7XG5cbiAgICBAT3V0cHV0KCkgb25Sb3dTZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uUm93VW5zZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uUGFnZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Tb3J0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkZpbHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25MYXp5TG9hZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Sb3dFeHBhbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uUm93Q29sbGFwc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ29udGV4dE1lbnVTZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ29sUmVzaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkNvbFJlb3JkZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uUm93UmVvcmRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25FZGl0SW5pdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25FZGl0Q29tcGxldGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRWRpdENhbmNlbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IZWFkZXJDaGVja2JveFRvZ2dsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgc29ydEZ1bmN0aW9uOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBmaXJzdENoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgcm93c0NoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TdGF0ZVNhdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU3RhdGVSZXN0b3JlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Jlc2l6ZUhlbHBlcicpIHJlc2l6ZUhlbHBlclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Jlb3JkZXJJbmRpY2F0b3JVcCcpIHJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Jlb3JkZXJJbmRpY2F0b3JEb3duJykgcmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCd3cmFwcGVyJykgd3JhcHBlclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3RhYmxlJykgdGFibGVWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCd0aGVhZCcpIHRhYmxlSGVhZGVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgndGZvb3QnKSB0YWJsZUZvb3RlclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Njcm9sbGVyJykgc2Nyb2xsZXI6IFNjcm9sbGVyO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxQcmltZVRlbXBsYXRlPjtcblxuICAgIC8qIEBkZXByZWNhdGVkICovXG4gICAgX3ZpcnR1YWxSb3dIZWlnaHQ6IG51bWJlciA9IDI4O1xuICAgIEBJbnB1dCgpIGdldCB2aXJ0dWFsUm93SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl92aXJ0dWFsUm93SGVpZ2h0O1xuICAgIH1cbiAgICBzZXQgdmlydHVhbFJvd0hlaWdodCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl92aXJ0dWFsUm93SGVpZ2h0ID0gdmFsO1xuICAgICAgICBjb25zb2xlLndhcm4oJ1RoZSB2aXJ0dWFsUm93SGVpZ2h0IHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQsIHVzZSB2aXJ0dWFsU2Nyb2xsSXRlbVNpemUgcHJvcGVydHkgaW5zdGVhZC4nKTtcbiAgICB9XG5cbiAgICBfdmFsdWU6IGFueVtdID0gW107XG5cbiAgICBfY29sdW1uczogYW55W107XG5cbiAgICBfdG90YWxSZWNvcmRzOiBudW1iZXIgPSAwO1xuXG4gICAgX2ZpcnN0OiBudW1iZXIgPSAwO1xuXG4gICAgX3Jvd3M6IG51bWJlcjtcblxuICAgIGZpbHRlcmVkVmFsdWU6IGFueVtdO1xuXG4gICAgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBoZWFkZXJHcm91cGVkVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBib2R5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBsb2FkaW5nQm9keVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgY2FwdGlvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZnJvemVuUm93c1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmb290ZXJHcm91cGVkVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBzdW1tYXJ5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBjb2xHcm91cFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZXhwYW5kZWRSb3dUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGdyb3VwSGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBncm91cEZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcm93c3BhblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZnJvemVuRXhwYW5kZWRSb3dUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZyb3plbkhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZnJvemVuQm9keVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZnJvemVuRm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmcm96ZW5Db2xHcm91cFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZW1wdHlNZXNzYWdlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBwYWdpbmF0b3JMZWZ0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBwYWdpbmF0b3JSaWdodFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcGFnaW5hdG9yRHJvcGRvd25JdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBzZWxlY3Rpb25LZXlzOiBhbnkgPSB7fTtcblxuICAgIGxhc3RSZXNpemVySGVscGVyWDogbnVtYmVyO1xuXG4gICAgcmVvcmRlckljb25XaWR0aDogbnVtYmVyO1xuXG4gICAgcmVvcmRlckljb25IZWlnaHQ6IG51bWJlcjtcblxuICAgIGRyYWdnZWRDb2x1bW46IGFueTtcblxuICAgIGRyYWdnZWRSb3dJbmRleDogbnVtYmVyO1xuXG4gICAgZHJvcHBlZFJvd0luZGV4OiBudW1iZXI7XG5cbiAgICByb3dEcmFnZ2luZzogYm9vbGVhbjtcblxuICAgIGRyb3BQb3NpdGlvbjogbnVtYmVyO1xuXG4gICAgZWRpdGluZ0NlbGw6IEVsZW1lbnQ7XG5cbiAgICBlZGl0aW5nQ2VsbERhdGE6IGFueTtcblxuICAgIGVkaXRpbmdDZWxsRmllbGQ6IGFueTtcblxuICAgIGVkaXRpbmdDZWxsUm93SW5kZXg6IG51bWJlcjtcblxuICAgIHNlbGZDbGljazogYm9vbGVhbjtcblxuICAgIGRvY3VtZW50RWRpdExpc3RlbmVyOiBhbnk7XG5cbiAgICBfbXVsdGlTb3J0TWV0YTogU29ydE1ldGFbXTtcblxuICAgIF9zb3J0RmllbGQ6IHN0cmluZztcblxuICAgIF9zb3J0T3JkZXI6IG51bWJlciA9IDE7XG5cbiAgICBwcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb246IGJvb2xlYW47XG5cbiAgICBfc2VsZWN0aW9uOiBhbnk7XG5cbiAgICBfc2VsZWN0QWxsOiBib29sZWFuIHwgbnVsbCA9IG51bGw7XG5cbiAgICBhbmNob3JSb3dJbmRleDogbnVtYmVyO1xuXG4gICAgcmFuZ2VSb3dJbmRleDogbnVtYmVyO1xuXG4gICAgZmlsdGVyVGltZW91dDogYW55O1xuXG4gICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG5cbiAgICByb3dUb3VjaGVkOiBib29sZWFuO1xuXG4gICAgcmVzdG9yaW5nU29ydDogYm9vbGVhbjtcblxuICAgIHJlc3RvcmluZ0ZpbHRlcjogYm9vbGVhbjtcblxuICAgIHN0YXRlUmVzdG9yZWQ6IGJvb2xlYW47XG5cbiAgICBjb2x1bW5PcmRlclN0YXRlUmVzdG9yZWQ6IGJvb2xlYW47XG5cbiAgICBjb2x1bW5XaWR0aHNTdGF0ZTogc3RyaW5nO1xuXG4gICAgdGFibGVXaWR0aFN0YXRlOiBzdHJpbmc7XG5cbiAgICBvdmVybGF5U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICByZXNpemVDb2x1bW5FbGVtZW50O1xuXG4gICAgY29sdW1uUmVzaXppbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHJvd0dyb3VwSGVhZGVyU3R5bGVPYmplY3Q6IGFueSA9IHt9O1xuXG4gICAgaWQ6IHN0cmluZyA9IFVuaXF1ZUNvbXBvbmVudElkKCk7XG5cbiAgICBzdHlsZUVsZW1lbnQ6IGFueTtcblxuICAgIHJlc3BvbnNpdmVTdHlsZUVsZW1lbnQ6IGFueTtcblxuICAgIHByaXZhdGUgd2luZG93OiBXaW5kb3c7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsXG4gICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55LFxuICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICAgICAgcHVibGljIHpvbmU6IE5nWm9uZSxcbiAgICAgICAgcHVibGljIHRhYmxlU2VydmljZTogVGFibGVTZXJ2aWNlLFxuICAgICAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwdWJsaWMgZmlsdGVyU2VydmljZTogRmlsdGVyU2VydmljZSxcbiAgICAgICAgcHVibGljIG92ZXJsYXlTZXJ2aWNlOiBPdmVybGF5U2VydmljZVxuICAgICkge1xuICAgICAgICB0aGlzLndpbmRvdyA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcgYXMgV2luZG93O1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy5sYXp5ICYmIHRoaXMubGF6eUxvYWRPbkluaXQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy52aXJ0dWFsU2Nyb2xsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkxhenlMb2FkLmVtaXQodGhpcy5jcmVhdGVMYXp5TG9hZE1ldGFkYXRhKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5yZXN0b3JpbmdGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmluZ0ZpbHRlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2l2ZUxheW91dCA9PT0gJ3N0YWNrJyAmJiAhdGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJlc3BvbnNpdmVTdHlsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2FwdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FwdGlvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXJncm91cGVkJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJHcm91cGVkVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2JvZHknOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHlUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbG9hZGluZ2JvZHknOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmdCb2R5VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zvb3Rlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9vdGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zvb3Rlcmdyb3VwZWQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvb3Rlckdyb3VwZWRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc3VtbWFyeSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyeVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb2xncm91cCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sR3JvdXBUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncm93ZXhwYW5zaW9uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBhbmRlZFJvd1RlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdncm91cGhlYWRlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBIZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncm93c3Bhbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93c3BhblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdncm91cGZvb3Rlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBGb290ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZnJvemVucm93cyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJvemVuUm93c1RlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmcm96ZW5oZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZyb3plbkhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmcm96ZW5ib2R5JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm96ZW5Cb2R5VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zyb3plbmZvb3Rlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJvemVuRm9vdGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zyb3plbmNvbGdyb3VwJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm96ZW5Db2xHcm91cFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmcm96ZW5yb3dleHBhbnNpb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZyb3plbkV4cGFuZGVkUm93VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2VtcHR5bWVzc2FnZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1wdHlNZXNzYWdlVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3BhZ2luYXRvcmxlZnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvckxlZnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncGFnaW5hdG9ycmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvclJpZ2h0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3BhZ2luYXRvcmRyb3Bkb3duaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yRHJvcGRvd25JdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkgJiYgdGhpcy5yZXNpemFibGVDb2x1bW5zKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVDb2x1bW5XaWR0aHMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZTogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkgJiYgIXRoaXMuc3RhdGVSZXN0b3JlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZVN0YXRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gc2ltcGxlQ2hhbmdlLnZhbHVlLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmxhenkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsUmVjb3JkcyA9IHRoaXMuX3ZhbHVlID8gdGhpcy5fdmFsdWUubGVuZ3RoIDogMDtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09ICdzaW5nbGUnICYmICh0aGlzLnNvcnRGaWVsZCB8fCB0aGlzLmdyb3VwUm93c0J5KSkgdGhpcy5zb3J0U2luZ2xlKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zb3J0TW9kZSA9PSAnbXVsdGlwbGUnICYmICh0aGlzLm11bHRpU29ydE1ldGEgfHwgdGhpcy5ncm91cFJvd3NCeSkpIHRoaXMuc29ydE11bHRpcGxlKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5oYXNGaWx0ZXIoKSlcbiAgICAgICAgICAgICAgICAgICAgLy9zb3J0IGFscmVhZHkgZmlsdGVyc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWx0ZXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25WYWx1ZUNoYW5nZShzaW1wbGVDaGFuZ2UudmFsdWUuY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UuY29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5fY29sdW1ucyA9IHNpbXBsZUNoYW5nZS5jb2x1bW5zLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uQ29sdW1uc0NoYW5nZShzaW1wbGVDaGFuZ2UuY29sdW1ucy5jdXJyZW50VmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fY29sdW1ucyAmJiB0aGlzLmlzU3RhdGVmdWwoKSAmJiB0aGlzLnJlb3JkZXJhYmxlQ29sdW1ucyAmJiAhdGhpcy5jb2x1bW5PcmRlclN0YXRlUmVzdG9yZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVDb2x1bW5PcmRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5zb3J0RmllbGQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRGaWVsZCA9IHNpbXBsZUNoYW5nZS5zb3J0RmllbGQuY3VycmVudFZhbHVlO1xuXG4gICAgICAgICAgICAvL2F2b2lkIHRyaWdnZXJpbmcgbGF6eSBsb2FkIHByaW9yIHRvIGxhenkgaW5pdGlhbGl6YXRpb24gYXQgb25Jbml0XG4gICAgICAgICAgICBpZiAoIXRoaXMubGF6eSB8fCB0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc29ydE1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydFNpbmdsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UuZ3JvdXBSb3dzQnkpIHtcbiAgICAgICAgICAgIC8vYXZvaWQgdHJpZ2dlcmluZyBsYXp5IGxvYWQgcHJpb3IgdG8gbGF6eSBpbml0aWFsaXphdGlvbiBhdCBvbkluaXRcbiAgICAgICAgICAgIGlmICghdGhpcy5sYXp5IHx8IHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0U2luZ2xlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5zb3J0T3JkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRPcmRlciA9IHNpbXBsZUNoYW5nZS5zb3J0T3JkZXIuY3VycmVudFZhbHVlO1xuXG4gICAgICAgICAgICAvL2F2b2lkIHRyaWdnZXJpbmcgbGF6eSBsb2FkIHByaW9yIHRvIGxhenkgaW5pdGlhbGl6YXRpb24gYXQgb25Jbml0XG4gICAgICAgICAgICBpZiAoIXRoaXMubGF6eSB8fCB0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc29ydE1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydFNpbmdsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UuZ3JvdXBSb3dzQnlPcmRlcikge1xuICAgICAgICAgICAgLy9hdm9pZCB0cmlnZ2VyaW5nIGxhenkgbG9hZCBwcmlvciB0byBsYXp5IGluaXRpYWxpemF0aW9uIGF0IG9uSW5pdFxuICAgICAgICAgICAgaWYgKCF0aGlzLmxhenkgfHwgdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRTaW5nbGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLm11bHRpU29ydE1ldGEpIHtcbiAgICAgICAgICAgIHRoaXMuX211bHRpU29ydE1ldGEgPSBzaW1wbGVDaGFuZ2UubXVsdGlTb3J0TWV0YS5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ211bHRpcGxlJyAmJiAodGhpcy5pbml0aWFsaXplZCB8fCAoIXRoaXMubGF6eSAmJiAhdGhpcy52aXJ0dWFsU2Nyb2xsKSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvcnRNdWx0aXBsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHNpbXBsZUNoYW5nZS5zZWxlY3Rpb24uY3VycmVudFZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMucHJldmVudFNlbGVjdGlvblNldHRlclByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb25LZXlzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25TZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJldmVudFNlbGVjdGlvblNldHRlclByb3BhZ2F0aW9uID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnNlbGVjdEFsbCkge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0QWxsID0gc2ltcGxlQ2hhbmdlLnNlbGVjdEFsbC5jdXJyZW50VmFsdWU7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvbktleXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblNlbGVjdGlvbkNoYW5nZSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCB2YWx1ZSgpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gICAgc2V0IHZhbHVlKHZhbDogYW55W10pIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGNvbHVtbnMoKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgICB9XG4gICAgc2V0IGNvbHVtbnMoY29sczogYW55W10pIHtcbiAgICAgICAgdGhpcy5fY29sdW1ucyA9IGNvbHM7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGZpcnN0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maXJzdDtcbiAgICB9XG4gICAgc2V0IGZpcnN0KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2ZpcnN0ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCByb3dzKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICAgIH1cbiAgICBzZXQgcm93cyh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9yb3dzID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCB0b3RhbFJlY29yZHMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUmVjb3JkcztcbiAgICB9XG4gICAgc2V0IHRvdGFsUmVjb3Jkcyh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90b3RhbFJlY29yZHMgPSB2YWw7XG4gICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uVG90YWxSZWNvcmRzQ2hhbmdlKHRoaXMuX3RvdGFsUmVjb3Jkcyk7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHNvcnRGaWVsZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc29ydEZpZWxkO1xuICAgIH1cblxuICAgIHNldCBzb3J0RmllbGQodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc29ydEZpZWxkID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzb3J0T3JkZXIoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvcnRPcmRlcjtcbiAgICB9XG4gICAgc2V0IHNvcnRPcmRlcih2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG11bHRpU29ydE1ldGEoKTogU29ydE1ldGFbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aVNvcnRNZXRhO1xuICAgIH1cblxuICAgIHNldCBtdWx0aVNvcnRNZXRhKHZhbDogU29ydE1ldGFbXSkge1xuICAgICAgICB0aGlzLl9tdWx0aVNvcnRNZXRhID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzZWxlY3Rpb24oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgc2VsZWN0aW9uKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2VsZWN0QWxsKCk6IGJvb2xlYW4gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgc2VsZWN0QWxsKHZhbDogYm9vbGVhbiB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdmFsO1xuICAgIH1cblxuICAgIGdldCBwcm9jZXNzZWREYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJlZFZhbHVlIHx8IHRoaXMudmFsdWUgfHwgW107XG4gICAgfVxuXG4gICAgZGF0YVRvUmVuZGVyKGRhdGEpIHtcbiAgICAgICAgY29uc3QgX2RhdGEgPSBkYXRhIHx8IHRoaXMucHJvY2Vzc2VkRGF0YTtcblxuICAgICAgICBpZiAoX2RhdGEgJiYgdGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0ID0gdGhpcy5sYXp5ID8gMCA6IHRoaXMuZmlyc3Q7XG4gICAgICAgICAgICByZXR1cm4gX2RhdGEuc2xpY2UoZmlyc3QsIGZpcnN0ICsgdGhpcy5yb3dzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfZGF0YTtcbiAgICB9XG5cbiAgICB1cGRhdGVTZWxlY3Rpb25LZXlzKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhS2V5ICYmIHRoaXMuX3NlbGVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLl9zZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZGF0YSBvZiB0aGlzLl9zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW1N0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKGRhdGEsIHRoaXMuZGF0YUtleSkpXSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEodGhpcy5fc2VsZWN0aW9uLCB0aGlzLmRhdGFLZXkpKV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25QYWdlQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZmlyc3QgPSBldmVudC5maXJzdDtcbiAgICAgICAgdGhpcy5yb3dzID0gZXZlbnQucm93cztcblxuICAgICAgICB0aGlzLm9uUGFnZS5lbWl0KHtcbiAgICAgICAgICAgIGZpcnN0OiB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgcm93czogdGhpcy5yb3dzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgICAgIHRoaXMub25MYXp5TG9hZC5lbWl0KHRoaXMuY3JlYXRlTGF6eUxvYWRNZXRhZGF0YSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UuZW1pdCh0aGlzLmZpcnN0KTtcbiAgICAgICAgdGhpcy5yb3dzQ2hhbmdlLmVtaXQodGhpcy5yb3dzKTtcbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25WYWx1ZUNoYW5nZSh0aGlzLnZhbHVlKTtcblxuICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuY2hvclJvd0luZGV4ID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0KGV2ZW50KSB7XG4gICAgICAgIGxldCBvcmlnaW5hbEV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudDtcblxuICAgICAgICBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRPcmRlciA9IHRoaXMuc29ydEZpZWxkID09PSBldmVudC5maWVsZCA/IHRoaXMuc29ydE9yZGVyICogLTEgOiB0aGlzLmRlZmF1bHRTb3J0T3JkZXI7XG4gICAgICAgICAgICB0aGlzLl9zb3J0RmllbGQgPSBldmVudC5maWVsZDtcblxuICAgICAgICAgICAgaWYgKHRoaXMucmVzZXRQYWdlT25Tb3J0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UuZW1pdCh0aGlzLl9maXJzdCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTY3JvbGxUb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc29ydFNpbmdsZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgICAgICBsZXQgbWV0YUtleSA9IG9yaWdpbmFsRXZlbnQubWV0YUtleSB8fCBvcmlnaW5hbEV2ZW50LmN0cmxLZXk7XG4gICAgICAgICAgICBsZXQgc29ydE1ldGEgPSB0aGlzLmdldFNvcnRNZXRhKGV2ZW50LmZpZWxkKTtcblxuICAgICAgICAgICAgaWYgKHNvcnRNZXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtZXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX211bHRpU29ydE1ldGEgPSBbeyBmaWVsZDogZXZlbnQuZmllbGQsIG9yZGVyOiBzb3J0TWV0YS5vcmRlciAqIC0xIH1dO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0UGFnZU9uU29ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdENoYW5nZS5lbWl0KHRoaXMuX2ZpcnN0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTY3JvbGxUb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRNZXRhLm9yZGVyID0gc29ydE1ldGEub3JkZXIgKiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghbWV0YUtleSB8fCAhdGhpcy5tdWx0aVNvcnRNZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX211bHRpU29ydE1ldGEgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXNldFBhZ2VPblNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UuZW1pdCh0aGlzLl9maXJzdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlTb3J0TWV0YS5wdXNoKHsgZmllbGQ6IGV2ZW50LmZpZWxkLCBvcmRlcjogdGhpcy5kZWZhdWx0U29ydE9yZGVyIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNvcnRNdWx0aXBsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hbmNob3JSb3dJbmRleCA9IG51bGw7XG4gICAgfVxuXG4gICAgc29ydFNpbmdsZSgpIHtcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5zb3J0RmllbGQgfHwgdGhpcy5ncm91cFJvd3NCeTtcbiAgICAgICAgbGV0IG9yZGVyID0gdGhpcy5zb3J0RmllbGQgPyB0aGlzLnNvcnRPcmRlciA6IHRoaXMuZ3JvdXBSb3dzQnlPcmRlcjtcbiAgICAgICAgaWYgKHRoaXMuZ3JvdXBSb3dzQnkgJiYgdGhpcy5zb3J0RmllbGQgJiYgdGhpcy5ncm91cFJvd3NCeSAhPT0gdGhpcy5zb3J0RmllbGQpIHtcbiAgICAgICAgICAgIHRoaXMuX211bHRpU29ydE1ldGEgPSBbdGhpcy5nZXRHcm91cFJvd3NNZXRhKCksIHsgZmllbGQ6IHRoaXMuc29ydEZpZWxkLCBvcmRlcjogdGhpcy5zb3J0T3JkZXIgfV07XG4gICAgICAgICAgICB0aGlzLnNvcnRNdWx0aXBsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpZWxkICYmIG9yZGVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXN0b3JpbmdTb3J0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JpbmdTb3J0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTGF6eUxvYWQuZW1pdCh0aGlzLmNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXN0b21Tb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydEZ1bmN0aW9uLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGhpcy52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGU6IHRoaXMuc29ydE1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogb3JkZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZS5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZTEgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKGRhdGExLCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUyID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShkYXRhMiwgZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZTEgPT0gbnVsbCAmJiB2YWx1ZTIgIT0gbnVsbCkgcmVzdWx0ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZTEgIT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbCkgcmVzdWx0ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlMSA9PSBudWxsICYmIHZhbHVlMiA9PSBudWxsKSByZXN1bHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlMSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHZhbHVlMiA9PT0gJ3N0cmluZycpIHJlc3VsdCA9IHZhbHVlMS5sb2NhbGVDb21wYXJlKHZhbHVlMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJlc3VsdCA9IHZhbHVlMSA8IHZhbHVlMiA/IC0xIDogdmFsdWUxID4gdmFsdWUyID8gMSA6IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciAqIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbLi4udGhpcy52YWx1ZV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzRmlsdGVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmlsdGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc29ydE1ldGE6IFNvcnRNZXRhID0ge1xuICAgICAgICAgICAgICAgIGZpZWxkOiBmaWVsZCxcbiAgICAgICAgICAgICAgICBvcmRlcjogb3JkZXJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMub25Tb3J0LmVtaXQoc29ydE1ldGEpO1xuICAgICAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25Tb3J0KHNvcnRNZXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvcnRNdWx0aXBsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JvdXBSb3dzQnkpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbXVsdGlTb3J0TWV0YSkgdGhpcy5fbXVsdGlTb3J0TWV0YSA9IFt0aGlzLmdldEdyb3VwUm93c01ldGEoKV07XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLm11bHRpU29ydE1ldGFbMF0uZmllbGQgIT09IHRoaXMuZ3JvdXBSb3dzQnkpIHRoaXMuX211bHRpU29ydE1ldGEgPSBbdGhpcy5nZXRHcm91cFJvd3NNZXRhKCksIC4uLnRoaXMuX211bHRpU29ydE1ldGFdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubXVsdGlTb3J0TWV0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGF6eSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25MYXp5TG9hZC5lbWl0KHRoaXMuY3JlYXRlTGF6eUxvYWRNZXRhZGF0YSgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1c3RvbVNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0RnVuY3Rpb24uZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogdGhpcy5zb3J0TW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpU29ydE1ldGE6IHRoaXMubXVsdGlTb3J0TWV0YVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlLnNvcnQoKGRhdGExLCBkYXRhMikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlzb3J0RmllbGQoZGF0YTEsIGRhdGEyLCB0aGlzLm11bHRpU29ydE1ldGEsIDApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFsuLi50aGlzLnZhbHVlXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNGaWx0ZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWx0ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub25Tb3J0LmVtaXQoe1xuICAgICAgICAgICAgICAgIG11bHRpc29ydG1ldGE6IHRoaXMubXVsdGlTb3J0TWV0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblNvcnQodGhpcy5tdWx0aVNvcnRNZXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG11bHRpc29ydEZpZWxkKGRhdGExLCBkYXRhMiwgbXVsdGlTb3J0TWV0YSwgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgdmFsdWUxID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShkYXRhMSwgbXVsdGlTb3J0TWV0YVtpbmRleF0uZmllbGQpO1xuICAgICAgICBjb25zdCB2YWx1ZTIgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKGRhdGEyLCBtdWx0aVNvcnRNZXRhW2luZGV4XS5maWVsZCk7XG4gICAgICAgIGlmIChPYmplY3RVdGlscy5jb21wYXJlKHZhbHVlMSwgdmFsdWUyLCB0aGlzLmZpbHRlckxvY2FsZSkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBtdWx0aVNvcnRNZXRhLmxlbmd0aCAtIDEgPiBpbmRleCA/IHRoaXMubXVsdGlzb3J0RmllbGQoZGF0YTEsIGRhdGEyLCBtdWx0aVNvcnRNZXRhLCBpbmRleCArIDEpIDogMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb21wYXJlVmFsdWVzT25Tb3J0KHZhbHVlMSwgdmFsdWUyLCBtdWx0aVNvcnRNZXRhW2luZGV4XS5vcmRlcik7XG4gICAgfVxuXG4gICAgY29tcGFyZVZhbHVlc09uU29ydCh2YWx1ZTEsIHZhbHVlMiwgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLnNvcnQodmFsdWUxLCB2YWx1ZTIsIG9yZGVyLCB0aGlzLmZpbHRlckxvY2FsZSwgdGhpcy5zb3J0T3JkZXIpO1xuICAgIH1cblxuICAgIGdldFNvcnRNZXRhKGZpZWxkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlTb3J0TWV0YSAmJiB0aGlzLm11bHRpU29ydE1ldGEubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubXVsdGlTb3J0TWV0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm11bHRpU29ydE1ldGFbaV0uZmllbGQgPT09IGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRpU29ydE1ldGFbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaXNTb3J0ZWQoZmllbGQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvcnRGaWVsZCAmJiB0aGlzLnNvcnRGaWVsZCA9PT0gZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgICAgICAgbGV0IHNvcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlTb3J0TWV0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tdWx0aVNvcnRNZXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm11bHRpU29ydE1ldGFbaV0uZmllbGQgPT0gZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzb3J0ZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVSb3dDbGljayhldmVudCkge1xuICAgICAgICBsZXQgdGFyZ2V0ID0gPEhUTUxFbGVtZW50PmV2ZW50Lm9yaWdpbmFsRXZlbnQudGFyZ2V0O1xuICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9IHRhcmdldC5ub2RlTmFtZTtcbiAgICAgICAgbGV0IHBhcmVudE5vZGUgPSB0YXJnZXQucGFyZW50RWxlbWVudCAmJiB0YXJnZXQucGFyZW50RWxlbWVudC5ub2RlTmFtZTtcbiAgICAgICAgaWYgKHRhcmdldE5vZGUgPT0gJ0lOUFVUJyB8fCB0YXJnZXROb2RlID09ICdCVVRUT04nIHx8IHRhcmdldE5vZGUgPT0gJ0EnIHx8IHBhcmVudE5vZGUgPT0gJ0lOUFVUJyB8fCBwYXJlbnROb2RlID09ICdCVVRUT04nIHx8IHBhcmVudE5vZGUgPT0gJ0EnIHx8IERvbUhhbmRsZXIuaGFzQ2xhc3MoZXZlbnQub3JpZ2luYWxFdmVudC50YXJnZXQsICdwLWNsaWNrYWJsZScpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlKSB7XG4gICAgICAgICAgICBsZXQgcm93RGF0YSA9IGV2ZW50LnJvd0RhdGE7XG4gICAgICAgICAgICBsZXQgcm93SW5kZXggPSBldmVudC5yb3dJbmRleDtcblxuICAgICAgICAgICAgdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZVNlbGVjdGlvbk1vZGUoKSAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5ICYmIHRoaXMuYW5jaG9yUm93SW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yYW5nZVJvd0luZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvblJhbmdlKGV2ZW50Lm9yaWdpbmFsRXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VSb3dJbmRleCA9IHJvd0luZGV4O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UmFuZ2UoZXZlbnQub3JpZ2luYWxFdmVudCwgcm93SW5kZXgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLmlzU2VsZWN0ZWQocm93RGF0YSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdGVkICYmICF0aGlzLmlzUm93U2VsZWN0YWJsZShyb3dEYXRhLCByb3dJbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBtZXRhU2VsZWN0aW9uID0gdGhpcy5yb3dUb3VjaGVkID8gZmFsc2UgOiB0aGlzLm1ldGFLZXlTZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgbGV0IGRhdGFLZXlWYWx1ZSA9IHRoaXMuZGF0YUtleSA/IFN0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIHRoaXMuZGF0YUtleSkpIDogbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmFuY2hvclJvd0luZGV4ID0gcm93SW5kZXg7XG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZVJvd0luZGV4ID0gcm93SW5kZXg7XG5cbiAgICAgICAgICAgICAgICBpZiAobWV0YVNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWV0YUtleSA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQubWV0YUtleSB8fCBldmVudC5vcmlnaW5hbEV2ZW50LmN0cmxLZXk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkICYmIG1ldGFLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0aW9uTW9kZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0aW9uSW5kZXggPSB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKHJvd0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLmZpbHRlcigodmFsLCBpKSA9PiBpICE9IHNlbGVjdGlvbkluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Sb3dVbnNlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgZGF0YTogcm93RGF0YSwgdHlwZTogJ3JvdycgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NpbmdsZVNlbGVjdGlvbk1vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHJvd0RhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdChyb3dEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTXVsdGlwbGVTZWxlY3Rpb25Nb2RlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbiB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gWy4uLnRoaXMuc2VsZWN0aW9uLCByb3dEYXRhXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Sb3dTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdyb3cnLCBpbmRleDogcm93SW5kZXggfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUm93VW5zZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdyb3cnLCBpbmRleDogcm93SW5kZXggfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHJvd0RhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJvd1NlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgZGF0YTogcm93RGF0YSwgdHlwZTogJ3JvdycsIGluZGV4OiByb3dJbmRleCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihyb3dEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5maWx0ZXIoKHZhbCwgaSkgPT4gaSAhPSBzZWxlY3Rpb25JbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJvd1Vuc2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LCBkYXRhOiByb3dEYXRhLCB0eXBlOiAncm93JywgaW5kZXg6IHJvd0luZGV4IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24gPyBbLi4udGhpcy5zZWxlY3Rpb24sIHJvd0RhdGFdIDogW3Jvd0RhdGFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Sb3dTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdyb3cnLCBpbmRleDogcm93SW5kZXggfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblNlbGVjdGlvbkNoYW5nZSgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3dUb3VjaGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaGFuZGxlUm93VG91Y2hFbmQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5yb3dUb3VjaGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSb3dSaWdodENsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51KSB7XG4gICAgICAgICAgICBjb25zdCByb3dEYXRhID0gZXZlbnQucm93RGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gZXZlbnQucm93SW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51U2VsZWN0aW9uTW9kZSA9PT0gJ3NlcGFyYXRlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVTZWxlY3Rpb24gPSByb3dEYXRhO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVTZWxlY3Rpb25DaGFuZ2UuZW1pdChyb3dEYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29udGV4dE1lbnVTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGRhdGE6IHJvd0RhdGEsIGluZGV4OiBldmVudC5yb3dJbmRleCB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LnNob3coZXZlbnQub3JpZ2luYWxFdmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25Db250ZXh0TWVudShyb3dEYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250ZXh0TWVudVNlbGVjdGlvbk1vZGUgPT09ICdqb2ludCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXZlbnRTZWxlY3Rpb25TZXR0ZXJQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5pc1NlbGVjdGVkKHJvd0RhdGEpO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhS2V5VmFsdWUgPSB0aGlzLmRhdGFLZXkgPyBTdHJpbmcoT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dEYXRhLCB0aGlzLmRhdGFLZXkpKSA6IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1Jvd1NlbGVjdGFibGUocm93RGF0YSwgcm93SW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NpbmdsZVNlbGVjdGlvbk1vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSByb3dEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdChyb3dEYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTXVsdGlwbGVTZWxlY3Rpb25Nb2RlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uID8gWy4uLnRoaXMuc2VsZWN0aW9uLCByb3dEYXRhXSA6IFtyb3dEYXRhXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25TZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LnNob3coZXZlbnQub3JpZ2luYWxFdmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbnRleHRNZW51U2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgZGF0YTogcm93RGF0YSwgaW5kZXg6IGV2ZW50LnJvd0luZGV4IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZWN0UmFuZ2UoZXZlbnQ6IE1vdXNlRXZlbnQsIHJvd0luZGV4OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHJhbmdlU3RhcnQsIHJhbmdlRW5kO1xuXG4gICAgICAgIGlmICh0aGlzLmFuY2hvclJvd0luZGV4ID4gcm93SW5kZXgpIHtcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSByb3dJbmRleDtcbiAgICAgICAgICAgIHJhbmdlRW5kID0gdGhpcy5hbmNob3JSb3dJbmRleDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFuY2hvclJvd0luZGV4IDwgcm93SW5kZXgpIHtcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSB0aGlzLmFuY2hvclJvd0luZGV4O1xuICAgICAgICAgICAgcmFuZ2VFbmQgPSByb3dJbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSByb3dJbmRleDtcbiAgICAgICAgICAgIHJhbmdlRW5kID0gcm93SW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sYXp5ICYmIHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICByYW5nZVN0YXJ0IC09IHRoaXMuZmlyc3Q7XG4gICAgICAgICAgICByYW5nZUVuZCAtPSB0aGlzLmZpcnN0O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJhbmdlUm93c0RhdGEgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHJhbmdlU3RhcnQ7IGkgPD0gcmFuZ2VFbmQ7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJhbmdlUm93RGF0YSA9IHRoaXMuZmlsdGVyZWRWYWx1ZSA/IHRoaXMuZmlsdGVyZWRWYWx1ZVtpXSA6IHRoaXMudmFsdWVbaV07XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChyYW5nZVJvd0RhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzUm93U2VsZWN0YWJsZShyYW5nZVJvd0RhdGEsIHJvd0luZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByYW5nZVJvd3NEYXRhLnB1c2gocmFuZ2VSb3dEYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBbLi4udGhpcy5zZWxlY3Rpb24sIHJhbmdlUm93RGF0YV07XG4gICAgICAgICAgICAgICAgbGV0IGRhdGFLZXlWYWx1ZTogc3RyaW5nID0gdGhpcy5kYXRhS2V5ID8gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocmFuZ2VSb3dEYXRhLCB0aGlzLmRhdGFLZXkpKSA6IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICB0aGlzLm9uUm93U2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgZGF0YTogcmFuZ2VSb3dzRGF0YSwgdHlwZTogJ3JvdycgfSk7XG4gICAgfVxuXG4gICAgY2xlYXJTZWxlY3Rpb25SYW5nZShldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBsZXQgcmFuZ2VTdGFydCwgcmFuZ2VFbmQ7XG5cbiAgICAgICAgaWYgKHRoaXMucmFuZ2VSb3dJbmRleCA+IHRoaXMuYW5jaG9yUm93SW5kZXgpIHtcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSB0aGlzLmFuY2hvclJvd0luZGV4O1xuICAgICAgICAgICAgcmFuZ2VFbmQgPSB0aGlzLnJhbmdlUm93SW5kZXg7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yYW5nZVJvd0luZGV4IDwgdGhpcy5hbmNob3JSb3dJbmRleCkge1xuICAgICAgICAgICAgcmFuZ2VTdGFydCA9IHRoaXMucmFuZ2VSb3dJbmRleDtcbiAgICAgICAgICAgIHJhbmdlRW5kID0gdGhpcy5hbmNob3JSb3dJbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSB0aGlzLnJhbmdlUm93SW5kZXg7XG4gICAgICAgICAgICByYW5nZUVuZCA9IHRoaXMucmFuZ2VSb3dJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSByYW5nZVN0YXJ0OyBpIDw9IHJhbmdlRW5kOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByYW5nZVJvd0RhdGEgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihyYW5nZVJvd0RhdGEpO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24uZmlsdGVyKCh2YWwsIGkpID0+IGkgIT0gc2VsZWN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgbGV0IGRhdGFLZXlWYWx1ZTogc3RyaW5nID0gdGhpcy5kYXRhS2V5ID8gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocmFuZ2VSb3dEYXRhLCB0aGlzLmRhdGFLZXkpKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vblJvd1Vuc2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgZGF0YTogcmFuZ2VSb3dEYXRhLCB0eXBlOiAncm93JyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzU2VsZWN0ZWQocm93RGF0YSkge1xuICAgICAgICBpZiAocm93RGF0YSAmJiB0aGlzLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbktleXNbT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dEYXRhLCB0aGlzLmRhdGFLZXkpXSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnNlbGVjdGlvbikpIHJldHVybiB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKHJvd0RhdGEpID4gLTE7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5lcXVhbHMocm93RGF0YSwgdGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZpbmRJbmRleEluU2VsZWN0aW9uKHJvd0RhdGE6IGFueSkge1xuICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IC0xO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb24gJiYgdGhpcy5zZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXF1YWxzKHJvd0RhdGEsIHRoaXMuc2VsZWN0aW9uW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICBpc1Jvd1NlbGVjdGFibGUoZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMucm93U2VsZWN0YWJsZSAmJiAhdGhpcy5yb3dTZWxlY3RhYmxlKHsgZGF0YSwgaW5kZXggfSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRvZ2dsZVJvd1dpdGhSYWRpbyhldmVudDogYW55LCByb3dEYXRhOiBhbnkpIHtcbiAgICAgICAgdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24gPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbiAhPSByb3dEYXRhKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNSb3dTZWxlY3RhYmxlKHJvd0RhdGEsIGV2ZW50LnJvd0luZGV4KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gcm93RGF0YTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5vblJvd1NlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgaW5kZXg6IGV2ZW50LnJvd0luZGV4LCBkYXRhOiByb3dEYXRhLCB0eXBlOiAncmFkaW9idXR0b24nIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW1N0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIHRoaXMuZGF0YUtleSkpXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLm9uUm93VW5zZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGluZGV4OiBldmVudC5yb3dJbmRleCwgZGF0YTogcm93RGF0YSwgdHlwZTogJ3JhZGlvYnV0dG9uJyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uU2VsZWN0aW9uQ2hhbmdlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlUm93V2l0aENoZWNrYm94KGV2ZW50LCByb3dEYXRhOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbiB8fCBbXTtcbiAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5pc1NlbGVjdGVkKHJvd0RhdGEpO1xuICAgICAgICBsZXQgZGF0YUtleVZhbHVlID0gdGhpcy5kYXRhS2V5ID8gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kYXRhS2V5KSkgOiBudWxsO1xuICAgICAgICB0aGlzLnByZXZlbnRTZWxlY3Rpb25TZXR0ZXJQcm9wYWdhdGlvbiA9IHRydWU7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uSW5kZXggPSB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKHJvd0RhdGEpO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24uZmlsdGVyKCh2YWwsIGkpID0+IGkgIT0gc2VsZWN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLm9uUm93VW5zZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIGluZGV4OiBldmVudC5yb3dJbmRleCwgZGF0YTogcm93RGF0YSwgdHlwZTogJ2NoZWNrYm94JyB9KTtcbiAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNSb3dTZWxlY3RhYmxlKHJvd0RhdGEsIGV2ZW50LnJvd0luZGV4KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24gPyBbLi4udGhpcy5zZWxlY3Rpb24sIHJvd0RhdGFdIDogW3Jvd0RhdGFdO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLm9uUm93U2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LCBpbmRleDogZXZlbnQucm93SW5kZXgsIGRhdGE6IHJvd0RhdGEsIHR5cGU6ICdjaGVja2JveCcgfSk7XG4gICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25TZWxlY3Rpb25DaGFuZ2UoKTtcblxuICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVSb3dzV2l0aENoZWNrYm94KGV2ZW50OiBFdmVudCwgY2hlY2s6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdEFsbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RBbGxDaGFuZ2UuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBjaGVja2VkOiBjaGVjayB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnNlbGVjdGlvblBhZ2VPbmx5ID8gdGhpcy5kYXRhVG9SZW5kZXIodGhpcy5wcm9jZXNzZWREYXRhKSA6IHRoaXMucHJvY2Vzc2VkRGF0YTtcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblBhZ2VPbmx5ICYmIHRoaXMuX3NlbGVjdGlvbiA/IHRoaXMuX3NlbGVjdGlvbi5maWx0ZXIoKHMpID0+ICFkYXRhLnNvbWUoKGQpID0+IHRoaXMuZXF1YWxzKHMsIGQpKSkgOiBbXTtcblxuICAgICAgICAgICAgaWYgKGNoZWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uID0gdGhpcy5mcm96ZW5WYWx1ZSA/IFsuLi5zZWxlY3Rpb24sIC4uLnRoaXMuZnJvemVuVmFsdWUsIC4uLmRhdGFdIDogWy4uLnNlbGVjdGlvbiwgLi4uZGF0YV07XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uID0gdGhpcy5yb3dTZWxlY3RhYmxlID8gc2VsZWN0aW9uLmZpbHRlcigoZGF0YSwgaW5kZXgpID0+IHRoaXMucm93U2VsZWN0YWJsZSh7IGRhdGEsIGluZGV4IH0pKSA6IHNlbGVjdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb25LZXlzKCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuX3NlbGVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblNlbGVjdGlvbkNoYW5nZSgpO1xuICAgICAgICAgICAgdGhpcy5vbkhlYWRlckNoZWNrYm94VG9nZ2xlLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgY2hlY2tlZDogY2hlY2sgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzU3RhdGVmdWwoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcXVhbHMoZGF0YTEsIGRhdGEyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmVTZWxlY3Rpb25CeSA9PT0gJ2VxdWFscycgPyBkYXRhMSA9PT0gZGF0YTIgOiBPYmplY3RVdGlscy5lcXVhbHMoZGF0YTEsIGRhdGEyLCB0aGlzLmRhdGFLZXkpO1xuICAgIH1cblxuICAgIC8qIExlZ2FjeSBGaWx0ZXJpbmcgZm9yIGN1c3RvbSBlbGVtZW50cyAqL1xuICAgIGZpbHRlcih2YWx1ZTogYW55LCBmaWVsZDogc3RyaW5nLCBtYXRjaE1vZGU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5maWx0ZXJUaW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNGaWx0ZXJCbGFuayh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyc1tmaWVsZF0gPSB7IHZhbHVlOiB2YWx1ZSwgbWF0Y2hNb2RlOiBtYXRjaE1vZGUgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5maWx0ZXJzW2ZpZWxkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlsdGVyVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZmlsdGVyKCk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlclRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9LCB0aGlzLmZpbHRlckRlbGF5KTtcblxuICAgICAgICB0aGlzLmFuY2hvclJvd0luZGV4ID0gbnVsbDtcbiAgICB9XG5cbiAgICBmaWx0ZXJHbG9iYWwodmFsdWUsIG1hdGNoTW9kZSkge1xuICAgICAgICB0aGlzLmZpbHRlcih2YWx1ZSwgJ2dsb2JhbCcsIG1hdGNoTW9kZSk7XG4gICAgfVxuXG4gICAgaXNGaWx0ZXJCbGFuayhmaWx0ZXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoZmlsdGVyICE9PSBudWxsICYmIGZpbHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnICYmIGZpbHRlci50cmltKCkubGVuZ3RoID09IDApIHx8IChBcnJheS5pc0FycmF5KGZpbHRlcikgJiYgZmlsdGVyLmxlbmd0aCA9PSAwKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZmlsdGVyKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVzdG9yaW5nRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UuZW1pdCh0aGlzLmZpcnN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgICAgIHRoaXMub25MYXp5TG9hZC5lbWl0KHRoaXMuY3JlYXRlTGF6eUxvYWRNZXRhZGF0YSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc0ZpbHRlcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFJlY29yZHMgPSB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGdsb2JhbEZpbHRlckZpZWxkc0FycmF5O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnNbJ2dsb2JhbCddKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb2x1bW5zICYmICF0aGlzLmdsb2JhbEZpbHRlckZpZWxkcykgdGhyb3cgbmV3IEVycm9yKCdHbG9iYWwgZmlsdGVyaW5nIHJlcXVpcmVzIGR5bmFtaWMgY29sdW1ucyBvciBnbG9iYWxGaWx0ZXJGaWVsZHMgdG8gYmUgZGVmaW5lZC4nKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBnbG9iYWxGaWx0ZXJGaWVsZHNBcnJheSA9IHRoaXMuZ2xvYmFsRmlsdGVyRmllbGRzIHx8IHRoaXMuY29sdW1ucztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkVmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYWxNYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBnbG9iYWxNYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYWxGaWx0ZXJlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5maWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzLmhhc093blByb3BlcnR5KHByb3ApICYmIHByb3AgIT09ICdnbG9iYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxGaWx0ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlckZpZWxkID0gcHJvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyTWV0YSA9IHRoaXMuZmlsdGVyc1tmaWx0ZXJGaWVsZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmaWx0ZXJNZXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBtZXRhIG9mIGZpbHRlck1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsTWF0Y2ggPSB0aGlzLmV4ZWN1dGVMb2NhbEZpbHRlcihmaWx0ZXJGaWVsZCwgdGhpcy52YWx1ZVtpXSwgbWV0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgobWV0YS5vcGVyYXRvciA9PT0gRmlsdGVyT3BlcmF0b3IuT1IgJiYgbG9jYWxNYXRjaCkgfHwgKG1ldGEub3BlcmF0b3IgPT09IEZpbHRlck9wZXJhdG9yLkFORCAmJiAhbG9jYWxNYXRjaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsTWF0Y2ggPSB0aGlzLmV4ZWN1dGVMb2NhbEZpbHRlcihmaWx0ZXJGaWVsZCwgdGhpcy52YWx1ZVtpXSwgZmlsdGVyTWV0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NhbE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnNbJ2dsb2JhbCddICYmICFnbG9iYWxNYXRjaCAmJiBnbG9iYWxGaWx0ZXJGaWVsZHNBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBnbG9iYWxGaWx0ZXJGaWVsZHNBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBnbG9iYWxGaWx0ZXJGaWVsZCA9IGdsb2JhbEZpbHRlckZpZWxkc0FycmF5W2pdLmZpZWxkIHx8IGdsb2JhbEZpbHRlckZpZWxkc0FycmF5W2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1hdGNoID0gdGhpcy5maWx0ZXJTZXJ2aWNlLmZpbHRlcnNbKDxGaWx0ZXJNZXRhZGF0YT50aGlzLmZpbHRlcnNbJ2dsb2JhbCddKS5tYXRjaE1vZGVdKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHRoaXMudmFsdWVbaV0sIGdsb2JhbEZpbHRlckZpZWxkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDxGaWx0ZXJNZXRhZGF0YT50aGlzLmZpbHRlcnNbJ2dsb2JhbCddKS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJMb2NhbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXRjaGVzOiBib29sZWFuO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzWydnbG9iYWwnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IGxvY2FsRmlsdGVyZWQgPyBsb2NhbEZpbHRlcmVkICYmIGxvY2FsTWF0Y2ggJiYgZ2xvYmFsTWF0Y2ggOiBnbG9iYWxNYXRjaDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSBsb2NhbEZpbHRlcmVkICYmIGxvY2FsTWF0Y2g7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZFZhbHVlLnB1c2godGhpcy52YWx1ZVtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJlZFZhbHVlLmxlbmd0aCA9PT0gdGhpcy52YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFJlY29yZHMgPSB0aGlzLmZpbHRlcmVkVmFsdWUgPyB0aGlzLmZpbHRlcmVkVmFsdWUubGVuZ3RoIDogdGhpcy52YWx1ZSA/IHRoaXMudmFsdWUubGVuZ3RoIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uRmlsdGVyLmVtaXQoe1xuICAgICAgICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgICAgICAgZmlsdGVyZWRWYWx1ZTogdGhpcy5maWx0ZXJlZFZhbHVlIHx8IHRoaXMudmFsdWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25WYWx1ZUNoYW5nZSh0aGlzLnZhbHVlKTtcblxuICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkgJiYgIXRoaXMucmVzdG9yaW5nRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVzdG9yaW5nRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmluZ0ZpbHRlciA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleGVjdXRlTG9jYWxGaWx0ZXIoZmllbGQ6IHN0cmluZywgcm93RGF0YTogYW55LCBmaWx0ZXJNZXRhOiBGaWx0ZXJNZXRhZGF0YSk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZmlsdGVyVmFsdWUgPSBmaWx0ZXJNZXRhLnZhbHVlO1xuICAgICAgICBsZXQgZmlsdGVyTWF0Y2hNb2RlID0gZmlsdGVyTWV0YS5tYXRjaE1vZGUgfHwgRmlsdGVyTWF0Y2hNb2RlLlNUQVJUU19XSVRIO1xuICAgICAgICBsZXQgZGF0YUZpZWxkVmFsdWUgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIGZpZWxkKTtcbiAgICAgICAgbGV0IGZpbHRlckNvbnN0cmFpbnQgPSB0aGlzLmZpbHRlclNlcnZpY2UuZmlsdGVyc1tmaWx0ZXJNYXRjaE1vZGVdO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJDb25zdHJhaW50KGRhdGFGaWVsZFZhbHVlLCBmaWx0ZXJWYWx1ZSwgdGhpcy5maWx0ZXJMb2NhbGUpO1xuICAgIH1cblxuICAgIGhhc0ZpbHRlcigpIHtcbiAgICAgICAgbGV0IGVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgcHJvcCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBlbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICFlbXB0eTtcbiAgICB9XG5cbiAgICBjcmVhdGVMYXp5TG9hZE1ldGFkYXRhKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaXJzdDogdGhpcy5maXJzdCxcbiAgICAgICAgICAgIHJvd3M6IHRoaXMucm93cyxcbiAgICAgICAgICAgIHNvcnRGaWVsZDogdGhpcy5zb3J0RmllbGQsXG4gICAgICAgICAgICBzb3J0T3JkZXI6IHRoaXMuc29ydE9yZGVyLFxuICAgICAgICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgICAgICAgZ2xvYmFsRmlsdGVyOiB0aGlzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzWydnbG9iYWwnXSA/ICg8RmlsdGVyTWV0YWRhdGE+dGhpcy5maWx0ZXJzWydnbG9iYWwnXSkudmFsdWUgOiBudWxsLFxuICAgICAgICAgICAgbXVsdGlTb3J0TWV0YTogdGhpcy5tdWx0aVNvcnRNZXRhLFxuICAgICAgICAgICAgZm9yY2VVcGRhdGU6ICgpID0+IHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9zb3J0RmllbGQgPSBudWxsO1xuICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSB0aGlzLmRlZmF1bHRTb3J0T3JkZXI7XG4gICAgICAgIHRoaXMuX211bHRpU29ydE1ldGEgPSBudWxsO1xuICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblNvcnQobnVsbCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyc1snZ2xvYmFsJ10pIHtcbiAgICAgICAgICAgICg8RmlsdGVyTWV0YWRhdGE+dGhpcy5maWx0ZXJzWydnbG9iYWwnXSkudmFsdWUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWx0ZXJlZFZhbHVlID0gbnVsbDtcbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25SZXNldENoYW5nZSgpO1xuXG4gICAgICAgIHRoaXMuZmlyc3QgPSAwO1xuICAgICAgICB0aGlzLmZpcnN0Q2hhbmdlLmVtaXQodGhpcy5maXJzdCk7XG5cbiAgICAgICAgaWYgKHRoaXMubGF6eSkge1xuICAgICAgICAgICAgdGhpcy5vbkxhenlMb2FkLmVtaXQodGhpcy5jcmVhdGVMYXp5TG9hZE1ldGFkYXRhKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50b3RhbFJlY29yZHMgPSB0aGlzLl92YWx1ZSA/IHRoaXMuX3ZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBnZXRFeHBvcnRIZWFkZXIoY29sdW1uKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5bdGhpcy5leHBvcnRIZWFkZXJdIHx8IGNvbHVtbi5oZWFkZXIgfHwgY29sdW1uLmZpZWxkO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHBvcnRDU1Yob3B0aW9ucz86IGFueSkge1xuICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgbGV0IGNzdiA9ICcnO1xuICAgICAgICBsZXQgY29sdW1ucyA9IHRoaXMuY29sdW1ucztcblxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnNlbGVjdGlvbk9ubHkpIHtcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLnNlbGVjdGlvbiB8fCBbXTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYWxsVmFsdWVzKSB7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy52YWx1ZSB8fCBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLmZpbHRlcmVkVmFsdWUgfHwgdGhpcy52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZnJvemVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSA/IFsuLi50aGlzLmZyb3plblZhbHVlLCAuLi5kYXRhXSA6IHRoaXMuZnJvemVuVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2hlYWRlcnNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uID0gY29sdW1uc1tpXTtcbiAgICAgICAgICAgIGlmIChjb2x1bW4uZXhwb3J0YWJsZSAhPT0gZmFsc2UgJiYgY29sdW1uLmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgY3N2ICs9ICdcIicgKyB0aGlzLmdldEV4cG9ydEhlYWRlcihjb2x1bW4pICsgJ1wiJztcblxuICAgICAgICAgICAgICAgIGlmIChpIDwgY29sdW1ucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNzdiArPSB0aGlzLmNzdlNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2JvZHlcbiAgICAgICAgZGF0YS5mb3JFYWNoKChyZWNvcmQsIGkpID0+IHtcbiAgICAgICAgICAgIGNzdiArPSAnXFxuJztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjb2x1bW4gPSBjb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjb2x1bW4uZXhwb3J0YWJsZSAhPT0gZmFsc2UgJiYgY29sdW1uLmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjZWxsRGF0YSA9IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocmVjb3JkLCBjb2x1bW4uZmllbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5leHBvcnRGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxEYXRhID0gdGhpcy5leHBvcnRGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNlbGxEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogY29sdW1uLmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgY2VsbERhdGEgPSBTdHJpbmcoY2VsbERhdGEpLnJlcGxhY2UoL1wiL2csICdcIlwiJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBjZWxsRGF0YSA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIGNzdiArPSAnXCInICsgY2VsbERhdGEgKyAnXCInO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgY29sdW1ucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3YgKz0gdGhpcy5jc3ZTZXBhcmF0b3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBibG9iID0gbmV3IEJsb2IoW2Nzdl0sIHtcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04OydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGxpbmsgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGluay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZG9jdW1lbnQuYm9keSwgbGluayk7XG4gICAgICAgIGlmIChsaW5rLmRvd25sb2FkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCB0aGlzLmV4cG9ydEZpbGVuYW1lICsgJy5jc3YnKTtcbiAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNzdiA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsJyArIGNzdjtcbiAgICAgICAgICAgIHRoaXMud2luZG93Lm9wZW4oZW5jb2RlVVJJKGNzdikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5kb2N1bWVudC5ib2R5LCBsaW5rKTtcbiAgICB9XG5cbiAgICBvbkxhenlJdGVtTG9hZChldmVudCkge1xuICAgICAgICB0aGlzLm9uTGF6eUxvYWQuZW1pdCh7XG4gICAgICAgICAgICAuLi50aGlzLmNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKSxcbiAgICAgICAgICAgIC4uLmV2ZW50LFxuICAgICAgICAgICAgcm93czogZXZlbnQubGFzdCAtIGV2ZW50LmZpcnN0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNldFNjcm9sbFRvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbCkgdGhpcy5zY3JvbGxUb1ZpcnR1YWxJbmRleCgwKTtcbiAgICAgICAgZWxzZSB0aGlzLnNjcm9sbFRvKHsgdG9wOiAwIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzY3JvbGxUb1ZpcnR1YWxJbmRleChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbCAmJiB0aGlzLnNjcm9sbGVyLnNjcm9sbFRvSW5kZXgoaW5kZXgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzY3JvbGxUbyhvcHRpb25zKSB7XG4gICAgICAgIGlmICh0aGlzLnZpcnR1YWxTY3JvbGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZXIuc2Nyb2xsVG8ob3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy53cmFwcGVyVmlld0NoaWxkICYmIHRoaXMud3JhcHBlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy53cmFwcGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxUbyhvcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IG9wdGlvbnMubGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBvcHRpb25zLnRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUVkaXRpbmdDZWxsKGNlbGwsIGRhdGEsIGZpZWxkLCBpbmRleCkge1xuICAgICAgICB0aGlzLmVkaXRpbmdDZWxsID0gY2VsbDtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbERhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLmVkaXRpbmdDZWxsRmllbGQgPSBmaWVsZDtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbFJvd0luZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50RWRpdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgaXNFZGl0aW5nQ2VsbFZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0aW5nQ2VsbCAmJiBEb21IYW5kbGVyLmZpbmQodGhpcy5lZGl0aW5nQ2VsbCwgJy5uZy1pbnZhbGlkLm5nLWRpcnR5JykubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIGJpbmREb2N1bWVudEVkaXRMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50RWRpdExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RWRpdExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZWRpdGluZ0NlbGwgJiYgIXRoaXMuc2VsZkNsaWNrICYmIHRoaXMuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmVkaXRpbmdDZWxsLCAncC1jZWxsLWVkaXRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FZGl0Q29tcGxldGUuZW1pdCh7IGZpZWxkOiB0aGlzLmVkaXRpbmdDZWxsRmllbGQsIGRhdGE6IHRoaXMuZWRpdGluZ0NlbGxEYXRhLCBvcmlnaW5hbEV2ZW50OiBldmVudCwgaW5kZXg6IHRoaXMuZWRpdGluZ0NlbGxSb3dJbmRleCB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbEZpZWxkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbERhdGEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRpbmdDZWxsUm93SW5kZXggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50RWRpdExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3ZlcmxheVN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdmVybGF5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGZDbGljayA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudEVkaXRMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRFZGl0TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRFZGl0TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRFZGl0TGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdFJvd0VkaXQocm93RGF0YTogYW55KSB7XG4gICAgICAgIGxldCBkYXRhS2V5VmFsdWUgPSBTdHJpbmcoT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dEYXRhLCB0aGlzLmRhdGFLZXkpKTtcbiAgICAgICAgdGhpcy5lZGl0aW5nUm93S2V5c1tkYXRhS2V5VmFsdWVdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzYXZlUm93RWRpdChyb3dEYXRhOiBhbnksIHJvd0VsZW1lbnQ6IEhUTUxUYWJsZVJvd0VsZW1lbnQpIHtcbiAgICAgICAgaWYgKERvbUhhbmRsZXIuZmluZChyb3dFbGVtZW50LCAnLm5nLWludmFsaWQubmctZGlydHknKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGxldCBkYXRhS2V5VmFsdWUgPSBTdHJpbmcoT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dEYXRhLCB0aGlzLmRhdGFLZXkpKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmVkaXRpbmdSb3dLZXlzW2RhdGFLZXlWYWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYW5jZWxSb3dFZGl0KHJvd0RhdGE6IGFueSkge1xuICAgICAgICBsZXQgZGF0YUtleVZhbHVlID0gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kYXRhS2V5KSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmVkaXRpbmdSb3dLZXlzW2RhdGFLZXlWYWx1ZV07XG4gICAgfVxuXG4gICAgdG9nZ2xlUm93KHJvd0RhdGE6IGFueSwgZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGF0YUtleSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdkYXRhS2V5IG11c3QgYmUgZGVmaW5lZCB0byB1c2Ugcm93IGV4cGFuc2lvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRhdGFLZXlWYWx1ZSA9IFN0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIHRoaXMuZGF0YUtleSkpO1xuXG4gICAgICAgIGlmICh0aGlzLmV4cGFuZGVkUm93S2V5c1tkYXRhS2V5VmFsdWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV4cGFuZGVkUm93S2V5c1tkYXRhS2V5VmFsdWVdO1xuICAgICAgICAgICAgdGhpcy5vblJvd0NvbGxhcHNlLmVtaXQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGRhdGE6IHJvd0RhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMucm93RXhwYW5kTW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGFuZGVkUm93S2V5cyA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGVkUm93S2V5c1tkYXRhS2V5VmFsdWVdID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub25Sb3dFeHBhbmQuZW1pdCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgZGF0YTogcm93RGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1Jvd0V4cGFuZGVkKHJvd0RhdGE6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5leHBhbmRlZFJvd0tleXNbU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kYXRhS2V5KSldID09PSB0cnVlO1xuICAgIH1cblxuICAgIGlzUm93RWRpdGluZyhyb3dEYXRhOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdGluZ1Jvd0tleXNbU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kYXRhS2V5KSldID09PSB0cnVlO1xuICAgIH1cblxuICAgIGlzU2luZ2xlU2VsZWN0aW9uTW9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ3NpbmdsZSc7XG4gICAgfVxuXG4gICAgaXNNdWx0aXBsZVNlbGVjdGlvbk1vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdtdWx0aXBsZSc7XG4gICAgfVxuXG4gICAgb25Db2x1bW5SZXNpemVCZWdpbihldmVudCkge1xuICAgICAgICBsZXQgY29udGFpbmVyTGVmdCA9IERvbUhhbmRsZXIuZ2V0T2Zmc2V0KHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpLmxlZnQ7XG4gICAgICAgIHRoaXMucmVzaXplQ29sdW1uRWxlbWVudCA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB0aGlzLmNvbHVtblJlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0UmVzaXplckhlbHBlclggPSBldmVudC5wYWdlWCAtIGNvbnRhaW5lckxlZnQgKyB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgICAgIHRoaXMub25Db2x1bW5SZXNpemUoZXZlbnQpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uQ29sdW1uUmVzaXplKGV2ZW50KSB7XG4gICAgICAgIGxldCBjb250YWluZXJMZWZ0ID0gRG9tSGFuZGxlci5nZXRPZmZzZXQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkubGVmdDtcbiAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAncC11bnNlbGVjdGFibGUtdGV4dCcpO1xuICAgICAgICB0aGlzLnJlc2l6ZUhlbHBlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5yZXNpemVIZWxwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgdGhpcy5yZXNpemVIZWxwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQucGFnZVggLSBjb250YWluZXJMZWZ0ICsgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ICsgJ3B4JztcblxuICAgICAgICB0aGlzLnJlc2l6ZUhlbHBlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cblxuICAgIG9uQ29sdW1uUmVzaXplRW5kKCkge1xuICAgICAgICBsZXQgZGVsdGEgPSB0aGlzLnJlc2l6ZUhlbHBlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldExlZnQgLSB0aGlzLmxhc3RSZXNpemVySGVscGVyWDtcbiAgICAgICAgbGV0IGNvbHVtbldpZHRoID0gdGhpcy5yZXNpemVDb2x1bW5FbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBsZXQgbmV3Q29sdW1uV2lkdGggPSBjb2x1bW5XaWR0aCArIGRlbHRhO1xuICAgICAgICBsZXQgbWluV2lkdGggPSB0aGlzLnJlc2l6ZUNvbHVtbkVsZW1lbnQuc3R5bGUubWluV2lkdGgucmVwbGFjZSgvW15cXGQuXS9nLCAnJykgfHwgMTU7XG5cbiAgICAgICAgaWYgKG5ld0NvbHVtbldpZHRoID49IG1pbldpZHRoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb2x1bW5SZXNpemVNb2RlID09PSAnZml0Jykge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0Q29sdW1uID0gdGhpcy5yZXNpemVDb2x1bW5FbGVtZW50Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICBsZXQgbmV4dENvbHVtbldpZHRoID0gbmV4dENvbHVtbi5vZmZzZXRXaWR0aCAtIGRlbHRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5ld0NvbHVtbldpZHRoID4gMTUgJiYgbmV4dENvbHVtbldpZHRoID4gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNpemVUYWJsZUNlbGxzKG5ld0NvbHVtbldpZHRoLCBuZXh0Q29sdW1uV2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb2x1bW5SZXNpemVNb2RlID09PSAnZXhwYW5kJykge1xuICAgICAgICAgICAgICAgIGxldCB0YWJsZVdpZHRoID0gdGhpcy50YWJsZVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoICsgZGVsdGE7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSZXNpemVUYWJsZVdpZHRoKHRhYmxlV2lkdGggKyAncHgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZVRhYmxlQ2VsbHMobmV3Q29sdW1uV2lkdGgsIG51bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uQ29sUmVzaXplLmVtaXQoe1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMucmVzaXplQ29sdW1uRWxlbWVudCxcbiAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGFcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNpemVIZWxwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdwLXVuc2VsZWN0YWJsZS10ZXh0Jyk7XG4gICAgfVxuXG4gICAgcmVzaXplVGFibGVDZWxscyhuZXdDb2x1bW5XaWR0aCwgbmV4dENvbHVtbldpZHRoKSB7XG4gICAgICAgIGxldCBjb2xJbmRleCA9IERvbUhhbmRsZXIuaW5kZXgodGhpcy5yZXNpemVDb2x1bW5FbGVtZW50KTtcbiAgICAgICAgbGV0IHdpZHRocyA9IFtdO1xuICAgICAgICBjb25zdCB0YWJsZUhlYWQgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgJy5wLWRhdGF0YWJsZS10aGVhZCcpO1xuICAgICAgICBsZXQgaGVhZGVycyA9IERvbUhhbmRsZXIuZmluZCh0YWJsZUhlYWQsICd0ciA+IHRoJyk7XG4gICAgICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB3aWR0aHMucHVzaChEb21IYW5kbGVyLmdldE91dGVyV2lkdGgoaGVhZGVyKSkpO1xuXG4gICAgICAgIHRoaXMuZGVzdHJveVN0eWxlRWxlbWVudCgpO1xuICAgICAgICB0aGlzLmNyZWF0ZVN0eWxlRWxlbWVudCgpO1xuXG4gICAgICAgIGxldCBpbm5lckhUTUwgPSAnJztcbiAgICAgICAgd2lkdGhzLmZvckVhY2goKHdpZHRoLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbFdpZHRoID0gaW5kZXggPT09IGNvbEluZGV4ID8gbmV3Q29sdW1uV2lkdGggOiBuZXh0Q29sdW1uV2lkdGggJiYgaW5kZXggPT09IGNvbEluZGV4ICsgMSA/IG5leHRDb2x1bW5XaWR0aCA6IHdpZHRoO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gYHdpZHRoOiAke2NvbFdpZHRofXB4ICFpbXBvcnRhbnQ7IG1heC13aWR0aDogJHtjb2xXaWR0aH1weCAhaW1wb3J0YW50O2A7XG4gICAgICAgICAgICBpbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgICMke3RoaXMuaWR9LXRhYmxlID4gLnAtZGF0YXRhYmxlLXRoZWFkID4gdHIgPiB0aDpudGgtY2hpbGQoJHtpbmRleCArIDF9KSxcbiAgICAgICAgICAgICAgICAjJHt0aGlzLmlkfS10YWJsZSA+IC5wLWRhdGF0YWJsZS10Ym9keSA+IHRyID4gdGQ6bnRoLWNoaWxkKCR7aW5kZXggKyAxfSksXG4gICAgICAgICAgICAgICAgIyR7dGhpcy5pZH0tdGFibGUgPiAucC1kYXRhdGFibGUtdGZvb3QgPiB0ciA+IHRkOm50aC1jaGlsZCgke2luZGV4ICsgMX0pIHtcbiAgICAgICAgICAgICAgICAgICAgJHtzdHlsZX1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBgO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0eWxlRWxlbWVudC50ZXh0Q29udGVudCA9IGlubmVySFRNTDtcbiAgICB9XG5cbiAgICBvbkNvbHVtbkRyYWdTdGFydChldmVudCwgY29sdW1uRWxlbWVudCkge1xuICAgICAgICB0aGlzLnJlb3JkZXJJY29uV2lkdGggPSBEb21IYW5kbGVyLmdldEhpZGRlbkVsZW1lbnRPdXRlcldpZHRoKHRoaXMucmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLnJlb3JkZXJJY29uSGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRIaWRkZW5FbGVtZW50T3V0ZXJIZWlnaHQodGhpcy5yZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgdGhpcy5kcmFnZ2VkQ29sdW1uID0gY29sdW1uRWxlbWVudDtcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQnLCAnYicpOyAvLyBGb3IgZmlyZWZveFxuICAgIH1cblxuICAgIG9uQ29sdW1uRHJhZ0VudGVyKGV2ZW50LCBkcm9wSGVhZGVyKSB7XG4gICAgICAgIGlmICh0aGlzLnJlb3JkZXJhYmxlQ29sdW1ucyAmJiB0aGlzLmRyYWdnZWRDb2x1bW4gJiYgZHJvcEhlYWRlcikge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBjb250YWluZXJPZmZzZXQgPSBEb21IYW5kbGVyLmdldE9mZnNldCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIGxldCBkcm9wSGVhZGVyT2Zmc2V0ID0gRG9tSGFuZGxlci5nZXRPZmZzZXQoZHJvcEhlYWRlcik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnZWRDb2x1bW4gIT0gZHJvcEhlYWRlcikge1xuICAgICAgICAgICAgICAgIGxldCBkcmFnSW5kZXggPSBEb21IYW5kbGVyLmluZGV4V2l0aGluR3JvdXAodGhpcy5kcmFnZ2VkQ29sdW1uLCAncHJlb3JkZXJhYmxlY29sdW1uJyk7XG4gICAgICAgICAgICAgICAgbGV0IGRyb3BJbmRleCA9IERvbUhhbmRsZXIuaW5kZXhXaXRoaW5Hcm91cChkcm9wSGVhZGVyLCAncHJlb3JkZXJhYmxlY29sdW1uJyk7XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldExlZnQgPSBkcm9wSGVhZGVyT2Zmc2V0LmxlZnQgLSBjb250YWluZXJPZmZzZXQubGVmdDtcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0VG9wID0gY29udGFpbmVyT2Zmc2V0LnRvcCAtIGRyb3BIZWFkZXJPZmZzZXQudG9wO1xuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5DZW50ZXIgPSBkcm9wSGVhZGVyT2Zmc2V0LmxlZnQgKyBkcm9wSGVhZGVyLm9mZnNldFdpZHRoIC8gMjtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gZHJvcEhlYWRlck9mZnNldC50b3AgLSBjb250YWluZXJPZmZzZXQudG9wIC0gKHRoaXMucmVvcmRlckljb25IZWlnaHQgLSAxKSArICdweCc7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IGRyb3BIZWFkZXJPZmZzZXQudG9wIC0gY29udGFpbmVyT2Zmc2V0LnRvcCArIGRyb3BIZWFkZXIub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIGlmIChldmVudC5wYWdlWCA+IGNvbHVtbkNlbnRlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSB0YXJnZXRMZWZ0ICsgZHJvcEhlYWRlci5vZmZzZXRXaWR0aCAtIE1hdGguY2VpbCh0aGlzLnJlb3JkZXJJY29uV2lkdGggLyAyKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gdGFyZ2V0TGVmdCArIGRyb3BIZWFkZXIub2Zmc2V0V2lkdGggLSBNYXRoLmNlaWwodGhpcy5yZW9yZGVySWNvbldpZHRoIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3BQb3NpdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yVXBWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gdGFyZ2V0TGVmdCAtIE1hdGguY2VpbCh0aGlzLnJlb3JkZXJJY29uV2lkdGggLyAyKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gdGFyZ2V0TGVmdCAtIE1hdGguY2VpbCh0aGlzLnJlb3JkZXJJY29uV2lkdGggLyAyKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcFBvc2l0aW9uID0gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ29sdW1uRHJhZ0xlYXZlKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnJlb3JkZXJhYmxlQ29sdW1ucyAmJiB0aGlzLmRyYWdnZWRDb2x1bW4pIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNvbHVtbkRyb3AoZXZlbnQsIGRyb3BDb2x1bW4pIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dlZENvbHVtbikge1xuICAgICAgICAgICAgbGV0IGRyYWdJbmRleCA9IERvbUhhbmRsZXIuaW5kZXhXaXRoaW5Hcm91cCh0aGlzLmRyYWdnZWRDb2x1bW4sICdwcmVvcmRlcmFibGVjb2x1bW4nKTtcbiAgICAgICAgICAgIGxldCBkcm9wSW5kZXggPSBEb21IYW5kbGVyLmluZGV4V2l0aGluR3JvdXAoZHJvcENvbHVtbiwgJ3ByZW9yZGVyYWJsZWNvbHVtbicpO1xuICAgICAgICAgICAgbGV0IGFsbG93RHJvcCA9IGRyYWdJbmRleCAhPSBkcm9wSW5kZXg7XG4gICAgICAgICAgICBpZiAoYWxsb3dEcm9wICYmICgoZHJvcEluZGV4IC0gZHJhZ0luZGV4ID09IDEgJiYgdGhpcy5kcm9wUG9zaXRpb24gPT09IC0xKSB8fCAoZHJhZ0luZGV4IC0gZHJvcEluZGV4ID09IDEgJiYgdGhpcy5kcm9wUG9zaXRpb24gPT09IDEpKSkge1xuICAgICAgICAgICAgICAgIGFsbG93RHJvcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxsb3dEcm9wICYmIGRyb3BJbmRleCA8IGRyYWdJbmRleCAmJiB0aGlzLmRyb3BQb3NpdGlvbiA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGRyb3BJbmRleCA9IGRyb3BJbmRleCArIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbGxvd0Ryb3AgJiYgZHJvcEluZGV4ID4gZHJhZ0luZGV4ICYmIHRoaXMuZHJvcFBvc2l0aW9uID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGRyb3BJbmRleCA9IGRyb3BJbmRleCAtIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbGxvd0Ryb3ApIHtcbiAgICAgICAgICAgICAgICBPYmplY3RVdGlscy5yZW9yZGVyQXJyYXkodGhpcy5jb2x1bW5zLCBkcmFnSW5kZXgsIGRyb3BJbmRleCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29sUmVvcmRlci5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgZHJhZ0luZGV4OiBkcmFnSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIGRyb3BJbmRleDogZHJvcEluZGV4LFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnNcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3RhdGVmdWwoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2VkQ29sdW1uLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2VkQ29sdW1uID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZHJvcFBvc2l0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUm93RHJhZ1N0YXJ0KGV2ZW50LCBpbmRleCkge1xuICAgICAgICB0aGlzLnJvd0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kcmFnZ2VkUm93SW5kZXggPSBpbmRleDtcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQnLCAnYicpOyAvLyBGb3IgZmlyZWZveFxuICAgIH1cblxuICAgIG9uUm93RHJhZ092ZXIoZXZlbnQsIGluZGV4LCByb3dFbGVtZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnJvd0RyYWdnaW5nICYmIHRoaXMuZHJhZ2dlZFJvd0luZGV4ICE9PSBpbmRleCkge1xuICAgICAgICAgICAgbGV0IHJvd1kgPSBEb21IYW5kbGVyLmdldE9mZnNldChyb3dFbGVtZW50KS50b3AgKyBEb21IYW5kbGVyLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuICAgICAgICAgICAgbGV0IHBhZ2VZID0gZXZlbnQucGFnZVk7XG4gICAgICAgICAgICBsZXQgcm93TWlkWSA9IHJvd1kgKyBEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KHJvd0VsZW1lbnQpIC8gMjtcbiAgICAgICAgICAgIGxldCBwcmV2Um93RWxlbWVudCA9IHJvd0VsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgICAgICAgICAgaWYgKHBhZ2VZIDwgcm93TWlkWSkge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3Mocm93RWxlbWVudCwgJ3AtZGF0YXRhYmxlLWRyYWdwb2ludC1ib3R0b20nKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZHJvcHBlZFJvd0luZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZSb3dFbGVtZW50KSBEb21IYW5kbGVyLmFkZENsYXNzKHByZXZSb3dFbGVtZW50LCAncC1kYXRhdGFibGUtZHJhZ3BvaW50LWJvdHRvbScpO1xuICAgICAgICAgICAgICAgIGVsc2UgRG9tSGFuZGxlci5hZGRDbGFzcyhyb3dFbGVtZW50LCAncC1kYXRhdGFibGUtZHJhZ3BvaW50LXRvcCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocHJldlJvd0VsZW1lbnQpIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3MocHJldlJvd0VsZW1lbnQsICdwLWRhdGF0YWJsZS1kcmFncG9pbnQtYm90dG9tJyk7XG4gICAgICAgICAgICAgICAgZWxzZSBEb21IYW5kbGVyLmFkZENsYXNzKHJvd0VsZW1lbnQsICdwLWRhdGF0YWJsZS1kcmFncG9pbnQtdG9wJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BwZWRSb3dJbmRleCA9IGluZGV4ICsgMTtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHJvd0VsZW1lbnQsICdwLWRhdGF0YWJsZS1kcmFncG9pbnQtYm90dG9tJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblJvd0RyYWdMZWF2ZShldmVudCwgcm93RWxlbWVudCkge1xuICAgICAgICBsZXQgcHJldlJvd0VsZW1lbnQgPSByb3dFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmIChwcmV2Um93RWxlbWVudCkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhwcmV2Um93RWxlbWVudCwgJ3AtZGF0YXRhYmxlLWRyYWdwb2ludC1ib3R0b20nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3Mocm93RWxlbWVudCwgJ3AtZGF0YXRhYmxlLWRyYWdwb2ludC1ib3R0b20nKTtcbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhyb3dFbGVtZW50LCAncC1kYXRhdGFibGUtZHJhZ3BvaW50LXRvcCcpO1xuICAgIH1cblxuICAgIG9uUm93RHJhZ0VuZChldmVudCkge1xuICAgICAgICB0aGlzLnJvd0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFJvd0luZGV4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5kcm9wcGVkUm93SW5kZXggPSBudWxsO1xuICAgIH1cblxuICAgIG9uUm93RHJvcChldmVudCwgcm93RWxlbWVudCkge1xuICAgICAgICBpZiAodGhpcy5kcm9wcGVkUm93SW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGRyb3BJbmRleCA9IHRoaXMuZHJhZ2dlZFJvd0luZGV4ID4gdGhpcy5kcm9wcGVkUm93SW5kZXggPyB0aGlzLmRyb3BwZWRSb3dJbmRleCA6IHRoaXMuZHJvcHBlZFJvd0luZGV4ID09PSAwID8gMCA6IHRoaXMuZHJvcHBlZFJvd0luZGV4IC0gMTtcbiAgICAgICAgICAgIE9iamVjdFV0aWxzLnJlb3JkZXJBcnJheSh0aGlzLnZhbHVlLCB0aGlzLmRyYWdnZWRSb3dJbmRleCwgZHJvcEluZGV4KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IENoZWNrXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbLi4udGhpcy5fdmFsdWVdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uUm93UmVvcmRlci5lbWl0KHtcbiAgICAgICAgICAgICAgICBkcmFnSW5kZXg6IHRoaXMuZHJhZ2dlZFJvd0luZGV4LFxuICAgICAgICAgICAgICAgIGRyb3BJbmRleDogZHJvcEluZGV4XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvL2NsZWFudXBcbiAgICAgICAgdGhpcy5vblJvd0RyYWdMZWF2ZShldmVudCwgcm93RWxlbWVudCk7XG4gICAgICAgIHRoaXMub25Sb3dEcmFnRW5kKGV2ZW50KTtcbiAgICB9XG5cbiAgICBpc0VtcHR5KCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZmlsdGVyZWRWYWx1ZSB8fCB0aGlzLnZhbHVlO1xuICAgICAgICByZXR1cm4gZGF0YSA9PSBudWxsIHx8IGRhdGEubGVuZ3RoID09IDA7XG4gICAgfVxuXG4gICAgZ2V0QmxvY2thYmxlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF07XG4gICAgfVxuXG4gICAgZ2V0U3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZVN0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdsb2NhbCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc2Vzc2lvbic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2U7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5zdGF0ZVN0b3JhZ2UgKyAnIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciB0aGUgc3RhdGUgc3RvcmFnZSwgc3VwcG9ydGVkIHZhbHVlcyBhcmUgXCJsb2NhbFwiIGFuZCBcInNlc3Npb25cIi4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQnJvd3NlciBzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhlIHNlcnZlciBzaWRlLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNTdGF0ZWZ1bCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVLZXkgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBzYXZlU3RhdGUoKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSB0aGlzLmdldFN0b3JhZ2UoKTtcbiAgICAgICAgbGV0IHN0YXRlOiBUYWJsZVN0YXRlID0ge307XG5cbiAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICBzdGF0ZS5maXJzdCA9IHRoaXMuZmlyc3Q7XG4gICAgICAgICAgICBzdGF0ZS5yb3dzID0gdGhpcy5yb3dzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc29ydEZpZWxkKSB7XG4gICAgICAgICAgICBzdGF0ZS5zb3J0RmllbGQgPSB0aGlzLnNvcnRGaWVsZDtcbiAgICAgICAgICAgIHN0YXRlLnNvcnRPcmRlciA9IHRoaXMuc29ydE9yZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubXVsdGlTb3J0TWV0YSkge1xuICAgICAgICAgICAgc3RhdGUubXVsdGlTb3J0TWV0YSA9IHRoaXMubXVsdGlTb3J0TWV0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhhc0ZpbHRlcigpKSB7XG4gICAgICAgICAgICBzdGF0ZS5maWx0ZXJzID0gdGhpcy5maWx0ZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVzaXphYmxlQ29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5zYXZlQ29sdW1uV2lkdGhzKHN0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlb3JkZXJhYmxlQ29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5zYXZlQ29sdW1uT3JkZXIoc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBzdGF0ZS5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmV4cGFuZGVkUm93S2V5cykubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdGF0ZS5leHBhbmRlZFJvd0tleXMgPSB0aGlzLmV4cGFuZGVkUm93S2V5cztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnN0YXRlS2V5LCBKU09OLnN0cmluZ2lmeShzdGF0ZSkpO1xuICAgICAgICB0aGlzLm9uU3RhdGVTYXZlLmVtaXQoc3RhdGUpO1xuICAgIH1cblxuICAgIGNsZWFyU3RhdGUoKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSB0aGlzLmdldFN0b3JhZ2UoKTtcblxuICAgICAgICBpZiAodGhpcy5zdGF0ZUtleSkge1xuICAgICAgICAgICAgc3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuc3RhdGVLZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdG9yZVN0YXRlKCkge1xuICAgICAgICBjb25zdCBzdG9yYWdlID0gdGhpcy5nZXRTdG9yYWdlKCk7XG4gICAgICAgIGNvbnN0IHN0YXRlU3RyaW5nID0gc3RvcmFnZS5nZXRJdGVtKHRoaXMuc3RhdGVLZXkpO1xuICAgICAgICBjb25zdCBkYXRlRm9ybWF0ID0gL1xcZHs0fS1cXGR7Mn0tXFxkezJ9VFxcZHsyfTpcXGR7Mn06XFxkezJ9LlxcZHszfVovO1xuICAgICAgICBjb25zdCByZXZpdmVyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIGRhdGVGb3JtYXQudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHN0YXRlU3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgc3RhdGU6IFRhYmxlU3RhdGUgPSBKU09OLnBhcnNlKHN0YXRlU3RyaW5nLCByZXZpdmVyKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0ID0gc3RhdGUuZmlyc3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDaGFuZ2UuZW1pdCh0aGlzLmZpcnN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yb3dzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dzID0gc3RhdGUucm93cztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dzQ2hhbmdlLmVtaXQodGhpcy5yb3dzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5zb3J0RmllbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmluZ1NvcnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvcnRGaWVsZCA9IHN0YXRlLnNvcnRGaWVsZDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSBzdGF0ZS5zb3J0T3JkZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5tdWx0aVNvcnRNZXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JpbmdTb3J0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aVNvcnRNZXRhID0gc3RhdGUubXVsdGlTb3J0TWV0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLmZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmluZ0ZpbHRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJzID0gc3RhdGUuZmlsdGVycztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMucmVzaXphYmxlQ29sdW1ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uV2lkdGhzU3RhdGUgPSBzdGF0ZS5jb2x1bW5XaWR0aHM7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZVdpZHRoU3RhdGUgPSBzdGF0ZS50YWJsZVdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3RhdGUuZXhwYW5kZWRSb3dLZXlzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmRlZFJvd0tleXMgPSBzdGF0ZS5leHBhbmRlZFJvd0tleXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHN0YXRlLnNlbGVjdGlvbikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0YXRlUmVzdG9yZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVSZXN0b3JlLmVtaXQoc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZUNvbHVtbldpZHRocyhzdGF0ZSkge1xuICAgICAgICBsZXQgd2lkdGhzID0gW107XG4gICAgICAgIGxldCBoZWFkZXJzID0gRG9tSGFuZGxlci5maW5kKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICcucC1kYXRhdGFibGUtdGhlYWQgPiB0ciA+IHRoJyk7XG4gICAgICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB3aWR0aHMucHVzaChEb21IYW5kbGVyLmdldE91dGVyV2lkdGgoaGVhZGVyKSkpO1xuICAgICAgICBzdGF0ZS5jb2x1bW5XaWR0aHMgPSB3aWR0aHMuam9pbignLCcpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbHVtblJlc2l6ZU1vZGUgPT09ICdleHBhbmQnKSB7XG4gICAgICAgICAgICBzdGF0ZS50YWJsZVdpZHRoID0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMudGFibGVWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRSZXNpemVUYWJsZVdpZHRoKHdpZHRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50YWJsZVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMudGFibGVWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5taW5XaWR0aCA9IHdpZHRoO1xuICAgIH1cblxuICAgIHJlc3RvcmVDb2x1bW5XaWR0aHMoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbldpZHRoc1N0YXRlKSB7XG4gICAgICAgICAgICBsZXQgd2lkdGhzID0gdGhpcy5jb2x1bW5XaWR0aHNTdGF0ZS5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jb2x1bW5SZXNpemVNb2RlID09PSAnZXhwYW5kJyAmJiB0aGlzLnRhYmxlV2lkdGhTdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UmVzaXplVGFibGVXaWR0aCh0aGlzLnRhYmxlV2lkdGhTdGF0ZSArICdweCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNOb3RFbXB0eSh3aWR0aHMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTdHlsZUVsZW1lbnQoKTtcblxuICAgICAgICAgICAgICAgIGxldCBpbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICB3aWR0aHMuZm9yRWFjaCgod2lkdGgsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHlsZSA9IGB3aWR0aDogJHt3aWR0aH1weCAhaW1wb3J0YW50OyBtYXgtd2lkdGg6ICR7d2lkdGh9cHggIWltcG9ydGFudGA7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5uZXJIVE1MICs9IGBcbiAgICAgICAgICAgICAgICAgICAgICAgICMke3RoaXMuaWR9LXRhYmxlID4gLnAtZGF0YXRhYmxlLXRoZWFkID4gdHIgPiB0aDpudGgtY2hpbGQoJHtpbmRleCArIDF9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICMke3RoaXMuaWR9LXRhYmxlID4gLnAtZGF0YXRhYmxlLXRib2R5ID4gdHIgPiB0ZDpudGgtY2hpbGQoJHtpbmRleCArIDF9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICMke3RoaXMuaWR9LXRhYmxlID4gLnAtZGF0YXRhYmxlLXRmb290ID4gdHIgPiB0ZDpudGgtY2hpbGQoJHtpbmRleCArIDF9KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVFbGVtZW50LnRleHRDb250ZW50ID0gaW5uZXJIVE1MO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZUNvbHVtbk9yZGVyKHN0YXRlKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgIGxldCBjb2x1bW5PcmRlcjogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY29sdW1ucy5tYXAoKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbHVtbk9yZGVyLnB1c2goY29sdW1uLmZpZWxkIHx8IGNvbHVtbi5rZXkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0YXRlLmNvbHVtbk9yZGVyID0gY29sdW1uT3JkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN0b3JlQ29sdW1uT3JkZXIoKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSB0aGlzLmdldFN0b3JhZ2UoKTtcbiAgICAgICAgY29uc3Qgc3RhdGVTdHJpbmcgPSBzdG9yYWdlLmdldEl0ZW0odGhpcy5zdGF0ZUtleSk7XG4gICAgICAgIGlmIChzdGF0ZVN0cmluZykge1xuICAgICAgICAgICAgbGV0IHN0YXRlOiBUYWJsZVN0YXRlID0gSlNPTi5wYXJzZShzdGF0ZVN0cmluZyk7XG4gICAgICAgICAgICBsZXQgY29sdW1uT3JkZXIgPSBzdGF0ZS5jb2x1bW5PcmRlcjtcbiAgICAgICAgICAgIGlmIChjb2x1bW5PcmRlcikge1xuICAgICAgICAgICAgICAgIGxldCByZW9yZGVyZWRDb2x1bW5zID0gW107XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5PcmRlci5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sID0gdGhpcy5maW5kQ29sdW1uQnlLZXkoa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVvcmRlcmVkQ29sdW1ucy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbk9yZGVyU3RhdGVSZXN0b3JlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5zID0gcmVvcmRlcmVkQ29sdW1ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRDb2x1bW5CeUtleShrZXkpIHtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1ucykge1xuICAgICAgICAgICAgZm9yIChsZXQgY29sIG9mIHRoaXMuY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGlmIChjb2wua2V5ID09PSBrZXkgfHwgY29sLmZpZWxkID09PSBrZXkpIHJldHVybiBjb2w7XG4gICAgICAgICAgICAgICAgZWxzZSBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlU3R5bGVFbGVtZW50KCkge1xuICAgICAgICB0aGlzLnN0eWxlRWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5kb2N1bWVudC5oZWFkLCB0aGlzLnN0eWxlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0R3JvdXBSb3dzTWV0YSgpIHtcbiAgICAgICAgcmV0dXJuIHsgZmllbGQ6IHRoaXMuZ3JvdXBSb3dzQnksIG9yZGVyOiB0aGlzLmdyb3VwUm93c0J5T3JkZXIgfTtcbiAgICB9XG5cbiAgICBjcmVhdGVSZXNwb25zaXZlU3R5bGUoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVzcG9uc2l2ZVN0eWxlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzcG9uc2l2ZVN0eWxlRWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbnNpdmVTdHlsZUVsZW1lbnQudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmRvY3VtZW50LmhlYWQsIHRoaXMucmVzcG9uc2l2ZVN0eWxlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgaW5uZXJIVE1MID0gYFxuICAgIEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6ICR7dGhpcy5icmVha3BvaW50fSkge1xuICAgICAgICAjJHt0aGlzLmlkfS10YWJsZSA+IC5wLWRhdGF0YWJsZS10aGVhZCA+IHRyID4gdGgsXG4gICAgICAgICMke3RoaXMuaWR9LXRhYmxlID4gLnAtZGF0YXRhYmxlLXRmb290ID4gdHIgPiB0ZCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgIyR7dGhpcy5pZH0tdGFibGUgPiAucC1kYXRhdGFibGUtdGJvZHkgPiB0ciA+IHRkIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAjJHt0aGlzLmlkfS10YWJsZSA+IC5wLWRhdGF0YWJsZS10Ym9keSA+IHRyID4gdGQ6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBib3JkZXI6IDAgbm9uZTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAjJHt0aGlzLmlkfS5wLWRhdGF0YWJsZS1ncmlkbGluZXMgPiAucC1kYXRhdGFibGUtd3JhcHBlciA+IC5wLWRhdGF0YWJsZS10YWJsZSA+IC5wLWRhdGF0YWJsZS10Ym9keSA+IHRyID4gdGQ6bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICBib3JkZXItdG9wOiAwO1xuICAgICAgICAgICAgYm9yZGVyLXJpZ2h0OiAwO1xuICAgICAgICAgICAgYm9yZGVyLWxlZnQ6IDA7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgIyR7dGhpcy5pZH0tdGFibGUgPiAucC1kYXRhdGFibGUtdGJvZHkgPiB0ciA+IHRkID4gLnAtY29sdW1uLXRpdGxlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGA7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNwb25zaXZlU3R5bGVFbGVtZW50LnRleHRDb250ZW50ID0gaW5uZXJIVE1MO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVzdHJveVJlc3BvbnNpdmVTdHlsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2l2ZVN0eWxlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLmRvY3VtZW50LmhlYWQsIHRoaXMucmVzcG9uc2l2ZVN0eWxlRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNpdmVTdHlsZUVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVzdHJveVN0eWxlRWxlbWVudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMuZG9jdW1lbnQuaGVhZCwgdGhpcy5zdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRFZGl0TGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbCA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuZGVzdHJveVN0eWxlRWxlbWVudCgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lSZXNwb25zaXZlU3R5bGUoKTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnW3BUYWJsZUJvZHldJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWR0LmV4cGFuZGVkUm93VGVtcGxhdGVcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtcm93RGF0YSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIFtuZ0Zvck9mXT1cInZhbHVlXCIgW25nRm9yVHJhY2tCeV09XCJkdC5yb3dUcmFja0J5XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0Lmdyb3VwSGVhZGVyVGVtcGxhdGUgJiYgIWR0LnZpcnR1YWxTY3JvbGwgJiYgZHQucm93R3JvdXBNb2RlID09PSAnc3ViaGVhZGVyJyAmJiBzaG91bGRSZW5kZXJSb3dHcm91cEhlYWRlcih2YWx1ZSwgcm93RGF0YSwgcm93SW5kZXgpXCIgcm9sZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cImR0Lmdyb3VwSGVhZGVyVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiByb3dEYXRhLCByb3dJbmRleDogZ2V0Um93SW5kZXgocm93SW5kZXgpLCBjb2x1bW5zOiBjb2x1bW5zLCBlZGl0aW5nOiBkdC5lZGl0TW9kZSA9PT0gJ3JvdycgJiYgZHQuaXNSb3dFZGl0aW5nKHJvd0RhdGEpLCBmcm96ZW46IGZyb3plbiB9XCJcbiAgICAgICAgICAgICAgICAgICAgPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJkdC5yb3dHcm91cE1vZGUgIT09ICdyb3dzcGFuJ1wiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cInJvd0RhdGEgPyB0ZW1wbGF0ZSA6IGR0LmxvYWRpbmdCb2R5VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiByb3dEYXRhLCByb3dJbmRleDogZ2V0Um93SW5kZXgocm93SW5kZXgpLCBjb2x1bW5zOiBjb2x1bW5zLCBlZGl0aW5nOiBkdC5lZGl0TW9kZSA9PT0gJ3JvdycgJiYgZHQuaXNSb3dFZGl0aW5nKHJvd0RhdGEpLCBmcm96ZW46IGZyb3plbiB9XCJcbiAgICAgICAgICAgICAgICAgICAgPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJkdC5yb3dHcm91cE1vZGUgPT09ICdyb3dzcGFuJ1wiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0RhdGEgPyB0ZW1wbGF0ZSA6IGR0LmxvYWRpbmdCb2R5VGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW1wbGljaXQ6IHJvd0RhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0luZGV4OiBnZXRSb3dJbmRleChyb3dJbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRpbmc6IGR0LmVkaXRNb2RlID09PSAncm93JyAmJiBkdC5pc1Jvd0VkaXRpbmcocm93RGF0YSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb3plbjogZnJvemVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dncm91cDogc2hvdWxkUmVuZGVyUm93c3Bhbih2YWx1ZSwgcm93RGF0YSwgcm93SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiBjYWxjdWxhdGVSb3dHcm91cFNpemUodmFsdWUsIHJvd0RhdGEsIHJvd0luZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgICAgID48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZHQuZ3JvdXBGb290ZXJUZW1wbGF0ZSAmJiAhZHQudmlydHVhbFNjcm9sbCAmJiBkdC5yb3dHcm91cE1vZGUgPT09ICdzdWJoZWFkZXInICYmIHNob3VsZFJlbmRlclJvd0dyb3VwRm9vdGVyKHZhbHVlLCByb3dEYXRhLCByb3dJbmRleClcIiByb2xlPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwiZHQuZ3JvdXBGb290ZXJUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IHJvd0RhdGEsIHJvd0luZGV4OiBnZXRSb3dJbmRleChyb3dJbmRleCksIGNvbHVtbnM6IGNvbHVtbnMsIGVkaXRpbmc6IGR0LmVkaXRNb2RlID09PSAncm93JyAmJiBkdC5pc1Jvd0VkaXRpbmcocm93RGF0YSksIGZyb3plbjogZnJvemVuIH1cIlxuICAgICAgICAgICAgICAgICAgICA+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmV4cGFuZGVkUm93VGVtcGxhdGUgJiYgIShmcm96ZW4gJiYgZHQuZnJvemVuRXhwYW5kZWRSb3dUZW1wbGF0ZSlcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtcm93RGF0YSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIFtuZ0Zvck9mXT1cInZhbHVlXCIgW25nRm9yVHJhY2tCeV09XCJkdC5yb3dUcmFja0J5XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFkdC5ncm91cEhlYWRlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiByb3dEYXRhLCByb3dJbmRleDogZ2V0Um93SW5kZXgocm93SW5kZXgpLCBjb2x1bW5zOiBjb2x1bW5zLCBleHBhbmRlZDogZHQuaXNSb3dFeHBhbmRlZChyb3dEYXRhKSwgZWRpdGluZzogZHQuZWRpdE1vZGUgPT09ICdyb3cnICYmIGR0LmlzUm93RWRpdGluZyhyb3dEYXRhKSwgZnJvemVuOiBmcm96ZW4gfVwiXG4gICAgICAgICAgICAgICAgICAgID48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZHQuZ3JvdXBIZWFkZXJUZW1wbGF0ZSAmJiBkdC5yb3dHcm91cE1vZGUgPT09ICdzdWJoZWFkZXInICYmIHNob3VsZFJlbmRlclJvd0dyb3VwSGVhZGVyKHZhbHVlLCByb3dEYXRhLCBnZXRSb3dJbmRleChyb3dJbmRleCkpXCIgcm9sZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR0Lmdyb3VwSGVhZGVyVGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogeyAkaW1wbGljaXQ6IHJvd0RhdGEsIHJvd0luZGV4OiBnZXRSb3dJbmRleChyb3dJbmRleCksIGNvbHVtbnM6IGNvbHVtbnMsIGV4cGFuZGVkOiBkdC5pc1Jvd0V4cGFuZGVkKHJvd0RhdGEpLCBlZGl0aW5nOiBkdC5lZGl0TW9kZSA9PT0gJ3JvdycgJiYgZHQuaXNSb3dFZGl0aW5nKHJvd0RhdGEpLCBmcm96ZW46IGZyb3plbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgICAgICA+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmlzUm93RXhwYW5kZWQocm93RGF0YSlcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImR0LmV4cGFuZGVkUm93VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiByb3dEYXRhLCByb3dJbmRleDogZ2V0Um93SW5kZXgocm93SW5kZXgpLCBjb2x1bW5zOiBjb2x1bW5zLCBmcm96ZW46IGZyb3plbiB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJkdC5ncm91cEZvb3RlclRlbXBsYXRlICYmIGR0LnJvd0dyb3VwTW9kZSA9PT0gJ3N1YmhlYWRlcicgJiYgc2hvdWxkUmVuZGVyUm93R3JvdXBGb290ZXIodmFsdWUsIHJvd0RhdGEsIGdldFJvd0luZGV4KHJvd0luZGV4KSlcIiByb2xlPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHQuZ3JvdXBGb290ZXJUZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogeyAkaW1wbGljaXQ6IHJvd0RhdGEsIHJvd0luZGV4OiBnZXRSb3dJbmRleChyb3dJbmRleCksIGNvbHVtbnM6IGNvbHVtbnMsIGV4cGFuZGVkOiBkdC5pc1Jvd0V4cGFuZGVkKHJvd0RhdGEpLCBlZGl0aW5nOiBkdC5lZGl0TW9kZSA9PT0gJ3JvdycgJiYgZHQuaXNSb3dFZGl0aW5nKHJvd0RhdGEpLCBmcm96ZW46IGZyb3plbiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmZyb3plbkV4cGFuZGVkUm93VGVtcGxhdGUgJiYgZnJvemVuXCI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LXJvd0RhdGEgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBbbmdGb3JPZl09XCJ2YWx1ZVwiIFtuZ0ZvclRyYWNrQnldPVwiZHQucm93VHJhY2tCeVwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IHJvd0RhdGEsIHJvd0luZGV4OiBnZXRSb3dJbmRleChyb3dJbmRleCksIGNvbHVtbnM6IGNvbHVtbnMsIGV4cGFuZGVkOiBkdC5pc1Jvd0V4cGFuZGVkKHJvd0RhdGEpLCBlZGl0aW5nOiBkdC5lZGl0TW9kZSA9PT0gJ3JvdycgJiYgZHQuaXNSb3dFZGl0aW5nKHJvd0RhdGEpLCBmcm96ZW46IGZyb3plbiB9XCJcbiAgICAgICAgICAgICAgICA+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmlzUm93RXhwYW5kZWQocm93RGF0YSlcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImR0LmZyb3plbkV4cGFuZGVkUm93VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiByb3dEYXRhLCByb3dJbmRleDogZ2V0Um93SW5kZXgocm93SW5kZXgpLCBjb2x1bW5zOiBjb2x1bW5zLCBmcm96ZW46IGZyb3plbiB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmxvYWRpbmdcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJkdC5sb2FkaW5nQm9keVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY29sdW1ucywgZnJvemVuOiBmcm96ZW4gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImR0LmlzRW1wdHkoKSAmJiAhZHQubG9hZGluZ1wiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImR0LmVtcHR5TWVzc2FnZVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY29sdW1ucywgZnJvemVuOiBmcm96ZW4gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUYWJsZUJvZHkgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgncFRhYmxlQm9keScpIGNvbHVtbnM6IGFueVtdO1xuXG4gICAgQElucHV0KCdwVGFibGVCb2R5VGVtcGxhdGUnKSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBJbnB1dCgpIGdldCB2YWx1ZSgpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gICAgc2V0IHZhbHVlKHZhbDogYW55W10pIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWw7XG4gICAgICAgIGlmICh0aGlzLmZyb3plblJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRnJvemVuUm93U3RpY2t5UG9zaXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmR0LnNjcm9sbGFibGUgJiYgdGhpcy5kdC5yb3dHcm91cE1vZGUgPT09ICdzdWJoZWFkZXInKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZyb3plblJvd0dyb3VwSGVhZGVyU3RpY2t5UG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIGZyb3plbjogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGZyb3plblJvd3M6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzY3JvbGxlck9wdGlvbnM6IGFueTtcblxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgX3ZhbHVlOiBhbnlbXTtcblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZnJvemVuUm93cykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGcm96ZW5Sb3dTdGlja3lQb3NpdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZHQuc2Nyb2xsYWJsZSAmJiB0aGlzLmR0LnJvd0dyb3VwTW9kZSA9PT0gJ3N1YmhlYWRlcicpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRnJvemVuUm93R3JvdXBIZWFkZXJTdGlja3lQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIHRhYmxlU2VydmljZTogVGFibGVTZXJ2aWNlLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmR0LnRhYmxlU2VydmljZS52YWx1ZVNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmR0LnZpcnR1YWxTY3JvbGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvdWxkUmVuZGVyUm93R3JvdXBIZWFkZXIodmFsdWUsIHJvd0RhdGEsIGkpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRSb3dGaWVsZERhdGEgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHJvd0RhdGEsIHRoaXMuZHQuZ3JvdXBSb3dzQnkpO1xuICAgICAgICBsZXQgcHJldlJvd0RhdGEgPSB2YWx1ZVtpIC0gMV07XG4gICAgICAgIGlmIChwcmV2Um93RGF0YSkge1xuICAgICAgICAgICAgbGV0IHByZXZpb3VzUm93RmllbGREYXRhID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShwcmV2Um93RGF0YSwgdGhpcy5kdC5ncm91cFJvd3NCeSk7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFJvd0ZpZWxkRGF0YSAhPT0gcHJldmlvdXNSb3dGaWVsZERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3VsZFJlbmRlclJvd0dyb3VwRm9vdGVyKHZhbHVlLCByb3dEYXRhLCBpKSB7XG4gICAgICAgIGxldCBjdXJyZW50Um93RmllbGREYXRhID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dEYXRhLCB0aGlzLmR0Lmdyb3VwUm93c0J5KTtcbiAgICAgICAgbGV0IG5leHRSb3dEYXRhID0gdmFsdWVbaSArIDFdO1xuICAgICAgICBpZiAobmV4dFJvd0RhdGEpIHtcbiAgICAgICAgICAgIGxldCBuZXh0Um93RmllbGREYXRhID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShuZXh0Um93RGF0YSwgdGhpcy5kdC5ncm91cFJvd3NCeSk7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFJvd0ZpZWxkRGF0YSAhPT0gbmV4dFJvd0ZpZWxkRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdWxkUmVuZGVyUm93c3Bhbih2YWx1ZSwgcm93RGF0YSwgaSkge1xuICAgICAgICBsZXQgY3VycmVudFJvd0ZpZWxkRGF0YSA9IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kdC5ncm91cFJvd3NCeSk7XG4gICAgICAgIGxldCBwcmV2Um93RGF0YSA9IHZhbHVlW2kgLSAxXTtcbiAgICAgICAgaWYgKHByZXZSb3dEYXRhKSB7XG4gICAgICAgICAgICBsZXQgcHJldmlvdXNSb3dGaWVsZERhdGEgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHByZXZSb3dEYXRhLCB0aGlzLmR0Lmdyb3VwUm93c0J5KTtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50Um93RmllbGREYXRhICE9PSBwcmV2aW91c1Jvd0ZpZWxkRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUm93R3JvdXBTaXplKHZhbHVlLCByb3dEYXRhLCBpbmRleCkge1xuICAgICAgICBsZXQgY3VycmVudFJvd0ZpZWxkRGF0YSA9IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEocm93RGF0YSwgdGhpcy5kdC5ncm91cFJvd3NCeSk7XG4gICAgICAgIGxldCBuZXh0Um93RmllbGREYXRhID0gY3VycmVudFJvd0ZpZWxkRGF0YTtcbiAgICAgICAgbGV0IGdyb3VwUm93U3BhbiA9IDA7XG5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRSb3dGaWVsZERhdGEgPT09IG5leHRSb3dGaWVsZERhdGEpIHtcbiAgICAgICAgICAgIGdyb3VwUm93U3BhbisrO1xuICAgICAgICAgICAgbGV0IG5leHRSb3dEYXRhID0gdmFsdWVbKytpbmRleF07XG4gICAgICAgICAgICBpZiAobmV4dFJvd0RhdGEpIHtcbiAgICAgICAgICAgICAgICBuZXh0Um93RmllbGREYXRhID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShuZXh0Um93RGF0YSwgdGhpcy5kdC5ncm91cFJvd3NCeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdyb3VwUm93U3BhbiA9PT0gMSA/IG51bGwgOiBncm91cFJvd1NwYW47XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUZyb3plblJvd1N0aWNreVBvc2l0aW9uKCkge1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZykgKyAncHgnO1xuICAgIH1cblxuICAgIHVwZGF0ZUZyb3plblJvd0dyb3VwSGVhZGVyU3RpY2t5UG9zaXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZykge1xuICAgICAgICAgICAgbGV0IHRhYmxlSGVhZGVySGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZyk7XG4gICAgICAgICAgICB0aGlzLmR0LnJvd0dyb3VwSGVhZGVyU3R5bGVPYmplY3QudG9wID0gdGFibGVIZWFkZXJIZWlnaHQgKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2Nyb2xsZXJPcHRpb24ob3B0aW9uLCBvcHRpb25zPykge1xuICAgICAgICBpZiAodGhpcy5kdC52aXJ0dWFsU2Nyb2xsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB0aGlzLnNjcm9sbGVyT3B0aW9ucztcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zID8gb3B0aW9uc1tvcHRpb25dIDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldFJvd0luZGV4KHJvd0luZGV4KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kdC5wYWdpbmF0b3IgPyB0aGlzLmR0LmZpcnN0ICsgcm93SW5kZXggOiByb3dJbmRleDtcbiAgICAgICAgY29uc3QgZ2V0SXRlbU9wdGlvbnMgPSB0aGlzLmdldFNjcm9sbGVyT3B0aW9uKCdnZXRJdGVtT3B0aW9ucycpO1xuICAgICAgICByZXR1cm4gZ2V0SXRlbU9wdGlvbnMgPyBnZXRJdGVtT3B0aW9ucyhpbmRleCkuaW5kZXggOiBpbmRleDtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BSb3dHcm91cEhlYWRlcl0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLXJvd2dyb3VwLWhlYWRlciBwLWVsZW1lbnQnLFxuICAgICAgICAnW3N0eWxlLnRvcF0nOiAnZ2V0RnJvemVuUm93R3JvdXBIZWFkZXJTdGlja3lQb3NpdGlvbidcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFJvd0dyb3VwSGVhZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlKSB7fVxuXG4gICAgZ2V0IGdldEZyb3plblJvd0dyb3VwSGVhZGVyU3RpY2t5UG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmR0LnJvd0dyb3VwSGVhZGVyU3R5bGVPYmplY3QgPyB0aGlzLmR0LnJvd0dyb3VwSGVhZGVyU3R5bGVPYmplY3QudG9wIDogJyc7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twRnJvemVuQ29sdW1uXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCcsXG4gICAgICAgICdbY2xhc3MucC1mcm96ZW4tY29sdW1uXSc6ICdmcm96ZW4nXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBGcm96ZW5Db2x1bW4gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgICBASW5wdXQoKSBnZXQgZnJvemVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJvemVuO1xuICAgIH1cblxuICAgIHNldCBmcm96ZW4odmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2Zyb3plbiA9IHZhbDtcbiAgICAgICAgdGhpcy51cGRhdGVTdGlja3lQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGFsaWduRnJvemVuOiBzdHJpbmcgPSAnbGVmdCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RpY2t5UG9zaXRpb24oKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxuXG4gICAgX2Zyb3plbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICB1cGRhdGVTdGlja3lQb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Zyb3plbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWxpZ25Gcm96ZW4gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmlnaHQgPSAwO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICAgICAgICByaWdodCA9IERvbUhhbmRsZXIuZ2V0T3V0ZXJXaWR0aChuZXh0KSArIChwYXJzZUZsb2F0KG5leHQuc3R5bGUucmlnaHQpIHx8IDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUucmlnaHQgPSByaWdodCArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgcHJldiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgocHJldikgKyAocGFyc2VGbG9hdChwcmV2LnN0eWxlLmxlZnQpIHx8IDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZmlsdGVyUm93ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgICAgICBpZiAoZmlsdGVyUm93KSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gRG9tSGFuZGxlci5pbmRleCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJSb3cuY2hpbGRyZW4gJiYgZmlsdGVyUm93LmNoaWxkcmVuW2luZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJSb3cuY2hpbGRyZW5baW5kZXhdLnN0eWxlLmxlZnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyUm93LmNoaWxkcmVuW2luZGV4XS5zdHlsZS5yaWdodCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5yaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twU29ydGFibGVDb2x1bW5dJyxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50JyxcbiAgICAgICAgJ1tjbGFzcy5wLXNvcnRhYmxlLWNvbHVtbl0nOiAnaXNFbmFibGVkKCknLFxuICAgICAgICAnW2NsYXNzLnAtaGlnaGxpZ2h0XSc6ICdzb3J0ZWQnLFxuICAgICAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2lzRW5hYmxlZCgpID8gXCIwXCIgOiBudWxsJyxcbiAgICAgICAgJ1thdHRyLnJvbGVdJzogJ1wiY29sdW1uaGVhZGVyXCInLFxuICAgICAgICAnW2F0dHIuYXJpYS1zb3J0XSc6ICdzb3J0T3JkZXInXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTb3J0YWJsZUNvbHVtbiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoJ3BTb3J0YWJsZUNvbHVtbicpIGZpZWxkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwU29ydGFibGVDb2x1bW5EaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIHNvcnRlZDogYm9vbGVhbjtcblxuICAgIHNvcnRPcmRlcjogc3RyaW5nO1xuXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLnNvcnRTb3VyY2UkLnN1YnNjcmliZSgoc29ydE1ldGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNvcnRTdGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU29ydFN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVTb3J0U3RhdGUoKSB7XG4gICAgICAgIHRoaXMuc29ydGVkID0gdGhpcy5kdC5pc1NvcnRlZCh0aGlzLmZpZWxkKTtcbiAgICAgICAgdGhpcy5zb3J0T3JkZXIgPSB0aGlzLnNvcnRlZCA/ICh0aGlzLmR0LnNvcnRPcmRlciA9PT0gMSA/ICdhc2NlbmRpbmcnIDogJ2Rlc2NlbmRpbmcnKSA6ICdub25lJztcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSAmJiAhdGhpcy5pc0ZpbHRlckVsZW1lbnQoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU29ydFN0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLmR0LnNvcnQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGZpZWxkOiB0aGlzLmZpZWxkXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgRG9tSGFuZGxlci5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5lbnRlcicsIFsnJGV2ZW50J10pXG4gICAgb25FbnRlcktleShldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLm9uQ2xpY2soZXZlbnQpO1xuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucFNvcnRhYmxlQ29sdW1uRGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgaXNGaWx0ZXJFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBEb21IYW5kbGVyLmhhc0NsYXNzKGVsZW1lbnQsICdwaS1maWx0ZXItaWNvbicpIHx8IERvbUhhbmRsZXIuaGFzQ2xhc3MoZWxlbWVudCwgJ3AtY29sdW1uLWZpbHRlci1tZW51LWJ1dHRvbicpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1zb3J0SWNvbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGkgY2xhc3M9XCJwLXNvcnRhYmxlLWNvbHVtbi1pY29uIHBpIHBpLWZ3XCIgW25nQ2xhc3NdPVwieyAncGktc29ydC1hbW91bnQtdXAtYWx0Jzogc29ydE9yZGVyID09PSAxLCAncGktc29ydC1hbW91bnQtZG93bic6IHNvcnRPcmRlciA9PT0gLTEsICdwaS1zb3J0LWFsdCc6IHNvcnRPcmRlciA9PT0gMCB9XCI+PC9pPlxuICAgICAgICA8c3BhbiAqbmdJZj1cImlzTXVsdGlTb3J0ZWQoKVwiIGNsYXNzPVwicC1zb3J0YWJsZS1jb2x1bW4tYmFkZ2VcIj57eyBnZXRCYWRnZVZhbHVlKCkgfX08L3NwYW4+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTb3J0SWNvbiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBmaWVsZDogc3RyaW5nO1xuXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBzb3J0T3JkZXI6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmR0LnRhYmxlU2VydmljZS5zb3J0U291cmNlJC5zdWJzY3JpYmUoKHNvcnRNZXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNvcnRTdGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVTb3J0U3RhdGUoKTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlU29ydFN0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy5kdC5zb3J0TW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydE9yZGVyID0gdGhpcy5kdC5pc1NvcnRlZCh0aGlzLmZpZWxkKSA/IHRoaXMuZHQuc29ydE9yZGVyIDogMDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmR0LnNvcnRNb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgICAgICBsZXQgc29ydE1ldGEgPSB0aGlzLmR0LmdldFNvcnRNZXRhKHRoaXMuZmllbGQpO1xuICAgICAgICAgICAgdGhpcy5zb3J0T3JkZXIgPSBzb3J0TWV0YSA/IHNvcnRNZXRhLm9yZGVyIDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgZ2V0TXVsdGlTb3J0TWV0YUluZGV4KCkge1xuICAgICAgICBsZXQgbXVsdGlTb3J0TWV0YSA9IHRoaXMuZHQuX211bHRpU29ydE1ldGE7XG4gICAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICAgIGlmIChtdWx0aVNvcnRNZXRhICYmIHRoaXMuZHQuc29ydE1vZGUgPT09ICdtdWx0aXBsZScgJiYgKHRoaXMuZHQuc2hvd0luaXRpYWxTb3J0QmFkZ2UgfHwgbXVsdGlTb3J0TWV0YS5sZW5ndGggPiAxKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtdWx0aVNvcnRNZXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGEgPSBtdWx0aVNvcnRNZXRhW2ldO1xuICAgICAgICAgICAgICAgIGlmIChtZXRhLmZpZWxkID09PSB0aGlzLmZpZWxkIHx8IG1ldGEuZmllbGQgPT09IHRoaXMuZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0QmFkZ2VWYWx1ZSgpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5nZXRNdWx0aVNvcnRNZXRhSW5kZXgoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5kdC5ncm91cFJvd3NCeSAmJiBpbmRleCA+IC0xID8gaW5kZXggOiBpbmRleCArIDE7XG4gICAgfVxuXG4gICAgaXNNdWx0aVNvcnRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZHQuc29ydE1vZGUgPT09ICdtdWx0aXBsZScgJiYgdGhpcy5nZXRNdWx0aVNvcnRNZXRhSW5kZXgoKSA+IC0xO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BTZWxlY3RhYmxlUm93XScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCcsXG4gICAgICAgICdbY2xhc3MucC1zZWxlY3RhYmxlLXJvd10nOiAnaXNFbmFibGVkKCknLFxuICAgICAgICAnW2NsYXNzLnAtaGlnaGxpZ2h0XSc6ICdzZWxlY3RlZCcsXG4gICAgICAgICdbYXR0ci50YWJpbmRleF0nOiAnaXNFbmFibGVkKCkgPyAwIDogdW5kZWZpbmVkJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0YWJsZVJvdyBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoJ3BTZWxlY3RhYmxlUm93JykgZGF0YTogYW55O1xuXG4gICAgQElucHV0KCdwU2VsZWN0YWJsZVJvd0luZGV4JykgaW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHBTZWxlY3RhYmxlUm93RGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBzZWxlY3RlZDogYm9vbGVhbjtcblxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIHRhYmxlU2VydmljZTogVGFibGVTZXJ2aWNlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLnNlbGVjdGlvblNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kdC5pc1NlbGVjdGVkKHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuZHQuaXNTZWxlY3RlZCh0aGlzLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICAgIG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmR0LmhhbmRsZVJvd0NsaWNrKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICByb3dEYXRhOiB0aGlzLmRhdGEsXG4gICAgICAgICAgICAgICAgcm93SW5kZXg6IHRoaXMuaW5kZXhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigndG91Y2hlbmQnLCBbJyRldmVudCddKVxuICAgIG9uVG91Y2hFbmQoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmR0LmhhbmRsZVJvd1RvdWNoRW5kKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uYXJyb3dkb3duJywgWyckZXZlbnQnXSlcbiAgICBvbkFycm93RG93bktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByb3cgPSA8SFRNTFRhYmxlUm93RWxlbWVudD5ldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBuZXh0Um93ID0gdGhpcy5maW5kTmV4dFNlbGVjdGFibGVSb3cocm93KTtcblxuICAgICAgICBpZiAobmV4dFJvdykge1xuICAgICAgICAgICAgbmV4dFJvdy5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmFycm93dXAnLCBbJyRldmVudCddKVxuICAgIG9uQXJyb3dVcEtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByb3cgPSA8SFRNTFRhYmxlUm93RWxlbWVudD5ldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBwcmV2Um93ID0gdGhpcy5maW5kUHJldlNlbGVjdGFibGVSb3cocm93KTtcblxuICAgICAgICBpZiAocHJldlJvdykge1xuICAgICAgICAgICAgcHJldlJvdy5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmVudGVyJywgWyckZXZlbnQnXSlcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLnNoaWZ0LmVudGVyJywgWyckZXZlbnQnXSlcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLm1ldGEuZW50ZXInLCBbJyRldmVudCddKVxuICAgIG9uRW50ZXJLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kdC5oYW5kbGVSb3dDbGljayh7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgIHJvd0RhdGE6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIHJvd0luZGV4OiB0aGlzLmluZGV4XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24ucGFnZWRvd24nKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24ucGFnZXVwJylcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmhvbWUnKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uZW5kJylcbiAgICBvblBhZ2VEb3duS2V5RG93bigpIHtcbiAgICAgICAgaWYgKHRoaXMuZHQudmlydHVhbFNjcm9sbCkge1xuICAgICAgICAgICAgdGhpcy5kdC5zY3JvbGxlci5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uc3BhY2UnKVxuICAgIG9uU3BhY2VLZXlkb3duKCkge1xuICAgICAgICBpZiAodGhpcy5kdC52aXJ0dWFsU2Nyb2xsICYmICF0aGlzLmR0LmVkaXRpbmdDZWxsKSB7XG4gICAgICAgICAgICB0aGlzLmR0LnNjcm9sbGVyLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZE5leHRTZWxlY3RhYmxlUm93KHJvdzogSFRNTFRhYmxlUm93RWxlbWVudCk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBsZXQgbmV4dFJvdyA9IDxIVE1MVGFibGVSb3dFbGVtZW50PnJvdy5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmIChuZXh0Um93KSB7XG4gICAgICAgICAgICBpZiAoRG9tSGFuZGxlci5oYXNDbGFzcyhuZXh0Um93LCAncC1zZWxlY3RhYmxlLXJvdycpKSByZXR1cm4gbmV4dFJvdztcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuZmluZE5leHRTZWxlY3RhYmxlUm93KG5leHRSb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldlNlbGVjdGFibGVSb3cocm93OiBIVE1MVGFibGVSb3dFbGVtZW50KTogSFRNTFRhYmxlUm93RWxlbWVudCB7XG4gICAgICAgIGxldCBwcmV2Um93ID0gPEhUTUxUYWJsZVJvd0VsZW1lbnQ+cm93LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmIChwcmV2Um93KSB7XG4gICAgICAgICAgICBpZiAoRG9tSGFuZGxlci5oYXNDbGFzcyhwcmV2Um93LCAncC1zZWxlY3RhYmxlLXJvdycpKSByZXR1cm4gcHJldlJvdztcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuZmluZFByZXZTZWxlY3RhYmxlUm93KHByZXZSb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBTZWxlY3RhYmxlUm93RGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcFNlbGVjdGFibGVSb3dEYmxDbGlja10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnLFxuICAgICAgICAnW2NsYXNzLnAtc2VsZWN0YWJsZS1yb3ddJzogJ2lzRW5hYmxlZCgpJyxcbiAgICAgICAgJ1tjbGFzcy5wLWhpZ2hsaWdodF0nOiAnc2VsZWN0ZWQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RhYmxlUm93RGJsQ2xpY2sgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCdwU2VsZWN0YWJsZVJvd0RibENsaWNrJykgZGF0YTogYW55O1xuXG4gICAgQElucHV0KCdwU2VsZWN0YWJsZVJvd0luZGV4JykgaW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHBTZWxlY3RhYmxlUm93RGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBzZWxlY3RlZDogYm9vbGVhbjtcblxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIHRhYmxlU2VydmljZTogVGFibGVTZXJ2aWNlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLnNlbGVjdGlvblNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kdC5pc1NlbGVjdGVkKHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuZHQuaXNTZWxlY3RlZCh0aGlzLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZGJsY2xpY2snLCBbJyRldmVudCddKVxuICAgIG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmR0LmhhbmRsZVJvd0NsaWNrKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICByb3dEYXRhOiB0aGlzLmRhdGEsXG4gICAgICAgICAgICAgICAgcm93SW5kZXg6IHRoaXMuaW5kZXhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wU2VsZWN0YWJsZVJvd0Rpc2FibGVkICE9PSB0cnVlO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BDb250ZXh0TWVudVJvd10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnLFxuICAgICAgICAnW2NsYXNzLnAtaGlnaGxpZ2h0LWNvbnRleHRtZW51XSc6ICdzZWxlY3RlZCcsXG4gICAgICAgICdbYXR0ci50YWJpbmRleF0nOiAnaXNFbmFibGVkKCkgPyAwIDogdW5kZWZpbmVkJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVSb3cge1xuICAgIEBJbnB1dCgncENvbnRleHRNZW51Um93JykgZGF0YTogYW55O1xuXG4gICAgQElucHV0KCdwQ29udGV4dE1lbnVSb3dJbmRleCcpIGluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBwQ29udGV4dE1lbnVSb3dEaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIHNlbGVjdGVkOiBib29sZWFuO1xuXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlLCBwdWJsaWMgdGFibGVTZXJ2aWNlOiBUYWJsZVNlcnZpY2UsIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5kdC50YWJsZVNlcnZpY2UuY29udGV4dE1lbnVTb3VyY2UkLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmR0LmVxdWFscyh0aGlzLmRhdGEsIGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXG4gICAgb25Db250ZXh0TWVudShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZHQuaGFuZGxlUm93UmlnaHRDbGljayh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgcm93RGF0YTogdGhpcy5kYXRhLFxuICAgICAgICAgICAgICAgIHJvd0luZGV4OiB0aGlzLmluZGV4XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wQ29udGV4dE1lbnVSb3dEaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twUm93VG9nZ2xlcl0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBSb3dUb2dnbGVyIHtcbiAgICBASW5wdXQoJ3BSb3dUb2dnbGVyJykgZGF0YTogYW55O1xuXG4gICAgQElucHV0KCkgcFJvd1RvZ2dsZXJEaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUpIHt9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgb25DbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZHQudG9nZ2xlUm93KHRoaXMuZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucFJvd1RvZ2dsZXJEaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BSZXNpemFibGVDb2x1bW5dJyxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgUmVzaXphYmxlQ29sdW1uIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBwUmVzaXphYmxlQ29sdW1uRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICByZXNpemVyOiBIVE1MU3BhbkVsZW1lbnQ7XG5cbiAgICByZXNpemVyTW91c2VEb3duTGlzdGVuZXI6IFZvaWRGdW5jdGlvbiB8IG51bGw7XG5cbiAgICBkb2N1bWVudE1vdXNlTW92ZUxpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZG9jdW1lbnRNb3VzZVVwTGlzdGVuZXI6IFZvaWRGdW5jdGlvbiB8IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCwgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lKSB7fVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3AtcmVzaXphYmxlLWNvbHVtbicpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplciA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5yZXNpemVyLCAncC1jb2x1bW4tcmVzaXplcicpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLnJlc2l6ZXIpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNpemVyTW91c2VEb3duTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLnJlc2l6ZXIsICdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50RXZlbnRzKCkge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudE1vdXNlTW92ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMub25Eb2N1bWVudE1vdXNlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRNb3VzZVVwTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMub25Eb2N1bWVudE1vdXNlVXAuYmluZCh0aGlzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50RXZlbnRzKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudE1vdXNlTW92ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50TW91c2VNb3ZlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRNb3VzZU1vdmVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kb2N1bWVudE1vdXNlVXBMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudE1vdXNlVXBMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudE1vdXNlVXBMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZHQub25Db2x1bW5SZXNpemVCZWdpbihldmVudCk7XG4gICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudEV2ZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Eb2N1bWVudE1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmR0Lm9uQ29sdW1uUmVzaXplKGV2ZW50KTtcbiAgICB9XG5cbiAgICBvbkRvY3VtZW50TW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmR0Lm9uQ29sdW1uUmVzaXplRW5kKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBSZXNpemFibGVDb2x1bW5EaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplck1vdXNlRG93bkxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZXJNb3VzZURvd25MaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5yZXNpemVyTW91c2VEb3duTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudEV2ZW50cygpO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcFJlb3JkZXJhYmxlQ29sdW1uXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFJlb3JkZXJhYmxlQ29sdW1uIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBwUmVvcmRlcmFibGVDb2x1bW5EaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIGRyYWdTdGFydExpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZHJhZ092ZXJMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGRyYWdFbnRlckxpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZHJhZ0xlYXZlTGlzdGVuZXI6IFZvaWRGdW5jdGlvbiB8IG51bGw7XG5cbiAgICBtb3VzZURvd25MaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55LCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHB1YmxpYyBkdDogVGFibGUsIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSkge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdTdGFydExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZHJhZ3N0YXJ0JywgdGhpcy5vbkRyYWdTdGFydC5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RyYWdvdmVyJywgdGhpcy5vbkRyYWdPdmVyLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnRW50ZXJMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RyYWdlbnRlcicsIHRoaXMub25EcmFnRW50ZXIuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdMZWF2ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZHJhZ2xlYXZlJywgdGhpcy5vbkRyYWdMZWF2ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRXZlbnRzKCkge1xuICAgICAgICBpZiAodGhpcy5tb3VzZURvd25MaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnU3RhcnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnT3Zlckxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdPdmVyTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnRW50ZXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kcmFnRW50ZXJMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kcmFnRW50ZXJMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnTGVhdmVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kcmFnTGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kcmFnTGVhdmVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlRG93bihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSAnSU5QVVQnIHx8IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJyB8fCBEb21IYW5kbGVyLmhhc0NsYXNzKGV2ZW50LnRhcmdldCwgJ3AtY29sdW1uLXJlc2l6ZXInKSkgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBlbHNlIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uRHJhZ1N0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHQub25Db2x1bW5EcmFnU3RhcnQoZXZlbnQsIHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgb25EcmFnT3ZlcihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uRHJhZ0VudGVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHQub25Db2x1bW5EcmFnRW50ZXIoZXZlbnQsIHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgb25EcmFnTGVhdmUoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5kdC5vbkNvbHVtbkRyYWdMZWF2ZShldmVudCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXG4gICAgb25Ecm9wKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmR0Lm9uQ29sdW1uRHJvcChldmVudCwgdGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucFJlb3JkZXJhYmxlQ29sdW1uRGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twRWRpdGFibGVDb2x1bW5dJyxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgRWRpdGFibGVDb2x1bW4gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgncEVkaXRhYmxlQ29sdW1uJykgZGF0YTogYW55O1xuXG4gICAgQElucHV0KCdwRWRpdGFibGVDb2x1bW5GaWVsZCcpIGZpZWxkOiBhbnk7XG5cbiAgICBASW5wdXQoJ3BFZGl0YWJsZUNvbHVtblJvd0luZGV4Jykgcm93SW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHBFZGl0YWJsZUNvbHVtbkRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgcEZvY3VzQ2VsbFNlbGVjdG9yOiBzdHJpbmc7XG5cbiAgICBvdmVybGF5RXZlbnRMaXN0ZW5lcjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSkge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncC1lZGl0YWJsZS1jb2x1bW4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmR0LnNlbGZDbGljayA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmR0LmVkaXRpbmdDZWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHQuZWRpdGluZ0NlbGwgIT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZHQuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VFZGl0aW5nQ2VsbCh0cnVlLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkNlbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkNlbGwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW5DZWxsKCkge1xuICAgICAgICB0aGlzLmR0LnVwZGF0ZUVkaXRpbmdDZWxsKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgdGhpcy5kYXRhLCB0aGlzLmZpZWxkLCB0aGlzLnJvd0luZGV4KTtcbiAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdwLWNlbGwtZWRpdGluZycpO1xuICAgICAgICB0aGlzLmR0Lm9uRWRpdEluaXQuZW1pdCh7IGZpZWxkOiB0aGlzLmZpZWxkLCBkYXRhOiB0aGlzLmRhdGEsIGluZGV4OiB0aGlzLnJvd0luZGV4IH0pO1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGZvY3VzQ2VsbFNlbGVjdG9yID0gdGhpcy5wRm9jdXNDZWxsU2VsZWN0b3IgfHwgJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JztcbiAgICAgICAgICAgICAgICBsZXQgZm9jdXNhYmxlRWxlbWVudCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGZvY3VzQ2VsbFNlbGVjdG9yKTtcblxuICAgICAgICAgICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3ZlcmxheUV2ZW50TGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZWwgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHQuc2VsZkNsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmR0Lm92ZXJsYXlTdWJzY3JpcHRpb24gPSB0aGlzLmR0Lm92ZXJsYXlTZXJ2aWNlLmNsaWNrT2JzZXJ2YWJsZS5zdWJzY3JpYmUodGhpcy5vdmVybGF5RXZlbnRMaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgY2xvc2VFZGl0aW5nQ2VsbChjb21wbGV0ZWQsIGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGV2ZW50RGF0YSA9IHsgZmllbGQ6IHRoaXMuZHQuZWRpdGluZ0NlbGxGaWVsZCwgZGF0YTogdGhpcy5kdC5lZGl0aW5nQ2VsbERhdGEsIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBpbmRleDogdGhpcy5kdC5lZGl0aW5nQ2VsbFJvd0luZGV4IH07XG5cbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgICAgdGhpcy5kdC5vbkVkaXRDb21wbGV0ZS5lbWl0KGV2ZW50RGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmR0Lm9uRWRpdENhbmNlbC5lbWl0KGV2ZW50RGF0YSk7XG5cbiAgICAgICAgICAgIHRoaXMuZHQudmFsdWUuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50W3RoaXMuZHQuZWRpdGluZ0NlbGxGaWVsZF0gPT09IHRoaXMuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50W3RoaXMuZHQuZWRpdGluZ0NlbGxGaWVsZF0gPSB0aGlzLmR0LmVkaXRpbmdDZWxsRGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5kdC5lZGl0aW5nQ2VsbCwgJ3AtY2VsbC1lZGl0aW5nJyk7XG4gICAgICAgIHRoaXMuZHQuZWRpdGluZ0NlbGwgPSBudWxsO1xuICAgICAgICB0aGlzLmR0LmVkaXRpbmdDZWxsRGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuZHQuZWRpdGluZ0NlbGxGaWVsZCA9IG51bGw7XG4gICAgICAgIHRoaXMuZHQudW5iaW5kRG9jdW1lbnRFZGl0TGlzdGVuZXIoKTtcblxuICAgICAgICBpZiAodGhpcy5kdC5vdmVybGF5U3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmR0Lm92ZXJsYXlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uZW50ZXInLCBbJyRldmVudCddKVxuICAgIG9uRW50ZXJLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kdC5pc0VkaXRpbmdDZWxsVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VFZGl0aW5nQ2VsbCh0cnVlLCBldmVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLnRhYicsIFsnJGV2ZW50J10pXG4gICAgb25UYWJLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kdC5pc0VkaXRpbmdDZWxsVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VFZGl0aW5nQ2VsbCh0cnVlLCBldmVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmVzY2FwZScsIFsnJGV2ZW50J10pXG4gICAgb25Fc2NhcGVLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kdC5pc0VkaXRpbmdDZWxsVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VFZGl0aW5nQ2VsbChmYWxzZSwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi50YWInLCBbJyRldmVudCddKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uc2hpZnQudGFiJywgWyckZXZlbnQnXSlcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLm1ldGEudGFiJywgWyckZXZlbnQnXSlcbiAgICBvblNoaWZ0S2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB0aGlzLm1vdmVUb1ByZXZpb3VzQ2VsbChldmVudCk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb05leHRDZWxsKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmFycm93ZG93bicsIFsnJGV2ZW50J10pXG4gICAgb25BcnJvd0Rvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q2VsbCA9IHRoaXMuZmluZENlbGwoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2VsbCkge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsSW5kZXggPSBEb21IYW5kbGVyLmluZGV4KGN1cnJlbnRDZWxsKTtcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Q2VsbCA9IHRoaXMuZmluZE5leHRFZGl0YWJsZUNvbHVtbkJ5SW5kZXgoY3VycmVudENlbGwsIGNlbGxJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Q2VsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kdC5pc0VkaXRpbmdDZWxsVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZUVkaXRpbmdDZWxsKHRydWUsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZChldmVudC50YXJnZXQsICdibHVyJyk7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZCh0YXJnZXRDZWxsLCAnY2xpY2snKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5hcnJvd3VwJywgWyckZXZlbnQnXSlcbiAgICBvbkFycm93VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q2VsbCA9IHRoaXMuZmluZENlbGwoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2VsbCkge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsSW5kZXggPSBEb21IYW5kbGVyLmluZGV4KGN1cnJlbnRDZWxsKTtcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Q2VsbCA9IHRoaXMuZmluZFByZXZFZGl0YWJsZUNvbHVtbkJ5SW5kZXgoY3VycmVudENlbGwsIGNlbGxJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Q2VsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kdC5pc0VkaXRpbmdDZWxsVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZUVkaXRpbmdDZWxsKHRydWUsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZChldmVudC50YXJnZXQsICdibHVyJyk7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZCh0YXJnZXRDZWxsLCAnY2xpY2snKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5hcnJvd2xlZnQnLCBbJyRldmVudCddKVxuICAgIG9uQXJyb3dMZWZ0KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUb1ByZXZpb3VzQ2VsbChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmFycm93cmlnaHQnLCBbJyRldmVudCddKVxuICAgIG9uQXJyb3dSaWdodChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG9OZXh0Q2VsbChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQ2VsbChlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgY2VsbCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAoY2VsbCAmJiAhRG9tSGFuZGxlci5oYXNDbGFzcyhjZWxsLCAncC1jZWxsLWVkaXRpbmcnKSkge1xuICAgICAgICAgICAgICAgIGNlbGwgPSBjZWxsLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjZWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlVG9QcmV2aW91c0NlbGwoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRDZWxsID0gdGhpcy5maW5kQ2VsbChldmVudC50YXJnZXQpO1xuICAgICAgICBpZiAoY3VycmVudENlbGwpIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRDZWxsID0gdGhpcy5maW5kUHJldmlvdXNFZGl0YWJsZUNvbHVtbihjdXJyZW50Q2VsbCk7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRDZWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHQuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZUVkaXRpbmdDZWxsKHRydWUsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmludm9rZUVsZW1lbnRNZXRob2QoZXZlbnQudGFyZ2V0LCAnYmx1cicpO1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZCh0YXJnZXRDZWxsLCAnY2xpY2snKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZVRvTmV4dENlbGwoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRDZWxsID0gdGhpcy5maW5kQ2VsbChldmVudC50YXJnZXQpO1xuICAgICAgICBpZiAoY3VycmVudENlbGwpIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRDZWxsID0gdGhpcy5maW5kTmV4dEVkaXRhYmxlQ29sdW1uKGN1cnJlbnRDZWxsKTtcblxuICAgICAgICAgICAgaWYgKHRhcmdldENlbGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kdC5pc0VkaXRpbmdDZWxsVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRWRpdGluZ0NlbGwodHJ1ZSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZChldmVudC50YXJnZXQsICdibHVyJyk7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5pbnZva2VFbGVtZW50TWV0aG9kKHRhcmdldENlbGwsICdjbGljaycpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldmlvdXNFZGl0YWJsZUNvbHVtbihjZWxsOiBFbGVtZW50KSB7XG4gICAgICAgIGxldCBwcmV2Q2VsbCA9IGNlbGwucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgICAgICBpZiAoIXByZXZDZWxsKSB7XG4gICAgICAgICAgICBsZXQgcHJldmlvdXNSb3cgPSBjZWxsLnBhcmVudEVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChwcmV2aW91c1Jvdykge1xuICAgICAgICAgICAgICAgIHByZXZDZWxsID0gcHJldmlvdXNSb3cubGFzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcmV2Q2VsbCkge1xuICAgICAgICAgICAgaWYgKERvbUhhbmRsZXIuaGFzQ2xhc3MocHJldkNlbGwsICdwLWVkaXRhYmxlLWNvbHVtbicpKSByZXR1cm4gcHJldkNlbGw7XG4gICAgICAgICAgICBlbHNlIHJldHVybiB0aGlzLmZpbmRQcmV2aW91c0VkaXRhYmxlQ29sdW1uKHByZXZDZWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZE5leHRFZGl0YWJsZUNvbHVtbihjZWxsOiBFbGVtZW50KSB7XG4gICAgICAgIGxldCBuZXh0Q2VsbCA9IGNlbGwubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmICghbmV4dENlbGwpIHtcbiAgICAgICAgICAgIGxldCBuZXh0Um93ID0gY2VsbC5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChuZXh0Um93KSB7XG4gICAgICAgICAgICAgICAgbmV4dENlbGwgPSBuZXh0Um93LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHRDZWxsKSB7XG4gICAgICAgICAgICBpZiAoRG9tSGFuZGxlci5oYXNDbGFzcyhuZXh0Q2VsbCwgJ3AtZWRpdGFibGUtY29sdW1uJykpIHJldHVybiBuZXh0Q2VsbDtcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuZmluZE5leHRFZGl0YWJsZUNvbHVtbihuZXh0Q2VsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmROZXh0RWRpdGFibGVDb2x1bW5CeUluZGV4KGNlbGw6IEVsZW1lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG5leHRSb3cgPSBjZWxsLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChuZXh0Um93KSB7XG4gICAgICAgICAgICBsZXQgbmV4dENlbGwgPSBuZXh0Um93LmNoaWxkcmVuW2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKG5leHRDZWxsICYmIERvbUhhbmRsZXIuaGFzQ2xhc3MobmV4dENlbGwsICdwLWVkaXRhYmxlLWNvbHVtbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHRDZWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZFByZXZFZGl0YWJsZUNvbHVtbkJ5SW5kZXgoY2VsbDogRWxlbWVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICBsZXQgcHJldlJvdyA9IGNlbGwucGFyZW50RWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChwcmV2Um93KSB7XG4gICAgICAgICAgICBsZXQgcHJldkNlbGwgPSBwcmV2Um93LmNoaWxkcmVuW2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHByZXZDZWxsICYmIERvbUhhbmRsZXIuaGFzQ2xhc3MocHJldkNlbGwsICdwLWVkaXRhYmxlLWNvbHVtbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZDZWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wRWRpdGFibGVDb2x1bW5EaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZHQub3ZlcmxheVN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5kdC5vdmVybGF5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BFZGl0YWJsZVJvd10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBFZGl0YWJsZVJvdyB7XG4gICAgQElucHV0KCdwRWRpdGFibGVSb3cnKSBkYXRhOiBhbnk7XG5cbiAgICBASW5wdXQoKSBwRWRpdGFibGVSb3dEaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge31cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucEVkaXRhYmxlUm93RGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twSW5pdEVkaXRhYmxlUm93XScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEluaXRFZGl0YWJsZVJvdyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVkaXRhYmxlUm93OiBFZGl0YWJsZVJvdykge31cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICB0aGlzLmR0LmluaXRSb3dFZGl0KHRoaXMuZWRpdGFibGVSb3cuZGF0YSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twU2F2ZUVkaXRhYmxlUm93XScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFNhdmVFZGl0YWJsZVJvdyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVkaXRhYmxlUm93OiBFZGl0YWJsZVJvdykge31cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICB0aGlzLmR0LnNhdmVSb3dFZGl0KHRoaXMuZWRpdGFibGVSb3cuZGF0YSwgdGhpcy5lZGl0YWJsZVJvdy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BDYW5jZWxFZGl0YWJsZVJvd10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBDYW5jZWxFZGl0YWJsZVJvdyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGR0OiBUYWJsZSwgcHVibGljIGVkaXRhYmxlUm93OiBFZGl0YWJsZVJvdykge31cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICB0aGlzLmR0LmNhbmNlbFJvd0VkaXQodGhpcy5lZGl0YWJsZVJvdy5kYXRhKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jZWxsRWRpdG9yJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZWRpdGluZ1wiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImlucHV0VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhZWRpdGluZ1wiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIm91dHB1dFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIGAsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQ2VsbEVkaXRvciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT47XG5cbiAgICBpbnB1dFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgb3V0cHV0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlLCBAT3B0aW9uYWwoKSBwdWJsaWMgZWRpdGFibGVDb2x1bW46IEVkaXRhYmxlQ29sdW1uLCBAT3B0aW9uYWwoKSBwdWJsaWMgZWRpdGFibGVSb3c6IEVkaXRhYmxlUm93KSB7fVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ291dHB1dCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGVkaXRpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5kdC5lZGl0aW5nQ2VsbCAmJiB0aGlzLmVkaXRhYmxlQ29sdW1uICYmIHRoaXMuZHQuZWRpdGluZ0NlbGwgPT09IHRoaXMuZWRpdGFibGVDb2x1bW4uZWwubmF0aXZlRWxlbWVudCkgfHwgKHRoaXMuZWRpdGFibGVSb3cgJiYgdGhpcy5kdC5lZGl0TW9kZSA9PT0gJ3JvdycgJiYgdGhpcy5kdC5pc1Jvd0VkaXRpbmcodGhpcy5lZGl0YWJsZVJvdy5kYXRhKSk7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdGFibGVSYWRpb0J1dHRvbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInAtcmFkaW9idXR0b24gcC1jb21wb25lbnRcIiBbbmdDbGFzc109XCJ7ICdwLXJhZGlvYnV0dG9uLWZvY3VzZWQnOiBmb2N1c2VkLCAncC1yYWRpb2J1dHRvbi1jaGVja2VkJzogY2hlY2tlZCwgJ3AtcmFkaW9idXR0b24tZGlzYWJsZWQnOiBkaXNhYmxlZCB9XCIgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtaGlkZGVuLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgI3JiIHR5cGU9XCJyYWRpb1wiIFthdHRyLmlkXT1cImlucHV0SWRcIiBbYXR0ci5uYW1lXT1cIm5hbWVcIiBbY2hlY2tlZF09XCJjaGVja2VkXCIgKGZvY3VzKT1cIm9uRm9jdXMoKVwiIChibHVyKT1cIm9uQmx1cigpXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICNib3ggW25nQ2xhc3NdPVwieyAncC1yYWRpb2J1dHRvbi1ib3ggcC1jb21wb25lbnQnOiB0cnVlLCAncC1oaWdobGlnaHQnOiBjaGVja2VkLCAncC1mb2N1cyc6IGZvY3VzZWQsICdwLWRpc2FibGVkJzogZGlzYWJsZWQgfVwiIHJvbGU9XCJyYWRpb1wiIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcmFkaW9idXR0b24taWNvblwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVGFibGVSYWRpb0J1dHRvbiB7XG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB2YWx1ZTogYW55O1xuXG4gICAgQElucHV0KCkgaW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgQFZpZXdDaGlsZCgncmInKSBpbnB1dFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIGNoZWNrZWQ6IGJvb2xlYW47XG5cbiAgICBmb2N1c2VkOiBib29sZWFuO1xuXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5kdC50YWJsZVNlcnZpY2Uuc2VsZWN0aW9uU291cmNlJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkID0gdGhpcy5kdC5pc1NlbGVjdGVkKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMuZHQuaXNTZWxlY3RlZCh0aGlzLnZhbHVlKTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZHQudG9nZ2xlUm93V2l0aFJhZGlvKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgIHJvd0luZGV4OiB0aGlzLmluZGV4XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgRG9tSGFuZGxlci5jbGVhclNlbGVjdGlvbigpO1xuICAgIH1cblxuICAgIG9uRm9jdXMoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25CbHVyKCkge1xuICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdGFibGVDaGVja2JveCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInAtY2hlY2tib3ggcC1jb21wb25lbnRcIiBbbmdDbGFzc109XCJ7ICdwLWNoZWNrYm94LWZvY3VzZWQnOiBmb2N1c2VkLCAncC1jaGVja2JveC1kaXNhYmxlZCc6IGRpc2FibGVkIH1cIiAoY2xpY2spPVwib25DbGljaygkZXZlbnQpXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1oaWRkZW4tYWNjZXNzaWJsZVwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBbYXR0ci5pZF09XCJpbnB1dElkXCIgW2F0dHIubmFtZV09XCJuYW1lXCIgW2NoZWNrZWRdPVwiY2hlY2tlZFwiIChmb2N1cyk9XCJvbkZvY3VzKClcIiAoYmx1cik9XCJvbkJsdXIoKVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFthdHRyLnJlcXVpcmVkXT1cInJlcXVpcmVkXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICNib3ggW25nQ2xhc3NdPVwieyAncC1jaGVja2JveC1ib3ggcC1jb21wb25lbnQnOiB0cnVlLCAncC1oaWdobGlnaHQnOiBjaGVja2VkLCAncC1mb2N1cyc6IGZvY3VzZWQsICdwLWRpc2FibGVkJzogZGlzYWJsZWQgfVwiIHJvbGU9XCJjaGVja2JveFwiIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWNoZWNrYm94LWljb25cIiBbbmdDbGFzc109XCJ7ICdwaSBwaS1jaGVjayc6IGNoZWNrZWQgfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRhYmxlQ2hlY2tib3gge1xuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgdmFsdWU6IGFueTtcblxuICAgIEBJbnB1dCgpIGluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBpbnB1dElkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSByZXF1aXJlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgY2hlY2tlZDogYm9vbGVhbjtcblxuICAgIGZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIHB1YmxpYyB0YWJsZVNlcnZpY2U6IFRhYmxlU2VydmljZSwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLnNlbGVjdGlvblNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMuZHQuaXNTZWxlY3RlZCh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLmR0LmlzU2VsZWN0ZWQodGhpcy52YWx1ZSk7XG4gICAgfVxuXG4gICAgb25DbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmR0LnRvZ2dsZVJvd1dpdGhDaGVja2JveChcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICByb3dJbmRleDogdGhpcy5pbmRleFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBEb21IYW5kbGVyLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgb25Gb2N1cygpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkJsdXIoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10YWJsZUhlYWRlckNoZWNrYm94JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IGNsYXNzPVwicC1jaGVja2JveCBwLWNvbXBvbmVudFwiIFtuZ0NsYXNzXT1cInsgJ3AtY2hlY2tib3gtZm9jdXNlZCc6IGZvY3VzZWQsICdwLWNoZWNrYm94LWRpc2FibGVkJzogaXNEaXNhYmxlZCgpIH1cIiAoY2xpY2spPVwib25DbGljaygkZXZlbnQpXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1oaWRkZW4tYWNjZXNzaWJsZVwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCAjY2IgdHlwZT1cImNoZWNrYm94XCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIFthdHRyLm5hbWVdPVwibmFtZVwiIFtjaGVja2VkXT1cImNoZWNrZWRcIiAoZm9jdXMpPVwib25Gb2N1cygpXCIgKGJsdXIpPVwib25CbHVyKClcIiBbZGlzYWJsZWRdPVwiaXNEaXNhYmxlZCgpXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICNib3ggW25nQ2xhc3NdPVwieyAncC1jaGVja2JveC1ib3gnOiB0cnVlLCAncC1oaWdobGlnaHQnOiBjaGVja2VkLCAncC1mb2N1cyc6IGZvY3VzZWQsICdwLWRpc2FibGVkJzogaXNEaXNhYmxlZCgpIH1cIiByb2xlPVwiY2hlY2tib3hcIiBbYXR0ci5hcmlhLWNoZWNrZWRdPVwiY2hlY2tlZFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1jaGVja2JveC1pY29uXCIgW25nQ2xhc3NdPVwieyAncGkgcGktY2hlY2snOiBjaGVja2VkIH1cIj48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUYWJsZUhlYWRlckNoZWNrYm94IHtcbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgY2hlY2tlZDogYm9vbGVhbjtcblxuICAgIGZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgICBzZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIHZhbHVlQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZHQ6IFRhYmxlLCBwdWJsaWMgdGFibGVTZXJ2aWNlOiBUYWJsZVNlcnZpY2UsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuZHQudGFibGVTZXJ2aWNlLnZhbHVlU291cmNlJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkID0gdGhpcy51cGRhdGVDaGVja2VkU3RhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmR0LnRhYmxlU2VydmljZS5zZWxlY3Rpb25Tb3VyY2UkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLnVwZGF0ZUNoZWNrZWRTdGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gdGhpcy51cGRhdGVDaGVja2VkU3RhdGUoKTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmR0LnZhbHVlICYmIHRoaXMuZHQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHQudG9nZ2xlUm93c1dpdGhDaGVja2JveChldmVudCwgIXRoaXMuY2hlY2tlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBEb21IYW5kbGVyLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgb25Gb2N1cygpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkJsdXIoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlzRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICF0aGlzLmR0LnZhbHVlIHx8ICF0aGlzLmR0LnZhbHVlLmxlbmd0aDtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWVDaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUNoZWNrZWRTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgICBpZiAodGhpcy5kdC5fc2VsZWN0QWxsICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kdC5fc2VsZWN0QWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZHQuc2VsZWN0aW9uUGFnZU9ubHkgPyB0aGlzLmR0LmRhdGFUb1JlbmRlcih0aGlzLmR0LnByb2Nlc3NlZERhdGEpIDogdGhpcy5kdC5wcm9jZXNzZWREYXRhO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy5kdC5mcm96ZW5WYWx1ZSA/IFsuLi50aGlzLmR0LmZyb3plblZhbHVlLCAuLi5kYXRhXSA6IGRhdGE7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RhYmxlVmFsID0gdGhpcy5kdC5yb3dTZWxlY3RhYmxlID8gdmFsLmZpbHRlcigoZGF0YSwgaW5kZXgpID0+IHRoaXMuZHQucm93U2VsZWN0YWJsZSh7IGRhdGEsIGluZGV4IH0pKSA6IHZhbDtcblxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLmlzTm90RW1wdHkoc2VsZWN0YWJsZVZhbCkgJiYgT2JqZWN0VXRpbHMuaXNOb3RFbXB0eSh0aGlzLmR0LnNlbGVjdGlvbikgJiYgc2VsZWN0YWJsZVZhbC5ldmVyeSgodikgPT4gdGhpcy5kdC5zZWxlY3Rpb24uc29tZSgocykgPT4gdGhpcy5kdC5lcXVhbHModiwgcykpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcFJlb3JkZXJhYmxlUm93SGFuZGxlXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFJlb3JkZXJhYmxlUm93SGFuZGxlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3AtZGF0YXRhYmxlLXJlb3JkZXJhYmxlcm93LWhhbmRsZScpO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcFJlb3JkZXJhYmxlUm93XScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFJlb3JkZXJhYmxlUm93IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgQElucHV0KCdwUmVvcmRlcmFibGVSb3cnKSBpbmRleDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcFJlb3JkZXJhYmxlUm93RGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBtb3VzZURvd25MaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGRyYWdTdGFydExpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZHJhZ0VuZExpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZHJhZ092ZXJMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGRyYWdMZWF2ZUxpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZHJvcExpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwdWJsaWMgZHQ6IFRhYmxlLCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUpIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJvcHBhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubW91c2VEb3duTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZHJhZ3N0YXJ0JywgdGhpcy5vbkRyYWdTdGFydC5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5kcmFnRW5kTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkcmFnZW5kJywgdGhpcy5vbkRyYWdFbmQuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RyYWdvdmVyJywgdGhpcy5vbkRyYWdPdmVyLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmRyYWdMZWF2ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZHJhZ2xlYXZlJywgdGhpcy5vbkRyYWdMZWF2ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5iaW5kRXZlbnRzKCkge1xuICAgICAgICBpZiAodGhpcy5tb3VzZURvd25MaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnU3RhcnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnRW5kTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0VuZExpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRyYWdFbmRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnT3Zlckxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdPdmVyTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmFnTGVhdmVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kcmFnTGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kcmFnTGVhdmVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlRG93bihldmVudCkge1xuICAgICAgICBpZiAoRG9tSGFuZGxlci5oYXNDbGFzcyhldmVudC50YXJnZXQsICdwLWRhdGF0YWJsZS1yZW9yZGVyYWJsZXJvdy1oYW5kbGUnKSkgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICAgIGVsc2UgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uRHJhZ1N0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHQub25Sb3dEcmFnU3RhcnQoZXZlbnQsIHRoaXMuaW5kZXgpO1xuICAgIH1cblxuICAgIG9uRHJhZ0VuZChldmVudCkge1xuICAgICAgICB0aGlzLmR0Lm9uUm93RHJhZ0VuZChldmVudCk7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkRyYWdPdmVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHQub25Sb3dEcmFnT3ZlcihldmVudCwgdGhpcy5pbmRleCwgdGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbkRyYWdMZWF2ZShldmVudCkge1xuICAgICAgICB0aGlzLmR0Lm9uUm93RHJhZ0xlYXZlKGV2ZW50LCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucFJlb3JkZXJhYmxlUm93RGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXG4gICAgb25Ecm9wKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpICYmIHRoaXMuZHQucm93RHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZHQub25Sb3dEcm9wKGV2ZW50LCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRFdmVudHMoKTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jb2x1bW5GaWx0ZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLWNvbHVtbi1maWx0ZXJcIiBbbmdDbGFzc109XCJ7ICdwLWNvbHVtbi1maWx0ZXItcm93JzogZGlzcGxheSA9PT0gJ3JvdycsICdwLWNvbHVtbi1maWx0ZXItbWVudSc6IGRpc3BsYXkgPT09ICdtZW51JyB9XCI+XG4gICAgICAgICAgICA8cC1jb2x1bW5GaWx0ZXJGb3JtRWxlbWVudFxuICAgICAgICAgICAgICAgICpuZ0lmPVwiZGlzcGxheSA9PT0gJ3JvdydcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwicC1mbHVpZFwiXG4gICAgICAgICAgICAgICAgW3R5cGVdPVwidHlwZVwiXG4gICAgICAgICAgICAgICAgW2ZpZWxkXT1cImZpZWxkXCJcbiAgICAgICAgICAgICAgICBbZmlsdGVyQ29uc3RyYWludF09XCJkdC5maWx0ZXJzW2ZpZWxkXVwiXG4gICAgICAgICAgICAgICAgW2ZpbHRlclRlbXBsYXRlXT1cImZpbHRlclRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbcGxhY2Vob2xkZXJdPVwicGxhY2Vob2xkZXJcIlxuICAgICAgICAgICAgICAgIFttaW5GcmFjdGlvbkRpZ2l0c109XCJtaW5GcmFjdGlvbkRpZ2l0c1wiXG4gICAgICAgICAgICAgICAgW21heEZyYWN0aW9uRGlnaXRzXT1cIm1heEZyYWN0aW9uRGlnaXRzXCJcbiAgICAgICAgICAgICAgICBbcHJlZml4XT1cInByZWZpeFwiXG4gICAgICAgICAgICAgICAgW3N1ZmZpeF09XCJzdWZmaXhcIlxuICAgICAgICAgICAgICAgIFtsb2NhbGVdPVwibG9jYWxlXCJcbiAgICAgICAgICAgICAgICBbbG9jYWxlTWF0Y2hlcl09XCJsb2NhbGVNYXRjaGVyXCJcbiAgICAgICAgICAgICAgICBbY3VycmVuY3ldPVwiY3VycmVuY3lcIlxuICAgICAgICAgICAgICAgIFtjdXJyZW5jeURpc3BsYXldPVwiY3VycmVuY3lEaXNwbGF5XCJcbiAgICAgICAgICAgICAgICBbdXNlR3JvdXBpbmddPVwidXNlR3JvdXBpbmdcIlxuICAgICAgICAgICAgICAgIFtzaG93QnV0dG9uc109XCJzaG93QnV0dG9uc1wiXG4gICAgICAgICAgICA+PC9wLWNvbHVtbkZpbHRlckZvcm1FbGVtZW50PlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICNpY29uXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJzaG93TWVudUJ1dHRvblwiXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLWNvbHVtbi1maWx0ZXItbWVudS1idXR0b24gcC1saW5rXCJcbiAgICAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJvdmVybGF5VmlzaWJsZVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1jb2x1bW4tZmlsdGVyLW1lbnUtYnV0dG9uLW9wZW4nOiBvdmVybGF5VmlzaWJsZSwgJ3AtY29sdW1uLWZpbHRlci1tZW51LWJ1dHRvbi1hY3RpdmUnOiBoYXNGaWx0ZXIoKSB9XCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlTWVudSgpXCJcbiAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvblRvZ2dsZUJ1dHRvbktleURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaSBwaS1maWx0ZXItaWNvbiBwaS1maWx0ZXJcIj48L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gI2ljb24gKm5nSWY9XCJzaG93Q2xlYXJCdXR0b24gJiYgZGlzcGxheSA9PT0gJ3JvdydcIiBbbmdDbGFzc109XCJ7ICdwLWhpZGRlbi1zcGFjZSc6ICFoYXNSb3dGaWx0ZXIoKSB9XCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicC1jb2x1bW4tZmlsdGVyLWNsZWFyLWJ1dHRvbiBwLWxpbmtcIiAoY2xpY2spPVwiY2xlYXJGaWx0ZXIoKVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGkgcGktZmlsdGVyLXNsYXNoXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgKm5nSWY9XCJzaG93TWVudSAmJiBvdmVybGF5VmlzaWJsZVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1jb2x1bW4tZmlsdGVyLW92ZXJsYXkgcC1jb21wb25lbnQgcC1mbHVpZCc6IHRydWUsICdwLWNvbHVtbi1maWx0ZXItb3ZlcmxheS1tZW51JzogZGlzcGxheSA9PT0gJ21lbnUnIH1cIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJvbkNvbnRlbnRDbGljaygpXCJcbiAgICAgICAgICAgICAgICBbQG92ZXJsYXlBbmltYXRpb25dPVwiJ3Zpc2libGUnXCJcbiAgICAgICAgICAgICAgICAoQG92ZXJsYXlBbmltYXRpb24uc3RhcnQpPVwib25PdmVybGF5QW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKEBvdmVybGF5QW5pbWF0aW9uLmRvbmUpPVwib25PdmVybGF5QW5pbWF0aW9uRW5kKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChrZXlkb3duLmVzY2FwZSk9XCJvbkVzY2FwZSgpXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaGVhZGVyVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBmaWVsZCB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPHVsICpuZ0lmPVwiZGlzcGxheSA9PT0gJ3Jvdyc7IGVsc2UgbWVudVwiIGNsYXNzPVwicC1jb2x1bW4tZmlsdGVyLXJvdy1pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1jb2x1bW4tZmlsdGVyLXJvdy1pdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBtYXRjaE1vZGUgb2YgbWF0Y2hNb2RlczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25Sb3dNYXRjaE1vZGVDaGFuZ2UobWF0Y2hNb2RlLnZhbHVlKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvblJvd01hdGNoTW9kZUtleURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bi5lbnRlcik9XCJ0aGlzLm9uUm93TWF0Y2hNb2RlQ2hhbmdlKG1hdGNoTW9kZS52YWx1ZSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1oaWdobGlnaHQnOiBpc1Jvd01hdGNoTW9kZVNlbGVjdGVkKG1hdGNoTW9kZS52YWx1ZSkgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJpID09PSAwID8gJzAnIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt7IG1hdGNoTW9kZS5sYWJlbCB9fVxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLWNvbHVtbi1maWx0ZXItc2VwYXJhdG9yXCI+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwicC1jb2x1bW4tZmlsdGVyLXJvdy1pdGVtXCIgKGNsaWNrKT1cIm9uUm93Q2xlYXJJdGVtQ2xpY2soKVwiIChrZXlkb3duKT1cIm9uUm93TWF0Y2hNb2RlS2V5RG93bigkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwib25Sb3dDbGVhckl0ZW1DbGljaygpXCI+e3sgbm9GaWx0ZXJMYWJlbCB9fTwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI21lbnU+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWNvbHVtbi1maWx0ZXItb3BlcmF0b3JcIiAqbmdJZj1cImlzU2hvd09wZXJhdG9yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93biBbb3B0aW9uc109XCJvcGVyYXRvck9wdGlvbnNcIiBbbmdNb2RlbF09XCJvcGVyYXRvclwiIChuZ01vZGVsQ2hhbmdlKT1cIm9uT3BlcmF0b3JDaGFuZ2UoJGV2ZW50KVwiIHN0eWxlQ2xhc3M9XCJwLWNvbHVtbi1maWx0ZXItb3BlcmF0b3ItZHJvcGRvd25cIj48L3AtZHJvcGRvd24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1jb2x1bW4tZmlsdGVyLWNvbnN0cmFpbnRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBmaWVsZENvbnN0cmFpbnQgb2YgZmllbGRDb25zdHJhaW50czsgbGV0IGkgPSBpbmRleFwiIGNsYXNzPVwicC1jb2x1bW4tZmlsdGVyLWNvbnN0cmFpbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cC1kcm9wZG93blxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdJZj1cInNob3dNYXRjaE1vZGVzICYmIG1hdGNoTW9kZXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc109XCJtYXRjaE1vZGVzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nTW9kZWxdPVwiZmllbGRDb25zdHJhaW50Lm1hdGNoTW9kZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZ01vZGVsQ2hhbmdlKT1cIm9uTWVudU1hdGNoTW9kZUNoYW5nZSgkZXZlbnQsIGZpZWxkQ29uc3RyYWludClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUNsYXNzPVwicC1jb2x1bW4tZmlsdGVyLW1hdGNobW9kZS1kcm9wZG93blwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPjwvcC1kcm9wZG93bj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cC1jb2x1bW5GaWx0ZXJGb3JtRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdHlwZV09XCJ0eXBlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZpZWxkXT1cImZpZWxkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZpbHRlckNvbnN0cmFpbnRdPVwiZmllbGRDb25zdHJhaW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZpbHRlclRlbXBsYXRlXT1cImZpbHRlclRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW21pbkZyYWN0aW9uRGlnaXRzXT1cIm1pbkZyYWN0aW9uRGlnaXRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW21heEZyYWN0aW9uRGlnaXRzXT1cIm1heEZyYWN0aW9uRGlnaXRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ByZWZpeF09XCJwcmVmaXhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3VmZml4XT1cInN1ZmZpeFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtsb2NhbGVdPVwibG9jYWxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xvY2FsZU1hdGNoZXJdPVwibG9jYWxlTWF0Y2hlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjdXJyZW5jeV09XCJjdXJyZW5jeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjdXJyZW5jeURpc3BsYXldPVwiY3VycmVuY3lEaXNwbGF5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3VzZUdyb3VwaW5nXT1cInVzZUdyb3VwaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+PC9wLWNvbHVtbkZpbHRlckZvcm1FbGVtZW50PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2hvd1JlbW92ZUljb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uPVwicGkgcGktdHJhc2hcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLWNvbHVtbi1maWx0ZXItcmVtb3ZlLWJ1dHRvbiBwLWJ1dHRvbi10ZXh0IHAtYnV0dG9uLWRhbmdlciBwLWJ1dHRvbi1zbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwicmVtb3ZlQ29uc3RyYWludChmaWVsZENvbnN0cmFpbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtsYWJlbF09XCJyZW1vdmVSdWxlQnV0dG9uTGFiZWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWNvbHVtbi1maWx0ZXItYWRkLXJ1bGVcIiAqbmdJZj1cImlzU2hvd0FkZENvbnN0cmFpbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHBCdXR0b24gW2xhYmVsXT1cImFkZFJ1bGVCdXR0b25MYWJlbFwiIGljb249XCJwaSBwaS1wbHVzXCIgY2xhc3M9XCJwLWNvbHVtbi1maWx0ZXItYWRkLWJ1dHRvbiBwLWJ1dHRvbi10ZXh0IHAtYnV0dG9uLXNtXCIgKGNsaWNrKT1cImFkZENvbnN0cmFpbnQoKVwiIHBSaXBwbGU+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1jb2x1bW4tZmlsdGVyLWJ1dHRvbmJhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNob3dDbGVhckJ1dHRvblwiIHR5cGU9XCJidXR0b25cIiBwQnV0dG9uIGNsYXNzPVwicC1idXR0b24tb3V0bGluZWQgcC1idXR0b24tc21cIiAoY2xpY2spPVwiY2xlYXJGaWx0ZXIoKVwiIFtsYWJlbF09XCJjbGVhckJ1dHRvbkxhYmVsXCIgcFJpcHBsZT48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzaG93QXBwbHlCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiAoY2xpY2spPVwiYXBwbHlGaWx0ZXIoKVwiIGNsYXNzPVwicC1idXR0b24tc21cIiBbbGFiZWxdPVwiYXBwbHlCdXR0b25MYWJlbFwiIHBSaXBwbGU+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZvb3RlclRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogZmllbGQgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW3RyaWdnZXIoJ292ZXJsYXlBbmltYXRpb24nLCBbdHJhbnNpdGlvbignOmVudGVyJywgW3N0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAnc2NhbGVZKDAuOCknIH0pLCBhbmltYXRlKCcuMTJzIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJyldKSwgdHJhbnNpdGlvbignOmxlYXZlJywgW2FuaW1hdGUoJy4xcyBsaW5lYXInLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXSldKV0sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQ29sdW1uRmlsdGVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgQElucHV0KCkgZmllbGQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuICAgIEBJbnB1dCgpIGRpc3BsYXk6IHN0cmluZyA9ICdyb3cnO1xuXG4gICAgQElucHV0KCkgc2hvd01lbnU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgbWF0Y2hNb2RlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBvcGVyYXRvcjogc3RyaW5nID0gRmlsdGVyT3BlcmF0b3IuQU5EO1xuXG4gICAgQElucHV0KCkgc2hvd09wZXJhdG9yOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHNob3dDbGVhckJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzaG93QXBwbHlCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2hvd01hdGNoTW9kZXM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2hvd0FkZEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBoaWRlT25DbGVhcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG1hdGNoTW9kZU9wdGlvbnM6IFNlbGVjdEl0ZW1bXTtcblxuICAgIEBJbnB1dCgpIG1heENvbnN0cmFpbnRzOiBudW1iZXIgPSAyO1xuXG4gICAgQElucHV0KCkgbWluRnJhY3Rpb25EaWdpdHM6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIG1heEZyYWN0aW9uRGlnaXRzOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBwcmVmaXg6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHN1ZmZpeDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBsb2NhbGVNYXRjaGVyOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBjdXJyZW5jeTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgY3VycmVuY3lEaXNwbGF5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB1c2VHcm91cGluZzogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzaG93QnV0dG9uczogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBAVmlld0NoaWxkKCdpY29uJykgaWNvbjogRWxlbWVudFJlZjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIG92ZXJsYXlTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZmlsdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIG9wZXJhdG9yT3B0aW9uczogYW55W107XG5cbiAgICBvdmVybGF5VmlzaWJsZTogYm9vbGVhbjtcblxuICAgIG92ZXJsYXk6IEhUTUxFbGVtZW50O1xuXG4gICAgc2Nyb2xsSGFuZGxlcjogQ29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIgfCBudWxsO1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZG9jdW1lbnRSZXNpemVMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIG1hdGNoTW9kZXM6IFNlbGVjdEl0ZW1bXTtcblxuICAgIHRyYW5zbGF0aW9uU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICByZXNldFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgc2VsZkNsaWNrOiBib29sZWFuO1xuXG4gICAgb3ZlcmxheUV2ZW50TGlzdGVuZXI7XG5cbiAgICBwcml2YXRlIHdpbmRvdzogV2luZG93O1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIGR0OiBUYWJsZSwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHB1YmxpYyBjb25maWc6IFByaW1lTkdDb25maWcsIHB1YmxpYyBvdmVybGF5U2VydmljZTogT3ZlcmxheVNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy53aW5kb3cgPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3IGFzIFdpbmRvdztcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmR0LmZpbHRlcnNbdGhpcy5maWVsZF0pIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEZpZWxkRmlsdGVyQ29uc3RyYWludCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2xhdGlvblN1YnNjcmlwdGlvbiA9IHRoaXMuY29uZmlnLnRyYW5zbGF0aW9uT2JzZXJ2ZXIuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVNYXRjaE1vZGVPcHRpb25zKCk7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlT3BlcmF0b3JPcHRpb25zKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVzZXRTdWJzY3JpcHRpb24gPSB0aGlzLmR0LnRhYmxlU2VydmljZS5yZXNldFNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEZpZWxkRmlsdGVyQ29uc3RyYWludCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdlbmVyYXRlTWF0Y2hNb2RlT3B0aW9ucygpO1xuICAgICAgICB0aGlzLmdlbmVyYXRlT3BlcmF0b3JPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVNYXRjaE1vZGVPcHRpb25zKCkge1xuICAgICAgICB0aGlzLm1hdGNoTW9kZXMgPVxuICAgICAgICAgICAgdGhpcy5tYXRjaE1vZGVPcHRpb25zIHx8XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5maWx0ZXJNYXRjaE1vZGVPcHRpb25zW3RoaXMudHlwZV0/Lm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbGFiZWw6IHRoaXMuY29uZmlnLmdldFRyYW5zbGF0aW9uKGtleSksIHZhbHVlOiBrZXkgfTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdlbmVyYXRlT3BlcmF0b3JPcHRpb25zKCkge1xuICAgICAgICB0aGlzLm9wZXJhdG9yT3B0aW9ucyA9IFtcbiAgICAgICAgICAgIHsgbGFiZWw6IHRoaXMuY29uZmlnLmdldFRyYW5zbGF0aW9uKFRyYW5zbGF0aW9uS2V5cy5NQVRDSF9BTEwpLCB2YWx1ZTogRmlsdGVyT3BlcmF0b3IuQU5EIH0sXG4gICAgICAgICAgICB7IGxhYmVsOiB0aGlzLmNvbmZpZy5nZXRUcmFuc2xhdGlvbihUcmFuc2xhdGlvbktleXMuTUFUQ0hfQU5ZKSwgdmFsdWU6IEZpbHRlck9wZXJhdG9yLk9SIH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmaWx0ZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmb290ZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvb3RlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRGaWVsZEZpbHRlckNvbnN0cmFpbnQoKSB7XG4gICAgICAgIGxldCBkZWZhdWx0TWF0Y2hNb2RlID0gdGhpcy5nZXREZWZhdWx0TWF0Y2hNb2RlKCk7XG4gICAgICAgIHRoaXMuZHQuZmlsdGVyc1t0aGlzLmZpZWxkXSA9IHRoaXMuZGlzcGxheSA9PSAncm93JyA/IHsgdmFsdWU6IG51bGwsIG1hdGNoTW9kZTogZGVmYXVsdE1hdGNoTW9kZSB9IDogW3sgdmFsdWU6IG51bGwsIG1hdGNoTW9kZTogZGVmYXVsdE1hdGNoTW9kZSwgb3BlcmF0b3I6IHRoaXMub3BlcmF0b3IgfV07XG4gICAgfVxuXG4gICAgb25NZW51TWF0Y2hNb2RlQ2hhbmdlKHZhbHVlOiBhbnksIGZpbHRlck1ldGE6IEZpbHRlck1ldGFkYXRhKSB7XG4gICAgICAgIGZpbHRlck1ldGEubWF0Y2hNb2RlID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKCF0aGlzLnNob3dBcHBseUJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5kdC5fZmlsdGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblJvd01hdGNoTW9kZUNoYW5nZShtYXRjaE1vZGU6IHN0cmluZykge1xuICAgICAgICAoPEZpbHRlck1ldGFkYXRhPnRoaXMuZHQuZmlsdGVyc1t0aGlzLmZpZWxkXSkubWF0Y2hNb2RlID0gbWF0Y2hNb2RlO1xuICAgICAgICB0aGlzLmR0Ll9maWx0ZXIoKTtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuXG4gICAgb25Sb3dNYXRjaE1vZGVLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGxldCBpdGVtID0gPEhUTUxMSUVsZW1lbnQ+ZXZlbnQudGFyZ2V0O1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgIHZhciBuZXh0SXRlbSA9IHRoaXMuZmluZE5leHRJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0udGFiSW5kZXggPSAnMCc7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgdmFyIHByZXZJdGVtID0gdGhpcy5maW5kUHJldkl0ZW0oaXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgICAgICAgICAgICAgICBwcmV2SXRlbS50YWJJbmRleCA9ICcwJztcbiAgICAgICAgICAgICAgICAgICAgcHJldkl0ZW0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Sb3dDbGVhckl0ZW1DbGljaygpIHtcbiAgICAgICAgdGhpcy5jbGVhckZpbHRlcigpO1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG5cbiAgICBpc1Jvd01hdGNoTW9kZVNlbGVjdGVkKG1hdGNoTW9kZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAoPEZpbHRlck1ldGFkYXRhPnRoaXMuZHQuZmlsdGVyc1t0aGlzLmZpZWxkXSkubWF0Y2hNb2RlID09PSBtYXRjaE1vZGU7XG4gICAgfVxuXG4gICAgYWRkQ29uc3RyYWludCgpIHtcbiAgICAgICAgKDxGaWx0ZXJNZXRhZGF0YVtdPnRoaXMuZHQuZmlsdGVyc1t0aGlzLmZpZWxkXSkucHVzaCh7IHZhbHVlOiBudWxsLCBtYXRjaE1vZGU6IHRoaXMuZ2V0RGVmYXVsdE1hdGNoTW9kZSgpLCBvcGVyYXRvcjogdGhpcy5nZXREZWZhdWx0T3BlcmF0b3IoKSB9KTtcbiAgICB9XG5cbiAgICByZW1vdmVDb25zdHJhaW50KGZpbHRlck1ldGE6IEZpbHRlck1ldGFkYXRhKSB7XG4gICAgICAgIHRoaXMuZHQuZmlsdGVyc1t0aGlzLmZpZWxkXSA9ICg8RmlsdGVyTWV0YWRhdGFbXT50aGlzLmR0LmZpbHRlcnNbdGhpcy5maWVsZF0pLmZpbHRlcigobWV0YSkgPT4gbWV0YSAhPT0gZmlsdGVyTWV0YSk7XG4gICAgICAgIHRoaXMuZHQuX2ZpbHRlcigpO1xuICAgIH1cblxuICAgIG9uT3BlcmF0b3JDaGFuZ2UodmFsdWUpIHtcbiAgICAgICAgKDxGaWx0ZXJNZXRhZGF0YVtdPnRoaXMuZHQuZmlsdGVyc1t0aGlzLmZpZWxkXSkuZm9yRWFjaCgoZmlsdGVyTWV0YSkgPT4ge1xuICAgICAgICAgICAgZmlsdGVyTWV0YS5vcGVyYXRvciA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5vcGVyYXRvciA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMuc2hvd0FwcGx5QnV0dG9uKSB7XG4gICAgICAgICAgICB0aGlzLmR0Ll9maWx0ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZU1lbnUoKSB7XG4gICAgICAgIHRoaXMub3ZlcmxheVZpc2libGUgPSAhdGhpcy5vdmVybGF5VmlzaWJsZTtcbiAgICB9XG5cbiAgICBvblRvZ2dsZUJ1dHRvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ0VzY2FwZSc6XG4gICAgICAgICAgICBjYXNlICdUYWInOlxuICAgICAgICAgICAgICAgIHRoaXMub3ZlcmxheVZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vdmVybGF5VmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZm9jdXNhYmxlID0gRG9tSGFuZGxlci5nZXRGb2N1c2FibGVFbGVtZW50cyh0aGlzLm92ZXJsYXkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9jdXNhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYWx0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3ZlcmxheVZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRXNjYXBlKCkge1xuICAgICAgICB0aGlzLm92ZXJsYXlWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaWNvbi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgZmluZE5leHRJdGVtKGl0ZW06IEhUTUxMSUVsZW1lbnQpIHtcbiAgICAgICAgbGV0IG5leHRJdGVtID0gPEhUTUxMSUVsZW1lbnQ+aXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKG5leHRJdGVtKSByZXR1cm4gRG9tSGFuZGxlci5oYXNDbGFzcyhuZXh0SXRlbSwgJ3AtY29sdW1uLWZpbHRlci1zZXBhcmF0b3InKSA/IHRoaXMuZmluZE5leHRJdGVtKG5leHRJdGVtKSA6IG5leHRJdGVtO1xuICAgICAgICBlbHNlIHJldHVybiBpdGVtLnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuXG4gICAgZmluZFByZXZJdGVtKGl0ZW06IEhUTUxMSUVsZW1lbnQpIHtcbiAgICAgICAgbGV0IHByZXZJdGVtID0gPEhUTUxMSUVsZW1lbnQ+aXRlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChwcmV2SXRlbSkgcmV0dXJuIERvbUhhbmRsZXIuaGFzQ2xhc3MocHJldkl0ZW0sICdwLWNvbHVtbi1maWx0ZXItc2VwYXJhdG9yJykgPyB0aGlzLmZpbmRQcmV2SXRlbShwcmV2SXRlbSkgOiBwcmV2SXRlbTtcbiAgICAgICAgZWxzZSByZXR1cm4gaXRlbS5wYXJlbnRFbGVtZW50Lmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuXG4gICAgb25Db250ZW50Q2xpY2soKSB7XG4gICAgICAgIHRoaXMuc2VsZkNsaWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXkgPSBldmVudC5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5kb2N1bWVudC5ib2R5LCB0aGlzLm92ZXJsYXkpO1xuICAgICAgICAgICAgICAgIFpJbmRleFV0aWxzLnNldCgnb3ZlcmxheScsIHRoaXMub3ZlcmxheSwgdGhpcy5jb25maWcuekluZGV4Lm92ZXJsYXkpO1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWJzb2x1dGVQb3NpdGlvbih0aGlzLm92ZXJsYXksIHRoaXMuaWNvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMub3ZlcmxheUV2ZW50TGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vdmVybGF5ICYmIHRoaXMub3ZlcmxheS5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZkNsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlTdWJzY3JpcHRpb24gPSB0aGlzLm92ZXJsYXlTZXJ2aWNlLmNsaWNrT2JzZXJ2YWJsZS5zdWJzY3JpYmUodGhpcy5vdmVybGF5RXZlbnRMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIHRoaXMub25PdmVybGF5SGlkZSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3ZlcmxheVN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25FbmQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQudG9TdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAndm9pZCc6XG4gICAgICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIoZXZlbnQuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREZWZhdWx0TWF0Y2hNb2RlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoTW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hNb2RlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ3RleHQnKSByZXR1cm4gRmlsdGVyTWF0Y2hNb2RlLlNUQVJUU19XSVRIO1xuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnbnVtZXJpYycpIHJldHVybiBGaWx0ZXJNYXRjaE1vZGUuRVFVQUxTO1xuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZGF0ZScpIHJldHVybiBGaWx0ZXJNYXRjaE1vZGUuREFURV9JUztcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIEZpbHRlck1hdGNoTW9kZS5DT05UQUlOUztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldERlZmF1bHRPcGVyYXRvcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5kdC5maWx0ZXJzID8gKDxGaWx0ZXJNZXRhZGF0YVtdPnRoaXMuZHQuZmlsdGVyc1t0aGlzLmZpZWxkXSlbMF0ub3BlcmF0b3IgOiB0aGlzLm9wZXJhdG9yO1xuICAgIH1cblxuICAgIGhhc1Jvd0ZpbHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZHQuZmlsdGVyc1t0aGlzLmZpZWxkXSAmJiAhdGhpcy5kdC5pc0ZpbHRlckJsYW5rKCg8RmlsdGVyTWV0YWRhdGE+dGhpcy5kdC5maWx0ZXJzW3RoaXMuZmllbGRdKS52YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IGZpZWxkQ29uc3RyYWludHMoKTogRmlsdGVyTWV0YWRhdGFbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmR0LmZpbHRlcnMgPyA8RmlsdGVyTWV0YWRhdGFbXT50aGlzLmR0LmZpbHRlcnNbdGhpcy5maWVsZF0gOiBudWxsO1xuICAgIH1cblxuICAgIGdldCBzaG93UmVtb3ZlSWNvbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRDb25zdHJhaW50cyA/IHRoaXMuZmllbGRDb25zdHJhaW50cy5sZW5ndGggPiAxIDogZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0IHNob3dNZW51QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zaG93TWVudSAmJiAodGhpcy5kaXNwbGF5ID09PSAncm93JyA/IHRoaXMudHlwZSAhPT0gJ2Jvb2xlYW4nIDogdHJ1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IGlzU2hvd09wZXJhdG9yKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zaG93T3BlcmF0b3IgJiYgdGhpcy50eXBlICE9PSAnYm9vbGVhbic7XG4gICAgfVxuXG4gICAgZ2V0IGlzU2hvd0FkZENvbnN0cmFpbnQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNob3dBZGRCdXR0b24gJiYgdGhpcy50eXBlICE9PSAnYm9vbGVhbicgJiYgdGhpcy5maWVsZENvbnN0cmFpbnRzICYmIHRoaXMuZmllbGRDb25zdHJhaW50cy5sZW5ndGggPCB0aGlzLm1heENvbnN0cmFpbnRzO1xuICAgIH1cblxuICAgIGdldCBhcHBseUJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5nZXRUcmFuc2xhdGlvbihUcmFuc2xhdGlvbktleXMuQVBQTFkpO1xuICAgIH1cblxuICAgIGdldCBjbGVhckJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5nZXRUcmFuc2xhdGlvbihUcmFuc2xhdGlvbktleXMuQ0xFQVIpO1xuICAgIH1cblxuICAgIGdldCBhZGRSdWxlQnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmdldFRyYW5zbGF0aW9uKFRyYW5zbGF0aW9uS2V5cy5BRERfUlVMRSk7XG4gICAgfVxuXG4gICAgZ2V0IHJlbW92ZVJ1bGVCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZ2V0VHJhbnNsYXRpb24oVHJhbnNsYXRpb25LZXlzLlJFTU9WRV9SVUxFKTtcbiAgICB9XG5cbiAgICBnZXQgbm9GaWx0ZXJMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZ2V0VHJhbnNsYXRpb24oVHJhbnNsYXRpb25LZXlzLk5PX0ZJTFRFUik7XG4gICAgfVxuXG4gICAgaGFzRmlsdGVyKCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZmllbGRGaWx0ZXIgPSB0aGlzLmR0LmZpbHRlcnNbdGhpcy5maWVsZF07XG4gICAgICAgIGlmIChmaWVsZEZpbHRlcikge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmllbGRGaWx0ZXIpKSByZXR1cm4gIXRoaXMuZHQuaXNGaWx0ZXJCbGFuaygoPEZpbHRlck1ldGFkYXRhW10+ZmllbGRGaWx0ZXIpWzBdLnZhbHVlKTtcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuICF0aGlzLmR0LmlzRmlsdGVyQmxhbmsoZmllbGRGaWx0ZXIudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzT3V0c2lkZUNsaWNrZWQoZXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEoXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXkuaXNTYW1lTm9kZShldmVudC50YXJnZXQpIHx8XG4gICAgICAgICAgICB0aGlzLm92ZXJsYXkuY29udGFpbnMoZXZlbnQudGFyZ2V0KSB8fFxuICAgICAgICAgICAgdGhpcy5pY29uLm5hdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShldmVudC50YXJnZXQpIHx8XG4gICAgICAgICAgICB0aGlzLmljb24ubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpIHx8XG4gICAgICAgICAgICBEb21IYW5kbGVyLmhhc0NsYXNzKGV2ZW50LnRhcmdldCwgJ3AtY29sdW1uLWZpbHRlci1hZGQtYnV0dG9uJykgfHxcbiAgICAgICAgICAgIERvbUhhbmRsZXIuaGFzQ2xhc3MoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQsICdwLWNvbHVtbi1maWx0ZXItYWRkLWJ1dHRvbicpIHx8XG4gICAgICAgICAgICBEb21IYW5kbGVyLmhhc0NsYXNzKGV2ZW50LnRhcmdldCwgJ3AtY29sdW1uLWZpbHRlci1yZW1vdmUtYnV0dG9uJykgfHxcbiAgICAgICAgICAgIERvbUhhbmRsZXIuaGFzQ2xhc3MoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQsICdwLWNvbHVtbi1maWx0ZXItcmVtb3ZlLWJ1dHRvbicpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgY29uc3QgZG9jdW1lbnRUYXJnZXQ6IGFueSA9IHRoaXMuZWwgPyB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudCA6ICdkb2N1bWVudCc7XG5cbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnRUYXJnZXQsICdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXlWaXNpYmxlICYmICF0aGlzLnNlbGZDbGljayAmJiB0aGlzLmlzT3V0c2lkZUNsaWNrZWQoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZkNsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zZWxmQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy53aW5kb3csICdyZXNpemUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vdmVybGF5VmlzaWJsZSAmJiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kU2Nyb2xsTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBuZXcgQ29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIodGhpcy5pY29uLm5hdGl2ZUVsZW1lbnQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vdmVybGF5VmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLm92ZXJsYXlWaXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb25PdmVybGF5SGlkZSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5vdmVybGF5ID0gbnVsbDtcbiAgICB9XG5cbiAgICBjbGVhckZpbHRlcigpIHtcbiAgICAgICAgdGhpcy5pbml0RmllbGRGaWx0ZXJDb25zdHJhaW50KCk7XG4gICAgICAgIHRoaXMuZHQuX2ZpbHRlcigpO1xuICAgICAgICBpZiAodGhpcy5oaWRlT25DbGVhcikgdGhpcy5oaWRlKCk7XG4gICAgfVxuXG4gICAgYXBwbHlGaWx0ZXIoKSB7XG4gICAgICAgIHRoaXMuZHQuX2ZpbHRlcigpO1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMub3ZlcmxheSk7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLm92ZXJsYXkpO1xuICAgICAgICAgICAgdGhpcy5vbk92ZXJsYXlIaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50cmFuc2xhdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVzZXRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm92ZXJsYXlTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtY29sdW1uRmlsdGVyRm9ybUVsZW1lbnQnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJmaWx0ZXJUZW1wbGF0ZTsgZWxzZSBidWlsdEluRWxlbWVudFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwiXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW1wbGljaXQ6IGZpbHRlckNvbnN0cmFpbnQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJDYWxsYmFjazogZmlsdGVyQ2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyQ29uc3RyYWludDogZmlsdGVyQ29uc3RyYWludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkZyYWN0aW9uRGlnaXRzOiBtaW5GcmFjdGlvbkRpZ2l0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEZyYWN0aW9uRGlnaXRzOiBtYXhGcmFjdGlvbkRpZ2l0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VmZml4OiBzdWZmaXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGU6IGxvY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZU1hdGNoZXI6IGxvY2FsZU1hdGNoZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeTogY3VycmVuY3ksXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeURpc3BsYXk6IGN1cnJlbmN5RGlzcGxheSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZUdyb3VwaW5nOiB1c2VHcm91cGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dCdXR0b25zOiBzaG93QnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgID48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbHRJbkVsZW1lbnQ+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1N3aXRjaF09XCJ0eXBlXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0ICpuZ1N3aXRjaENhc2U9XCIndGV4dCdcIiB0eXBlPVwidGV4dFwiIHBJbnB1dFRleHQgW3ZhbHVlXT1cImZpbHRlckNvbnN0cmFpbnQ/LnZhbHVlXCIgKGlucHV0KT1cIm9uTW9kZWxDaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSlcIiAoa2V5ZG93bi5lbnRlcik9XCJvblRleHRJbnB1dEVudGVyS2V5RG93bigkZXZlbnQpXCIgW2F0dHIucGxhY2Vob2xkZXJdPVwicGxhY2Vob2xkZXJcIiAvPlxuICAgICAgICAgICAgICAgIDxwLWlucHV0TnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICpuZ1N3aXRjaENhc2U9XCInbnVtZXJpYydcIlxuICAgICAgICAgICAgICAgICAgICBbbmdNb2RlbF09XCJmaWx0ZXJDb25zdHJhaW50Py52YWx1ZVwiXG4gICAgICAgICAgICAgICAgICAgIChuZ01vZGVsQ2hhbmdlKT1cIm9uTW9kZWxDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIChvbktleURvd24pPVwib25OdW1lcmljSW5wdXRLZXlEb3duKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICBbc2hvd0J1dHRvbnNdPVwic2hvd0J1dHRvbnNcIlxuICAgICAgICAgICAgICAgICAgICBbbWluRnJhY3Rpb25EaWdpdHNdPVwibWluRnJhY3Rpb25EaWdpdHNcIlxuICAgICAgICAgICAgICAgICAgICBbbWF4RnJhY3Rpb25EaWdpdHNdPVwibWF4RnJhY3Rpb25EaWdpdHNcIlxuICAgICAgICAgICAgICAgICAgICBbcHJlZml4XT1cInByZWZpeFwiXG4gICAgICAgICAgICAgICAgICAgIFtzdWZmaXhdPVwic3VmZml4XCJcbiAgICAgICAgICAgICAgICAgICAgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgW21vZGVdPVwiY3VycmVuY3kgPyAnY3VycmVuY3knIDogJ2RlY2ltYWwnXCJcbiAgICAgICAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxuICAgICAgICAgICAgICAgICAgICBbbG9jYWxlTWF0Y2hlcl09XCJsb2NhbGVNYXRjaGVyXCJcbiAgICAgICAgICAgICAgICAgICAgW2N1cnJlbmN5XT1cImN1cnJlbmN5XCJcbiAgICAgICAgICAgICAgICAgICAgW2N1cnJlbmN5RGlzcGxheV09XCJjdXJyZW5jeURpc3BsYXlcIlxuICAgICAgICAgICAgICAgICAgICBbdXNlR3JvdXBpbmddPVwidXNlR3JvdXBpbmdcIlxuICAgICAgICAgICAgICAgID48L3AtaW5wdXROdW1iZXI+XG4gICAgICAgICAgICAgICAgPHAtdHJpU3RhdGVDaGVja2JveCAqbmdTd2l0Y2hDYXNlPVwiJ2Jvb2xlYW4nXCIgW25nTW9kZWxdPVwiZmlsdGVyQ29uc3RyYWludD8udmFsdWVcIiAobmdNb2RlbENoYW5nZSk9XCJvbk1vZGVsQ2hhbmdlKCRldmVudClcIj48L3AtdHJpU3RhdGVDaGVja2JveD5cbiAgICAgICAgICAgICAgICA8cC1jYWxlbmRhciAqbmdTd2l0Y2hDYXNlPVwiJ2RhdGUnXCIgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCIgW25nTW9kZWxdPVwiZmlsdGVyQ29uc3RyYWludD8udmFsdWVcIiAobmdNb2RlbENoYW5nZSk9XCJvbk1vZGVsQ2hhbmdlKCRldmVudClcIj48L3AtY2FsZW5kYXI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICBgLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIENvbHVtbkZpbHRlckZvcm1FbGVtZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBASW5wdXQoKSBmaWVsZDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdHlwZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZmlsdGVyQ29uc3RyYWludDogRmlsdGVyTWV0YWRhdGE7XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBtaW5GcmFjdGlvbkRpZ2l0czogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbWF4RnJhY3Rpb25EaWdpdHM6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHByZWZpeDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc3VmZml4OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBsb2NhbGU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGxvY2FsZU1hdGNoZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGN1cnJlbmN5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBjdXJyZW5jeURpc3BsYXk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHVzZUdyb3VwaW5nOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGdldCBzaG93QnV0dG9ucygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sRmlsdGVyLnNob3dCdXR0b25zO1xuICAgIH1cblxuICAgIGZpbHRlckNhbGxiYWNrOiBGdW5jdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkdDogVGFibGUsIHByaXZhdGUgY29sRmlsdGVyOiBDb2x1bW5GaWx0ZXIpIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJDYWxsYmFjayA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJDb25zdHJhaW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmR0Ll9maWx0ZXIoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvbk1vZGVsQ2hhbmdlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJDb25zdHJhaW50LnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgdGhpcy5kdC5fZmlsdGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRleHRJbnB1dEVudGVyS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICB0aGlzLmR0Ll9maWx0ZXIoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbk51bWVyaWNJbnB1dEtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgdGhpcy5kdC5fZmlsdGVyKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFBhZ2luYXRvck1vZHVsZSwgSW5wdXRUZXh0TW9kdWxlLCBEcm9wZG93bk1vZHVsZSwgRm9ybXNNb2R1bGUsIEJ1dHRvbk1vZHVsZSwgU2VsZWN0QnV0dG9uTW9kdWxlLCBDYWxlbmRhck1vZHVsZSwgSW5wdXROdW1iZXJNb2R1bGUsIFRyaVN0YXRlQ2hlY2tib3hNb2R1bGUsIFNjcm9sbGVyTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIFRhYmxlLFxuICAgICAgICBTaGFyZWRNb2R1bGUsXG4gICAgICAgIFNvcnRhYmxlQ29sdW1uLFxuICAgICAgICBGcm96ZW5Db2x1bW4sXG4gICAgICAgIFJvd0dyb3VwSGVhZGVyLFxuICAgICAgICBTZWxlY3RhYmxlUm93LFxuICAgICAgICBSb3dUb2dnbGVyLFxuICAgICAgICBDb250ZXh0TWVudVJvdyxcbiAgICAgICAgUmVzaXphYmxlQ29sdW1uLFxuICAgICAgICBSZW9yZGVyYWJsZUNvbHVtbixcbiAgICAgICAgRWRpdGFibGVDb2x1bW4sXG4gICAgICAgIENlbGxFZGl0b3IsXG4gICAgICAgIFNvcnRJY29uLFxuICAgICAgICBUYWJsZVJhZGlvQnV0dG9uLFxuICAgICAgICBUYWJsZUNoZWNrYm94LFxuICAgICAgICBUYWJsZUhlYWRlckNoZWNrYm94LFxuICAgICAgICBSZW9yZGVyYWJsZVJvd0hhbmRsZSxcbiAgICAgICAgUmVvcmRlcmFibGVSb3csXG4gICAgICAgIFNlbGVjdGFibGVSb3dEYmxDbGljayxcbiAgICAgICAgRWRpdGFibGVSb3csXG4gICAgICAgIEluaXRFZGl0YWJsZVJvdyxcbiAgICAgICAgU2F2ZUVkaXRhYmxlUm93LFxuICAgICAgICBDYW5jZWxFZGl0YWJsZVJvdyxcbiAgICAgICAgQ29sdW1uRmlsdGVyLFxuICAgICAgICBDb2x1bW5GaWx0ZXJGb3JtRWxlbWVudCxcbiAgICAgICAgU2Nyb2xsZXJNb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBUYWJsZSxcbiAgICAgICAgU29ydGFibGVDb2x1bW4sXG4gICAgICAgIEZyb3plbkNvbHVtbixcbiAgICAgICAgUm93R3JvdXBIZWFkZXIsXG4gICAgICAgIFNlbGVjdGFibGVSb3csXG4gICAgICAgIFJvd1RvZ2dsZXIsXG4gICAgICAgIENvbnRleHRNZW51Um93LFxuICAgICAgICBSZXNpemFibGVDb2x1bW4sXG4gICAgICAgIFJlb3JkZXJhYmxlQ29sdW1uLFxuICAgICAgICBFZGl0YWJsZUNvbHVtbixcbiAgICAgICAgQ2VsbEVkaXRvcixcbiAgICAgICAgVGFibGVCb2R5LFxuICAgICAgICBTb3J0SWNvbixcbiAgICAgICAgVGFibGVSYWRpb0J1dHRvbixcbiAgICAgICAgVGFibGVDaGVja2JveCxcbiAgICAgICAgVGFibGVIZWFkZXJDaGVja2JveCxcbiAgICAgICAgUmVvcmRlcmFibGVSb3dIYW5kbGUsXG4gICAgICAgIFJlb3JkZXJhYmxlUm93LFxuICAgICAgICBTZWxlY3RhYmxlUm93RGJsQ2xpY2ssXG4gICAgICAgIEVkaXRhYmxlUm93LFxuICAgICAgICBJbml0RWRpdGFibGVSb3csXG4gICAgICAgIFNhdmVFZGl0YWJsZVJvdyxcbiAgICAgICAgQ2FuY2VsRWRpdGFibGVSb3csXG4gICAgICAgIENvbHVtbkZpbHRlcixcbiAgICAgICAgQ29sdW1uRmlsdGVyRm9ybUVsZW1lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIFRhYmxlTW9kdWxlIHt9XG4iXX0=