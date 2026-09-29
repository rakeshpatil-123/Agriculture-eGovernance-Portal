import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';

export interface SelectOption {
  id: any;
  name: string;
}

@Component({
  selector: 'app-ilogi-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FloatLabelModule,
    SelectModule,
    MultiSelectModule
  ],
  templateUrl: './ilogi-select.component.html',
  styleUrls: ['./ilogi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IlogiSelectComponent),
      multi: true,
    },
  ],
})
export class IlogiSelectComponent
  implements OnInit, AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy {
  
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;
  
  // Unique panel class for this instance
  panelClass = 'ilogi-select-panel ilogi-' + Math.random().toString(36).slice(2, 9);
  
  @Input() submitted = false;
  @Input() fieldLabel: string = '';
  @Input() hideLabel = false;
  @Input() fieldId: string = '';
  @Input() fieldExactVal: any = null;
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() placeholder = '';
  @Input() mandatory = false;
  @Input() readonly = false;
  @Input() isReadOnly = false;
  @Input() selectOptions: SelectOption[] = [{ id: '', name: 'Select' }];
  filteredOptions: SelectOption[] = [];
  @Input() enableSearch: boolean = false;
  @Input() disabled: boolean = false;
  searchTerm: string = '';
  @Input() errors: { [key: string]: any } | null = null;
  @Input() multiple: boolean = false;
  
  @Input('multi') set multiAttr(val: any) {
    if (val === '' || val === true || val === 'true') {
      this.multiple = true;
    } else if (val === false || val === 'false') {
      this.multiple = false;
    }
  }
  
  @Output() change = new EventEmitter<{ value: any }>();
  @Output() blur = new EventEmitter<void>();

  errorFieldId = '';
  isHovered = false;
  value: any = null;
  isDisabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  
  // For repositioning on scroll/resize
  private readonly reposition = () => requestAnimationFrame(() => this.pinOverlay());

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.fieldId) {
      this.errorFieldId = `invalid-input-${this.fieldId}`;
    }
    this.filteredOptions = this.selectOptions ? [...this.selectOptions] : [];
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.onDropdownHide();
  }

  get hasErrors(): boolean {
    return !!this.errors && Object.keys(this.errors).length > 0;
  }

  onSearch(term: string): void {
    if (!this.enableSearch) return;
    this.searchTerm = term;
    this.applyFilter(term);
  }

  private applyFilter(term: string): void {
    const opts = this.selectOptions ?? [];
    if (!term) {
      this.filteredOptions = [...opts];
    } else {
      const t = term.toLowerCase();
      this.filteredOptions = opts.filter(o => o.name.toLowerCase().includes(t));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectOptions']) {
      this.applyFilter(this.searchTerm);
    }
  }

  onDropdownShow(): void {
    this.filteredOptions = this.selectOptions ? [...this.selectOptions] : [];
    this.searchTerm = '';
    
    setTimeout(() => {
      if (this.enableSearch) {
        this.searchInputRef?.nativeElement.focus();
      }
      this.pinOverlay();
      window.addEventListener('scroll', this.reposition, true);
      window.addEventListener('resize', this.reposition);
    }, 30);
  }

  onDropdownHide(): void {
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);
  }

private pinOverlay(): void {
  const overlay = document.querySelector<HTMLElement>(
    '.' + this.panelClass.split(' ')[1]
  );
  const trigger = this.elementRef.nativeElement.querySelector('.p-select, .p-multiselect');
  
  if (!overlay || !trigger) return;

  const rect = trigger.getBoundingClientRect();
  const panelH = overlay.offsetHeight || 280;
  const spaceBelow = window.innerHeight - rect.bottom;
  const openUp = spaceBelow < panelH && rect.top > spaceBelow;

  // Calculate max available width from trigger position to right edge
  const maxAvailableWidth = window.innerWidth - rect.left - 16;

  overlay.style.position = 'fixed';
  overlay.style.zIndex = '2147483647';
  overlay.style.top = (openUp ? Math.max(8, rect.top - panelH - 4) : rect.bottom + 4) + 'px';
  overlay.style.left = rect.left + 'px';
  
  // DON'T set width - let it fit content
  overlay.style.minWidth = rect.width + 'px';  // At least as wide as trigger
  overlay.style.maxWidth = maxAvailableWidth + 'px';  // But not wider than viewport
  overlay.style.width = 'auto';  // Auto-size to content
  overlay.style.marginTop = '0';
  overlay.style.boxSizing = 'border-box';
}

  writeValue(value: any): void {
    if (value === undefined) {
      this.value = this.multiple ? [] : null;
      this.cdr.detectChanges();
      return;
    }
    this.value = value;
    if (this.multiple) {
      if (!Array.isArray(this.value)) {
        this.value = this.value ? [this.value] : [];
      }
    } else {
      if (Array.isArray(this.value)) {
        this.value = this.value.length ? this.value[0] : null;
      }
    }
    setTimeout(() => this.cdr.detectChanges());
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.detectChanges();
  }

  showErrorOnFieldHover(): void {
    this.isHovered = true;
  }

  hideErrorOnFieldHoverOut(): void {
    this.isHovered = false;
  }

  onChangeControl(value: any): void {
    if (!this.readonly && !this.isDisabled) {
      this.value = value;
      this.onChange(this.value);
      this.onTouched();
      this.change.emit({ value });
      this.cdr.detectChanges();
    }
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  getDisplayName(value: any): string {
    if (value === null || value === undefined) return '';
    if (this.multiple && Array.isArray(value)) {
      const names = value
        .map((val: any) => {
          const opt = this.selectOptions.find((o) => o.id === val);
          return opt ? opt.name : '';
        })
        .filter((n) => !!n);
      return names.join(', ');
    }
    const option = this.selectOptions.find((opt) => opt.id === value);
    return option ? option.name : '';
  }
}