import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class SnackBarService {
    // Duration
    durationInSeconds: number = 10;

    constructor(private _snackBar: MatSnackBar) { }

    openSnackBar(message: any) {
        this._snackBar.open(message, 'Close', {
            duration: this.durationInSeconds * 1000,
        });
    }
}
