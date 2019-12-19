import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  confirm(message?: string): Observable<boolean> {
    if(message == ""){
      message = "Unsaved changes will be lost, Do you wish to continue ?";
    }
    const confirmation = window.confirm(message || 'Is it OK?');

    return of(confirmation);
  };
}
