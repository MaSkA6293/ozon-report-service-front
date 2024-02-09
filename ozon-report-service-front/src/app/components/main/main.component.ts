import { Component } from '@angular/core';
import { throwError } from 'rxjs';
import { ReportService } from 'src/app/services/report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  [key: string]: any;

  realizationReport: File | null = null;

  fbo: File | null = null;

  fbs: File | null = null;

  report: any;

  reportDate: string | null = null;

  disabled = true;

  status: 'pending' | 'ok' = 'ok';

  constructor(private reportService: ReportService) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;

    const file: File = (target.files as FileList)[0];

    if (file) {
      this[target.name] = file;
      this.checkFiles();
    }
  }

  checkFiles() {
    if (this.fbo && this.fbs && this.realizationReport && this.reportDate) {
      this.disabled = false;
    }
  }

  send() {
    if (this.fbo && this.fbs && this.realizationReport && this.reportDate) {
      this.status = 'pending';
      this.disabled = true;
      this.reportService
        .getReport(this.fbs, this.fbo, this.realizationReport, this.reportDate)
        .pipe()
        .subscribe({
          next: (file: any) => {
            this.status = 'ok';
            this.disabled = false;
            const wbout = XLSX.write(file, {
              bookType: 'xlsx',
              type: 'buffer',
            });
            const blob = new Blob([wbout], {
              type: 'application/vnd.ms-excel',
            });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `report-${this.reportDate}.xlsx`;
            a.click();
            a.remove();
          },
          error: (error: any) => {
            this.status = 'ok';
            this.disabled = false;
            return throwError(() => error);
          },
        });
    }
  }

  onSelectedDate(date: string) {
    this.reportDate = date;
    this.checkFiles();
  }
}
