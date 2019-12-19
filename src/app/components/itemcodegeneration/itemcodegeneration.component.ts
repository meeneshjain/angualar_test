import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ItemcodegenerationService } from '../../services/itemcodegeneration.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { UIHelper } from '../../helpers/ui.helpers';
import  { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-itemcodegeneration',
  templateUrl: './itemcodegeneration.component.html',
  styleUrls: ['./itemcodegeneration.component.scss']
})
export class ItemcodegenerationComponent implements OnInit {
  @ViewChild("inputBox") _el: ElementRef;
  @ViewChild("button") _button: ElementRef;
  
  public commonData = new CommonData();
  public view_route_link = '/item-code-generation/view';
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  constructor(
    private router: ActivatedRoute, 
    private route: Router, 
    private itemgen: ItemcodegenerationService, 
    private toastr: ToastrService,
    private commanService: CommonService, 
    private DialogService: DialogService
    ) { }

  companyName: string;
  page_main_title = this.language.ItemCodeGeneration
  public itemCodeGen: any = [];
  public itemcodetable: any = [];
  public stringtypevalue: any = [];
  public opertions: any = [];
  public stringType: any = [];
  public counter: number = 0;
  public finalstring: string = "";
  public countnumberrow: number = 0;
  public codekey: string = "";
  public GetItemData: any = [];
  public DefaultTypeValue: any = [];
  public button = "save"
  public isDuplicateMode: boolean = false;
  public isUpdateButtonVisible: boolean = false;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = true;
  public isCodeDisabled: boolean = true;
  public username: string = "";
  public showLoader: boolean = true;
  //button show/hide variables
  public showAddRowbtn:boolean = true;
  public showRemoveBtn:boolean = true;
  public isReadOnly:boolean
  public isUpdationAllowed:boolean
  public isAdditionAllowed:boolean
  public isDeletionAllowed:boolean
  public isFullPermitted:boolean
  public PermissionStr:any = [];
  public isOperationDisable:boolean=true;

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;

  isMobile:boolean=false;
  isIpad:boolean=false;
  isDesktop:boolean=true;
  isPerfectSCrollBar:boolean = false;
  public menu_auth_index = '200';
  public made_changes:boolean = false;

  canDeactivate() {
    if(this.made_changes == true){
      return this.DialogService.confirm('');
    } else {
      return true;
    }
  }

  detectDevice(){
    let getDevice = UIHelper.isDevice();
    this.isMobile = getDevice[0];
    this.isIpad = getDevice[1];
    this.isDesktop = getDevice[2];
    if(this.isMobile==true){
      this.isPerfectSCrollBar = true;
    }else if(this.isIpad==true){
      this.isPerfectSCrollBar = false;
    }else{
      this.isPerfectSCrollBar = false;
    }
  }

  ngOnInit() {

    const element = document.getElementsByTagName('body')[0];
    // // element.className = '';
    this.detectDevice();
    // element.classList.add('sidebar-toggled');
    // document.getElementById("opti_sidebar").classList.add('toggled');

    this.commonData.checkSession();
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');
    
    //get permissions
    // this.getUserPermissionDetials();
    
    // this.stringtypevalue = this.commonData.stringtypevalue;
    // this.opertions = this.commonData.opertions

    this.stringtypevalue = this.commonData.item_code_gen_string_dropdown();
    this.opertions = this.commonData.item_code_gen_oper_drpdown();

    // check screen authorisation - start
    this.commanService.getMenuRecord().subscribe(
      menu_item => {
        let menu_auth_index = this.menu_auth_index
        let is_authorised = menu_item.filter(function (obj) {
          return (obj.OPTM_MENUID == menu_auth_index) ? obj : "";
        });

        if (is_authorised.length == 0) {
          let objcc = this;
          setTimeout(function () {
            objcc.toastr.error('', objcc.language.notAuthorisedScreen, objcc.commonData.toast_config);
            objcc.route.navigateByUrl('home');
          }, 200);
        }
      });
    // check screen authorisation - end

    this.codekey = "";
    this.codekey = this.router.snapshot.paramMap.get('id');
    if (this.codekey === "" || this.codekey === null) {
      this.button = "save"
      this.made_changes = true;

      this.isCodeDisabled=true;
      this.isUpdateButtonVisible=false;
      this.isSaveButtonVisible=true;
      this.isDuplicateMode = false;
      this.isDeleteButtonVisible=false;
      // this.counter=1;
      this.onAddRow(1);
      //Check Permission
      this.showLoader  = false;
      this.checkPermission("save");
    }
    else {
      /* this.button = "update" */
      this.made_changes = false;
      /* this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true; */
      if(this.router.snapshot.url[1].path == "edit") {
        this.isCodeDisabled = false;
        this.button = "update"
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDuplicateMode = false;
        this.isDeleteButtonVisible = true;
      } else if(this.router.snapshot.url[1].path == "add"){
        this.isCodeDisabled = true;
        this.button = "save"
        this.isUpdateButtonVisible = false;
        this.isSaveButtonVisible = true;
        this.isDuplicateMode = true;
        this.isDeleteButtonVisible = false;
      } else {
        this.isCodeDisabled = false;
        this.button = "update"
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDuplicateMode = false;
        this.isDeleteButtonVisible = true;
      }
      this.GetItemData = []
      this.GetItemData.push({
        CompanyDBId: this.companyName,
        ItemCode: this.codekey

      })
      this.itemgen.getItemCodeGenerationByCode(this.GetItemData).subscribe(
        data => {
          this.finalstring = "";

          for (let i = 0; i < data.length; ++i) {
            if(data[i].OPTM_TYPE==1){
              this.isOperationDisable=true
            }

            if(data[0].Reference==false && data[i].OPTM_TYPE==2){
              this.isOperationDisable=false
            }

            this.itemcodetable.push({
              rowindex: data[i].OPTM_LINEID,
              string: data[i].OPTM_CODESTRING,
              stringtype: data[i].OPTM_TYPE,
              operations: data[i].OPTM_OPERATION,
              delete: "",
              CompanyDBId: this.companyName,
              codekey: this.codekey,
              CreatedUser: this.username,
              isOperationDisable:this.isOperationDisable

            })
            this.finalstring = this.finalstring + data[i].OPTM_CODESTRING
          }
          this.showLoader  = false;
        },error => {
          this.showLoader = false;
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commanService.isUnauthorized();
          }
          return;
        }
        )

      //Check Permission

      this.checkPermission("edit");
      if(this.isDuplicateMode) {
        this.codekey = "";
      }
    }

    //Check Permission
    this.checkPermission("general");
  }
  ngAfterViewInit() {
    if(this.codekey === "" || this.codekey === null){
      this._el.nativeElement.focus();
    }
    else{
      this._button.nativeElement.focus();
    }
  }
  onAddRow(oninit) {
    if( oninit == 0 ){
      if (this.validateRowData("AddRow") == false) {
        return
      }
    }
    if (this.itemcodetable.length == 0) {
      this.counter = 0;
    }
    else {
      this.counter = this.itemcodetable.length
    }

    this.counter++;
    this.itemcodetable.push({
      rowindex: this.counter,
      string: "",
      stringtype: 1,
      operations: 1,
      delete: "",
      CompanyDBId: this.companyName,
      codekey: this.codekey,
      CreatedUser: this.username,
      isOperationDisable:true
    });
    this.made_changes = true;

  }

  onDeleteRow(rowindex) {
    this.made_changes = true;
    if (this.itemcodetable.length > 0) {
      for (let i = 0; i < this.itemcodetable.length; ++i) {
        if (this.itemcodetable[i].rowindex === rowindex) {
          this.itemcodetable.splice(i, 1);
          i = i - 1;

        }
        else {
          this.itemcodetable[i].rowindex = i + 1;
        }

      }
      this.finalstring = "";
      for (let i = 0; i < this.itemcodetable.length; ++i) {
        this.finalstring = this.finalstring + this.itemcodetable[i].string
      }
    }
  }

  onSaveClick() {
    if (this.validateRowData("SaveData") == false) {
      return;
    }
    console.log(this.itemcodetable);   
    this.itemgen.saveData(this.itemcodetable).subscribe(
      data => {

        if (data == "7001") {
          this.made_changes = false;
          this.commanService.RemoveLoggedInUser().subscribe();
          this.commanService.signOut(this.toastr, this.route, 'Sessionout');
          return;
        } 

        if (data === "True") {
          this.made_changes = false;
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('item-code-generation/view');
          return;
        } else if (data == "AlreadyExists"){
          this.toastr.error('', this.language.item_code_cannot_update, this.commonData.toast_config);
          return;
        }
        else {
          this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
          return;
        }
      },error => {
        this.showLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commanService.isUnauthorized();
        }
        return;
      }
      )

  }

  onStringTypeSelectChange(selectedvalue, rowindex) {
    this.made_changes = true;
    for (let i = 0; i < this.itemcodetable.length; ++i) {
      if (this.itemcodetable[i].rowindex === rowindex) {
        this.itemcodetable[i].stringtype = selectedvalue;
        if(selectedvalue==1){
          this.itemcodetable[i].isOperationDisable=true;
          this.itemcodetable[i].operations=1;
        }
        else{
          this.itemcodetable[i].isOperationDisable=false
        }
      }

    }

  }

  onStringOperationsSelectChange(selectedvalue, rowindex) {
    this.made_changes = true;
    for (let i = 0; i < this.itemcodetable.length; ++i) {
      if (this.itemcodetable[i].rowindex === rowindex) {
        this.itemcodetable[i].operations = selectedvalue;
      }
    }

  }

  onDeleteClick() {
    this.made_changes = true;
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
    // var result = confirm(this.language.DeleteConfimation);
    // if (result) {
      //   this.validateRowData("Delete")
      // }
    }

    //This will take confimation box value
    get_dialog_value(userSelectionValue) {
      if (userSelectionValue == true) {
        this.validateRowData("Delete")
      }
      this.show_dialog = false;
    }
    onCodeStrBlur(code) {
      if(code !== "" && this.commonData.excludeSpecialCharRegex.test(code) === true) {
        this.toastr.error('', this.language.ValidString, this.commonData.toast_config);
      }
    }
    onStrBlur(selectedvalue, rowindex, string_number) {
      this.made_changes = true;
      if (string_number == 2){ // validate string on blur
        var rgexp = /^\d+$/;
        if (rgexp.test(selectedvalue) == false) {
          this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
        }
      } else  {
        if (this.commonData.excludeSpecialCharRegex.test(selectedvalue.trim()) === true) {
          this.toastr.error('', this.language.ValidString, this.commonData.toast_config);
        }
      }
      if (this.itemcodetable.length > 0) {
        this.finalstring = "";
        for (let i = 0; i < this.itemcodetable.length; ++i) {
          if (this.itemcodetable[i].rowindex === rowindex) {
            this.itemcodetable[i].string = selectedvalue.trim();
            this.itemcodetable[i].codekey = this.codekey.trim(); //bug:18908
          }
          this.finalstring = this.finalstring + this.itemcodetable[i].string
        }
      }

    }

    validateRowData(buttonpressevent) {
      if (buttonpressevent == "AddRow") {
        if (this.itemcodetable.length > 0) {

          for (let i = 0; i < this.itemcodetable.length; ++i) {
            if (this.itemcodetable[i].stringtype == 2 || this.itemcodetable[i].stringtype == 3) {
              if (isNaN(this.itemcodetable[i].string) == true) {
                this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
                return false;
              }
              if (this.itemcodetable[i].operations == 1) {
                this.toastr.error('', this.language.ValidOperations, this.commonData.toast_config);
                return false;
              }

            }
            else {
              if (this.itemcodetable[i].operations != 1) {
                this.toastr.error('', this.language.ValidOperations, this.commonData.toast_config);
                return false;
              }
            }
            if(this.itemcodetable[i].codekey =="" || this.itemcodetable[i].codekey ==null){
              this.itemcodetable[i].codekey=this.codekey
            }

          }
        }
      }
      else {
        if (buttonpressevent != "Delete") {
          if (this.itemcodetable.length == 0) {
            this.toastr.error('', this.language.Addrow, this.commonData.toast_config);
            return false;
          }
          else {
            this.countnumberrow = 0;
            for (let i = 0; i < this.itemcodetable.length; ++i) {
              if (this.codekey == " " || this.codekey == "" || this.codekey == null) {
                this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
                return false;
              } 
              else if(this.codekey.trim() == "" || this.codekey.trim() == null || this.codekey.trim() == " "){
                this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
                return false;
              }
              else if(this.commonData.excludeSpecialCharRegex.test(this.codekey) === true) {
                this.toastr.error('', this.language.ValidString, this.commonData.toast_config);
                return false;
              }
              if (this.itemcodetable[i].stringtype == 2 || this.itemcodetable[i].stringtype == 3) {
                if (isNaN(this.itemcodetable[i].string) == true) {
                  this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
                  return false;
                }
                if (this.itemcodetable[i].operations == 1) {
                  this.toastr.error('', this.language.ValidOperations, this.commonData.toast_config);
                  return false;
                }
                this.countnumberrow++;

              } else if(this.itemcodetable[i].stringtype == 1 && this.commonData.excludeSpecialCharRegex.test(this.itemcodetable[i].string) === true) {
                this.toastr.error('', this.language.ValidString, this.commonData.toast_config);
                return false;
              }
              else {
                if (this.itemcodetable[i].operations != 1) {
                  this.toastr.error('', this.language.ValidOperations, this.commonData.toast_config);
                  return false;
                }

              }
              if(this.itemcodetable[i].string.trim() == ""){
                this.toastr.error('', this.language.EnterString, this.commonData.toast_config);
                return false;
              }

            }
            if (this.countnumberrow == 0) {
              this.toastr.error('', this.language.RowNumberType, this.commonData.toast_config);
              return false;

            }
          }
        }
        else {
          this.GetItemData = []
          this.GetItemData.push({
            CompanyDBId: this.companyName,
            ItemCode: this.codekey,
            GUID: sessionStorage.getItem("GUID"),
            UsernameForLic: sessionStorage.getItem("loggedInUser")
          })

          this.itemgen.DeleteData(this.GetItemData).subscribe(
            data => {
              if(data != undefined && data.length > 0){
                if (data[0].ErrorMsg == "7001") {
                  this.made_changes = false;
                  this.commanService.RemoveLoggedInUser().subscribe();
                  this.commanService.signOut(this.toastr, this.route, 'Sessionout');
                  return;
                } 
              }

              if(data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists"){
                this.toastr.error('', this.language.Refrence + ' at: ' + data[0].ItemCode , this.commonData.toast_config);
              }
              else if(data[0].IsDeleted == "1"){
                this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                this.made_changes = false;
                this.route.navigateByUrl('item-code-generation/view');
              }
              else{
                this.toastr.error('', this.language.DataNotDelete + ' : ' , this.commonData.toast_config);
              }

            },error => {
              this.showLoader = false;
              if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
                this.commanService.isUnauthorized();
              }
              return;
            }
            )


        }

      }
      if (this.codekey == " " || this.codekey == "" || this.codekey == null) {
        this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
        return false;
      }
      else if(this.codekey.trim() == "" || this.codekey.trim() == null || this.codekey.trim() == " "){
        this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
        return false;
      }
      if (this.finalstring.length > 50) {
        this.toastr.error('', this.language.StringLengthValidation, this.commonData.toast_config);
        return false;
      }

    }
    CheckDuplicateCode(){
      this.itemgen.CheckDuplicateCode(this.companyName, this.codekey).subscribe(
        data => {

          if(data != undefined && data.length > 0){
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.commanService.RemoveLoggedInUser().subscribe();
              this.commanService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            } 
          }

          if(data[0].TOTALCOUNT > 0){
            this.toastr.error('', this.language.DuplicateCode, this.commonData.toast_config);
            this.codekey= "";
            return;
          }
          else{
            console.log(this.itemcodetable);
            for (let iCount = 0; iCount < this.itemcodetable.length; ++iCount) {
              this.itemcodetable[iCount]['codekey'] = this.codekey.replace(/ +/g, "");
            }
          } 
        },error => {
          this.showLoader = false;
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commanService.isUnauthorized();
          }
          return;
        }
        )
    }

    //get user permission
    /* getUserPermissionDetials(){

      this.commanService.getPermissionDetails().subscribe(
        data => {
          if(data !=null || data != undefined){


          }
          else{
            this.toastr.error('', this.language.permission_load_error, this.commonData.toast_config);
          }
        },
        error =>{
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        ) 
    } */

    checkPermission(mode){
      setTimeout(function(){

        if(this.PermissionStr != undefined){

          this.PermissionStr.forEach(function (indexValue) {
            if (this.PermissionStr[indexValue] == "A") {
              this.isAdditionAllowed = true;
            }
            else if (this.PermissionStr[indexValue] == "U") {
              this.isUpdationAllowed = true;
            }
            else if (this.PermissionStr[indexValue] == "D") {
              this.isDeletionAllowed = true;
            }
            else if (this.PermissionStr[indexValue] == "R") {
              this.isReadOnly = true;
            }
          }); 

          if(mode == "add"){
            if (this.isAdditionAllowed === true && this.isUpdationAllowed == true && this.isDeletionAllowed === true) {
              this.isSaveButtonVisible = true;
            }
            else if (this.isAdditionAllowed === true && this.isUpdationAllowed == true) {
              this.isSaveButtonVisible = true;
            }
            // else if (this.isUpdationAllowed === true && this.isDeletionAllowed === true) {

              // }
              // else if (this.isUpdationAllowed === true) {

                // }
              }
              if(mode == "edit"){
                if (this.isAdditionAllowed === true && this.isUpdationAllowed == true && this.isDeletionAllowed === true) {
                  this.isUpdateButtonVisible = true;
                }
                else if (this.isAdditionAllowed === true && this.isUpdationAllowed == true) {
                  this.isUpdateButtonVisible = true;
                }
                else if (this.isUpdationAllowed === true && this.isDeletionAllowed === true) {
                  this.isUpdateButtonVisible = true;
                }
                else if (this.isUpdationAllowed === true) {
                  this.isUpdateButtonVisible = true;
                }

              }
              // if(mode == "delete"){
                //    this.showRemoveBtn = true;
                // }
                if(mode == "general"){
                  if (this.isAdditionAllowed === true && this.isUpdationAllowed == true && this.isDeletionAllowed === true) {
                    this.showAddRowbtn = false;
                    this.showRemoveBtn = true;
                  }
                  else if (this.isAdditionAllowed === true && this.isUpdationAllowed == true) {
                    this.showAddRowbtn = false;
                  }
                  else if (this.isUpdationAllowed === true && this.isDeletionAllowed === true) {
                    this.showRemoveBtn = true;
                  }
                  else if (this.isUpdationAllowed === true) {

                  }
                }
              }

            }, 3000);
    }

  }
