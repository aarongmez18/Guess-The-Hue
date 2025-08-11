import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar/snackbar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.html',
  styleUrls: ['./snackbar.css']
})
export class SnackbarComponent implements OnInit {
  message = '';
  isError = false;
  visible = false;
  timeoutId: any;

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.snackbarService.message$.subscribe(({ message, error }) => {
      this.message = message;
      this.isError = error;
      this.visible = true;
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => (this.visible = false), 3000);
    });
  }
}
