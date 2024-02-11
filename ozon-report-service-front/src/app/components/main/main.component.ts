import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { ReportService } from 'src/app/services/report.service';
import * as XLSX from 'xlsx';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

interface ReportForm {
  fbo: [File | null];
  fbs: [File | null];
  realizationReport: [File | null];
  date: Date;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent {
  status: 'pending' | 'ok' = 'ok';

  reportForm = this.formBuilder.group({
    fbo: [<null | File>null, [Validators.required]],
    fbs: [<null | File>null, [Validators.required]],
    realizationReport: [<null | File>null, [Validators.required]],
    reportDate: [moment().subtract(1, 'month'), [Validators.required]],
  });

  constructor(
    private reportService: ReportService,
    private formBuilder: FormBuilder,
  ) {}

  get registerFormControl() {
    return this.reportForm.controls;
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;

    const file: File = (target.files as FileList)[0];

    if (file) {
      const name = target.name as keyof Partial<ReportForm>;
      this.reportForm.patchValue({
        [name]: file,
      });
    }
  }

  send() {
    if (
      this.reportForm.valid &&
      this.registerFormControl.fbo.value &&
      this.registerFormControl.fbs.value &&
      this.registerFormControl.realizationReport.value &&
      this.registerFormControl.reportDate
    ) {
      this.status = 'pending';
      this.reportService
        .getReport({
          fbo: this.registerFormControl.fbo.value,
          fbs: this.registerFormControl.fbs.value,
          realizationReport: this.registerFormControl.realizationReport.value,
          reportDate: moment(this.registerFormControl.reportDate.value).format(
            'MM/YYYY',
          ),
        })
        .subscribe({
          next: (file: any) => {
            this.status = 'ok';
            const wbout = XLSX.write(file, {
              bookType: 'xlsx',
              type: 'buffer',
            });
            const blob = new Blob([wbout], {
              type: 'application/vnd.ms-excel',
            });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `report-${moment(
              this.registerFormControl.reportDate.value,
            ).format('DD.MM.YYYY__hh.mm')}.xlsx`;
            a.click();
            a.remove();
          },
          error: (error: any) => {
            this.status = 'ok';
            return throwError(() => error);
          },
        });
    }
  }
}
