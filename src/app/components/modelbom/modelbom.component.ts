import { Component, OnInit, ElementRef, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ModelbomService } from '../../services/modelbom.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';
import  { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-modelbom',
  templateUrl: './modelbom.component.html',
  styleUrls: ['./modelbom.component.scss']
})
export class ModelbomComponent implements OnInit {
  @ViewChild("Modelinputbox") _el: ElementRef;
  @ViewChild("button") _ele: ElementRef;
  public commonData = new CommonData();
  public view_route_link = '/modelbom/view';
  public input_file: File = null;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public modelbom_data: any = [];
  public image_data: any = [];
  public lookupfor: string = '';
  public counter = 0;
  public currentrowindex: number;
  public isExplodeButtonVisible: boolean = true;
  public isVerifyButtonVisible: boolean = true;
  public isUpdateButtonVisible: boolean = true;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;
  public showImageBlock: boolean = false;
  public showheaderImageBlock: boolean = false;
  public selectedImage = "";
  public isPriceDisabled = true;
  public pricehide = true;
  public isUOMDisabled = true;
  public NewModel = "";
  public update_id: string = "";
  public typevaluefromdatabase: string = "";
  public typevaluecodefromdatabase: string = "";
  public isModelIdEnable: boolean = true;
  public ModelLookupBtnhide: boolean = true;
  public rule_data: any = [];
  ruleselected: any;
  public header_image_data: string = "";
  public live_tree_view_data = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  public allItemDataDetails: any = [];
  public isMinSelectedDisable = false;
  public isMaxSelectedDisable = false;
  public isAccessory:boolean = false;
  public showLoader: boolean = true;
  public showLookupLoader: boolean = false;
  public row_selection: number[] = [];
  public current_selected_row: any = [];
  public selectableSettings: any = [];
  public model_bom_type:any = '';
  public isDuplicateMode:boolean = false;
  // public mandatory_disabled: boolean = false;
  public menu_auth_index = '203'; 
  public made_changes:boolean = false;
  modalRef: BsModalRef;

  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: ModelbomService, private toastr: ToastrService, private commonService: CommonService, private modalService: BsModalService, private DialogService: DialogService) { }

  companyName: string;
  page_main_title = this.language.Model_Bom
  public username: string = "";
  serviceData: any;

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;

  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;

  getSelectedRowDetail(event) {
    if (event.selectedRows.length > 0) {
      this.current_selected_row = event.selectedRows[0].dataItem;
    } else {
      this.current_selected_row = [];
    }
  }

  canDeactivate() {
    if(this.made_changes == true){
      return this.DialogService.confirm('');
    } else {
      return true;
    }
  }

  navigateToFeatureOrModelBom(type_value, type ) {
    if(type == '1'){
      this.route.navigateByUrl("feature/bom/edit/"+type_value);
    } else if(type == '3'){
      this.route.navigateByUrl("modelbom/edit/"+type_value);
      this.modelbom_data= [];
      this.tree_data_json = [];
      this.get_modelbom_details(type_value, true);
    }
  }

  navigateToMasterHeader(modal_id) {
    this.route.navigateByUrl("feature/model/edit/"+modal_id);
  }

  detectDevice() {
    let getDevice = UIHelper.isDevice();
    this.isMobile = getDevice[0];
    this.isIpad = getDevice[1];
    this.isDesktop = getDevice[2];
    if (this.isMobile == true) {
      this.isPerfectSCrollBar = true;
    } else if (this.isIpad == true) {
      this.isPerfectSCrollBar = false;
    } else {
      this.isPerfectSCrollBar = false;
    }
  }
  public pop;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    $('body').click()
  }

  ngOnInit() {

    const element = document.getElementsByTagName('body')[0];
    // // element.className = '';
    this.detectDevice();
    // element.classList.add('add_model-bom');
    // element.classList.add('sidebar-toggled');
    // document.getElementById("opti_sidebar").classList.add('toggled');

    this.commonData.checkSession();
    this.username = sessionStorage.getItem('loggedInUser');
    this.companyName = sessionStorage.getItem('selectedComp');
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
    
    if (this.image_data.length > 0) {
      this.showImageBlock = true;
    }

    this.model_bom_type = this.commonData.model_bom_type()

    // check screen authorisation - start
    this.commonService.getMenuRecord().subscribe(
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
      },
      error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        }
        return;
      });
    // check screen authorisation - end
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
    if (this.update_id === "" || this.update_id === null) {
      this.made_changes = true;
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this.isModelIdEnable = false;
      this.ModelLookupBtnhide = false;
      this._el.nativeElement.focus();
      this.showLoader = false;
    }
    else {
      this.made_changes = false;
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;
      this.isModelIdEnable = true;
      this.ModelLookupBtnhide = true;
      if(this.ActivatedRouter.snapshot.url[1].path == "edit") {
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDeleteButtonVisible = true; 
        this.isDuplicateMode = false;
      } else if(this.ActivatedRouter.snapshot.url[1].path == "add"){ 
        this.isUpdateButtonVisible = false;
        this.isSaveButtonVisible = true;
        this.isDeleteButtonVisible = false; 
        this.isDuplicateMode = true; 
        this.isModelIdEnable = false;
        this.ModelLookupBtnhide = false;
      } else {
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDeleteButtonVisible = false; 
        this.isDuplicateMode = false;
      }
      this.get_modelbom_details(this.update_id, false);
    }
  }

  get_modelbom_details(id, navigat_to_header) {
    this.showLoader = true;
    if(this.isDuplicateMode)
    {
      this.NewModel = this.update_id;
    }
    this.service.GetDataByModelId(id).subscribe(
      data => {
        if(data != undefined && data.LICDATA != undefined){
          if (data.LICDATA[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          } 
        }

        if (data.ModelHeader.length > 0) {
          this.modelbom_data.modal_id = data.ModelDetail[0].OPTM_MODELID
          this.modelbom_data.modal_code = data.ModelHeader[0].OPTM_FEATURECODE
          this.modelbom_data.feature_name = data.ModelHeader[0].OPTM_DISPLAYNAME;
          this.modelbom_data.feature_desc = data.ModelHeader[0].OPTM_FEATUREDESC;
          this.modelbom_data.image_path = data.ModelHeader[0].OPTM_PHOTO;
          this.modelbom_data.is_ready_to_use = data.ModelHeader[0].OPTM_READYTOUSE
          if (this.modelbom_data.image_path != null || this.modelbom_data.image_path != "") {
            this.showImageBlock = true;
            this.header_image_data = this.commonData.get_current_url() + this.modelbom_data.image_path
          }


          if (this.modelbom_data.is_ready_to_use == "Y") {
            this.modelbom_data.is_ready_to_use = true;
          } else {
            this.modelbom_data.is_ready_to_use = false;
          }


        } else {
          if(navigat_to_header == true){
            this.route.navigateByUrl('feature/model/edit/' + id);
          } else {
            this.route.navigateByUrl('modelbom/view');
          }
          
        }

        if (data.ModelDetail.length > 0) {
          for (let i = 0; i < data.ModelDetail.length; ++i) {
            let mandatory_item_disabled = false;
            if (data.ModelDetail[i].OPTM_TYPE == 1) {
              this.typevaluefromdatabase = data.ModelDetail[i].OPTM_FEATUREID.toString()
              this.typevaluecodefromdatabase = data.ModelDetail[i].feature_code.toString()
              this.isPriceDisabled = true
              this.pricehide = true
              this.isUOMDisabled = true
              this.isMinSelectedDisable = false;
              this.isMaxSelectedDisable = false;
              mandatory_item_disabled = false;
              // this.mandatory_disabled = false;
            } else if (data.ModelDetail[i].OPTM_TYPE == 2) {
              this.typevaluefromdatabase = data.ModelDetail[i].OPTM_ITEMKEY.toString()
              this.typevaluecodefromdatabase = data.ModelDetail[i].OPTM_ITEMKEY
              this.isPriceDisabled = false
              this.pricehide = false
              this.isUOMDisabled = false
              this.isMinSelectedDisable = true;
              this.isMaxSelectedDisable = true;
              mandatory_item_disabled = true;
              // this.mandatory_disabled = true;
            } else {
              this.typevaluefromdatabase = data.ModelDetail[i].OPTM_CHILDMODELID.toString()
              this.typevaluecodefromdatabase = data.ModelDetail[i].child_code.toString()
              this.isPriceDisabled = true
              this.pricehide = true
              this.isUOMDisabled = true
              this.isMinSelectedDisable = false;
              this.isMaxSelectedDisable = false;
              mandatory_item_disabled = false;
              // this.mandatory_disabled = false;
            }
            // if (data.ModelDetail[i].OPTM_READYTOUSE == "" || data.ModelDetail[i].OPTM_READYTOUSE == null || data.ModelDetail[i].OPTM_READYTOUSE == undefined || data.ModelDetail[i].OPTM_READYTOUSE == "N") {
              //   data.ModelDetail[i].OPTM_READYTOUSE = false
              // }
              if (data.ModelDetail[i].OPTM_PROPOGATEQTY == "Y") {
                data.ModelDetail[i].OPTM_PROPOGATEQTY = true
              } else {
                data.ModelDetail[i].OPTM_PROPOGATEQTY = false
              }
              if (data.ModelDetail[i].OPTM_UNIQUEIDNT == "Y") {
                data.ModelDetail[i].OPTM_UNIQUEIDNT = true
              } else {
                data.ModelDetail[i].OPTM_UNIQUEIDNT = false
              }
              if (data.ModelDetail[i].OPTM_MANDATORY == "Y") {
                data.ModelDetail[i].OPTM_MANDATORY = true
              } else {
                data.ModelDetail[i].OPTM_MANDATORY = false
              }
              this.counter = 0;
              if (this.modelbom_data.length > 0) {
                this.counter = this.modelbom_data.length
              }
              data.ModelDetail[i].OPTM_QUANTITY = (data.ModelDetail[i].OPTM_QUANTITY);

              let print_on_report =  false;
              let print_on_report_disabled = true;
              if(data.ModelDetail[i].OPTM_TYPE == 2){
                if(data.ModelDetail[i].OPTM_PRINT_OPTN == 'Y' || data.ModelDetail[i].OPTM_PRINT_OPTN == 'y'){
                  print_on_report  = true;
                } else {
                  print_on_report  = false;
                }

                print_on_report_disabled = false;
              } else {
                print_on_report = false;
                print_on_report_disabled = true;
              }

              this.counter++;
              this.modelbom_data.push({
                rowindex: this.counter,
                ModelId: data.ModelDetail[i].OPTM_MODELID,
                description: this.modelbom_data.feature_name,
                ReadyToUse: this.modelbom_data.is_ready_to_use,
                type: data.ModelDetail[i].OPTM_TYPE,
                type_value: this.typevaluefromdatabase,
                type_value_code: this.typevaluecodefromdatabase,
                display_name: data.ModelDetail[i].OPTM_DISPLAYNAME,
                uom: data.ModelDetail[i].OPTM_UOM,
                quantity: data.ModelDetail[i].OPTM_QUANTITY,
                min_selected: data.ModelDetail[i].OPTM_MINSELECTABLE,
                max_selected: data.ModelDetail[i].OPTM_MAXSELECTABLE,
                feature_min_selected: data.ModelDetail[i].FEATURE_MINSELECTABLE,
                feature_max_selected: data.ModelDetail[i].FEATURE_MAXSELECTABLE,
                propagate_qty: data.ModelDetail[i].OPTM_PROPOGATEQTY,
                price_source: data.ModelDetail[i].ListName,
                price_source_id: data.ModelDetail[i].OPTM_PRICESOURCE,
                mandatory: data.ModelDetail[i].OPTM_MANDATORY,
                mandatory_item_disabled : mandatory_item_disabled,
                unique_identifer: data.ModelDetail[i].OPTM_UNIQUEIDNT,
                isDisplayNameDisabled: false,
                isTypeDisabled: false,
                hide: false,
                CompanyDBId: this.companyName,
                CreatedUser: data.ModelDetail[i].OPTM_CREATEDBY,
                isPriceDisabled: this.isPriceDisabled,
                pricehide: this.pricehide,
                isUOMDisabled: this.isUOMDisabled,
                isMinSelectedDisable: this.isMinSelectedDisable,
                isMaxSelectedDisable: this.isMaxSelectedDisable,
                isAccessory: false,
                is_feature_multiselect: data.ModelDetail[i].OPTM_ISMULTISELECT,
                feature_default_count: data.ModelDetail[i].OPTM_DEFAULTCOUNT,
                print_on_report : print_on_report,
                print_on_report_disabled : print_on_report_disabled
              });

            }
          }
          for( var i=0 ; i < data.ModelDetail.length ; i++) {
            if(data.ModelDetail[i].Accessory == "Y") {
              this.modelbom_data[i].isAccessory = true;
              this.modelbom_data[i].unique_identifer = false;
            } else {
              this.modelbom_data.isAccessory = false;
            }
          }

          if (data.RuleData.length > 0) {
            this.rule_data = data.RuleData;
          }
          this.onExplodeClick('auto');
          this.showLoader = false;
          if(this.isDuplicateMode)
          { 
            this.modelbom_data.modal_code = "";
            this.modelbom_data.feature_name = "";
            this.modelbom_data.feature_desc = ""; 
            this.modelbom_data.is_ready_to_use=false; 
          }
        },error => {
          this.showLoader = false;
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commonService.isUnauthorized();
          }
          return;
        }
        )
};

ngAfterViewInit() {
  if (this.update_id === "" || this.update_id === null) {
    this._el.nativeElement.focus();
  }
  else {
    this._ele.nativeElement.focus();
  }
}

onAddRow() {
  if (this.validation("Add") == false) {
    return;
  }
  this.counter = 0;
  if (this.modelbom_data.length > 0) {
    this.counter = this.modelbom_data.length
  }
  this.counter++;

  let print_on_report_flag = false;
  let print_on_report_disabled_flag = true;

  this.modelbom_data.push({
    rowindex: this.counter,
    ModelId: this.modelbom_data.modal_id,
    ModelCode: this.modelbom_data.modal_code,
    description: this.modelbom_data.feature_desc,
    ReadyToUse: "N",
    type: 1,
    type_value: "",
    type_value_code: "",
    display_name: "",
    uom: '',
    quantity: ("1"),
    min_selected: 1,
    max_selected: 1, 
    feature_min_selected: 1,
    feature_max_selected: 1,
    propagate_qty: true,
    price_source: '',
    price_source_id: '',
    mandatory: false,
    mandatory_item_disabled : false,
    unique_identifer: false,
    isDisplayNameDisabled: false,
    isTypeDisabled: false,
    hide: false,
    CompanyDBId: this.companyName,
    CreatedUser: this.username,
    isPriceDisabled: true,
    pricehide: true,
    isUOMDisabled: true,
    isMinSelectedDisable: false,
    isMaxSelectedDisable: false,
    is_feature_multiselect: 'N',
    feature_default_count: 0,
    print_on_report : print_on_report_flag,
    print_on_report_disabled : print_on_report_disabled_flag
  });
  this.NewModel =  this.modelbom_data.modal_id;
  this.made_changes = true;
};

onDeleteRow(rowindex) {
  this.made_changes = true;
  if (this.modelbom_data.length > 0) {
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === rowindex) {
        let display_name = this.modelbom_data[i].display_name;
        if (this.tree_data_json.length > 0) {
          let remove_tree_data = this.tree_data_json.filter(function (obj) {
            return (obj['component'] == display_name);
          });
          if (remove_tree_data.length > 0) {
            for (let j = 0; j < this.tree_data_json.length; ++j) {
              if (remove_tree_data[0]['live_row_id'] == this.tree_data_json[j]['live_row_id']) {
                this.tree_data_json.splice(j, 1);
              }
            }
          }
        }
        this.modelbom_data.splice(i, 1);
        i = i - 1;
      }
      else {
        this.modelbom_data[i].rowindex = i + 1;
      }
    }
  }
  // remove data from exploded view tree
  //this.live_tree_view_data
  this.current_selected_row = [];
  this.row_selection = [];
}

clearData(rowindex) {
  //this.modelbom_data[rowindex].type_value="";
  this.modelbom_data[rowindex].uom = "";
  this.modelbom_data[rowindex].display_name = "";
  this.modelbom_data[rowindex].quantity = ("0");
  this.modelbom_data[rowindex].min_selected = 1;
  this.modelbom_data[rowindex].max_selected = 1;
  this.modelbom_data[rowindex].feature_min_selected = 1;
  this.modelbom_data[rowindex].feature_max_selected = 1;
  this.modelbom_data[rowindex].propagate_qty = 'N';
  this.modelbom_data[rowindex].price_source = '';
  this.modelbom_data[rowindex].price_source_id = '';
  this.modelbom_data[rowindex].mandatory = 'N';
  this.modelbom_data[rowindex].unique_identifer = 'N';
  this.modelbom_data[rowindex].is_feature_multiselect = 'N';
  this.modelbom_data[rowindex].feature_default_count = 0;
}

on_bom_type_change(selectedvalue, rowindex) {

  if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
    this.toastr.error('', this.language.ModelCodeBlank, this.commonData.toast_config);
    return false;
  }
  this.serviceData = [];
  this.currentrowindex = rowindex;
  this.made_changes = true;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      this.clearData(i);
      this.modelbom_data[i].type_value = "";
      this.modelbom_data[i].type_value_code = "";
      if (selectedvalue == 3) {
        this.modelbom_data[i].isDisplayNameDisabled = false
        this.modelbom_data[i].isTypeDisabled = false
        this.modelbom_data[i].hide = false
        this.modelbom_data[i].type = 3
        this.modelbom_data[i].isPriceDisabled = true
        this.modelbom_data[i].pricehide = true
        this.modelbom_data[i].isUOMDisabled = true
        this.modelbom_data[i].quantity = ("1");
        this.modelbom_data[i].isMinSelectedDisable = false;
        this.modelbom_data[i].isMaxSelectedDisable = false;
        this.modelbom_data[i].propagate_qty = true;
        this.modelbom_data[i].mandatory = false;
        this.modelbom_data[i].unique_identifer = false;
        this.modelbom_data[i].mandatory_item_disabled = false;
        this.modelbom_data[i].print_on_report = false;
        this.modelbom_data[i].print_on_report_disabled = true;
      }
      else {
        this.modelbom_data[i].isDisplayNameDisabled = false
        this.modelbom_data[i].isTypeDisabled = false
        this.modelbom_data[i].hide = false
        this.modelbom_data[i].quantity = ("1");
        if (selectedvalue == 2) {
          this.lookupfor = 'Item_Detail_lookup';
          this.modelbom_data[i].type = 2
          this.modelbom_data[i].isPriceDisabled = false
          this.modelbom_data[i].pricehide = false
          this.modelbom_data[i].isUOMDisabled = false
          this.modelbom_data[i].isMinSelectedDisable = true;
          this.modelbom_data[i].isMaxSelectedDisable = true;
          this.modelbom_data[i].propagate_qty = true;
          this.modelbom_data[i].mandatory = true;
          
          this.modelbom_data[i].unique_identifer = true;
          this.modelbom_data[i].mandatory_item_disabled = true;
          this.modelbom_data[i].print_on_report = true;
          this.modelbom_data[i].print_on_report_disabled = false;

        }
        else {
          this.modelbom_data[i].type = 1
          this.lookupfor = 'feature_lookup';
          this.modelbom_data[i].isPriceDisabled = true
          this.modelbom_data[i].pricehide = true
          this.modelbom_data[i].isUOMDisabled = true
          this.modelbom_data[i].isMinSelectedDisable = false;
          this.modelbom_data[i].isMaxSelectedDisable = false;
          this.modelbom_data[i].propagate_qty = true;
          this.modelbom_data[i].mandatory = false;
          this.modelbom_data[i].unique_identifer = false;
          this.modelbom_data[i].mandatory_item_disabled = false;
          this.modelbom_data[i].print_on_report = false;
          this.modelbom_data[i].print_on_report_disabled = true;
        }

      }


    }
  }
}

on_type_click(selectedvalue, rowindex) {
  if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
    this.toastr.error('', this.language.ModelCodeBlank, this.commonData.toast_config);
    return false;
  }
  this.made_changes = true;
  this.currentrowindex = rowindex;
  if (selectedvalue == 3) {
    this.getModelDetails(this.modelbom_data.modal_id, "Detail", selectedvalue)
  }
  else {
    // this.lookupfor = 'Item_Detail_lookup';

    this.getModelFeatureDetails(this.modelbom_data.modal_id, "Detail", selectedvalue);
  }

}

getModelFeatureDetails(feature_code, press_location, index) {
  console.log('inopen feature');
  this.showLookupLoader = true;
  this.serviceData = [];
  this.allItemDataDetails = []; 
  this.service.getModelFeatureDetails(feature_code, press_location, index).subscribe(
    data => {
      this.allItemDataDetails = data; 
      if (data.length > 0) {
        this.showLookupLoader = false;
        if (data[0].ErrorMsg == "7001") {
          this.made_changes = false;
          this.commonService.RemoveLoggedInUser().subscribe();
          this.commonService.signOut(this.toastr, this.route, 'Sessionout');
          return;
        } 
        if (press_location == "Header") {
          if (this.lookupfor == 'feature_lookup') {
            // this.feature_bom_data.feature_id = data;
            this.modelbom_data.feature_name = data[0].OPTM_DISPLAYNAME;
            this.modelbom_data.feature_desc = data[0].OPTM_FEATUREDESC;

          }
          else {
            // this.feature_bom_table=data;
            for (let i = 0; i < this.modelbom_data.length; ++i) {
              if (this.modelbom_data[i].rowindex === this.currentrowindex) {
                this.modelbom_data[i].isAccessory = false;
                this.modelbom_data[i].unique_identifer = true;
                this.modelbom_data[i].type_value = data[0].OPTM_FEATUREID.toString();
                this.modelbom_data[i].type_value_code = data[0].OPTM_FEATURECODE.toString();
                this.modelbom_data[i].display_name = data[0].OPTM_DISPLAYNAME;
                this.modelbom_data[i].min_selected = data[0].OPTM_MIN_SELECTABLE;
                this.modelbom_data[i].max_selected = (data[0].OPTM_MAX_SELECTABLE != "" && data[0].OPTM_MAX_SELECTABLE != 0) ? data[0].OPTM_MAX_SELECTABLE : 1;
                this.modelbom_data[i].feature_min_selected = data[0].OPTM_MIN_SELECTABLE;
                this.modelbom_data[i].feature_max_selected = (data[0].OPTM_MAX_SELECTABLE != "" && data[0].OPTM_MAX_SELECTABLE != 0) ? data[0].OPTM_MAX_SELECTABLE : 1;
                this.modelbom_data[i].is_feature_multiselect = data[0].OPTM_ISMULTISELECT;
                this.modelbom_data[i].feature_default_count  = data[0].OPTM_DEFAULTCOUNT;
                if (this.modelbom_data[i].type == 1){
                  if (data[0].OPTM_ACCESSORY == 'Y'){
                    this.modelbom_data[i].isAccessory = true;
                    this.modelbom_data[i].unique_identifer = false;
                  }  
                }

                this.live_tree_view_data.push({ "display_name": data[0].OPTM_DISPLAYNAME, "tree_index": this.currentrowindex,"branchType": 'feature', "icon":'feature' });
              }
            }
          }
        }
        else {
          if (index == 1) {
            this.lookupfor = 'feature_Detail_lookup';
          }
          else {
            this.lookupfor = 'Item_Detail_lookup';
          }

          this.serviceData = data;
        }
      }
      else {
        this.lookupfor = "";
        this.serviceData = [];
        this.showLookupLoader = false;
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }

    },error => {
      this.showLoader = false;
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      }
      return;
    }
    )
}

openFeatureLookUp() {
  this.made_changes = true;
  this.showLookupLoader = true;
  this.serviceData = []
  this.service.GetModelList().subscribe(
    data => {
      if(data != undefined && data != null){
        if(data.length > 0){
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.showLookupLoader = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          } 
        }
      }
      if (data.length > 0) {
        this.lookupfor = 'ModelBom_lookup';
        this.showLookupLoader = false;
        this.serviceData = data;

      }
      else {
        this.lookupfor = "";
        this.serviceData = [];
        this.showLookupLoader = false;
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }
    },error => {
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      }
      return;
    }
    )
}

openPriceLookUp(ItemKey, rowindex) {
  this.serviceData = []
  this.showLookupLoader = true;
  this.currentrowindex = rowindex;
  console.log(this.modelbom_data);
  this.service.GetPriceList(ItemKey).subscribe(
    data => {
      if(data != undefined && data.length > 0){
        if (data[0].ErrorMsg == "7001") {
          this.made_changes = false;
          this.showLookupLoader = false;
          this.commonService.RemoveLoggedInUser().subscribe();
          this.commonService.signOut(this.toastr, this.route, 'Sessionout');
          return;
        } 
      }

      if (data.length > 0) {
        this.lookupfor = 'Price_lookup';
        this.showLookupLoader = false;
        this.serviceData = data;
      }
      else {
        this.lookupfor = "";
        this.serviceData = [];
        this.showLookupLoader = false;
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }
    },error => {
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      }
      return;
    }
    )
}

getLookupValue($event) {
  if (this.lookupfor == "feature_Detail_lookup" || this.lookupfor == "ModelBom_Detail_lookup" || this.lookupfor == "Item_Detail_lookup") {
    console.log("in here - selection ");
    for (let j = 0; j < this.modelbom_data.length; j++) {
      var psTypeCode = this.modelbom_data[j].type_value_code;
      var result = false;
      if (psTypeCode != undefined && psTypeCode != "") {
        if (this.lookupfor == "Item_Detail_lookup") {
          if (psTypeCode.toUpperCase() == $event[1].toUpperCase() || psTypeCode.toUpperCase() == $event[0].toUpperCase()) {
            result = true;
          }
        } else {
          if (psTypeCode.toUpperCase() == $event[1].toUpperCase()) {
            result = true;
          }
        }

        if (result == true) {
          this.toastr.error('', this.language.DuplicateId, this.commonData.toast_config);

          $(".row_type_value_id").eq(this.currentrowindex - 1).val("");
          $(".row_type_value_code").eq(this.currentrowindex - 1).val("");
          return;
        }
      }
    }
  }

  if (this.lookupfor == 'ModelBom_lookup') {
    //alert($event);
    this.made_changes = true;
    this.modelbom_data.modal_id = $event[0];
    this.modelbom_data.modal_code = $event[1];

    this.getModelDetails($event[0], "Header", 0);
  }
  else if (this.lookupfor == 'feature_Detail_lookup') {
    this.made_changes = true;
    this.getModelFeatureDetails($event[0], "Header", 0);
  }
  else if (this.lookupfor == 'ModelBom_Detail_lookup') {
    //On choosing value from lookup we will chk its cyclic dependency
    //First we will check the conflicts
    this.made_changes = true;
    this.checkModelAlreadyAddedinParent($event[0], this.modelbom_data.modal_id, this.currentrowindex - 1, "lookup");

  }
  else if (this.lookupfor == 'Price_lookup') {
    this.made_changes = true;
    this.getPriceDetails($event[1], $event[0], this.currentrowindex);
  }
  else if (this.lookupfor == 'rule_section_lookup') {
    this.made_changes = true;
    this.rule_data = $event;
  }
  else if (this.lookupfor == 'Item_Detail_lookup') {
    this.made_changes = true;
    this.serviceData = []
    this.getItemDetails($event[0]);
  }
}

getPriceDetails(price_list_name, price, index) {
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === index) {
      this.modelbom_data[i].price_source = price_list_name.toString()
      this.modelbom_data[i].price_source_id = price.toString()
    }
  }
}


getModelDetails(Model_code, press_location, index) {
  this.showLookupLoader = true;
  this.service.getModelDetails(Model_code, press_location, index).subscribe(
    data => {

      if (data.length > 0) {
        this.showLookupLoader = false;  
        if (data[0].ErrorMsg == "7001") {
          this.made_changes = false;
          this.commonService.RemoveLoggedInUser().subscribe();
          this.commonService.signOut(this.toastr, this.route, 'Sessionout');
          return;
        }                   

        if (press_location == "Header") {
          if (this.lookupfor == 'ModelBom_lookup') {
            this.modelbom_data.feature_name = data[0].OPTM_DISPLAYNAME;
            this.modelbom_data.feature_desc = data[0].OPTM_FEATUREDESC;
            this.modelbom_data.image_path = data[0].OPTM_PHOTO;
            if (this.modelbom_data.image_path != null && this.modelbom_data.image_path != "") {
              this.header_image_data = this.commonData.get_current_url() + this.modelbom_data.image_path;
              this.showImageBlock = true;
            }
          }
          else {
            for (let i = 0; i < this.modelbom_data.length; ++i) {
              if (this.modelbom_data[i].rowindex === this.currentrowindex) {
                console.log(data[0]);
                this.modelbom_data[i].type_value = data[0].OPTM_FEATUREID;
                this.modelbom_data[i].type_value_code = data[0].OPTM_FEATURECODE;
                this.modelbom_data[i].display_name = data[0].OPTM_DISPLAYNAME
                this.live_tree_view_data.push({ "display_name": data[0].OPTM_DISPLAYNAME, "tree_index": this.currentrowindex ,"branchType": 'modal', "icon":'modal'});
              }
            }
          }
        }
        else {
          if (index == 3) {
            this.lookupfor = 'ModelBom_Detail_lookup';
          }
          this.serviceData = data;
        }
      }
      else {
        this.lookupfor = "";
        this.serviceData = [];
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }
    },error => {
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      }
      return;
    }

    )
}

getItemDetailsOnChange(ItemKey){
  this.serviceData = []
  this.service.getItemDetails(ItemKey).subscribe(
    data => {

      if (data != null) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          } 

          for (let i = 0; i < this.modelbom_data.length; ++i) {
            if (this.modelbom_data[i].rowindex === this.currentrowindex) {
              this.modelbom_data[i].type_value = data[0].ItemKey;
              this.modelbom_data[i].type_value_code = data[0].ItemKey;
              this.modelbom_data[i].display_name = data[0].Description
              this.modelbom_data[i].uom = data[0].InvUOM
              this.modelbom_data[i].price_source = data[0].ListName;
              this.modelbom_data[i].price_source_id = data[0].PriceListID;
              this.modelbom_data[i].unique_identifer =  true; 
              this.live_tree_view_data.push({ "display_name": data[0].Description, "tree_index": this.currentrowindex ,"branchType": 'item', "icon":'item'});
            }
          }
        }
      }
    },error => {
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      }
      return;
    })
}

getSelectedItemDetails(ItemKey){
  let data = this.allItemDataDetails.filter(function (obj) {
    return obj.ItemKey == ItemKey;
  });
  return data;
}

getItemDetails(ItemKey) {
  this.serviceData = []

  let selectedDataDetails:any = [];
  selectedDataDetails = this.getSelectedItemDetails(ItemKey);

  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      this.modelbom_data[i].type_value = selectedDataDetails[0].ItemKey;
      this.modelbom_data[i].type_value_code = selectedDataDetails[0].ItemKey;
      this.modelbom_data[i].display_name = selectedDataDetails[0].Description
      this.modelbom_data[i].uom = selectedDataDetails[0].InvUOM
      this.modelbom_data[i].price_source = selectedDataDetails[0].ListName;
      this.modelbom_data[i].price_source_id = selectedDataDetails[0].PriceListID;
      this.modelbom_data[i].unique_identifer = true;
      this.live_tree_view_data.push({ "display_name": selectedDataDetails[0].Description, "tree_index": this.currentrowindex,"branchType": 'item', "icon":'item' });
    }
  }

}

on_typevalue_change(value, rowindex, code, type_value_code) {
  this.currentrowindex = rowindex
  var iIndex = this.currentrowindex - 1;
  for (let j = 0; j < this.modelbom_data.length; j++) {
    var psTypeCode = this.modelbom_data[j].type_value_code;
    if (psTypeCode != undefined && psTypeCode != "") {
      if (psTypeCode.toUpperCase() == code.toUpperCase()) {
        this.toastr.error('', this.language.DuplicateId, this.commonData.toast_config);
        $(type_value_code).val("");
        return;
      }
    }
  }
  this.made_changes = true;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      this.modelbom_data[i].type_value = value.toString()
      this.modelbom_data[i].type_value_code = code.toString()
      if (this.modelbom_data[i].type == 1) {
        this.service.onFeatureIdChangeModelBom(this.modelbom_data[i].type_value_code).subscribe(
          data => {

            if(data != undefined && data.length > 0){
              if (data[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.commonService.RemoveLoggedInUser().subscribe();
                this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              } 
            }
            if (data === "False") {
              this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
              this.modelbom_data[iIndex].type_value = "";
              this.modelbom_data[iIndex].type_value_code = "";
              this.modelbom_data[iIndex].display_name = "";
              this.modelbom_data[i].min_selected = 1;
              this.modelbom_data[i].max_selected = 1;
              this.modelbom_data[i].feature_min_selected = 1;
              this.modelbom_data[i].feature_max_selected = 1;
              this.modelbom_data[i].is_feature_multiselect = 'N';
              this.modelbom_data[i].feature_default_count = 0;
              return;
            }
            else {
              this.lookupfor = ""
              this.modelbom_data[iIndex].type_value = data;
              this.getModelFeatureDetails(this.modelbom_data[iIndex].type_value, "Header", iIndex)
            }
          },error => {
            if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
              this.commonService.isUnauthorized();
            }
            return;
          })
      }
      else if (this.modelbom_data[i].type == 2) {
        this.service.onItemIdChangeModelBom(this.modelbom_data[i].type_value_code).subscribe(
          data => {
            console.log(data);
            if(data != undefined && data.length > 0){
              if (data[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.commonService.RemoveLoggedInUser().subscribe();
                this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              } 
            }
            if (data === "False") {
              this.toastr.error('', this.language.Invalid_feature_item_value, this.commonData.toast_config);
              this.modelbom_data[iIndex].type_value = "";
              this.modelbom_data[iIndex].type_value_code = "";
              this.modelbom_data[iIndex].display_name = "";
              this.modelbom_data[iIndex].price_source = ""; 
              this.modelbom_data[iIndex].price_source_id = ""; 
              return;
            }
            else {
              this.lookupfor = "";
              this.modelbom_data[iIndex].type_value = data;
              // this.getItemDetails(this.modelbom_data[iIndex].type_value);
              this.getItemDetailsOnChange(this.modelbom_data[iIndex].type_value);
            }
          },error => {
            if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
              this.commonService.isUnauthorized();
            }
            return;
          })
      }
      else {
        //First we will check the conflicts
        this.checkModelAlreadyAddedinParent(value, code, i, "change");
      }
    }
  }
}

on_display_name_change(value, rowindex) {

  this.currentrowindex = rowindex
  this.made_changes = true;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      if (this.modelbom_data.feature_name == value) {
        this.modelbom_data[i].display_name = "";
        this.toastr.error('', this.language.model_child_name_no_same, this.commonData.toast_config);
        return false;
      }
      this.modelbom_data[i].display_name = value;
      this.live_tree_view_data.push({ "display_name": value, "tree_index": this.currentrowindex });
    }
  }
}

on_quantity_change(value, rowindex) {
  this.currentrowindex = rowindex;
  this.made_changes = true;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      if (value == 0) {
        value = 1;
        this.modelbom_data[i].quantity = (value);
        this.toastr.error('', this.language.quantityvalid, this.commonData.toast_config);
      }
      else {
        var rgexp = /^\d+$/;
        if (isNaN(value) == true) {
          value = 1;
          this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
        } else if (value == 0 || value == '' || value == null || value == undefined) {
          value = 1;
          this.toastr.error('', this.language.blank_or_zero_not_allowed, this.commonData.toast_config);
        } else if (value < 0) {
          value = 1;
          this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
        } else if (rgexp.test(value) == false) {
          value = 1;
          this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
        }
        this.modelbom_data[i].quantity = (value);
      }

      $('input[name="bom_quantity"]').eq((rowindex - 1)).val((value));
    }
  }
}

print_on_report_change(value, rowindex){
  this.made_changes = true;
  this.currentrowindex = rowindex
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      console.log('print_on_report value ' + value);
      if (value.checked == true) {
        this.modelbom_data[i].print_on_report = true
      }
      else {
        this.modelbom_data[i].print_on_report = false
      }
    }
  }
}

on_uom_change(value, rowindex) {
  this.currentrowindex = rowindex;
  this.made_changes = true;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      this.modelbom_data[i].uom = value
    }
  }
}

on_min_selected_change(value, rowindex, actualvalue) {
  this.currentrowindex = rowindex;
  this.made_changes = true;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      var rgexp = /^\d+$/;
      if (isNaN(value) == true) {
        this.modelbom_data[i].min_selected = this.modelbom_data[i].feature_min_selected;
        this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
        $(".min_selectable_row").eq((rowindex - 1)).val(0);
        return;
      } else if (value == '' || value == null || value == undefined) {
        this.modelbom_data[i].min_selected = this.modelbom_data[i].feature_min_selected;
        this.toastr.error('', this.language.blank_not_allowed_min_selectable, this.commonData.toast_config);
        $(".min_selectable_row").eq((rowindex - 1)).val(0);
        return;
      } else if (value < 0) {
        this.modelbom_data[i].min_selected = this.modelbom_data[i].feature_min_selected;
        this.toastr.error('', this.language.negativeminselectablevalid, this.commonData.toast_config);
        $(".min_selectable_row").eq((rowindex - 1)).val(0);
        return;
      } else if (rgexp.test(value) == false) {
        this.modelbom_data[i].min_selected = this.modelbom_data[i].feature_min_selected;
        this.toastr.error('', this.language.decimaleminselectablevalid, this.commonData.toast_config);
        $(".min_selectable_row").eq((rowindex - 1)).val(0);
        return;
      }

      this.modelbom_data[i].min_selected = value
      if (this.modelbom_data[i].max_selected != "") {
        if (parseInt(this.modelbom_data[i].max_selected) < parseInt(value)) {
          this.modelbom_data[i].min_selected = this.modelbom_data[i].feature_min_selected;
          // $(actualvalue).val(1);
          $(".min_selectable_row").eq((rowindex - 1)).val(this.modelbom_data[i].feature_min_selected);
          this.toastr.error('', this.language.qty_validation, this.commonData.toast_config);
          return;
        }
      }
    }
  }
}

on_max_selected_change(value, rowindex, actualvalue) {
  this.currentrowindex = rowindex
  this.made_changes = true;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      var rgexp = /^\d+$/;
      if (isNaN(value) == true) {
        this.modelbom_data[i].min_selected = (this.modelbom_data[i].feature_min_selected!="") ? this.modelbom_data[i].feature_min_selected : "1";
        this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
        $(".max_selectable_row").eq((rowindex - 1)).val(this.modelbom_data[i].feature_max_selected);
        return;
      } else if (value == 0 || value == '' || value == null || value == undefined) {
        this.modelbom_data[i].min_selected = (this.modelbom_data[i].feature_min_selected!="") ? this.modelbom_data[i].feature_min_selected : "1";
        this.toastr.error('', this.language.blank_or_zero_not_allowed_max_selectable, this.commonData.toast_config);
        $(".max_selectable_row").eq((rowindex - 1)).val(this.modelbom_data[i].feature_max_selected);
        return;
      } else if (value < 0) {
        this.modelbom_data[i].min_selected = (this.modelbom_data[i].feature_min_selected!="") ? this.modelbom_data[i].feature_min_selected : "1";
        this.toastr.error('', this.language.negativemaxselectablevalid, this.commonData.toast_config);
        $(".max_selectable_row").eq((rowindex - 1)).val(this.modelbom_data[i].feature_max_selected);
        return;
      } else if (rgexp.test(value) == false) {
        this.modelbom_data[i].min_selected = (this.modelbom_data[i].feature_min_selected!="") ? this.modelbom_data[i].feature_min_selected : "1";
        this.toastr.error('', this.language.decimalmaxselectablevalid, this.commonData.toast_config);
        $(".max_selectable_row").eq((rowindex - 1)).val(this.modelbom_data[i].feature_max_selected);
        return;
      }

      // dont allow less than default defined in feature
      if (this.modelbom_data[i].feature_default_count > value){
        this.modelbom_data[i].min_selected = this.modelbom_data[i].feature_min_selected;
        this.modelbom_data[i].max_selected = this.modelbom_data[i].feature_max_selected;
        $(".max_selectable_row").eq((rowindex - 1)).val(this.modelbom_data[i].feature_max_selected);
        this.toastr.error('', this.language.max_selectable_less_than_default + ' ' + rowindex, this.commonData.toast_config);
        return;
      }

      this.modelbom_data[i].max_selected = value;
      if (this.modelbom_data[i].type == "1") {
        this.service.CheckMaxSelectedValue(this.modelbom_data[i].type_value).subscribe(
          data => {
            console.log(data);
            if(data != undefined && data != null && data.length > 0){
              if (data[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.commonService.RemoveLoggedInUser().subscribe();
                this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              } 
            }

            if (data != null && data[0] != undefined && data[0]) {
              let defaultCount = data[0].DefaultCount;
              let FeatureChild = (data[0].FeatureChild);
              let MaxSelectable = data[0].MaxSelectable;
              if(data[0].FeatureChild == 0) {
                this.modelbom_data[i].max_selected = 1;
                $(".max_selectable_row").eq((rowindex - 1)).val(1);
                this.toastr.error('', this.language.max_selected_validation_ie + " : " + 1, this.commonData.toast_config);
                return;
              } else {
                if (parseFloat(value) > parseFloat(MaxSelectable)) { 
                  this.modelbom_data[i].max_selected = MaxSelectable;
                  $(".max_selectable_row").eq((rowindex - 1)).val(MaxSelectable);
                  this.toastr.error('', this.language.max_selected_validation_ie + " : " + MaxSelectable, this.commonData.toast_config);
                  return;
                }

                if (parseFloat(value) < parseFloat(defaultCount)) { 
                  this.modelbom_data[i].max_selected = MaxSelectable;
                  $(".max_selectable_row").eq((rowindex - 1)).val(MaxSelectable);
                  this.toastr.error('', this.language.max_selectable_less_than_default + " : " + rowindex, this.commonData.toast_config);
                  return;
                }
              }

            } 


          },error => {
            if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
              this.commonService.isUnauthorized();
            }
            return;
          })
      } 

      if (this.modelbom_data[i].min_selected != "") {
        if (parseInt(this.modelbom_data[i].min_selected) > parseInt(value)) {
          this.modelbom_data[i].min_selected = this.modelbom_data[i].feature_min_selected;
          this.modelbom_data[i].max_selected = this.modelbom_data[i].feature_max_selected;
          $(".max_selectable_row").eq((rowindex - 1)).val(1);
          this.toastr.error('', this.language.qty_validation, this.commonData.toast_config);
          return;
        }
      }

    }
  }
}

on_propagate_qty_change(value, rowindex) {
  this.made_changes = true;
  this.currentrowindex = rowindex
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      if (value.checked == true) {
        this.modelbom_data[i].propagate_qty = true
      }
      else {
        this.modelbom_data[i].propagate_qty = false
      }
    }
  }
}

on_price_source_change(id, value, rowindex, actualValue) {
  this.made_changes = true;
  this.currentrowindex = rowindex;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      this.service.CheckValidPriceListEntered(this.modelbom_data[i].type_value, value).subscribe(
        data => {
          if(data != undefined && data.length > 0){
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            } 
          }
          if (data === "False") {
            $(actualValue).val("");
            this.toastr.error('', this.language.InvalidPriceId, this.commonData.toast_config);
            return;
          }
          else if (data != null) {
            this.modelbom_data[i].price_source_id = data
            this.modelbom_data[i].price_source = value
            this.lookupfor = ""
          }

        },error => {
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commonService.isUnauthorized();
          }
          return;
        })
    }
  }
}

on_mandatory_change(value, rowindex) {
  this.made_changes = true;
  this.currentrowindex = rowindex;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      if (value.checked == true) {
        this.modelbom_data[i].mandatory = true
      }
      else {
        this.modelbom_data[i].mandatory = false
      }
    }
  }
}

on_unique_identifer_change(value, rowindex) {
  this.made_changes = true;
  this.currentrowindex = rowindex
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (this.modelbom_data[i].rowindex === this.currentrowindex) {
      if (value.checked == true) {
        this.modelbom_data[i].unique_identifer = true
      }
      else {
        this.modelbom_data[i].unique_identifer = false
      }
    }
  }
}

on_isready_change(value) {
  this.made_changes = true;
  for (let i = 0; i < this.modelbom_data.length; ++i) {
    if (value.checked == true) {
      this.modelbom_data[i].ReadyToUse = true
    }
    else {
      this.modelbom_data[i].ReadyToUse = false
    }
  }
}

onSave() {
  var obj = this;
  if (this.validate_unique_identifier() == false) {
    return;
  }
  if (obj.validation("Save") == false) {
    return;
  }
  this.showLookupLoader = true;

  if(this.rule_data.length == 0)
  {
    obj.save_data();
    return;
  }

  obj.onVerifyOutput(function (response) {
    console.log('in validate true ' + response);
    if (response == true) {
      obj.save_data();
    } else {
      this.showLookupLoader = false;
    }
  });
}

validation(btnpress) {
  if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
    this.toastr.error('', this.language.ModelCodeBlank, this.commonData.toast_config);
    return false;
  }

  if (btnpress == "Save") {
    this.made_changes = false;
    if (this.modelbom_data.length == 0) {
      this.toastr.error('', this.language.Addrow, this.commonData.toast_config);
      return false;
    }
    else {
      for (let i = 0; i < this.modelbom_data.length; ++i) {
        let currentrow = i + 1;
        if (this.modelbom_data[i].type == 1 && this.modelbom_data[i].type_value == "") {
          this.toastr.error('', this.language.SelectFeature + currentrow, this.commonData.toast_config);
          return false;
        }
        if (this.modelbom_data[i].type == 2 && this.modelbom_data[i].type_value == "") {
          this.toastr.error('', this.language.SelectItem + currentrow, this.commonData.toast_config);
          return false;
        }
        if (this.modelbom_data[i].type == 3 && this.modelbom_data[i].type_value == "") {
          this.toastr.error('', this.language.SelectModel + currentrow, this.commonData.toast_config);
          return false;
        }
        if (this.modelbom_data[i].quantity == "") {
          this.toastr.error('', this.language.quantityblank + currentrow, this.commonData.toast_config);
          return false;
        }
      }
    }

  }
}

onDelete() {
  // var result = confirm(this.language.DeleteConfimation);
  this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
  this.show_dialog = true;
}

//delete record will be execute from here
delete_record() {
  console.log('this.modelbom_data.modal_id');
  console.log(this.modelbom_data.modal_id);
  let GetItemData = []
  GetItemData.push({
    CompanyDBId: this.companyName,
    ModelId: this.modelbom_data.modal_id,
    GUID: sessionStorage.getItem("GUID"),
    UsernameForLic: sessionStorage.getItem("loggedInUser")
  });
  this.service.DeleteData(GetItemData).subscribe(
    data => {
      if(data != undefined && data.length > 0){
        if (data[0].ErrorMsg == "7001") {
          this.made_changes = false;
          this.showLookupLoader = false;
          this.commonService.RemoveLoggedInUser().subscribe();
          this.commonService.signOut(this.toastr, this.route, 'Sessionout');
          return;
        } 
      }

      if(data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists"){
        this.toastr.error('', this.language.Refrence + ' at: ' + data[0].ModelCode , this.commonData.toast_config);
      }
      else if(data[0].IsDeleted == "1"){
        this.toastr.success('', this.language.DataDeleteSuccesfully + ' : ' + data[0].ModelCode, this.commonData.toast_config);
        this.made_changes = false;
        this.route.navigateByUrl('modelbom/view');
      }
      else{
        this.toastr.error('', this.language.DataNotDelete + ' : ' + data[0].ModelCode , this.commonData.toast_config);
      }

    },error => {
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      }
      return;
    }
    )
}

//This will take confimation box value
get_dialog_value(userSelectionValue) {
  if (userSelectionValue == true) {
    this.delete_record();
  }
  this.show_dialog = false;
}

onExplodeClick(type) {
  if (type == "manual") {
    this.showtree();
  }
  console.log('onExplodeClick');
  this.lookupfor = 'tree_view__model_bom_lookup"';
  console.log(this.tree_data_json);
  if (this.modelbom_data.modal_id != undefined) {
    //now call bom id
    if (this.tree_data_json == undefined || this.tree_data_json.length == 0) {
      this.service.GetDataForExplodeViewForModelBOM(this.companyName, this.modelbom_data.modal_id, this.modelbom_data.feature_name).subscribe(
        data => {
          if (data != null && data != undefined) {
            if(data.length > 0){
              if (data[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.commonService.RemoveLoggedInUser().subscribe();
                this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              } 
            }
            // this.serviceData = data;
            // this.lookupfor = "tree_view__model_bom_lookup";
            let counter_temp = 0;
            let temp_data = data.filter(function (obj) {
              obj['tree_index'] = (counter_temp);
              obj['live_row_id'] = (counter_temp++);
              return obj;
            });
            this.tree_data_json = temp_data;

          }
          else {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
            return;
          }

        },error => {
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commonService.isUnauthorized();
          } else {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          }
          return;
        }
        );
    }
    else {

      for (let i = 0; i < this.modelbom_data.length; ++i) {
        if(this.modelbom_data[i].display_name == ''){
          let currentrowindx = i+1;
          this.toastr.error('', this.language.DisplayNameRequired + currentrowindx, this.commonData.toast_config);
        }
      }

      let temp_data_level = this.tree_data_json.filter(function (obj) {
        return obj.level == "0" || obj.level == "1";
      });

      let sequence_count = parseInt(this.tree_data_json.length + 1);
      console.log(this.live_tree_view_data);
      if (this.live_tree_view_data.length > 0) {

        // for (var key in this.live_tree_view_data) {
          for (var key = 0 ; key < this.live_tree_view_data.length ; key++) {
            var update_index = "";

            if (this.live_tree_view_data[key].tree_index !== undefined) {
              let local_tree_index = this.live_tree_view_data[key].tree_index;
              update_index = temp_data_level.findIndex(function (tree_el) {
                return tree_el.tree_index == local_tree_index
              });
            }

            let temp_seq = {};

            //let temp_seq = { "sequence": sequence_count, "parentId": this.modelbom_data.feature_name, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1", "tree_index": this.live_tree_view_data[key].tree_index };
            if (update_index == "-1") {
              temp_seq = { "sequence": sequence_count, "parentId": this.modelbom_data.modal_code, "parentNumber": this.modelbom_data.modal_id, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1", "tree_index": this.live_tree_view_data[key].tree_index, "branchType": this.live_tree_view_data[key].branchType , "icon": this.live_tree_view_data[key].icon,"modalImage": ""};
              this.tree_data_json.push(temp_seq);
              temp_data_level.push(temp_seq);
            } else {
              let TempBranchType = temp_data_level[update_index].branchType;
              let TempIcon = temp_data_level[update_index].icon;

              temp_seq = { "sequence": sequence_count, "parentId": this.modelbom_data.modal_code, "parentNumber": this.modelbom_data.modal_id, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1", "tree_index": this.live_tree_view_data[key].tree_index, "branchType": TempBranchType , "icon": TempIcon,"modalImage": ""};

              let up_index = this.tree_data_json.findIndex(function (tree_el) {
                return tree_el.component == temp_data_level[update_index].component && tree_el.parentId == temp_data_level[update_index].parentId && tree_el.branchType == temp_data_level[update_index].branchType
              });

              this.tree_data_json[up_index] = (temp_seq);
              temp_data_level[update_index] = (temp_seq);
            }
            //this.live_tree_view_data.splice(key, 1);
          }
          console.log(this.tree_data_json);
          this.live_tree_view_data = [];
        }
      }
    } else {
      this.toastr.error('', this.language.ModelCodeBlank, this.commonData.toast_config);
      return;
    }
  }

  onVerifyOutput(success_call): any {
    let objDataset: any = {};
    objDataset.ModelData = [];
    objDataset.RuleData = [];
    objDataset.apiData = [];
    objDataset.ModelData.push({
      CompanyDBId: this.companyName,
      ModelId: this.modelbom_data.modal_id
    });
    objDataset.RuleData = this.rule_data;
    objDataset.apiData.push({
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });

    this.service.onVerifyOutput(objDataset).subscribe(
      data => {
        if (data !== undefined && data != "" && data != null) {
          if(data.length > 0){
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          } 
          if (data == "Rules Conflict") {
            this.showLookupLoader = false;
            this.toastr.error('', this.language.conflict, this.commonData.toast_config);
            success_call(false);
            return false;
          }

          else{
            this.toastr.success('', this.language.ruleValidated, this.commonData.toast_config);
            success_call(true);
            return true;
          }
        }
      },error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        }
        return;
      })
  }

  enlage_image(image) {
    this.lookupfor = 'large_image_view';
    this.selectedImage = image;
  }

  onModelIdChange() {
    this.made_changes = true;
    this.service.onModelIdChange(this.modelbom_data.modal_code).subscribe(
      data => {
        if (data === "False") {
          this.toastr.error('', this.language.InvalidModelId, this.commonData.toast_config);
          this.modelbom_data.modal_id = "";
          this.modelbom_data.modal_code = "";
          this.modelbom_data.feature_name = "";
          this.modelbom_data.feature_desc = "";
          return;
        }
        else {
          this.lookupfor = "ModelBom_lookup"
          this.modelbom_data.modal_id = data;
          this.getModelDetails(this.modelbom_data.modal_id, "Header", 0);

        }
      },error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        }
        return;
      })
  }

  on_rule_click() {
    this.lookupfor = "rule_section_lookup";
    this.ruleselected = [];
    //this.ruleselected=this.rule_data;
    this.serviceData = [];
    this.showLookupLoader = true;
    this.service.getRuleLookupList(this.modelbom_data.modal_id).subscribe(
      data => {
        this.showLookupLoader = false;
        console.log(data);
        if(data != undefined && data.length > 0){
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          } 
        }

        if (data.length > 0) {
          this.serviceData = data;
        }
        else {
          this.toastr.error('', this.language.norules, this.commonData.toast_config);
          return;
        }
      },error => {
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        }
        return;
      });
  }

  getModelItemDetails(rowIndex) {
    this.service.onModelIdChange(this.modelbom_data[rowIndex].type_value_code).subscribe(
      data => {

        if(data != undefined && data.length > 0){
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          } 
        }

        if (data === "False") {
          this.toastr.error('', this.language.Invalid_feature_item_value, this.commonData.toast_config);
          this.modelbom_data[rowIndex].type_value = "";
          this.modelbom_data[rowIndex].type_value_code = "";
          this.modelbom_data[rowIndex].display_name = "";
          this.modelbom_data[rowIndex].min_selected = 1;
          this.modelbom_data[rowIndex].max_selected = 1;
          return;
        }
        else {
          this.lookupfor = "";
          this.modelbom_data.modal_id = data;
          this.getModelDetails(this.modelbom_data.modal_id, "Header", rowIndex);
        }
      },error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        }
        return;
      })
  }

  checkModelAlreadyAddedinParent(enteredModelID, modelbom_type_value, rowindex, fromEvent) {
    console.log(modelbom_type_value);
    this.service.CheckModelAlreadyAddedinParent(enteredModelID, this.modelbom_data.modal_id).subscribe(
      data => {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          } 
          //If exists then will restrict user 
          else if (data == "Exist") {
            this.toastr.error('', this.language.cyclic_ref_restriction, this.commonData.toast_config);
            this.modelbom_data[rowindex].type_value = "";
            this.modelbom_data[rowindex].display_name = "";
            this.modelbom_data[rowindex].min_selected = 1;
            this.modelbom_data[rowindex].max_selected = 1;

            return;
          }
          else if (data == "True") {
            if (fromEvent == "lookup") {
              this.lookupfor = 'ModelBom_Detail_lookup';
              this.getModelDetails(enteredModelID, "Header", 0);
            }
            else if (fromEvent == "change") {
              this.getModelItemDetails(rowindex);
            }
          }
        }
        else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          console.log("Failed when checking hierac check for feature ID")
          return;
        }
      },error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return;
      }
      )
  }

  //This will recurse the tree
  get_childrens(unique_key) {
    let data = this.complete_dataset.filter(function (obj) {
      return obj['node_id'] == unique_key;
    });
    return data;
  }

  check_component_exist(unique_key, level) {
    level = (parseInt(level) + 1);
    let data = [];
    if (unique_key != "" && unique_key != null && unique_key != undefined) {
      data = this.tree_data_json.filter(function (obj) {
        return obj['node_id'] == unique_key; //  && obj['level'] == level;
      });
    }
    return data;
  }
      /* get_childrens(componentNumber) {
         let data = this.complete_dataset.filter(function (obj) {
           return obj['parentNumber'] == componentNumber;
         });
         return data;
       }

       check_component_exist(componentNumber, level) {
         level = (parseInt(level) + 1);
         let data = [];
         if (componentNumber != "" && componentNumber != null && componentNumber!= undefined ){
           data = this.tree_data_json.filter(function (obj) {
             return obj['parentNumber'] == componentNumber; // && obj['level'] == level
           });
         }
         return data;
       } */

       validate_unique_identifier(){

         // if (this.modelbom_data.is_ready_to_use == true) {
           var unique_item_array = this.modelbom_data.filter(function (obj) {
             return (obj.unique_identifer == true) ? obj : ""
           });

           if (unique_item_array.length == 0) {
             this.toastr.error('', this.language.atleast_one_unique_required, this.commonData.toast_config);
             this.showLookupLoader = false;
             return false;
           }
       /*  } else {
           return true;
         }*/
       }

       save_data() {
         if (this.modelbom_data.length > 0) {
           let objDataset: any = {};
           objDataset.ModelData =[];
           objDataset.RuleData = [];
           var temp_model_data = new Array();
           if(this.isDuplicateMode)
           {
            this.modelbom_data[0].id =  0; 
           }
           else
           {
            this.modelbom_data[0].id = this.update_id;
           }

           for (let i = 0; i < this.modelbom_data.length; ++i) {
             
             if (this.modelbom_data[i].display_name == "" || this.modelbom_data[i].display_name == " ") {
               let currentrow = i + 1;
               this.toastr.error('',this.language.DisplayNameRequired + currentrow, this.commonData.toast_config);
               this.showLookupLoader = false;
               return;
             }
           }

           if(this.validate_unique_identifier() == false){
             return;
           }
           temp_model_data = this.modelbom_data;
           console.log("modelbom data ", this.modelbom_data);
           for (let i = 0; i < temp_model_data.length; ++i) { 
            if(this.isDuplicateMode)
            {
              this.NewModel = this.modelbom_data.modal_id;
              this.modelbom_data[i].ModelId = this.NewModel;
            }
             if (temp_model_data[i].unique_identifer == false) {
               temp_model_data[i].unique_identifer = "N"
             }
             else {
               temp_model_data[i].unique_identifer = "Y"
             }
             if (temp_model_data[i].mandatory == false) {
               temp_model_data[i].mandatory = "N"
             }
             else {
               temp_model_data[i].mandatory = "Y"
             }
             if (temp_model_data[i].propagate_qty == false) {
               temp_model_data[i].propagate_qty = "N"
             }
             else {
               temp_model_data[i].propagate_qty = "Y"
             }
             if (temp_model_data[i].ReadyToUse == false) {
               temp_model_data[i].ReadyToUse = "N"
             }
             else {
               temp_model_data[i].ReadyToUse = "Y"
             }

             temp_model_data[i].type_value = temp_model_data[i].type_value.toString();

             if (this.modelbom_data[i].print_on_report === false) {
                this.modelbom_data[i].print_on_report = "N"
              }
              else {
                this.modelbom_data[i].print_on_report = "Y"
              }
           }


           console.log("temp_model_data ", temp_model_data);
           objDataset.ModelData = temp_model_data;
           objDataset.RuleData = this.rule_data;

           this.service.SaveModelBom(objDataset).subscribe(
             data => {
               this.showLookupLoader = false;
               if (data == "7001") {
                 this.made_changes = false;
                 this.commonService.RemoveLoggedInUser().subscribe();
                 this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                 return;
               }

               if (data === "True") {
                 this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
                 this.route.navigateByUrl('modelbom/view');
                 return;
               }
               else if (data === "AlreadyExist") {
                 this.toastr.error('', this.language.DuplicateCode, this.commonData.toast_config);
                 return;
               }
               else {
                 this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
                 return;
               }
             },error => {
               this.showLookupLoader = false
              if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
                this.commonService.isUnauthorized();
              }
              return;
            })
         }
       }

       toggleTree(e) {
         let element = document.getElementById('right-tree-section');
         if (element.classList.contains('d-block')) {
           this.hidetree();
         } else {
           this.showtree();
         }
       }

       showtree() {
         if ($(document).find('#right-tree-section').hasClass('d-none')) {
           $(document).find('#right-tree-section').removeClass('d-none');
           $(document).find('#right-tree-section').addClass('d-block');
           $(document).find('#left-table-section').removeClass('col-md-12').addClass('col-md-9');
         }
       }


       hidetree() {
         if ($(document).find('#right-tree-section').hasClass('d-block')) {
           $(document).find('#right-tree-section').removeClass('d-block');
           $(document).find('#right-tree-section').addClass('d-none');
           $(document).find('#left-table-section').removeClass('col-md-9').addClass('col-md-12');
         }
       }

       bodyClick() {
         $('body').click()
       }
       openModal(template: TemplateRef<any>) {
         $('body').click()
         this.modalRef = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
       }
       childExpand(id: any) {
         id.classList.toggle("expanded")
         if (id.parentNode.parentNode.childNodes[4].style.display === "none") {
           id.parentNode.parentNode.childNodes[4].style.display = "block";
         } else {
           id.parentNode.parentNode.childNodes[4].style.display = "none";
         }
       }
       expandAll(){
         console.log("expandAll")
         $(document).find('treeview').show()    
         $(document).find('.expand-btn').addClass("expanded")
       }
       collapseAll(){
         console.log("collapseAll")
         $(document).find('treeview').hide()
         $(document).find('.expand-btn').removeClass("expanded")
       }

       resequence_operation(type) {  // type = 1 : up & type = 2 : down
    /* let current_row_index = this.current_selected_row.rowindex - 1;
    this.row_selection = []; */
    let row_c_select = this.current_selected_row.rowindex;
    let current_row_index = this.modelbom_data.findIndex(function (obj) {
      return obj.rowindex == row_c_select;
    });
    this.row_selection = [];
    console.log("this.row_selection start  - ", this.row_selection);
    if (type == '1') {
      let prev_row_index = current_row_index - 1;
      if (this.modelbom_data[prev_row_index] != undefined) { // && this.modelbom_data[prev_row_index].length > 0
        this.modelbom_data[current_row_index].rowindex = this.modelbom_data[current_row_index].rowindex - 1;
        this.modelbom_data[prev_row_index].rowindex = this.modelbom_data[prev_row_index].rowindex + 1;

        var temp_swap = this.modelbom_data[current_row_index];
        this.modelbom_data[current_row_index] = this.modelbom_data[prev_row_index];
        this.modelbom_data[prev_row_index] = temp_swap;
        this.row_selection = [this.modelbom_data[prev_row_index].rowindex];
        this.current_selected_row = this.modelbom_data[prev_row_index];
      }
    } else if (type == '2') {
      let next_row_index = current_row_index + 1;
      if (this.modelbom_data[next_row_index] != undefined) { // && this.modelbom_data[next_row_index].length > 0
        this.modelbom_data[current_row_index].rowindex = this.modelbom_data[current_row_index].rowindex + 1;
        this.modelbom_data[next_row_index].rowindex = this.modelbom_data[next_row_index].rowindex - 1;


        var temp_swap = this.modelbom_data[current_row_index];
        this.modelbom_data[current_row_index] = this.modelbom_data[next_row_index];
        this.modelbom_data[next_row_index] = temp_swap;
        this.row_selection = [this.modelbom_data[next_row_index].rowindex];
        this.current_selected_row = this.modelbom_data[next_row_index];
      }
    }
  }
}





