import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface GetReport {
  fbs: File;
  fbo: File;
  realizationReport: File;
  reportDate: string;
  countries: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  url = 'https://ozon-report-service.onrender.com';

  localUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getReport({ fbo, fbs, realizationReport, reportDate, countries }: GetReport) {
    const formData = new FormData();
    formData.append('fbs', fbs);
    formData.append('fbo', fbo);
    formData.append('report', realizationReport);
    formData.append('reportDate', reportDate);
    formData.append('countries', countries);
    return this.http.post(`${this.url}/report`, formData);
  }

  checkUpServer() {
    return this.http.get(this.url, { responseType: 'text' });
  }
}
