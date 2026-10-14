import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, finalize, map, of, tap } from 'rxjs';
import { GenericService } from '../../_service/generic/generic.service';

interface OtherDocument {
  id: number;
  title: string;
  category: string;
}

interface InformationItem {
  id: number;
  information_section: string;
  information_title: string;
}

interface InformationResponse {
  status: number;
  message: string;
  data: InformationItem[];
}

function mapInformationToDocument(item: InformationItem): OtherDocument {
  return {
    id: item.id,
    title: item.information_title,
    category: item.information_section,
  };
}

@Component({
  selector: 'app-others',
  imports: [DecimalPipe],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss',
})
export class OthersComponent implements OnInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private genericService = inject(GenericService);

  documents: OtherDocument[] = [];
  isLoading = false;
  errorMessage = '';

  // Blob URLs already fetched, keyed by document id, so each PDF is downloaded once
  private pdfUrls = new Map<number, string>();
  loadingPdfId: number | null = null;

  previewDoc: OtherDocument | null = null;
  previewUrl: SafeResourceUrl | null = null;

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    this.pdfUrls.forEach((url) => URL.revokeObjectURL(url));
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.genericService
      .postPublicApi({ type: 'other' }, 'api/informations')
      .subscribe({
        next: (res: InformationResponse) => {
          this.documents =
            res?.status === 1 && Array.isArray(res.data)
              ? res.data.map(mapInformationToDocument)
              : [];
          this.isLoading = false;
        },
        error: () => {
          this.documents = [];
          this.errorMessage = 'Unable to load documents. Please try again later.';
          this.isLoading = false;
        },
      });
  }

  private getPdfUrl(doc: OtherDocument): Observable<string> {
    const cached = this.pdfUrls.get(doc.id);
    if (cached) return of(cached);

    return this.genericService.getInformationPdf(doc.id).pipe(
      map((blob) =>
        URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      ),
      tap((url) => this.pdfUrls.set(doc.id, url))
    );
  }

  private withLoading(doc: OtherDocument, source: Observable<string>): Observable<string> {
    this.loadingPdfId = doc.id;
    return source.pipe(finalize(() => (this.loadingPdfId = null)));
  }

  openPdf(doc: OtherDocument): void {
    // Open the tab synchronously on click so the browser doesn't block it as a popup
    const newTab = window.open('', '_blank');

    this.withLoading(doc, this.getPdfUrl(doc)).subscribe({
      next: (url) => {
        if (newTab) {
          newTab.location.href = url;
        } else {
          window.open(url, '_blank');
        }
      },
      error: () => {
        newTab?.close();
        alert('Unable to open the PDF. Please try again later.');
      },
    });
  }

  openPreview(doc: OtherDocument): void {
    this.withLoading(doc, this.getPdfUrl(doc)).subscribe({
      next: (url) => {
        this.previewDoc = doc;
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error: () => alert('Unable to load the PDF preview. Please try again later.'),
    });
  }

  closePreview(): void {
    this.previewDoc = null;
    this.previewUrl = null;
  }
}
