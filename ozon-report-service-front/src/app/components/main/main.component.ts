import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  [key: string]: any;

  report: File | null = null;

  fbo: File | null = null;

  fbs: File | null = null;

  disabled = true;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;

    const file: File = (target.files as FileList)[0];

    if (file) {
      this[target.name] = file;
      this.checkFiles();
    }
  }

  checkFiles() {
    if (this.fbo && this.fbs && this.report) {
      this.disabled = false;
    }
  }

  send() {
    if (this.fbo && this.fbs && this.report) {
      const formData = new FormData();
      formData.append('fbs', this.fbs, this.fbs.name);
      formData.append('fb0', this.fbo, this.fbo.name);
      formData.append('report', this.report, this.report.name);

      const upload$ = this.http.post('https://httpbin.org/post', formData);

      //  this.status = 'uploading';

      upload$.subscribe({
        next: () => {},
        error: (error: any) => {
          return throwError(() => error);
        },
      });
    }
  }
}
