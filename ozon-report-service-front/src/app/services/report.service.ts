import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  url = 'https://ozon-report-service.onrender.com/report';

  localUrl = 'http://localhost:4000/report';

  constructor(private http: HttpClient) {}

  getReport(fbs: File, fbo: File, realizationReport: File, reportDate: string) {
    const formData = new FormData();
    formData.append('fbs', fbs);
    formData.append('fbo', fbo);
    formData.append('report', realizationReport);
    formData.append('reportDate', reportDate);

    return this.http.post(this.url, formData);
  }
}
