import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { retry, throwError } from 'rxjs';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.scss'],
})
export class ServerStatusComponent {
  isAlive = false;

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
  ) {
    this.reportService
      .checkUpServer()
      .pipe(retry({ count: 10, delay: 5000 }))
      .subscribe({
        next: () => {
          this.isAlive = true;
        },
        error: (error: any) => {
          this._snackBar.open('Server is not response', 'Error');
          return throwError(() => error);
        },
      });
  }
}
