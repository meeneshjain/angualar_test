import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { OutputService } from '../../services/output.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from '../../services/common.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  //providers:[LookupComponent],
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  public selectedImage = "";
  @ViewChild("modelcode") _el: ElementRef;
  @ViewChild("refresh_button") _refresh_el: ElementRef;
  @ViewChild("description") text_input_elem: ElementRef;


  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public modify_duplicate_selected: boolean = false;
  public page_main_title = this.language.output_window;
  public common_output_data: any = [];
  public feature_accessory_list: any[];
  public getSavedModelData = [];
  public step1_data: any = [];
  public stepp_data: any = [];
  public step2_data: any = [];
  public step3_data: any = [];
  public step4_data: any = [];
  public FeatureChildData = [];
  public feature_itm_list_table = [];
  public accessory_itm_list_table = [];
  public feature_itm_list_temp_table = [];
  public parentfeatureid: string = "";
  public feature_discount_percent: number = 0;
  public discount_price: number = 0;

  public accessory_discount_percent: number = 0;
  public step2_final_dataset_to_save = [];
  public tree_accessory_json = [];
  public Accessoryarray = [];
  public ModelHeaderItemsArray = [];
  public ModelBOMRules = [];
  public MainModelDetails = [];
  public warehouse: string = "";
  public currentDate = new Date();
  public submit_date;
  public showLookupLoader: boolean = false;
  public step2_selected_model: any = '';
  public step2_selected_model_id: any = '';
  public step4_final_prod_total: any = 0;
  public step4_final_acc_total: any = 0;
  public step4_final_grand_total: any = 0;
  public step4_final_DetailModelData = [];
  //Outputlog
  public prod_discount_log: any = 0;
  public access_dis_amount_log: any = 0;
  public isPreviousPressed: boolean = false;
  public isDuplicate: boolean = false;
  public navigationSubscription;
  //public step2_data_all_data={};

  // public router_link_new_config = "";

  public defaultCurrency = sessionStorage.defaultCurrency;
  public doctype: any = "";
  public lookupfor: string = '';
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.Name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price_source, this.language.extension, this.language.accessories];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price_source, this.language.extension];
  public model_discount_table_head = [this.language.discount_per, this.feature_discount_percent];
  public final_selection_header = ["#", this.language.serial, this.language.item, this.language.quantity, this.language.price + ' (' + this.defaultCurrency + ')', this.language.extension, "", "", "delete"];
  public step3_data_final_hidden_elements = [false, false, false, false, false, false, true, true, false, false];
  public step4_data_final_hidden_elements = [false, false, false, false, false, false, true, true, true];
  public feature_total_before_discount = 0;
  public feature_item_tax: number = 0
  public feature_item_total: number = 0
  public step3_feature_price_bef_dis: number = 0
  public step3_acc_price_bef_dis: number = 0
  public acc_item_tax: number = 0
  public bycheckboxpress: number = 0;
  public acc_total: number = 0
  public accessory_item_tax: number = 0;
  public accessory_item_total: number = 0;
  public acc_grand_total: number = 0;
  public isModelVisible: boolean = false;
  public selecteddataforelement: any;
  public final_document_number: any = '';
  public selectfeaturedata = [];
  public modelitemflag: number = 0;
  public final_array_checked_options = [];
  public navigatenextbtn: boolean = false;
  public validnextbtn: boolean = true;
  public showPrintOptions: boolean = false;
  public previousquantity: any = parseFloat("1").toFixed(3);
  public feature_tax_total = [
    { "key": this.language.tax, "value": this.feature_item_tax },
    { "key": this.language.total, "value": this.feature_item_total },
  ];
  public item_tax_total = [
    { "key": this.language.product_tax, "value": this.acc_item_tax },
    { "key": this.language.product_total, "value": this.acc_total },
    { "key": this.language.accessories_discount, "value": this.acc_item_tax },
    { "key": this.language.accessories_tax, "value": this.acc_item_tax },
    { "key": this.language.accessories_total, "value": this.acc_total },
    { "key": this.language.grand_total, "value": this.acc_grand_total }
  ];
  //
  public new_item_list = [];
  /* public refresh_button_text = '<i class="fa fa-refresh fa-fw"></i> ' + this.language.refresh; */
  public showFinalLoader: boolean = true;
  public dontShowFinalLoader: boolean = false;
  public Accessory_table_hidden_elements = [false, false, false, true, true, true, true];
  public order_creation_table_head = [this.language.hash, 'SI#', this.language.item, this.language.quantity, this.language.price + ' (' + this.defaultCurrency + ')', this.language.extension];
  feature_child_data: any = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  Object = Object;
  console = console;
  public ruleData: any = [];
  public isSecondIteration = false
  public ruleIndex: number = 0

  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private OutputService: OutputService, private toastr: ToastrService, private elementRef: ElementRef, private cdref: ChangeDetectorRef, private CommonService: CommonService, private DialogService: DialogService) {
    /* this.navigationSubscription
     this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.clear_all_screen_data()
        this.onOperationChange('');
      }
    });*/
  }
  serviceData: any;
  public new_output_config: boolean = false;
  public contact_persons: any = [];
  public sales_employee: any = [];
  public ship_to: any = [];
  public bill_to: any = [];
  public ship_data: any = [];
  public bill_data: any = [];
  public owner_list: any = [];
  public customerBillTo: any;
  public document: any;
  public customerShipTo: any;
  public isNextButtonVisible: boolean = false;
  public person: any;
  public salesemployee: any;
  public step3_data_final = [];
  public document_date = '';
  public iLogID: any = '';
  public CheckedData: any = [];
  public selectallRows: boolean = false;
  public isMultiDelete: boolean = false;
  rows: any = "";
  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public final_row_data: any;
  public final_order_status = this.language.new;
  public final_order_status_class = "text-primary";
  public final_reference_number = "";
  public final_ref_doc_entry = "";
  public ModelHeaderData = [];
  public ModelBOMDataForSecondLevel = [];
  public FeatureBOMDataForSecondLevel = [];
  public RuleOutputData = [];
  public checked: boolean = false;
  public globalConfigId: any = '';
  public description: any;
  public step0_isNextButtonVisible: boolean = false;
  public setModelDataFlag: boolean = false;
  public defaultitemflagid: any;
  public ModelLookupFlag = false
  public cDate = new Date();
  public AccessModel: any = [];
  public SelectedAccessory: any = [];
  public selectedAccessoryHeader: any = []
  public selectedAccessoryBOM: any = []
  public menu_auth_index = '205';
  public made_changes: boolean = false;

  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;
  public min;
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

  canDeactivate() {
    if (this.made_changes == true) {
      return this.DialogService.confirm('');
    } else {
      return true;
    }
  }

  ngOnInit() {
    console.log("init in");
    //  this.router_link_new_config = "/output/view/" + Math.round(Math.random() * 10000);
    //this.step1_data.posting_date = (cDate.getMonth() + 1) + "/" + cDate.getDate() + "/" + cDate.getFullYear();
    const element = document.getElementsByTagName('body')[0];
    // // element.className = '';
    this.detectDevice();
    // element.classList.add('sidebar-toggled');
    // document.getElementById("opti_sidebar").classList.add('toggled');
    let d = new Date();
    this.min = new Date(d.setDate(d.getDate() - 1));
    this.submit_date = (this.currentDate.getFullYear()) + '/' + (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getDate();
    // this.step1_data.delivery_until = new Date((this.currentDate.getFullYear()) + '/' + (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getDate());
    this.commonData.checkSession();
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
    this.doctype = this.commonData.document_type();
    // this.step1_data.document = "sales_quote";
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.SalesQuote;
    }
    else if (this.step1_data.document == "sales_order") {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = this.language.SalesOrder;
    }
    else {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.draft;
    }

    this.feature_accessory_list = []
    this.step2_data.quantity = parseFloat("1");
    this._el.nativeElement.focus();
    var todaysDate = new Date();
    //var mindate =new Date(todaysDate) ;

    this.isNextButtonVisible = false;

    // dummy data for 2nd screen 
    this.tree_data_json = [];
    this.step1_data.print_operation = "";
    // check screen authorisation - start

    this.check_authorisation()
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async check_authorisation() {
    await this.sleep(1200);
    this.CommonService.getMenuRecord().subscribe(
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
  }


  enlage_image(image) {
    this.lookupfor = 'large_image_view';
    this.selectedImage = image;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }


  start_new_configuration_click() {
    this.clear_all_screen_data()
    this.onOperationChange('');
    $("fieldset").hide();
    $("fieldset:first").show();
  }

  clear_all_screen_data() {
    this.lookupfor = "";
    $("select[name='print_operation_type']").val("");
    this.serviceData = [];
    this.step1_data.print_operation = "";
    this.serviceData.ref_doc_details = [];
    this.serviceData.product_grand_details = [];
    this.serviceData.print_types = [];
    this.final_order_status = "";
    this.final_document_number = "";
    this.final_ref_doc_entry = "";
    this.iLogID = "";
    this.new_item_list = [];
    this.onclearselection(1)
    this.delete_all_row_data();
    this.step3_data_final = [];
    this.step4_final_prod_total = 0;
    this.step4_final_acc_total = 0;
    this.step4_final_grand_total = 0;
    this.prod_discount_log = 0;
    this.access_dis_amount_log = 0;
    this.step3_feature_price_bef_dis = 0;
    this.step3_acc_price_bef_dis = 0;

  }

  onOperationChange(operation_type) {
    this.made_changes = true;
    this.step1_data = [];
    /* const inpueElem = document.getElementById('description');
    inpueElem.focus();     */
    this.iLogID = '';
    let cDate = new Date();
    this.step1_data.posting_date = (cDate.getMonth() + 1) + "/" + cDate.getDate() + "/" + cDate.getFullYear();
    this.contact_persons = [];
    this.ship_to = [];
    this.bill_to = [];
    this.sales_employee = [];
    this.owner_list = [];
    this.step1_data.selected_configuration_key = "";
    this.step1_data.description = "";
    this.new_output_config = false;
    this.clear_all_screen_data();
    this.modify_duplicate_selected = false;
    this.step3_data_final = [];
    this.step4_final_prod_total = 0;
    this.step4_final_acc_total = 0;
    this.step4_final_grand_total = 0;
    this.prod_discount_log = 0;
    this.access_dis_amount_log = 0;
    this.step3_feature_price_bef_dis = 0;
    this.step3_acc_price_bef_dis = 0;
    this.clear_all_screen_data();
    if (operation_type == 2 || operation_type == 3 || operation_type == 4) {
      this.modify_duplicate_selected = true;
      this.new_output_config = true;
      this.step0_isNextButtonVisible = true;
    } else {
      if (operation_type == "") {
        this.new_output_config = false;
        this.step0_isNextButtonVisible = false;
      } else {
        this.new_output_config = true;
        this.step0_isNextButtonVisible = true;
        this.step1_data.document = 'draft';
        this.step1_data.document_name = this.language.draft;
        this.isNextButtonVisible = true;
      }

      this.modify_duplicate_selected = false;
    }
    if (this.text_input_elem != undefined) {
      this.text_input_elem.nativeElement.focus();
    }
    setTimeout(function () {
      $(document).find("#description").focus();
    }, 10);
    this.step1_data.main_operation_type = operation_type;
  }

  on_configuration_id_change(value) {
    this.made_changes = true;
    this.globalConfigId = value;
  }

  onStep0NextPress() {
    this.made_changes = true;
    this.CommonService.GetServerDate().subscribe(
      data => {
        if (data.length > 0) {
          if (data[0].DATEANDTIME != null) {
            let server_date_time = new Date(data[0].DATEANDTIME);
            this.step1_data.posting_date = (server_date_time.getMonth() + 1) + "/" + server_date_time.getDate() + "/" + server_date_time.getFullYear();
            //this.step1_data.delivery_until = new Date((server_date_time.getMonth() + 1) + "/" + server_date_time.getDate() + "/" + server_date_time.getFullYear());
            //  console.log(this.step1_data.delivery_until);
          }
        }
        else {
          this.step1_data.posting_date = (this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear();
          // this.step1_data.delivery_until = new Date((this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear());
          //  console.log(this.step1_data.delivery_until);
          this.toastr.error('', this.language.ServerDateError, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.step1_data.posting_date = (this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear();
        //  this.step1_data.delivery_until = new Date((this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear());
        //  console.log(this.step1_data.delivery_until);
        this.showLookupLoader = false;
      }
    )

    if (this.step1_data.main_operation_type == 1) {
      if (this.step1_data.description == "" || this.step1_data.description == undefined) {
        this.toastr.error('', this.language.description_blank, this.commonData.toast_config);
        return;
      }
      this.setModelDataFlag = false;
      // this.onclearselection(1);

    }
    if (this.step1_data.main_operation_type == 2 || this.step1_data.main_operation_type == 3 || this.step1_data.main_operation_type == 4) {
      if (this.step1_data.selected_configuration_key == "") {
        this.toastr.error('', this.language.select_configuration, this.commonData.toast_config);
        return;
      }

      if (this.step1_data.description == "" || this.step1_data.description == undefined) {
        this.toastr.error('', this.language.description_blank, this.commonData.toast_config);
        return;
      }
    }
    $("#step0_next_click_id").trigger('click');
    this.showPrintOptions = true;
  }
  previousButtonPress() {
    this.clear_all_screen_data()
    this.onOperationChange('');

    this.isPreviousPressed = true;
    this.showPrintOptions = false;

  }
  onSavePress() {
    // this.onValidateNextPress();
    if (this.step3_data_final.length == 0) {
      var this_obj = this;
      this.add_fg_multiple_model(function () {
        this_obj.onFinishPress("step1_data", "savePress");
      });
    } else {

      this.onFinishPress("step1_data", "savePress");
    }

  }

  open_config_lookup() {
    this.made_changes = true;
    this.serviceData = []
    this.showLookupLoader = true;
    this.lookupfor = 'configure_list_lookup';
    this.OutputService.getConfigurationList(this.step1_data.main_operation_type).subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          this.showLookupLoader = false;

          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.showLookupLoader = false;
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
      }
    )
  }

  getAllDetails(operationType, logid, description) {
    this.OutputService.GetAllOutputData(operationType, logid, description).subscribe(
      data => {

        if (data != undefined && data.length > 0) {
          // test
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
        }

        if (data.CustomerOutput.length > 0) {

          if (data.CustomerOutput[0].OPTM_DOCTYPE == "23") {
            this.step1_data.document = "sales_quote";
            this.step1_data.document_name = this.language.SalesQuote;
          } else if (data.CustomerOutput[0].OPTM_DOCTYPE == "17") {
            this.step1_data.document = "sales_order";
            this.step1_data.document_name = this.language.SalesOrder;
          } else if (data.CustomerOutput[0].OPTM_DOCTYPE == "30") {
            this.step1_data.document = 'draft';
            this.step1_data.document_name = this.language.draft;
          }


          this.final_reference_number = data.CustomerOutput[0].LogRefDocNo;
          this.final_ref_doc_entry = data.CustomerOutput[0].LogRefDocEntry;
          this.final_document_number = data.CustomerOutput[0].LogRefDocNo;
          this.step1_data.customer = data.CustomerOutput[0].OPTM_BPCODE;
          var objs_this = this;
          this.getCustomerAllInfo(function () {

            setTimeout(function () {
              objs_this.step1_data.delivery_until = "";

              /* if (data.CustomerOutput[0].OPTM_DELIVERYDATE !== null && data.CustomerOutput[0].OPTM_DELIVERYDATE !== "") {
                let temp_date = new Date(data.CustomerOutput[0].OPTM_DELIVERYDATE)
                objs_this.step1_data.delivery_until = new Date((temp_date.getFullYear()) + '/' + (temp_date.getMonth() + 1) + '/' + temp_date.getDate());
              } */
              objs_this.step1_data.customer_name = '';
              objs_this.step1_data.person_name = '';
              objs_this.step1_data.bill_to = "";
              objs_this.step1_data.bill_to_address = "";
              objs_this.step1_data.ship_to = "";
              objs_this.step1_data.ship_to_address = "";
              objs_this.step1_data.sales_employee = "";
              objs_this.step1_data.owner = "";
              objs_this.step1_data.remark = "";
              /* objs_this.contact_persons.push({
                 Name: data.CustomerOutput[0].OPTM_CONTACTPERSON
               });*/
              objs_this.step1_data.customer_name = data.CustomerOutput[0].Name;
              objs_this.step1_data.person_name = data.CustomerOutput[0].OPTM_CONTACTPERSON;
              /*objs_this.bill_to.push({
                BillToDef: data.CustomerOutput[0].OPTM_BILLTO,
              });*/
              objs_this.step1_data.bill_to = data.CustomerOutput[0].OPTM_BILLTO;
              objs_this.step1_data.bill_to_address = data.CustomerOutput[0].OPTM_BILLADD;
              /* objs_this.ship_to.push({
                 ShipToDef: data.CustomerOutput[0].OPTM_SHIPTO,
               });*/
              objs_this.step1_data.ship_to = data.CustomerOutput[0].OPTM_SHIPTO;
              objs_this.step1_data.ship_to_address = data.CustomerOutput[0].OPTM_SHIPADD;
              /* objs_this.sales_employee.push({
                 SlpName: data.CustomerOutput[0].OPTM_SALESEMP,
               });*/
              objs_this.step1_data.sales_employee = data.CustomerOutput[0].OPTM_SALESEMP;
              /* objs_this.owner_list.push({
                 lastName: data.CustomerOutput[0].OPTM_OWNER,
               });*/

              objs_this.step1_data.owner = data.CustomerOutput[0].OPTM_OWNER

              objs_this.step1_data.remark = data.CustomerOutput[0].OPTM_REMARKS

              // objs_ this.feature_discount_percent = data.CustomerOutput[0].OPTM_TOTALDISCOUNT
              objs_this.discount_price = data.CustomerOutput[0].OPTM_PRODDISCOUNT
              objs_this.feature_discount_percent = data.CustomerOutput[0].OPTM_PRODDISCOUNT
              objs_this.accessory_discount_percent = data.CustomerOutput[0].OPTM_ACCESSORYDIS
            }, 1000);
          })

          this.getSavedModelDatabyModelCodeAndId(data);
        }
        this.isNextButtonVisible = true;
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )
  }

  getSavedModelDatabyModelCodeAndId(saveddata) {
    if (saveddata.ModelBOMData.length > 0) {
      let AllDataForModelBomOutput: any = {};
      AllDataForModelBomOutput.modelinputdatalookup = [];
      AllDataForModelBomOutput.getmodelsavedata = [];
      AllDataForModelBomOutput.apidata = [];

      AllDataForModelBomOutput.modelinputdatalookup.push({
        CompanyDBID: this.common_output_data.companyName,
        currentDate: this.submit_date
      });

      AllDataForModelBomOutput.apidata.push({
        conf_id: this.iLogID,
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser")
      });

      console.log(saveddata.ModelBOMData);
      AllDataForModelBomOutput.getmodelsavedata = saveddata.ModelBOMData.filter(function (obj) {
        obj['OPTM_DISCPERCENT'] = parseFloat(obj['OPTM_DISCPERCENT']).toFixed(3)
        obj['OPTM_UNITPRICE'] = parseFloat(obj['OPTM_UNITPRICE']).toFixed(3)
        obj['OPTM_TOTALPRICE'] = parseFloat(obj['OPTM_TOTALPRICE']).toFixed(3)
        obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY']).toFixed(3)
        return obj;
      });
      this.showLookupLoader = true;
      this.OutputService.GetSavedDataMultiModel(AllDataForModelBomOutput).subscribe(
        data => {
          if (data != null && data != undefined) {
            if (data.length > 0) {
              if (data != undefined) {
                if (data[0].ErrorMsg == "7001") {
                  this.made_changes = false;
                  this.showLookupLoader = false;
                  this.CommonService.RemoveLoggedInUser().subscribe();
                  this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
                  return;
                }
              }

              this.setModelDataFlag = true;
              for (var isavedmultimodel in data) {
                this.onclearselection(1);
                this.step2_data.quantity = parseFloat(data[isavedmultimodel].AddedModelHeaderData[0].quantity);
                this.step2_data.model_id = data[isavedmultimodel].AddedModelHeaderData[0].ModelID
                this.step2_data.model_code = data[isavedmultimodel].AddedModelHeaderData[0].OPTM_FEATURECODE
                this.step2_data.model_name = data[isavedmultimodel].AddedModelHeaderData[0].ModelDisplayName
                this.step2_data.templateid = data[isavedmultimodel].AddedModelHeaderData[0].OPTM_MODELTEMPLATEITEM
                this.step2_data.itemcodegenkey = data[isavedmultimodel].AddedModelHeaderData[0].OPTM_ITEMCODEGENREF
                this.GetAllDataForSavedMultiModelBomOutput(data[isavedmultimodel], saveddata);
                if (this.isDuplicate) {
                  this.step3_data_final = [];
                  this.add_fg_multiple_model("");
                } else {
                  this.add_fg_multiple_model("");
                }
                this.showLookupLoader = false;
              }
              if (this.step1_data.main_operation_type == "3") {
                this.iLogID = "";
              }
              console.log("this.step3_data_final");
              console.log(this.step3_data_final);
            } else {
              this.showLookupLoader = false;
            }
          }
          else {
            if (this.step1_data.main_operation_type == "3") {
              this.iLogID = "";
            }
            this.showLookupLoader = false;
          }

        }, error => {
          if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
            this.CommonService.isUnauthorized();
          }
          if (this.step1_data.main_operation_type == "3") {
            this.iLogID = "";
          }
          this.showLookupLoader = false;
        })
    }
  }

  GetAllDataForSavedMultiModelBomOutput(data, saveddata) {
    // This function returns all data for Multi Model in Modify Existing/Duplicate/View Operation. 
    this.showLookupLoader = true;
    if (data != null && data != undefined) {
      if (data.DeafultWarehouse !== undefined && data.DeafultWarehouse[0] !== undefined) {
        if (data.DeafultWarehouse[0].DEFAULTWAREHOUSE !== undefined) {
          this.warehouse = data.DeafultWarehouse[0].DEFAULTWAREHOUSE;
        }
      }

      data.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
        obj['OPTM_LEVEL'] = 0;
        return data.ModelHeaderData
      })

      data.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
        if (obj['OPTM_MAXSELECTABLE'] > 1) {
          obj['element_type'] = "checkbox"
          obj['element_class'] = "custom-control custom-checkbox"
        }
        return data.ModelHeaderData
      })

      data.FeatureBOMDataForSecondLevel = data.FeatureBOMDataForSecondLevel.filter(function (obj) {
        obj['OPTM_LEVEL'] = 1
        return obj; // data.FeatureBOMDataForSecondLevel
      })
      data.FeatureBOMDataForSecondLevel.filter(function (obj) {
        if (obj.isRuleApplied == "True") {
          obj['isRuleApplied'] = true
        } else if (obj.isRuleApplied == "False") {
          obj['isRuleApplied'] = false
        }
        if (obj.isSecondIteration == "True") {
          obj['isSecondIteration'] = true
        } else if (obj.isSecondIteration == "False") {
          obj['isSecondIteration'] = false
        }
        if (obj.isManuallyChecked == "True") {
          obj['isManuallyChecked'] = true
        } else if (obj.isManuallyChecked == "False") {
          obj['isManuallyChecked'] = false
        }
      })


      data.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
        obj['OPTM_LEVEL'] = 2
        return obj; // data.ModelBOMDataForSecondLevel
      })

      data.ModelBOMDataForSecondLevel.filter(function (obj) {
        if (obj.isRuleApplied == "True") {
          obj['isRuleApplied'] = true
        } else if (obj.isRuleApplied == "False") {
          obj['isRuleApplied'] = false
        }
        if (obj.isSecondIteration == "True") {
          obj['isSecondIteration'] = true
        } else if (obj.isSecondIteration == "False") {
          obj['isSecondIteration'] = false
        }
        if (obj.isManuallyChecked == "True") {
          obj['isManuallyChecked'] = true
        } else if (obj.isManuallyChecked == "False") {
          obj['isManuallyChecked'] = false
        }
      })

      data.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
        if (obj['checked'] == "True" || obj['checked'] == "true") {
          obj['checked'] = true;
        } else {
          obj['checked'] = false;
        }
        return obj; // data.ModelBOMDataForSecondLevel
      })

      data.ObjFeatureItemDataWithDfaultY = data.ObjFeatureItemDataWithDfaultY.filter(function (obj) {
        obj['OPTM_LEVEL'] = 1;
        return obj// data.ObjFeatureItemDataWithDfaultY
      })

      for (var i in data.FeatureBOMDataForSecondLevel) {
        if (data.FeatureBOMDataForSecondLevel[i].checked == "True") {
          data.FeatureBOMDataForSecondLevel[i].checked = true
        }
        else {
          data.FeatureBOMDataForSecondLevel[i].checked = false
        }
        if (data.FeatureBOMDataForSecondLevel[i].disable == "False") {
          data.FeatureBOMDataForSecondLevel[i].disable = false
        } else if (data.FeatureBOMDataForSecondLevel[i].disable == "True") {
          data.FeatureBOMDataForSecondLevel[i].disable = true
        }
        if (data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != "" && data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != null && data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != undefined) {
          data.FeatureBOMDataForSecondLevel[i].IMAGEPATH = this.commonData.get_current_url() + data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT
        }
      }

      for (var i in data.ModelBOMDataForSecondLevel) {
        if (data.ModelBOMDataForSecondLevel[i].IMAGEPATH != "" && data.ModelBOMDataForSecondLevel[i].IMAGEPATH != null && data.ModelBOMDataForSecondLevel[i].IMAGEPATH != undefined) {
          data.ModelBOMDataForSecondLevel[i].IMAGEPATH = this.commonData.get_current_url() + data.ModelBOMDataForSecondLevel[i].IMAGEPATH
        }
        if (data.ModelBOMDataForSecondLevel[i].disable == "False") {
          data.ModelBOMDataForSecondLevel[i].disable = false
        } else if (data.ModelBOMDataForSecondLevel[i].disable == "True") {
          data.ModelBOMDataForSecondLevel[i].disable = true
        }
      }
      this.MainModelDetails = data.MainModelDetails
      this.RuleOutputData = data.RuleOutputData;

      this.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
        return obj['ACCESSORY'] != "Y" && obj['OPTM_TYPE'] != "2"
      })

      this.ModelHeaderItemsArray = data.ModelHeaderData.filter(function (obj) {
        return obj['OPTM_TYPE'] == "2"
      })
      // this.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel
      this.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
        return obj['ACCESSORY'] != "Y"
      });
      this.FeatureBOMDataForSecondLevel = data.FeatureBOMDataForSecondLevel.filter(function (obj) {
        return obj['ACCESSORY'] != "Y"
      });
      this.Accessoryarray = [];
      this.Accessoryarray = data.ModelHeaderData.filter(function (obj) {
        return obj['ACCESSORY'] == "Y";
      });
      /*this.getAccessoryData(this.Accessoryarray)*/
      this.AccessModel = [];
      this.AccessModel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
        return obj['ACCESSORY'] == "Y";
      });

      if (data.SelectedAccessoryHDR !== undefined) {
        if (data.SelectedAccessoryHDR.length > 0) {

          this.selectedAccessoryHeader = data.SelectedAccessoryHDR;
          this.getAccessoryData(this.selectedAccessoryHeader);

          this.selectedAccessoryBOM = data.SelectedAccessoryBOM;

          this.selectedAccessoryBOM = this.selectedAccessoryBOM.filter(function (obj) {
            if (obj.Checked == 'True') {
              obj.Checked = true;
              obj.checked = true;
            } else {
              obj.Checked = false;
              obj.checked = false;
            }
            return obj;
          });
          this.SelectedAccessory = data.SelectedAccessory;
        }
      }

      if (this.Accessoryarray.length == 0 && this.AccessModel.length > 0) {
        this.Accessoryarray = this.AccessModel
      }

      var ModelArray = [];
      ModelArray = data.ModelHeaderData.filter(function (obj) {
        return obj['OPTM_TYPE'] == "3"
      });


      /* this.setModelDataInGrid(ModelArray, this.ModelBOMDataForSecondLevel); */
      this.setModelDataInGridForSavedData(ModelArray, this.ModelBOMDataForSecondLevel, data.Savedgetmodelsavedata);

      this.setModelItemsDataInGrid(this.ModelHeaderItemsArray)

      this.getDefaultItems(data.ObjFeatureItemDataWithDfaultY);

      this.RuleIntegration(data.RuleOutputData, true, "")


      this.ModelLookupFlag = true

      this.ModelHeaderData = this.ModelHeaderData.sort((a, b) => a.OPTM_LINENO - b.OPTM_LINENO)

      if (this.setModelDataFlag == true) {
        var temp_obj = this;
        /*  var feature_discount_data = saveddata.ModelBOMData.filter(function (obj) {
            if (obj['OPTM_ITEMTYPE'] == 2) {
              return obj
            }
          });
  
          var accessory_discount_data = saveddata.ModelBOMData.filter(function (obj) {
            if (obj['OPTM_ITEMTYPE'] == 3) {
              return obj
            }
          });*/
        var feature_discount_data = data.Savedgetmodelsavedata.filter(function (obj) {
          if (obj['OPTM_ITEMTYPE'] == 2) {
            return obj
          }
        });

        var accessory_discount_data = data.Savedgetmodelsavedata.filter(function (obj) {
          if (obj['OPTM_ITEMTYPE'] == 3) {
            return obj
          }
        });


        if (feature_discount_data.length > 0 && feature_discount_data != null && feature_discount_data != undefined) {
          this.feature_discount_percent = feature_discount_data[0]['OPTM_DISCPERCENT'];
        }

        if (accessory_discount_data.length > 0 && accessory_discount_data != null && accessory_discount_data != undefined) {
          this.accessory_discount_percent = accessory_discount_data[0]['OPTM_DISCPERCENT'];
        }

        /*this.setModelDataInOutputBom(data.Savedgetmodelsavedata,this.SelectedAccessory, data.ModelHeaderData,this.selectedAccessoryHeader);*/
        var Modelfeaturesaveditems = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['checked'] == true && obj['OPTM_TYPE'] == 2
        })

        if (Modelfeaturesaveditems.length > 0) {
          this.SetModelFeatureSavedItems(Modelfeaturesaveditems, data.Savedgetmodelsavedata);
        }

        if (this.selectedAccessoryHeader.length > 0) {
          for (let acchdr_i = 0; acchdr_i < this.selectedAccessoryHeader.length; acchdr_i++) {
            console.log("data.Savedgetmodelsavedata ", data.Savedgetmodelsavedata);
            this.setItemDataForFeatureAccessory(this.SelectedAccessory, this.selectedAccessoryHeader[acchdr_i], '', data.Savedgetmodelsavedata);
          }
        }
      }
      this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
      this.showLookupLoader = false;
    }
    else {
      this.showLookupLoader = false;
      this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      return;
    }

  }

  openFeatureLookUp() {
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.OutputService.getFeatureList(this.step2_data.model_id).subscribe(
      data => {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )
  }



  openCustomerLookUp() {
    this.showLookupLoader = true;
    this.serviceData = [];
    this.OutputService.getCustomerLookupData(this.common_output_data.companyName).subscribe(
      data => {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }

          this.lookupfor = 'output_customer';
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.showLookupLoader = false;
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )

  }

  onContactPersonChange(contact) {
    this.person = contact;
    this.step1_data.person_name = this.person;
  }

  openModalList() {
    this.showLookupLoader = true;
    this.serviceData = []
    this.setModelDataFlag = false;
    this.OutputService.GetModelList().subscribe(
      data => {

        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }

          this.lookupfor = 'ModelBomForWizard_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.showLookupLoader = false;
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )
  }

  onSalesPersonChange(selectedSalesEmp) {
    this.salesemployee = selectedSalesEmp;
    this.step1_data.sales_employee = selectedSalesEmp;
  }


  getLookupValue($event) {
    if (this.lookupfor == 'ModelBomForWizard_lookup') {
      this.onclearselection(1);
      this.step2_data.model_id = $event[0];
      this.step2_data.model_code = $event[1];
      this.step2_data.model_name = $event[2];
      this.step2_data.templateid = $event[4];
      this.step2_data.itemcodegenkey = $event[3];
      this.isModelVisible = true
      this.navigatenextbtn = false;
      this.validnextbtn = true;
      this.getSavedModelData = [];
      // this.GetDataForModelBomOutput();
      this.GetAllDataForModelBomOutput(this.getSavedModelData);
    }
    else if (this.lookupfor == 'Price_lookup') {
      // this.getPriceDetails($event[0], "Header", this.currentrowindex);
    }
    else if (this.lookupfor == 'rule_section_lookup') {
      // this.rule_data = $event;
    }
    else if (this.lookupfor == 'Item_Detail_lookup') {
      this.serviceData = []
    }
    else if (this.lookupfor == 'output_customer') {
      this.step1_data.customer = $event[0];
      this.step1_data.customer_name = $event[1];

      if (this.step1_data.customer != undefined) {
        this.isNextButtonVisible = true;
        //get contact person
        this.getCustomerAllInfo("");
        // this.fillContactPerson();
        // this.fillShipTo();
        // this.fillBillTo();
        // this.fillOwners();
      }
      else {
        this.isNextButtonVisible = false;
      }
    }
    else if (this.lookupfor == 'configure_list_lookup') {

      let cDate = new Date();
      this.step1_data.posting_date = (cDate.getMonth() + 1) + "/" + cDate.getDate() + "/" + cDate.getFullYear();
      this.contact_persons = [];
      this.ship_to = [];
      this.bill_to = [];
      this.sales_employee = [];
      this.owner_list = [];
      this.step3_data_final = [];
      this.onclearselection(0);

      this.step1_data.selected_configuration_key = $event[0];
      this.step1_data.description = $event[1];
      this.iLogID = $event[0];
      this.getAllDetails(this.step1_data.main_operation_type, this.step1_data.selected_configuration_key, this.step1_data.description);
    }
    else if (this.lookupfor == 'output_invoice_print_new') {
      this.serviceData = []
      this.lookupfor = "";
    }
    // setTimeout(()=> {
    //   this.lookupfor = "";
    // }, 200)
    // this.getItemDetails($event[0]);
    if (this.isPreviousPressed) {
      this.isDuplicate = true;
    }
  }



  on_input_change(inputid, value) {
    if (inputid == "quantity") {
      if (isNaN(value) == true) {
        this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
        this.step2_data.quantity = parseFloat(this.previousquantity);
        return;
      }
      if (value == 0 || value == '' || value == null || value == undefined) {
        this.toastr.error('', this.language.blank_or_zero_not_allowed, this.commonData.toast_config);
        this.step2_data.quantity = parseFloat(this.previousquantity);
        return;
      }
      if (value < 0) {
        this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
        this.step2_data.quantity = parseFloat(this.previousquantity);
        return;
      }
      var rgexp = /^\d+$/;
      if (rgexp.test(value) == false) {
        this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
        this.step2_data.quantity = parseFloat(this.previousquantity);
        return;
      }
      else {
        //this.step2_data.quantity = value
        for (let i = 0; i < this.feature_itm_list_table.length; i++) {
          var tempfeatureid = this.feature_itm_list_table[i].FeatureId

          if (this.feature_itm_list_table[i].is_accessory == "N") {
            // if feature is non-accessory type
            var modelheaderpropagatechecked = this.ModelHeaderData.filter(function (obj) {
              if (obj['OPTM_TYPE'] == 3) {
                return obj['OPTM_CHILDMODELID'] == tempfeatureid
              } else {
                return obj['OPTM_FEATUREID'] == tempfeatureid
              }
            })
            if (modelheaderpropagatechecked.length == 0 && this.feature_itm_list_table[i].Item != "") {
              var itemkey = this.feature_itm_list_table[i].Item
              modelheaderpropagatechecked = this.ModelHeaderItemsArray.filter(function (obj) {
                return obj['OPTM_ITEMKEY'] == itemkey
              })
            }

            if (modelheaderpropagatechecked.length == 0 && this.feature_itm_list_table[i].Item != "") {
              var itemkey = this.feature_itm_list_table[i].Item
              var nodeId = this.feature_itm_list_table[i].nodeid
              modelheaderpropagatechecked = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                return obj['OPTM_ITEMKEY'] == itemkey && obj['nodeid'] == nodeId
              })
            }

            if (modelheaderpropagatechecked.length > 0) {
              if (modelheaderpropagatechecked[0].OPTM_PROPOGATEQTY == "Y") {
                if (modelheaderpropagatechecked[0].OPTM_TYPE == "1") {
                  var itemkey = this.feature_itm_list_table[i].Item
                  var featurepropagatecheck = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                    return obj['OPTM_ITEMKEY'] == itemkey
                  })
                  if (featurepropagatecheck.length > 0) {
                    if (featurepropagatecheck[0].OPTM_PROPOGATEQTY == "Y") {
                      // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                      this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
                    }
                  }
                }
                else if (modelheaderpropagatechecked[0].OPTM_TYPE == "2") {
                  if (modelheaderpropagatechecked[0].OPTM_ITEMKEY == this.feature_itm_list_table[i].Item) {
                    // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                    this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
                  }
                }
                else {
                  // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                  this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
                }

              }

            }
          }
          else {
            // if feature is accessory type
            var modelheaderpropagatechecked = this.Accessoryarray.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == tempfeatureid
            })
            if (modelheaderpropagatechecked.length > 0) {
              if (modelheaderpropagatechecked[0].OPTM_PROPOGATEQTY == "Y") {
                if (this.feature_itm_list_table[i].ispropogateqty == "Y") {
                  // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                  this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
                }

              }
            } else {
              // no accessory in main array, but accessory found in sub model 
              if (this.feature_itm_list_table[i].is_accessory == 'Y') {
                if (this.feature_itm_list_table[i].ispropogateqty == 'Y') {
                  // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                  this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
                }
              }
            }
          }

          this.feature_itm_list_table[i].pricextn = this.feature_itm_list_table[i].quantity * this.feature_itm_list_table[i].Actualprice
          this.feature_itm_list_table[i].quantity = parseFloat(this.feature_itm_list_table[i].quantity).toFixed(3)
          this.feature_itm_list_table[i].pricextn = parseFloat(this.feature_itm_list_table[i].pricextn).toFixed(3)
        }

        this.feature_price_calculate();
      }
      value = parseFloat(value);
      this.previousquantity = value
      this.step2_data.quantity = value
    }
  }

  feature_price_calculate() {
    let igrandtotal = 0;
    let iproducttotal = 0;
    let iacctotal = 0;
    let isumofpropriceitem = 0;
    let isumofaccpriceitem = 0;
    let iprotax = 0;
    let iaccotax = 0;
    let iaccdiscount = 0;
    let iprodiscount = 0;

    for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
      if (this.feature_itm_list_table[iacc].Item != null) {
        if (this.feature_itm_list_table[iacc].is_accessory == "Y") {
          isumofaccpriceitem = isumofaccpriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].Actualprice);
        }
        else {
          isumofpropriceitem = isumofpropriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].Actualprice);
        }
      }
    }
    if (isumofpropriceitem > 0) {
      iprotax = (isumofpropriceitem * this.feature_item_tax) / 100;
      iprodiscount = (isumofpropriceitem * this.feature_discount_percent) / 100
    }
    if (isumofaccpriceitem > 0) {
      iaccotax = (isumofaccpriceitem * this.acc_item_tax) / 100
      iaccdiscount = (isumofaccpriceitem * this.accessory_discount_percent) / 100
    }

    iproducttotal = Number(isumofpropriceitem + iprotax - iprodiscount);
    iacctotal = Number(isumofaccpriceitem + iaccotax - iaccdiscount);


    this.feature_total_before_discount = isumofpropriceitem + isumofaccpriceitem
    this.step3_feature_price_bef_dis = isumofpropriceitem;
    this.step3_acc_price_bef_dis = isumofaccpriceitem;
    igrandtotal = iproducttotal + iacctotal
    this.feature_item_total = iproducttotal
    this.accessory_item_total = iacctotal
    this.acc_grand_total = igrandtotal
    this.step4_final_price_calculation();
  }

   output_new_invoice(operation_type) {
      if (operation_type == "") {
        this.toastr.error('', this.language.operation_type_required, this.commonData.toast_config);
        return;
      }
      let invoice_output_data:any = {};
      // invoice_output_data.product_grand_details = [];
      invoice_output_data.header = [];
      invoice_output_data.model_details = [];
      invoice_output_data.feature = [];
      invoice_output_data.locale_obj = [];

      let description = (this.step1_data.description!= "" && this.step1_data.description!= null) ? this.step1_data.description : "";
      let document = (this.step1_data.document!= "" && this.step1_data.document!= null) ? this.step1_data.document : "";
      let document_name = (this.step1_data.document_name!= "" && this.step1_data.document_name!= null) ? this.step1_data.document_name : "";
      let main_operation_type = (this.step1_data.main_operation_type!= "" && this.step1_data.main_operation_type!= null) ? this.step1_data.main_operation_type : "";
      let posting_date = (this.step1_data.posting_date!= "" && this.step1_data.posting_date!= null) ? this.step1_data.posting_date : "";
      let customer = (this.step1_data.customer!= "" && this.step1_data.customer!= null) ? this.step1_data.customer : "";
      let ship_to = (this.step1_data.ship_to!= "" && this.step1_data.ship_to!= null) ? this.step1_data.ship_to : "";
      let ship_to_address = (this.step1_data.ship_to_address!= "" && this.step1_data.ship_to_address!= null) ? this.step1_data.ship_to_address : "";
      let bill_to = (this.step1_data.bill_to!= "" && this.step1_data.bill_to!= null) ? this.step1_data.bill_to : "";
      let bill_to_address = (this.step1_data.bill_to_address!= "" && this.step1_data.bill_to_address!= null) ? this.step1_data.bill_to_address : "";
      let person_name = (this.step1_data.person_name!= "" && this.step1_data.person_name!= null) ? this.step1_data.person_name : "";
      let sales_employee = (this.step1_data.sales_employee!= "" && this.step1_data.sales_employee!= null) ? this.step1_data.sales_employee : "";
      let owner = (this.step1_data.owner!= "" && this.step1_data.owner!= null) ? this.step1_data.owner : "";
      let remark = (this.step1_data.remark!= "" && this.step1_data.remark!= null) ? this.step1_data.remark : "";
      let delivery_until = (this.step1_data.delivery_until!= "" && this.step1_data.delivery_until!= null) ? this.step1_data.delivery_until : "";
      

      //pushing all customer data
      invoice_output_data.header = [{
        "selected_print_type": operation_type,
        "ref_doc_no": this.final_reference_number,
        "ref_doc_entry": this.final_ref_doc_entry,
        "conf_id": this.iLogID,
        "conf_desc": description,
        "logo_path" : "",
        "company_name": "",
        "company_address" :"",
        "step4_final_prod_total": this.step4_final_prod_total,
        "step4_final_acc_total": this.step4_final_acc_total,
        "step4_final_grand_total": this.step4_final_grand_total,
        "prod_discount_log": this.prod_discount_log,
        "access_dis_amount_log": this.access_dis_amount_log,
        "description": description,
        "document": document,
        "document_name": document_name,
        "main_operation_type": main_operation_type,
        "posting_date": posting_date,
        "customer": customer,
        "ship_to": ship_to,
        "ship_to_address": ship_to_address,
        "bill_to": bill_to,
        "bill_to_address": bill_to_address,
        "contact_person" : person_name,
        "sales_employee": sales_employee,
        "owner": owner,
        "remark": remark,
        "ship_date": delivery_until,
        "ship_date_anticipated": delivery_until,
        "currency": this.defaultCurrency,
        "CompanyDBID": this.common_output_data.companyName,
        "GUID": sessionStorage.getItem("GUID"),
        "UsernameForLic": sessionStorage.getItem("loggedInUser")
      }];

      // language variables 
      invoice_output_data.locale_obj.push({
        "SalesQuote": this.language.SalesQuote,
        "SalesOrder": this.language.SalesOrder,
        "order_type": this.language.order_type,
        "ref_doc_no": this.language.ref_doc_no,
        "ref_doc_entry": this.language.ref_doc_entry,
        "configuration_id": this.language.configuration_id,
        "description": this.language.description,
        "customer": this.language.customer,
        "contact_person": this.language.contact_person,
        "ship_to": this.language.ship_to,
        "address": this.language.address,
        "bill_to": this.language.bill_to,
        "pay_terms" : this.language.pay_terms,
        "payment_method" : this.language.payment_method,
        "posting_date" : this.language.posting_date,
        "Bom_Remarks"  : this.language.Bom_Remarks,
        "ModelBom_FeatureValue" : this.language.ModelBom_FeatureValue,
        "quantity" : this.language.quantity,
        "price" : this.language.price,
        "extension" : this.language.extension,
        "discount_per" : this.language.discount_per,
        "discounted_price" : this.language.discounted_price,
        "total": this.language.total,
        "product_total": this.language.product_total,
        "accessories_total": this.language.accessories_total,
        "prod_disc_amount": this.language.prod_disc_amount,
        "acc_disc_amount": this.language.acc_disc_amount,
        "grand_total": this.language.grand_total,
        "model": this.language.model,
        "preferences": this.language.preferences,
        "ship_date": this.language.ship_date,
        "ship_date_anticipated": this.language.ship_date_anticipated,
        "item_code":this.language.item_code,
      });

   
      //pushing all final data selected detail - start
      if(this.step3_data_final.length > 0){
        for (let me_d_v_i = 0; me_d_v_i < this.step3_data_final.length; me_d_v_i++) {
          let me_d_v_row = this.step3_data_final[me_d_v_i];
          let super_model_key = this.commonData.random_string(100);
          if (me_d_v_row.feature != null && me_d_v_row.feature != undefined && me_d_v_row.feature != "") {
            let model_feature_array = me_d_v_row.feature;

            for (let mhia_i = 0; mhia_i < model_feature_array.length; mhia_i++) {
              model_feature_array[mhia_i]['super_model_key'] = super_model_key;
              model_feature_array[mhia_i]['ItemNumber'] = (model_feature_array[mhia_i]['ItemNumber']!= undefined && model_feature_array[mhia_i]['ItemNumber']!= null) ? (model_feature_array[mhia_i]['ItemNumber']).toString() : "";
              model_feature_array[mhia_i]['ModelId'] = (model_feature_array[mhia_i]['ModelId']!= undefined && model_feature_array[mhia_i]['ModelId']!= null) ? (model_feature_array[mhia_i]['ItemNumber']).toString() : "";
              
              invoice_output_data.feature.push(model_feature_array[mhia_i]);
            }
          }

          invoice_output_data.model_details.push({
            "accesory_final_price": me_d_v_row.accesory_final_price,
            "accessory_discount_amount": me_d_v_row.accessory_discount_amount,
            "accessory_discount_percent": me_d_v_row.accessory_discount_percent,
            "accessory_item_total": me_d_v_row.accessory_item_total,
            "accessory_total_before_dis": me_d_v_row.accessory_total_before_dis,
            "desc": me_d_v_row.desc,
            "discount_amount": me_d_v_row.discount_amount,
            "discounted_price": me_d_v_row.discounted_price,
            "feature_discount_percent": me_d_v_row.feature_discount_percent,
            "itemcodegenkey": me_d_v_row.itemcodegenkey,
            "model_id": me_d_v_row.model_id,
            "price": me_d_v_row.price,
            "price_ext": me_d_v_row.price_ext,
            "quantity": me_d_v_row.quantity,
            "rowIndex": me_d_v_row.rowIndex,
            "templateid": me_d_v_row.templateid,
            "super_model_key": super_model_key,
          });
        }
      }

      //pushing all final data selected detail - end
     
      // api calling 
      this.showLookupLoader = true;
      this.OutputService.getPrintOnReportStatus(invoice_output_data).subscribe(
        data => {
          this.showLookupLoader = false;
          if (data != null || data != undefined) {
            if (data.length > 0) {
              console.log("data ", data);
              this.serviceData = data[0]['Base64String'];
              this.lookupfor = 'output_invoice_print_new';
             
           }
          }  
        },
        error => {
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.CommonService.isUnauthorized();
          } else {
            this.toastr.error('', this.language.FailedToReadCurrency, this.commonData.toast_config);
          }
        }
        )
      console.log("verify ", invoice_output_data);
    }

  output_invvoice_print_lookup(operation_type) {
    if (operation_type == "") {
      this.toastr.error('', this.language.operation_type_required, this.commonData.toast_config);
      return;
    }
    this.serviceData = [];
    this.serviceData.ref_doc_details = [];
    this.serviceData.product_grand_details = [];
    this.serviceData.print_types = [];
    this.serviceData.customer_and_doc_details = [];

    //pushing print types
    this.serviceData.print_types.push({
      "selected_print_type": operation_type
    });

    //pushing all customer data
    this.serviceData.customer_and_doc_details.push(this.step1_data);


    this.serviceData.ref_doc_details.push({
      "ref_doc_no": this.final_reference_number,
      "ref_doc_entry": this.final_ref_doc_entry,
      "conf_id": this.iLogID,
      "conf_desc": this.step1_data.description
    });

    //pushing all price details
    this.serviceData.product_grand_details.push({
      "step4_final_prod_total": this.step4_final_prod_total,
      "step4_final_acc_total": this.step4_final_acc_total,
      "step4_final_grand_total": this.step4_final_grand_total,
      "prod_discount_log": this.prod_discount_log,
      "access_dis_amount_log": this.access_dis_amount_log,
    });

    //pushing all final data sel details
    this.serviceData.verify_final_data_sel_details = this.step3_data_final;

    //pushing all payement data details
    this.serviceData.payment_details = undefined;
    this.lookupfor = 'output_invoice_print';
  }



  on_feature_input_change(inputid, value, rowid, item) {
    for (let i = 0; i < this.feature_itm_list_table.length; ++i) {
      if (rowid == this.feature_itm_list_table[i].FeatureId && item == this.feature_itm_list_table[i].Item) {
        if (inputid == "quantity") {
          if (isNaN(value) == true) {
            this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = parseFloat("1").toFixed(3);
            return;
          }
          if (value < 0) {
            this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = parseFloat("1").toFixed(3);
            return;
          }
          var rgexp = /^\d+$/;
          if (rgexp.test(value) == false) {
            this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = parseFloat("1").toFixed(3);
            return;
          }

          this.feature_itm_list_table[i].quantity = parseFloat(value).toFixed(3);
          var priceextn: any = this.feature_itm_list_table[i].quantity * this.feature_itm_list_table[i].Actualprice
          this.feature_itm_list_table[i].pricextn = parseFloat(priceextn).toFixed(3);
        }
        else if (inputid == "actual_price") {
          if (isNaN(value) == true) {
            this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
            var price: any = this.feature_itm_list_table[i].pricextn / this.feature_itm_list_table[i].quantity
            this.feature_itm_list_table[i].Actualprice = parseFloat(price).toFixed(3);
            return;
          }
          if (value < 0) {
            this.toastr.error('', this.language.pricevalid, this.commonData.toast_config);
            var price: any = this.feature_itm_list_table[i].pricextn / this.feature_itm_list_table[i].quantity
            this.feature_itm_list_table[i].Actualprice = parseFloat(price).toFixed(3);
            return;
          }
          this.feature_itm_list_table[i].Actualprice = parseFloat(value).toFixed(3);
          var priceextn: any = this.feature_itm_list_table[i].quantity * this.feature_itm_list_table[i].Actualprice
          this.feature_itm_list_table[i].pricextn = parseFloat(priceextn).toFixed(3);
        }
        else {
          if (value < 0) {
            let pricextn0 = 0;
            this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
            this.feature_itm_list_table[i].pricextn = pricextn0.toFixed(3);
            return;
          }
          this.feature_itm_list_table[i].pricextn = value
        }

        this.feature_price_calculate();

      }

    }
  }

  step2_next_click_validation() {
    if (this.step1_data.document == "draft") {
      /*   this.step1_data.customer = "";
        this.step1_data.ship_to = "";
        this.step1_data.bill_to = "";
        this.step1_data.person_name = "";
        this.step1_data.delivery_date = "";
        this.step1_data.sales_employee = "";
        this.step1_data.owner = "";
        this.step1_data.remark = "",
          this.step1_data.bill_to_address = "",
          this.step1_data.ship_to_address = "", */
      // this.step1_data.posting_date="",
      $(".step_2_redirect").trigger('click');
    } else {
      let required_fields = '';
      if (this.step1_data.customer == "" || this.step1_data.customer == undefined || this.step1_data.customer == null) {
        if (required_fields != "") {
          required_fields += ',';
        }
        required_fields += this.language.customer;
      }
      if (this.step1_data.posting_date == "" || this.step1_data.posting_date == undefined || this.step1_data.posting_date == null) {
        if (required_fields != "") {
          required_fields += ',';
        }
        required_fields += this.language.posting_date;
      }

      if (this.step1_data.delivery_until == "" || this.step1_data.delivery_until == undefined || this.step1_data.delivery_until == null) {
        if (required_fields != "") {
          required_fields += ',';
        }
        required_fields += this.document_date;
      }
      if (required_fields != "") {
        this.toastr.error('', this.language.required_fields_direct + " - " + required_fields, this.commonData.toast_config);
        return false;
      } else {
        $(".step_2_redirect").trigger('click');
      }
    }
  }

  on_calculation_change(inputid, value) {
    if (value < 0) {
      this.feature_discount_percent = 0;
      this.toastr.error('', this.language.negativediscountvalid, this.commonData.toast_config);
      value = 0;
    }
    else if (value > 100) {
      this.toastr.error('', this.language.percentvalidation, this.commonData.toast_config);
      value = 0;
    }
    else if (parseFloat(value) === NaN) {
      this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
      value = 0;
    }
    if (inputid == "product_discount") {
      this.feature_discount_percent = value;
    }
    else {
      this.accessory_discount_percent = value;
    }
    this.feature_price_calculate();
  }

  onclearselection(all_clear) {
    this.serviceData = [];
    this.step2_data = [];
    this.tree_data_json = [];
    this.feature_child_data = [];
    this.feature_accessory_list = [];
    this.selectedAccessoryBOM = [];
    this.SelectedAccessory = [];
    this.feature_itm_list_table = [];
    this.feature_item_tax = 0;
    this.feature_item_total = 0;
    this.acc_item_tax = 0;
    this.accessory_item_total = 0
    this.acc_total = 0;
    this.acc_grand_total = 0;
    this.feature_tax_total[0].value = 0;
    this.feature_tax_total[1].value = 0;
    this.feature_discount_percent = 0;
    this.accessory_discount_percent = 0;
    this.step2_data.quantity = parseFloat("1");
    this._el.nativeElement.focus();
    this.ModelHeaderData = [];
    this.ModelHeaderItemsArray = [];
    this.RuleOutputData = [];
    this.ModelBOMDataForSecondLevel = [];
    this.FeatureBOMDataForSecondLevel = [];
    this.feature_total_before_discount = 0;
    this.step3_feature_price_bef_dis = 0;
    this.step3_acc_price_bef_dis = 0;
    this.previousquantity = parseFloat("1");
    this.ruleIndex = 0;
    this.isSecondIteration = false;
    this.ruleData = [];
    if (all_clear == 1) {
      this.step2_selected_model = "";
      this.step2_selected_model_id = "";
    }
    $(".accesory_check_for_second_screen").prop('checked', false);
  }

  GetAllDataForModelBomOutput(getmodelsavedata) {
    this.showLookupLoader = true;
    let AllDataForModelBomOutput: any = {};
    AllDataForModelBomOutput.modelinputdatalookup = [];
    AllDataForModelBomOutput.getmodelsavedata = [];
    //AllDataForModelBomOutput.apidata = [];

    AllDataForModelBomOutput.modelinputdatalookup.push({
      CompanyDBID: this.common_output_data.companyName,
      ModelID: this.step2_data.model_id,
      ModelDisplayName: this.step2_data.model_name,
      currentDate: this.submit_date
    })

    // AllDataForModelBomOutput.apidata.push({
    //   GUID: sessionStorage.getItem("GUID"),
    //   UsernameForLic: sessionStorage.getItem("loggedInUser")
    // })

    AllDataForModelBomOutput.getmodelsavedata = getmodelsavedata
    this.feature_itm_list_table = [];
    this.OutputService.GetDataByModelIDForFirstLevel(AllDataForModelBomOutput).subscribe(
      //this.OutputService.GetDataByModelIDForFirstLevel(this.step2_data.model_id, this.step2_data.model_name).subscribe(
      data => {
        var this_obj = this;
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
          if (data.SubModelReadyToUse !== undefined) {
            if (data.SubModelReadyToUse.length > 0) {
              if (data.SubModelReadyToUse[0].ReadyToUse !== undefined) {
                if (data.SubModelReadyToUse[0].ReadyToUse == "N") {
                  this.showLookupLoader = false;
                  this.step2_data.model_code = ""
                  this.toastr.error('', this.language.Submodelreadyforuse, this.commonData.toast_config);
                  return;
                }
              }
            }

          }

          if (data.DeafultWarehouse !== undefined && data.DeafultWarehouse[0] !== undefined) {
            if (data.DeafultWarehouse[0].DEFAULTWAREHOUSE !== undefined) {
              this.warehouse = data.DeafultWarehouse[0].DEFAULTWAREHOUSE;
            }
          }

          data.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
            obj['OPTM_LEVEL'] = 0;
            obj['random_unique_key'] = this_obj.commonData.random_string(50)
            return data.ModelHeaderData
          })

          data.FeatureBOMDataForSecondLevel = data.FeatureBOMDataForSecondLevel.filter(function (obj) {
            obj['OPTM_LEVEL'] = 1;
            obj['random_unique_key'] = this_obj.commonData.random_string(50)
            return data.FeatureBOMDataForSecondLevel
          })

          data.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            obj['OPTM_LEVEL'] = 2;
            obj['random_unique_key'] = this_obj.commonData.random_string(50),
              obj.isManuallyChecked = false
            obj.isSecondIteration = false
            obj.isRuleApplied = false
            return data.ModelBOMDataForSecondLevel
          })

          data.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            if (obj['checked'] == "True") {
              obj['checked'] = true
            }
            obj['random_unique_key'] = this_obj.commonData.random_string(50)
            return data.ModelBOMDataForSecondLevel
          })

          data.ObjFeatureItemDataWithDfaultY = data.ObjFeatureItemDataWithDfaultY.filter(function (obj) {
            obj['OPTM_LEVEL'] = 1;
            obj['random_unique_key'] = this_obj.commonData.random_string(50)
            return data.ObjFeatureItemDataWithDfaultY
          })

          for (var i in data.FeatureBOMDataForSecondLevel) {
            if (data.FeatureBOMDataForSecondLevel[i].checked == "True") {
              data.FeatureBOMDataForSecondLevel[i].checked = true
            }
            else {
              data.FeatureBOMDataForSecondLevel[i].checked = false
            }
            if (data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != "" && data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != null && data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != undefined) {
              data.FeatureBOMDataForSecondLevel[i].IMAGEPATH = this.commonData.get_current_url() + data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT
            }
          }

          for (var i in data.ModelBOMDataForSecondLevel) {
            if (data.ModelBOMDataForSecondLevel[i].IMAGEPATH != "" && data.ModelBOMDataForSecondLevel[i].IMAGEPATH != null && data.ModelBOMDataForSecondLevel[i].IMAGEPATH != undefined) {
              data.ModelBOMDataForSecondLevel[i].IMAGEPATH = this.commonData.get_current_url() + data.ModelBOMDataForSecondLevel[i].IMAGEPATH
            }
          }

          this.RuleOutputData = data.RuleOutputData;
          this.ModelBOMRules = data.ModelBOMRules;
          this.MainModelDetails = data.MainModelDetails;

          this.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
            obj['random_unique_key'] = this_obj.commonData.random_string(50)
            return obj['ACCESSORY'] != "Y" && obj['OPTM_TYPE'] != "2"
          })

          this.ModelHeaderItemsArray = data.ModelHeaderData.filter(function (obj) {
            return obj['OPTM_TYPE'] == "2"
          })
          this.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['ACCESSORY'] != "Y"
          });
          this.ModelBOMDataForSecondLevel.filter(function (obj) {
            if (obj['OPTM_MAXSELECTABLE'] > 1) {
              return obj['element_type'] = 'checkbox';
            } else {
              return obj['element_type'] = 'radio';
            }
          });
          data.FeatureBOMDataForSecondLevel.filter(function (obj) {
            if (obj['OPTM_ISMULTISELECT'] == "Y") {
              return obj['element_type'] = 'checkbox';
            } else {
              if (obj['OPTM_ISMULTISELECT'] == "" || obj['OPTM_ISMULTISELECT'] == null) {
                obj['OPTM_ISMULTISELECT'] = "N";
              }
              return obj['element_type'] = 'radio';
            }
          });

          this.FeatureBOMDataForSecondLevel = data.FeatureBOMDataForSecondLevel.filter(function (obj) {
            obj.isManuallyChecked = false
            obj.isSecondIteration = false
            obj.isRuleApplied = false
            if (obj['child_accessory'] != null && obj['child_accessory'] != "") {
              return obj['ACCESSORY'] != "Y" && obj['child_accessory'] != "Y";
            } else {
              return obj['ACCESSORY'] != "Y";
            }
          });

          this.Accessoryarray = [];
          this.Accessoryarray = data.ModelHeaderData.filter(function (obj) {
            return obj['ACCESSORY'] == "Y";
          });
          /*this.getAccessoryData(this.Accessoryarray)*/
          this.AccessModel = [];
          this.AccessModel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['ACCESSORY'] == "Y";
          });

          this.selectedAccessoryHeader = data.SelectedAccessory;

          this.getAccessoryData(this.selectedAccessoryHeader)

          this.selectedAccessoryBOM = data.SelectedAccessoryBOM

          if (this.Accessoryarray.length == 0 && this.AccessModel.length > 0) {
            this.Accessoryarray = this.AccessModel
          }
          var ModelArray = [];
          ModelArray = data.ModelHeaderData.filter(function (obj) {
            return obj['OPTM_TYPE'] == "3"
          });

          this.setModelDataInGrid(ModelArray, this.ModelBOMDataForSecondLevel);

          this.setModelItemsDataInGrid(this.ModelHeaderItemsArray)

          if (data.RuleOutputData.length > 0) {
            for (let count = 0; count < data.ObjFeatureItemDataWithDfaultY.length; count++) {
              for (let ruleDataCount = 0; ruleDataCount < data.RuleOutputData.length; ruleDataCount++) {
                if (count < 0) {
                  count = 0;
                }
                if (data.ObjFeatureItemDataWithDfaultY.length > 0) {
                  if (data.RuleOutputData[ruleDataCount].OPTM_APPLICABLEFOR == data.ObjFeatureItemDataWithDfaultY[count].OPTM_FEATUREID && data.RuleOutputData[ruleDataCount].OPTM_ITEMKEY == data.ObjFeatureItemDataWithDfaultY[count].OPTM_ITEMKEY && data.RuleOutputData[ruleDataCount].OPTM_DEFAULT == "False" && data.RuleOutputData[ruleDataCount].OPTM_ISINCLUDED == "False") {
                    data.ObjFeatureItemDataWithDfaultY.splice(count, 1);
                    count = count - 1;
                  }
                }
              }
            }
            this.getDefaultItems(data.ObjFeatureItemDataWithDfaultY);
          } else {
            this.getDefaultItems(data.ObjFeatureItemDataWithDfaultY);
          }


          this.RuleIntegration(data.RuleOutputData, true, "")

          this.ModelLookupFlag = true

          this.ModelHeaderData = this.ModelHeaderData.sort((a, b) => a.sort_key.localeCompare(b.sort_key));
          

          if (this.setModelDataFlag == true) {
            this.setModelDataInOutputBom(getmodelsavedata, "", data.ModelHeaderData, "");
            var Modelfeaturesaveditems = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
              return obj['checked'] == true && obj['OPTM_TYPE'] == 2
            })
            if (Modelfeaturesaveditems.length > 0) {
              this.SetModelFeatureSavedItems(Modelfeaturesaveditems, "");
            }
          }
          this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
          this.showLookupLoader = false;
        }
        else {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }


      },
      error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return;
      }
    );
  }

  onselectionchange(feature_model_data, value, id, isSecondLevel, unique_key) {
    // this function sets/removes data from right grid on selection/de-selection.
    let type = feature_model_data.OPTM_TYPE
    let modelid;
    let featureid;
    let parentfeatureid;
    let parentmodelid;
    let item;
    let superfeatureid;
    let propagateqtychecked = "N";
    let propagateqty = 1;
    let selectedvalue = "";
    this.ModelLookupFlag = false
    if (feature_model_data.OPTM_CHILDMODELID == undefined || feature_model_data.OPTM_CHILDMODELID == null) {
      modelid = 0
    }
    else {
      modelid = parseInt(feature_model_data.OPTM_CHILDMODELID)
    }
    if (feature_model_data.OPTM_CHILDFEATUREID == undefined || feature_model_data.OPTM_CHILDFEATUREID == null) {
      featureid = 0;
    }
    else {
      featureid = parseInt(feature_model_data.OPTM_CHILDFEATUREID)
    }
    if (feature_model_data.OPTM_ITEMKEY == undefined || feature_model_data.OPTM_ITEMKEY == null) {
      item = "";
    }
    else {
      item = feature_model_data.OPTM_ITEMKEY
    }
    if (feature_model_data.OPTM_VALUE == undefined || feature_model_data.OPTM_VALUE == null || feature_model_data.OPTM_VALUE == "") {
      selectedvalue = "";
    }
    else {
      selectedvalue = feature_model_data.OPTM_VALUE
    }
    /*if (feature_model_data.parentfeatureid == undefined || feature_model_data.parentfeatureid == null) {
      parentfeatureid = null;
    }
    else {
      parentfeatureid = feature_model_data.OPTM_FEATUREID
    }*/
    parentfeatureid = 0;
    if (feature_model_data.OPTM_FEATUREID != undefined && feature_model_data.OPTM_FEATUREID != null && feature_model_data.OPTM_FEATUREID != "") {
      parentfeatureid = feature_model_data.OPTM_FEATUREID;
    }
    else if (feature_model_data.parentfeatureid != undefined && feature_model_data.parentfeatureid != null && feature_model_data.parentfeatureid != "") {
      parentfeatureid = feature_model_data.parentfeatureid
    }

    /*if ((feature_model_data.OPTM_MODELID == undefined && feature_model_data.OPTM_MODELID == null) || (feature_model_data.parentmodelid == undefined && feature_model_data.parentmodelid == null))  {
      parentmodelid = "";
    } else {
      parentmodelid = feature_model_data.OPTM_MODELID
      if (parentmodelid != this.step2_data.model_id) {
        featureid = parentfeatureid
        feature_model_data.OPTM_CHILDFEATUREID = featureid
      }
    }*/
    parentmodelid = 0;
    if ((feature_model_data.OPTM_MODELID != undefined && feature_model_data.OPTM_MODELID != null)) {
      parentmodelid = feature_model_data.OPTM_MODELID;
      if (parentmodelid != this.step2_data.model_id) {
        featureid = parentfeatureid
        feature_model_data.OPTM_CHILDFEATUREID = featureid
      }
    } else if ((feature_model_data.parentmodelid != undefined && feature_model_data.parentmodelid != null)) {
      parentmodelid = feature_model_data.parentmodelid;
    } else {
      parentmodelid = this.step2_data.model_id;
    }

    if (feature_model_data.OPTM_CHILDFEATUREID == feature_model_data.OPTM_FEATUREID) {
      parentfeatureid = 0;
    }

    let parentarray
    if (parentmodelid != "") {
      if (parentmodelid == this.step2_data.model_id) {
        parentarray = this.ModelHeaderData.filter(function (obj) {
          return obj['unique_key'] == feature_model_data.nodeid;
          // return obj['OPTM_MODELID'] == parentmodelid && obj['unique_key'] == feature_model_data.nodeid;
        });
      }
      else {
        // mandatory changes for IIM client sub of sub model 01-10-2019
        /*  parentarray = this.ModelHeaderData.filter(function (obj) {
            return obj['parentmodelid'] == parentmodelid && obj['unique_key'] == feature_model_data.nodeid
          });*/

        parentarray = this.ModelHeaderData.filter(function (obj) {
          return obj['unique_key'] == feature_model_data.nodeid
        });

      }

      /* if(parentarray.length == 0) {
          parentarray = this.ModelHeaderData.filter(function (obj) {
           return obj['OPTM_CHILDMODELID'] == parentmodelid && obj['unique_key'] == feature_model_data.nodeid
         });
       }*/

      if (parentarray.length == 0) {
        parentarray = this.ModelHeaderData.filter(function (obj) {
          obj['unique_key'] == feature_model_data.nodeid
        });
      }

    }
    else {
      parentarray = this.ModelHeaderData.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == parentfeatureid && obj['unique_key'] == feature_model_data.nodeid;
      });
      if (parentarray.length > 0) {
        if (parentarray[0].parentmodelid != "" && parentarray[0].parentmodelid != null && parentarray[0].parentmodelid != undefined) {
          if (parentarray[0].parentmodelid != this.step2_data.model_id) {
            parentarray[0].OPTM_MODELID = parentarray[0].parentmodelid
          }
        }
        else {

          var tempparentFeatureArray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_CHILDFEATUREID'] == parentfeatureid
          });
          if (tempparentFeatureArray.length > 0) {
            parentarray[0].parentmodelid = tempparentFeatureArray[0].parentmodelid
          }
        }
      }
    }

    var parentArrayElemType = "";
    if (parentarray !== undefined && parentarray[0].element_type != undefined && parentarray[0].element_type != null && parentarray[0].element_type != "") {
      parentArrayElemType = parentarray[0].element_type;
    } else {
      parentArrayElemType = "";
    }


    if ((parentarray[0].OPTM_ISMULTISELECT == 'Y' || parentarray[0].OPTM_MAXSELECTABLE > 1) && value == true) {
      // if ( parentarray[0].OPTM_MAXSELECTABLE > 1 && value == true) {
      //  if( feature_model_data.OPTM_FEATUREID==2){
      var isExistForItemMax = [];
      var isExistForFeatureMax = [];
      var isExistForOnlyFeature = [];
      var isExistForValue = []
      var isExistForModel = [];
      var isExistFeatureInModel = [];

      if (feature_model_data.OPTM_FEATUREID != '0' && feature_model_data.OPTM_FEATUREID != "") {
        if (feature_model_data.OPTM_TYPE == 2) {
          isExistForItemMax = this.feature_itm_list_table.filter(function (obj) {
            return obj['FeatureId'] == feature_model_data.OPTM_FEATUREID && obj.nodeid == feature_model_data.nodeid;
          })
        }

        isExistForFeatureMax = this.ModelHeaderData.filter(function (obj) {
          return obj['parentfeatureid'] == feature_model_data.OPTM_FEATUREID && obj['unique_key'] == feature_model_data.nodeid
        })
      }

      isExistForValue = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == feature_model_data.OPTM_FEATUREID && obj['OPTM_TYPE'] == 3 && obj['checked'] == true && obj.nodeid == feature_model_data.nodeid;
      })

      isExistForOnlyFeature = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == feature_model_data.OPTM_FEATUREID && obj['OPTM_TYPE'] == 1 && obj['checked'] == true && obj.nodeid == feature_model_data.nodeid;
      })

      isExistForModel = this.ModelBOMDataForSecondLevel.filter(function (obj) {
        return obj['parentmodelid'] == feature_model_data.parentmodelid && obj['OPTM_TYPE'] == 3 && obj.nodeid == parentarray[0].unique_key && obj['checked'] == true
      });

      isExistFeatureInModel = this.ModelBOMDataForSecondLevel.filter(function (obj) {
        return obj['parentmodelid'] == feature_model_data.parentmodelid && obj['OPTM_TYPE'] == 1 && obj.nodeid == parentarray[0].unique_key && obj['checked'] == true
      });

      var totalSelect = isExistForItemMax.length + isExistForFeatureMax.length + isExistForValue.length + isExistForModel.length + isExistFeatureInModel.length + isExistForOnlyFeature.length;
      // var totalSelect = isExistForFeatureMax.length + isExistForValue.length + isExistForModel.length + isExistFeatureInModel.length;

      if (totalSelect == parentarray[0].OPTM_MAXSELECTABLE && feature_model_data.isRuleApplied == false) {
        this.toastr.error('', this.language.select_max_selectable, this.commonData.toast_config);
        $("#" + id).prop("checked", false)

        return;
      }
    }

    var elementtypeforcheckedfunction = parentarray[0].element_type

    if (feature_model_data.isRuleApplied == false) {
      this.checkedFunction(feature_model_data, elementtypeforcheckedfunction, value, true);
    }

    this.FeatureBOMDataForSecondLevel.filter(function (obj) {
      if (feature_model_data.nodeid == obj.nodeid && feature_model_data.unique_key == obj.unique_key) {
        obj['isManuallyChecked'] = true
      }
    })

    this.showLookupLoader = true;
    let GetDataForSelectedFeatureModelItemData: any = {};
    GetDataForSelectedFeatureModelItemData.selecteddata = [];
    GetDataForSelectedFeatureModelItemData.featurebomdata = [];
    GetDataForSelectedFeatureModelItemData.modelbomdata = [];
    GetDataForSelectedFeatureModelItemData.apidata = [];
    GetDataForSelectedFeatureModelItemData.selecteddata.push({
      type: type,
      modelid: modelid,
      featureid: featureid,
      item: item,
      checked: value,
      parentfeatureid: parentfeatureid,
      superfeatureid: feature_model_data.parentfeatureid,
      parentmodelid: parentmodelid,
      selectedvalue: selectedvalue,
      CompanyDBID: this.common_output_data.companyName,
      SuperModelId: this.step2_data.model_id,
      /* currentDate: this.step1_data.posting_date */
      currentDate: this.submit_date,
      unique_key: feature_model_data.unique_key,
      nodeid: feature_model_data.nodeid,
      // sort_key: feature_model_data.sort_key
    });

    if (GetDataForSelectedFeatureModelItemData.selecteddata[0].checked == false) {
      this.FeatureBOMDataForSecondLevel.filter(function (obj) {
        if (obj.unique_key == GetDataForSelectedFeatureModelItemData.selecteddata[0].unique_key) {
          obj['checked'] = false
        }
      })
    }


    GetDataForSelectedFeatureModelItemData.featurebomdata = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
      obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
      return obj['checked'] == true
    })

    GetDataForSelectedFeatureModelItemData.modelbomdata = this.ModelBOMDataForSecondLevel.filter(function (obj) {
      obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
      return obj['checked'] == true
    })

    GetDataForSelectedFeatureModelItemData.apidata.push({
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });

    // this.OutputService.GetDataForSelectedFeatureModelItem(type, modelid, featureid, item, parentfeatureid, parentmodelid,selectedvalue,this.FeatureBOMDataForSecondLevel).subscribe(
    var objj = this;
    this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }

          if (value == true) {
            if (data.DataForSelectedFeatureModelItem.length > 0) {
              if (parentarray[0].element_type == "radio") {

                if (parentfeatureid != "" && feature_model_data.OPTM_CHILDFEATUREID != feature_model_data.OPTM_FEATUREID) {
                  this.removefeaturesanditems(parentfeatureid)
                }
                else if (parentmodelid != "") {
                  for (let imodelheader = 0; imodelheader < this.ModelHeaderData.length; imodelheader++) {
                    if (this.ModelHeaderData[imodelheader].parentmodelid != undefined) {
                      let nodeid = feature_model_data.nodeid;
                      if (this.ModelHeaderData[imodelheader].parentmodelid == parentmodelid && this.ModelHeaderData[imodelheader].nodeid == nodeid) {
                        for (let ifeatureitemsgrid = 0; ifeatureitemsgrid < this.feature_itm_list_table.length; ifeatureitemsgrid++) {

                          /* for (let imodelbomdata = 0; imodelbomdata < this.ModelBOMDataForSecondLevel.length; imodelbomdata++) {
                              if(ifeatureitemsgrid < 0 ) {
                                ifeatureitemsgrid = 0;
                              }
                              if (this.ModelBOMDataForSecondLevel[imodelbomdata].nodeid == this.feature_itm_list_table[ifeatureitemsgrid].nodeid && this.ModelBOMDataForSecondLevel[imodelbomdata].OPTM_MODELID == parentmodelid && this.ModelBOMDataForSecondLevel[imodelbomdata].OPTM_FEATUREID != null) {
                                  this.feature_itm_list_table.splice(ifeatureitemsgrid, 1);
                                  ifeatureitemsgrid = ifeatureitemsgrid - 1;
                                }
                          } */

                          for (let ideletefeaturebomdata = 0; ideletefeaturebomdata < this.FeatureBOMDataForSecondLevel.length; ideletefeaturebomdata++) {
                            if (ifeatureitemsgrid < 0) {
                              ifeatureitemsgrid = 0;
                            }
                            if (this.feature_itm_list_table.length > 0) {
                              if (this.FeatureBOMDataForSecondLevel[ideletefeaturebomdata].nodeid == this.feature_itm_list_table[ifeatureitemsgrid].nodeid && this.FeatureBOMDataForSecondLevel[ideletefeaturebomdata].OPTM_FEATUREID != null && parentmodelid == this.feature_itm_list_table[ifeatureitemsgrid].ModelId && parentmodelid != null) {
                                this.feature_itm_list_table.splice(ifeatureitemsgrid, 1);
                                ifeatureitemsgrid = ifeatureitemsgrid - 1;
                              }
                            }

                          }

                        }

                        for (let imodeldataforsecond = 0; imodeldataforsecond < this.ModelBOMDataForSecondLevel.length; imodeldataforsecond++) {
                          if (this.ModelBOMDataForSecondLevel[imodeldataforsecond].OPTM_MODELID == this.ModelHeaderData[imodelheader].OPTM_FEATUREID) {
                            this.ModelBOMDataForSecondLevel.splice(imodeldataforsecond, 1);
                            imodeldataforsecond = imodeldataforsecond - 1;
                          }
                        }
                        for (let ideletemodeldataforfeaturesecond = 0; ideletemodeldataforfeaturesecond < this.FeatureBOMDataForSecondLevel.length; ideletemodeldataforfeaturesecond++) {
                          if (this.FeatureBOMDataForSecondLevel[ideletemodeldataforfeaturesecond].OPTM_FEATUREID == this.ModelHeaderData[imodelheader].OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ideletemodeldataforfeaturesecond].nodeid == this.ModelHeaderData[imodelheader].unique_key) {
                            this.FeatureBOMDataForSecondLevel.splice(ideletemodeldataforfeaturesecond, 1);
                            ideletemodeldataforfeaturesecond = ideletemodeldataforfeaturesecond - 1;
                          }
                        }
                        let removeFeatureId = this.ModelHeaderData[imodelheader].OPTM_FEATUREID
                        let removeModelChildId = this.ModelHeaderData[imodelheader].OPTM_CHILDMODELID
                        let removeUniqueKey = this.ModelHeaderData[imodelheader].unique_key
                        this.ModelHeaderData.splice(imodelheader, 1);
                        imodelheader = imodelheader - 1;
                        this.removemodelheaderdatatable(removeModelChildId, removeUniqueKey, removeFeatureId)

                      }
                    }
                  }
                }
              }
              if (type == 1) {
                var isExist;
                var psMaxSelect = "1"
                var psMinSelect = "1"
                var pselementclass = "custom-control custom-radio"
                var pselementtype = "radio"
                if (data.DataForSelectedFeatureModelItem.length > 0) {
                  isExist = this.ModelHeaderData.filter(function (obj) {
                    return obj['unique_key'] == feature_model_data.unique_key && obj['parentfeatureid'] == feature_model_data.OPTM_FEATUREID;
                  });

                  if (data.DataForMinMaxForFeatureId != null) {
                    if (data.DataForMinMaxForFeatureId.length > 0) {
                      if (data.DataForMinMaxForFeatureId[0].OPTM_ISMULTISELECT == "Y") {
                        psMaxSelect = data.DataForMinMaxForFeatureId[0].OPTM_MAX_SELECTABLE
                        psMinSelect = data.DataForMinMaxForFeatureId[0].OPTM_MIN_SELECTABLE
                        if (parseInt(psMaxSelect) >= 1) {
                          pselementclass = "custom-control custom-checkbox"
                          pselementtype = "checkbox"
                        }

                      }
                    }
                  }
                  if (isExist.length == 0) {
                    let is_multi_select = 'N';
                    if (feature_model_data.OPTM_ISMULTISELECT != null && feature_model_data.OPTM_ISMULTISELECT != undefined) {
                      is_multi_select = feature_model_data.OPTM_ISMULTISELECT;
                    } else {
                      is_multi_select = data.DataForMinMaxForFeatureId[0].OPTM_ISMULTISELECT;
                    }

                    this.ModelHeaderData.push({
                      ACCESSORY: feature_model_data.ACCESSORY,
                      IMAGEPATH: feature_model_data.IMAGEPATH,
                      OPTM_CHILDMODELID: feature_model_data.OPTM_CHILDMODELID,
                      OPTM_COMPANYID: feature_model_data.OPTM_COMPANYID,
                      OPTM_CREATEDATETIME: feature_model_data.OPTM_CREATEDATETIME,
                      OPTM_CREATEDBY: feature_model_data.OPTM_CREATEDBY,
                      OPTM_DISPLAYNAME: feature_model_data.OPTM_DISPLAYNAME,
                      OPTM_FEATUREID: feature_model_data.OPTM_CHILDFEATUREID,
                      OPTM_ITEMKEY: feature_model_data.OPTM_ITEMKEY,
                      OPTM_LINENO: this.ModelHeaderData.length + 1,
                      OPTM_MANDATORY: feature_model_data.OPTM_MANDATORY,
                      OPTM_ISMULTISELECT: is_multi_select,
                      OPTM_MAXSELECTABLE: psMaxSelect,
                      OPTM_MINSELECTABLE: psMinSelect,
                      OPTM_MODELID: parentarray[0].OPTM_MODELID,
                      OPTM_MODIFIEDBY: feature_model_data.OPTM_MODIFIEDBY,
                      OPTM_MODIFIEDDATETIME: String(feature_model_data.OPTM_MODIFIEDDATETIME).toString(),
                      OPTM_PRICESOURCE: feature_model_data.ListName,
                      OPTM_PROPOGATEQTY: feature_model_data.OPTM_PROPOGATEQTY,
                      OPTM_QUANTITY: parseFloat(feature_model_data.OPTM_QUANTITY).toFixed(3),
                      OPTM_TYPE: feature_model_data.OPTM_TYPE,
                      OPTM_UNIQUEIDNT: parentarray[0].OPTM_UNIQUEIDNT,
                      OPTM_UOM: parentarray[0].OPTM_UOM,
                      child_code: parentarray[0].child_code,
                      element_class: pselementclass,
                      element_type: pselementtype,
                      feature_code: feature_model_data.feature_code,
                      parentfeatureid: parentfeatureid,
                      parentmodelid: parentmodelid,
                      OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
                      is_second_level: 1,
                      nodeid: feature_model_data.nodeid,
                      unique_key: feature_model_data.unique_key,
                      random_unique_key: this.commonData.random_string(50)
                    });

                    if (parentarray[0].OPTM_PROPOGATEQTY == "Y") {
                      propagateqtychecked = "Y"
                      parentarray[0].OPTM_QUANTITY = parseFloat(parentarray[0].OPTM_QUANTITY).toFixed(3)
                      //  propagateqty = parentarray[0].OPTM_QUANTITY
                    }

                    let feature_in_model = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                      if (obj.unique_key == feature_model_data.unique_key && obj.OPTM_TYPE == 1 && obj.checked == "True") {
                        obj['checked'] = true;
                      }
                      return obj;
                    });

                  }
                  for (var i = 0; i < data.DataForSelectedFeatureModelItem.length; ++i) {
                    var isExist;
                    if (data.DataForSelectedFeatureModelItem.length > 0) {
                      if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 1) {
                        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].nodeid && obj['OPTM_TYPE'] == 1;
                        });
                      }
                      else if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 2) {
                        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_ITEMKEY'] == data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].nodeid;
                        });
                      }
                      else {
                        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_VALUE'] == data.DataForSelectedFeatureModelItem[i].OPTM_VALUE && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].nodeid;
                        });
                      }
                      let checkeddefault = false;
                      if (data.DataForSelectedFeatureModelItem[i].OPTM_DEFAULT == "Y") {
                        checkeddefault = true
                      }
                      this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                        if ((obj.OPTM_FEATUREID == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID) && (obj.nodeid == data.DataForSelectedFeatureModelItem[i].nodeid) && obj.OPTM_DEFAULT == 'Y') {
                          return obj['checked'] = true;
                        } else if ((obj.OPTM_FEATUREID == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID) && (obj.nodeid == data.DataForSelectedFeatureModelItem[i].nodeid) && obj.OPTM_DEFAULT == 'N') {
                          return obj['checked'] = false;
                        }
                      });


                      if (feature_model_data.OPTM_PROPOGATEQTY == "Y") {
                        if (data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY == "Y") {
                          data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY = parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY) * parseFloat(feature_model_data.OPTM_QUANTITY)
                          propagateqty = data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY
                        }

                      }

                      if (isExist.length == 0) {
                        // hit and try multi-select changes after a certial level
                        if (data.DataForSelectedFeatureModelItem[i].OPTM_ISMULTISELECT != undefined && data.DataForSelectedFeatureModelItem[i].OPTM_ISMULTISELECT == 'Y') {
                          var item_elementclass = "custom-control custom-checkbox";
                          var item_elementtype = "checkbox";
                        } else {
                          item_elementclass = "custom-control custom-radio"
                          item_elementtype = "radio"
                        }

                        this.FeatureBOMDataForSecondLevel.push({
                          ACCESSORY: data.DataForSelectedFeatureModelItem[i].ACCESSORY,
                          ListName: data.DataForSelectedFeatureModelItem[i].ListName,
                          IMAGEPATH: this.commonData.get_current_url() + data.DataForSelectedFeatureModelItem[i].OPTM_ATTACHMENT,
                          DocEntry: data.DataForSelectedFeatureModelItem[i].DocEntry,
                          OPTM_ATTACHMENT: data.DataForSelectedFeatureModelItem[i].OPTM_ATTACHMENT,
                          OPTM_CHILDFEATUREID: parseInt(data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID),
                          CHILD_ACCESSORY: data.DataForSelectedFeatureModelItem[i].CHILD_ACCESSORY,
                          OPTM_COMPANYID: data.DataForSelectedFeatureModelItem[i].OPTM_COMPANYID,
                          OPTM_CREATEDATETIME: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDATETIME,
                          OPTM_CREATEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDBY,
                          OPTM_DEFAULT: data.DataForSelectedFeatureModelItem[i].OPTM_DEFAULT,
                          OPTM_DISPLAYNAME: data.DataForSelectedFeatureModelItem[i].OPTM_DISPLAYNAME,
                          OPTM_FEATUREID: data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID,
                          OPTM_ISMULTISELECT: data.DataForSelectedFeatureModelItem[i].OPTM_ISMULTISELECT,
                          OPTM_ISEXCLUDED: data.DataForSelectedFeatureModelItem[i].OPTM_ISEXCLUDED,
                          OPTM_ISINCLUDED: data.DataForSelectedFeatureModelItem[i].OPTM_ISINCLUDED,
                          OPTM_MIN_SELECTABLE: data.DataForSelectedFeatureModelItem[i].OPTM_MIN_SELECTABLE,
                          OPTM_MAX_SELECTABLE: data.DataForSelectedFeatureModelItem[i].OPTM_MAX_SELECTABLE,
                          OPTM_ITEMKEY: data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY,
                          OPTM_LINENO: data.DataForSelectedFeatureModelItem[i].OPTM_LINENO,
                          OPTM_MODIFIEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDBY,
                          OPTM_MODIFIEDDATETIME: String(data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDDATETIME).toString(),
                          OPTM_PRICESOURCE: data.DataForSelectedFeatureModelItem[i].ListName,
                          OPTM_PROPOGATEQTY: data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY,
                          OPTM_QUANTITY: parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY).toFixed(3),
                          OPTM_REMARKS: data.DataForSelectedFeatureModelItem[i].OPTM_REMARKS,
                          OPTM_TYPE: data.DataForSelectedFeatureModelItem[i].OPTM_TYPE,
                          OPTM_VALUE: data.DataForSelectedFeatureModelItem[i].OPTM_VALUE,
                          feature_code: data.DataForSelectedFeatureModelItem[i].feature_code,
                          parent_code: data.DataForSelectedFeatureModelItem[i].parent_code,
                          checked: checkeddefault,
                          OPTM_LEVEL: feature_model_data.OPTM_LEVEL + 1,
                          is_second_level: 1,
                          element_class: item_elementclass,
                          element_type: item_elementtype,
                          parentfeatureid: parentfeatureid.toString(),
                          parentmodelid: parentmodelid,
                          HEADER_LINENO: this.ModelHeaderData.length + 1,
                          unique_key: data.DataForSelectedFeatureModelItem[i].unique_key,
                          nodeid: data.DataForSelectedFeatureModelItem[i].nodeid,
                          random_unique_key: this.commonData.random_string(50),
                          isManuallyChecked: false,
                          isSecondIteration: false,
                          isRuleApplied: false
                        });
                      }
                      let itemsData = [];
                      let isValue: boolean = false
                      itemsData.push(data.DataForSelectedFeatureModelItem[i])
                      if (itemsData[0].OPTM_VALUE == null || itemsData[0].OPTM_VALUE == "") {
                        isValue = false
                      } else {
                        isValue = true
                      }
                      // this.setItemDataForFeature(itemsData, parentarray, propagateqtychecked, propagateqty, parentarray[0].feature_code, parentarray[0].HEADER_LINENO,type,parentArrayElemType,isValue,feature_model_data);

                      if (checkeddefault == true) {
                        var itemData = [];
                        parentarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID && obj['unique_key'] == data.DataForSelectedFeatureModelItem[i].nodeid;
                        });
                        if (parentarray.length == 0) {
                          parentarray = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                            return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].nodeid
                          });
                          if (parentarray.length > 0) {
                            if (parentarray[0].OPTM_MAXSELECTABLE > 1) {
                              parentarray[0].element_class = "custom-control custom-checkbox"
                              parentarray[0].element_type = "checkbox"
                            }
                          }
                        }

                        if (parentarray.length == 0) {
                          parentarray = this.ModelHeaderData.filter(function (obj) {
                            if (parentfeatureid != 0) {
                              return obj['OPTM_FEATUREID'] == parentfeatureid && obj['unique_key'] == feature_model_data.nodeid;
                            } else {
                              return obj['unique_key'] == feature_model_data.nodeid;
                            }
                          });
                          if (parentarray.length > 0) {
                            if (parentarray[0].OPTM_MAXSELECTABLE > 1) {
                              parentarray[0].element_class = "custom-control custom-checkbox"
                              parentarray[0].element_type = "checkbox"
                            }
                          }
                        }

                        if (data.DataForSelectedFeatureModelItem[0].OPTM_ISMULTISELECT != undefined && data.DataForSelectedFeatureModelItem[0].OPTM_ISMULTISELECT == 'Y') {
                          parentarray[0].element_class = "custom-control custom-checkbox"
                          parentarray[0].element_type = "checkbox"
                        }

                        if (parentarray.length > 0) {
                          let uniqueIdentifier = "";
                          if (parentarray[0].OPTM_UNIQUEIDNT == undefined && parentarray[0].OPTM_UNIQUEIDNT == null) {
                            let filteredUniqueIdetifierArray = [];
                            filteredUniqueIdetifierArray = this.ModelHeaderData.filter(function (obj) {
                              return obj.nodeid == parentarray[0].nodeid;
                            })
                            if (filteredUniqueIdetifierArray.length > 0) {
                              uniqueIdentifier = filteredUniqueIdetifierArray[0].OPTM_UNIQUEIDNT
                            }
                          } else {
                            uniqueIdentifier = parentarray[0].OPTM_UNIQUEIDNT
                          }

                          if (parentarray[0].OPTM_FEATUREID == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID && data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 2 && parentarray[0].parent_code != undefined && parentarray[0].parent_code != null) {
                            parentarray[0].feature_code = parentarray[0].parent_code
                          }
                          if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 2) {
                            itemData.push(data.DataForSelectedFeatureModelItem[i])
                            if (parentarray[0].OPTM_ISMULTISELECT == "N") {
                              parentarray[0].element_type = "radio"
                            } else {
                              parentarray[0].element_type = "checkbox"
                            }

                            propagateqty = propagateqty * this.getPropagateQuantity(parentarray[0].nodeid);

                            this.setItemDataForFeature(itemData, parentarray, propagateqtychecked, propagateqty, parentarray[0].feature_code, parentarray[0].HEADER_LINENO, type, parentArrayElemType, false, feature_model_data);
                          }
                          else if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 1) {
                            isExist = this.ModelHeaderData.filter(function (obj) {
                              return obj['OPTM_FEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID && obj['unique_key'] == data.DataForSelectedFeatureModelItem[i].nodeid;
                            });

                            var psMaxSelect = "1"
                            var psMinSelect = "1"
                            var pselementclass = "custom-control custom-radio"
                            var pselementtype = "radio"

                            if (data.DataForSelectedFeatureModelItem[i].OPTM_ISMULTISELECT == "Y") {
                              psMaxSelect = data.DataForSelectedFeatureModelItem[i].OPTM_MAX_SELECTABLE
                              psMinSelect = data.DataForSelectedFeatureModelItem[i].OPTM_MIN_SELECTABLE
                              if (parseInt(psMaxSelect) >= 1) {
                                pselementclass = "custom-control custom-checkbox"
                                pselementtype = "checkbox"
                                elementtypeforcheckedfunction = "checkbox"
                              }
                            }
                            let parent_modelid = '';
                            if (parentarray[0].OPTM_MODELID == undefined) {
                              if (parentarray[0].parentmodelid == undefined) {
                                parent_modelid = this.step2_data.model_id;
                              } else {
                                parent_modelid = parentarray[0].parentmodelid;
                              }
                            } else {
                              parent_modelid = parentarray[0].OPTM_MODELID;
                            }

                            if (isExist.length == 0) {
                              let model_mandatory = "N";
                              if (data.DataForSelectedFeatureModelItem[i].OPTM_MANDATORY != undefined && data.DataForSelectedFeatureModelItem[i].OPTM_MANDATORY == "Y") {
                                model_mandatory = 'Y';
                              }

                              this.ModelHeaderData.push({
                                ACCESSORY: data.DataForSelectedFeatureModelItem[i].ACCESSORY,
                                IMAGEPATH: data.DataForSelectedFeatureModelItem[i].IMAGEPATH,
                                OPTM_CHILDMODELID: 0,
                                OPTM_COMPANYID: data.DataForSelectedFeatureModelItem[i].OPTM_COMPANYID,
                                OPTM_CREATEDATETIME: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDATETIME,
                                OPTM_CREATEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDBY,
                                OPTM_DISPLAYNAME: data.DataForSelectedFeatureModelItem[i].OPTM_DISPLAYNAME,
                                OPTM_FEATUREID: data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID,
                                OPTM_ITEMKEY: data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY,
                                OPTM_LINENO: this.ModelHeaderData.length + 1,
                                OPTM_MANDATORY: model_mandatory,
                                OPTM_ISMULTISELECT: data.DataForSelectedFeatureModelItem[i].OPTM_ISMULTISELECT,
                                OPTM_MAXSELECTABLE: psMaxSelect,
                                OPTM_MINSELECTABLE: psMinSelect,
                                OPTM_MODELID: parent_modelid,
                                OPTM_MODIFIEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDBY,
                                OPTM_MODIFIEDDATETIME: String(data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDDATETIME).toString(),
                                OPTM_PRICESOURCE: data.DataForSelectedFeatureModelItem[i].ListName,
                                OPTM_PROPOGATEQTY: data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY,
                                OPTM_QUANTITY: parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY).toFixed(3),
                                OPTM_TYPE: data.DataForSelectedFeatureModelItem[i].OPTM_TYPE,
                                OPTM_UNIQUEIDNT: uniqueIdentifier,
                                OPTM_UOM: parentarray[0].OPTM_UOM,
                                child_code: parentarray[0].child_code,
                                element_class: pselementclass,
                                element_type: pselementtype,
                                feature_code: data.DataForSelectedFeatureModelItem[i].feature_code,
                                parentfeatureid: data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID,
                                parentmodelid: parentmodelid,
                                OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
                                is_second_level: 1,
                                nodeid: data.DataForSelectedFeatureModelItem[i].nodeid,
                                unique_key: data.DataForSelectedFeatureModelItem[i].unique_key,
                                random_unique_key: this.commonData.random_string(50)
                              });

                              if (data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY == "Y") {
                                propagateqtychecked = "Y"
                                data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY = parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY).toFixed(3)
                                propagateqty = data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY
                              }

                              if (data.dtFeatureDataWithDefault.length > 0) {
                                let dtFeatureDataWithDefault = data.dtFeatureDataWithDefault.filter(function (obj) {
                                  return obj['OPTM_FEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].unique_key
                                })
                                this.console.log('dtFeatureDataWithDefault:', dtFeatureDataWithDefault);

                                this.setDtFeatureDataWithDefault(dtFeatureDataWithDefault, data.DataForSelectedFeatureModelItem[i], feature_model_data, parentmodelid, parentarray, propagateqtychecked, data, type)
                              }

                            }

                          }

                        }

                      }
                    }
                  }

                  this.defaultitemflagid = feature_model_data.OPTM_FEATUREID

                }
              }
              else if (type == 3 && feature_model_data.OPTM_VALUE == null) {

                if (data.DataForSelectedFeatureModelItem.length > 0) {
                  let model_mandatory = "N";
                  if (feature_model_data.OPTM_MANDATORY != undefined && feature_model_data.OPTM_MANDATORY == "Y") {
                    model_mandatory = 'Y';
                  }
                  this.ModelHeaderData.push({
                    ACCESSORY: feature_model_data.ACCESSORY,
                    IS_ACCESSORY: feature_model_data.IS_ACCESSORY,
                    IMAGEPATH: feature_model_data.IMAGEPATH,
                    OPTM_CHILDMODELID: feature_model_data.OPTM_CHILDMODELID,
                    ITEMCODEGENREF: feature_model_data.ITEMCODEGENREF,
                    MODELTEMPLATEITEM: feature_model_data.MODELTEMPLATEITEM,
                    OPTM_COMPANYID: feature_model_data.OPTM_COMPANYID,
                    OPTM_CREATEDATETIME: feature_model_data.OPTM_CREATEDATETIME,
                    OPTM_CREATEDBY: feature_model_data.OPTM_CREATEDBY,
                    OPTM_DISPLAYNAME: feature_model_data.OPTM_DISPLAYNAME,
                    OPTM_FEATUREID: feature_model_data.OPTM_FEATUREID,
                    OPTM_ITEMKEY: feature_model_data.OPTM_ITEMKEY,
                    OPTM_LINENO: this.ModelHeaderData.length + 1,
                    OPTM_MANDATORY: model_mandatory,
                    OPTM_ISMULTISELECT: feature_model_data.OPTM_ISMULTISELECT,
                    OPTM_MAXSELECTABLE: feature_model_data.OPTM_MAXSELECTABLE,
                    OPTM_MINSELECTABLE: feature_model_data.OPTM_MINSELECTABLE,
                    OPTM_MODELID: parentarray[0].OPTM_MODELID,
                    OPTM_MODIFIEDBY: feature_model_data.OPTM_MODIFIEDBY,
                    OPTM_MODIFIEDDATETIME: String(feature_model_data.OPTM_MODIFIEDDATETIME).toString(),
                    OPTM_PRICESOURCE: feature_model_data.ListName,
                    OPTM_PROPOGATEQTY: parentarray[0].OPTM_PROPOGATEQTY,
                    OPTM_QUANTITY: parseFloat(feature_model_data.OPTM_QUANTITY).toFixed(3),
                    OPTM_TYPE: feature_model_data.OPTM_TYPE,
                    OPTM_UNIQUEIDNT: parentarray[0].OPTM_UNIQUEIDNT,
                    OPTM_UOM: parentarray[0].OPTM_UOM,
                    child_code: feature_model_data.child_code,
                    element_class: parentarray[0].element_class,
                    element_type: parentarray[0].element_type,
                    feature_code: feature_model_data.feature_code,
                    parentfeatureid: parentfeatureid,
                    parentmodelid: parentmodelid,
                    OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
                    is_second_level: 1,
                    random_unique_key: this.commonData.random_string(50),
                    nodeid: feature_model_data.nodeid,
                    unique_key: feature_model_data.unique_key

                  });
                  for (let i = 0; i < data.DataForSelectedFeatureModelItem.length; i++) {
                    var isExist;
                    if (data.DataForSelectedFeatureModelItem.length > 0) {
                      if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 1) {
                        isExist = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_FEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].nodeid;
                        });
                      }
                      else if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 3) {
                        isExist = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_CHILDMODELID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDMODELID && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].nodeid;
                        });
                      }
                      else {
                        isExist = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_ITEMKEY'] == data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].nodeid;
                        });
                      }

                      let child_feature_id: any = ('0');
                      if (data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID != undefined && data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID != null) {
                        child_feature_id = (data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID)
                      }

                      if (isExist.length == 0) {
                        if (data.DataForSelectedFeatureModelItem[i].OPTM_ISMULTISELECT != undefined && data.DataForSelectedFeatureModelItem[i].OPTM_ISMULTISELECT == 'Y') {
                          var item_elementclass = "custom-control custom-checkbox";
                          var item_elementtype = "checkbox";
                        } else {
                          item_elementclass = "custom-control custom-radio"
                          item_elementtype = "radio"
                        }

                        this.ModelBOMDataForSecondLevel.push({
                          ACCESSORY: data.DataForSelectedFeatureModelItem[i].ACCESSORY,
                          IMAGEPATH: this.commonData.get_current_url() + data.DataForSelectedFeatureModelItem[i].OPTM_ATTACHMENT,
                          ITEMCODEGENREF: data.DataForSelectedFeatureModelItem[i].ITEMCODEGENREF,
                          MODELTEMPLATEITEM: data.DataForSelectedFeatureModelItem[i].MODELTEMPLATEITEM,
                          OPTM_ATTACHMENT: data.DataForSelectedFeatureModelItem[i].OPTM_ATTACHMENT,
                          OPTM_CHILDFEATUREID: parseInt(child_feature_id),
                          OPTM_CHILDMODELID: data.DataForSelectedFeatureModelItem[i].OPTM_CHILDMODELID,
                          OPTM_COMPANYID: data.DataForSelectedFeatureModelItem[i].OPTM_COMPANYID,
                          OPTM_CREATEDATETIME: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDATETIME,
                          OPTM_CREATEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDBY,
                          OPTM_DEFAULT: data.DataForSelectedFeatureModelItem[i].OPTM_DEFAULT,
                          OPTM_DISPLAYNAME: data.DataForSelectedFeatureModelItem[i].OPTM_DISPLAYNAME,
                          OPTM_FEATUREID: data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID,
                          OPTM_ITEMKEY: data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY,
                          OPTM_LINENO: data.DataForSelectedFeatureModelItem[i].OPTM_LINENO,
                          OPTM_MODELID: data.DataForSelectedFeatureModelItem[i].OPTM_MODELID,
                          OPTM_MODIFIEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDBY,
                          OPTM_MODIFIEDDATETIME: String(data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDDATETIME).toString(),
                          OPTM_PRICESOURCE: data.DataForSelectedFeatureModelItem[i].ListName,
                          OPTM_QUANTITY: parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY).toFixed(3),
                          OPTM_REMARKS: data.DataForSelectedFeatureModelItem[i].OPTM_REMARKS,
                          OPTM_PROPOGATEQTY: data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY,
                          OPTM_TYPE: data.DataForSelectedFeatureModelItem[i].OPTM_TYPE,
                          OPTM_VALUE: data.DataForSelectedFeatureModelItem[i].OPTM_VALUE,
                          feature_code: data.DataForSelectedFeatureModelItem[i].feature_code,
                          parent_code: data.DataForSelectedFeatureModelItem[i].parent_code,
                          child_code: data.DataForSelectedFeatureModelItem[i].child_code,
                          OPTM_LEVEL: feature_model_data.OPTM_LEVEL + 1,
                          is_second_level: 1,
                          element_class: item_elementclass,
                          element_type: item_elementtype,
                          parentfeatureid: parentfeatureid,
                          parentmodelid: data.DataForSelectedFeatureModelItem[i].parent_modelid,
                          HEADER_LINENO: parentarray[0].OPTM_LINENO,
                          random_unique_key: this.commonData.random_string(50),
                          nodeid: data.DataForSelectedFeatureModelItem[i].nodeid,
                          unique_key: data.DataForSelectedFeatureModelItem[i].unique_key,
                          isManuallyChecked: false,
                          isSecondIteration: false,
                          isRuleApplied: false
                        });
                      }
                    }
                    this.ModelBOMDataForSecondLevel.filter(function (obj) {
                      if (obj.nodeid == data.DataForSelectedFeatureModelItem[i].nodeid) {
                        return obj['checked'] = false;
                      }
                    })
                    let selectedModelData = [];
                    let featureCode = "";
                    selectedModelData.push(data.DataForSelectedFeatureModelItem[i]);
                    if (selectedModelData[0].OPTM_TYPE == 2) {
                      featureCode = feature_model_data.OPTM_DISPLAYNAME
                    } else {
                      featureCode = parentarray[0].child_code
                    }
                    let propagateQtyForitem = 1;
                    if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE != 2) {
                      propagateqty = propagateqty * this.getPropagateQuantity(parentarray[0].unique_key);
                    } else {
                      if (data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY == "Y") {
                        propagateQtyForitem = propagateQtyForitem * this.getPropagateQuantity(data.DataForSelectedFeatureModelItem[i].nodeid);
                      }
                    }

                    if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE != 2) {
                      this.setItemDataForFeature(selectedModelData, parentarray, propagateqtychecked, propagateqty, featureCode, parentarray[0].OPTM_LINENO, type, parentArrayElemType, false, feature_model_data);
                    } else {
                      this.setItemDataForFeature(selectedModelData, parentarray, propagateqtychecked, propagateQtyForitem, featureCode, parentarray[0].OPTM_LINENO, type, parentArrayElemType, false, feature_model_data);
                    }
                  }
                  this.defaultitemflagid = feature_model_data.OPTM_FEATUREID
                }
              }
              else if (type == 3 && feature_model_data.OPTM_VALUE != null) {
                this.setItemDataForFeature(data.DataForSelectedFeatureModelItem, parentarray, propagateqtychecked, propagateqty, parentarray[0].feature_code, parentarray[0].OPTM_LINENO, type, parentArrayElemType, true, feature_model_data);
              }
              else if (type == 2) {
                if (parentarray[0].OPTM_PROPOGATEQTY == "Y") {
                  if (data.DataForSelectedFeatureModelItem[0].OPTM_PROPOGATEQTY == "Y") {
                    propagateqtychecked = "Y"
                    parentarray[0].OPTM_QUANTITY = parseFloat(parentarray[0].OPTM_QUANTITY).toFixed(3)
                    propagateqty = parentarray[0].OPTM_QUANTITY * data.DataForSelectedFeatureModelItem[0].OPTM_QUANTITY

                    propagateqty = propagateqty * this.getPropagateQuantity(parentarray[0].nodeid);
                  }

                }
                this.setItemDataForFeature(data.DataForSelectedFeatureModelItem, parentarray, propagateqtychecked, propagateqty, parentarray[0].feature_code, parentarray[0].OPTM_LINENO, type, parentArrayElemType, false, feature_model_data);
                this.defaultitemflagid = data.DataForSelectedFeatureModelItem[0].OPTM_FEATUREID;

                /* if(data.RuleOutputData.length > 0) {
                  this.setDefaultByRule(data.RuleOutputData, data.DataForSelectedFeatureModelItem[0].nodeid);
                } */
              }

            }//end data length

            if (data.RuleOutputData.length > 0) {
              this.RuleIntegration(data.RuleOutputData, value, feature_model_data);
            }
            this.RuleOutputData = data.RuleOutputData;

            if (isSecondLevel && feature_model_data.isRuleApplied == false) {
              this.checkedFunction(feature_model_data, elementtypeforcheckedfunction, value, true);
            } else if (feature_model_data.isRuleApplied == false) {
              this.checkedFunction(feature_model_data, elementtypeforcheckedfunction, value, false);
            }
            /* if (data.RuleOutputData != undefined && data.RuleOutputData.length != null)  {
             if(data.RuleOutputData.length > 0) {
               if (this.ruleData.length > 0 && this.ruleData.length > this.ruleIndex) {
                 let rule_data_rule_index = this.ruleData[this.ruleIndex];
                 let current_parent_index = this.ModelHeaderData.findIndex(function(obj) {
                   return  obj.unique_key == rule_data_rule_index.nodeid
                 });

                 let card_exist = [];
                 if(data.dtFeatureDataWithDefault != undefined){
                   if(data.dtFeatureDataWithDefault.length > 0){
                     let dtfeaturedata = data.dtFeatureDataWithDefault[0];
                     card_exist = this.ModelHeaderData.filter(function(obj){
                       return obj.unique_key == dtfeaturedata.nodeid;
                     });
                   }
                 }
                 
                 if(this.ModelHeaderData[current_parent_index].is_rule_default_applied == 0 && card_exist.length == 0){ 
                   this.onselectionchange(rule_data_rule_index,true,0,true, rule_data_rule_index.unique_key);
                   this.ruleIndex = this.ruleIndex + 1;
                 } 
               }
             }
           } */

            this.showLookupLoader = false;
          } //end value
          else {
            if (feature_model_data.OPTM_TYPE != 2) {
              if (feature_model_data.parentmodelid == "" || feature_model_data.parentmodelid == null || feature_model_data.parentmodelid == undefined) {
                this.removefeaturesbyuncheck(feature_model_data.OPTM_FEATUREID, feature_model_data.feature_code, feature_model_data.nodeid, feature_model_data.unique_key)
              }
              else {
                this.removeModelfeaturesbyuncheck(feature_model_data.parentmodelid, feature_model_data.feature_code, feature_model_data.nodeid, feature_model_data.unique_key)
              }
            }

            for (let i = 0; i < this.feature_itm_list_table.length; i++) {
              if (this.feature_itm_list_table[i].FeatureId == feature_model_data.OPTM_FEATUREID && this.feature_itm_list_table[i].Item == feature_model_data.OPTM_ITEMKEY && this.feature_itm_list_table[i].nodeid == feature_model_data.nodeid) {
                this.feature_itm_list_table.splice(i, 1);
                i = i - 1;
              }
            }
            this.enableFeatureModelsItems();
            this.RuleIntegration(data.RuleOutputData, value, feature_model_data);
            this.RuleOutputData = data.RuleOutputData;
            this.feature_price_calculate();
            /* if(data.RuleOutputData.length == 0) {
                this.rule_default_set_on_modelheader(false, "", 1);
            } */
            //  
            this.showLookupLoader = false;
          }
          if (data.DataForSelectedFeatureModelItem.length == 1) {
            var currentSelectedFeatureId = data.DataForSelectedFeatureModelItem[0].OPTM_FEATUREID;
            var currentSelectedNodeId = data.DataForSelectedFeatureModelItem[0].nodeid;
            if (currentSelectedFeatureId != null && currentSelectedFeatureId != "") {
              var ModelBOMDataForSelectedFeature = this.ModelBOMDataForSecondLevel.filter(function (array) {
                return array.OPTM_FEATUREID == currentSelectedFeatureId && array['nodeid'] == currentSelectedNodeId;
              });
            }
            if (ModelBOMDataForSelectedFeature != undefined && ModelBOMDataForSelectedFeature != null) {
              if (ModelBOMDataForSelectedFeature.length > 0) {
                for (var i = 0; i < this.ModelBOMDataForSecondLevel.length; i++) {
                  if (this.ModelBOMDataForSecondLevel[i].OPTM_FEATUREID != 'undefined' || ModelBOMDataForSelectedFeature[0].OPTM_FEATUREID != 'undefined') {
                    if (ModelBOMDataForSelectedFeature[0].OPTM_FEATUREID == this.ModelBOMDataForSecondLevel[i].OPTM_FEATUREID && ModelBOMDataForSelectedFeature[0].nodeid == this.ModelBOMDataForSecondLevel[i].nodeid) {
                      this.ModelBOMDataForSecondLevel[i].checked = true;
                    } else {
                      this.ModelBOMDataForSecondLevel[i].checked = false;
                    }
                  }
                }
              }
            }
          }

        }//end data null

        this.showLookupLoader = false;
      },//end data
      error => {

        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return;
      }
    );//end subscribe


    this.feature_price_calculate();
    // this.ModelHeaderData.sort((a, b) => a.sort_key.localeCompare(b.sort_key));
  } //end selection

  getPropagateQuantity(nodeId) {
    //Logic to calculate total quantity based on propagate quantity for an item at different level in Model tree.
    let FilteredModelHeaderData = [];
    let quantity = 1;
    FilteredModelHeaderData = this.ModelHeaderData.filter(function (obj) {
      return obj.unique_key == nodeId
    })
    if (FilteredModelHeaderData.length > 0) {
      if (FilteredModelHeaderData[0].OPTM_PROPOGATEQTY == "Y") {
        quantity = quantity * FilteredModelHeaderData[0].OPTM_QUANTITY;
      }
      if (FilteredModelHeaderData[0].nodeid != undefined && FilteredModelHeaderData[0].nodeid != null) {
        return quantity * this.getPropagateQuantity(FilteredModelHeaderData[0].nodeid);
      } else {
        return quantity;
      }
    } else {
      return quantity;
    }
  }

  setDtFeatureDataWithDefault(dtFeatureDataWithDefault, DataForSelectedFeatureModelItem, feature_model_data, parentmodelid, parentarray, propagateqtychecked, data, type) {
    for (var idtfeature in dtFeatureDataWithDefault) {
      var isExist;
      var checkeddefault;
      var propagateqty;
      var itemData = [];
      if (dtFeatureDataWithDefault[idtfeature].OPTM_TYPE == "1") {
        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_CHILDFEATUREID'] == dtFeatureDataWithDefault[idtfeature].OPTM_CHILDFEATUREID && obj['nodeid'] == dtFeatureDataWithDefault[idtfeature].nodeid;
        });
      }
      else {
        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_ITEMKEY'] == dtFeatureDataWithDefault[idtfeature].OPTM_ITEMKEY && obj['OPTM_FEATUREID'] == dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID && obj['nodeid'] == dtFeatureDataWithDefault[idtfeature].nodeid;
        });
      }

      if (dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT == "Y") {
        checkeddefault = true
      }
      else {
        checkeddefault = false
      }

      if (DataForSelectedFeatureModelItem.OPTM_PROPOGATEQTY == "Y") {
        if (dtFeatureDataWithDefault[idtfeature].OPTM_PROPOGATEQTY == "Y") {
          dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY = parseFloat(DataForSelectedFeatureModelItem.OPTM_QUANTITY) * parseFloat(dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY)
          propagateqty = dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY
        }

      }


      if (isExist.length == 0) {
        var psFeatureMax;
        var psFeatureMin;
        var psFeatureelement_class = "custom-control custom-radio"
        var psFeatureelement_type = "radio"
        if (dtFeatureDataWithDefault[idtfeature].OPTM_MAX_SELECTABLE == null || dtFeatureDataWithDefault[idtfeature].OPTM_MAX_SELECTABLE == "" || dtFeatureDataWithDefault[idtfeature].OPTM_MAX_SELECTABLE == undefined) {
          psFeatureMax = 1
        } else {
          psFeatureMax = dtFeatureDataWithDefault[idtfeature].OPTM_MAX_SELECTABLE
          if (parseInt(psFeatureMax) > 1) {
            psFeatureelement_class = "custom-control custom-checkbox"
            psFeatureelement_type = "checkbox"
          }
        }
        if (dtFeatureDataWithDefault[idtfeature].OPTM_MIN_SELECTABLE == null || dtFeatureDataWithDefault[idtfeature].OPTM_MIN_SELECTABLE == "" || dtFeatureDataWithDefault[idtfeature].OPTM_MIN_SELECTABLE == undefined) {
          psFeatureMin = 1
        } else {
          psFeatureMin = dtFeatureDataWithDefault[idtfeature].OPTM_MIN_SELECTABLE

        }
        this.FeatureBOMDataForSecondLevel.push({
          ACCESSORY: dtFeatureDataWithDefault[idtfeature].ACCESSORY,
          IMAGEPATH: this.commonData.get_current_url() + dtFeatureDataWithDefault[idtfeature].OPTM_ATTACHMENT,
          OPTM_ATTACHMENT: dtFeatureDataWithDefault[idtfeature].OPTM_ATTACHMENT,
          OPTM_CHILDFEATUREID: parseInt(dtFeatureDataWithDefault[idtfeature].OPTM_CHILDFEATUREID),
          OPTM_COMPANYID: dtFeatureDataWithDefault[idtfeature].OPTM_COMPANYID,
          OPTM_CREATEDATETIME: dtFeatureDataWithDefault[idtfeature].OPTM_CREATEDATETIME,
          OPTM_CREATEDBY: dtFeatureDataWithDefault[idtfeature].OPTM_CREATEDBY,
          OPTM_DEFAULT: dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT,
          OPTM_DISPLAYNAME: dtFeatureDataWithDefault[idtfeature].OPTM_DISPLAYNAME,
          OPTM_FEATUREID: dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID,
          OPTM_ITEMKEY: dtFeatureDataWithDefault[idtfeature].OPTM_ITEMKEY,
          OPTM_LINENO: dtFeatureDataWithDefault[idtfeature].OPTM_LINENO,
          OPTM_MODIFIEDBY: dtFeatureDataWithDefault[idtfeature].OPTM_MODIFIEDBY,
          OPTM_MODIFIEDDATETIME: String(dtFeatureDataWithDefault[idtfeature].OPTM_MODIFIEDDATETIME).toString(),
          OPTM_PROPOGATEQTY: dtFeatureDataWithDefault[idtfeature].OPTM_PROPOGATEQTY,
          OPTM_PRICESOURCE: dtFeatureDataWithDefault[idtfeature].ListName,
          OPTM_QUANTITY: parseFloat(dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY).toFixed(3),
          OPTM_REMARKS: dtFeatureDataWithDefault[idtfeature].OPTM_REMARKS,
          OPTM_ISMULTISELECT: String(dtFeatureDataWithDefault[idtfeature].OPTM_ISMULTISELECT),
          OPTM_MAXSELECTABLE: psFeatureMax,
          OPTM_MIN_SELECTABLE: psFeatureMin,
          OPTM_TYPE: dtFeatureDataWithDefault[idtfeature].OPTM_TYPE,
          OPTM_VALUE: dtFeatureDataWithDefault[idtfeature].OPTM_VALUE,
          feature_code: dtFeatureDataWithDefault[idtfeature].feature_code,
          parent_code: dtFeatureDataWithDefault[idtfeature].parent_code,
          checked: checkeddefault,
          OPTM_LEVEL: feature_model_data.OPTM_LEVEL + 1,
          is_second_level: 1,
          element_class: psFeatureelement_class,
          element_type: psFeatureelement_type,
          parentfeatureid: (DataForSelectedFeatureModelItem.OPTM_CHILDFEATUREID).toString(),
          parentmodelid: parentmodelid,
          HEADER_LINENO: this.ModelHeaderData.length + 1,
          nodeid: dtFeatureDataWithDefault[idtfeature].nodeid,
          unique_key: dtFeatureDataWithDefault[idtfeature].unique_key,
          random_unique_key: this.commonData.random_string(50),
          isManuallyChecked: false,
          isSecondIteration: false,
          isRuleApplied: false
        });
      }

      if (dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT == "Y" && dtFeatureDataWithDefault[idtfeature].OPTM_TYPE == "2") {
        var tempparentarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_CHILDFEATUREID'] == dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID && obj['unique_key'] == dtFeatureDataWithDefault[idtfeature].nodeid;
        });
        if (tempparentarray.length > 0) {
          parentarray[0].OPTM_TYPE = tempparentarray[0].OPTM_TYPE
          parentarray[0].parentmodelid = tempparentarray[0].parentmodelid
          parentarray[0].OPTM_LEVEL = tempparentarray[0].OPTM_LEVEL
          parentarray[0].HEADER_LINENO = tempparentarray[0].HEADER_LINENO
        }
        itemData.push(dtFeatureDataWithDefault[idtfeature])
        var input_type = 'radio';
        if (dtFeatureDataWithDefault[idtfeature].OPTM_ISMULTISELECT == 'Y') {
          input_type = 'checkbox';
        } else {
          input_type = 'radio';
        }
        let temp_feature_code;
        if (tempparentarray.length == 0) {
          temp_feature_code = '';
        } else {
          temp_feature_code = tempparentarray[0].feature_code;
        }

        propagateqty = propagateqty * this.getPropagateQuantity(parentarray[0].nodeid);

        this.setItemDataForFeature(itemData, parentarray, propagateqtychecked, propagateqty, temp_feature_code, parentarray[0].HEADER_LINENO, type, input_type, false, "");
      }
    }
    var checkDefaultFeatureIndtFeatureDataWithDefault = dtFeatureDataWithDefault.filter(function (obj) {
      return obj['OPTM_DEFAULT'] == "Y" && dtFeatureDataWithDefault[idtfeature].OPTM_TYPE == "1"
    })

    if (checkDefaultFeatureIndtFeatureDataWithDefault.length > 0) {
      isExist = this.ModelHeaderData.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CHILDFEATUREID && obj['unique_key'] == checkDefaultFeatureIndtFeatureDataWithDefault[0].unique_key;
      });


      var psMaxSelect = "1"
      var psMinSelect = "1"
      var pselementclass = "custom-control custom-radio"
      var pselementtype = "radio"
      var elementtypeforcheckedfunction = "radio";
      if (checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_ISMULTISELECT == "Y") {
        psMaxSelect = checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MAX_SELECTABLE
        psMinSelect = checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MIN_SELECTABLE
        if (parseFloat(psMaxSelect) > 1) {
          pselementclass = "custom-control custom-checkbox"
          pselementtype = "checkbox"
          elementtypeforcheckedfunction = "checkbox"
        }
      }



      if (isExist.length == 0) {
        let model_mandatory = "N";
        if (checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MANDATORY != undefined && checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MANDATORY == "Y") {
          model_mandatory = 'Y';
        }
        this.ModelHeaderData.push({
          ACCESSORY: checkDefaultFeatureIndtFeatureDataWithDefault[0].ACCESSORY,
          IMAGEPATH: checkDefaultFeatureIndtFeatureDataWithDefault[0].IMAGEPATH,
          OPTM_CHILDMODELID: "",
          OPTM_COMPANYID: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_COMPANYID,
          OPTM_CREATEDATETIME: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CREATEDATETIME,
          OPTM_CREATEDBY: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CREATEDBY,
          OPTM_DISPLAYNAME: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_DISPLAYNAME,
          OPTM_FEATUREID: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CHILDFEATUREID,
          OPTM_ITEMKEY: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_ITEMKEY,
          OPTM_LINENO: this.ModelHeaderData.length + 1,
          OPTM_MANDATORY: model_mandatory,
          OPTM_ISMULTISELECT: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_ISMULTISELECT,
          OPTM_MAXSELECTABLE: psMaxSelect,
          OPTM_MINSELECTABLE: psMinSelect,
          OPTM_MODELID: parentarray[0].OPTM_MODELID,
          OPTM_MODIFIEDBY: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MODIFIEDBY,
          OPTM_MODIFIEDDATETIME: String(checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MODIFIEDDATETIME).toString(),
          OPTM_PRICESOURCE: checkDefaultFeatureIndtFeatureDataWithDefault[0].ListName,
          OPTM_PROPOGATEQTY: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_PROPOGATEQTY,
          OPTM_QUANTITY: parseFloat(checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_QUANTITY).toFixed(3),
          OPTM_TYPE: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_TYPE,
          OPTM_UNIQUEIDNT: parentarray[0].OPTM_UNIQUEIDNT,
          OPTM_UOM: parentarray[0].OPTM_UOM,
          child_code: parentarray[0].child_code,
          element_class: pselementclass,
          element_type: pselementtype,
          feature_code: checkDefaultFeatureIndtFeatureDataWithDefault[0].feature_code,
          parentfeatureid: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_FEATUREID,
          parentmodelid: parentmodelid,
          OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
          is_second_level: 1,
          nodeid: checkDefaultFeatureIndtFeatureDataWithDefault[0].nodeid,
          unique_key: checkDefaultFeatureIndtFeatureDataWithDefault[0].unique_key,
          random_unique_key: this.commonData.random_string(50)
        });



        if (checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_PROPOGATEQTY == "Y") {
          propagateqtychecked = "Y"
          checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_QUANTITY = parseFloat(checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_QUANTITY).toFixed(3)
          propagateqty = checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_QUANTITY
        }

        var childItemsAddedModelHeaderData = data.AllDataForFeature.filter(function (obj) {
          return obj['OPTM_FEATUREID'] == checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CHILDFEATUREID
        })

        if (childItemsAddedModelHeaderData.length > 0) {
          this.setDtFeatureDataWithDefault(childItemsAddedModelHeaderData, checkDefaultFeatureIndtFeatureDataWithDefault[0], feature_model_data, parentmodelid, parentarray, propagateqtychecked, data, type)
        }

      }
    }
    // else if (dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT == "Y" && dtFeatureDataWithDefault[idtfeature].OPTM_TYPE == "1") {

    // }

  }


  remove_all_features_child(unique_key, parentArray) {
    // for removing feature within feature 
    var all_child_of_current_selection_parent = [];
    /* if(parentArray[0].parentmodelid == null && parentArray[0].parentmodelid == undefined) { */
    all_child_of_current_selection_parent = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
      return obj.nodeid == unique_key;
    });
    /* } */
    if (all_child_of_current_selection_parent.length > 0) {
      for (var i = 0; i < all_child_of_current_selection_parent.length; i++) {
        var selection_parent_child_data = all_child_of_current_selection_parent[i];
        for (var j = 0; j < this.feature_itm_list_table.length; j++) {

          if (selection_parent_child_data.parentmodelid != null && selection_parent_child_data.parentmodelid != undefined && (selection_parent_child_data.OPTM_CHILDFEATUREID == 0 || selection_parent_child_data.OPTM_CHILDFEATUREID == null)) {
            if (selection_parent_child_data.nodeid == this.feature_itm_list_table[j].nodeid) {
              this.feature_itm_list_table.splice(j, 1);
              this.remove_all_features_child(selection_parent_child_data.unique_key, parentArray);
            }
          } else if (selection_parent_child_data.parentmodelid != null && selection_parent_child_data.OPTM_CHILDFEATUREID != null && selection_parent_child_data.OPTM_CHILDFEATUREID != 0) {
            if (selection_parent_child_data.unique_key == this.feature_itm_list_table[j].nodeid) {
              this.feature_itm_list_table.splice(j, 1);
              this.remove_all_features_child(selection_parent_child_data.unique_key, parentArray);
            }
          } else {
            if (selection_parent_child_data.unique_key == this.feature_itm_list_table[j].nodeid) {
              this.feature_itm_list_table.splice(j, 1);
              this.remove_all_features_child(selection_parent_child_data.unique_key, parentArray);
            }
          }

        }
      }
    }

    // logic to remove right grid items of submodel childs
    var all_child_of_current_selection_submodel = [];
    if (all_child_of_current_selection_parent.length == 0) {
      all_child_of_current_selection_submodel = this.ModelBOMDataForSecondLevel.filter(function (obj) {
        return obj.nodeid == unique_key && obj.OPTM_TYPE != "2";
      });
    }

    if (all_child_of_current_selection_submodel.length > 0) {
      for (var i = 0; i < all_child_of_current_selection_submodel.length; i++) {
        var selection_parent_child_data = all_child_of_current_selection_submodel[i];
        for (var j = 0; j < this.feature_itm_list_table.length; j++) {
          if (selection_parent_child_data.nodeid == this.feature_itm_list_table[j].nodeid && this.feature_itm_list_table[j].OPTM_TYPE == "1") {
            this.feature_itm_list_table.splice(j, 1);
            this.remove_all_features_child(selection_parent_child_data.nodeid, parentArray);
          }

        }
      }
    }


    // for removing items 
    if (parentArray[0].parentmodelid == null && parentArray[0].parentmodelid == undefined) {
      var get_all_items = this.feature_itm_list_table.filter(function (obj) {
        return obj.nodeid == unique_key;
      });
      if (get_all_items.length > 0) {
        for (var j = 0; j < this.feature_itm_list_table.length; j++) {
          if (unique_key == this.feature_itm_list_table[j].nodeid) {
            this.feature_itm_list_table.splice(j, 1);
          }
        }
      }
    }


  }

  removeAllSubmodelChild(uniqueKey, featureModelData, isThirdLevel) {
    //this function removes sub-model & thieir respective childs from right grid.


    let all_child_of_selected_submodel = [];
    all_child_of_selected_submodel = this.ModelBOMDataForSecondLevel.filter(function (obj) {
      return obj.nodeid == uniqueKey;
    });

    if (all_child_of_selected_submodel.length > 0 && !isThirdLevel) {
      for (let i = 0; i < all_child_of_selected_submodel.length; i++) {
        let selection_parent_child_data = all_child_of_selected_submodel[i];
        for (let j = 0; j < this.feature_itm_list_table.length; j++) {
          if (selection_parent_child_data.nodeid == this.feature_itm_list_table[j].nodeid && featureModelData.unique_key != this.feature_itm_list_table[j].unique_key && featureModelData.unique_key != this.feature_itm_list_table[j].nodeid) {
            let currentRow = this.feature_itm_list_table[j];
            if (currentRow.OPTM_ITEMTYPE == undefined && currentRow.OPTM_ITEMTYPE == null) {
              this.feature_itm_list_table.splice(j, 1);
            }
            if (currentRow.OPTM_TYPE == 3) {
              this.removeAllSubmodelChild(currentRow.unique_key, featureModelData, false);
            } else {
              this.removeAllSubmodelChild(selection_parent_child_data.unique_key, featureModelData, false);
            }
          }

        }
      }
    } else {
      for (let index = 0; index < this.feature_itm_list_table.length; index++) {
        if (this.feature_itm_list_table[index].nodeid == uniqueKey && this.feature_itm_list_table[index].ModelId == featureModelData.parentmodelid) {
          let currentSelection = this.feature_itm_list_table[index];
          if (currentSelection.OPTM_TYPE == 3) {
            if (featureModelData.unique_key != currentSelection.unique_key) {
              this.feature_itm_list_table.splice(index, 1);
            }
          } else {
            if (featureModelData.unique_key != currentSelection.nodeid) {
              this.feature_itm_list_table.splice(index, 1);
            }
          }
          this.removeAllSubmodelChild(currentSelection.unique_key, featureModelData, true);
        }
      }
    }
  }

  setItemDataForFeature(ItemData, parentarray, propagateqtychecked, propagateqty, tempfeaturecode, lineno, type, parentArrayElemType, isValue, featureModelData) {
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let currentfeaturerow: any = [];
    var isDefaultItem: boolean = true;
    if (ItemData.length > 0) {
      if (parentArrayElemType == "radio") {
        if (parentarray[0].OPTM_TYPE == 1 && type == 1) {
          this.remove_all_features_child(parentarray[0].nodeid, parentarray);
          this.removeAllSubmodelChild(parentarray[0].unique_key, featureModelData, false);
        } else if (parentarray[0].OPTM_TYPE == 1 && type == 2) {
          this.remove_all_features_child(parentarray[0].unique_key, parentarray);
        } else if (parentarray[0].OPTM_TYPE == 1 && type == 3) {
          this.remove_all_features_child(parentarray[0].unique_key, parentarray);
        } else if (parentarray[0].OPTM_TYPE == 3) {
          if (type == 3) {
            let subOfSubModelData = this.ModelHeaderData.filter(function (obj) {
              if (parentarray[0].nodeid != null && parentarray[0].nodeid != undefined) {
                return obj.is_second_level == 1 && obj.nodeid == featureModelData.nodeid
              } else {
                return obj.is_second_level == 1 && obj.unique_key == featureModelData.nodeid
              }
            })
            if (subOfSubModelData.length == 0) {
              this.removeAllSubmodelChild(parentarray[0].unique_key, featureModelData, false);
              this.remove_all_features_child(parentarray[0].unique_key, parentarray);
            } else if (featureModelData.OPTM_LEVEL >= 3 && featureModelData.is_second_level == 1) {
              this.removeAllSubmodelChild(featureModelData.nodeid, featureModelData, true);
            }

          } else {
            if (featureModelData.OPTM_LEVEL >= 3 && featureModelData.is_second_level == 1) {
              this.removeAllSubmodelChild(featureModelData.nodeid, featureModelData, true);
            } else {
              this.removeAllSubmodelChild(featureModelData.nodeid, featureModelData, false);
            }
            this.remove_all_features_child(parentarray[0].unique_key, parentarray);
          }
        }


      }
      var isExist;
      if (parentarray[0].OPTM_TYPE == 1) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['FeatureId'] == ItemData[0].OPTM_FEATUREID && obj['nodeid'] == ItemData[0].nodeid && obj['Item'] == ItemData[0].OPTM_ITEMKEY;
        });
        if (featureModelData.OPTM_TYPE == 1) {
          if (ItemData[0].OPTM_DEFAULT == "Y") {
            isDefaultItem = true
          } else {
            isDefaultItem = false
          }
        }
      }
      else if (parentarray[0].OPTM_TYPE == 3) {
        if (featureModelData.OPTM_TYPE == 1) {
          if (ItemData[0].OPTM_DEFAULT == "Y") {
            isExist = this.feature_itm_list_table.filter(function (obj) {
              return obj['FeatureId'] == ItemData[0].OPTM_FEATUREID && obj['nodeid'] == ItemData[0].nodeid && obj['Item'] == ItemData[0].OPTM_ITEMKEY;
            });
            isDefaultItem = true;
          } else {
            isDefaultItem = false
          }

        } else if (featureModelData.OPTM_TYPE == 3) {
          if (ItemData[0].OPTM_TYPE == 2) {
            isExist = this.feature_itm_list_table.filter(function (obj) {
              return obj['ModelId'] == ItemData[0].OPTM_MODELID && obj['nodeid'] == ItemData[0].nodeid && obj['Item'] == ItemData[0].OPTM_ITEMKEY;
            });

          } else {
            isExist = this.feature_itm_list_table.filter(function (obj) {
              return obj['ModelId'] == featureModelData.OPTM_MODELID && obj['nodeid'] == featureModelData.nodeid && obj['unique_key'] == featureModelData.unique_key;
            });
          }
        }



      }
      else {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['ModelId'] == ItemData[0].OPTM_MODELID && obj['Item'] == ItemData[0].OPTM_ITEMKEY;
        });
      }

      if (ItemData[0].Price == null || ItemData[0].Price == undefined || ItemData[0].Price == "") {
        ItemData[0].Price = 0;
      }

      var formatequantity: any;
      if (propagateqtychecked == "Y" && ItemData[0].OPTM_PROPOGATEQTY == "Y") {
        propagateqty = parseFloat(propagateqty).toFixed(3)
        ItemData[0].OPTM_QUANTITY = propagateqty

        ItemData[0].OPTM_QUANTITY = parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3)
        formatequantity = ItemData[0].OPTM_QUANTITY * this.step2_data.quantity

      }
      else {
        ItemData[0].OPTM_QUANTITY = parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3)
        formatequantity = ItemData[0].OPTM_QUANTITY * propagateqty
      }

      var priceextn: any = formatequantity * ItemData[0].Price

      var tempModelID
      if (parentarray[0].OPTM_TYPE == 3) {
        tempModelID = featureModelData.OPTM_MODELID
      } else {
        if (parentarray[0].parentmodelid != this.step2_data.model_id) {
          if (parentarray[0].parentmodelid !== undefined && parentarray[0].parentmodelid !== null) {
            tempModelID = parentarray[0].parentmodelid;
          } else {
            if (currentfeaturerow.ModelId != undefined && currentfeaturerow.ModelId != null) {
              tempModelID = currentfeaturerow.ModelId;
            } else {
              tempModelID = this.step2_data.model_id;
            }
          }
        }
        else {
          if (parentarray[0].OPTM_MODELID != undefined && parentarray[0].OPTM_MODELID != null) {
            tempModelID = parentarray[0].OPTM_MODELID;
          } else {
            if (currentfeaturerow.ModelId != undefined && currentfeaturerow.ModelId != null) {
              tempModelID = currentfeaturerow.ModelId;
            } else {
              tempModelID = this.step2_data.model_id;
            }
          }
        }
      }


      let featureId = "";
      let description = "";
      if (parentarray[0].OPTM_TYPE == 3) {
        if (featureModelData.OPTM_TYPE == 1) {
          tempfeaturecode = ItemData[0].parent_code
          featureId = ItemData[0].OPTM_FEATUREID
          description = ItemData[0].OPTM_DISPLAYNAME

        } else if (featureModelData.OPTM_TYPE == 3) {
          tempfeaturecode = tempfeaturecode
          featureId = ItemData[0].OPTM_MODELID
          if (ItemData[0].OPTM_TYPE != 2) {
            description = featureModelData.child_code
          } else {
            description = ItemData[0].OPTM_DISPLAYNAME
          }
        }
      } else {
        featureId = ItemData[0].OPTM_FEATUREID
        description = ItemData[0].OPTM_DISPLAYNAME
      }

      if (isExist != undefined && isExist != null) {
        if (isExist.length == 0 && !isValue) {
          if (ItemData[0].OPTM_TYPE != 2) {
            let featureModelDataPrice: any = 0;
            let optmLevel = "";
            if (featureModelData.Price == undefined && featureModelData.Price == null) {
              featureModelDataPrice = featureModelDataPrice;
            } else {
              featureModelDataPrice = featureModelData.Price;
            }
            if (featureModelData.OPTM_TYPE == 3 && parentarray[0].OPTM_TYPE == 3) {
              optmLevel = featureModelData.OPTM_LEVEL
            } else {
              optmLevel = parentarray[0].OPTM_LEVEL
            }
            this.feature_itm_list_table.push({
              FeatureId: featureId,
              featureName: tempfeaturecode,
              Item: featureModelData.OPTM_ITEMKEY,
              discount: 0,
              ItemNumber: featureModelData.DocEntry,
              Description: description,
              quantity: parseFloat(formatequantity).toFixed(3),
              original_quantity: parseFloat(featureModelData.OPTM_QUANTITY).toFixed(3),
              price: featureModelData.ListName,
              Actualprice: parseFloat(featureModelDataPrice).toFixed(3),
              pricextn: parseFloat(priceextn).toFixed(3),
              is_accessory: "N",
              isPriceDisabled: isPriceDisabled,
              pricehide: isPricehide,
              ModelId: (tempModelID).toString(),
              OPTM_LEVEL: optmLevel,
              OPTM_TYPE: featureModelData.OPTM_TYPE,
              isQuantityDisabled: true,
              HEADER_LINENO: lineno,
              unique_key: featureModelData.unique_key,
              nodeid: featureModelData.nodeid,
              // sort_key: featureModelData.sort_key
            });
          } else if (isDefaultItem) {
            this.feature_itm_list_table.push({
              FeatureId: featureId,
              featureName: tempfeaturecode,
              Item: ItemData[0].OPTM_ITEMKEY,
              discount: 0,
              ItemNumber: ItemData[0].DocEntry,
              Description: description,
              quantity: parseFloat(formatequantity).toFixed(3),
              original_quantity: parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3),
              price: ItemData[0].ListName,
              Actualprice: parseFloat(ItemData[0].Price).toFixed(3),
              pricextn: parseFloat(priceextn).toFixed(3),
              is_accessory: "N",
              isPriceDisabled: isPriceDisabled,
              pricehide: isPricehide,
              ModelId: (tempModelID).toString(),
              OPTM_LEVEL: parentarray[0].OPTM_LEVEL,
              OPTM_TYPE: ItemData[0].OPTM_TYPE,
              isQuantityDisabled: true,
              HEADER_LINENO: lineno,
              parent_featureid: ItemData[0].parent_featureid,
              unique_key: ItemData[0].unique_key,
              nodeid: ItemData[0].nodeid,
              // sort_key: featureModelData.sort_key
            });
          }
          console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
        }
      }

    }
    
    // this.feature_itm_list_table.sort((a, b) => a.sort_key.localeCompare(b.sort_key));

    this.feature_price_calculate();

  }


  onShipToChange(SelectedShipTo) {

    this.step1_data.ship_to = SelectedShipTo;

    this.ship_data = [];
    this.ship_data.push({
      CompanyDBId: this.common_output_data.companyName,
      Customer: this.step1_data.customer,
      ShipTo: SelectedShipTo,
      currentDate: this.submit_date,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });
    this.showLookupLoader = true;
    this.OutputService.fillShipAddress(this.ship_data).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
          this.showLookupLoader = false;
          this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
        }
        else {
          this.step1_data.ship_to_address = '';
          this.showLookupLoader = false;
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
      })
  }

  onBillToChange(SelectedBillTo) {
    this.step1_data.bill_to = SelectedBillTo;
    this.bill_data = [];
    this.bill_data.push({
      CompanyDBId: this.common_output_data.companyName,
      Customer: this.step1_data.customer,
      BillTo: SelectedBillTo,
      currentDate: this.submit_date,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });
    this.showLookupLoader = true;
    this.OutputService.fillBillAddress(this.bill_data).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
          if (data.BillingAdress[0] != undefined) {
            this.showLookupLoader = false;
            this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
          }
        }
        else {
          this.showLookupLoader = false;
          this.step1_data.bill_to_address = '';
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
      })
  }
  onCustomerChange(callback) {
    this.showLookupLoader = true;
    this.OutputService.validateInputCustomer(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {

        if (data != undefined && data != null) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
        }

        if (data === "False") {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.invalidcustomer, this.commonData.toast_config);
          this.isNextButtonVisible = false;
          this.step1_data.customer = "";
          this.step1_data.customer_name = '';
          this.contact_persons = [];
          this.sales_employee = [];
          this.ship_to = [];
          this.step1_data.ship_to_address = '';
          this.step1_data.bill_to_address = '';
          this.bill_to = [];
          this.owner_list = [];
          return;
        }

        else {
          this.isNextButtonVisible = true;
          if (callback == "" && callback == undefined) {
            callback = '';
          }
          this.getCustomerAllInfo(callback);
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
      }
    )
  }

  GetCustomername() {
    this.OutputService.GetCustomername(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null && data != undefined && data.length > 0) {

          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }

          this.step1_data.customer_name = data[0].Name;
        }
        else {
          this.step1_data.customer_name = '';
        }
      }
    )
  }

  onDocumentChange(documentValue) {
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.SalesQuote;
    }
    else if (this.step1_data.document == "sales_order") {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = this.language.SalesOrder;
    }
    else {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.draft;
    }
  }

  onFinishPress(screen_name, button_press) {
    // if (button_press == 'finishPress' ) {
    // this.onValidateNextPress(true, "");
    this.step2_final_dataset_to_save = [];
    if (this.step3_data_final.length > 0 && this.step3_data_final !== undefined) {
      this.generate_unique_key();
    }
    // }

    let final_dataset_to_save: any = {};
    final_dataset_to_save.OPConfig_OUTPUTHDR = [];
    final_dataset_to_save.OPConfig_OUTPUTDTL = [];
    final_dataset_to_save.OPConfig_OUTPUTLOG = [];
    final_dataset_to_save.ConnectionDetails = [];
    final_dataset_to_save.apidata = [];
    final_dataset_to_save.routing_model = [];
    final_dataset_to_save.routing_model_feature_data = [];
    final_dataset_to_save.routing_user_selection = [];

    // modify /duplocate / view data  set  - start 
    final_dataset_to_save.ModelHeaderData = [];
    final_dataset_to_save.SelectedAccessory = [];
    final_dataset_to_save.SelectedAccessoryBOM = [];
    final_dataset_to_save.ModelBOMDataForSecondLevel = [];
    final_dataset_to_save.FeatureBOMDataForSecondLevel = [];
    final_dataset_to_save.RuleOutputData = [];
    final_dataset_to_save.MainModelDetails = [];
    // modify /duplocate / view data  set  - end


    let total_discount = (Number(this.feature_discount_percent) + Number(this.accessory_discount_percent));

    //Creating OutputLog table
    final_dataset_to_save.OPConfig_OUTPUTLOG.push({
      "OPTM_LOGID": this.iLogID,
      "OPTM_DOCTYPE": this.step1_data.document,
      "OPTM_PAYMENTTERM": 0,
      "OPTM_DESC": this.step1_data.description,
      "OPTM_PRODTOTAL": Number(this.step4_final_prod_total),
      "OPTM_PRODDISCOUNT": Number(this.prod_discount_log),
      "OPTM_ACCESSORYTOTAL": Number(this.step4_final_acc_total),
      "OPTM_ACCESSORYDISAMOUNT": Number(this.access_dis_amount_log),
      "OPTM_GRANDTOTAL": Number(this.step4_final_grand_total),
      "OPTM_CREATEDBY": this.common_output_data.username
    });

    let delivery_date_string = "";
    if (this.step1_data.delivery_until != "" && this.step1_data.delivery_until != undefined && this.step1_data.delivery_until != null) {
      let temp_date = new Date(this.step1_data.delivery_until);
      delivery_date_string = (temp_date.getMonth() + 1) + "/" + temp_date.getDate() + "/" + temp_date.getFullYear();
    }

    if (this.step3_data_final.length > 0 && this.step3_data_final !== undefined) {
      for (let iHdrCount = 0; iHdrCount < this.step3_data_final.length; iHdrCount++) {
        final_dataset_to_save.OPConfig_OUTPUTHDR.push({
          "OPTM_LOGID": this.iLogID,
          "OPTM_OUTPUTID": "",
          "OPTM_DOCTYPE": this.step1_data.document,
          "OPTM_BPCODE": this.step1_data.customer,
          "OPTM_SHIPTO": this.step1_data.ship_to,
          "OPTM_BILLTO": this.step1_data.bill_to,
          "OPTM_CONTACTPERSON": this.step1_data.person_name,
          "OPTM_TAX": this.acc_item_tax,
          "OPTM_PAYMENTTERM": 0,
          "OPTM_FGITEM": this.step3_data_final[iHdrCount].item,
          "OPTM_KEY": "",
          "OPTM_DELIVERYDATE": delivery_date_string,
          "OPTM_QUANTITY": parseFloat(this.step3_data_final[iHdrCount].quantity).toFixed(3),
          "OPTM_CREATEDBY": this.common_output_data.username,
          "OPTM_MODIFIEDBY": this.common_output_data.username,
          "OPTM_DESC": this.step3_data_final[iHdrCount].desc,
          "OPTM_SALESEMP": this.step1_data.sales_employee,
          "OPTM_OWNER": this.step1_data.owner,
          "OPTM_REMARKS": this.step1_data.remark,
          "OPTM_BILLADD": this.step1_data.bill_to_address,
          "OPTM_SHIPADD": this.step1_data.ship_to_address,
          "OPTM_POSTINGDATE": this.step1_data.posting_date,
          "OPTM_GRANDTOTAL": Number(this.step3_data_final[iHdrCount].discounted_price),
          "OPTM_PRODTOTAL": Number(this.step3_data_final[iHdrCount].price_ext),
          "OPTM_TOTALBEFOREDIS": Number(this.step3_data_final[iHdrCount].price),
          "OPTM_PRODDISCOUNT": Number(this.step3_data_final[iHdrCount].feature_discount_percent),
          "OPTM_ACCESSORYDIS": this.step3_data_final[iHdrCount].accessory_discount_percent,
          "OPTM_ACCESSORYTOTAL": "",
          "OPTM_TOTALDISCOUNT": "",
          "model_index": iHdrCount,
        })
      }
    } else {
      final_dataset_to_save.OPConfig_OUTPUTHDR.push({
        "OPTM_LOGID": this.iLogID,
        "OPTM_OUTPUTID": "",
        "OPTM_DOCTYPE": this.step1_data.document,
        "OPTM_BPCODE": this.step1_data.customer,
        "OPTM_SHIPTO": this.step1_data.ship_to,
        "OPTM_BILLTO": this.step1_data.bill_to,
        "OPTM_CONTACTPERSON": this.step1_data.person_name,
        "OPTM_TAX": this.acc_item_tax,
        "OPTM_PAYMENTTERM": 0,
        "OPTM_FGITEM": "",
        "OPTM_KEY": "",
        "OPTM_DELIVERYDATE": delivery_date_string,
        "OPTM_QUANTITY": 0,
        "OPTM_CREATEDBY": this.common_output_data.username,
        "OPTM_MODIFIEDBY": this.common_output_data.username,
        "OPTM_DESC": "",
        "OPTM_SALESEMP": this.step1_data.sales_employee,
        "OPTM_OWNER": this.step1_data.owner,
        "OPTM_REMARKS": this.step1_data.remark,
        "OPTM_BILLADD": this.step1_data.bill_to_address,
        "OPTM_SHIPADD": this.step1_data.ship_to_address,
        "OPTM_POSTINGDATE": this.step1_data.posting_date,
        "OPTM_GRANDTOTAL": 0,
        "OPTM_PRODTOTAL": 0,
        "OPTM_TOTALBEFOREDIS": 0,
        "OPTM_PRODDISCOUNT": 0,
        "OPTM_ACCESSORYDIS": "0",
        "OPTM_ACCESSORYTOTAL": "0",
        "OPTM_TOTALDISCOUNT": "0",
      });
    }

    //creating details table array
    if (this.step3_data_final.length > 0 && this.step3_data_final !== undefined) {
      final_dataset_to_save.OPConfig_OUTPUTDTL = this.step2_final_dataset_to_save;
      // populate routing data array - start

      for (let indexx = 0; indexx < this.step3_data_final.length; indexx++) {
        let step3_temp_row = this.step3_data_final[indexx];

        if (step3_temp_row.ModelHeaderItemsArray[0] != undefined) {
          final_dataset_to_save.routing_model.push({
            DocEntry: step3_temp_row.ModelHeaderItemsArray[0].DocEntry,
            OPTM_LINENO: step3_temp_row.ModelHeaderItemsArray[0].OPTM_LINENO,
            OPTM_MODELID: step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID,
            OPTM_TYPE: step3_temp_row.ModelHeaderItemsArray[0].OPTM_TYPE,
            OPTM_MANDATORY: step3_temp_row.ModelHeaderItemsArray[0].OPTM_MANDATORY,
            OPTM_UOM: step3_temp_row.ModelHeaderItemsArray[0].OPTM_UOM,
            OPTM_UNIQUEIDNT: step3_temp_row.ModelHeaderItemsArray[0].OPTM_UNIQUEIDNT,
            Price: parseFloat(step3_temp_row.ModelHeaderItemsArray[0].Price).toFixed(3),
            feature_code: step3_temp_row.ModelHeaderItemsArray[0].feature_code,
            child_code: step3_temp_row.ModelHeaderItemsArray[0].child_code,
            OPTM_LEVEL: step3_temp_row.ModelHeaderItemsArray[0].OPTM_LEVEL,
            ITEMCODEGENREF: step3_temp_row.ModelHeaderItemsArray[0].ITEMCODEGENREF,
          });
        } else {
          final_dataset_to_save.routing_model.push({
            DocEntry: step3_temp_row.model_id,
            OPTM_LINENO: step3_temp_row.rowIndex,
            OPTM_MODELID: step3_temp_row.model_id,
            OPTM_TYPE: '2',
            OPTM_MANDATORY: 'N',
            OPTM_UOM: 'each',
            OPTM_UNIQUEIDNT: 'Y',
            Price: parseFloat(step3_temp_row.price).toFixed(3),
            feature_code: "",
            child_code: "",
            OPTM_LEVEL: 0,
            ITEMCODEGENREF: step3_temp_row.itemcodegenkey,
          });
        }

        for (let f_indexx = 0; f_indexx < step3_temp_row.ModelHeaderData.length; f_indexx++) {
          let modelid_val = '';
          if (step3_temp_row.ModelHeaderData[f_indexx].OPTM_MODELID != "" && step3_temp_row.ModelHeaderData[f_indexx].OPTM_MODELID != null) {
            modelid_val = step3_temp_row.ModelHeaderData[f_indexx].OPTM_MODELID;
          } else {
            if (step3_temp_row.ModelHeaderData[f_indexx].parentmodelid != "" && step3_temp_row.ModelHeaderData[f_indexx].parentmodelid != null) {
              modelid_val = step3_temp_row.ModelHeaderData[f_indexx].parentmodelid;
            } else {
              if (step3_temp_row.ModelHeaderItemsArray[0] != undefined && step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID != "" && step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID != null) {
                modelid_val = step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID;
              } else {
                if (step3_temp_row.model_id != "" && step3_temp_row.model_id != null) {
                  modelid_val = step3_temp_row.model_id;
                }
              }
            }

          }
          final_dataset_to_save.routing_model_feature_data.push({
            ACCESSORY: step3_temp_row.ModelHeaderData[f_indexx].ACCESSORY,
            ITEMCODEGENREF: step3_temp_row.ModelHeaderData[f_indexx].ITEMCODEGENREF,
            MODELTEMPLATEITEM: step3_temp_row.ModelHeaderData[f_indexx].MODELTEMPLATEITEM,
            OPTM_CHILDMODELID: step3_temp_row.ModelHeaderData[f_indexx].OPTM_CHILDMODELID,
            OPTM_DISPLAYNAME: step3_temp_row.ModelHeaderData[f_indexx].OPTM_DISPLAYNAME,
            OPTM_FEATUREID: step3_temp_row.ModelHeaderData[f_indexx].OPTM_FEATUREID,
            OPTM_ITEMKEY: step3_temp_row.ModelHeaderData[f_indexx].OPTM_ITEMKEY,
            OPTM_LEVEL: step3_temp_row.ModelHeaderData[f_indexx].OPTM_LEVEL,
            OPTM_LINENO: step3_temp_row.ModelHeaderData[f_indexx].OPTM_LINENO,
            OPTM_MANDATORY: step3_temp_row.ModelHeaderData[f_indexx].OPTM_MANDATORY,
            OPTM_MODELID: modelid_val,
            OPTM_TYPE: step3_temp_row.ModelHeaderData[f_indexx].OPTM_TYPE,
            OPTM_UNIQUEIDNT: step3_temp_row.ModelHeaderData[f_indexx].OPTM_UNIQUEIDNT,
            OPTM_UOM: step3_temp_row.ModelHeaderData[f_indexx].OPTM_UOM,
            Price: step3_temp_row.ModelHeaderData[f_indexx].Price,
            child_code: step3_temp_row.ModelHeaderData[f_indexx].child_code,
            feature_code: step3_temp_row.ModelHeaderData[f_indexx].feature_code,
            parentfeatureid: step3_temp_row.ModelHeaderData[f_indexx].parentfeatureid,
            parentmodelid: step3_temp_row.ModelHeaderData[f_indexx].parentmodelid,
          });
        }


        for (let us_indexx = 0; us_indexx < step3_temp_row.feature.length; us_indexx++) {
          let modelid_val = '';
          if (step3_temp_row.feature[us_indexx].ModelId && step3_temp_row.feature[us_indexx].ModelId != null) {
            modelid_val = step3_temp_row.feature[us_indexx].ModelId
          } else {
            if (step3_temp_row.ModelHeaderItemsArray[0] != undefined && step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID != "" && step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID != null) {
              modelid_val = step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID;
            } else {
              if (step3_temp_row.model_id != "" && step3_temp_row.model_id != null) {
                modelid_val = step3_temp_row.model_id;
              }
            }
          }

          let ItemNo = "";
          if (step3_temp_row.feature[us_indexx].ItemNumber != undefined && step3_temp_row.feature[us_indexx].ItemNumber != "") {
            ItemNo = (step3_temp_row.feature[us_indexx].ItemNumber).toString();
          } else {
            ItemNo = "";
          }

          final_dataset_to_save.routing_user_selection.push({
            Actualprice: step3_temp_row.feature[us_indexx].Actualprice,
            Description: step3_temp_row.feature[us_indexx].Description,
            FeatureId: step3_temp_row.feature[us_indexx].FeatureId,
            HEADER_LINENO: step3_temp_row.feature[us_indexx].HEADER_LINENO,
            Item: step3_temp_row.feature[us_indexx].Item,
            ItemNumber: (ItemNo),
            ModelId: modelid_val,
            OPTM_LEVEL: step3_temp_row.feature[us_indexx].OPTM_LEVEL,
            dicount_amount: step3_temp_row.feature[us_indexx].dicount_amount,
            discount: step3_temp_row.feature[us_indexx].discount,
            featureName: step3_temp_row.feature[us_indexx].featureName,
            gross: parseFloat(step3_temp_row.feature[us_indexx].gross).toFixed(3),
            isPriceDisabled: step3_temp_row.feature[us_indexx].isPriceDisabled,
            isQuantityDisabled: step3_temp_row.feature[us_indexx].isQuantityDisabled,
            is_accessory: step3_temp_row.feature[us_indexx].is_accessory,
            ispropogateqty: step3_temp_row.feature[us_indexx].ispropogateqty,
            price: step3_temp_row.feature[us_indexx].price,
            pricehide: step3_temp_row.feature[us_indexx].pricehide,
            pricextn: parseFloat(step3_temp_row.feature[us_indexx].pricextn).toFixed(3),
            quantity: step3_temp_row.feature[us_indexx].quantity,
          });
        }

      }
      // populate routing data array - end

      // modify exiting all data push block  - start
      for (let me_d_v_i = 0; me_d_v_i < this.step3_data_final.length; me_d_v_i++) {
        let me_d_v_row = this.step3_data_final[me_d_v_i];

        let temp_modelheder_data = me_d_v_row.ModelHeaderData;
        for (let mhd_i = 0; mhd_i < temp_modelheder_data.length; mhd_i++) {
          delete temp_modelheder_data[mhd_i]['OPTM_MODIFIEDDATETIME'];
          delete temp_modelheder_data[mhd_i]['random_unique_key'];
          /* delete temp_modelheder_data[mhd_i]['nodeid']; */
          temp_modelheder_data[mhd_i]['model_index'] = me_d_v_i;
          if (temp_modelheder_data[mhd_i].OPTM_QUANTITY != null && temp_modelheder_data[mhd_i].OPTM_QUANTITY != undefined && temp_modelheder_data[mhd_i].OPTM_QUANTITY != "") {
            temp_modelheder_data[mhd_i].OPTM_QUANTITY = parseFloat(temp_modelheder_data[mhd_i].OPTM_QUANTITY).toFixed(3);
          }

          if (temp_modelheder_data[mhd_i].Price == null || temp_modelheder_data[mhd_i].Price == "" || isNaN(temp_modelheder_data[mhd_i].Price)) {
            temp_modelheder_data[mhd_i].Price = parseFloat('0').toFixed(3);
          } else {
            temp_modelheder_data[mhd_i].Price = parseFloat(temp_modelheder_data[mhd_i].Price).toFixed(3);
          }
          final_dataset_to_save.ModelHeaderData.push(temp_modelheder_data[mhd_i]);
        }

        let modelheader_item_array = me_d_v_row.ModelHeaderItemsArray;
        for (let mhia_i = 0; mhia_i < modelheader_item_array.length; mhia_i++) {
          modelheader_item_array[mhia_i]['model_index'] = me_d_v_i;
          if ((modelheader_item_array[mhia_i].OPTM_QUANTITY != null && modelheader_item_array[mhia_i].OPTM_QUANTITY != undefined && modelheader_item_array[mhia_i].OPTM_QUANTITY != "") || modelheader_item_array[mhia_i].OPTM_QUANTITY == 0) {
            modelheader_item_array[mhia_i].OPTM_QUANTITY = parseFloat(modelheader_item_array[mhia_i].OPTM_QUANTITY).toFixed(3);
          }

          if (modelheader_item_array[mhia_i].Price == null || modelheader_item_array[mhia_i].Price == "" || isNaN(modelheader_item_array[mhia_i].Price)) {
            modelheader_item_array[mhia_i].Price = parseFloat('0').toFixed(3);
          } else {
            modelheader_item_array[mhia_i].Price = parseFloat(modelheader_item_array[mhia_i].Price).toFixed(3);
          }
          final_dataset_to_save.ModelHeaderData.push(modelheader_item_array[mhia_i]);
        }

        if (me_d_v_row.selectedAccessoryBOM != null && me_d_v_row.selectedAccessoryBOM != undefined && me_d_v_row.selectedAccessoryBOM != "") {
          let temp_selectedAccessoryBOM = me_d_v_row.selectedAccessoryBOM;
          for (let sabom_i = 0; sabom_i < temp_selectedAccessoryBOM.length; sabom_i++) {
            temp_selectedAccessoryBOM[sabom_i]['model_index'] = me_d_v_i;
            if ((temp_selectedAccessoryBOM[sabom_i].OPTM_QUANTITY != null && temp_selectedAccessoryBOM[sabom_i].OPTM_QUANTITY != undefined && temp_selectedAccessoryBOM[sabom_i].OPTM_QUANTITY != "") || temp_selectedAccessoryBOM[sabom_i].OPTM_QUANTITY == 0) {
              temp_selectedAccessoryBOM[sabom_i].OPTM_QUANTITY = parseFloat(temp_selectedAccessoryBOM[sabom_i].OPTM_QUANTITY).toFixed(3);
            }
            final_dataset_to_save.SelectedAccessoryBOM.push(temp_selectedAccessoryBOM[sabom_i]);
          }
        }
        let temp_Accessoryarray = me_d_v_row.Accessoryarray;
        for (let ahdr_i = 0; ahdr_i < temp_Accessoryarray.length; ahdr_i++) {
          temp_Accessoryarray[ahdr_i]['model_index'] = me_d_v_i;
          if ((temp_Accessoryarray[ahdr_i].OPTM_QUANTITY != null && temp_Accessoryarray[ahdr_i].OPTM_QUANTITY != undefined && temp_Accessoryarray[ahdr_i].OPTM_QUANTITY != "") || temp_Accessoryarray[ahdr_i].OPTM_QUANTITY == 0) {
            temp_Accessoryarray[ahdr_i].OPTM_QUANTITY = parseFloat(temp_Accessoryarray[ahdr_i].OPTM_QUANTITY).toFixed(3);
          }
          final_dataset_to_save.SelectedAccessory.push(temp_Accessoryarray[ahdr_i]);
        }

        let temp_ModelBOMDataForSecondLevel = me_d_v_row.ModelBOMDataForSecondLevel;
        for (let mbomd_i = 0; mbomd_i < temp_ModelBOMDataForSecondLevel.length; mbomd_i++) {
          temp_ModelBOMDataForSecondLevel[mbomd_i]['model_index'] = me_d_v_i;
          if ((temp_ModelBOMDataForSecondLevel[mbomd_i].OPTM_QUANTITY != null && temp_ModelBOMDataForSecondLevel[mbomd_i].OPTM_QUANTITY != undefined && temp_ModelBOMDataForSecondLevel[mbomd_i].OPTM_QUANTITY != "") || temp_ModelBOMDataForSecondLevel[mbomd_i].OPTM_QUANTITY == 0) {
            temp_ModelBOMDataForSecondLevel[mbomd_i].OPTM_QUANTITY = parseFloat(temp_ModelBOMDataForSecondLevel[mbomd_i].OPTM_QUANTITY).toFixed(3);
          }

          if (temp_ModelBOMDataForSecondLevel[mbomd_i].Price == null || temp_ModelBOMDataForSecondLevel[mbomd_i].Price == "" || isNaN(temp_ModelBOMDataForSecondLevel[mbomd_i].Price)) {
            temp_ModelBOMDataForSecondLevel[mbomd_i].Price = parseFloat('0').toFixed(3);
          } else {
            temp_ModelBOMDataForSecondLevel[mbomd_i].Price = parseFloat(temp_ModelBOMDataForSecondLevel[mbomd_i].Price).toFixed(3);
          }
          final_dataset_to_save.ModelBOMDataForSecondLevel.push(temp_ModelBOMDataForSecondLevel[mbomd_i]);
        }

        let temp_FeatureBOMDataForSecondLevel = me_d_v_row.FeatureBOMDataForSecondLevel;
        for (let fbdsl_i = 0; fbdsl_i < temp_FeatureBOMDataForSecondLevel.length; fbdsl_i++) {
          temp_FeatureBOMDataForSecondLevel[fbdsl_i]['model_index'] = me_d_v_i;
          if ((temp_FeatureBOMDataForSecondLevel[fbdsl_i].OPTM_QUANTITY != null && temp_FeatureBOMDataForSecondLevel[fbdsl_i].OPTM_QUANTITY != undefined && temp_FeatureBOMDataForSecondLevel[fbdsl_i].OPTM_QUANTITY != "") || temp_FeatureBOMDataForSecondLevel[fbdsl_i].OPTM_QUANTITY == 0) {
            temp_FeatureBOMDataForSecondLevel[fbdsl_i].OPTM_QUANTITY = parseFloat(temp_FeatureBOMDataForSecondLevel[fbdsl_i].OPTM_QUANTITY).toFixed(3);
          }

          if (temp_FeatureBOMDataForSecondLevel[fbdsl_i].Price == null || temp_FeatureBOMDataForSecondLevel[fbdsl_i].Price == "" || isNaN(temp_FeatureBOMDataForSecondLevel[fbdsl_i].Price)) {
            temp_FeatureBOMDataForSecondLevel[fbdsl_i].Price = parseFloat('0').toFixed(3);
          } else {
            temp_FeatureBOMDataForSecondLevel[fbdsl_i].Price = parseFloat(temp_FeatureBOMDataForSecondLevel[fbdsl_i].Price).toFixed(3);
          }
          final_dataset_to_save.FeatureBOMDataForSecondLevel.push(temp_FeatureBOMDataForSecondLevel[fbdsl_i]);
        }

        let temp_RuleOutputData = me_d_v_row.RuleOutputData;
        for (let rod_i = 0; rod_i < temp_RuleOutputData.length; rod_i++) {
          temp_RuleOutputData[rod_i]['model_index'] = me_d_v_i;
          final_dataset_to_save.RuleOutputData.push(temp_RuleOutputData[rod_i]);
        }

        let temp_MainModelDetails = me_d_v_row.MainModelDetails;
        for (let index = 0; index < temp_MainModelDetails.length; index++) {
          temp_MainModelDetails[index]['model_index'] = me_d_v_i;
          final_dataset_to_save.MainModelDetails.push(temp_MainModelDetails[index]);
        }
        me_d_v_row.MainModelDetails

      }
      // modify exiting all data push block  - end
    }

    // final_dataset_to_save.OPConfig_OUTPUTDTL=this.step4_final_DetailModelData
    if (button_press == undefined) {
      button_press = "finishPress"
    }
    //creating connection detials
    final_dataset_to_save.ConnectionDetails.push({
      CompanyDBID: this.common_output_data.companyName,
      ScreenData: screen_name,
      OperationType: this.step1_data.main_operation_type,
      Button: button_press,
      currentDate: this.submit_date
      //ConfigType: this.step1_data.main_operation_type
    })

    final_dataset_to_save.apidata.push({
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    })

    console.log(final_dataset_to_save);
    var obj = this;
    // final data submission 


    this.showLookupLoader = true;
    this.OutputService.AddUpdateCustomerData(final_dataset_to_save).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0 && data != undefined) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
          if (data[0].Status == "True") {
            this.showLookupLoader = false;
            this.iLogID = data[0].LogId;
            this.toastr.success('', this.language.OperCompletedSuccess, this.commonData.toast_config);
            if (button_press == 'finishPress') {
              setTimeout(function () {
                obj.getFinalBOMStatus();
              }, 100);
            }
          }
          else {
            this.showLookupLoader = false;
            this.toastr.error('', this.language.no_item_selected, this.commonData.toast_config);
            return;
          }

        }
        else {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }
      },

      error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return;
      }
    )
  }

  colSpanValue(e) {
    setTimeout(() => {
      $('.opti_screen4-detail-row-lastchildTable .k-detail-row td.k-detail-cell').attr('colspan', 9);
    }, 1000);
  }
  delete_multiple_final_modal() {
    console.log(this.final_array_checked_options);
    if (this.final_array_checked_options.length > 0) {

      this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
      this.show_dialog = true;

    } else {
      this.toastr.error('', this.language.no_model_selected, this.commonData.toast_config);
    }

  }

  remove_final_modal(row_data) {
    this.isMultiDelete = false;
    this.final_row_data = row_data;
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
  }

  on_checkbox_checked(checkedvalue, row_data) {
    this.rows = row_data;
    if (checkedvalue.checked == true) {
      this.isMultiDelete = true;
      this.final_array_checked_options.push(row_data);
    }
    else {
      let i = this.final_array_checked_options.indexOf(row_data);
      this.final_array_checked_options.splice(i, 1)
    }
    console.log(this.final_array_checked_options);
  }

  refresh_bom_status() {
    this.showLookupLoader = true;
    this.dontShowFinalLoader = true;
    this.showFinalLoader = false;
    this.getFinalBOMStatus();
  }

  check_component_exist(component, level) {
    level = (parseInt(level) + 1);
    let data = this.tree_data_json.filter(function (obj) {
      return obj['parentId'] == component && obj['level'] == level;
    });
    return data;
  }

  //Row Deletion
  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      if (this.isMultiDelete == false) {
        this.delete_row();
      }
      else {
        this.delete_all_row_data();
      }
    }
    this.show_dialog = false;
  }

  delete_row() {
    this.cleanupAccessories(this.final_row_data.model_id);
    this.cleanupFeatureItemList(this.final_row_data.model_id);
    this.cleanuptree();
    this.cleanupFinalArray(this.final_row_data.model_id);

    this.feature_item_tax = 0;
    this.feature_item_total = 0;
    this.acc_item_tax = 0;
    this.accessory_discount_percent = 0;
    this.accessory_item_total = 0;
    this.acc_grand_total = 0;
    this.step2_data.modal_id = '';
    this.step2_data.model_code = '';
    this.feature_itm_list_table = [];
    this.selectedAccessoryBOM = [];

    this.feature_accessory_list = [];
    $(".accesory_check_for_second_screen").prop('checked', false);
    this.step2_selected_model_id = '';
    this.step2_selected_model = '';

    //After the removal of all data of that model will recalculate the prices
    this.feature_price_calculate();
    this.step4_final_price_calculation();

    if (this.step3_data_final.length > 0) {
      for (let index = 0; index < this.step3_data_final.length; index++) {
        this.step3_data_final[index].rowIndex = this.step3_data_final.indexOf(this.step3_data_final[index]);
      }
    }
    this.toastr.success('', this.language.multiple_model_delete, this.commonData.toast_config);

  }

  delete_all_row_data() {
    for (let iCount = 0; iCount < this.final_array_checked_options.length; iCount++) {
      //clean Accessory List Array
      this.cleanupAccessories(this.final_array_checked_options[iCount].model_id);
      //Clean Feature List Array
      this.cleanupFeatureItemList(this.final_array_checked_options[iCount].model_id);
      //Clean Final Array (step3_data_final_data)
      this.cleanupFinalArray(this.final_array_checked_options[iCount].model_id);
    }

    //Clean Tree Data
    this.cleanuptree();

    //After the removal of all data of that model will recalculate the prices
    this.feature_price_calculate();
  }

  cleanupAccessories(current_model_id) {
    //Get the modal id and clean the data of accessories here
    for (let count = 0; count < this.feature_accessory_list.length; count++) {
      if (current_model_id == this.feature_accessory_list[count].model_id) {
        this.feature_accessory_list.splice(count, 1);
        count = count - 1;
      }
    }
  }

  cleanupFeatureItemList(current_model_id) {
    //Get the modal id and clean the data of Features List here
    for (let count = 0; count < this.feature_itm_list_table.length; count++) {
      if (current_model_id == this.feature_itm_list_table[count].ModelId) {
        this.feature_itm_list_table.splice(count, 1);
        count = count - 1;
      }
    }

  }

  cleanupFinalArray(current_model_id) {
    //Get the modal id and clean the data of Features List here
    for (let count = 0; count < this.step3_data_final.length; count++) {
      if (current_model_id == this.step3_data_final[count].model_id) {
        this.step3_data_final.splice(count, 1);
        count = count - 1;
      }
    }
  }

  cleanuptree() {
    this.tree_data_json = [];
    this.complete_dataset = [];
    this.tree_data_json.length = 0;
    this.complete_dataset.length = 0;
    this.ModelHeaderData = [];
    this.RuleOutputData = [];
    this.FeatureBOMDataForSecondLevel = [];
    this.ModelBOMDataForSecondLevel = [];
  }

  onAddedModelChange(model_row_index, from_step4) {
    this.lookupfor = "";
    console.log(model_row_index);
    if (model_row_index != "" && model_row_index != undefined) {
      this.showLookupLoader = true;
      this.onclearselection(0);
      var current_row = 0;
      for (var i = 0; i < this.step3_data_final.length; i++) {
        if (this.step3_data_final[i] !== undefined) {
          if (this.step3_data_final[i].rowIndex == model_row_index) {
            current_row = i;

          }
        }
      }

      this.step2_selected_model = this.step3_data_final[current_row];
      this.step2_data.model_id = this.step2_selected_model.model_id;
      this.step2_data.model_code = this.step2_selected_model.item;
      this.step2_data.model_name = this.step2_selected_model.desc
      this.step2_data.quantity = parseInt(this.step2_selected_model.quantity);
      this.feature_accessory_list = this.step2_selected_model.accesories;
      this.feature_itm_list_table = this.step2_selected_model.feature;
      this.ModelHeaderData = this.step2_selected_model.ModelHeaderData;
      this.RuleOutputData = this.step2_selected_model.RuleOutputData;
      this.FeatureBOMDataForSecondLevel = this.step2_selected_model.FeatureBOMDataForSecondLevel;
      this.ModelBOMDataForSecondLevel = this.step2_selected_model.ModelBOMDataForSecondLevel;
      this.step2_selected_model_id = model_row_index;
      this.feature_discount_percent = this.step2_selected_model.feature_discount_percent;
      this.accessory_discount_percent = this.step2_selected_model.accessory_discount_percent;
      this.ModelHeaderItemsArray = this.step2_selected_model.ModelHeaderItemsArray;
      this.step2_data.templateid = this.step2_selected_model.templateid;
      this.step2_data.itemcodegenkey = this.step2_selected_model.itemcodegenkey;
      this.Accessoryarray = this.step2_selected_model.Accessoryarray;
      this.selectedAccessoryHeader = this.step2_selected_model.Accessoryarray
      this.selectedAccessoryBOM = this.step2_selected_model.selectedAccessoryBOM;
      this.feature_price_calculate();
      this.showLookupLoader = false;

    } else {
      this.onclearselection(1);
    }

  }

  step4_edit_model(model_data) {
    this.onAddedModelChange(model_data.rowIndex, function () {
      // $("fieldset").hide();
      // $("fieldset").eq(2).show();
      $(document).find('button[data-previous-block="model_bom_config"]').trigger("click");
    });

  }

  step4_final_price_calculation() {

    this.step4_final_prod_total = 0;
    this.step4_final_acc_total = 0;
    this.step4_final_grand_total = 0;
    this.prod_discount_log = 0;
    this.access_dis_amount_log = 0;

    if (this.step3_data_final.length > 0 && this.step3_data_final != undefined) {
      for (var i = 0; i < this.step3_data_final.length; i++) {
        let step3_temp = this.step3_data_final[i];
        this.step4_final_prod_total += Number(step3_temp.price_ext);
        this.step4_final_acc_total += Number(step3_temp.accessory_total_before_dis);
        this.prod_discount_log += Number(step3_temp.discount_amount);
        this.access_dis_amount_log += Number(step3_temp.accessory_discount_amount);
      }
    }
    this.step4_final_grand_total = (Number(this.step4_final_prod_total) + Number(this.step4_final_acc_total)) - (this.prod_discount_log + this.access_dis_amount_log);

  }


  add_fg_multiple_model(callback) {
    var obj = this;
    this.lookupfor = "";
    this.onValidateNextPress(false, function () {
      if (obj.step3_data_final.length > 0 && obj.step3_data_final != undefined && obj.step2_selected_model_id != "") {
        for (var i = 0; i < obj.step3_data_final.length; i++) {
          if (obj.step3_data_final[i].rowIndex == obj.step2_selected_model_id) {
            obj.fill_step3_data_array('update', i);
          }
        }
      } else {
        obj.fill_step3_data_array('add', '0');
      }

      //this will update rowIndex  in correct order of there are multiModels and when add operation is performed
      if (obj.step3_data_final.length > 0) {
        for (let index = 0; index < obj.step3_data_final.length; index++) {
          obj.step3_data_final[index].rowIndex = obj.step3_data_final.indexOf(obj.step3_data_final[index]);
        }
      }

      setTimeout(() => {
        obj.onclearselection(1);
        $(".accesory_check_for_second_screen").prop('checked', false);
        $(".multiple_model_click_btn").removeAttr("disabled");
        if (callback != "" && callback != undefined) {
          callback();
        }
      }, 400);
    })
  }

  update_added_model() {
    this.lookupfor = "";
    var obj = this;
    $(".multiple_model_click_btn").attr("disabled", "true");
    this.console.log(this.step3_data_final.length);
    this.onValidateNextPress(false, function () {
      if (obj.step3_data_final.length > 0 && obj.step3_data_final != undefined && obj.step2_selected_model_id != "") {
        for (var i = 0; i < obj.step3_data_final.length; i++) {
          if (obj.step3_data_final[i] !== undefined) {
            if (obj.step3_data_final[i].rowIndex == obj.step2_selected_model_id) {
              obj.fill_step3_data_array('update', i);
            }
          }
        }
      }
    });

    $(".multiple_model_click_btn").removeAttr("disabled");
  }

  fill_step3_data_array(mode, row_id) {
    $(".multiple_model_click_btn").attr("disabled", "true");
    let feature_discount: any = 0;
    let fg_discount_amount: any = 0;
    if (this.discount_price !== undefined && this.discount_price != 0) {
      feature_discount = Number(this.discount_price);
    }

    if (this.feature_discount_percent !== undefined && this.feature_discount_percent != 0) {
      feature_discount = Number(this.feature_discount_percent);
    }

    let accessory_discount: any = 0;
    if (this.accessory_discount_percent !== undefined && this.accessory_discount_percent != 0) {
      accessory_discount = Number(this.accessory_discount_percent);
    }
    let product_total: any = 0;

    /*  if(accessory_discount == 0){
       product_total = Number(this.feature_total_before_discount) - Number(this.accessory_item_total);
     } else {
       
       product_total = Number(this.feature_total_before_discount) - Number((Number(this.accessory_item_total) * (Number(accessory_discount) / 100))); 
     } */
    /* 
        if(feature_discount == 0){
          product_total = Number(this.feature_item_total);
        } else {
          product_total = Number(this.feature_item_total) - Number((Number(this.feature_item_total) * (Number(accessory_discount) / 100))) ;
        } */

    product_total = this.step3_feature_price_bef_dis;
    // step3_acc_price_bef_dis

    let per_item_price: any = (product_total / Number(this.step2_data.quantity));
    let price_ext: any = product_total;
    let rowIndex = 0;
    let sl_no = 0;
    let tota_dis_on_acces: any = 0;
    let acc_total_before_dis: any = 0;
    if (feature_discount != 0) {
      fg_discount_amount = (price_ext * feature_discount) / 100;
    } else {
      fg_discount_amount = 0;
    }

    for (let fiti = 0; fiti < this.feature_itm_list_table.length; fiti++) {
      var discount_amount = 0;
      this.feature_itm_list_table[fiti].gross = Number(this.feature_itm_list_table[fiti].pricextn);
      this.feature_itm_list_table[fiti].discount = 0;
      if (this.feature_itm_list_table[fiti].is_accessory == 'Y') {
        acc_total_before_dis += Number(this.feature_itm_list_table[fiti].pricextn);
        if (accessory_discount != 0) {
          discount_amount = (this.feature_itm_list_table[fiti].pricextn * (accessory_discount / 100));
          tota_dis_on_acces += Number(discount_amount);
          this.feature_itm_list_table[fiti].gross = (Number(this.feature_itm_list_table[fiti].pricextn) - Number(discount_amount)).toFixed(3);
          this.feature_itm_list_table[fiti].discount = (accessory_discount);
        }
      } else {
        if (feature_discount != 0) {
          discount_amount = (this.feature_itm_list_table[fiti].pricextn * (feature_discount / 100));
          this.feature_itm_list_table[fiti].gross = (Number(this.feature_itm_list_table[fiti].pricextn) - Number(discount_amount)).toFixed(3);
          this.feature_itm_list_table[fiti].discount = (feature_discount);
        }
      }
      this.feature_itm_list_table[fiti].dicount_amount = (discount_amount).toFixed(3);
    }

    if (mode == 'add') {
      if (this.step3_data_final.length > 0) {
        rowIndex = this.step3_data_final.length;
        sl_no = this.step3_data_final.length;
      }
      rowIndex++;
      sl_no++;
      this.step3_data_final.push({
        "rowIndex": rowIndex,
        "sl_no": sl_no,
        "item": this.step2_data.model_code,
        "quantity": parseFloat(this.step2_data.quantity).toFixed(3),
        "price": parseFloat(per_item_price).toFixed(3),
        "price_ext": parseFloat(price_ext).toFixed(3),
        "discounted_price": (this.feature_item_total).toFixed(3),
        "discount_amount": (fg_discount_amount).toFixed(3),
        "accessory_discount_amount": parseFloat(tota_dis_on_acces).toFixed(3),
        "accessory_total_before_dis": parseFloat(acc_total_before_dis).toFixed(3),
        "feature": this.feature_itm_list_table,
        "accesories": this.feature_accessory_list,
        "selectedAccessoryBOM": this.selectedAccessoryBOM,
        "accessory_item_total": (this.accessory_item_total).toFixed(3),
        "model_id": this.step2_data.model_id,
        "desc": this.step2_data.model_name,
        "MainModelDetails" : this.MainModelDetails,
        "ModelHeaderData": this.ModelHeaderData,
        "RuleOutputData": this.RuleOutputData,
        "FeatureBOMDataForSecondLevel": this.FeatureBOMDataForSecondLevel,
        "ModelBOMDataForSecondLevel": this.ModelBOMDataForSecondLevel,
        "feature_discount_percent": (feature_discount).toFixed(3),
        "accessory_discount_percent": (accessory_discount).toFixed(3),
        "accesory_final_price": (this.accessory_item_total).toFixed(3),
        "templateid": this.step2_data.templateid,
        "itemcodegenkey": this.step2_data.itemcodegenkey,
        "ModelHeaderItemsArray": this.ModelHeaderItemsArray,
        "Accessoryarray": this.selectedAccessoryHeader,
      });
      // this.toastr.success('', this.language.multiple_model_update, this.commonData.toast_config);
    } else {
      this.step3_data_final[row_id]["item"] = this.step2_data.model_code;
      this.step3_data_final[row_id]["quantity"] = parseFloat(this.step2_data.quantity).toFixed(3);
      this.step3_data_final[row_id]["price"] = parseFloat(per_item_price).toFixed(3);
      this.step3_data_final[row_id]["price_ext"] = parseFloat(price_ext).toFixed(3);
      this.step3_data_final[row_id]["discounted_price"] = (this.feature_item_total).toFixed(3);
      this.step3_data_final[row_id]["discount_amount"] = (fg_discount_amount).toFixed(3);
      this.step3_data_final[row_id]["accessory_discount_amount"] = parseFloat(tota_dis_on_acces).toFixed(3);
      this.step3_data_final[row_id]["accessory_total_before_dis"] = parseFloat(acc_total_before_dis).toFixed(3);
      this.step3_data_final[row_id]["feature"] = this.feature_itm_list_table;
      this.step3_data_final[row_id]["accesories"] = this.feature_accessory_list;
      this.step3_data_final[row_id]["selectedAccessoryBOM"] = this.selectedAccessoryBOM;
      this.step3_data_final[row_id]["model_id"] = this.step2_data.model_id;
      this.step3_data_final[row_id]["desc"] = this.step2_data.model_name;
      this.step3_data_final[row_id]["MainModelDetails"] = this.MainModelDetails;
      this.step3_data_final[row_id]["ModelHeaderData"] = this.ModelHeaderData;
      this.step3_data_final[row_id]["FeatureBOMDataForSecondLevel"] = this.FeatureBOMDataForSecondLevel;
      this.step3_data_final[row_id]["ModelBOMDataForSecondLevel"] = this.ModelBOMDataForSecondLevel;
      this.step3_data_final[row_id]["feature_discount_percent"] = (feature_discount).toFixed(3);
      this.step3_data_final[row_id]["accessory_discount_percent"] = (accessory_discount).toFixed(3);
      this.step3_data_final[row_id]["accesory_final_price"] = (this.accessory_item_total).toFixed(3);
      this.step3_data_final[row_id]["accessory_item_total"] = (this.accessory_item_total).toFixed(3);
      this.step3_data_final[row_id]["templateid"] = this.step2_data.templateid;
      this.step3_data_final[row_id]["itemcodegenkey"] = this.step2_data.itemcodegenkey;
      this.step3_data_final[row_id]["ModelHeaderItemsArray"] = this.ModelHeaderItemsArray;
      this.step3_data_final[row_id]["Accessoryarray"] = this.selectedAccessoryHeader;
      this.step3_data_final[row_id]["RuleOutputData"] = this.RuleOutputData;
      this.toastr.success('', this.language.multiple_model_update, this.commonData.toast_config);
    }
    this.console.log("this.step3_data_final");
    this.console.log(this.step3_data_final);
    this.step4_final_price_calculation();
    $(".multiple_model_click_btn").removeAttr("disabled");
  }



  onValidateNextPress(navigte, for_multiple_model) {
    this.navigatenextbtn = false;
    this.validnextbtn = true;
    if (navigte == true && this.step3_data_final.length > 0) {
      $("#modelbom_next_click_id").trigger('click');
      return;
    }

    if (this.feature_itm_list_table.length == 0 && this.step3_data_final.length == 0) {
      this.toastr.error('', this.language.no_item_selected, this.commonData.toast_config);
      return;
    }

    var isMandatoryItems = this.ModelHeaderData.filter(function (obj) {
      return obj['OPTM_MANDATORY'] == "Y"
    })
    //  let isMandatoryCount = 0;
    // var counted = 0;
    // var itemnotselectedarray = [];
    var get_min_select_list = [];

    if (isMandatoryItems.length > 0) {
      for (let imandtory = 0; imandtory < isMandatoryItems.length; imandtory++) {
        get_min_select_list[imandtory] = {
          "min_selectable": isMandatoryItems[imandtory]['OPTM_MINSELECTABLE'],
          "actual": 0,
          "component_name": isMandatoryItems[imandtory].OPTM_DISPLAYNAME
        };
        if (isMandatoryItems[imandtory].OPTM_TYPE == "3") {
          /* for (let ifeatureitems = 0; ifeatureitems < this.feature_itm_list_table.length; ifeatureitems++) {
            // if (isMandatoryItems[imandtory].OPTM_CHILDMODELID == this.feature_itm_list_table[ifeatureitems].ModelId) {
              if (isMandatoryItems[imandtory].node_id == this.feature_itm_list_table[ifeatureitems].unique_id) {
              isMandatoryCount++;
              counted = 1;
              break;
            }
          // } 
          }*/
          /*for (let imodelBOMitems = 0; imodelBOMitems < this.ModelBOMDataForSecondLevel.length; imodelBOMitems++) {
            if(isMandatoryItems[imandtory].unique_key ==  this.ModelBOMDataForSecondLevel[imodelBOMitems].nodeid && this.ModelBOMDataForSecondLevel[imodelBOMitems].checked == true){
              isMandatoryCount++;
              counted = 1;
              break;
            }
          } */
          for (let imodelBOMitems = 0; imodelBOMitems < this.ModelBOMDataForSecondLevel.length; imodelBOMitems++) {
            if (isMandatoryItems[imandtory].unique_key == this.ModelBOMDataForSecondLevel[imodelBOMitems].nodeid && this.ModelBOMDataForSecondLevel[imodelBOMitems].checked == true) {
              get_min_select_list[imandtory]['actual']++;
            }
          }
        } else if (isMandatoryItems[imandtory].OPTM_TYPE == "1") {
          if (isMandatoryItems[imandtory].parentmodelid != "" && isMandatoryItems[imandtory].parentmodelid != null) {
            /*for (let ifeatureBOMitems = 0; ifeatureBOMitems < this.FeatureBOMDataForSecondLevel.length; ifeatureBOMitems++) {
              if (isMandatoryItems[imandtory].OPTM_FEATUREID == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].OPTM_FEATUREID && isMandatoryItems[imandtory].unique_key == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].nodeid && this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].checked == true && isMandatoryItems[imandtory].parentmodelid == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].parentmodelid) {
                isMandatoryCount++;
                counted = 1;
                break;
              }
            } */
            for (let ifeatureBOMitems = 0; ifeatureBOMitems < this.FeatureBOMDataForSecondLevel.length; ifeatureBOMitems++) {
              if (isMandatoryItems[imandtory].OPTM_FEATUREID == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].OPTM_FEATUREID && isMandatoryItems[imandtory].unique_key == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].nodeid && this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].checked == true && isMandatoryItems[imandtory].parentmodelid == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].parentmodelid) {
                get_min_select_list[imandtory]['actual']++;
              }
            }
          } else {
            /*for (let ifeatureBOMitems = 0; ifeatureBOMitems < this.FeatureBOMDataForSecondLevel.length; ifeatureBOMitems++) {
              if (isMandatoryItems[imandtory].OPTM_FEATUREID == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].OPTM_FEATUREID && isMandatoryItems[imandtory].feature_code == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].parent_code && this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].checked == true && isMandatoryItems[imandtory].unique_key == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].nodeid) {
                isMandatoryCount++;
                counted = 1;
                break;
              }
            } */
            for (let ifeatureBOMitems = 0; ifeatureBOMitems < this.FeatureBOMDataForSecondLevel.length; ifeatureBOMitems++) {
              if (isMandatoryItems[imandtory].OPTM_FEATUREID == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].OPTM_FEATUREID && isMandatoryItems[imandtory].feature_code == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].parent_code && this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].checked == true && isMandatoryItems[imandtory].unique_key == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].nodeid) {
                get_min_select_list[imandtory]['actual']++;
              }
            }
          }

          /*for (let imodelBOMitems = 0; imodelBOMitems < this.ModelBOMDataForSecondLevel.length; imodelBOMitems++) {
            if (isMandatoryItems[imandtory].OPTM_FEATUREID == this.ModelBOMDataForSecondLevel[imodelBOMitems].OPTM_FEATUREID && isMandatoryItems[imandtory].feature_code == this.ModelBOMDataForSecondLevel[imodelBOMitems].parent_code && this.ModelBOMDataForSecondLevel[imodelBOMitems].checked == true && isMandatoryItems[imandtory].unique_key == this.ModelBOMDataForSecondLevel[imodelBOMitems].unique_key) {
              isMandatoryCount++;
              counted = 1;
              break;
            }
          } */
          for (let imodelBOMitems = 0; imodelBOMitems < this.ModelBOMDataForSecondLevel.length; imodelBOMitems++) {
            if (isMandatoryItems[imandtory].OPTM_FEATUREID == this.ModelBOMDataForSecondLevel[imodelBOMitems].OPTM_FEATUREID && isMandatoryItems[imandtory].feature_code == this.ModelBOMDataForSecondLevel[imodelBOMitems].parent_code && this.ModelBOMDataForSecondLevel[imodelBOMitems].checked == true && isMandatoryItems[imandtory].unique_key == this.ModelBOMDataForSecondLevel[imodelBOMitems].unique_key) {
              get_min_select_list[imandtory]['actual']++;
            }
          }
        }
        /* if (counted == 0) {
           itemnotselectedarray.push(isMandatoryItems[imandtory].OPTM_DISPLAYNAME)
         }
         counted = 0;*/
      }
    }
    console.log("get_min_select_list ", get_min_select_list);
    /*if (isMandatoryCount != isMandatoryItems.length) {
      var psmsg = this.language.MandatoryItems
      if (itemnotselectedarray.length > 0) {
        for (var item in itemnotselectedarray) {
          psmsg = psmsg + " - " + itemnotselectedarray[item]
        }
      }
      this.toastr.error('', psmsg, this.commonData.toast_config);
      this.showLookupLoader = false;
      return;
    }*/
    var ps_msg = '';
    for (var index in get_min_select_list) {
      console.log(get_min_select_list[index]);
      if (get_min_select_list[index].min_selectable > get_min_select_list[index].actual) {
        if (ps_msg == "") {
          ps_msg = get_min_select_list[index].component_name;
        } else {
          ps_msg = ps_msg + ", " + get_min_select_list[index].component_name;
        }
      }
    }
    if (ps_msg != "") {
      this.toastr.error('', this.language.MandatoryItems + " - " + ps_msg, this.commonData.toast_config);
      this.showLookupLoader = false;
      return
    }


    for (let iMinModelHeaderData = 0; iMinModelHeaderData < this.ModelHeaderData.length; iMinModelHeaderData++) {
      if (this.ModelHeaderData[iMinModelHeaderData].OPTM_MANDATORY == "Y") {
        if (this.ModelHeaderData[iMinModelHeaderData].OPTM_TYPE == "1") {
          var tempfeatureid = this.ModelHeaderData[iMinModelHeaderData].OPTM_FEATUREID
          var isMinItemsCounted = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_FEATUREID'] == tempfeatureid && obj['checked'] == true
          })
        }
        else if (this.ModelHeaderData[iMinModelHeaderData].OPTM_TYPE == "3") {
          var tempfeatureid = this.ModelHeaderData[iMinModelHeaderData].OPTM_CHILDMODELID
          var isMinItemsCounted = this.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_MODELID'] == tempfeatureid && obj['checked'] == true
          })
        }

        if (isMinItemsCounted.length < this.ModelHeaderData[iMinModelHeaderData].OPTM_MINSELECTABLE) {
          this.toastr.error('', this.language.Minimumitemsarenotselected + this.ModelHeaderData[iMinModelHeaderData].OPTM_DISPLAYNAME, this.commonData.toast_config);
          this.showLookupLoader = false;
          return;
        }
      }

    }


    this.navigatenextbtn = true;
    // this.validnextbtn=false;
    if (navigte == true) {
      $("#modelbom_next_click_id").trigger('click');
      // this.onModelBillNextPress(); // method commented 
      if (this.step3_data_final.length == 0) {
        this.fill_step3_data_array('add', '0');
        this.step2_selected_model = this.step3_data_final[0];
        this.step2_selected_model_id = 1;
      }
    } else {
      for_multiple_model();
    }
  }

  generate_unique_key() {
    this.step2_final_dataset_to_save = [];
    if (this.step3_data_final.length > 0 && this.step3_data_final !== undefined) {
      for (var mj = 0; mj < this.step3_data_final.length; mj++) { // step3_data_final_loop
        if (this.step3_data_final[mj] !== undefined) {
          var step3_data_row = this.step3_data_final[mj];
          var imodelfilteritems = [];
          //  var itemkeyforparentmodel = "";
          var temp_step2_final_dataset_save = [];
          var main_model_id = step3_data_row.model_id;
          if (main_model_id == "" && main_model_id == undefined && main_model_id == undefined) {
            main_model_id = 0;
          }

          temp_step2_final_dataset_save.push({
            "OPTM_OUTPUTID": "",
            "OPTM_OUTPUTDTLID": "",
            "OPTM_ITEMNUMBER": "",
            "OPTM_ITEMCODE": step3_data_row.item,
            "OPTM_KEY": "",
            "OPTM_PARENTKEY": "",
            "OPTM_TEMPLATEID": step3_data_row.templateid,
            "OPTM_ITMCODEGENKEY": step3_data_row.itemcodegenkey,
            "OPTM_ITEMTYPE": 0,
            "OPTM_WHSE": this.warehouse,
            "OPTM_LEVEL": 0,
            "OPTM_QUANTITY": parseFloat(step3_data_row.quantity).toFixed(3),
            "OPTM_ORIGINAL_QUANTITY": parseFloat(step3_data_row.quantity).toFixed(3),
            "OPTM_PRICELIST": 0,
            "OPTM_UNITPRICE": parseFloat("0").toFixed(3),
            "OPTM_TOTALPRICE": parseFloat("0").toFixed(3),
            "OPTM_DISCPERCENT": parseFloat("0").toFixed(3),
            "OPTM_CREATEDBY": this.common_output_data.username,
            "OPTM_MODIFIEDBY": this.common_output_data.username,
            "UNIQUEIDNT": "Y",
            "PARENTID": step3_data_row.model_id,
            "OPTM_FGCREATEDATE": "",
            "OPTM_REFITEMCODE": "",
            "OPTM_PARENTID": step3_data_row.model_id,
            "OPTM_PARENTTYPE": 2,
            "UNIQUE_KEY": '',
            "NODEID": '',
            "temp_model_id": parseInt(step3_data_row.model_id),
            "OPTM_FILL_POINT": "1",
            "MODEL_UNIQUE_KEY": ""
          })
        } // if step3 data ot undefined if - end 

        for (var ifeature in step3_data_row.feature) {
          var imodelfilteritems = [];
          var imodelData = [];
          var submodel_id = "";
          var is_sub_model = [];

          is_sub_model = step3_data_row.ModelHeaderData.filter(function (obj) {
            return obj['OPTM_TYPE'] == 3 && obj['unique_key'] == step3_data_row.feature[ifeature].nodeid;  //  && step3_data_row.feature[ifeature].ModelId == obj['OPTM_CHILDMODELID']
          });

          if (is_sub_model.length > 0 && is_sub_model[0].OPTM_MODELID != "") {
            submodel_id = is_sub_model[0].OPTM_CHILDMODELID;
          }

          var master_model_id: any = 0;
          if (main_model_id == step3_data_row.feature[ifeature].ModelId) {
            master_model_id = main_model_id;
          } else if (submodel_id == step3_data_row.feature[ifeature].ModelId) {
            master_model_id = submodel_id;
          }

          if (step3_data_row.feature[ifeature].Item == null || step3_data_row.feature[ifeature].Item == "" || step3_data_row.feature[ifeature].Item == undefined) {
            var imodelfilterfeatures = [];

            if (step3_data_row.feature[ifeature].FeatureId == "0" || step3_data_row.feature[ifeature].FeatureId == 0) {
              step3_data_row.feature[ifeature].FeatureId = null;
            }
            var temp_child_model_id = step3_data_row.feature[ifeature].FeatureId;
            var tempNodeId = step3_data_row.feature[ifeature].nodeid;
            /* var tempmodelid = step3_data_row.feature[ifeature].ModelId;
             console.log(temp_child_model_id);*/

            imodelData = step3_data_row.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_CHILDMODELID'] == temp_child_model_id && obj['nodeid'] == tempNodeId && obj['OPTM_TYPE'] == 3
            });
            if(imodelData.length == 0) {
              imodelData = step3_data_row.ModelHeaderData.filter(function (obj) {
                return obj['OPTM_CHILDMODELID'] == temp_child_model_id && obj['unique_key'] == tempNodeId && obj['OPTM_TYPE'] == 3
              });
            }

            imodelfilteritems = step3_data_row.ModelBOMDataForSecondLevel.filter(function (obj) {
              return obj['OPTM_MODELID'] == temp_child_model_id && obj['OPTM_TYPE'] == 2
            });

            imodelfilterfeatures = step3_data_row.ModelBOMDataForSecondLevel.filter(function (obj) {
              return obj['OPTM_MODELID'] == temp_child_model_id && obj['OPTM_TYPE'] == 1
            })

            var matchmodelitemarray = [];

            matchmodelitemarray = step3_data_row.feature.filter(function (obj) {
              return obj['ModelId'] == 0
            })

            if (matchmodelitemarray.length > 0) {
              for (var imatchmodel in matchmodelitemarray) {
                var indexmatchmodelitemarray = step3_data_row.FeatureBOMDataForSecondLevel.filter(function (obj) {
                  return matchmodelitemarray[imatchmodel].Item == obj['OPTM_ITEMKEY'] && matchmodelitemarray[imatchmodel].FeatureId == obj['OPTM_FEATUREID']
                })


                if (indexmatchmodelitemarray.length > 0)
                  imodelfilteritems.push({
                    DocEntry: matchmodelitemarray[imatchmodel].ItemNumber,
                    OPTM_UNIQUEIDNT: imodelData[0].OPTM_UNIQUEIDNT,
                    OPTM_ITEMKEY: indexmatchmodelitemarray[0].OPTM_ITEMKEY,
                    OPTM_MODELID: imodelData[0].OPTM_MODELID,
                    OPTM_CHILDMODELID: imodelData[0].OPTM_CHILDMODELID,
                    nodeid: imodelData[0].nodeid,
                    unique_key: imodelData[0].unique_key,
                  })

              }

            }

            if (imodelfilteritems.length > 0) {
              var featureitemlistfilterdata = [];
              //  itemkeyforparentmodel = "";
              for (var i in imodelfilteritems) {
                var itemtype;
                if (step3_data_row.feature[ifeature].is_accessory == "Y") {
                  itemtype = 3;
                }
                else {
                  itemtype = 2;
                }

                featureitemlistfilterdata = step3_data_row.feature.filter(function (obj) {
                  return obj['Item'] == imodelfilteritems[i].OPTM_ITEMKEY && obj['ModelId'] == imodelfilteritems[i].OPTM_MODELID
                })

                if (featureitemlistfilterdata.length == 0 && imodelfilteritems[i].OPTM_CHILDMODELID != null && imodelfilteritems[i].OPTM_CHILDMODELID != "") {
                  featureitemlistfilterdata = step3_data_row.feature.filter(function (obj) {
                    return obj['Item'] == imodelfilteritems[i].OPTM_ITEMKEY && obj['ModelId'] == imodelfilteritems[i].OPTM_CHILDMODELID
                  })
                }

                if (featureitemlistfilterdata.length > 0) {
                  var checkmodelitem = step3_data_row.ModelBOMDataForSecondLevel.filter(function (obj) {
                    return obj['OPTM_MODELID'] == featureitemlistfilterdata[0].ModelId && obj['OPTM_TYPE'] == 2 && obj['OPTM_ITEMKEY'] == featureitemlistfilterdata[0].Item
                  })
                  var formatedTotalPrice: any = featureitemlistfilterdata[0].quantity * featureitemlistfilterdata[0].Actualprice
                  formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)

                  let temp_model_id_default: any = 0;
                  let temp_model_data = step3_data_row.FeatureBOMDataForSecondLevel.filter(function (obj) {
                    //  return obj.OPTM_ITEMKEY == featureitemlistfilterdata[0].Item; 
                    return obj.unique_key == featureitemlistfilterdata[0].unique_key;
                  });

                  if (temp_model_data.length == 0) {
                    temp_model_data = step3_data_row.ModelBOMDataForSecondLevel.filter(function (obj) {
                      // return obj.OPTM_ITEMKEY == featureitemlistfilterdata[0].Item;
                      return obj.unique_key == featureitemlistfilterdata[0].unique_key;
                    });
                  }
                  if (temp_model_data[0].OPTM_MODELID !== undefined) {
                    temp_model_id_default = temp_model_data[0].OPTM_MODELID
                  }

                  if (checkmodelitem.length > 0) {
                    temp_step2_final_dataset_save.push({
                      "OPTM_OUTPUTID": "",
                      "OPTM_OUTPUTDTLID": "",
                      "OPTM_ITEMNUMBER": imodelfilteritems[i].DocEntry,
                      "OPTM_ITEMCODE": featureitemlistfilterdata[0].Item,
                      "OPTM_KEY": "",
                      "OPTM_PARENTKEY": "",
                      "OPTM_TEMPLATEID": "",
                      "OPTM_ITMCODEGENKEY": "",
                      "OPTM_ITEMTYPE": itemtype,
                      "OPTM_WHSE": this.warehouse,
                      "OPTM_LEVEL": featureitemlistfilterdata[0].OPTM_LEVEL,
                      "OPTM_QUANTITY": parseFloat(featureitemlistfilterdata[0].quantity).toFixed(3),
                      "OPTM_ORIGINAL_QUANTITY": parseFloat(featureitemlistfilterdata[0].original_quantity).toFixed(3),
                      "OPTM_PRICELIST": Number(featureitemlistfilterdata[0].price),
                      "OPTM_UNITPRICE": parseFloat(featureitemlistfilterdata[0].Actualprice).toFixed(3),
                      "OPTM_TOTALPRICE": formatedTotalPrice,
                      "OPTM_DISCPERCENT": parseFloat(featureitemlistfilterdata[0].discount).toFixed(3),
                      "OPTM_CREATEDBY": this.common_output_data.username,
                      "OPTM_MODIFIEDBY": this.common_output_data.username,
                      "UNIQUEIDNT": imodelfilteritems[i].OPTM_UNIQUEIDNT,
                      "PARENTID": imodelfilteritems[i].OPTM_MODELID,
                      "OPTM_FGCREATEDATE": "",
                      "OPTM_REFITEMCODE": "",
                      "OPTM_PARENTID": imodelfilteritems[i].OPTM_MODELID,
                      "OPTM_PARENTTYPE": 2,
                      "UNIQUE_KEY": featureitemlistfilterdata[0].unique_key,
                      "NODEID": featureitemlistfilterdata[0].nodeid,
                      //  "temp_model_id": parseInt(master_model_id)
                      "temp_model_id": parseInt(temp_model_id_default),
                      "OPTM_FILL_POINT": "2",
                      "MODEL_UNIQUE_KEY": this.getModelUniqueKey(step3_data_row.feature[ifeature].nodeid, step3_data_row.ModelHeaderData)
                    })
                  }

                }
              }
            }

            var formatedTotalPrice: any = step3_data_row.feature[ifeature].quantity * step3_data_row.feature[ifeature].Actualprice
            formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)

            /* var modelUniqueKey = "";
            if (step3_data_row.feature[ifeature].OPTM_TYPE == 3) {
              modelUniqueKey = this.getModelUniqueKey(step3_data_row.feature[ifeature].unique_key, step3_data_row.ModelHeaderData)
            } else {
              modelUniqueKey = this.getModelUniqueKey(step3_data_row.feature[ifeature].nodeid, step3_data_row.ModelHeaderData)
            } */

            temp_step2_final_dataset_save.push({
              "OPTM_OUTPUTID": "",
              "OPTM_OUTPUTDTLID": "",
              "OPTM_ITEMNUMBER": "",
              "OPTM_ITEMCODE": imodelData[0].OPTM_DISPLAYNAME,
              //"OPTM_KEY": itemkeyforparentmodel,
              "OPTM_KEY": "",
              "OPTM_PARENTKEY": "",
              "OPTM_TEMPLATEID": imodelData[0].MODELTEMPLATEITEM,
              "OPTM_ITMCODEGENKEY": imodelData[0].ITEMCODEGENREF,
              "OPTM_ITEMTYPE": 1,
              "OPTM_WHSE": this.warehouse,
              "OPTM_LEVEL": step3_data_row.feature[ifeature].OPTM_LEVEL,
              "OPTM_QUANTITY": parseFloat(step3_data_row.feature[ifeature].quantity).toFixed(3),
              "OPTM_ORIGINAL_QUANTITY": parseFloat(step3_data_row.feature[ifeature].original_quantity).toFixed(3),
              "OPTM_PRICELIST": Number(step3_data_row.feature[ifeature].price),
              "OPTM_UNITPRICE": parseFloat(step3_data_row.feature[ifeature].Actualprice).toFixed(3),
              "OPTM_TOTALPRICE": formatedTotalPrice,
              "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount).toFixed(3),
              "OPTM_CREATEDBY": this.common_output_data.username,
              "OPTM_MODIFIEDBY": this.common_output_data.username,
              "UNIQUEIDNT": imodelData[0].OPTM_UNIQUEIDNT,
              "PARENTID": imodelData[0].OPTM_MODELID,
              "OPTM_FGCREATEDATE": "",
              "OPTM_REFITEMCODE": "",
              "OPTM_PARENTID": imodelData[0].OPTM_MODELID,
              "OPTM_PARENTTYPE": 2,
              "UNIQUE_KEY": imodelData[0].unique_key,
              "NODEID": step3_data_row.feature[ifeature].nodeid,
              "temp_model_id": parseInt(master_model_id),
              "OPTM_FILL_POINT": "3",
              "MODEL_UNIQUE_KEY": this.getModelUniqueKey(step3_data_row.feature[ifeature].nodeid, step3_data_row.ModelHeaderData)
            })

          }
          else {

            var itemtype;
            var fid = step3_data_row.feature[ifeature].FeatureId;

            var temp_model_id_default = master_model_id;
            var temp_item_number = step3_data_row.feature[ifeature].Item;
            var temp_unique_key = step3_data_row.feature[ifeature].unique_key;
            var temp_nodeid = step3_data_row.feature[ifeature].nodeid;

            let temp_model_data = step3_data_row.FeatureBOMDataForSecondLevel.filter(function (obj) {
              return obj.unique_key == temp_unique_key;
            });

            if (temp_model_data.length == 0) {
              temp_model_data = step3_data_row.ModelBOMDataForSecondLevel.filter(function (obj) {
                return obj.unique_key == temp_unique_key
              });

              if (temp_model_data.length != 0) {
                if (temp_model_data[0].OPTM_MODELID !== undefined) {
                  temp_model_id_default = temp_model_data[0].OPTM_MODELID
                }
              } else {
                temp_model_data = step3_data_row.ModelHeaderItemsArray.filter(function (obj) {
                  return obj.OPTM_ITEMKEY == temp_item_number
                });
                if (temp_model_data.length != 0) {
                  if (temp_model_data[0].OPTM_MODELID !== undefined) {
                    temp_model_id_default = temp_model_data[0].OPTM_MODELID
                  }
                }
              }
            } else {
              if (temp_model_data.length != 0) {
                if (temp_model_data[0].parentmodelid !== undefined) {
                  temp_model_id_default = temp_model_data[0].parentmodelid
                }
              }
            }

            if (step3_data_row.feature[ifeature].FeatureId != null) {
              if (step3_data_row.feature[ifeature].FeatureId != step3_data_row.model_id) {
                var ifeatureHeaderData = [];
                /*  ifeatureHeaderData = step3_data_row.ModelHeaderData.filter(function (obj) {
                   return obj['OPTM_FEATUREID'] == fid && obj['OPTM_FEATUREID'] != null
                 }) */
                ifeatureHeaderData = step3_data_row.ModelHeaderData.filter(function (obj) {
                  return obj['unique_key'] == temp_nodeid
                })

                if (ifeatureHeaderData.length == 0) {
                  if (step3_data_row.feature[ifeature].is_accessory == "N") {
                    /*   ifeatureHeaderData = step3_data_row.ModelHeaderData.filter(function (obj) {
                        return obj['OPTM_ITEMKEY'] == step3_data_row.feature[ifeature].Item
                      }) */
                    ifeatureHeaderData = step3_data_row.ModelHeaderData.filter(function (obj) {
                      return obj['unique_key'] == temp_unique_key
                    })
                  } else {
                    ifeatureHeaderData = step3_data_row.Accessoryarray.filter(function (obj) {
                      return obj['OPTM_FEATUREID'] == fid
                    })
                  }
                }
                if (ifeatureHeaderData.length == 0) {
                  /*  ifeatureHeaderData = step3_data_row.ModelHeaderItemsArray.filter(function (obj) {
                     return obj['OPTM_ITEMKEY'] == step3_data_row.feature[ifeature].Item
                   }) */
                  ifeatureHeaderData = step3_data_row.ModelHeaderItemsArray.filter(function (obj) {
                    return obj['unique_key'] == temp_unique_key
                  });
                }
                var itemcode = step3_data_row.feature[ifeature].Item
                if (step3_data_row.feature[ifeature].is_accessory == "Y") {
                  itemtype = 3;
                } else {
                  itemtype = 2;
                }

                var formatedTotalPrice: any = step3_data_row.feature[ifeature].quantity * step3_data_row.feature[ifeature].Actualprice
                formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)
                if (ifeatureHeaderData.length > 0) {
                  var uniqueIdentifier = ifeatureHeaderData[0].OPTM_UNIQUEIDNT;
                }
                var modelUniqueKey = ""

                 var modelUniqueKey1 = this.getModelUniqueKey(step3_data_row.feature[ifeature].nodeid, step3_data_row.ModelHeaderData);
                temp_step2_final_dataset_save.push({
                  "OPTM_OUTPUTID": "",
                  "OPTM_OUTPUTDTLID": "",
                  "OPTM_ITEMNUMBER": step3_data_row.feature[ifeature].ItemNumber,
                  "OPTM_ITEMCODE": step3_data_row.feature[ifeature].Item,
                  "OPTM_KEY": "",
                  "OPTM_PARENTKEY": "",
                  "OPTM_TEMPLATEID": "",
                  "OPTM_ITMCODEGENKEY": "",
                  "OPTM_ITEMTYPE": itemtype,
                  "OPTM_WHSE": this.warehouse,
                  "OPTM_LEVEL": step3_data_row.feature[ifeature].OPTM_LEVEL,
                  "OPTM_QUANTITY": parseFloat(step3_data_row.feature[ifeature].quantity).toFixed(3),
                  "OPTM_ORIGINAL_QUANTITY": parseFloat(step3_data_row.feature[ifeature].original_quantity).toFixed(3),
                  "OPTM_PRICELIST": Number(step3_data_row.feature[ifeature].price),
                  "OPTM_UNITPRICE": parseFloat(step3_data_row.feature[ifeature].Actualprice).toFixed(3),
                  "OPTM_TOTALPRICE": formatedTotalPrice,
                  "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount).toFixed(3),
                  "OPTM_CREATEDBY": this.common_output_data.username,
                  "OPTM_MODIFIEDBY": this.common_output_data.username,
                  "UNIQUEIDNT": uniqueIdentifier,
                  "PARENTID": step3_data_row.feature[ifeature].FeatureId,
                  "OPTM_FGCREATEDATE": "",
                  "OPTM_REFITEMCODE": "",
                  "OPTM_PARENTID": step3_data_row.feature[ifeature].FeatureId,
                  "OPTM_PARENTTYPE": 1,
                  "UNIQUE_KEY": step3_data_row.feature[ifeature].unique_key,
                  "NODEID": step3_data_row.feature[ifeature].nodeid,
                  "temp_model_id": parseInt(temp_model_id_default),
                  "OPTM_FILL_POINT": "4",
                  "MODEL_UNIQUE_KEY": modelUniqueKey1
                })
              }
              else {
                var ifeatureHeaderData = [];
                var itemcode = step3_data_row.feature[ifeature].Item
                ifeatureHeaderData = step3_data_row.ModelHeaderItemsArray.filter(function (obj) {
                  return obj['OPTM_ITEMKEY'] == itemcode && obj['OPTM_MODELID'] == fid
                })

                if (step3_data_row.feature[ifeature].is_accessory == "Y") {
                  itemtype = 3;
                }
                else {
                  itemtype = 2;
                }
                var formatedTotalPrice: any = step3_data_row.feature[ifeature].quantity * step3_data_row.feature[ifeature].Actualprice
                formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)

                temp_step2_final_dataset_save.push({
                  "OPTM_OUTPUTID": "",
                  "OPTM_OUTPUTDTLID": "",
                  "OPTM_ITEMNUMBER": step3_data_row.feature[ifeature].ItemNumber,
                  "OPTM_ITEMCODE": step3_data_row.feature[ifeature].Item,
                  "OPTM_KEY": "",
                  "OPTM_PARENTKEY": "",
                  "OPTM_TEMPLATEID": "",
                  "OPTM_ITMCODEGENKEY": "",
                  "OPTM_ITEMTYPE": itemtype,
                  "OPTM_WHSE": this.warehouse,
                  "OPTM_LEVEL": step3_data_row.feature[ifeature].OPTM_LEVEL,
                  "OPTM_QUANTITY": parseFloat(step3_data_row.feature[ifeature].quantity).toFixed(3),
                  "OPTM_ORIGINAL_QUANTITY": parseFloat(step3_data_row.feature[ifeature].original_quantity).toFixed(3),
                  "OPTM_PRICELIST": Number(step3_data_row.feature[ifeature].price),
                  "OPTM_UNITPRICE": parseFloat(step3_data_row.feature[ifeature].Actualprice).toFixed(3),
                  "OPTM_TOTALPRICE": formatedTotalPrice,
                  "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount).toFixed(3),
                  "OPTM_CREATEDBY": this.common_output_data.username,
                  "OPTM_MODIFIEDBY": this.common_output_data.username,
                  "UNIQUEIDNT": ifeatureHeaderData[0].OPTM_UNIQUEIDNT,
                  "PARENTID": step3_data_row.feature[ifeature].FeatureId,
                  "OPTM_FGCREATEDATE": "",
                  "OPTM_REFITEMCODE": "",
                  "OPTM_PARENTID": step3_data_row.feature[ifeature].FeatureId,
                  "OPTM_PARENTTYPE": 1,
                  "UNIQUE_KEY": step3_data_row.feature[ifeature].unique_key,
                  "NODEID": step3_data_row.feature[ifeature].nodeid,
                  "temp_model_id": parseInt(temp_model_id_default),
                  "OPTM_FILL_POINT": "5",
                  "MODEL_UNIQUE_KEY": this.getModelUniqueKey(step3_data_row.feature[ifeature].nodeid, step3_data_row.ModelHeaderData)
                })
              }

            }
          }
        }

        // key generation array iteration  - start 
        var model_item_type_arr: any = ['0', '1'];
        for (let model_item_type in model_item_type_arr) {
          var temp_model_dataa_row = temp_step2_final_dataset_save.filter(function (obj) {
            return obj['OPTM_ITEMTYPE'] == model_item_type
          });

          if (temp_model_dataa_row.length > 0 && temp_model_dataa_row != undefined) {
            for (var model_index in temp_model_dataa_row) {
              var model_curr_row: any = temp_model_dataa_row[model_index];
              var model_id: any = ''; var submodel_code: any = ''; var sub_model_tems: any = [];
              var unique_key = "";
              if (model_item_type == '0') {
                model_id = model_curr_row['temp_model_id'];

              } else if (model_item_type == '1') {
                let sub_model_header_row: any = step3_data_row.ModelHeaderData.filter(function (obj) {
                  return obj['OPTM_TYPE'] == 3 && obj['child_code'] == model_curr_row['OPTM_ITEMCODE']
                })
                if (sub_model_header_row.length > 0 && sub_model_header_row != undefined && sub_model_header_row[0] != undefined) {
                  model_id = sub_model_header_row[0]['OPTM_CHILDMODELID'];
                  unique_key = sub_model_header_row[0]['unique_key'];
                  submodel_code = sub_model_header_row[0]['child_code'];

                }
              }
              if (model_id != "") {

                let model_child_item_arr: any = temp_step2_final_dataset_save.filter(function (obj) {
                  if (model_item_type == '0') {
                    return obj['temp_model_id'] == model_id && obj.UNIQUEIDNT == 'Y' && obj.OPTM_ITEMTYPE != model_item_type
                  } else if (model_item_type == '1') {
                    return obj['temp_model_id'] == model_id && obj['MODEL_UNIQUE_KEY'] == unique_key && obj.UNIQUEIDNT == 'Y';
                  }
                });

                var parent_item_key: any = ""; var sub_item: any = "";
                for (var model_child_index in model_child_item_arr) {
                  var model_item_curr_row: any = model_child_item_arr[model_child_index];
                  let push_item: any = '';
                  if (model_item_curr_row['OPTM_ITEMNUMBER'] != "" && model_item_curr_row['OPTM_ITEMNUMBER'] != undefined) {
                    push_item = model_item_curr_row['OPTM_ITEMNUMBER'];
                  } else {
                    if (model_item_curr_row['OPTM_ITEMNUMBER'] == "" && model_item_curr_row['OPTM_ITEMTYPE'] == 1) {
                      if (model_item_curr_row['OPTM_ITEMCODE'] != "") {
                        sub_item = step3_data_row.ModelHeaderData.filter(function (obj) {
                          return obj['OPTM_TYPE'] == 3 && obj['child_code'] == model_item_curr_row['OPTM_ITEMCODE']
                        })
                        if (sub_item.length > 0) {
                          sub_model_tems = step3_data_row.feature.filter(function (obj) {
                            return obj['ModelId'] == sub_item[0]['OPTM_CHILDMODELID'];
                          });
                          if (sub_model_tems.length > 0) {
                            push_item = model_item_curr_row['OPTM_ITEMCODE'];
                          }
                        }
                      }
                    }
                  }

                  // pushing string in key with a different and unique delimter as "_::__::_"  can be a part of sub model name
                  if (parent_item_key != "") {
                    parent_item_key = parent_item_key + '_::__::_' + push_item;
                  } else {
                    parent_item_key = push_item;
                  }
                }

                parent_item_key = this.sort_unique_item_key(parent_item_key);

                temp_step2_final_dataset_save = temp_step2_final_dataset_save.filter(function (obj) {
                  if (obj['OPTM_ITEMTYPE'] == model_item_type && obj['temp_model_id'] == model_id) { // for main model entry
                    obj['OPTM_KEY'] = (parent_item_key).toString()
                  }

                  if (obj['OPTM_ITEMTYPE'] != 0 && obj['temp_model_id'] == model_id) { // for items of sub model and main model entry 
                    obj['OPTM_PARENTKEY'] = (parent_item_key).toString()
                  }

                  if (obj['OPTM_ITEMTYPE'] == 1 && model_item_type == '1' && submodel_code == obj['OPTM_ITEMCODE']) { // for submodel header entry
                    obj['OPTM_KEY'] = (parent_item_key).toString()
                  }

                  return obj;
                });
              }
            }
          }
          console.log("temp_step2_final_dataset_save ", temp_step2_final_dataset_save);


        }


        // parent child item key and parent key new mapping - end 


        var iValueData = [];
        iValueData = step3_data_row.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_TYPE'] == "3" && obj['checked'] == true
        })
        if (iValueData.length > 0) {
          for (let itempsavefinal = 0; itempsavefinal < iValueData.length; itempsavefinal++) {
            temp_step2_final_dataset_save.push({
              "OPTM_OUTPUTID": "",
              "OPTM_OUTPUTDTLID": "",
              "OPTM_ITEMNUMBER": "",
              "OPTM_ITEMCODE": iValueData[itempsavefinal].OPTM_VALUE,
              "OPTM_KEY": "",
              "OPTM_PARENTKEY": "",
              "OPTM_TEMPLATEID": "",
              "OPTM_ITMCODEGENKEY": "",
              "OPTM_ITEMTYPE": 4,
              "OPTM_WHSE": this.warehouse,
              "OPTM_LEVEL": iValueData[itempsavefinal].OPTM_LEVEL,
              "OPTM_QUANTITY": parseFloat(iValueData[itempsavefinal].OPTM_QUANTITY).toFixed(3),
              "OPTM_ORIGINAL_QUANTITY": parseFloat(iValueData[itempsavefinal].OPTM_QUANTITY).toFixed(3),
              "OPTM_PRICELIST": Number(0),
              "OPTM_UNITPRICE": parseFloat("0").toFixed(3),
              "OPTM_TOTALPRICE": 0,
              "OPTM_DISCPERCENT": parseFloat("0").toFixed(3),
              "OPTM_CREATEDBY": this.common_output_data.username,
              "OPTM_MODIFIEDBY": this.common_output_data.username,
              "UNIQUEIDNT": "N",
              "PARENTID": iValueData[itempsavefinal].OPTM_FEATUREID,
              "OPTM_FGCREATEDATE": "",
              "OPTM_REFITEMCODE": "",
              "OPTM_PARENTID": iValueData[itempsavefinal].OPTM_FEATUREID,
              "OPTM_PARENTTYPE": 1,
              "UNIQUE_KEY": iValueData[itempsavefinal].unique_key,
              "NODEID": iValueData[itempsavefinal].nodeid,
              "temp_model_id": parseInt('0'),
              "OPTM_FILL_POINT": "6",
              "MODEL_UNIQUE_KEY": ""
            })
          }
        }



        // key generation array iteration - end 
        //  this.step2_final_dataset_to_save.push(temp_step2_final_dataset_save);
        for (let itempsavefinal = 0; itempsavefinal < temp_step2_final_dataset_save.length; itempsavefinal++) {
          this.step2_final_dataset_to_save.push({
            "OPTM_OUTPUTID": temp_step2_final_dataset_save[itempsavefinal].OPTM_OUTPUTID,
            "OPTM_OUTPUTDTLID": temp_step2_final_dataset_save[itempsavefinal].OPTM_OUTPUTDTLID,
            "OPTM_ITEMNUMBER": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMNUMBER,
            "OPTM_ITEMCODE": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMCODE,
            "OPTM_KEY": temp_step2_final_dataset_save[itempsavefinal].OPTM_KEY,
            "OPTM_PARENTKEY": temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTKEY,
            "OPTM_TEMPLATEID": temp_step2_final_dataset_save[itempsavefinal].OPTM_TEMPLATEID,
            "OPTM_ITMCODEGENKEY": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITMCODEGENKEY,
            "OPTM_ITEMTYPE": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMTYPE,
            "OPTM_WHSE": this.warehouse,
            "OPTM_LEVEL": temp_step2_final_dataset_save[itempsavefinal].OPTM_LEVEL,
            "OPTM_QUANTITY": parseFloat(temp_step2_final_dataset_save[itempsavefinal].OPTM_QUANTITY).toFixed(3),
            "OPTM_ORIGINAL_QUANTITY": parseFloat(temp_step2_final_dataset_save[itempsavefinal].OPTM_ORIGINAL_QUANTITY).toFixed(3),
            "OPTM_PRICELIST": temp_step2_final_dataset_save[itempsavefinal].OPTM_PRICELIST,
            "OPTM_UNITPRICE": parseFloat(temp_step2_final_dataset_save[itempsavefinal].OPTM_UNITPRICE).toFixed(3),
            "OPTM_TOTALPRICE": parseFloat(temp_step2_final_dataset_save[itempsavefinal].OPTM_TOTALPRICE).toFixed(3),
            "OPTM_DISCPERCENT": parseFloat(temp_step2_final_dataset_save[itempsavefinal].OPTM_DISCPERCENT).toFixed(3),
            "OPTM_CREATEDBY": this.common_output_data.usernameOPTM_CREATEDBY,
            "OPTM_MODIFIEDBY": this.common_output_data.usernameOPTM_MODIFIEDBY,
            "UNIQUEIDNT": temp_step2_final_dataset_save[itempsavefinal].UNIQUEIDNT,
            "PARENTID": temp_step2_final_dataset_save[itempsavefinal].PARENTID,
            "OPTM_FGCREATEDATE": temp_step2_final_dataset_save[itempsavefinal].OPTM_FGCREATEDATE,
            "OPTM_REFITEMCODE": temp_step2_final_dataset_save[itempsavefinal].OPTM_REFITEMCODE,
            "OPTM_PARENTID": temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTID,
            "OPTM_PARENTTYPE": temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTTYPE,
            "UNIQUE_KEY": temp_step2_final_dataset_save[itempsavefinal].UNIQUE_KEY,
            "NODEID": temp_step2_final_dataset_save[itempsavefinal].NODEID,
            "temp_model_id": temp_step2_final_dataset_save[itempsavefinal].temp_model_id
          })
        }


      } // step3_datafinal loop end
      console.log("this.step2_final_dataset_to_save ");
      console.log(this.step2_final_dataset_to_save);
    }
  }

  sort_unique_item_key(item_key) {
    var sortitemkey: any = "";
    var seperator = "_::__::_";
    // var key_delimeter = "-";
    var key_delimeter = "#";
    if (item_key.toString().indexOf(seperator) !== -1) {
      let sortitemkeyarray: any = item_key.split(seperator);
      var number_key_arr = []; var string_key_arr = [];
      for (let isort in sortitemkeyarray) {
        if (sortitemkeyarray[isort] != "" && sortitemkeyarray[isort] != null && sortitemkeyarray[isort] != undefined) {
          if (isNaN(sortitemkeyarray[isort]) == false) {
            number_key_arr.push(sortitemkeyarray[isort]);
          } else {
            string_key_arr.push(sortitemkeyarray[isort]);
          }
        }
      }

      if (number_key_arr.length > 0) {
        sortitemkey = number_key_arr.sort((a, b) => a - b).join(key_delimeter);
      }

      if (string_key_arr.length > 0) {
        let string_key = string_key_arr.sort((a, b) => a - b).join(key_delimeter);
        if (sortitemkey == "") {
          sortitemkey = string_key
        } else {
          sortitemkey = sortitemkey + key_delimeter + string_key
        }
      }
    } else {
      sortitemkey = item_key;
    }
    return sortitemkey;
  }

  getModelUniqueKey(nodeId, modelHeaderData) {
    var subModelData = [];
    var uniqueKey = "";
   
    if(subModelData.length == 0) {
      let mainModelDetailArr = []
      mainModelDetailArr = this.MainModelDetails.filter(function (obj) {
        return obj.UNIQUE_KEY == nodeId
      })
      if (mainModelDetailArr.length > 0) {
        return  uniqueKey =  mainModelDetailArr[0].UNIQUE_KEY;
      }
    }
    
    if (modelHeaderData.length > 0 && uniqueKey == "") {
      subModelData = modelHeaderData.filter(function (obj) {
        return obj.unique_key == nodeId
      })
      if (subModelData.length > 0) {
        if (subModelData[0].OPTM_TYPE == 1) {
          return uniqueKey=  this.getModelUniqueKey(subModelData[0].nodeid, modelHeaderData);
        } else {
          uniqueKey =  subModelData[0].unique_key;
          return uniqueKey;
        }
      }
    }
    /* return uniqueKey; */
  }


  //For getting final status this mehod will handle 
  getFinalBOMStatus() {
    this.showLookupLoader = true;
    this.OutputService.getFinalBOMStatus(this.iLogID).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data != undefined && data != undefined) {
              if (data[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.showLookupLoader = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              }
            }
          }

          else if (data.FinalStatus[0].OPTM_STATUS == "P") {
            this.final_order_status = this.language.process_status;
            this.final_ref_doc_entry = data.FinalStatus[0].OPTM_REFDOCENTRY;
            this.final_document_number = data.FinalStatus[0].OPTM_REFDOCNO;
            this.final_reference_number = data.FinalStatus[0].OPTM_REFDOCNO;
          } else if (data.FinalStatus[0].OPTM_STATUS == "E") {
            this.final_order_status = this.language.error_status;
            this.toastr.error('', this.language.error_occured + ': ' + data.FinalStatus[0].OPTM_ERRDESC, this.commonData.toast_config);
          }
          else {
            this.final_order_status = this.language.pending_status;
          }

          if (data.GeneratedNewItemList.length > 0 && data.GeneratedNewItemList !== undefined) {
            console.log(data.GeneratedNewItemList)
            this.new_item_list = data.GeneratedNewItemList;
          }
          this.stoprefreshloader();
        }
        else {
          this.stoprefreshloader();
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        this.stoprefreshloader();
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )

  }

  stoprefreshloader() {
    var obj = this;
    setTimeout(function () {
      obj.dontShowFinalLoader = false;
      obj.showFinalLoader = true;
    }, 500);

  }

  get_feature_elements(header_feature_table, feature_child_datatable, model_child_datatable) {
    //This function is used to render feature & model data with their respective BOM in left grid.
    var array = [];
    if (header_feature_table['OPTM_TYPE'] == "1" && header_feature_table['ACCESSORY'] != "Y" && header_feature_table['is_second_level'] == null) {
      array = feature_child_datatable.filter(function (obj) {
        if (obj['parentfeatureid'] != "" && obj['parentfeatureid'] != null) {
          return obj['OPTM_FEATUREID'] == header_feature_table['OPTM_FEATUREID'] && obj['nodeid'] == header_feature_table['unique_key'];
        } else {
          return obj['OPTM_FEATUREID'] == header_feature_table['OPTM_FEATUREID'] && obj['nodeid'] == header_feature_table['unique_key'];
        }
      });
    } else if (header_feature_table['OPTM_TYPE'] == "3" && header_feature_table['ACCESSORY'] != null) {
      if (header_feature_table['ACCESSORY'] != "Y") {
        array = model_child_datatable.filter(function (obj) {
          return obj['OPTM_MODELID'] == header_feature_table['OPTM_CHILDMODELID'] && obj['nodeid'] == header_feature_table['unique_key'] && obj['OPTM_TYPE'] != "2";
        });
      }
    } else if (header_feature_table['OPTM_TYPE'] == "3" && header_feature_table['ACCESSORY'] == null) {
      if (header_feature_table['IS_ACCESSORY'] != "Y") {
        array = model_child_datatable.filter(function (obj) {
          return obj['OPTM_MODELID'] == header_feature_table['OPTM_CHILDMODELID'] && obj['nodeid'] == header_feature_table['unique_key'] && obj['OPTM_TYPE'] != "2";
        });
      }
    } else if (header_feature_table['OPTM_TYPE'] == "1" && header_feature_table['ACCESSORY'] != "Y" &&
      header_feature_table['is_second_level'] != null) {
      array = feature_child_datatable.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == header_feature_table['OPTM_FEATUREID'] && obj['nodeid'] == header_feature_table['unique_key'];
      });
    }


    /* if (header_feature_table['OPTM_MAXSELECTABLE'] > 1) {
      header_feature_table['element_type'] = "checkbox";
      header_feature_table['element_class'] = "custom-control custom-checkbox";
    }
    else {
      header_feature_table['element_type'] = "radio";
      header_feature_table['element_class'] = "custom-control custom-radio";
    } */

    if ((header_feature_table['OPTM_ISMULTISELECT'] == "N" || header_feature_table['OPTM_ISMULTISELECT'] == null) && header_feature_table['OPTM_MAXSELECTABLE'] > 1) {
      header_feature_table['element_type'] = "checkbox";
      header_feature_table['element_class'] = "custom-control custom-checkbox";
    } else {

      if (header_feature_table['OPTM_ISMULTISELECT'] == "Y") {
        header_feature_table['element_type'] = "checkbox";
        header_feature_table['element_class'] = "custom-control custom-checkbox";
      } else {

        header_feature_table['element_type'] = "radio";
        header_feature_table['element_class'] = "custom-control custom-radio";
      }

    }



    return array;
  }

  get_accessory_element(accessory_header_data, accessory_bom_data) {
    // This function is used to render Accessory data in left grid.
    let accessoryBOM = [];
    if (accessory_bom_data != undefined && accessory_bom_data != null) {
      accessoryBOM = accessory_bom_data.filter(function (obj) {
        return obj['nodeid'] == accessory_header_data.unique_key;
      });
    }
    return accessoryBOM;
  }

  getAccessoryData(Accarray) {
    // This function is used to render Accessory Header data in right grid.
    let checkedacc = false;
    var isAccExist;
    for (let iaccss = 0; iaccss < Accarray.length; iaccss++) {
      isAccExist = this.feature_accessory_list.filter(function (obj) {
        // return obj['OPTM_FEATUREID'] == Accarray[iaccss].OPTM_FEATUREID
        return obj['unique_key'] == Accarray[iaccss].unique_key
      })


      if (isAccExist.length == 0) {
        this.feature_accessory_list.push({
          checked: checkedacc,
          ListName: Accarray[iaccss].ListName,
          OPTM_CHILDFEATUREID: parseInt(Accarray[iaccss].OPTM_CHILDFEATUREID),
          OPTM_DEFAULT: Accarray[iaccss].OPTM_DEFAULT,
          name: Accarray[iaccss].OPTM_DISPLAYNAME,
          OPTM_FEATUREID: Accarray[iaccss].OPTM_FEATUREID,
          OPTM_ITEMKEY: Accarray[iaccss].OPTM_ITEMKEY,
          DocEntry: Accarray[iaccss].DocEntry,
          OPTM_LINENO: Accarray[iaccss].OPTM_LINENO,
          OPTM_PRICESOURCE: Accarray[iaccss].OPTM_PRICESOURCE,
          OPTM_PROPOGATEQTY: Accarray[iaccss].OPTM_PROPOGATEQTY,
          OPTM_QUANTITY: parseFloat(Accarray[iaccss].OPTM_QUANTITY).toFixed(3),
          OPTM_TYPE: Accarray[iaccss].OPTM_TYPE,
          OPTM_VALUE: Accarray[iaccss].OPTM_VALUE,
          unique_key: Accarray[iaccss].unique_key
        });
      }

    }
  }

  onAccessorySelectionChange(value, rowData, accessory_header_data) {
    // This function sets Accessory selections in right grid.
    this.showLookupLoader = true;
    let parentfeatureid = rowData.parentfeatureid;
    let superfeatureid = "";
    let GetDataForSelectedFeatureModelItemData: any = {};
    GetDataForSelectedFeatureModelItemData.selecteddata = [];
    GetDataForSelectedFeatureModelItemData.apidata = [];


    GetDataForSelectedFeatureModelItemData.selecteddata.push({
      type: rowData.OPTM_TYPE,
      modelid: "",
      item: rowData.OPTM_ITEMKEY,
      checked: value,
      parentfeatureid: rowData.OPTM_FEATUREID,
      parentmodelid: "",
      selectedvalue: "",
      CompanyDBID: this.common_output_data.companyName,
      SuperModelId: this.step2_data.model_id,
      currentDate: this.submit_date,
      superfeatureid: superfeatureid,
      unique_key: rowData.unique_key,
      nodeid: rowData.nodeid
    });

    let cobj = this;
    let accessoryIndex = this.selectedAccessoryBOM.findIndex(function (obj) {
      //return (obj.OPTM_ITEMKEY == rowData.OPTM_ITEMKEY && obj.OPTM_FEATUREID == rowData.OPTM_FEATUREID) ? obj : "";
      return (obj.nodeid == rowData.nodeid && obj.unique_key == rowData.unique_key) ? obj : "";
    });

    this.selectedAccessoryBOM[accessoryIndex].checked = value;

    GetDataForSelectedFeatureModelItemData.apidata.push({
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });

    this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
      data => {

        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data != undefined && data != undefined) {
              if (data[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.showLookupLoader = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              }
            }
          }
          if (value == true) {
            if (data.AccessoryFeatureData.length > 0) {
              this.setItemDataForFeatureAccessory(data.AccessoryFeatureData, accessory_header_data, rowData, "");
            }
            this.showLookupLoader = false;
          }
          else {
            for (let i = 0; i < this.feature_itm_list_table.length; i++) {
              if (this.feature_itm_list_table[i].nodeid == rowData.nodeid && this.feature_itm_list_table[i].unique_key == rowData.unique_key) {
                this.feature_itm_list_table.splice(i, 1);
                i = i - 1;
              }
            }
            this.showLookupLoader = false;
          }
        }
        this.feature_price_calculate();
      },
      error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        } else {
          this.stoprefreshloader();
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          this.feature_price_calculate();
        }
        return;
      });


  }

  setItemDataForFeatureAccessory(ItemData, parentArray, current_row_accessory, saved_data_from_dtl) {
    // This Feature sets Accessory items data in right grid on Selection change.
    let isPriceDisabled: boolean = false;
    let isPricehide: boolean = false;
    if (ItemData.length > 0) {
      for (let i = 0; i < this.feature_itm_list_table.length; i++) {
        // if (this.feature_itm_list_table[i].FeatureId == ItemData[0].OPTM_FEATUREID && this.feature_itm_list_table[i].Item == ItemData[0].OPTM_ITEMKEY) {
        if (this.feature_itm_list_table[i].nodeid == ItemData[0].nodeid && this.feature_itm_list_table[i].unique_key == ItemData[0].unique_key) {
          this.feature_itm_list_table.splice(i, 1);
          i = i - 1;
        }
      }

      var isExist;
      let isheadercounter = 10000;
      for (let i = 0; i < ItemData.length; i++) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          //return obj['FeatureId'] == ItemData[i].OPTM_FEATUREID && obj['Item'] == ItemData[i].OPTM_ITEMKEY;
          return obj['nodeid'] == ItemData[i].nodeid && obj['unique_key'] == ItemData[i].unique_key;
        });

        var formatequantity: any;
        let price: any;
        let price_list: any;
        let qty_value: any;
        let unique_key: any;
        let nodeid: any;
        let rowData: any
        if (saved_data_from_dtl == "") {
          console.log("in saved_data_from_dtl");
          if (ItemData[i].OPTM_PROPOGATEQTY == "Y") {
            if (ItemData[i].OPTM_QUANTITY !== undefined && ItemData[i].OPTM_QUANTITY != "") {
              qty_value = ItemData[i].OPTM_QUANTITY;
            } else {
              if (parentArray[0].OPTM_QUANTITY !== undefined && parentArray[0].OPTM_QUANTITY != "") {
                qty_value = parentArray[0].OPTM_QUANTITY;
              } else {
                qty_value = 1;
              }

            }

            formatequantity = qty_value * this.step2_data.quantity
          } else {
            if (ItemData[i].OPTM_QUANTITY !== undefined && ItemData[i].OPTM_QUANTITY != "") {
              qty_value = ItemData[i].OPTM_QUANTITY;
            }
            formatequantity = qty_value
          }
          if (ItemData[i].Price == null || ItemData[i].Price == undefined || ItemData[i].Price == "") {
            ItemData[i].Price = parseFloat("0").toFixed(3)
          }
          price = ItemData[i].Price;
          price_list = ItemData[i].ListName;
          unique_key = current_row_accessory.unique_key;
          nodeid = current_row_accessory.nodeid;

        } else {

          let tempdata = saved_data_from_dtl.filter(function (obj) {
            return obj['UNIQUE_KEY'] == ItemData[i].unique_key;
          });

          rowData = tempdata[0];
          if (ItemData[i].OPTM_PROPOGATEQTY == "Y") {
            if (rowData !== undefined && rowData.OPTM_QUANTITY !== undefined && rowData.OPTM_QUANTITY != "") {
              qty_value = rowData.OPTM_QUANTITY;
            } else if (ItemData[i].OPTM_QUANTITY !== undefined && ItemData[i].OPTM_QUANTITY != "") {
              qty_value = ItemData[i].OPTM_QUANTITY;
            } else {
              if (parentArray[0].OPTM_QUANTITY !== undefined && parentArray[0].OPTM_QUANTITY != "") {
                qty_value = parentArray[0].OPTM_QUANTITY;
              } else {
                qty_value = 1;
              }
            }

            // formatequantity = qty_value * this.step2_data.quantity
            formatequantity = qty_value;
          }
          else {
            if (ItemData[i].OPTM_QUANTITY !== undefined && ItemData[i].OPTM_QUANTITY != "") {
              qty_value = ItemData[i].OPTM_QUANTITY;
            }
            formatequantity = qty_value
          }
          if (rowData !== undefined) {
            if (rowData.OPTM_UNITPRICE == null && rowData.OPTM_UNITPRICE == undefined && rowData.OPTM_UNITPRICE == "") {
              price = parseFloat("0").toFixed(3);
            } else {
              price = rowData.OPTM_UNITPRICE;
            }
            price_list = (rowData.OPTM_PRICELIST != undefined) ? rowData.OPTM_PRICELIST : "0";
            unique_key = (rowData.UNIQUE_KEY != undefined) ? rowData.UNIQUE_KEY : "0";
            nodeid = (rowData.NODEID != undefined) ? rowData.NODEID : "0";
          } else {
            price = parseFloat("0").toFixed(3);
            price_list = 0;
            unique_key = 0;
            nodeid = 0;
          }

        }

        var priceextn: any = formatequantity * price
        /*let display_name = '';
        if (parentArray.name != "" && parentArray.name != undefined) {
          display_name = parentArray.name;
        } else if (parentArray.OPTM_DISPLAYNAME != "" && parentArray.OPTM_DISPLAYNAME != undefined) {
          display_name = parentArray.OPTM_DISPLAYNAME;
        }*/

        let display_name = this.selectedAccessoryHeader.filter(function (obj) {
          return (obj.unique_key == nodeid) ? obj.OPTM_DISPLAYNAME : "";
        });


        if (isExist.length == 0) {
          this.feature_itm_list_table.push({
            FeatureId: ItemData[i].OPTM_FEATUREID,
            featureName: display_name[0].OPTM_DISPLAYNAME,
            Item: ItemData[i].OPTM_ITEMKEY,
            discount: 0,
            ItemNumber: ItemData[i].DocEntry,
            Description: ItemData[i].OPTM_DISPLAYNAME,
            quantity: parseFloat(formatequantity).toFixed(3),
            original_quantity: parseFloat(qty_value).toFixed(3),
            price: price_list,
            Actualprice: parseFloat(price).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "Y",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            isQuantityDisabled: false,
            ispropogateqty: ItemData[i].OPTM_PROPOGATEQTY,
            HEADER_LINENO: isheadercounter,
            unique_key: unique_key,
            nodeid: nodeid,


          });
          console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
          isheadercounter++;
        }
      }
      this.feature_price_calculate();
    }
  }


  getDefaultItems(DefaultData) {
    //This function will set default item data in right grid.
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;

    for (var idefault in DefaultData) {
      var isExist;
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == DefaultData[idefault].OPTM_FEATUREID && obj['Item'] == DefaultData[idefault].OPTM_ITEMKEY && obj['nodeid'] == DefaultData[idefault].nodeid;
      });

      if (DefaultData[idefault].Price == null || DefaultData[idefault].Price == undefined || DefaultData[idefault].Price == "") {
        DefaultData[idefault].Price = 0;
      }

      DefaultData[idefault].OPTM_QUANTITY = parseFloat(DefaultData[idefault].OPTM_QUANTITY).toFixed(3)
      var formatequantity: any = DefaultData[idefault].OPTM_QUANTITY * this.step2_data.quantity
      var priceextn: any = formatequantity * DefaultData[idefault].Price

      let featureName = "";
      if (DefaultData[idefault].OPTM_FEATURECODE != undefined && DefaultData[idefault].OPTM_FEATURECODE != null) {
        featureName = DefaultData[idefault].OPTM_FEATURECODE
      } else {
        featureName = DefaultData[idefault].parent_code
      }

      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: DefaultData[idefault].OPTM_FEATUREID,
          featureName: featureName,
          Item: DefaultData[idefault].OPTM_ITEMKEY,
          discount: 0,
          ItemNumber: DefaultData[idefault].DocEntry,
          Description: DefaultData[idefault].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          original_quantity: parseFloat(DefaultData[idefault].OPTM_QUANTITY).toFixed(3),
          price: DefaultData[idefault].ListName,
          Actualprice: parseFloat(DefaultData[idefault].Price).toFixed(3),
          pricextn: parseFloat(priceextn).toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: this.step2_data.model_id,
          OPTM_LEVEL: 1,
          OPTM_TYPE: DefaultData[idefault].OPTM_TYPE,
          isQuantityDisabled: true,
          HEADER_LINENO: DefaultData[idefault].HEADER_LINENO,
          parent_featureid: DefaultData[idefault].parent_featureid,
          nodeid: DefaultData[idefault].nodeid,
          unique_key: DefaultData[idefault].unique_key,
          // sort_key:DefaultData[idefault].sort_key
        });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
      }
    }
    //this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.sort_key.localeCompare(b.sort_key))
    this.feature_price_calculate();

  }

  setModelDataInGrid(ModelData, ModelItems) {
    // this function sets Sub-Model Header & Items data in right grid.
    var isExist;
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let ItemPrice: any = 0;

    for (var imodelarray in ModelData) {
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == ModelData[imodelarray].OPTM_CHILDMODELID && obj['Description'] == ModelData[imodelarray].OPTM_DISPLAYNAME && obj['nodeid'] == ModelData[imodelarray].unique_key;
      });

      /* ModelData[imodelarray].OPTM_QUANTITY = parseFloat(ModelData[imodelarray].OPTM_QUANTITY) */
      /* var formatequantity: any = ModelData[imodelarray].OPTM_QUANTITY * this.step2_data.quantity */
      var formatequantity: any = 0;
      if (ModelData[imodelarray].OPTM_QUANTITY != undefined && ModelData[imodelarray].OPTM_QUANTITY != null) {
        formatequantity = ModelData[imodelarray].OPTM_QUANTITY;
      }

      let pricextn0 = 0;
      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: ModelData[imodelarray].OPTM_CHILDMODELID,
          featureName: ModelData[imodelarray].feature_code,
          Item: ModelData[imodelarray].OPTM_ITEMKEY,
          discount: 0,
          ItemNumber: "",
          Description: ModelData[imodelarray].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          original_quantity: parseFloat(formatequantity).toFixed(3),
          price: ModelData[imodelarray].ListName,
          Actualprice: pricextn0.toFixed(3),
          pricextn: pricextn0.toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: ModelData[imodelarray].OPTM_MODELID,
          OPTM_LEVEL: 1,
          OPTM_TYPE: ModelData[imodelarray].OPTM_TYPE,
          isQuantityDisabled: true,
          HEADER_LINENO: ModelData[imodelarray].OPTM_LINENO,
          OPTM_ITEMTYPE: 1,
          nodeid: ModelData[imodelarray].unique_key,
          // sort_key:ModelData[imodelarray].sort_key
        });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
      }

      var ModelItemsArray = [];
      ModelItemsArray = ModelItems.filter(function (obj) {
        return obj['OPTM_MODELID'] == ModelData[imodelarray].OPTM_CHILDMODELID && obj['OPTM_TYPE'] == 2 && obj['nodeid'] == ModelData[imodelarray].unique_key;
      });


      for (var imodelItemsarray in ModelItemsArray) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['FeatureId'] == ModelItemsArray[imodelItemsarray].OPTM_MODELID && obj['Item'] == ModelItemsArray[imodelItemsarray].OPTM_ITEMKEY && obj['nodeid'] == ModelItemsArray[imodelItemsarray].nodeid;
        });

        ModelItemsArray[imodelItemsarray].OPTM_QUANTITY = parseFloat(ModelItemsArray[imodelItemsarray].OPTM_QUANTITY).toFixed(3)

        var formatequantity: any = 1;
        let filteredModelHeaderData = [];
        filteredModelHeaderData = ModelData.filter(function (obj) {
          return obj.unique_key == ModelItemsArray[imodelItemsarray].nodeid
        })
        if (filteredModelHeaderData.length > 0) {
          if (filteredModelHeaderData[0].OPTM_PROPOGATEQTY == "Y") {
            formatequantity = ModelItemsArray[imodelItemsarray].OPTM_QUANTITY * filteredModelHeaderData[0].OPTM_QUANTITY;
          } else {
            formatequantity = ModelItemsArray[imodelItemsarray].OPTM_QUANTITY * this.step2_data.quantity;
          }
        } else {
          formatequantity = ModelItemsArray[imodelItemsarray].OPTM_QUANTITY * this.step2_data.quantity;
        }

        var priceextn: any = formatequantity * ModelItemsArray[imodelItemsarray].Price
        if (isExist.length == 0) {
          this.feature_itm_list_table.push({
            FeatureId: ModelItemsArray[imodelItemsarray].OPTM_FEATUREID,
            featureName: ModelItemsArray[imodelItemsarray].feature_code,
            Item: ModelItemsArray[imodelItemsarray].OPTM_ITEMKEY,
            discount: 0,
            ItemNumber: ModelItemsArray[imodelItemsarray].DocEntry,
            Description: ModelItemsArray[imodelItemsarray].OPTM_DISPLAYNAME,
            quantity: parseFloat(formatequantity).toFixed(3),
            original_quantity: parseFloat(formatequantity).toFixed(3),
            price: ModelItemsArray[imodelItemsarray].ListName,
            Actualprice: parseFloat(ModelItemsArray[imodelItemsarray].Price).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "N",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            ModelId: ModelItemsArray[imodelItemsarray].OPTM_MODELID,
            OPTM_LEVEL: 2,
            OPTM_ITEMTYPE: 1,
            OPTM_TYPE: ModelItemsArray[imodelItemsarray].OPTM_TYPE,
            isQuantityDisabled: true,
            HEADER_LINENO: ModelItemsArray[imodelItemsarray].HEADER_LINENO,
            nodeid: ModelItemsArray[imodelItemsarray].nodeid,
            unique_key: ModelItemsArray[imodelItemsarray].unique_key,
            // sort_key:ModelItemsArray[imodelItemsarray].sort_key
          });
          console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
          ItemPrice = ItemPrice + ModelItemsArray[imodelItemsarray].Price
        }
      }

      for (var ifeatureitem in this.feature_itm_list_table) {
        if (this.feature_itm_list_table[ifeatureitem].FeatureId == ModelData[imodelarray].OPTM_CHILDMODELID) {
          if (this.feature_itm_list_table[ifeatureitem].OPTM_TYPE != "3") {
            this.feature_itm_list_table[ifeatureitem].Actualprice = parseFloat(ItemPrice).toFixed(3)
          }
        }
      }

    }
    // this.feature_itm_list_table.sort((a, b) => a.sort_key.localeCompare(b.sort_key));
    this.feature_price_calculate();
  }

  setModelDataInGridForSavedData(ModelData, ModelItems, Savedgetmodelsavedata) {
    var isExist;
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let ItemPrice: any = 0;

    for (var imodelarray in ModelData) {
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == ModelData[imodelarray].OPTM_CHILDMODELID && obj['Description'] == ModelData[imodelarray].OPTM_DISPLAYNAME && obj['nodeid'] == ModelData[imodelarray].unique_key;
      });
      let formatequantity: any = '';
      let priceextn: any = '';
      let actualPrice: any = '';
      let unqiue_key: any;
      let nodeid: any;
      let get_saved_data = [];
      let originalQuantity: any = '';

      if (Savedgetmodelsavedata !== "" && Savedgetmodelsavedata !== undefined) {
        get_saved_data = Savedgetmodelsavedata.filter(function (obj) {
          return (obj.OPTM_ITEMCODE == ModelData[imodelarray].child_code && obj.NODEID == ModelData[imodelarray].unique_key) ? obj : "";
        })
      }

      if (get_saved_data.length == 0) {
        ModelData[imodelarray].OPTM_QUANTITY = parseFloat(ModelData[imodelarray].OPTM_QUANTITY).toFixed(3)
        formatequantity = ModelData[imodelarray].OPTM_QUANTITY * this.step2_data.quantity
        originalQuantity = ModelData[imodelarray].OPTM_QUANTITY
        priceextn = formatequantity * ModelData[imodelarray].Price
        actualPrice = ModelData[imodelarray].Price;
        nodeid = (ModelData[imodelarray].unqiue_key !== undefined) ? ModelData[imodelarray] : "";
      } else {
        get_saved_data[0].OPTM_QUANTITY = parseFloat(get_saved_data[0].OPTM_QUANTITY).toFixed(3)
        formatequantity = get_saved_data[0].OPTM_QUANTITY;
        originalQuantity = get_saved_data[0].OPTM_ORIGINAL_QUANTITY
        priceextn = formatequantity * get_saved_data[0].OPTM_UNITPRICE;
        actualPrice = get_saved_data[0].OPTM_UNITPRICE;
        nodeid = get_saved_data[0].UNIQUE_KEY;
      }

      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: ModelData[imodelarray].OPTM_CHILDMODELID,
          featureName: ModelData[imodelarray].child_code,
          Item: ModelData[imodelarray].OPTM_ITEMKEY,
          discount: 0,
          ItemNumber: "",
          Description: ModelData[imodelarray].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          original_quantity: parseFloat(originalQuantity).toFixed(3),
          price: ModelData[imodelarray].ListName,
          Actualprice: actualPrice.toFixed(3),
          pricextn: priceextn.toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: ModelData[imodelarray].OPTM_MODELID,
          OPTM_LEVEL: 1,
          OPTM_TYPE: ModelData[imodelarray].OPTM_TYPE,
          isQuantityDisabled: true,
          HEADER_LINENO: ModelData[imodelarray].OPTM_LINENO,
          OPTM_ITEMTYPE: 1,
          nodeid: nodeid,
          sort_key: ModelData[imodelarray].sort_key
        });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
      }

      var ModelItemsArray = [];
      ModelItemsArray = ModelItems.filter(function (obj) {
        return obj['OPTM_MODELID'] == ModelData[imodelarray].OPTM_CHILDMODELID && obj['OPTM_TYPE'] == 2 && obj['nodeid'] == ModelData[imodelarray].unique_key;
      });


      for (var imodelItemsarray in ModelItemsArray) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['FeatureId'] == ModelItemsArray[imodelItemsarray].OPTM_MODELID && obj['Item'] == ModelItemsArray[imodelItemsarray].OPTM_ITEMKEY && obj['nodeid'] == ModelItemsArray[imodelItemsarray].nodeid;
        });

        let formatequantity: any = '';
        let priceextn: any = '';
        let actualPrice: any = '';
        let unique_key: any;
        let nodeid: any;
        let get_saved_data = [];
        let originalQuantity: any = '';

        if (Savedgetmodelsavedata !== "" && Savedgetmodelsavedata !== undefined) {
          get_saved_data = Savedgetmodelsavedata.filter(function (obj) {
            return (obj.OPTM_ITEMCODE == ModelItemsArray[imodelItemsarray].OPTM_ITEMKEY && obj.NODEID == ModelItemsArray[imodelItemsarray].nodeid) ? obj : "";
          })
        }

        if (get_saved_data.length == 0) {
          ModelItemsArray[imodelItemsarray].OPTM_QUANTITY = parseFloat(ModelItemsArray[imodelItemsarray].OPTM_QUANTITY).toFixed(3)
          formatequantity = ModelItemsArray[imodelItemsarray].OPTM_QUANTITY * this.step2_data.quantity
          originalQuantity = ModelItemsArray[imodelItemsarray].OPTM_QUANTITY
          priceextn = formatequantity * ModelItemsArray[imodelItemsarray].Price
          actualPrice = ModelItemsArray[imodelItemsarray].Price;
          unique_key = (ModelItemsArray[imodelItemsarray].unique_key !== undefined) ? ModelItemsArray[imodelItemsarray].unique_key : "";
          nodeid = (ModelItemsArray[imodelItemsarray].nodeid !== undefined) ? ModelItemsArray[imodelItemsarray].nodeid : "";
        } else {
          get_saved_data[0].OPTM_QUANTITY = parseFloat(get_saved_data[0].OPTM_QUANTITY).toFixed(3)
          formatequantity = get_saved_data[0].OPTM_QUANTITY;
          originalQuantity = get_saved_data[0].OPTM_ORIGINAL_QUANTITY
          priceextn = formatequantity * get_saved_data[0].OPTM_UNITPRICE;
          actualPrice = get_saved_data[0].OPTM_UNITPRICE;
          unique_key = get_saved_data[0].UNIQUE_KEY;
          nodeid = get_saved_data[0].NODEID;
        }

        ModelItemsArray[imodelItemsarray].OPTM_QUANTITY = parseFloat(ModelItemsArray[imodelItemsarray].OPTM_QUANTITY).toFixed(3)

        if (isExist.length == 0) {
          this.feature_itm_list_table.push({
            FeatureId: ModelItemsArray[imodelItemsarray].OPTM_FEATUREID,
            featureName: ModelItemsArray[imodelItemsarray].feature_code,
            Item: ModelItemsArray[imodelItemsarray].OPTM_ITEMKEY,
            discount: 0,
            ItemNumber: ModelItemsArray[imodelItemsarray].DocEntry,
            Description: ModelItemsArray[imodelItemsarray].OPTM_DISPLAYNAME,
            quantity: parseFloat(formatequantity).toFixed(3),
            original_quantity: parseFloat(originalQuantity).toFixed(3),
            price: ModelItemsArray[imodelItemsarray].ListName,
            Actualprice: parseFloat(actualPrice).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "N",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            ModelId: ModelItemsArray[imodelItemsarray].OPTM_MODELID,
            OPTM_LEVEL: 2,
            OPTM_TYPE: ModelItemsArray[imodelItemsarray].OPTM_TYPE,
            isQuantityDisabled: true,
            HEADER_LINENO: ModelItemsArray[imodelItemsarray].HEADER_LINENO,
            nodeid: nodeid,
            unique_key: unique_key,
            sort_key: ModelItemsArray[imodelItemsarray].sort_key
          });
          console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
          ItemPrice = ItemPrice + ModelItemsArray[imodelItemsarray].Price
        }
      }

      /* for (var ifeatureitem in this.feature_itm_list_table) {
        if (this.feature_itm_list_table[ifeatureitem].FeatureId == ModelData[imodelarray].OPTM_CHILDMODELID) {
          this.feature_itm_list_table[ifeatureitem].Actualprice = parseFloat(ItemPrice).toFixed(3)
        }
      } */

    }
    this.feature_price_calculate();
    this.feature_itm_list_table.sort((a, b) => a.sort_key.localeCompare(b.sort_key));
  }

  setModelItemsDataInGrid(ModelItemsData) {
    //this function sets Items data of Model Header in right grid.
    var isExist;
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let ItemPrice = 0;

    for (var imodelarray in ModelItemsData) {
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == ModelItemsData[imodelarray].OPTM_MODELID && obj['Item'] == ModelItemsData[imodelarray].OPTM_ITEMKEY;
      });

      if (ModelItemsData[imodelarray].Price == null || ModelItemsData[imodelarray].Price == undefined || ModelItemsData[imodelarray].Price == "") {
        ModelItemsData[imodelarray].Price = 0;
      }

      ModelItemsData[imodelarray].OPTM_QUANTITY = parseFloat(ModelItemsData[imodelarray].OPTM_QUANTITY).toFixed(3)
      var formatequantity: any = ModelItemsData[imodelarray].OPTM_QUANTITY * this.step2_data.quantity
      var priceextn: any = formatequantity * ModelItemsData[imodelarray].Price
      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: ModelItemsData[imodelarray].OPTM_MODELID,
          featureName: ModelItemsData[imodelarray].feature_code,
          Item: ModelItemsData[imodelarray].OPTM_ITEMKEY,
          discount: 0,
          ItemNumber: ModelItemsData[imodelarray].DocEntry,
          Description: ModelItemsData[imodelarray].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          original_quantity: parseFloat(ModelItemsData[imodelarray].OPTM_QUANTITY).toFixed(3),
          price: ModelItemsData[imodelarray].ListName,
          Actualprice: parseFloat(ModelItemsData[imodelarray].Price).toFixed(3),
          pricextn: parseFloat(priceextn).toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: ModelItemsData[imodelarray].OPTM_MODELID,
          OPTM_LEVEL: 1,
          OPTM_TYPE: ModelItemsData[imodelarray].OPTM_TYPE,
          isQuantityDisabled: true,
          HEADER_LINENO: ModelItemsData[imodelarray].OPTM_LINENO,
          nodeid: ModelItemsData[imodelarray].nodeid,
          unique_key: ModelItemsData[imodelarray].unique_key,
          // sort_key: ModelItemsData[imodelarray].sort_key
          
        });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
        // this.feature_itm_list_table.sort((a, b) => a.sort_key.localeCompare(b.sort_key));
      }
    }
  }

  SetModelFeatureSavedItems(DefaultData, saved_data_for_output_dtl) {
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;

    for (var idefault in DefaultData) {
      var isExist;
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['nodeid'] == DefaultData[idefault].nodeid && obj['Item'] == DefaultData[idefault].OPTM_ITEMKEY;
      });

      var tempmodelid;
      var checkModelFeatureParent = this.ModelBOMDataForSecondLevel.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == DefaultData[idefault].OPTM_FEATUREID
      })
      if (checkModelFeatureParent.length > 0) {
        tempmodelid = checkModelFeatureParent[0].OPTM_MODELID
      }
      else {
        tempmodelid = this.step2_data.model_id
      }

      let get_saved_data = [];

      if (saved_data_for_output_dtl !== "" && saved_data_for_output_dtl !== undefined) {
        get_saved_data = saved_data_for_output_dtl.filter(function (obj) {
          return (obj.OPTM_ITEMCODE == DefaultData[idefault].OPTM_ITEMKEY && obj.NODEID == DefaultData[idefault].nodeid) ? obj : "";
        })
      }

      let formatequantity: any = '';
      let priceextn: any = '';
      let actualPrice: any = '';
      let unqiue_key: any;
      let nodeid: any;
      let originalQuantity: any = "";
      console.log("saved_data_for_output_dtl ", saved_data_for_output_dtl);
      if (get_saved_data.length == 0) {
        DefaultData[idefault].OPTM_QUANTITY = parseFloat(DefaultData[idefault].OPTM_QUANTITY).toFixed(3)
        formatequantity = DefaultData[idefault].OPTM_QUANTITY * this.step2_data.quantity
        originalQuantity = DefaultData[idefault].OPTM_QUANTITY
        priceextn = formatequantity * DefaultData[idefault].Price
        actualPrice = DefaultData[idefault].Price;
        unqiue_key = (DefaultData[idefault].unqiue_key !== undefined) ? DefaultData[idefault].unqiue_key : "";
        nodeid = (DefaultData[idefault].nodeid !== undefined) ? DefaultData[idefault].nodeid : "";
      } else {
        get_saved_data[0].OPTM_QUANTITY = parseFloat(get_saved_data[0].OPTM_QUANTITY).toFixed(3)
        // formatequantity= get_saved_data[0].OPTM_QUANTITY * this.step2_data.quantity
        formatequantity = get_saved_data[0].OPTM_QUANTITY;
        originalQuantity = get_saved_data[0].OPTM_ORIGINAL_QUANTITY;
        priceextn = formatequantity * get_saved_data[0].OPTM_UNITPRICE;
        actualPrice = get_saved_data[0].OPTM_UNITPRICE;
        unqiue_key = get_saved_data[0].UNIQUE_KEY;
        nodeid = get_saved_data[0].NODEID;
      }


      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: DefaultData[idefault].OPTM_FEATUREID,
          featureName: DefaultData[idefault].parent_code,
          Item: DefaultData[idefault].OPTM_ITEMKEY,
          discount: 0,
          ItemNumber: DefaultData[idefault].DocEntry,
          Description: DefaultData[idefault].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          original_quantity: parseFloat(originalQuantity).toFixed(3),
          price: DefaultData[idefault].ListName,
          Actualprice: parseFloat(actualPrice).toFixed(3),
          pricextn: parseFloat(priceextn).toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: tempmodelid,
          OPTM_LEVEL: 2,
          OPTM_TYPE: DefaultData[idefault].OPTM_TYPE,
          isQuantityDisabled: true,
          HEADER_LINENO: DefaultData[idefault].HEADER_LINENO,
          unique_key: unqiue_key,
          nodeid: nodeid,
          sort_key:DefaultData[idefault].sort_key
        });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
      }
    }
    // this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
    this.feature_itm_list_table.sort((a, b) => a.sort_key.localeCompare(b.sort_key));
    this.feature_price_calculate();

  }

  countFeatureBOMChildsByFeatureId(featureId) {
    if (featureId != 0 && featureId != null && featureId != undefined && featureId != "") {
      var featureBOMDataByFeatureId = this.FeatureBOMDataForSecondLevel.filter(function (array) {
        return array.OPTM_FEATUREID == featureId;
      });
      var featureBOMChildsCount = featureBOMDataByFeatureId.length;

      var featureChildsDataWithDisabledTrue = featureBOMDataByFeatureId.filter(function (array) {
        return array.disable == true;
      });
      var featureChildsCountWithDisabledTrue = featureChildsDataWithDisabledTrue.length;

      if (featureBOMChildsCount == featureChildsCountWithDisabledTrue) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }


  RuleIntegration(RuleOutputData, value, feature_model_data) {
    if (RuleOutputData.length > 0) {
      for (var iItemFeatureTable in this.FeatureBOMDataForSecondLevel) {
        loopRule:
        for (var iItemRule in RuleOutputData) {
          if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_TYPE == 1) {
            if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_CHILDFEATUREID == RuleOutputData[iItemRule].OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR) {

              if (value == true) {

                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  let currentFeatureBomData = this.FeatureBOMDataForSecondLevel[iItemFeatureTable]
                  if (currentFeatureBomData.parentfeatureid != null && currentFeatureBomData.parentfeatureid != "") {
                    this.removefeaturesanditems(currentFeatureBomData.parentfeatureid)
                  } else {
                    this.removefeaturesanditems(currentFeatureBomData.OPTM_FEATUREID)
                  }
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false

                  if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied == false && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked == false) {
                    if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID.toString() == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR && RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {

                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied = true
                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
                      this.ruleData.push(this.FeatureBOMDataForSecondLevel[iItemFeatureTable])

                      if (this.ruleData.length > 0) {
                        let rule_data_rule_index = this.ruleData[this.ruleIndex];

                        if (rule_data_rule_index.isSecondIteration == false) {
                          this.onselectionchange(rule_data_rule_index, true, 0, true, rule_data_rule_index.unique_key);
                          this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isSecondIteration = true
                        }

                        let featureBOMDataWithDefaults = [];
                        featureBOMDataWithDefaults = this.FeatureBOMDataForSecondLevel.filter(e => e.nodeid == this.ruleData[0].nodeid && e.OPTM_DEFAULT == 'Y' && e.isManuallyChecked == false);

                        var temp_this = this;
                        featureBOMDataWithDefaults.forEach(function (element) {
                          let index = temp_this.feature_itm_list_table.findIndex(function (obj) {
                            return obj.unique_key == element.unique_key
                          });
                          if (index != -1) {
                            temp_this.feature_itm_list_table.splice(
                              index, 1);
                          }
                        })
                        this.ruleData = []
                      }
                      break loopRule;
                    } else if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID.toString() == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR) {
                      if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_DEFAULT == "Y" && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked == true && !this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked) {
                        this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false;
                      }
                      break loopRule;
                    }
                  }

                }

              }
              //  }
              else {
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied = false
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isSecondIteration = false

                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                } else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                }

              }
            }
          }
          else if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_TYPE == 2) {
            if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_ITEMKEY == RuleOutputData[iItemRule].OPTM_ITEMKEY && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR) {

              var defaultitemarray = [];

              if (value == true) {


                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false

                  if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied == false && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked == false) {
                    if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID.toString() == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_ITEMKEY == RuleOutputData[iItemRule].OPTM_ITEMKEY && RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true;
                      this.ruleData.push(this.FeatureBOMDataForSecondLevel[iItemFeatureTable])
                      /* this.isRuleApplied = true */
                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied = true

                      if (this.ruleData.length > 0) {
                        let rule_data_rule_index = this.ruleData[this.ruleIndex];

                        /* if(this.isSecondIteration == false) { */
                        if (rule_data_rule_index.isSecondIteration == false) {
                          this.onselectionchange(rule_data_rule_index, true, 0, true, rule_data_rule_index.unique_key);
                          this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isSecondIteration = true
                        }
                        /* this.isSecondIteration =  true; */
                        /* } */

                        let featureBOMDataWithDefaults = [];
                        featureBOMDataWithDefaults = this.FeatureBOMDataForSecondLevel.filter(e => e.nodeid == this.ruleData[0].nodeid && e.OPTM_DEFAULT == 'Y' && e.isManuallyChecked == false);

                        var temp_this = this;
                        featureBOMDataWithDefaults.forEach(function (element) {
                          let index = temp_this.feature_itm_list_table.findIndex(function (obj) {
                            return obj.unique_key == element.unique_key
                          });
                          if (index != -1) {
                            temp_this.feature_itm_list_table.splice(
                              index, 1);
                          }
                        })
                        this.ruleData = [];

                      }

                      break loopRule;
                    } else if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID.toString() == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_ITEMKEY == RuleOutputData[iItemRule].OPTM_ITEMKEY) {

                      if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_DEFAULT == "Y" && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked == true && !this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked) {
                        this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false;
                      }
                      break loopRule;
                    }
                  } else if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked == true) {
                    var ModelHeaderData = this.ModelHeaderData.filter(function (obj) {
                      return obj.unique_key == feature_model_data.nodeid
                    })
                    if (ModelHeaderData.length > 0) {
                      if (ModelHeaderData[0].element_type == "radio") {
                        var nodeid = feature_model_data.nodeid;
                        var unique_key = feature_model_data.unique_key;
                        this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          if (obj.nodeid == nodeid && obj.unique_key != unique_key) {
                            obj['checked'] = false;
                          } else if (obj.nodeid == nodeid && obj.unique_key == unique_key) {
                            obj['checked'] = true;
                          }
                        })
                      }
                    }
                  }
                }

              } else {
                /* this.isSecondIteration = false */
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied = false
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isSecondIteration = false
                /* this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked = false */

                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                } else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false

                }
              }
            }
          }
          else {
            if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_VALUE == RuleOutputData[iItemRule].OPTM_VALUE) {
              if (value == true) {

                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false

                  if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied == false && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked == false) {
                    if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID.toString() == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_VALUE == RuleOutputData[iItemRule].OPTM_VALUE && RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {

                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied = true
                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true;
                      this.ruleData.push(this.FeatureBOMDataForSecondLevel[iItemFeatureTable])
                      /* this.isRuleApplied = true */

                      if (this.ruleData.length > 0) {

                        let featureBOMDataWithDefaults = [];
                        featureBOMDataWithDefaults = this.FeatureBOMDataForSecondLevel.filter(e => e.nodeid == this.ruleData[0].nodeid && e.OPTM_DEFAULT == 'Y' && e.isManuallyChecked == false);

                        var temp_this = this;
                        featureBOMDataWithDefaults.forEach(function (element) {
                          let index = temp_this.feature_itm_list_table.findIndex(function (obj) {
                            return obj.unique_key == element.unique_key
                          });
                          if (index != -1) {
                            temp_this.feature_itm_list_table.splice(
                              index, 1);
                          }
                        })

                      }
                      break loopRule;
                    } else if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID.toString() == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_VALUE == RuleOutputData[iItemRule].OPTM_VALUE) {

                      if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_DEFAULT == "Y" && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked == true && !this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked) {
                        this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false;
                      }
                      break loopRule;
                    }
                  }


                }
              }
              //  }
              else {
                /* this.isSecondIteration = false */
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied = false
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isSecondIteration = false
                /* this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked = false */
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                } else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                }
              }
            }
          }

          if (feature_model_data != "" && feature_model_data != undefined) {
            let filteredRuleOutputData = RuleOutputData.filter(function (obj) {
              if (obj['OPTM_FEATURE'] != "") {
                return obj.OPTM_FEATURE == feature_model_data.OPTM_FEATUREID
              }
            })
            if (filteredRuleOutputData.length == 0) {
              let modelBomRules = []
              if (feature_model_data.OPTM_TYPE == 2) {
                modelBomRules = this.ModelBOMRules.filter(function (obj) {
                  return obj.OPTM_FEATURE == feature_model_data.OPTM_FEATUREID /* && obj.OPTM_OP1CODE == feature_model_data.OPTM_ITEMKEY */
                })
              }
              if (modelBomRules.length > 0) {
                this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                  if (obj.OPTM_FEATUREID == modelBomRules[0].OPTM_APPLICABLEFOR && modelBomRules[0].OPTM_OPERATOR == undefined) {
                    obj['disable'] = false
                  }
                })
              }
            }
          }

        }
      }

      for (var iModelItemTable in this.ModelBOMDataForSecondLevel) {
        loopRule:
        for (var iItemRule in RuleOutputData) {
          if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_TYPE == 1) {
            if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID == RuleOutputData[iItemRule].OPTM_FEATUREID) {
              if (value == true) {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = true
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false

                }
              }
              else {
                this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false

              }

            }
          }
          else if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_TYPE == 2) {
            if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_ITEMKEY == RuleOutputData[iItemRule].OPTM_ITEMKEY) {
              var defaultitemarray = [];
              if (value == true) {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = true
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false

                  if (this.ModelBOMDataForSecondLevel[iModelItemTable].isRuleApplied == false && this.ModelBOMDataForSecondLevel[iModelItemTable].isManuallyChecked == false) {
                    var featureId = "";
                    if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID != null) {
                      featureId = this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID.toString();
                    } else {
                      featureId = ""
                    }
                    if (featureId == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR && this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_ITEMKEY == RuleOutputData[iItemRule].OPTM_ITEMKEY && RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                      this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true;
                      this.ruleData.push(this.ModelBOMDataForSecondLevel[iModelItemTable])
                      this.ModelBOMDataForSecondLevel[iModelItemTable].isRuleApplied = true

                      if (this.ruleData.length > 0) {
                        let rule_data_rule_index = this.ruleData[this.ruleIndex];

                        if (rule_data_rule_index.isSecondIteration == false) {
                          this.onselectionchange(rule_data_rule_index, true, 0, true, rule_data_rule_index.unique_key);
                          this.ModelBOMDataForSecondLevel[iModelItemTable].isSecondIteration = true
                        }

                        let featureBOMDataWithDefaults = [];
                        featureBOMDataWithDefaults = this.ModelBOMDataForSecondLevel.filter(e => e.nodeid == this.ruleData[0].nodeid && e.OPTM_DEFAULT == 'Y' && e.isManuallyChecked == false);

                        var temp_this = this;
                        featureBOMDataWithDefaults.forEach(function (element) {
                          let index = temp_this.feature_itm_list_table.findIndex(function (obj) {
                            return obj.unique_key == element.unique_key
                          });
                          if (index != -1) {
                            temp_this.feature_itm_list_table.splice(
                              index, 1);
                          }
                        })
                        this.ruleData = [];

                      }

                      break loopRule;
                    } else if (featureId.toString() == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR && this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_ITEMKEY == RuleOutputData[iItemRule].OPTM_ITEMKEY) {

                      if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_DEFAULT == "Y" && this.ModelBOMDataForSecondLevel[iModelItemTable].checked == true && !this.ModelBOMDataForSecondLevel[iModelItemTable].isManuallyChecked) {
                        this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false;
                      }
                      break loopRule;
                    }
                  }

                }
              }
              //  }
              else {
                this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
              }

            }
          }
          else {
            if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_CHILDMODELID == RuleOutputData[iItemRule].OPTM_FEATUREID) {
              if (value == true) {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = true
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                }
              }
              else {
                this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
              }

            }
          }

        }
      }

      for (var iFeatureItemaddedTable = 0; iFeatureItemaddedTable < this.feature_itm_list_table.length; iFeatureItemaddedTable++) {
        for (var iItemRule in RuleOutputData) {
          if (this.feature_itm_list_table[iFeatureItemaddedTable].Item == RuleOutputData[iItemRule].OPTM_ITEMKEY && this.feature_itm_list_table[iFeatureItemaddedTable].FeatureId == RuleOutputData[iItemRule].OPTM_APPLICABLEFOR) {
            if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
              this.feature_itm_list_table.splice(iFeatureItemaddedTable, 1)
              iFeatureItemaddedTable = iFeatureItemaddedTable - 1
              break;
            }
            else if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "True") {
              if (RuleOutputData[iItemRule].OPTM_ISQTYEDIT == "y") {
                this.feature_itm_list_table[iFeatureItemaddedTable].isQuantityDisabled = false
              }
              else {
                this.feature_itm_list_table[iFeatureItemaddedTable].isQuantityDisabled = true
              }

              var tempfeatureid = this.feature_itm_list_table[iFeatureItemaddedTable].FeatureId
              var tempnodeId = this.feature_itm_list_table[iFeatureItemaddedTable].nodeid
              if (this.feature_itm_list_table[iFeatureItemaddedTable].is_accessory == "N") {
                var modelheaderpropagatechecked = this.ModelHeaderData.filter(function (obj) {
                  return obj['OPTM_FEATUREID'] == tempfeatureid && obj['unique_key'] == tempnodeId
                })
                if (modelheaderpropagatechecked.length > 0) {
                  if (modelheaderpropagatechecked[0].OPTM_PROPOGATEQTY == "Y") {
                    var propagateQuantity = 1;
                    if (modelheaderpropagatechecked[0].OPTM_TYPE == "1") {
                      var itemkey = this.feature_itm_list_table[iFeatureItemaddedTable].Item
                      var nodeId = this.feature_itm_list_table[iFeatureItemaddedTable].nodeid
                      var featurepropagatecheck = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                        return obj['OPTM_ITEMKEY'] == itemkey && obj['nodeid'] == nodeId
                      })
                      if (featurepropagatecheck.length > 0) {
                        if (featurepropagatecheck[0].OPTM_PROPOGATEQTY == "Y") {
                          propagateQuantity = this.getPropagateQuantity(tempnodeId);
                          if (propagateQuantity > 1) {
                            this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * propagateQuantity)
                          } else {
                            this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * this.step2_data.quantity)
                          }
                        }
                      }
                    }
                    else if (modelheaderpropagatechecked[0].OPTM_TYPE == "2") {
                      if (modelheaderpropagatechecked[0].OPTM_ITEMKEY == this.feature_itm_list_table[iFeatureItemaddedTable].Item && modelheaderpropagatechecked[0].unique_key == this.feature_itm_list_table[iFeatureItemaddedTable].nodeId) {

                        if (modelheaderpropagatechecked[0].OPTM_QUANTITY > 1) {
                          this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * modelheaderpropagatechecked[0].OPTM_QUANTITY)
                        } else {
                          this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * this.step2_data.quantity)
                        }
                      }
                    }
                    else {
                      let itemkey = this.feature_itm_list_table[iFeatureItemaddedTable].Item
                      let nodeId = this.feature_itm_list_table[iFeatureItemaddedTable].nodeid
                      let modelfeaturepropagatecheck = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                        return obj['OPTM_ITEMKEY'] == itemkey && obj['nodeid'] == nodeId
                      })
                      if (modelfeaturepropagatecheck.length > 0) {
                        if (modelfeaturepropagatecheck[0].OPTM_PROPOGATEQTY == "Y") {
                          propagateQuantity = this.getPropagateQuantity(tempnodeId);
                          if (propagateQuantity > 1) {
                            this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * propagateQuantity)
                          } else {
                            this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * this.step2_data.quantity)
                          }
                        }
                      }
                    }
                  }
                  else {
                    this.feature_itm_list_table[iFeatureItemaddedTable].quantity = parseFloat(RuleOutputData[iItemRule].OPTM_QUANTITY).toFixed(3)
                  }

                }
                else {
                  this.feature_itm_list_table[iFeatureItemaddedTable].quantity = parseFloat(RuleOutputData[iItemRule].OPTM_QUANTITY).toFixed(3)
                }
              }
              else {
                var modelheaderpropagatechecked = this.Accessoryarray.filter(function (obj) {
                  return obj['OPTM_FEATUREID'] == tempfeatureid
                })
                if (modelheaderpropagatechecked.length > 0) {
                  if (modelheaderpropagatechecked[0].OPTM_PROPOGATEQTY == "Y") {
                    if (this.feature_itm_list_table[iFeatureItemaddedTable].ispropogateqty == "Y") {
                      this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * this.step2_data.quantity)
                    }

                  }

                }
              }



              this.feature_itm_list_table[iFeatureItemaddedTable].quantity = parseFloat(this.feature_itm_list_table[iFeatureItemaddedTable].quantity).toFixed(3)
              this.feature_itm_list_table[iFeatureItemaddedTable].original_quantity = parseFloat(RuleOutputData[iItemRule].OPTM_QUANTITY).toFixed(3)

              if (RuleOutputData[iItemRule].OPTM_ISPRICEEDIT == "y") {
                this.feature_itm_list_table[iFeatureItemaddedTable].isPriceDisabled = false
                this.feature_itm_list_table[iFeatureItemaddedTable].pricehide = false
              }
              else {
                this.feature_itm_list_table[iFeatureItemaddedTable].isPriceDisabled = true
                this.feature_itm_list_table[iFeatureItemaddedTable].pricehide = true
              }

            }
          }
        }
      }
    }
    else {
      /* this.isRuleApplied = false */

      for (var iItemFeatureList in this.feature_itm_list_table) {
        this.feature_itm_list_table[iItemFeatureList].isPriceDisabled = true
        this.feature_itm_list_table[iItemFeatureList].pricehide = true
        this.feature_itm_list_table[iItemFeatureList].isQuantityDisabled = true
      }
      for (var iItemFeatureTable in this.FeatureBOMDataForSecondLevel) {
        this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
        this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isManuallyChecked = false
        this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isSecondIteration = false
        this.FeatureBOMDataForSecondLevel[iItemFeatureTable].isRuleApplied = false

        // if( this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked==false &&  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_DEFAULT=="Y" ){
        var tempcheckfeatureid = this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID
        let tempNodeId = this.FeatureBOMDataForSecondLevel[iItemFeatureTable].nodeid
        let feature_itm_node_id = (this.feature_itm_list_table[iItemFeatureList] !== undefined && this.feature_itm_list_table[iItemFeatureList].nodeid !== undefined) ? this.feature_itm_list_table[iItemFeatureList].nodeid : "";

        var tempcheckedarray = [];
        tempcheckedarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return tempNodeId == obj['OPTM_FEATUREID'] && obj['checked'] == true
        })
        /*if (tempcheckedarray.length == 0 && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_DEFAULT == "Y" && value == true && tempNodeId == feature_itm_node_id) {
          tempcheckedarray.push(this.FeatureBOMDataForSecondLevel[iItemFeatureTable])
          if (tempcheckedarray.length > 0) {
            if (tempcheckedarray[0].OPTM_TYPE == "2") {
              tempcheckedarray[0].OPTM_FEATURECODE = tempcheckedarray[0].parent_code
              this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
              this.getDefaultItems(tempcheckedarray)
            }

          }

        }*/


        // }
      }

      for (var iModelItemTable in this.ModelBOMDataForSecondLevel) {
        this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
      }

    }
    this.defaultitemflagid = "";
  }



  removeLeftAndRightGridDataWhenRuleApplied(RuleOutputData) {
    for (let modelHeaderIndex = 0; modelHeaderIndex < this.ModelHeaderData.length; modelHeaderIndex++) {
      if (this.ModelHeaderData[modelHeaderIndex].OPTM_FEATUREID == RuleOutputData.OPTM_FEATUREID) {
        this.ModelHeaderData.splice(modelHeaderIndex, 1);
        modelHeaderIndex = modelHeaderIndex - 1;
      }
    }
    for (let featureBomIndex = 0; featureBomIndex < this.FeatureBOMDataForSecondLevel.length; featureBomIndex++) {
      if (this.FeatureBOMDataForSecondLevel[featureBomIndex].OPTM_FEATUREID == RuleOutputData.OPTM_FEATUREID) {
        this.FeatureBOMDataForSecondLevel.splice(featureBomIndex, 1);
        featureBomIndex = featureBomIndex - 1;
      }
    }
    for (let featureItmListIndex = 0; featureItmListIndex < this.feature_itm_list_table.length; featureItmListIndex++) {
      if (this.feature_itm_list_table[featureItmListIndex].FeatureId == RuleOutputData.OPTM_FEATUREID) {
        this.feature_itm_list_table.splice(featureItmListIndex, 1);
        featureItmListIndex = featureItmListIndex - 1;
      }
    }
  }

  checkedFunction(feature_model_data, elementtypeforcheckedfunction, value, enabled) {

    for (var ifeaturechecked in this.FeatureBOMDataForSecondLevel) {

      if (feature_model_data.OPTM_TYPE == 2 && elementtypeforcheckedfunction == "checkbox") {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key == feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_ITEMKEY == feature_model_data.OPTM_ITEMKEY && this.FeatureBOMDataForSecondLevel[ifeaturechecked].nodeid == feature_model_data.nodeid) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        }

      } else if (elementtypeforcheckedfunction == "radio") {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key == feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].nodeid == feature_model_data.nodeid) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        } else if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key != feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].nodeid == feature_model_data.nodeid) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
        }
        if (enabled) {
          if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ifeaturechecked].nodeid == feature_model_data.nodeid && elementtypeforcheckedfunction == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID) {
            this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
            var tempfeaturechild = parseInt(this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID);
            var tempNodeId = this.FeatureBOMDataForSecondLevel[ifeaturechecked].nodeid
            this.FeatureBOMDataForSecondLevel = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
              if (obj['OPTM_FEATUREID'] == tempfeaturechild && obj['nodeid'] == tempNodeId) {
                obj['checked'] = false
              }
              return obj
            })
          }
        }
      }
      else if (feature_model_data.OPTM_TYPE == 1 && elementtypeforcheckedfunction == "checkbox") {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key == feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        }
        if (enabled) {
          if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && elementtypeforcheckedfunction == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID) {
            this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
            var tempfeaturechild = parseInt(this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID);
            this.FeatureBOMDataForSecondLevel = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
              if (obj['OPTM_FEATUREID'] == tempfeaturechild) {
                obj['checked'] = false
              }
              return obj
            })
          }
        }
      }
      else {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_VALUE == feature_model_data.OPTM_VALUE) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        }
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && elementtypeforcheckedfunction == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_VALUE != feature_model_data.OPTM_VALUE) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
        }
      }


    }

    for (var imodelchecked in this.ModelBOMDataForSecondLevel) {
      if (feature_model_data.OPTM_TYPE == 2) {
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_ITEMKEY == feature_model_data.OPTM_ITEMKEY && this.ModelBOMDataForSecondLevel[imodelchecked].unique_key == feature_model_data.unique_key) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = value
        }
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && elementtypeforcheckedfunction == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_ITEMKEY != feature_model_data.OPTM_ITEMKEY && this.ModelBOMDataForSecondLevel[imodelchecked].unique_key == feature_model_data.unique_key) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        }
      }
      else if (feature_model_data.OPTM_TYPE == 1) {
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDFEATUREID == feature_model_data.OPTM_CHILDFEATUREID && this.ModelBOMDataForSecondLevel[imodelchecked].nodeid == feature_model_data.nodeid) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = value
        }
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && elementtypeforcheckedfunction == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID && this.ModelBOMDataForSecondLevel[imodelchecked].nodeid == feature_model_data.nodeid) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        }
      }
      else {
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDMODELID == feature_model_data.OPTM_CHILDMODELID && this.ModelBOMDataForSecondLevel[imodelchecked].nodeid == feature_model_data.nodeid) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = value
        }
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && elementtypeforcheckedfunction == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDMODELID != feature_model_data.OPTM_CHILDMODELID && this.ModelBOMDataForSecondLevel[imodelchecked].nodeid == feature_model_data.nodeid) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        }
      }

    }

  }

  onModelCodeChange() {
    /* this.onclearselection(1); */
    this.showLookupLoader = true;
    this.OutputService.onModelIdChange(this.step2_data.model_code).subscribe(
      data => {

        if (data != undefined && data.length > 0) {
          if (data != undefined && data != undefined) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
        }

        if (data === "False") {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.InvalidModelId, this.commonData.toast_config);
          this.step2_data.modal_id = "";
          this.step2_data.model_code = "";
          this.onclearselection(1);
          return;
        }
        else {
          this.step2_data.model_id = data;
          this.GetAllDataForModelBomOutput("");
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
      })
  }

  setModelDataInOutputBom(getmodelsavedata, SelectedAccessory, modelHeaderdata, selectedAccessoryHeader) {

    this.feature_itm_list_table = [];
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let ItemPrice = 0;
    for (var imodelsavedata in getmodelsavedata) {
      if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 1) {
        let filtemodeldataheader = [];
        filtemodeldataheader = this.ModelHeaderData.filter(function (obj) {
          return obj['child_code'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE
        })
        var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE

        if (filtemodeldataheader.length > 0)
          this.feature_itm_list_table.push({
            FeatureId: filtemodeldataheader[0].OPTM_CHILDMODELID,
            featureName: filtemodeldataheader[0].child_code,
            Item: filtemodeldataheader[0].OPTM_ITEMKEY,
            discount: 0,
            ItemNumber: filtemodeldataheader[0].DocEntry,
            Description: filtemodeldataheader[0].OPTM_DISPLAYNAME,
            quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
            original_quantity: parseFloat(filtemodeldataheader[0].OPTM_QUANTITY).toFixed(3),
            price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
            Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "N",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            ModelId: filtemodeldataheader[0].OPTM_MODELID,
            OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
            OPTM_TYPE: getmodelsavedata[imodelsavedata].OPTM_TYPE,
            isQuantityDisabled: true,
            HEADER_LINENO: parseFloat(imodelsavedata) + 1,
            sort_key:getmodelsavedata[imodelsavedata].sort_key
          });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
      }
      else if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 2) {
        if (getmodelsavedata[imodelsavedata].OPTM_LEVEL == 2) {
          var ModelItemsArray = [];
          ModelItemsArray = this.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
          });

          var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE

          if (ModelItemsArray.length > 0) {

            let data_from_mbom = this.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == ModelItemsArray[0].OPTM_FEATUREID
            })
            if (data_from_mbom.length > 0) {
              var mbom_quantity = data_from_mbom[0].OPTM_QUANTITY;
            }
            this.feature_itm_list_table.push({
              FeatureId: ModelItemsArray[0].OPTM_FEATUREID,
              featureName: ModelItemsArray[0].feature_code,
              Item: ModelItemsArray[0].OPTM_ITEMKEY,
              discount: 0,
              ItemNumber: ModelItemsArray[0].DocEntry,
              Description: ModelItemsArray[0].OPTM_DISPLAYNAME,
              quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
              original_quantity: parseFloat(mbom_quantity).toFixed(3),
              price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
              Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE).toFixed(3),
              pricextn: parseFloat(priceextn).toFixed(3),
              is_accessory: "N",
              isPriceDisabled: isPriceDisabled,
              pricehide: isPricehide,
              ModelId: ModelItemsArray[0].OPTM_MODELID,
              OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
              OPTM_TYPE: getmodelsavedata[imodelsavedata].OPTM_TYPE,
              isQuantityDisabled: true,
              HEADER_LINENO: parseFloat(imodelsavedata) + 1,
              sort_key:getmodelsavedata[imodelsavedata].sort_key
            });
            console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
          }
        }
        else {
          var ItemsArray = [];
          ItemsArray = this.ModelHeaderItemsArray.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
          });
          if (ItemsArray.length == 0 && getmodelsavedata[imodelsavedata].OPTM_PARENTTYPE == 2) {
            ItemsArray = this.ModelBOMDataForSecondLevel.filter(function (obj) {
              return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
            });
          }
          if (ItemsArray.length == 0 && getmodelsavedata[imodelsavedata].OPTM_PARENTTYPE == 1) {
            ItemsArray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
              return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
            });
          }

          var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_UNITPRICE
          let data_from_mbom;
          if (modelHeaderdata.OPTM_ITEMKEY != null) {
            data_from_mbom = modelHeaderdata.filter(function (obj) {
              return obj['OPTM_ITEMKEY'] == ItemsArray[0].OPTM_ITEMKEY
            })
          }
          if (data_from_mbom != undefined) {
            if (data_from_mbom.length == 0) {
              data_from_mbom = modelHeaderdata.filter(function (obj) {
                return obj['OPTM_FEATUREID'] == ItemsArray[0].OPTM_FEATUREID
              })
            }
            var mbomQuantity = data_from_mbom[0].OPTM_QUANTITY;
          }
          if (ItemsArray.length > 0) {
            this.feature_itm_list_table.push({
              FeatureId: ItemsArray[0].OPTM_FEATUREID,
              featureName: ItemsArray[0].parent_code,
              Item: ItemsArray[0].OPTM_ITEMKEY,
              discount: 0,
              ItemNumber: ItemsArray[0].DocEntry,
              Description: ItemsArray[0].OPTM_DISPLAYNAME,
              quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
              original_quantity: parseFloat(mbomQuantity).toFixed(3),
              price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
              Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_UNITPRICE).toFixed(3),
              pricextn: parseFloat(priceextn).toFixed(3),
              is_accessory: "N",
              isPriceDisabled: isPriceDisabled,
              pricehide: isPricehide,
              ModelId: ItemsArray[0].OPTM_MODELID,
              OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
              OPTM_TYPE: getmodelsavedata[imodelsavedata].OPTM_TYPE,
              isQuantityDisabled: true,
              HEADER_LINENO: parseFloat(imodelsavedata) + 1,
              sort_key:getmodelsavedata[imodelsavedata].sort_key
            });
            console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
          }
        }
      }


      else if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 3) {
        if (selectedAccessoryHeader.length > 0) {
          for (let i = 0; i < selectedAccessoryHeader.length; i++) {
            this.setItemDataForFeatureAccessory(SelectedAccessory, selectedAccessoryHeader[i], "", "");
          }
        }
      }
      /* else if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 3) {
         let parentfeatureid;
         let parentmodelid;
         var tempSelectedAccessoryArray;
         if (getmodelsavedata[imodelsavedata].OPTM_PARENTTYPE == 1) {
           parentfeatureid = getmodelsavedata[imodelsavedata].OPTM_PARENTID
           parentmodelid = ""
         }
         else {
           parentfeatureid = ""
           parentmodelid = getmodelsavedata[imodelsavedata].OPTM_PARENTID
         }
 
         tempSelectedAccessoryArray = SelectedAccessory.filter(function (obj) {
           return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE
         })
 
 
         var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_UNITPRICE
 
         if (tempSelectedAccessoryArray.length > 0) {
           let head_acc_data = modelHeaderdata.filter(function (obj) {
             return obj['OPTM_FEATUREID'] == tempSelectedAccessoryArray[0].OPTM_FEATUREID
           });
 
           this.feature_itm_list_table.push({
             FeatureId: parentfeatureid,
             featureName: head_acc_data[0].feature_code,
             Item: tempSelectedAccessoryArray[0].OPTM_ITEMKEY,
             ItemNumber: getmodelsavedata[imodelsavedata].OPTM_ITEMNUMBER,
             Description: tempSelectedAccessoryArray[0].OPTM_DISPLAYNAME,
             quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
             original_quantity: parseFloat(head_acc_data[0].OPTM_QUANTITY).toFixed(3),
             price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
             Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_UNITPRICE).toFixed(3),
             pricextn: parseFloat(priceextn).toFixed(3),
             is_accessory: "Y",
             isPriceDisabled: isPriceDisabled,
             pricehide: isPricehide,
             ispropogateqty: tempSelectedAccessoryArray[0].OPTM_PROPOGATEQTY,
             ModelId: this.step2_data.model_id,
             OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
             isQuantityDisabled: true,
             HEADER_LINENO: parseFloat(imodelsavedata) + 1,
             sort_key:getmodelsavedata[imodelsavedata].sort_key
           });
           console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
         }
 
 
         for (var iaccess in this.feature_accessory_list) {
           if (parentfeatureid == this.feature_accessory_list[iaccess].id) {
             this.feature_accessory_list[iaccess].checked = true
           }
         }
         this.feature_price_calculate();
       }*/
    }
    if (this.feature_itm_list_table.length > 0) {
      for (var ifeatureitemlist in this.feature_itm_list_table) {
        for (var ifeatureBomData in this.FeatureBOMDataForSecondLevel) {
          if (this.feature_itm_list_table[ifeatureitemlist].Item == this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_ITEMKEY && this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_ITEMKEY != null) {
            this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = true
            this.FeatureBOMDataForSecondLevel[ifeatureBomData].disable = false
          }
          if (this.feature_itm_list_table[ifeatureitemlist].Item != this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_ITEMKEY && this.feature_itm_list_table[ifeatureitemlist].FeatureId == this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_FEATUREID) {
            var featureid = this.feature_itm_list_table[ifeatureitemlist].FeatureId
            var parentarray = this.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == featureid
            })
            if (parentarray.length > 0) {
              if (parentarray[0].OPTM_MAXSELECTABLE == 1) {
                this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = false
              }
              else {
                if (this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_FEATUREID == parentarray[0].OPTM_FEATUREID) {
                  var modeldataitemfilter = getmodelsavedata.filter(function (obj) {
                    return obj['OPTM_PARENTID'] == parentarray[0].OPTM_FEATUREID
                  })

                  for (var imodeldataitemfilter in modeldataitemfilter) {
                    if (modeldataitemfilter[imodeldataitemfilter].OPTM_ITEMCODE == this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_ITEMKEY) {
                      this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = true
                    }
                    // else {
                    //   this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = false
                    // }
                  }
                }
              }

            }

          }

        }
        for (var imodelBomData in this.ModelBOMDataForSecondLevel) {
          if (this.feature_itm_list_table[ifeatureitemlist].Item == this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_ITEMKEY && this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_ITEMKEY != null) {
            this.ModelBOMDataForSecondLevel[imodelBomData].checked = true
            this.ModelBOMDataForSecondLevel[imodelBomData].disable = false
          }
          if (this.feature_itm_list_table[ifeatureitemlist].Item != this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_ITEMKEY && this.feature_itm_list_table[ifeatureitemlist].FeatureId == this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_MODELID) {
            var modelid = this.feature_itm_list_table[ifeatureitemlist].FeatureId
            var parentarray = this.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_MODELID'] == modelid
            })
            if (parentarray.length > 0) {
              if (parentarray[0].OPTM_MAXSELECTABLE == 1) {
                this.ModelBOMDataForSecondLevel[imodelBomData].checked = false
              }
              else {
                if (this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_FEATUREID == parentarray[0].OPTM_FEATUREID) {
                  var modeldataitemfilter = getmodelsavedata.filter(function (obj) {
                    return obj['OPTM_PARENTID'] == parentarray[0].OPTM_FEATUREID
                  })

                  for (var imodeldataitemfilter in modeldataitemfilter) {
                    if (modeldataitemfilter[imodeldataitemfilter].OPTM_ITEMCODE == this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_ITEMKEY) {
                      this.ModelBOMDataForSecondLevel[imodelBomData].checked = true
                    }
                    else {
                      this.ModelBOMDataForSecondLevel[imodelBomData].checked = false
                    }
                  }
                }
              }

            }

          }

        }

      }
    }
    // this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
    this.feature_itm_list_table.sort((a, b) => a.sort_key.localeCompare(b.sort_key));
    this.feature_price_calculate();

  }//end function

  removemodelheaderdatatable(removemodelheaderid, uniqueKey, removefeatureid) {
    for (let iremove = 0; iremove < this.ModelHeaderData.length; iremove++) {
      let parentId = "";
      let modelHeaderId = "";
      if (removemodelheaderid != undefined && removemodelheaderid != null) {
        parentId = this.ModelHeaderData[iremove].parentmodelid
        modelHeaderId = removemodelheaderid
      } else {
        parentId = this.ModelHeaderData[iremove].parentfeatureid
        modelHeaderId = removefeatureid
      }
      if (parentId == modelHeaderId && this.ModelHeaderData[iremove].nodeid == uniqueKey) {
        let removedModelId = this.ModelHeaderData[iremove].OPTM_CHILDMODELID
        let removeUniqueKey = this.ModelHeaderData[iremove].unique_key
        let removeFeatureId = this.ModelHeaderData[iremove].OPTM_FEATUREID


        for (let igrid = 0; igrid < this.feature_itm_list_table.length; igrid++) {
          if (this.feature_itm_list_table[igrid].FeatureId == this.ModelHeaderData[iremove].OPTM_FEATUREID && this.feature_itm_list_table[igrid].nodeid == this.ModelHeaderData[iremove].unique_key) {
            this.feature_itm_list_table.splice(igrid, 1);
            igrid = igrid - 1;
          }
        }

        for (let isecond = 0; isecond < this.FeatureBOMDataForSecondLevel.length; isecond++) {
          if (this.FeatureBOMDataForSecondLevel[isecond].OPTM_FEATUREID == this.ModelHeaderData[iremove].OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[isecond].nodeid == this.ModelHeaderData[iremove].unique_key) {
            this.FeatureBOMDataForSecondLevel.splice(isecond, 1);
            isecond = isecond - 1;
          }
        }


        this.ModelHeaderData.splice(iremove, 1);
        this.removemodelheaderdatatable(removedModelId, removeUniqueKey, removeFeatureId)
      }
    }
  }

  //this remove items which have 1 maximum selectable
  removefeatureitemlist(featureid) {
    var maxselect = this.ModelHeaderData.filter(function (obj) {
      return obj['OPTM_FEATUREID'] == featureid
    })
    if (maxselect.length > 0) {
      if (maxselect[0].OPTM_MAXSELECTABLE == "1") {
        for (var iFeatureItemadded = 0; iFeatureItemadded < this.feature_itm_list_table.length; iFeatureItemadded++) {
          if (this.feature_itm_list_table[iFeatureItemadded].FeatureId == maxselect[0].OPTM_FEATUREID) {
            this.feature_itm_list_table.splice(iFeatureItemadded, 1)
            iFeatureItemadded = iFeatureItemadded - 1;
          }

        }
      }
    }
  }

  removeFeatureItemInRuleByUncheck(featureId, unique_key) {
    for (var iFeatureItemadded = 0; iFeatureItemadded < this.feature_itm_list_table.length; iFeatureItemadded++) {
      if (this.feature_itm_list_table[iFeatureItemadded].FeatureId == featureId && this.feature_itm_list_table[iFeatureItemadded].unique_key == unique_key) {
        this.feature_itm_list_table.splice(iFeatureItemadded, 1)
        iFeatureItemadded = iFeatureItemadded - 1;
      }
    }
  }

  enableFeatureModelsItems() {
    this.FeatureBOMDataForSecondLevel = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
      obj['disable'] = false
      return obj
    })
    this.ModelBOMDataForSecondLevel = this.ModelBOMDataForSecondLevel.filter(function (obj) {
      obj['disable'] = false
      return obj
    })
  }

  ischeckedRow(RuleOutputData, FeatureModelData, featureid) {
    var tempRuleArray = RuleOutputData.filter(function (obj) {
      return obj['OPTM_ISINCLUDED'].trim() == "True"
    })


    if (tempRuleArray.length > 0) {
      for (var itemp in tempRuleArray) {
        var tempFeatArray = FeatureModelData.filter(function (obj) {
          return obj['OPTM_ITEMKEY'] == tempRuleArray[itemp].OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "N" && obj['OPTM_FEATUREID'] == featureid
        })
        if (tempFeatArray.length == 0) {
          var tempFeatArray = FeatureModelData.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == tempRuleArray[itemp].OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "Y" && obj['checked'] == true && obj['OPTM_FEATUREID'] == featureid
          })
        }
        if (tempFeatArray.length > 0) {
          if (tempFeatArray[0].checked == true) {
            return true
            // break
          }

        }
      }

    }
    return false
  }

  isRuleDefaultItemRow(RuleOutputData, FeatureModelData, featureid, feature_model_data) {
    if (RuleOutputData.OPTM_FEATUREID != "" && RuleOutputData.OPTM_FEATUREID != null && RuleOutputData.OPTM_FEATUREID != undefined) {
      var tempFeatArray = FeatureModelData.filter(function (obj) {
        return obj['OPTM_ITEMKEY'] == RuleOutputData.OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "N" && obj['nodeid'] == feature_model_data.nodeid
      })
      if (tempFeatArray.length == 0) {
        var tempFeatArray = FeatureModelData.filter(function (obj) {
          return obj['OPTM_ITEMKEY'] == RuleOutputData.OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "Y" && obj['checked'] == true && obj['nodeid'] == feature_model_data.nodeid
        })
      }
      if (tempFeatArray.length > 0) {
        if (tempFeatArray[0].checked == true) {
          return true
          // break
        }
      }
    }
    return false
  }


  removefeaturesanditems(parentfeatureid) {
    var tempfeatureidmodelheader;
    var tempparentfeatureidmodelheader;
    var tempchildfeatureidmodelheader;
    var tempchildfeatunique_key;
    var itemkey;
    var tempfeatureidforfeaturebom;
    var tempNodeId;
    for (var itemp = 0; itemp < this.ModelHeaderData.length; itemp++) {
      if (this.ModelHeaderData[itemp].parentfeatureid == parentfeatureid) {
        tempfeatureidmodelheader = this.ModelHeaderData[itemp].OPTM_FEATUREID
        tempchildfeatunique_key = this.ModelHeaderData[itemp].unique_key
        this.ModelHeaderData.splice(itemp, 1);
        itemp = itemp - 1

        for (var itemp2 = 0; itemp2 < this.FeatureBOMDataForSecondLevel.length; itemp2++) {
          if (this.FeatureBOMDataForSecondLevel[itemp2].nodeid == tempchildfeatunique_key && this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID == tempfeatureidmodelheader) {
            if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "1") {
              tempchildfeatureidmodelheader = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              this.removefeaturesanditems(tempchildfeatureidmodelheader)
            }
            else if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "2") {
              tempfeatureidforfeaturebom = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID
              tempNodeId = this.FeatureBOMDataForSecondLevel[itemp2].nodeid
              itemkey = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_ITEMKEY
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              for (var itemp3 = 0; itemp3 < this.feature_itm_list_table.length; itemp3++) {
                if (this.feature_itm_list_table[itemp3].nodeid == tempNodeId && this.feature_itm_list_table[itemp3].Item == itemkey) {
                  this.feature_itm_list_table.splice(itemp3, 1)
                  itemp3 = itemp3 - 1
                }
              }
            }
            else {
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
            }
          }
        }


      }

    }

  }

  removefeaturesbyuncheck(featureid, featurecode, nodeid, unique_key) {
    var tempfeatureidmodelheader;
    var tempparentfeatureidmodelheader;
    var tempchildfeatureidmodelheader;
    var tempchildfeaturecodemodelheader;
    var itemkey;
    var tempfeatureidforfeaturebom;
    var tempchildfeatuniqueKey;
    let tempNodeId;
    let tempchildfeaturecode_nodeid;
    let tempchildfeaturecode_unique_key;
    for (var itemp = 0; itemp < this.ModelHeaderData.length; itemp++) {
      if (this.ModelHeaderData[itemp].parentfeatureid == featureid && this.ModelHeaderData[itemp].feature_code == featurecode && this.ModelHeaderData[itemp].unique_key == unique_key) {
        tempfeatureidmodelheader = this.ModelHeaderData[itemp].OPTM_FEATUREID
        tempchildfeatuniqueKey = this.ModelHeaderData[itemp].unique_key
        this.ModelHeaderData.splice(itemp, 1);
        itemp = itemp - 1

        for (var itemp2 = 0; itemp2 < this.FeatureBOMDataForSecondLevel.length; itemp2++) {
          if (this.FeatureBOMDataForSecondLevel[itemp2].nodeid == tempchildfeatuniqueKey) {
            if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "1") {
              tempchildfeatureidmodelheader = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID;
              tempchildfeaturecodemodelheader = this.FeatureBOMDataForSecondLevel[itemp2].feature_code;
              tempchildfeaturecode_nodeid = this.FeatureBOMDataForSecondLevel[itemp2].nodeid;
              tempchildfeaturecode_unique_key = this.FeatureBOMDataForSecondLevel[itemp2].unique_key;
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              this.removefeaturesbyuncheck(tempchildfeatureidmodelheader, tempchildfeaturecodemodelheader, tempchildfeaturecode_nodeid, tempchildfeaturecode_unique_key);
            }
            else if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "2") {
              tempfeatureidforfeaturebom = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID
              tempNodeId = this.FeatureBOMDataForSecondLevel[itemp2].nodeid
              itemkey = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_ITEMKEY
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              for (var itemp3 = 0; itemp3 < this.feature_itm_list_table.length; itemp3++) {
                if (this.feature_itm_list_table[itemp3].nodeid == tempNodeId && this.feature_itm_list_table[itemp3].Item == itemkey) {
                  this.feature_itm_list_table.splice(itemp3, 1)
                  itemp3 = itemp3 - 1
                }
              }
            }
            else {
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
            }
          }
        }


      }

    }


  }

  removeModelfeaturesbyuncheck(featureid, featurecode, nodeid, unique_key) {
    var tempfeatureidmodelheader;
    var tempparentfeatureidmodelheader;
    var tempchildfeatureidmodelheader;
    var tempchildfeaturecodemodelheader;
    var itemkey;
    var tempfeatureidforfeaturebom;
    let tempchildfeatuniqueKey;
    let tempNodeId;
    let temp_unique_key;
    for (var itemp = 0; itemp < this.ModelHeaderData.length; itemp++) {
      if (this.ModelHeaderData[itemp].feature_code == featurecode && this.ModelHeaderData[itemp].unique_key == unique_key) {
        tempfeatureidmodelheader = this.ModelHeaderData[itemp].OPTM_FEATUREID
        tempchildfeatuniqueKey = this.ModelHeaderData[itemp].unique_key
        this.ModelHeaderData.splice(itemp, 1);
        itemp = itemp - 1

        for (var itemp2 = 0; itemp2 < this.FeatureBOMDataForSecondLevel.length; itemp2++) {
          if (this.FeatureBOMDataForSecondLevel[itemp2].nodeid == tempchildfeatuniqueKey) {
            if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "1") {
              tempchildfeatureidmodelheader = this.FeatureBOMDataForSecondLevel[itemp2].parentmodelid
              tempchildfeaturecodemodelheader = this.FeatureBOMDataForSecondLevel[itemp2].feature_code
              tempNodeId = this.FeatureBOMDataForSecondLevel[itemp2].nodeid
              temp_unique_key = this.FeatureBOMDataForSecondLevel[itemp2].unique_key
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              this.removeModelfeaturesbyuncheck(tempchildfeatureidmodelheader, tempchildfeaturecodemodelheader, tempNodeId, temp_unique_key)
            }
            else if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "2") {
              tempNodeId = this.FeatureBOMDataForSecondLevel[itemp2].nodeid
              itemkey = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_ITEMKEY
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              for (var itemp3 = 0; itemp3 < this.feature_itm_list_table.length; itemp3++) {
                if (this.feature_itm_list_table[itemp3].nodeid == tempNodeId && this.feature_itm_list_table[itemp3].Item == itemkey) {
                  this.feature_itm_list_table.splice(itemp3, 1)
                  itemp3 = itemp3 - 1
                }
              }
            }
            else {
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
            }
          }
        }

        for (let index = 0; index < this.ModelBOMDataForSecondLevel.length; index++) {
          if (this.ModelBOMDataForSecondLevel[index].nodeid == tempchildfeatuniqueKey) {
            let tempParentModelId;
            let tempFeatureCode;
            let tempNodeId;
            let tempUniqueKey;

            tempParentModelId = this.ModelBOMDataForSecondLevel[index].parentmodelid
            tempFeatureCode = this.ModelBOMDataForSecondLevel[index].feature_code
            tempNodeId = this.ModelBOMDataForSecondLevel[index].nodeid
            tempUniqueKey = this.ModelBOMDataForSecondLevel[index].unique_key
            this.ModelBOMDataForSecondLevel.splice(index, 1)
            index = index - 1
            for (let featureListIndex = 0; featureListIndex < this.feature_itm_list_table.length; featureListIndex++) {
              let tempIdForFeatureList = "";
              if (this.feature_itm_list_table[featureListIndex].OPTM_TYPE == 3) {
                tempIdForFeatureList = this.feature_itm_list_table[featureListIndex].unique_key;
              } else {
                tempIdForFeatureList = this.feature_itm_list_table[featureListIndex].nodeid;
              }
              if (tempIdForFeatureList == tempchildfeatuniqueKey) {
                this.feature_itm_list_table.splice(featureListIndex, 1);
                featureListIndex = featureListIndex - 1;
              }
            }
            this.removeModelfeaturesbyuncheck(tempParentModelId, tempFeatureCode, tempNodeId, tempUniqueKey)
          }
        }

      }
    }

  }




  //This method will get Customer's all info.

  getCustomerAllInfo(callback) {

    //first we will clear the details
    this.cleanCustomerAllInfo();
    this.showLookupLoader = true;
    this.OutputService.getCustomerAllInfo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null && data != undefined) {
          this.console.log("ALL CUSTOMER INFO-->", data)

          if (data.length > 0) {
            if (data != undefined && data != undefined) {
              if (data[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.showLookupLoader = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              }
            }
          }
          //Fill Contact Person
          if (data.ContactPerson != undefined) {
            if (data.ContactPerson.length > 0) {
              this.contact_persons = data.ContactPerson;
              this.person = data.ContactPerson[0].Name;
              this.step1_data.person_name = this.person;
            }
            else {
              this.contact_persons = [];
              this.person = "";
              this.step1_data.person_name = "";
            }

            if (data.DefaultSalesPerson.length > 0) {

              //remove -No Sales Employee-
              this.sales_employee = (data.DefaultSalesPerson).filter(function (row) {
                return row.SlpCode != "-1";
              });

              //sort it 
              this.sales_employee = (this.sales_employee).sort(function (a, b) {
                return a.SlpName.localeCompare(b.name);
              });

              //now push -No Sales Employee- to first position
              this.sales_employee.unshift({ SlpName: "-No Sales Employee-", SlpCode: "-1" });

              //Set Default Sales Person
              this.salesemployee = data.DefaultSalesPerson[0].SlpName;
              var obj = this;
              this.sales_employee = this.sales_employee.filter(function (row) {
                (obj.salesemployee == row.SlpName) ? row.selected = true : row.selected = false;
                return row;
              });
              this.step1_data.sales_employee = this.salesemployee;
              this.showLookupLoader = false;
            }
            else {
              this.sales_employee = [];
              this.salesemployee = "";
              this.showLookupLoader = false;
              this.step1_data.sales_employee = "";
            }
          }
          else {
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
            this.showLookupLoader = false;
            return;
          }


          //Fill bill to
          if (data.BillToDef.length > 0) {
            this.bill_to = data.BillToDef;
            this.customerBillTo = data.BillToDef[0].BillToDef;
            this.step1_data.bill_to = data.BillToDef[0].BillToDef;
            this.bill_data = [];

            this.bill_data.push({
              CompanyDBId: this.common_output_data.companyName,
              Customer: this.step1_data.customer,
              BillTo: this.customerBillTo,
              currentDate: this.submit_date,
              GUID: sessionStorage.getItem("GUID"),
              UsernameForLic: sessionStorage.getItem("loggedInUser")
            });
            //To get bill address
            this.fillBillAddress(this.bill_data, data, function () {
              if (callback != "" && callback != undefined) {
                callback();
              }
            });
          }
          else {
            this.bill_to = [];
            this.step1_data.bill_to_address = '';
          }
        } else {
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        }
        this.showLookupLoader = false;
      },
      error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return;
      })

  }

  fillBillAddress(bill_data, orig_data, callback) {
    this.OutputService.fillBillAddress(bill_data).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != null && data != undefined) {
          if (data.BillingAdress != undefined) {
            this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
          }
        }
        else {
          this.step1_data.bill_to_address = '';
        }

        this.fillShipDetails(orig_data);
        if (callback != undefined && callback != "") {
          callback()
        }

      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
      })
  }

  fillShipAddress(ship_data, orig_data) {
    this.OutputService.fillShipAddress(ship_data).subscribe(
      data => {
        this.showLookupLoader = false;

        if (data != null && data != undefined) {
          if (data.length > 0) {

            if (data != undefined && data != undefined) {
              if (data[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.showLookupLoader = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              }
            }
          }
          if (data.ShippingAdress != undefined) {
            this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
          }

          this.fillAllOwners(orig_data);
        }
        else {
          this.step1_data.ship_to_address = '';
          this.showLookupLoader = false;
        }
      }, error => {
        this.showLookupLoader = false;
      })
  }

  fillShipDetails(data) {
    //Fill Ship Detail
    //if default is set else
    let ShipDetails: any;
    if (data.DefaultShipDetail != undefined) {
      ShipDetails = data.DefaultShipDetail;
    }
    else {
      ShipDetails = data.ShipDetail;
    }

    if (ShipDetails.length > 0) {
      this.ship_to = ShipDetails;
      this.customerShipTo = ShipDetails[0].ShipToDef;
      this.step1_data.ship_to = ShipDetails[0].ShipToDef;
      this.ship_data = [];


      this.ship_data.push({
        CompanyDBId: this.common_output_data.companyName,
        Customer: this.step1_data.customer,
        ShipTo: this.customerShipTo,
        currentDate: this.step1_data.posting_date,
        BillTo: this.customerBillTo,
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser")
      });

      this.fillShipAddress(this.ship_data, data);
    }
    else {
      this.ship_to = [];
      this.step1_data.ship_to_address = '';
      this.showLookupLoader = false;
    }
  }

  //fill all owners
  fillAllOwners(data) {
    if (data.AllOwners.length > 0) {
      this.showLookupLoader = false;
      this.owner_list = data.AllOwners;
      this.step1_data.owner = data.AllOwners[0].lastName;
    }
    else {
      this.owner_list = [];
      this.showLookupLoader = false;
      this.step1_data.owner = "";
    }
  }

  //Clean all Customer Info
  cleanCustomerAllInfo() {
    //clear all owners info
    this.owner_list.length = 0;
    this.owner_list = [];

    this.step1_data.owner = "";

    //clear all bill to detial
    this.bill_to.length = 0;
    this.bill_to = [];

    this.step1_data.bill_to_address = "";
    //clear contact person detail
    this.contact_persons.length = 0;
    this.contact_persons = [];

    this.person = "";
    this.step1_data.person_name = "";

    //clear sales employee detail
    this.sales_employee.length = 0;
    this.sales_employee = [];

    this.salesemployee = "";
    this.step1_data.sales_employee = "";

    //clear ship to detail
    this.ship_to.length = 0;
    this.ship_to = [];

    this.step1_data.ship_to_address = '';
  }


  getFeatureHasAccesory(selected_feature_in_model) {
    return selected_feature_in_model.filter(obj => obj.is_accessory == 'Y');
  }

  on_onwer_change(owner_value) {
    this.step1_data.owner = owner_value;
  }

  /* setDefaultByRule(RuleOutputData, nodeid = "") {
    let is_rule_applied = false 
   if(nodeid != ""){
     let current_parent_index = this.ModelHeaderData.findIndex(function(obj){
       return  obj.unique_key == nodeid
     });
     if(this.ModelHeaderData[current_parent_index].is_rule_default_applied == 1){
       is_rule_applied = true;
     }
   }
 
   if(!is_rule_applied){
   var isDefault  = false;
     if(RuleOutputData.length > 0){
         if(this.FeatureBOMDataForSecondLevel.length > 0) {
         for(var featureIndex in this.FeatureBOMDataForSecondLevel) {
             loopRule:
             for(var ruleIndex in RuleOutputData) {
               if(this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_TYPE == 1) {
                   if(this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_FEATUREID.toString() == RuleOutputData[ruleIndex].OPTM_APPLICABLEFOR && RuleOutputData[ruleIndex].OPTM_DEFAULT == "True") {
                       this.FeatureBOMDataForSecondLevel[featureIndex].checked = true
                   // this.rule_default_set_on_modelheader(this.FeatureBOMDataForSecondLevel[featureIndex].checked, this.FeatureBOMDataForSecondLevel[featureIndex].nodeid, 0);
                       isDefault = true
                       if (this.isSecondIteration == false)
                       {
                         this.ruleData.push(this.FeatureBOMDataForSecondLevel[featureIndex])
                       }
                       
                       break loopRule;
                   } else if(this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_FEATUREID.toString() == RuleOutputData[ruleIndex].OPTM_APPLICABLEFOR) {
                       this.FeatureBOMDataForSecondLevel[featureIndex].checked = false;
                     //  // this.rule_default_set_on_modelheader(this.FeatureBOMDataForSecondLevel[featureIndex].checked, this.FeatureBOMDataForSecondLevel[featureIndex].nodeid, 0);
                       break loopRule;
                   }
               } else if(this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_TYPE == 2) {
                 
                   if(this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_FEATUREID.toString() == RuleOutputData[ruleIndex].OPTM_APPLICABLEFOR && this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_ITEMKEY == RuleOutputData[ruleIndex].OPTM_ITEMKEY && RuleOutputData[ruleIndex].OPTM_DEFAULT == "True" ) {
                     this.FeatureBOMDataForSecondLevel[featureIndex].checked = true;
                   // this.rule_default_set_on_modelheader(this.FeatureBOMDataForSecondLevel[featureIndex].checked, this.FeatureBOMDataForSecondLevel[featureIndex].nodeid, 0);
                     let defaultItemArray = [];
                     defaultItemArray.push(this.FeatureBOMDataForSecondLevel[featureIndex])
                     if(defaultItemArray.length > 0) {
                       this.getDefaultItems(defaultItemArray);
                     } 
                     break loopRule;
                   } else if(this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_FEATUREID.toString() == RuleOutputData[ruleIndex].OPTM_APPLICABLEFOR && this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_ITEMKEY == RuleOutputData[ruleIndex].OPTM_ITEMKEY ){
                     this.FeatureBOMDataForSecondLevel[featureIndex].checked = false;
                   // // this.rule_default_set_on_modelheader(this.FeatureBOMDataForSecondLevel[featureIndex].checked, this.FeatureBOMDataForSecondLevel[featureIndex].nodeid, 0);
                     break loopRule;
                 }
                 
               } else {
                   if(this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_FEATUREID.toString() == RuleOutputData[ruleIndex].OPTM_APPLICABLEFOR && this.FeatureBOMDataForSecondLevel[featureIndex].OPTM_VALUE == RuleOutputData[ruleIndex].OPTM_VALUE && RuleOutputData[ruleIndex].OPTM_DEFAULT == "True") {
                       this.FeatureBOMDataForSecondLevel[featureIndex].checked = true;
                       // this.rule_default_set_on_modelheader(this.FeatureBOMDataForSecondLevel[featureIndex].checked, this.FeatureBOMDataForSecondLevel[featureIndex].nodeid, 0);
                   } 
             } 
 
             }
           }
         }
 
         if(this.ModelBOMDataForSecondLevel.length > 0) {
           for(let modelIndex in this.ModelBOMDataForSecondLevel) {
             for(var modelRuleIndex in RuleOutputData) {
 
               if(this.ModelBOMDataForSecondLevel[modelIndex].OPTM_TYPE == 1) {
                   if(this.ModelBOMDataForSecondLevel[modelIndex].OPTM_FEATUREID == RuleOutputData[modelRuleIndex].OPTM_APPLICABLEFOR && RuleOutputData[modelRuleIndex].OPTM_DEFAULT == "True") {
                       this.ModelBOMDataForSecondLevel[modelIndex].checked = true
                       // this.rule_default_set_on_modelheader(this.ModelBOMDataForSecondLevel[modelIndex].checked, this.ModelBOMDataForSecondLevel[modelIndex].nodeid);
                       isDefault = true
                       if (this.isSecondIteration == false)
                       {
                         this.ruleData.push(this.ModelBOMDataForSecondLevel[modelIndex])
                       }
                   }
                   else if(this.ModelBOMDataForSecondLevel[modelIndex].OPTM_FEATUREID.toString() == RuleOutputData[ruleIndex].OPTM_APPLICABLEFOR) {
                     this.ModelBOMDataForSecondLevel[modelIndex].checked = false;
                   //   this.rule_default_set_on_modelheader(this.ModelBOMDataForSecondLevel[modelIndex].checked, this.ModelBOMDataForSecondLevel[modelIndex].nodeid);
                 }
               } else if(this.ModelBOMDataForSecondLevel[modelIndex].OPTM_TYPE == 3) {
 
                 if(this.ModelBOMDataForSecondLevel[modelIndex].OPTM_CHILDMODELID == RuleOutputData[modelRuleIndex].OPTM_APPLICABLEFOR && RuleOutputData[modelRuleIndex].OPTM_DEFAULT == "True") {
                     this.ModelBOMDataForSecondLevel[modelIndex].checked = true;
                     // this.rule_default_set_on_modelheader(this.ModelBOMDataForSecondLevel[modelIndex].checked, this.ModelBOMDataForSecondLevel[modelIndex].nodeid);
                     isDefault = true
                     if (this.isSecondIteration == false)
                       {
                         this.ruleData.push(this.ModelBOMDataForSecondLevel[modelIndex])
                       }
                 }
 
               }
 
             }
           }
         }
         this.isSecondIteration =  true;
     }
   }
 } */


  rule_default_set_on_modelheader(rule_checked_status, element_node_id, reset_rule_default_applied) {
    if (this.ModelHeaderData.length > 0) {
      if (element_node_id != "") {
        let elm_index = this.ModelHeaderData.findIndex(function (cobj) {
          return cobj.unique_key == element_node_id
        });
        if (elm_index !== -1) {
          if (rule_checked_status == true) {
            this.ModelHeaderData[elm_index].is_rule_default_applied = 1;
          } else {
            this.ModelHeaderData[elm_index].is_rule_default_applied = 0;
          }
        }
      }

      if (reset_rule_default_applied != "" && reset_rule_default_applied == 1) {
        this.ModelHeaderData = this.ModelHeaderData.filter(function (obj) {
          obj['is_rule_default_applied'] = 0;
          return obj;
        })
      }
    }

  }

}