import { Component, OnInit, setTestabilityGetter, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import * as XLSX from 'ts-xlsx';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { ModelbomService } from '../../../services/modelbom.service';
import { RoutingService } from '../../../services/routing.service';
import { OutputService } from '../../../services/output.service';
import { CommonData, ColumnSetting } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'bootstrap';
import { UIHelper } from '../../../helpers/ui.helpers';
// import { Http, ResponseContentType } from '@angular/http';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
  @ViewChild("lookupsearch") _el: ElementRef;
  // input and output emitters
  @Input() serviceData: any;
  @Input() lookupfor: any;
  @Input() fillLookupArray: any;
  @Input() selectedImage: any
  @Output() lookupvalue = new EventEmitter();
  @Input() ruleselected: any;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  private skip: number = 0;
  // @ViewChild(searchlookupfield, { read: ElementRef }) lookup_search: ElementRef;

  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  popup_title = '';
  constructor(private common_service: CommonService, private fms: FeaturemodelService, private toastr: ToastrService, private router: Router, private mbom: ModelbomService, private rs: RoutingService, private OutputService: OutputService) { }
  public table_head_hidden_elements = [];
  public defaultCurrency = sessionStorage.defaultCurrency;

  // mandatory variables
  public dataBind: any = [];
  public columns: any = [];
  public checked_rules = [];
  public showLoader: boolean = false;
  public showruleOutputLoader: boolean = false;
  public LookupDataLoaded: boolean = false;
  public RuleOutputLookupDataLoaded: boolean = false;
  public click_operation;
  public service_Data;
  // look up columns - thats needs to be shown 
  public fill_input_id = '';
  public item_code_columns;
  public model_template_item_columns;
  public table_head: ColumnSetting[] = [];
  public rule_output_table_head = [];
  public rule_output_table_head_hidden_elements = [];
  public lookup_key = "";
  public width_value = '100%';
  public selectedFile: any = "";
  public xls_dataset;
  public outputServiceData: any = [];
  companyName: string;
  // intital Javascript object class 
  Object = Object;
  public preview_image = "";
  public isRuleChecked = false;
  username: string;
  public fileType = "";
  // public template_path = "";
  public print_item_list_array: any = [];
  public is_operation_popup_lookup_open: boolean = false
  //Print Data variables
  public report_type;
  public showCustDetailsSec: boolean = false;
  public showPaymentDetails: boolean = false;
  public showGeneralDetails: boolean = false;
  public showProdDetailsTable: boolean = false;
  public showProdGrandDetails: boolean = false;
  public reportDialogOpened: boolean = false;
  
  public isDraggable: boolean = true;
  public customer_details: any = [];
  public refrence_doc_details: any = [];
  public verify_final_data_sel_details: any = [];
  public product_grand_details: any = [];
  public resourceServiceData: any = [];
  public resource_basisdd: any[];
  public resourceServiceOper: any = "";
  public resourceServiceOperCM: any = "";
  public resourceServiceWc: any = "";
  public current_popup_row: any = "";
  public downLoadfileName = "";
  public template_type = "";
  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;
  public search_string = "";
  public logo_path = this.commonData.get_current_url() + "/assets/images/logo_configurator/icon/128_icon.png";
  public company_name: any = "N/A";
  public company_address: any = "N/A";
  public dialogOpened = false;
  public load_print_report: boolean = false;
  public popup_lookupfor = "";
  public resource_counter = 0;
  public showLookupLoader: boolean = false;
  public popup_resource: boolean = false;
  public resource_popup_title = '';
  public about_info = [];
  public allowUnsort = true;
  public sort: SortDescriptor[];
  public gridView: GridDataResult;
  public config_data:any;
  public show_pdf:any;
  public reportBase64String:any;

  public close_kendo_dialog() {
    this.dialogOpened = false;
    
    this.reportDialogOpened = false;
    this.lookupvalue.emit('');
    this.current_popup_row = "";
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    $('body').click()
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

  ngOnInit() {
    this.detectDevice();
    this.username = sessionStorage.getItem('loggedInUser');
    this.companyName = sessionStorage.getItem('selectedComp');
    this.config_data = JSON.parse(sessionStorage.getItem('system_config'));
    this.template_type = "model";
    this.skip = 0;
    // this.template_path = this.commonData.application_path + "/assets/data/json/ModelMaster.xlsx";
    this.dialogOpened = false;
    this.downLoadfileName =  'Quotation.pdf';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ngOnChanges(): Promise<void> {
    this.popup_lookupfor = this.lookupfor;
    this.showLoader = true;
    this.LookupDataLoaded = false;
    this.showruleOutputLoader = true;
    this.RuleOutputLookupDataLoaded = false;
    this.lookup_key = '';
    this.item_code_columns = [];
    this.model_template_item_columns = [];
    this.fill_input_id = '';
    this.preview_image = '';
    this.dataBind = [];
    this.outputServiceData = [];
    this.skip = 0;
    this.resource_counter = 0;
    this.dialogOpened = false;
    this.about_info = [];
    this.reportDialogOpened = false;

    this.current_popup_row = "";
    //this.test_model();
    //    console.log("this.lookupfor " + this.popup_lookupfor);
    this.search_string = "";
    if (this.popup_lookupfor == "output_invoice_print") {
      await this.sleep(400);
    }

    if (this.popup_lookupfor != "") {
      if (this.popup_lookupfor == "model_template") {
        this.model_template_lookup();
        return;
      }
      if (this.popup_lookupfor == "model_item_generation") {
        this.model_item_generation_lookup();
        return;
      }

      if (this.popup_lookupfor == "feature_lookup") {
        this.get_features_lookup();
        return;
      }

      if (this.popup_lookupfor == "feature_Detail_lookup") {
        this.get_features_lookup();
        return;
      }

      if (this.popup_lookupfor == "Item_Detail_lookup") {
        this.get_Item_lookup();
        return;
      }

      // open poup for import 
      if (this.popup_lookupfor == "import_popup") {
        this.import_popup();
        return;
      }

      if (this.popup_lookupfor == "ModelBom_lookup" || this.popup_lookupfor == "ModelBom_Detail_lookup") {
        this.get_Model_lookup();
        return;
      }

      if (this.popup_lookupfor == "large_image_view") {
        this.showImage();
        return;
      }
      if (this.popup_lookupfor == "Price_lookup") {
        this.get_Price_lookup();
        return;
      }
      if (this.popup_lookupfor == "rule_section_lookup") {
        this.ruleSelection();
        return;
      }

      if (this.popup_lookupfor == "tree_view__model_bom_lookup") {
        this.showModelBOMTreeView();
        return;
      }

      if (this.popup_lookupfor == "associated_BOM") {
        this.showAssociatedBOMs();
        return;
      }
      if (this.popup_lookupfor == "feature_Detail_Output_lookup") {
        this.get_features_Output_lookup();
        return;
      }

      if (this.popup_lookupfor == "output_customer") {
        this.customer_lookup();
        return;
      }

      if (this.popup_lookupfor == "operand_feature_lookup") {
        this.get_operand_lookup();
        return;
      }

      if (this.popup_lookupfor == "operand_model_lookup") {
        this.get_Model_lookup();
        return;
      }

      if (this.popup_lookupfor == "configure_list_lookup") {
        this.configure_list_lookup();
        return;
      }
      if (this.popup_lookupfor == "ModelBomForWizard_lookup") {
        this.get_ModelWizard_lookup();
        return;
      }

      if (this.popup_lookupfor == "output_invoice_print") {
        this.output_invoice_print();
        return;
      }

      if (this.popup_lookupfor == "output_invoice_print_new") {
        this.output_invoice_print_new();
        return;
      }

      if (this.popup_lookupfor == 'routing_resource_lookup') {
        /*   this.resourceServiceData = [];
          this.resourceServiceOper = "";
          this.resourceServiceWc = ""; */
          this.is_operation_popup_lookup_open = true;
          this.routing_resource_lookup();
          return;
        }

        if (this.popup_lookupfor == "warehouse_lookup") {
          this.warehouse_lookup_list();
        }

        if (this.popup_lookupfor == 'operation_lookup') {
          this.operation_lookup_list();
        }

        if (this.popup_lookupfor == 'workcenter_lookup') {
          this.workcenter_lookup_list();
        }

        if (this.popup_lookupfor == "template_routing_lookup") {
          this.template_routing_list();
        }

        if(this.popup_lookupfor == "help_popup"){

          this.show_help_popup();
        }

      }
    }

    public sortChange(sort: SortDescriptor[]): void {
      this.sort = sort;
      this.loadServerData(this.serviceData);
    }

    private loadServerData(dataset): void {
      if(this.sort !== undefined && this.sort !== null){
        this.gridView = {
          data: orderBy(dataset, this.sort),
          total: this.serviceData.length
        };
      } else {
        this.gridView = {
          data: dataset,
          total: this.serviceData.length
        }; 
      }
    }

    template_routing_list() {
      this.popup_title = this.language.template_routing;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'template_routing';
      this.table_head = [this.language.code, this.language.Name];

      this.table_head = [
      {
        field: 'ITEMCODE',
        title: this.language.item_code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'ItemName',
        title: this.language.description,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      ];

      this.table_head_hidden_elements = [false, false];
      this.lookup_key = 'Name';
      this.width_value = ((100 / this.table_head.length) + '%');
      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }

    }

    workcenter_lookup_list() {
      this.popup_title = this.language.workcenter;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'workcenterCode';
      this.table_head = [this.language.code, this.language.Name];

      this.table_head = [
      {
        field: 'WCCode',
        title: this.language.workcenter,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'Description',
        title: this.language.description,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      ];

      this.table_head_hidden_elements = [false, false];
      this.lookup_key = 'Name';
      this.width_value = ((100 / this.table_head.length) + '%');
      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }

    }

    operation_lookup_list() {
      this.popup_title = this.language.operation;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'OperationCode';
      this.table_head = [this.language.code, this.language.Name];

      this.table_head = [
      {
        field: 'OPRCode',
        title: this.language.operation_no,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OperationCode',
        title: this.language.operation_code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPRDesc',
        title: this.language.description,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'operTypeStr',
        title: this.language.operation_type,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'WCCode',
        title: this.language.workcenter_code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'Description',
        title: this.language.workcenter_desc,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      ];

      this.table_head_hidden_elements = [false, false];
      this.lookup_key = 'Name';
      this.width_value = ((100 / this.table_head.length) + '%');
      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }
    }

    warehouse_lookup_list() {

      this.popup_title = this.language.warehouse;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'warehouseCode';
      this.table_head = [this.language.code, this.language.Name];
      this.table_head = [
      {
        field: 'WHSECODE',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'Description',
        title: this.language.description,
        type: 'text',
        width: '100',
        attrType: 'text'
      },

      ];
      this.table_head_hidden_elements = [false, false];
      this.lookup_key = 'Name';
      this.width_value = ((100 / this.table_head.length) + '%');
      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }
    }

    operation_resource_update() {
      this.is_operation_popup_lookup_open == false;
      if (this.resourceServiceData.length == 0) {
        this.toastr.error('', this.language.cannot_submit_empty_resource, this.commonData.toast_config);
        return;
      } else {
        for (let ia = 0; ia < this.resourceServiceData.length; ia++) {
          let res_row = this.resourceServiceData[ia];
          if (res_row.resource_code == "") {
            this.toastr.error('', this.language.resource_code_cannot_beblack + ' ' + (ia + 1), this.commonData.toast_config);
            return
          }
        }
      }
      this.lookupvalue.emit(this.resourceServiceData);
      $("#routing_resource_modal").modal('hide');
    }

    log(val) {
      console.log(val);
    }


    on_item_select(selection) {
      var lookup_key = selection.selectedRows[0].dataItem;
      //  console.log("this.popup_lookupfor ", this.popup_lookupfor);

      // console.log("lookup_key - ", lookup_key);
      // if (this.popup_lookupfor == "routing_resource_lookup") {
        if (this.is_operation_popup_lookup_open == true) {
          //    console.log("this.current_popup_row - ", this.current_popup_row);

          if (lookup_key.ResCode != undefined && lookup_key.Name != undefined) {
            for (let i = 0; i < this.resourceServiceData.length; ++i) {
              if (this.resourceServiceData[i].rowindex === this.current_popup_row) {
                this.resourceServiceData[i].resource_code = lookup_key.ResCode;
                this.resourceServiceData[i].resource_name = lookup_key.Name;
                this.resourceServiceData[i].resource_uom = lookup_key.UnitOfMsr;
                this.resourceServiceData[i].resource_uom = lookup_key.UnitOfMsr;
                this.resourceServiceData[i].DCNum = lookup_key.DCNum;

                this.get_consumption_inverse_value('consumption', 1, this.resourceServiceData[i].resource_code, i);


              }
            }
          }
        }

        //   console.log(lookup_key);
        if (this.popup_resource == false) {
          this.lookupvalue.emit(Object.values(lookup_key));
        }

        if (this.popup_resource == true) {
          this.popup_resource = false;
        }
        this.serviceData = [];
        //   $("#lookup_modal").modal('hide');
        //   console.log(selection);
        selection.selectedRows = [];
        selection.index = 0;
        selection.selected = false;

        this.skip = 0;
        this.dialogOpened = false;
        if (this.is_operation_popup_lookup_open == false) {
          this.current_popup_row = "";
        }
        setTimeout(() => {
          this.popup_lookupfor = "";
        }, 10);
      }

      configure_list_lookup() {
        this.popup_title = this.language.list_configuration;
        this.LookupDataLoaded = false;
        this.showLoader = true;
        this.fill_input_id = 'modify_duplicate_lookup';
        // this.table_head = [this.language.log_id, this.language.description, this.language.customer, this.language.contact_person, this.language.model, this.language.quantity];
        //  console.log(this.serviceData);

        this.table_head = [
        {
          field: 'OPTM_LOGID',
          title: this.language.configuration_id,
          type: 'numeric',
          width: '100',
          attrType: 'text'
        },
        {
          field: 'OPTM_DESC',
          title: this.language.description,
          type: 'text',
          width: '100',
          attrType: 'text'
        },
        {
          field: 'OPTM_BPCODE',
          title: this.language.customer,
          type: 'text',
          width: '100',
          attrType: 'text'
        },
        {
          field: 'OPTM_CONTACTPERSON',
          title: this.language.contact_person,
          type: 'text',
          width: '100',
          attrType: 'text'
        }
      /* ,
      {
        field: 'OPTM_FGITEM',
        title: this.language.model,
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_QUANTITY',
        title: this.language.quantity,
        type: 'text',
        width: '100'
      }, */
      ];

      //this.table_head_hidden_elements = [false, false];
      this.lookup_key = 'OPTM_DESC';

      this.width_value = ((100 / this.table_head.length) + '%');


      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }
    }

    model_template_lookup() {
      this.popup_title = this.language.model_template;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'featureItemName';
      this.table_head = [this.language.code, this.language.Name];

      this.table_head = [
      {
        field: 'Code',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'Name',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },

      ];


      this.table_head_hidden_elements = [false, false];
      this.lookup_key = 'Name';

      this.width_value = ((100 / this.table_head.length) + '%');


      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }

    }

    model_item_generation_lookup() {
      this.popup_title = this.language.Model_Ref;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'featureItemCode';
      // this.table_head = [this.language.code];

      this.table_head = [
      {
        field: 'OPTM_CODE',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },

      ];

      this.table_head_hidden_elements = [false];
      this.lookup_key = 'OPTM_CODE';
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }
    }

    get_operand_lookup() {


      this.popup_title = this.language.Bom_FeatureId;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'featureNameId';
      this.lookup_key = 'OPTM_FEATUREID';
      // this.table_head = [this.language.Id, this.language.code, this.language.Name];

      this.table_head = [
      {
        field: 'feature_code',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_DISPLAYNAME',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },

      ];

      this.table_head_hidden_elements = [true, false, false];
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }

    }

    get_features_lookup() {


      this.popup_title = this.language.Bom_FeatureId;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'featureNameId';
      this.lookup_key = 'OPTM_FEATUREID';
      // this.table_head = [this.language.Id, this.language.code, this.language.Name];

      this.table_head = [
      {
        field: 'OPTM_FEATURECODE',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_DISPLAYNAME',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      }
      ];

      if(this.lookupfor == "feature_lookup") {
        this.table_head.push({
          field: 'OPTM_ACCESSORY',
          title: this.language.Model_Accessory,
          type: 'text',
          width: '100',
          attrType: 'text'
        });
      }

      if (this.serviceData !== undefined ) {
        if(this.serviceData[0]!= undefined && this.serviceData[0].Accessory !== undefined){
          var objj = this;
          var language = this.language;
          this.serviceData = this.serviceData.filter(function(obj){
            if(obj.Accessory == 'N'){
              obj.Accessory = language.NO;
            } else if(obj.Accessory == 'Y'){
              obj.Accessory = language.YES;
            }
            return obj;
          });
          if(this.lookupfor == "feature_Detail_lookup") {
            this.table_head.push({
              field: 'Accessory',
              title: this.language.Model_Accessory,
              type: 'text',
              width: '100',
              attrType: 'text'
            });
          }
          
        }
      }

      this.table_head_hidden_elements = [true, false, false];
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }

    }

    close_lookup(lookup_id) {
      console.log("lookup id - " + lookup_id);
      $("#" + lookup_id).modal('hide');

      //clear arrays after close button clicked on print model 
      if (this.popup_lookupfor == 'output_invoice_print') {
        this.cleanup_print_arrays();

        // popup_lookupfor  = "";
        setTimeout(() => {
          this.popup_lookupfor = "";
        });
        this.current_popup_row = "";
      }

      if (lookup_id == "routing_resource_modal" || this.popup_lookupfor == 'routing_resource_lookup') {
        console.log('in array cleaner');
        this.is_operation_popup_lookup_open = false;
        this.resourceServiceOper = "";
        this.resourceServiceOperCM = "";
        this.resourceServiceWc = "";
        this.lookupvalue.emit('');
        this.resourceServiceData = [];
        $("#routing_resource_modal").modal('hide');
      }

    }

    get_Model_lookup() {


      this.popup_title = this.language.ModelBom;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'featureNameId';
      this.lookup_key = 'OPTM_FEATUREID';
      // this.table_head = [this.language.ModelId, this.language.code, this.language.Name];

      this.table_head = [
      {
        field: 'OPTM_FEATURECODE',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_DISPLAYNAME',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },

      ];


      this.table_head_hidden_elements = [true, false, false];
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }

    }

    get_ModelWizard_lookup() {


      this.popup_title = this.language.ModelBom;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'featureNameId';
      this.lookup_key = 'OPTM_FEATUREID';
      // this.table_head = [this.language.ModelId, this.language.code, this.language.Name, this.language.templateid, this.language.ItemCodeGenkey];

      console.log(this.serviceData);
      this.table_head = [

      {
        field: 'OPTM_FEATURECODE',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_DISPLAYNAME',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },

      ];

      this.table_head_hidden_elements = [true, false, false, true, true];
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          // $("#lookup_modal").modal('show');
        }
      }

    }

    get_Item_lookup() {


      this.popup_title = this.language.ItemLookupTitle;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'type_value';
      this.lookup_key = 'ItemKey';
      // this.table_head = [this.language.itemkey, this.language.Name];

      this.table_head = [
      {
        field: 'ItemKey',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'Description',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      ];

      this.table_head_hidden_elements = [false, false];
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      this.log('this.serviceData');
      this.log(this.serviceData);
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }

    }

    import_popup() {
      this.popup_title = this.language.import_features;
      this.showLoader = false;
      this.LookupDataLoaded = true;
      this.fileType = "excel";
      $("#import_modal").modal('show');

    }

    get_Price_lookup() {
      this.popup_title = this.language.price_source;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'price_source';
      this.lookup_key = 'PriceListID';
      // this.table_head = [this.language.price_source, this.language.price_list_name];

      console.log(this.serviceData);
      this.table_head = [
      {
        field: 'PriceListID',
        title: this.language.price_source,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'ListName',
        title: this.language.price_list_name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },

      ];
      this.table_head_hidden_elements = [false];
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }
    }

    get_features_Output_lookup() {


      this.popup_title = this.language.Bom_FeatureId;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.fill_input_id = 'featureNameId';
      this.lookup_key = 'OPTM_FEATUREID';
      // this.table_head = [this.language.Id, this.language.code, this.language.Name, this.language.Model_Accessory];

      this.table_head = [

      {
        field: 'OPTM_FEATURECODE',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_DISPLAYNAME',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },

      ];
      this.table_head_hidden_elements = [true, false, false, true];
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
          this.loadServerData(this.serviceData);
          // $("#lookup_modal").modal('show');
        }
      }

    }

    ruleSelection() {
      this.popup_title = this.language.rule_selection;
      this.LookupDataLoaded = false;
      this.showLoader = true;
      this.lookup_key = 'code';
      this.table_head = [this.language.select, this.language.rule, this.language.description];
      console.log(this.serviceData);

      this.table_head_hidden_elements = [false, false, false];
      this.width_value = ((100 / this.table_head.length) + '%');

      this.showLoader = false;
      this.LookupDataLoaded = true;
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.checked_rules = [];
          //console.log(this.serviceData);
          for (var i = 0; i < this.serviceData.length; i++) {
            if (this.serviceData[i].Selected == "Y") {
              this.serviceData[i].Selected = true;
              this.checked_rules.push(this.serviceData[i]);
            }
            else {
              this.serviceData[i].Selected = false;
            }

          }

          $("#rule_selection").modal('show');
        }
      }
    }

    get_rule_output(rule_id, seq_id) {
      console.log("  rule_id " + rule_id);
      console.log("  seq_id " + seq_id);
      this.showruleOutputLoader = true;
      this.RuleOutputLookupDataLoaded = false;
      this.rule_output_table_head = ['#', this.language.feature, this.language.description];
      this.rule_output_table_head_hidden_elements = [false, false, false];
      $("#rule_output_table_lookup").modal('show');
      // $("#rule_selection").css("opacity", "0");
      $(".modal-backdrop:first").addClass("z-index_1050");
      // this.outputServiceData = [
      //   { "id": "2", "key": "123", "value": "test 1" },
      //   { "id": "2", "key": "431", "value": "test 2" },
      //   { "id": "4", "key": "555", "value": "test 3" },
      // ];

      let obj = this;
      this.mbom.getRuleOutput(rule_id, seq_id).subscribe(
        data => {
          console.log(data);
          if (data !== '' && data !== undefined && data !== null) {
            obj.outputServiceData = data
            // this.close_lookup();
          } else {
            this.toastr.error('', this.language.incorrectfile, this.commonData.toast_config);
            // this.close_lookup();
          }

          //$(".modal-backdrop").hasClass("show").removeClass("show").addClass('hide');
        }, error => {
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.common_service.isUnauthorized();
          }
        })

      this.showruleOutputLoader = false;
      this.RuleOutputLookupDataLoaded = true;

    }
    close_rule_model(id) {
      $("#rule_output_table_lookup").modal('hide');
      $(".modal-backdrop:first").removeClass("z-index_1050");
      // $("#rule_selection").css("opacity", "1");
    }


    on_checkbox_checked(checkedvalue, row_data) {
      console.log("checkedvalue " + checkedvalue);
      console.log(row_data);

      if (checkedvalue == true) {
        row_data.Selected = true;
        this.checked_rules.push(row_data);
      }
      else {
        let i = this.checked_rules.indexOf(row_data);
        row_data.Selected = false;
        this.checked_rules.splice(i, 1)
      }
      console.log(this.checked_rules);

    }

    rule_select_ok() {
      this.lookupvalue.emit(this.checked_rules);
      $("#rule_selection").modal('hide');
    }

    file_input($event) {
      var obj = this;
      var proceed = true;
      this.selectedFile = $event.target.files[0];
      let file_name_array = this.selectedFile.name.split(".");
      var index = file_name_array.length - 1;
      var file_extension = file_name_array[index];
      if (this.fileType == "excel" && (file_extension == "xlsx" || file_extension == "xls")) {
        proceed = true;
      }
      else if (this.fileType == "csv" && file_extension == "csv") {
        proceed = true;
      }
      else {
        this.toastr.error('', this.language.incorrectfile, this.commonData.toast_config);
        this.selectedFile = "";
        this.reset();
        return;
      }
      var reader = new FileReader();
      var XLS_DATA = '';
      reader.onload = function (loadEvent) {
        // @ts-ignore: Unreachable code error
        var data = loadEvent.target.result;
        var workbook = XLSX.read(data, { type: 'binary' });
        workbook.SheetNames.forEach(function (sheetName) {
          // Here is your object
          // @ts-ignore: Unreachable code error
          XLS_DATA = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          obj.xls_dataset = XLS_DATA;
        })

      }
      reader.readAsBinaryString($event.target.files[0]);
    }

    importclick() {
      console.log(this.selectedFile);
      if (this.selectedFile == "" || this.selectedFile == null) {
        this.toastr.error('', this.language.nofileattach, this.commonData.toast_config);
        return;
      }

      var xls_data = this.xls_dataset;
      var objData: any = {}
      objData.ExcelData = [];
      objData.Common = [];
      objData.ExcelData = xls_data;
      objData.Common.push({
        CompanyDBId: this.companyName,
        CreatedUser: this.username
      });
      console.log('objData');
      console.log(objData);
      this.fms.importData(objData).subscribe(
        data => {
          console.log(data);
          if (data !== '' && data !== undefined && data !== null) {
            this.toastr.warning('', data, this.commonData.toast_config);
            // this.close_lookup();
          } else {
            this.toastr.error('', this.language.incorrectfile, this.commonData.toast_config);
            // this.close_lookup();
          }
          $("#import_modal").modal('hide');
          //$(".modal-backdrop").hasClass("show").removeClass("show").addClass('hide');
        })

    }

    showImage() {
      this.popup_title = this.language.feature_image;
      this.showLoader = true;
      this.LookupDataLoaded = false;
      this.preview_image = this.selectedImage;
      this.showLoader = false;
      this.LookupDataLoaded = true;
    }

    output_invoice_print_new(){

      this.popup_title = this.language.print_quote;
      this.reportBase64String= "data:application/pdf;base64,"+ this.serviceData; 
      console.log("this", this.reportBase64String);
      if(this.reportBase64String!=null && this.reportBase64String != "")  { 
        this.reportDialogOpened = true; 
      }
    }

    output_invoice_print() {
      this.company_name = "Optipro Product Configuration";
      this.company_address = "255 Street, Washington DC, USA ";
      this.popup_title = this.language.print_quote;
      this.load_print_report = true;
      console.log(" output_invoice_print - " + this.load_print_report);
      this.common_service.GetCompanyDetails(this.companyName).subscribe(
        data => {
          if (data != null || data != undefined) {
            if (data.length > 0) {
              if (data[0].LogoImage != "") {
                this.logo_path = "data:image/jpeg;base64," + data[0].LogoImage;
              }
              this.company_name = data[0].CompanyName;
              this.company_address = data[0].CompanyAddress;

            }
          }
        },
        error => {
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.common_service.isUnauthorized();
          } else {
            this.toastr.error('', this.language.FailedToReadCurrency, this.commonData.toast_config);
          }
        }
        )

      //Print Criteria
      //Summary --> Customer + COM + Qty + Acces.
      //Details --> BOM + Feat. + Item + Acces.

      if (this.serviceData.print_types != undefined) {
        this.report_type = this.serviceData.print_types[0].selected_print_type;
        //1 for summary and 2 for detail
      }

      //customer details
      if (this.serviceData.customer_and_doc_details != undefined) {
        this.showCustDetailsSec = true;
        this.showGeneralDetails = true;
        this.customer_details.order_type = (this.serviceData.customer_and_doc_details.document == "sales_quote") ? this.language.SalesQuote : ((this.serviceData.customer_and_doc_details.document == "sales_order") ? this.language.SalesOrder : this.language.draft);
        this.customer_details.customer_name = this.serviceData.customer_and_doc_details.customer_name;
        this.customer_details.person_name = this.serviceData.customer_and_doc_details.person_name;
        this.customer_details.ship_to = this.serviceData.customer_and_doc_details.ship_to;
        this.customer_details.ship_to_address = this.serviceData.customer_and_doc_details.ship_to_address;
        this.customer_details.bill_to = this.serviceData.customer_and_doc_details.bill_to;
        this.customer_details.bill_to_address = this.serviceData.customer_and_doc_details.bill_to_address;
        this.customer_details.contact_person = this.serviceData.customer_and_doc_details.remark;
        this.customer_details.remark = this.serviceData.customer_and_doc_details.remark;

        this.customer_details.posting_date = this.serviceData.customer_and_doc_details.posting_date;
        this.customer_details.delivery_until = this.serviceData.customer_and_doc_details.delivery_until;

        if (this.serviceData.customer_and_doc_details.document == "sales_quote") {
          this.customer_details.doc_type_date_label = this.language.valid_date;
        } else {
          this.customer_details.doc_type_date_label = this.language.delivery_date;
        }

      }
      else {
        this.showCustDetailsSec = false;
        this.showGeneralDetails = false;
      }
      //payment details
      if (this.serviceData.payment_details != undefined) {
        this.showPaymentDetails = true;
      }
      else {
        this.showPaymentDetails = false;
      }
      //ref doc details
      if (this.serviceData.ref_doc_details != undefined && this.serviceData.ref_doc_details.length > 0) {
        this.refrence_doc_details.ref_doc_no = this.serviceData.ref_doc_details[0].ref_doc_no;
        this.refrence_doc_details.ref_doc_entry = this.serviceData.ref_doc_details[0].ref_doc_entry;
        this.refrence_doc_details.conf_id = this.serviceData.ref_doc_details[0].conf_id;
        this.refrence_doc_details.conf_desc = this.serviceData.ref_doc_details[0].conf_desc;
      }
      //item details
      if (this.serviceData.verify_final_data_sel_details != undefined && this.serviceData.verify_final_data_sel_details.length) {
        this.showProdDetailsTable = true;
        this.verify_final_data_sel_details = this.serviceData.verify_final_data_sel_details;
      }
      else {
        this.showProdDetailsTable = false;
      }

      let row_count = 0;
      console.log("this.serviceData.verify_final_data_sel_details ", this.serviceData.verify_final_data_sel_details);
      if (this.serviceData.verify_final_data_sel_details != undefined && this.serviceData.verify_final_data_sel_details.length) {

        // data preparation for API  - start 
        let print_report_api_call: any = {};
        print_report_api_call.ConnectionDetails = [];
        print_report_api_call.apidata = [];
        print_report_api_call.ModelHeaderData = [];
        print_report_api_call.ModelBOMDataForSecondLevel = [];
        print_report_api_call.FeatureBOMDataForSecondLevel = [];
        print_report_api_call.ModelHeaderItemsArray = [];

        print_report_api_call.ConnectionDetails.push({
          CompanyDBID: this.companyName,
          Username: this.username,
        });

        print_report_api_call.apidata.push({
          GUID: sessionStorage.getItem("GUID"),
          UsernameForLic: this.username
        });

        // data preparation for API  - end 
        let model_header_data = []; let featurebomdata_sec_lev = []; let modelbom_data_Sec_lev = []; let modelheader_item_ar = [];
        for (var i = 0; i < this.serviceData.verify_final_data_sel_details.length; i++) {
          var invoice_row_data = this.serviceData.verify_final_data_sel_details[i];
          for (let inv_f_count = 0; inv_f_count < invoice_row_data.feature.length; inv_f_count++) {
            let item_unique_key = invoice_row_data.feature[inv_f_count].unique_key; 

             
            modelheader_item_ar =  invoice_row_data.ModelHeaderItemsArray.filter((obj)=>{
              delete obj['OPTM_PRINT_OPTN'];
               obj.OPTM_QUANTITY = parseFloat(obj.OPTM_QUANTITY).toFixed(3);
              return obj.unique_key == item_unique_key
            });

            if(modelheader_item_ar.length > 0){
              print_report_api_call.ModelHeaderItemsArray.push(modelheader_item_ar[0]);
            }

            featurebomdata_sec_lev =  invoice_row_data.FeatureBOMDataForSecondLevel.filter((obj)=>{
              delete obj['OPTM_PRINT_OPTN'];
              obj.OPTM_QUANTITY = parseFloat(obj.OPTM_QUANTITY).toFixed(3);
              return obj.unique_key == item_unique_key
            });

            if(featurebomdata_sec_lev.length > 0){
              print_report_api_call.FeatureBOMDataForSecondLevel.push(featurebomdata_sec_lev[0]) 
            }

            modelbom_data_Sec_lev =  invoice_row_data.ModelBOMDataForSecondLevel.filter((obj)=>{
              delete obj['OPTM_PRINT_OPTN'];
               obj.OPTM_QUANTITY = parseFloat(obj.OPTM_QUANTITY).toFixed(3);
              return obj.unique_key == item_unique_key && obj.OPTM_TYPE == 2
            });

            if(modelbom_data_Sec_lev.length > 0){
              print_report_api_call.ModelBOMDataForSecondLevel.push(modelbom_data_Sec_lev[0]) 
            }
          }

        }
      


        this.OutputService.getPrintOnReportStatus(print_report_api_call).subscribe(
          data => {
            console.log(data);  
            this.product_grand_details.step4_final_hidden_report_total = 0;
            var step4_final_hidden_report_total = 0;
            if( data != null ) {
              if(data.PrintSettings != undefined && data.PrintSettings.length > 0){
                this.product_grand_details.step4_final_hidden_report_text = data.PrintSettings[0]["VALUE"] ;
              }
            }

            for (var i = 0; i < this.serviceData.verify_final_data_sel_details.length; i++) {
              for (let inv_f_count = 0; inv_f_count < this.serviceData.verify_final_data_sel_details[i].feature.length; inv_f_count++) {
                let item_unique_key = this.serviceData.verify_final_data_sel_details[i].feature[inv_f_count].unique_key; 
                if(data.FeatureBOMDataForSecondLevel.length > 0)   {
                  for(let index in data.FeatureBOMDataForSecondLevel){
                    if(data.FeatureBOMDataForSecondLevel[index].unique_key == item_unique_key ){
                      this.serviceData.verify_final_data_sel_details[i].feature[inv_f_count].OPTM_PRINT_OPTN = data.FeatureBOMDataForSecondLevel[index].OPTM_PRINT_OPTN;
                    }

                  }
                }

                if(data.ModelBOMDataForSecondLevel.length > 0)   {
                  for(let index in data.ModelBOMDataForSecondLevel){
                     if(data.ModelBOMDataForSecondLevel[index].unique_key == item_unique_key ){
                      this.serviceData.verify_final_data_sel_details[i].feature[inv_f_count].OPTM_PRINT_OPTN = data.ModelBOMDataForSecondLevel[index].OPTM_PRINT_OPTN;
                    }
                  }
                }

                /*if(data.ModelHeaderData.length > 0){
                  for(let index in data.ModelHeaderData){
                    data.ModelHeaderData[index].unique_key 
                  }
                }*/

                if(data.ModelHeaderItemsArray.length > 0){
                  for(let index in data.ModelHeaderItemsArray){
                     if(data.ModelHeaderItemsArray[index].unique_key == item_unique_key ){
                      this.serviceData.verify_final_data_sel_details[i].feature[inv_f_count].OPTM_PRINT_OPTN = data.ModelHeaderItemsArray[index].OPTM_PRINT_OPTN;
                    }
                  }
                }
              }
            }

            console.log(" this.serviceData.verify_final_data_sel_details[i] ",  this.serviceData.verify_final_data_sel_details);

            for (let mcount = 0; mcount < this.serviceData.verify_final_data_sel_details.length; mcount++) {
                var row = this.serviceData.verify_final_data_sel_details[mcount];
                row_count++;
                //pushing item data
                this.prepareFinalItemArray(row_count, row.item, row.desc, row.quantity, row.price, row.price_ext, row.feature_discount_percent, row.discounted_price, true);

                let detailed_discount;
                let discounted_detailed_price;
                //If report type is details then only we will show features
                for (let fcount = 0; fcount < row['feature'].length; fcount++) {
                  let featureRow = row['feature'][fcount];
                  row_count++;

                  if (this.report_type == "2") {
                    let itemFeatureName = featureRow.featureName;
                    if (featureRow.featureName == "" || featureRow.featureName == null) {
                      itemFeatureName = featureRow.Item;
                    }

                    if (featureRow.Item == "" || featureRow.Item == null) {
                      itemFeatureName = featureRow.featureName;
                    }

                    detailed_discount = 0;
                    discounted_detailed_price = featureRow.pricextn;
                    if (featureRow.is_accessory == "Y") {
                      detailed_discount = row.accessory_discount_percent
                    }
                    else {
                      detailed_discount = row.feature_discount_percent
                    }

                    if (detailed_discount != 0) {
                      discounted_detailed_price = (featureRow.pricextn - (featureRow.pricextn * (detailed_discount / 100)));
                    }

                    if(featureRow.OPTM_PRINT_OPTN == 'Y'){
                      this.prepareFinalItemArray(row_count, itemFeatureName, featureRow.Description, Number(featureRow.quantity), Number(featureRow.Actualprice), Number(featureRow.pricextn), Number(detailed_discount), Number(discounted_detailed_price), false);
                    } else {
                      this.product_grand_details.step4_final_hidden_report_total +=  Number(discounted_detailed_price);
                    }
                  }
                  else {
                    if (featureRow.is_accessory == "Y" && featureRow.OPTM_ITEMTYPE != 1) {
                      this.prepareFinalItemArray(row_count, featureRow.featureName, featureRow.Description, Number(featureRow.quantity), Number(featureRow.Actualprice), Number(featureRow.pricextn), Number(row.accessory_discount_percent), Number((featureRow.pricextn - (featureRow.pricextn * (row.accessory_discount_percent / 100)))), false);
                    }
                    else {
                      row_count--;
                    }
                  }
                }
              }
          }, error => {
            if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
              this.common_service.isUnauthorized();
            }
          });
      }

      //product grand details
      if (this.serviceData.product_grand_details != undefined && this.serviceData.product_grand_details.length > 0) {
        this.showProdGrandDetails = true;
        if(this.product_grand_details.step4_final_hidden_report_total > 0){
          this.product_grand_details.step4_final_hidden_report_total = this.product_grand_details.step4_final_hidden_report_total;
        }
        this.product_grand_details.step4_final_prod_total = parseFloat(this.serviceData.product_grand_details[0].step4_final_prod_total).toFixed(3);
        this.product_grand_details.step4_final_acc_total = parseFloat(this.serviceData.product_grand_details[0].step4_final_acc_total).toFixed(3);
        this.product_grand_details.step4_final_grand_total = parseFloat(this.serviceData.product_grand_details[0].step4_final_grand_total).toFixed(3);
        this.product_grand_details.prod_discount_log = parseFloat(this.serviceData.product_grand_details[0].prod_discount_log).toFixed(3);
        this.product_grand_details.access_dis_amount_log = parseFloat(this.serviceData.product_grand_details[0].access_dis_amount_log).toFixed(3);
      }
      else {
        this.showProdGrandDetails = false;
      }
  console.log("print_report_api_call ", this.product_grand_details);
      console.log(" invoice_modal show  - " + this.load_print_report);
      if(Object.keys(this.serviceData).length > 0 ){
        $("#invoice_modal").modal('show');
      }
      //   this.lookupfor = "";
    }


    routing_resource_lookup() {
      this.resource_popup_title = this.language.routing_resource;
      this.LookupDataLoaded = false;
      this.is_operation_popup_lookup_open = true;
      this.showLoader = true;
      this.resourceServiceData = [];
      this.resource_basisdd = this.commonData.resource_basic();
      if (this.serviceData !== undefined && this.serviceData !== "") {
        if (this.serviceData.wc_code != "" && this.serviceData.oper_code != "" && this.serviceData.wc_code != undefined && this.serviceData.oper_code != undefined) {
          for (var inx = 0; inx < this.serviceData.oper_res.length; inx++) {
            console.log("this.serviceData.oper_res[inx] - ", this.serviceData.oper_res[inx]);
            this.resource_counter = 0;
            if (this.resourceServiceData.length > 0) {
              this.resource_counter = this.resourceServiceData.length
            }

            let basis = '1';
            let is_basis_disabled = false;
            if (this.serviceData.oper_res[inx].oper_consumption_method == '1' || this.serviceData.oper_res[inx].oper_consumption_method == 1) { // setup 
              is_basis_disabled = true;
              basis = '4';
              this.resource_basisdd = [
              { "value": '4', "Name": "Setup" }
              ]
            }

            if (this.serviceData.oper_res[inx].oper_consumption_method == '2' || this.serviceData.oper_res[inx].oper_consumption_method == 2) { // variable
              is_basis_disabled = false;
              basis = '1';
              this.resource_basisdd = [
              { "value": '1', "Name": "Item" },
              { "value": '4', "Name": "Setup" }
              ]
            }

            if (this.serviceData.oper_res[inx].oper_consumption_method == '3' || this.serviceData.oper_res[inx].oper_consumption_method == 3) { // Fixed
              is_basis_disabled = false;
              basis = '1';
              this.resource_basisdd = [
              { "value": '1', "Name": "Item" },
              { "value": '2', "Name": "Batch" },
              { "value": '4', "Name": "Setup" }
              ]
            }

            if(this.serviceData.oper_res[inx].basis != undefined && this.serviceData.oper_res[inx].basis !="" && this.serviceData.oper_res[inx].basis != null){
              basis = this.serviceData.oper_res[inx].basis;
            }


            this.resource_counter++;
            var res_consum_type = 1;
            if (this.serviceData.oper_res[inx].resource_consumption_type != undefined && this.serviceData.oper_res[inx].resource_consumption_type != "") {
              res_consum_type = this.serviceData.oper_res[inx].resource_consumption_type;
            } else {
              res_consum_type  = this.serviceData.oper_res[inx].oper_consumption_method;
            }
            if (this.serviceData.oper_res[inx].OPRCode != undefined) {
              this.resourceServiceData.push({
                lineno: this.resource_counter,
                rowindex: this.resource_counter,
                ChrgBasis: this.serviceData.oper_res[inx].ChrgBasis,
                DCNum: this.serviceData.oper_res[inx].DCNum,
                LineID: this.serviceData.oper_res[inx].LineID,
                operation_no: this.serviceData.oper_res[inx].OPRCode,
                oper_type: this.serviceData.oper_res[inx].oper_type,
                oper_consumption_type: this.serviceData.oper_res[inx].oper_consumption_method,
                oper_consumption_method: this.serviceData.oper_res[inx].oper_consumption_method,
                resource_code: this.serviceData.oper_res[inx].ResCode,
                resource_name: this.serviceData.oper_res[inx].ResName,
                resource_type: this.serviceData.oper_res[inx].ResType,
                resource_uom: this.serviceData.oper_res[inx].ResUOM,
                resource_consumption: parseFloat(this.serviceData.oper_res[inx].ResCons).toFixed(3),
                resource_inverse: parseFloat(this.serviceData.oper_res[inx].ResInv).toFixed(3),
                no_resource_used: this.serviceData.oper_res[inx].ResUsed,
                time_uom: this.serviceData.oper_res[inx].TimeUOM,
                time_consumption: parseFloat(this.serviceData.oper_res[inx].TimeCons).toFixed(3),
                time_inverse: parseFloat(this.serviceData.oper_res[inx].TimeInv).toFixed(3),
                resource_consumption_type: res_consum_type,
                basis: basis,
                is_basis_disabled: is_basis_disabled,
                schedule: this.serviceData.oper_res[inx].schedule,
                is_resource_disabled: true,
                unique_key: this.serviceData.unique_key
              });
            }

            this.resourceServiceOperCM = this.serviceData.oper_res[inx].oper_consumption_method;
          }

          if (this.serviceData.oper_code != "" && this.serviceData.oper_code != null && this.serviceData.oper_code != undefined) {
            this.resourceServiceOper = this.serviceData.oper_code;
          }

          if (this.serviceData.wc_code != "" && this.serviceData.wc_code != null && this.serviceData.wc_code != undefined) {
            this.resourceServiceWc = this.serviceData.wc_code;
          }

          this.showLoader = false;
          this.LookupDataLoaded = true;
          console.log("routing_resource_modal show ");
          $("#routing_resource_modal").modal('show');

        }
      }
    }

    insert_new_resource() {
      console.log("this.resourceServiceData - ", this.resourceServiceData);
      if (this.resourceServiceData == undefined || this.resourceServiceData == null || this.resourceServiceData == "") {
        this.resourceServiceData = [];
      }
      this.resource_counter = 0;
      if (this.resourceServiceData.length > 0) {
        this.resource_counter = this.resourceServiceData.length
      }
      let  unqiue_key = '';
      if(this.serviceData.unique_key == undefined || this.serviceData.unique_key == "" || this.serviceData.unique_key == null ){
        if(this.resourceServiceData[0].unique_key !== undefined){
          unqiue_key  = this.resourceServiceData[0].unique_key;
        }

      } else {
        unqiue_key = this.serviceData.unique_key ;
      }

      let basis = '1';
      let is_basis_disabled = false;
      if (this.resourceServiceOperCM == '1' || this.resourceServiceOperCM == 1) { // setup 
        is_basis_disabled = true;
        basis = '4';
        this.resource_basisdd = [
        { "value": '4', "Name": "Setup" }
        ]
      }

      if (this.resourceServiceOperCM == '2' || this.resourceServiceOperCM == 2) { // variable
        is_basis_disabled = false;
        basis = '1';
        this.resource_basisdd = [
        { "value": '1', "Name": "Item" },
        { "value": '4', "Name": "Setup" }
        ]
      }

      if (this.resourceServiceOperCM == '3' || this.resourceServiceOperCM == 3) { // Fixed
        is_basis_disabled = false;
        basis = '1';
        this.resource_basisdd = [
        { "value": '1', "Name": "Item" },
        { "value": '2', "Name": "Batch" },
        { "value": '4', "Name": "Setup" }
        ]
      }

      this.resource_counter++;
      console.log("this.serviceData.unique_key ", this.serviceData.unique_key, "unqiue_key ", unqiue_key);
      this.resourceServiceData.push({
        lineno: this.resource_counter,
        rowindex: this.resource_counter,
        operation_no: this.resourceServiceOper,
        resource_code: '',
        resource_name: '',
        resource_uom: '',
        resource_type: '',
        resource_consumption: parseFloat("1").toFixed(3),
        resource_inverse: parseFloat("0").toFixed(3),
        no_resource_used: parseInt("1"),
        time_uom: '',
        time_consumption: parseFloat("0").toFixed(3),
        time_inverse: parseFloat("0").toFixed(3),
        resource_consumption_type: this.resourceServiceOperCM,
        oper_consumption_method: this.resourceServiceOperCM,
        oper_consumption_type: this.resourceServiceOperCM,
        basis: basis,
        is_basis_disabled: is_basis_disabled,
        schedule: false,
        is_resource_disabled: true,
        unique_key: unqiue_key
      });
    }

    onDeleteRow(rowindex) {
      if (this.resourceServiceData.length > 0) {
        for (let i = 0; i < this.resourceServiceData.length; ++i) {
          if (this.resourceServiceData[i].rowindex === rowindex) {
            this.resourceServiceData.splice(i, 1);
            i = i - 1;
          }
          else {
            this.resourceServiceData[i].rowindex = i + 1;
          }
        }
      }
    }

    clearInvalidRes(currentrow) {
      this.resourceServiceData[currentrow].resource_code = "";
      this.resourceServiceData[currentrow].resource_name = "";
      this.resourceServiceData[currentrow].resource_uom = "";
      this.resourceServiceData[currentrow].resource_type = "";

      $(".row_resource_code").eq(currentrow).val("");
      $(".row_resource_name").eq(currentrow).val("");
      $(".row_resource_uom").eq(currentrow).val("");
    }


    get_consumption_inverse_value(type, value, resource_code, currentrow) {
      this.rs.getResConversionInverse(type, value, resource_code).subscribe(
        data => {
          console.log(data);
          if (data != undefined) {
            if (data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                this.common_service.RemoveLoggedInUser().subscribe();
                this.common_service.signOut(this.toastr, this.router, 'Sessionout');
                this.showLookupLoader = false;
                return;
              }
              if (type == 'inverse') {
                this.resourceServiceData[currentrow].resource_consumption = parseFloat(data[0].Consumption).toFixed(3)
              }
              if (type == 'consumption') {
                this.resourceServiceData[currentrow].resource_inverse = parseFloat(data[0].Inverse).toFixed(3);
              }
              if (data[0].TimeUOM != null && data[0].TimeUOM != undefined && data[0].TimeUOM != "") {
                this.resourceServiceData[currentrow].time_uom = data[0].TimeUOM;
              } else {
                this.resourceServiceData[currentrow].time_uom = "";
              }
              if (data[0].TimeConsumption != null && data[0].TimeConsumption != undefined) {
                this.resourceServiceData[currentrow].time_consumption = parseFloat(data[0].TimeConsumption).toFixed(3);
              } else {
                this.resourceServiceData[currentrow].time_consumption = (0).toFixed(3);
              }
              if (data[0].TimeInverse != null && data[0].TimeInverse != undefined) {
                this.resourceServiceData[currentrow].time_inverse = parseFloat(data[0].TimeInverse).toFixed(3);
              } else {
                this.resourceServiceData[currentrow].time_consumption = (0).toFixed(3);
              }
            }
          } else {
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          }
        }, error => {
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.common_service.isUnauthorized();
          } else {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          }
        }
        )
    }

    on_input_change(value, rowindex, grid_element) {
      var currentrow = 0;
      for (let i = 0; i < this.resourceServiceData.length; ++i) {
        if (this.resourceServiceData[i].rowindex === rowindex) {
          currentrow = i;
        }
      }
      console.log(currentrow);
      if (grid_element == 'operation_no') {

      }

      if (grid_element == 'resource_code') {
        this.showLookupLoader = true;
        this.rs.getResourceDetail(value).subscribe(
          data => {
            console.log(data);
            if (data != null && data != undefined) {
              if (data.length > 0) {
                if (data[0].ErrorMsg == "7001") {
                  this.common_service.RemoveLoggedInUser().subscribe();
                  this.common_service.signOut(this.toastr, this.router, 'Sessionout');
                  this.showLookupLoader = false;
                  return;
                }
                this.resourceServiceData[currentrow].resource_code = data[0].ResCode;
                this.resourceServiceData[currentrow].resource_name = data[0].Name;
                this.resourceServiceData[currentrow].resource_uom = data[0].UnitOfMsr;
                this.resourceServiceData[currentrow].resource_type = data[0].ResType;
                this.get_consumption_inverse_value('consumption', 1, this.resourceServiceData[currentrow].resource_code, currentrow);
                this.showLookupLoader = false;
              } else {
                this.toastr.error('', this.language.invalidrescodeRow + ' ' + rowindex, this.commonData.toast_config);
                this.clearInvalidRes(currentrow);
                this.showLookupLoader = false;
                return;
              }
            } else {
              this.toastr.error('', this.language.invalidrescodeRow + ' ' + rowindex, this.commonData.toast_config);
              this.clearInvalidRes(currentrow);
              this.showLookupLoader = false;
              return;
            }
          }, error => {
            this.showLookupLoader = false;
            if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
              this.common_service.isUnauthorized();
            } else {
              this.toastr.error('', this.language.invalidrescodeRow + ' ' + rowindex, this.commonData.toast_config);
              this.clearInvalidRes(currentrow);

            }
            return;
          }
          );
      }

      if (grid_element == 'resource_name') {

      }

      if (grid_element == 'resource_uom') {

      }

      if (grid_element == 'resource_consumption') {

        if (value == 0 && value != '') {
          value = 1;

          this.toastr.error('', this.language.consumption_type_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
        }
        else {
          if (isNaN(value) == true) {
            value = 1;
            this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
          } else if (value == 0 || value == '' || value == null || value == undefined) {
            value = 1;
            this.toastr.error('', this.language.blank_or_zero_ct_not_allowed + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
          } else if (value < 0) {
            value = 1;
            this.toastr.error('', this.language.negative_ct_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
          }
        }

        this.resourceServiceData[currentrow].resource_consumption = parseFloat(value).toFixed(3);;
        $('.row_resource_consumption').eq(currentrow).val(parseFloat(value).toFixed(3));

        if (this.resourceServiceData[currentrow].resource_code != "" && this.resourceServiceData[currentrow].resource_code != undefined && this.resourceServiceData[currentrow].resource_code != null) {
          this.get_consumption_inverse_value('consumption', value, this.resourceServiceData[currentrow].resource_code, currentrow);
        } else {
          this.resourceServiceData[currentrow].time_consumption = parseFloat('0').toFixed(3);
          this.resourceServiceData[currentrow].time_inverse = parseFloat('0').toFixed(3);
        }

      }

      if (grid_element == 'resource_inverse') {
        if (value == 0 && value != '') {
          value = 1;
          this.toastr.error('', this.language.inverse_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
        }
        else {
          if (isNaN(value) == true) {
            value = 1;
            this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
          } else if (value == 0 || value == '' || value == null || value == undefined) {
            value = 1;
            this.toastr.error('', this.language.blank_or_zero_inverse_not_allowed + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
          } else if (value < 0) {
            value = 1;
            this.toastr.error('', this.language.negative_inverse_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
          }
        }
        this.resourceServiceData[currentrow].resource_inverse = parseFloat(value).toFixed(3);
        $('.row_resource_inverse').eq(currentrow).val(parseFloat(value).toFixed(3));
        if (this.resourceServiceData[currentrow].resource_code != "" && this.resourceServiceData[currentrow].resource_code != undefined && this.resourceServiceData[currentrow].resource_code != null) {
          this.get_consumption_inverse_value('inverse', value, this.resourceServiceData[currentrow].resource_code, currentrow);
        } else {
          this.resourceServiceData[currentrow].time_consumption = parseFloat('0').toFixed(3);
          this.resourceServiceData[currentrow].time_inverse = parseFloat('0').toFixed(3);
        }


      }

      if (grid_element == 'no_resource_used') {
        if (value == 0 && value != '') {
          value = 1;
          this.resourceServiceData[currentrow].no_resource_used = value;
          this.toastr.error('', this.language.no_of_resource_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
        }
        else {
          let rgexp = /^\d+$/;
          if (isNaN(value) == true) {
            value = 1;
            this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
          } else if (value == 0 || value == '' || value == null || value == undefined) {
            value = 1;
            this.toastr.error('', this.language.blank_or_zero_noresused_not_allowed + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
          } else if (value < 0) {
            value = 1;
            this.toastr.error('', this.language.negative_resource_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
          } else if (rgexp.test(value) == false) {
            value = 1;
            this.toastr.error('', this.language.decimal_noresused_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), this.commonData.toast_config);
          }
          this.resourceServiceData[currentrow].no_resource_used = (value);

        }
        $('.row_no_resource_used').eq(currentrow).val(value);
      }

      if (grid_element == 'time_uom') {
        this.resourceServiceData[currentrow].time_uom = (value);
      }

      if (grid_element == 'time_consumption') {
        this.resourceServiceData[currentrow].time_consumption = parseFloat(value).toFixed(3);
      }

      if (grid_element == 'time_inverse') {
        this.resourceServiceData[currentrow].time_inverse = parseFloat(value).toFixed(3);
      }

      if (grid_element == 'resource_consumption_type') {
        this.resourceServiceData[currentrow].resource_consumption_type = (value);
      }

      if (grid_element == 'resource_basic') {
        this.resourceServiceData[currentrow].resource_basic = (value);
      }

      if (grid_element == 'schedule') {
        this.resourceServiceData[currentrow].schedule = (value);
      }
    }


    open_resource_lookup(type, rowindex) {
      this.showLookupLoader = true;
      this.serviceData = []
      this.rs.getResourceList(this.resourceServiceWc).subscribe(
        data => {
          if (data != null && data != undefined) {
            if (data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                this.common_service.RemoveLoggedInUser().subscribe();
                this.common_service.signOut(this.toastr, this.router, 'Sessionout');
                this.showLookupLoader = false;
                return;
              }

              this.current_popup_row = rowindex;
              this.table_head = [
              {
                field: 'ResCode',
                title: this.language.resource_code,
                type: 'text',
                width: '100',
                attrType: 'text'
              },
              {
                field: 'Name',
                title: this.language.resource_name,
                type: 'text',
                width: '100',
                attrType: 'text'
              },
              {
                field: 'NumberOfRes',
                title: this.language.numberofres,
                type: 'text',
                width: '100',
                attrType: 'text'
              },
              {
                field: 'WCCode',
                title: this.language.workcenter_code,
                type: 'text',
                width: '100',
                attrType: 'text'
              }];
              this.serviceData = data;
              this.popup_title = this.language.resources;
              this.dialogOpened = true;
              this.popup_resource = true;
            }
            else {
              this.dialogOpened = false;
              this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
              return;
            }
          } else {
            this.dialogOpened = false;
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
            return;
          }
        },
        error => {
          this.dialogOpened = false;
          this.showLookupLoader = false;
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.common_service.isUnauthorized();
          } else {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          }
        }
        )
    }

    public tree_data_json: any = '';
    @Input() component;

    prepareFinalItemArray(index, itemCode, itemDesc, quantity, price, price_ext, feature_discount_percent, discounted_price, isFG) {
      // if (this.report_type == "2" && isFG == true) {
        //   price = "";
        //   quantity = "";
        //   price_ext = "";
        // }
        let model_index = 0;
        if(isFG){
          let is_model_index = this.print_item_list_array.filter((obj) => {
              return obj.isFG == isFG
          });
          if(is_model_index.length == 0){
            model_index = 1;
          } else {
            model_index = is_model_index.length + 1;
          }
        }
        this.print_item_list_array.push({
          "sl_no": index,
          "model_index" : model_index,
          "item": itemCode,
          "item_desc": itemDesc,
          "quantity": parseFloat(quantity).toFixed(3),
          "price": parseFloat(price).toFixed(3),
          "price_ext": parseFloat(price_ext).toFixed(3),
          "feature_discount_percent": parseFloat(feature_discount_percent).toFixed(3),
          "discounted_price": parseFloat(discounted_price).toFixed(3),
          "isFG": isFG
        });
      }

      showAssociatedBOMs() {

        this.popup_title = this.language.associated_BOM;
        this.LookupDataLoaded = false;
        this.showLoader = true;

        console.log(this.serviceData);
        // this.table_head = [this.language.ModelId, this.language.Model_ModelName, this.language.Model_ModelDesc];
        this.table_head = [

        {
          field: 'DisplayName',
          title: this.language.Model_Name,
          type: 'text',
          width: '100',
          attrType: 'text'
        },
        {
          field: 'Description',
          title: this.language.Model_Desc,
          type: 'text',
          width: '100',
          attrType: 'text'
        },
        ];
        this.table_head_hidden_elements = [true, false, false];
        this.width_value = ((100 / this.table_head.length) + '%');

        this.showLoader = false;
        this.LookupDataLoaded = true;
        if (this.serviceData !== undefined) {
          if (this.serviceData.length > 0) {
            $("#simple_table_modal").modal('show');
          }
        }

      }

      showModelBOMTreeView() {
        this.popup_title = this.language.explode;
        this.showLoader = true;
        this.LookupDataLoaded = false;
        //this.tree_data_json = this.dummy_json();
        this.showLoader = false;
        this.LookupDataLoaded = true;
        if (this.serviceData !== undefined) {
          if (this.serviceData.length > 0) {
            // this.tree_data_json =  this.dummy_json();
            this.tree_data_json = this.serviceData;

            // setTimeout(function(){
              $("#tree_view").modal('show');
              //}, 5000);
            }
          }
        }

        show_help_popup(){
          //   this.popup_title = this.language.user_guide;


        }

        customer_lookup() {
          this.popup_title = this.language.customer;
          this.LookupDataLoaded = false;
          this.showLoader = true;
          this.fill_input_id = 'featureItemName';
          // this.table_head = [this.language.customer_code, this.language.Name];
          console.log(this.serviceData);
          this.table_head = [
          {
            field: 'CustID',
            title: this.language.customer_code,
            type: 'text',
            width: '100',
            attrType: 'text'
          },
          {
            field: 'Name',
            title: this.language.Name,
            type: 'text',
            width: '100',
            attrType: 'text'
          },

          ];
          this.table_head_hidden_elements = [false, false];
          this.lookup_key = 'Name';

          this.width_value = ((100 / this.table_head.length) + '%');


          this.showLoader = false;
          this.LookupDataLoaded = true;
          if (this.serviceData !== undefined) {
            if (this.serviceData.length > 0) {
              this.dialogOpened = true;
              this.loadServerData(this.serviceData);
              // $("#lookup_modal").modal('show');
            }
          }

        }

        reset() {
          this.myInputVariable.nativeElement.value = "";
        }

        filtered_feature_list(verify_final_data_sel_details) {
          console.log(verify_final_data_sel_details);
          verify_final_data_sel_details = verify_final_data_sel_details.filter(function (obj) {

            obj['OPTM_LEVEL'] = 0;
            return verify_final_data_sel_details.feature;
          })
        }

        cleanup_print_arrays() {
          this.product_grand_details.length = 0;
          this.print_item_list_array.length = 0;
        }


        dummy_json() {
          return [
          { "sequence": 1, "parentId": "", "component": "29", "level": "0" },
          { "sequence": 2, "parentId": "29", "component": "19", "level": "1" },
          { "sequence": 3, "parentId": "29", "component": "8", "level": "1" },
          { "sequence": 4, "parentId": "29", "component": "Wind Sensor", "level": "1" },
          { "sequence": 5, "parentId": "29", "component": "WMT70BIRDKIT", "level": "1" },
          { "sequence": 6, "parentId": "19", "component": "21", "level": "2" },
          { "sequence": 7, "parentId": "19", "component": "20", "level": "2" },
          { "sequence": 8, "parentId": "8", "component": "Item02", "level": "2" },
          { "sequence": 9, "parentId": "8", "component": "VALUE", "level": "2" },
          { "sequence": 10, "parentId": "19", "component": "Wind Sensor", "level": "2" },
          { "sequence": 11, "parentId": "20", "component": "22", "level": "3" },
          { "sequence": 12, "parentId": "20", "component": "21", "level": "3" },
          { "sequence": 13, "parentId": "22", "component": "26", "level": "4" },
          { "sequence": 14, "parentId": "22", "component": "23", "level": "4" },

          //    {"sequence":15,"parentId":"23","component":"19","level":"5"},
          { "sequence": 16, "parentId": "19", "component": "21", "level": "6" },
          { "sequence": 17, "parentId": "19", "component": "20", "level": "6" },
          { "sequence": 18, "parentId": "19", "component": "Wind Sensor", "level": "6" },

          ]
        }
      }
