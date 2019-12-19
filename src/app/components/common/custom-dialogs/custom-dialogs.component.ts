import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

import * as $ from 'jquery';


@Component({
  selector: 'app-custom-dialogs',
  templateUrl: './custom-dialogs.component.html',
  styleUrls: ['./custom-dialogs.component.scss']
})
export class CustomDialogsComponent implements OnInit {
  @Input() dialogParams:any;
  @Output() userSelectionValue = new EventEmitter();
  public message:any;

  language = JSON.parse(sessionStorage.getItem('current_lang'));
  constructor() { }

  ngOnInit() {
  //console.log(this.dialogParams);

    if(this.dialogParams.length > 0){
      this.message = this.dialogParams[0].message;
      this.open_confirmation_dialog(); 
    }
  }

  //Events
  onOKPress(){
    this.userSelectionValue.emit(true);
    this.close_confirmation_dialog();
  }

  onCancelPress(){
    this.userSelectionValue.emit(false);
    this.close_confirmation_dialog();
  }


  //Core Function 
  //To open the dialog
  open_confirmation_dialog(){
        $('#custom_dialog_box').modal("show");
  }

  //To close the dialog
  close_confirmation_dialog(){
      $('#custom_dialog_box').modal("hide");
      this.userSelectionValue.emit("true")
  }
}
