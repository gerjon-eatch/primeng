import { OnDestroy, EventEmitter, TemplateRef, AfterViewInit, AfterContentInit, QueryList, ElementRef, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { BlockableUI } from 'primeng/api';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
import * as i3 from "primeng/button";
import * as i4 from "primeng/progressbar";
import * as i5 from "primeng/messages";
import * as i6 from "primeng/ripple";
export declare class FileUpload implements AfterViewInit, AfterContentInit, OnInit, OnDestroy, BlockableUI {
    private el;
    sanitizer: DomSanitizer;
    zone: NgZone;
    private http;
    cd: ChangeDetectorRef;
    config: PrimeNGConfig;
    name: string;
    url: string;
    method: string;
    multiple: boolean;
    accept: string;
    disabled: boolean;
    auto: boolean;
    withCredentials: boolean;
    maxFileSize: number;
    invalidFileSizeMessageSummary: string;
    invalidFileSizeMessageDetail: string;
    invalidFileTypeMessageSummary: string;
    invalidFileTypeMessageDetail: string;
    invalidFileLimitMessageDetail: string;
    invalidFileLimitMessageSummary: string;
    style: any;
    styleClass: string;
    previewWidth: number;
    chooseLabel: string;
    uploadLabel: string;
    cancelLabel: string;
    chooseIcon: string;
    uploadIcon: string;
    cancelIcon: string;
    showUploadButton: boolean;
    showCancelButton: boolean;
    mode: string;
    headers: HttpHeaders;
    customUpload: boolean;
    fileLimit: number;
    onBeforeUpload: EventEmitter<any>;
    onSend: EventEmitter<any>;
    onUpload: EventEmitter<any>;
    onError: EventEmitter<any>;
    onClear: EventEmitter<any>;
    onRemove: EventEmitter<any>;
    onSelect: EventEmitter<any>;
    onProgress: EventEmitter<any>;
    uploadHandler: EventEmitter<any>;
    templates: QueryList<any>;
    advancedFileInput: ElementRef;
    basicFileInput: ElementRef;
    content: ElementRef;
    set files(files: File[]);
    get files(): File[];
    _files: File[];
    progress: number;
    dragHighlight: boolean;
    msgs: Message[];
    fileTemplate: TemplateRef<any>;
    contentTemplate: TemplateRef<any>;
    toolbarTemplate: TemplateRef<any>;
    uploadedFileCount: number;
    focus: boolean;
    uploading: boolean;
    duplicateIEEvent: boolean;
    translationSubscription: Subscription;
    constructor(el: ElementRef, sanitizer: DomSanitizer, zone: NgZone, http: HttpClient, cd: ChangeDetectorRef, config: PrimeNGConfig);
    ngAfterContentInit(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    choose(): void;
    onFileSelect(event: any): void;
    isFileSelected(file: File): boolean;
    isIE11(): boolean;
    validate(file: File): boolean;
    private isFileTypeValid;
    getTypeClass(fileType: string): string;
    isWildcard(fileType: string): boolean;
    getFileExtension(file: File): string;
    isImage(file: File): boolean;
    onImageLoad(img: any): void;
    upload(): void;
    clear(): void;
    remove(event: Event, index: number): void;
    isFileLimitExceeded(): boolean;
    isChooseDisabled(): boolean;
    checkFileLimit(): void;
    clearInputElement(): void;
    clearIEInput(): void;
    hasFiles(): boolean;
    onDragEnter(e: any): void;
    onDragOver(e: any): void;
    onDragLeave(event: any): void;
    onDrop(event: any): void;
    onFocus(): void;
    onBlur(): void;
    formatSize(bytes: any): string;
    onBasicUploaderClick(): void;
    onBasicKeydown(event: KeyboardEvent): void;
    getBlockableElement(): HTMLElement;
    get chooseButtonLabel(): string;
    get uploadButtonLabel(): string;
    get cancelButtonLabel(): string;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileUpload, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileUpload, "p-fileUpload", never, { "name": "name"; "url": "url"; "method": "method"; "multiple": "multiple"; "accept": "accept"; "disabled": "disabled"; "auto": "auto"; "withCredentials": "withCredentials"; "maxFileSize": "maxFileSize"; "invalidFileSizeMessageSummary": "invalidFileSizeMessageSummary"; "invalidFileSizeMessageDetail": "invalidFileSizeMessageDetail"; "invalidFileTypeMessageSummary": "invalidFileTypeMessageSummary"; "invalidFileTypeMessageDetail": "invalidFileTypeMessageDetail"; "invalidFileLimitMessageDetail": "invalidFileLimitMessageDetail"; "invalidFileLimitMessageSummary": "invalidFileLimitMessageSummary"; "style": "style"; "styleClass": "styleClass"; "previewWidth": "previewWidth"; "chooseLabel": "chooseLabel"; "uploadLabel": "uploadLabel"; "cancelLabel": "cancelLabel"; "chooseIcon": "chooseIcon"; "uploadIcon": "uploadIcon"; "cancelIcon": "cancelIcon"; "showUploadButton": "showUploadButton"; "showCancelButton": "showCancelButton"; "mode": "mode"; "headers": "headers"; "customUpload": "customUpload"; "fileLimit": "fileLimit"; "files": "files"; }, { "onBeforeUpload": "onBeforeUpload"; "onSend": "onSend"; "onUpload": "onUpload"; "onError": "onError"; "onClear": "onClear"; "onRemove": "onRemove"; "onSelect": "onSelect"; "onProgress": "onProgress"; "uploadHandler": "uploadHandler"; }, ["templates"], never>;
}
export declare class FileUploadModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<FileUploadModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<FileUploadModule, [typeof FileUpload], [typeof i1.CommonModule, typeof i2.SharedModule, typeof i3.ButtonModule, typeof i4.ProgressBarModule, typeof i5.MessagesModule, typeof i6.RippleModule], [typeof FileUpload, typeof i2.SharedModule, typeof i3.ButtonModule, typeof i4.ProgressBarModule, typeof i5.MessagesModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<FileUploadModule>;
}
