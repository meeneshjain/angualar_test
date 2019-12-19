import { Component, OnInit, ElementRef, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { RoutingService } from '../../services/routing.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';
import  { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.scss']
})
export class RoutingComponent implements OnInit {
  public commonData = new CommonData();
  public view_route_link = '/routing/view';
  public input_file: File = null;
  public routing_header_data: any = [];
  public routing_detail_data: any = [];
  public routing_detail_resource_data: any = [];
  public image_data: any = [];
  public lookupfor: string = '';
  public counter = 0;
  public update_id = '';
  public min;
  public show_insert_operation_btn: boolean = true;
  public show_resequence_btn: boolean = true;
  public show_resource_btn: boolean = true;
  public isSaveButtonVisible: boolean = false;
  public isUpdateButtonVisible: boolean = false;
  public isDeleteButtonVisible: boolean = false;
  public isExplodeButtonVisible: boolean = false;
  public showLookupLoader: boolean = false;
  public type_dropdown:any = '';
  public grid_option_title = '';
  public row_selection: number[] = [];
  public current_grid_action_row: number = 0;
  public current_selected_row: any = [];
  public selectableSettings: any = [];
  public live_tree_view_data = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  public showLoader: boolean = true;
  public routing_type = ""
  public selectedImage = "";
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public customPatterns = { '0': { pattern: new RegExp('\[0-9\]') } }
  public menu_auth_index = '206';
  public made_changes:boolean = false;

  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: RoutingService, private toastr: ToastrService, private commonService: CommonService, private modalService: BsModalService, private DialogService : DialogService) { }

  companyName: string;
  page_main_title = this.language.routing
  public grid_title = this.language.routing_details;
  public username: string = "";
  serviceData: any;
  public is_delete_called: boolean = false;
  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;

  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;
  public form_mode = '';
  isOperationDisabled: boolean = false;

  canDeactivate() {
    if(this.made_changes == true){
      return this.DialogService.confirm('');
    } else {
      return true;
    }
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

  bodyClick() {
    $('body').click()
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    console.log("scrolling...window");
    $('body').click()
  }

  ngOnInit() {
    let d = new Date();
    let current_date = new Date();
    this.min = new Date(d.setDate(d.getDate() - 1));
    this.routing_header_data.EffectiveDate = new Date((current_date.getMonth() + 1) + '/' + current_date.getDate() + '/' + current_date.getFullYear());
    this.selectableSettings = {
      mode: 'single'
    };
    const element = document.getElementsByTagName('body')[0];
    // // element.className = '';
    this.detectDevice();
//    element.classList.add('add_model-bom');
    // element.classList.add('sidebar-toggled');
    // document.getElementById("opti_sidebar").classList.add('toggled');

    this.commonData.checkSession();
    this.username = sessionStorage.getItem('loggedInUser');
    this.companyName = sessionStorage.getItem('selectedComp');
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');

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
      });
    // check screen authorisation - end

    if (this.update_id === "" || this.update_id === null) {
      this.made_changes = true;
      this.routing_header_data.routing_for = 'feature';
      this.on_operation_change();
      this.isSaveButtonVisible = true;
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this.isExplodeButtonVisible = true;
      this.show_resequence_btn = false;
      this.show_resource_btn = true;
      this.routing_header_data.default_batch_size = 1;
      this.routing_header_data.default_lot_size = 1;
      this.routing_header_data.applicable_bom_unit = 1;
      this.showLoader = false;
      this.form_mode = 'add';
      this.isOperationDisabled = false;
    } else {
      this.made_changes = false;
      this.isSaveButtonVisible = false;
      this.isUpdateButtonVisible = true;
      this.isDeleteButtonVisible = true;
      this.isExplodeButtonVisible = true;
      this.show_resequence_btn = true;
      this.show_resource_btn = true;
      this.form_mode = 'edit';
      this.isOperationDisabled = true;
      this.showLoader = true;
      this.service.get_routing_details(this.update_id).subscribe(
        data => {
          console.log("get_routing_details ", data)
          if (data != undefined) {
            if (data.LICDATA != undefined) {
              if (data.LICDATA[0].ErrorMsg == "7001") {
                this.made_changes = false;
                this.commonService.RemoveLoggedInUser().subscribe();
                this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                this.showLoader = false;
                return;
              }
            }

            if (data.Header.length > 0) {
              let data_header = data.Header[0];
              let routing_for = '';
              let feature_id = '';
              let feature_code = '';
              let feature_desc = '';
              let model_id = '';
              let model_code = '';
              let model_desc = '';

              if (data_header.OPTM_TYPE == 1) {
                routing_for = 'feature';
                feature_id = data_header.OPTM_MODELFEATUREID;
                feature_code = data_header.OPTM_MODELFEATURECODE
                feature_desc = data_header.OPTM_DESCRIPTION;
                this.grid_option_title = this.language.Bom_FeatureValue;
                this.type_dropdown = this.commonData.feature_bom_type();
                this.routing_type = 'feature';
              } else if (data_header.OPTM_TYPE == 2) {
                routing_for = 'model';
                model_id = data_header.OPTM_MODELFEATUREID;
                model_code = data_header.OPTM_MODELFEATURECODE
                model_desc = data_header.OPTM_DESCRIPTION;
                this.grid_option_title = this.language.ModelBom_FeatureValue;
                this.type_dropdown = this.commonData.model_bom_type();
                this.routing_type = 'model'
              }


              let use_mtq_in_planing;
              if (data_header.OPTM_USEMTQIN_PLN == 'Y') {
                use_mtq_in_planing = true;
              } else {
                use_mtq_in_planing = false;
              }

              let use_template_routing;
              if (data_header.OPTM_USETEMPLATEPRODUCT == 'Y') {
                use_template_routing = true;
              } else {
                use_template_routing = false;
              }

              var eff_date_temp = new Date(data_header.OPTM_EFF_DATE);
              let temp_effective_date = new Date((eff_date_temp.getMonth() + 1) + '/' + eff_date_temp.getDate() + '/' + eff_date_temp.getFullYear());

              this.routing_header_data = {
                EffectiveDate: temp_effective_date,
                applicable_bom_unit: data_header.OPTM_APCLBLBOMUNIT,
                default_batch_size: data_header.OPTM_DFLT_BATCH_SIZE,
                default_lot_size: data_header.OPTM_DFLT_LOT_SIZE,
                feature_code: feature_code,
                feature_description: feature_desc,
                feature_id: feature_id,
                modal_code: model_code,
                modal_description: model_desc,
                modal_id: model_id,
                opm_num_format: data_header.OPTM_OPN_NUM_FORMAT,
                routing_for: routing_for,
                template_routing_id: data_header.OPTM_TEMPLATEPRODUCT,
                template_routing_code: data_header.OPTM_TEMPLATEPRODUCT_CODE,
                use_mtq_in_planing: use_mtq_in_planing,
                use_template_routing: use_template_routing,
                warehouse_code: data_header.OPTM_WH_ID,
                warehouse_id: data_header.OPTM_WH_ID,
              };
            }

            if (data.Detail.length > 0) {

              for (let d_dtli = 0; d_dtli < data.Detail.length; d_dtli++) {
                let data_detail = data.Detail[d_dtli];

                var deff_date_temp = new Date(data_detail.OPTM_EFF_DATE);
                let detail_effective_date = new Date((deff_date_temp.getMonth() + 1) + '/' + deff_date_temp.getDate() + '/' + deff_date_temp.getFullYear());

                let operation_top_level;
                if (data_detail.OPTM_OPER_AT_TOP_LEVEL == 'Y') {
                  operation_top_level = true;
                } else {
                  operation_top_level = false;
                }

                let count_point_operation;
                if (data_detail.OPTM_CNT_POINT_OPR == 'Y') {
                  count_point_operation = true;
                } else {
                  count_point_operation = false;
                }

                let auto_move;
                if (data_detail.OPTM_AUTOMOVE == 'Y') {
                  auto_move = true;
                } else {
                  auto_move = false;
                }

                let opn_application;
                if (data_detail.OPTM_OPR_APPLICABLE == 'Y') {
                  opn_application = true;
                } else {
                  opn_application = false;
                }

                let showOperationbtn = false;
                let isOpenApplicableVisible = true;
                if (data_detail.OPTM_TYPE == 4 || data_detail.OPTM_TYPE == '4') {
                  showOperationbtn = true;
                  isOpenApplicableVisible = false;
                }


                if (this.routing_header_data.routing_for == "feature") {
                  if (data_detail.OPTM_TYPE == 3 || data_detail.OPTM_TYPE == '3') {
                    opn_application = false;
                    isOpenApplicableVisible = false;
                  }
                }

                if (data_detail.OPTM_TYPE == 1) {
                  if (data_detail.OPTM_ACCESSORY == 'Y' || data_detail.OPTM_ACCESSORY == 'y') {
                    opn_application = false;
                    isOpenApplicableVisible = false;
                  }
                }

                // here goes oper type check at time of edit 
                let count_point_operation_disabled = false;
                if (data_detail.OPTM_OPR_TYPE == '4' || data_detail.OPTM_OPR_TYPE == '5') {
                  count_point_operation_disabled = true;
                }

                let inc_lead_time_calc = false;
                if (data_detail.OPTM_INC_LEAD_TIM_CAL == 'Y' || data_detail.OPTM_INC_LEAD_TIM_CAL == 'y') {
                  inc_lead_time_calc = true;
                }
                let res_cnsptn_mthd = this.commonData.res_consumption_method();

                this.routing_detail_data.push({
                  optm_id: data_detail.OPTM_ID,
                  lineno: data_detail.OPTM_LINE_NO,
                  rowindex: data_detail.OPTM_LINE_NO,
                  type: data_detail.OPTM_TYPE,
                  type_value: (data_detail.OPTM_VALUE),
                  type_value_code: (data_detail.OPTM_VALUE_CODE),
                  description: data_detail.OPTM_DISPLAYNAME,
                  operation_top_level: operation_top_level,
                  oper_id: data_detail.OPTM_OPR_ID,
                  oper_code: data_detail.OPTM_OPR_ID,
                  oper_desc: data_detail.OPTM_OPR_DESC,
                  oper_type: data_detail.OPTM_OPR_TYPE,
                  wc_id: data_detail.OPTM_WC_ID,
                  wc_code: data_detail.OPTM_WC_ID,
                  mtq: data_detail.OPTM_MIN_TRF_QTY,
                  count_point_operation: count_point_operation,
                  auto_move: auto_move,
                  effective_date: detail_effective_date,
                  qc_time: data_detail.OPTM_QCTIME,
                  queue_time: data_detail.OPTM_QUEUE_TIME,
                  move_time: data_detail.OPTM_MOVE_TIME,
                  time_uom: data_detail.OPTM_TIME_UOM,
                  opn_application: opn_application,
                  isTypeDisabled: true,
                  isOpenApplicableVisible: isOpenApplicableVisible,
                  showOperationbtn: showOperationbtn,
                  count_point_operation_disabled: count_point_operation_disabled,
                  unique_key: data_detail.OPTM_UNIQUE_KEY,
                  oper_consumption_method: data_detail.OPTM_OPER_CONSUM_METHOD,
                  inc_lead_time_calc: inc_lead_time_calc,
                  oper_consumption_method_str: res_cnsptn_mthd[data_detail.OPTM_OPER_CONSUM_METHOD],
                });

                if (data.ResourceDetail.length > 0) {

                  let data_resource_detail = data.ResourceDetail.filter(function (obj) {
                    return (obj.OPTM_UNIQUE_KEY == data_detail.OPTM_UNIQUE_KEY) ? obj : "";
                  });
                  if (data_resource_detail.length > 0) {
                    let temp_array = [];
                    for (let dr_dtli = 0; dr_dtli < data_resource_detail.length; dr_dtli++) {
                      let data_resource_detailddd = data_resource_detail[dr_dtli];

                      if (this.routing_detail_resource_data[(data_detail.OPTM_LINE_NO - 1)] == undefined || this.routing_detail_resource_data[(data_detail.OPTM_LINE_NO - 1)].length == 0) {
                        this.routing_detail_resource_data[(data_detail.OPTM_LINE_NO - 1)] = [];
                      }

                      let let_res_schedule = false;
                      if (data_resource_detailddd.OPTM_SCHEDULE == '1' || data_resource_detailddd.OPTM_SCHEDULE == 1) {
                        let_res_schedule = true;
                      }

                      temp_array.push({
                        optm_id: data_resource_detailddd.OPTM_ID,
                        lineno: data_resource_detailddd.OPTM_LINE_ID,
                        rowindex: data_resource_detailddd.OPTM_LINE_ID,
                        OPRCode: data_resource_detailddd.OPTM_OPR_ID,
                        ResCode: data_resource_detailddd.OPTM_RESO_ID,
                        ResName: data_resource_detailddd.OPTM_RESONAME,
                        ResType: '',
                        ResUOM: data_resource_detailddd.OPTM_UOM,
                        ResCons: (data_resource_detailddd.OPTM_CONSUMPTION).toString(),
                        ResInv: (data_resource_detailddd.OPTM_INVERSE).toString(),
                        ResUsed: data_resource_detailddd.OPTM_NOF_RESO_USED,
                        TimeUOM: data_resource_detailddd.OPTM_TIMEUOM,
                        TimeCons: (data_resource_detailddd.OPTM_CONSU).toString(),
                        TimeInv: (data_resource_detailddd.OPTM_RINVERSE).toString(),
                        resource_consumption_type: data_resource_detailddd.OPTM_CONSTYPE,
                        basis: data_resource_detailddd.OPTM_BASIS,
                        schedule: let_res_schedule,
                        is_resource_disabled: true,
                        unique_key: data_resource_detailddd.OPTM_UNIQUE_KEY,
                        oper_consumption_method: data_detail.OPTM_OPER_CONSUM_METHOD
                      });

                      this.routing_detail_resource_data[(data_detail.OPTM_LINE_NO - 1)] = temp_array;
                    }
                  }
                }
              }
            }

            this.showLoader = false;
            console.log(this.routing_detail_resource_data);
          } else {
            this.showLoader = false;
            this.route.navigateByUrl('routing/view');
            this.toastr.error('', this.language.no_routing_found, this.commonData.toast_config);
            return;

          }
          this.onExplodeClick('auto');
        },
        error => {
          this.showLoader = false;
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commonService.isUnauthorized();
          } else {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          }
          return;
        });
}
}

ngOnChanges() { }

on_operation_change() {
  this.made_changes = true;
  this.current_selected_row = [];
  if (this.routing_header_data.routing_for == 'feature') {
    this.reset_model()
    this.show_resequence_btn = false;
    this.show_resource_btn = true;
    this.type_dropdown = this.commonData.feature_bom_type();
    this.routing_type = 'feature';

    this.grid_option_title = this.language.Bom_FeatureValue;
  } else if (this.routing_header_data.routing_for == 'model') {
    this.reset_feature()
    this.show_resequence_btn = true;
    this.show_resource_btn = true;
    this.type_dropdown = this.commonData.model_bom_type();
    this.grid_option_title = this.language.ModelBom_FeatureValue;
    this.routing_type = 'model';
  }
  this.current_selected_row = [];
  this.row_selection = [];

}

reset_feature() {
  this.routing_header_data.feature_id = "";
  this.routing_header_data.feature_code = "";
  this.routing_header_data.feature_description = "";
  this.routing_detail_data = [];
  this.routing_detail_resource_data = [];
  this.tree_data_json = [];
  this.live_tree_view_data = [];
}

reset_model() {
  this.routing_header_data.modal_id = "";
  this.routing_header_data.modal_code = "";
  this.routing_header_data.modal_description = "";
  this.routing_header_data.warehouse_id = "";
  this.routing_header_data.warehouse_code = "";
  this.routing_header_data.default_batch_size = 1;
  this.routing_header_data.default_lot_size = 1;
  this.routing_header_data.applicable_bom_unit = 1;
  this.routing_detail_data = [];
  this.routing_detail_resource_data = [];
  this.routing_header_data.use_mtq_in_planing = false;
  $("#use_mtq_in_planing").prop('checked', false);
  this.routing_header_data.opm_num_format = 1;
  this.routing_header_data.use_template_routing = false;
  $("#use_template_routing").prop('checked', false);
  this.routing_header_data.template_routing_id = "";
  this.routing_header_data.template_routing_code = "";
  this.tree_data_json = [];
  this.live_tree_view_data = [];
}

header_numeric_input_change(value, input_id) {
  this.made_changes = true;
  if (value == 0 && value != '') {
    value = 1;
    this.routing_header_data[input_id] = (value);
    this.toastr.error('', this.language.valuezerovalid + ' ' + this.language.in + ' ' + this.language[input_id], this.commonData.toast_config);
  }
  else {
    let rgexp = /^\d+$/;
    if (isNaN(value) == true) {
      value = 1;
      this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
    } else if (value == 0 || value == '' || value == null || value == undefined) {
      value = 1;
      this.toastr.error('', this.language.blank_or_zero_allowed + ' ' + this.language.in + ' ' + this.language[input_id], this.commonData.toast_config);
    } else if (value < 0) {
      value = 1;
      this.toastr.error('', this.language.negativevalid + ' ' + this.language.in + ' ' + this.language[input_id], this.commonData.toast_config);
    } 

    if(input_id == 'opm_num_format'){
      if (rgexp.test(value) == false) {
        value = 1;
        this.toastr.error('', this.language.decimalvalid + ' ' + this.language.in + ' ' + this.language[input_id], this.commonData.toast_config);
      }   
    }
    
    
    if(input_id == "default_batch_size" ){
      this.routing_header_data['default_lot_size'] = (value);
    } else {
      this.routing_header_data[input_id] = (value);
    }
  }

  if(input_id == "default_batch_size" ){
    $('#default_lot_size').val(value);
  } else {
    $('#' + input_id).val(value);
  }
}

ClearOperLineOnWarehouse() {
  if (this.routing_detail_data.length > 0) {
    for (let lookup_change_index = 0; lookup_change_index < this.routing_detail_data.length; lookup_change_index++) {
      this.routing_detail_data[lookup_change_index].oper_id = '';
      this.routing_detail_data[lookup_change_index].oper_code = '';
      this.routing_detail_data[lookup_change_index].oper_desc = '';
      this.routing_detail_data[lookup_change_index].oper_type = '';
      this.routing_detail_data[lookup_change_index].oper_consumption_method = '';
      this.routing_detail_data[lookup_change_index].oper_consumption_method_str = '';
      this.routing_detail_data[lookup_change_index].wc_id = '';
      this.routing_detail_data[lookup_change_index].wc_code = '';
      this.routing_detail_data[lookup_change_index].mtq = '1';
      this.routing_detail_data[lookup_change_index].count_point_operation = false;
      this.routing_detail_data[lookup_change_index].auto_move = false;
      this.routing_detail_data[lookup_change_index].queue_time = '00:00';
      this.routing_detail_data[lookup_change_index].move_time = '00:00';
      this.routing_detail_data[lookup_change_index].qc_time = '00:00';
      this.routing_detail_data[lookup_change_index].time_uom = '1';
    }
  }
}

getLookupValue($event) {

  console.log('in getLookupValue' + 'lookup for - ' + this.lookupfor, $event);
  if (this.lookupfor == 'feature_lookup') {
    this.routing_header_data.feature_id = $event[0];
    this.routing_header_data.feature_code = $event[1];
    this.routing_header_data.feature_description = $event[2];
    this.made_changes = true;
    this.GetDataByFeatureId($event[0], "header", 0);
  }

  if (this.lookupfor == 'ModelBom_lookup') {
    this.routing_header_data.modal_id = $event[0];
    this.routing_header_data.modal_code = $event[1];
    this.routing_header_data.modal_description = $event[2];
    this.made_changes = true;
    this.GetDataByModelId($event[0], "header", 0);
  }

  if (this.lookupfor == 'warehouse_lookup') {
    this.routing_header_data.warehouse_id = $event[0];
    this.routing_header_data.warehouse_code = $event[0];
    this.made_changes = true;
    this.ClearOperLineOnWarehouse();
  }

  if (this.lookupfor == 'operation_lookup') {
    this.made_changes = true;
    let res_cnsmtn_mthd = this.commonData.res_consumption_method();
    this.routing_detail_data[this.current_grid_action_row].count_point_operation = false;
    this.routing_detail_data[this.current_grid_action_row].count_point_operation_disabled = false;
    this.routing_detail_data[this.current_grid_action_row].auto_move = false;

    this.routing_detail_data[this.current_grid_action_row].oper_id = $event[0];
    this.routing_detail_data[this.current_grid_action_row].oper_code = $event[1];
    this.routing_detail_data[this.current_grid_action_row].oper_desc = $event[2];
    this.routing_detail_data[this.current_grid_action_row].oper_type = $event[3];
    this.routing_detail_data[this.current_grid_action_row].wc_id = $event[5];
    this.routing_detail_data[this.current_grid_action_row].wc_code = $event[5];
    this.routing_detail_data[this.current_grid_action_row].mtq = $event[9];
    this.routing_detail_data[this.current_grid_action_row].oper_consumption_method = $event[8];
    this.routing_detail_data[this.current_grid_action_row].oper_consumption_method_str = res_cnsmtn_mthd[$event[8]];
    let obj = this;

    this.new_tree_item(this.routing_detail_data[this.current_grid_action_row].type, this.routing_detail_data[this.current_grid_action_row].oper_code, this.routing_detail_data[this.current_grid_action_row], this.routing_detail_data[this.current_grid_action_row].rowindex);


    if ($event[3] == '4' || $event[3] == '5') {

      this.routing_detail_data[this.current_grid_action_row].count_point_operation = true;
      this.routing_detail_data[this.current_grid_action_row].count_point_operation_disabled = true;
    }

    this.getOperationResourceDetail(this.routing_detail_data[this.current_grid_action_row].oper_id, this.routing_detail_data[this.current_grid_action_row].oper_code, this.routing_detail_data[this.current_grid_action_row].oper_type, this.routing_detail_data[this.current_grid_action_row].oper_consumption_method, this.current_grid_action_row, this.routing_detail_data[this.current_grid_action_row].unique_key, function () {
      // obj.current_grid_action_row = 0;
    });
  }

  if (this.lookupfor == "workcenter_lookup") {
    this.made_changes = true;
    this.routing_detail_data[this.current_grid_action_row].wc_id = $event[2];
    this.routing_detail_data[this.current_grid_action_row].wc_code = $event[2];
    //  this.current_grid_action_row = 0;
  }

  if (this.lookupfor == "routing_resource_lookup") {
    this.made_changes = true;
    let temp_array = [];
    let pollcounter = 1;
    for (let i = 0; i < $event.length; ++i) {
      console.log("$event[i] ", $event[i]);
      if ($event[i].resource_code != undefined) {
        let Lineid;
        if ($event[i].LineID == undefined || $event[i].LineID == '') {
          Lineid = pollcounter;
        } else {
          Lineid = $event[i].LineID;
        }
        temp_array.push({
          lineno: pollcounter,
          rowindex: pollcounter,
          ChrgBasis: $event[i].ChrgBasis,
          DCNum: $event[i].DCNum,
          LineID: Lineid,
          OPRCode: $event[i].operation_no,
          ResCode: $event[i].resource_code,
          ResName: $event[i].resource_name,
          ResType: $event[i].resource_type,
          ResUOM: $event[i].resource_uom,
          ResCons: ($event[i].resource_consumption).toString(),
          ResInv: ($event[i].resource_inverse).toString(),
          ResUsed: $event[i].no_resource_used,
          TimeUOM: $event[i].time_uom,
          TimeCons: ($event[i].time_consumption).toString(),
          TimeInv: ($event[i].time_inverse).toString(),
          oper_consumption_method: ($event[i].oper_consumption_method),
          oper_consumption_type: ($event[i].oper_consumption_method),
          resource_consumption_type: ($event[i].resource_consumption_type),
          basis: $event[i].resource_basic,
          schedule: ($event[i].schedule),
          is_resource_disabled: true,
          unique_key: $event[i].unique_key,
        });
      }
      pollcounter++;
    }
    console.log("temp_array- ", temp_array);
    if (temp_array.length > 0) {
      this.routing_detail_resource_data[(this.current_selected_row.rowindex - 1)] = temp_array;
    }
  }

  if (this.lookupfor == "template_routing_lookup") {
    this.made_changes = true;
    this.routing_header_data.template_routing_id = $event[0];
    this.routing_header_data.template_routing_code = $event[0];
  }

  let obj = this;
  setTimeout(() => {
    obj.lookupfor = "";
  });
  console.log("this.routing_detail_resource_data - ", this.routing_detail_resource_data);
}

resequence_operation(type) {  // type = 1 : up & type = 2 : down
  this.made_changes = true;
  console.log("this.current_selected_row", this.current_selected_row);
  // let current_row_index = this.current_selected_row.rowindex - 1;
  let row_c_select = this.current_selected_row.rowindex;
  let current_row_index = this.routing_detail_data.findIndex(function (obj) {
    return obj.rowindex == row_c_select;
  });
  this.row_selection = [];
  if (type == '1') {
    let prev_row_index = current_row_index - 1;
    if (this.routing_detail_data[prev_row_index] != undefined) { // && this.routing_detail_data[prev_row_index].length > 0
      let row_index = this.routing_detail_data[current_row_index].rowindex;
      let lineno = this.routing_detail_data[current_row_index].lineno;

      this.routing_detail_data[current_row_index].rowindex = this.routing_detail_data[prev_row_index].rowindex;
      this.routing_detail_data[current_row_index].lineno = this.routing_detail_data[prev_row_index].lineno;

      this.routing_detail_data[prev_row_index].rowindex = row_index;
      this.routing_detail_data[prev_row_index].lineno = lineno;

      var temp_swap = this.routing_detail_data[current_row_index];
      this.routing_detail_data[current_row_index] = this.routing_detail_data[prev_row_index];
      this.routing_detail_data[prev_row_index] = temp_swap;
      this.row_selection = [this.routing_detail_data[prev_row_index].rowindex];
      this.current_selected_row = this.routing_detail_data[prev_row_index];
    }
  } else if (type == '2') {
    let next_row_index = current_row_index + 1;
    
    if (this.routing_detail_data[next_row_index] != undefined) { // && this.routing_detail_data[next_row_index].length > 0
      let row_index = this.routing_detail_data[current_row_index].rowindex;
      let lineno = this.routing_detail_data[current_row_index].lineno;

      this.routing_detail_data[current_row_index].rowindex = this.routing_detail_data[next_row_index].rowindex; // this.routing_detail_data[current_row_index].rowindex + 1;
      this.routing_detail_data[current_row_index].lineno = this.routing_detail_data[next_row_index].lineno;

      this.routing_detail_data[next_row_index].rowindex = row_index;
      this.routing_detail_data[next_row_index].lineno =lineno;

      var temp_swap = this.routing_detail_data[current_row_index];
      this.routing_detail_data[current_row_index] = this.routing_detail_data[next_row_index];
      this.routing_detail_data[next_row_index] = temp_swap;
      this.row_selection = [this.routing_detail_data[next_row_index].rowindex];
      this.current_selected_row = this.routing_detail_data[next_row_index];
    }
    
    console.log("this.row_selection", this.row_selection);
    console.log("this.current_selected_row", this.current_selected_row);
  }
}

getSelectedRowDetail(event) {
  if (event.selectedRows.length > 0) {
    this.current_selected_row = event.selectedRows[0].dataItem;
  } else {
    this.current_selected_row = [];
  }
}


openFeatureLookup(flag) {
  this.made_changes = true;
  this.showLookupLoader = true;
  console.log('inopen feature');
  this.serviceData = []
  this.lookupfor = 'feature_lookup';
  this.service.getFeatureList().subscribe(
    data => {
      if (data != undefined) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
        }
      }
      if (data.length > 0) {
        this.showLookupLoader = false;
        this.serviceData = data;
        console.log(this.serviceData);
        var objss = this;
        var language = this.language;
        this.serviceData.filter(function(obj){
          if(obj.OPTM_ACCESSORY == "Y") {
              obj.OPTM_ACCESSORY = language.YES;
          } else if(obj.OPTM_ACCESSORY == "N") {
              obj.OPTM_ACCESSORY = language.NO;
          }
        })
      }
      else {
        this.lookupfor = "";
        this.serviceData = [];
        this.clearInvalidfeature();
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }
    },
    error => {
      this.showLookupLoader = false;
      this.serviceData = [];
      this.lookupfor = "";
      this.clearInvalidfeature();
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
      return;
    }
    )

}

openModalLookup(flag) {
  this.made_changes = true;
  this.showLookupLoader = true;
  this.serviceData = []
  this.service.GetModelList().subscribe(
    data => {

      if (data != undefined) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
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
        this.clearInvalidModel();
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }
    },
    error => {
      this.showLookupLoader = false;
      this.clearInvalidModel();
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
      return;
    }
    )
}

clearInvalidfeature() {
  this.routing_header_data.feature_id = '';
  this.routing_header_data.feature_code = '';
  this.routing_header_data.feature_description = '';
  this.routing_detail_data = [];
  this.live_tree_view_data = [];
  this.tree_data_json = [];

}

clearInvalidModel() {
  this.routing_header_data.modal_id = '';
  this.routing_header_data.modal_code = '';
  this.routing_header_data.modal_description = "";
  this.routing_detail_data = [];
  this.live_tree_view_data = [];
  this.tree_data_json = [];

}

getFeatureDetail(feature_code) {
  this.made_changes = true;
  this.showLookupLoader = true;
  this.service.getFeatureDetail(feature_code).subscribe(
    data => {
      console.log(data);
      if (data != null) {
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route, 'Sessionout');
              this.showLookupLoader = false;
              return;
            }
          }
        }
        if (data.length > 0) {
          this.routing_header_data.feature_id = data[0].FeatureId;
          this.routing_header_data.feature_code = data[0].FeatureCode;
          this.routing_header_data.feature_description = data[0].DisplayName
          this.GetDataByFeatureId(this.routing_header_data.feature_id, 'header', 0);
        } else {
          this.clearInvalidfeature();
          this.toastr.error('', this.language.InvalidFeatureCode, this.commonData.toast_config);
          this.showLookupLoader = false;
          return;
        }
      } else {
        this.clearInvalidfeature();
        this.toastr.error('', this.language.InvalidFeatureCode, this.commonData.toast_config);
        this.showLookupLoader = false;
        return;
      }
    }, error => {
      this.clearInvalidfeature();
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
      this.showLookupLoader = false;
      return;
    }
    );
}

getModalDetail(model_code) {
  this.made_changes = true;
  this.showLookupLoader = true;
  this.service.getModalDetail(model_code).subscribe(
    data => {
      console.log(data);
      if (data != null) {
        if (data.length > 0) {
          this.routing_header_data.modal_id = data[0].ModelId;
          this.routing_header_data.modal_code = data[0].ModelCode;
          this.routing_header_data.modal_description = data[0].DisplayName;
          this.GetDataByModelId(this.routing_header_data.modal_id, 'header', 0);
        } else {

          this.clearInvalidModel();
          this.toastr.error('', this.language.InvalidModelCode, this.commonData.toast_config);
          this.showLookupLoader = false;
          return;
        }
      } else {
        this.clearInvalidModel();
        this.toastr.error('', this.language.InvalidModelCode, this.commonData.toast_config);
        this.showLookupLoader = false;
        return;
      }
    }, error => {
      this.clearInvalidModel();
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
      this.showLookupLoader = false;
      return;
    }
    );
}



GetDataByFeatureId(feature_code, press_location, index) {
  this.routing_detail_data = [];
  this.tree_data_json = [];
  this.live_tree_view_data = [];
  if (press_location == 'header') {
    this.showLookupLoader = true;
    this.service.GetDataByFeatureId(feature_code).subscribe(
      data => {
        console.log(data);
        if (data != undefined && data.LICDATA != undefined) {
          if (data.LICDATA[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
        }

        if (data.FeatureDetail.length > 0) {

          let temp = new Date(this.routing_header_data.EffectiveDate);
          let temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
          for (let i = 0; i < data.FeatureDetail.length; ++i) {
            let featuredata = data.FeatureDetail[i];
            let value = '';
            let value_code = '';
            let desc = '';
            this.counter = 0;
            if (this.routing_detail_data.length > 0) {
              this.counter = this.routing_detail_data.length
            }
            this.counter++;

            let open_allow = true;
            let open_allow_show = true;
            if (featuredata.OPTM_TYPE == 1) {
              value = (featuredata.OPTM_CHILDFEATUREID).toString();
              value_code = featuredata.child_code;
              if (featuredata.OPTM_ACCESSORY == 'Y' || featuredata.OPTM_ACCESSORY == 'y') {
                open_allow = false;
                open_allow_show = false
              }
            } else if (featuredata.OPTM_TYPE == 2) {
              value = (featuredata.OPTM_ITEMKEY).toString();
              value_code = featuredata.OPTM_ITEMKEY;
            } else if (featuredata.OPTM_TYPE == 3) {
              value = (featuredata.OPTM_VALUE).toString();
              value_code = featuredata.OPTM_VALUE;
              open_allow = false;
              open_allow_show = false;
            }
            desc = featuredata.OPTM_DISPLAYNAME;
            this.routing_detail_data.push({
              lineno: this.counter,
              rowindex: this.counter,
              type: featuredata.OPTM_TYPE,
              type_value: (value),
              type_value_code: (value_code).toString(),
              description: desc,
              operation_top_level: false,
              oper_id: '',
              oper_code: '',
              oper_desc: '',
              oper_type: '',
              oper_consumption_method: '',
              oper_consumption_method_str: '',
              wc_id: '',
              wc_code: '',
              mtq: '1',
              count_point_operation: false,
              auto_move: false,
              effective_date: temp_effective_date,
              queue_time: '00:00',
              move_time: '00:00',
              qc_time: '00:00',
              time_uom: '1',
              opn_application: open_allow,
              isTypeDisabled: true,
              showOperationbtn: false,
              count_point_operation_disabled: false,
              inc_lead_time_calc: false,
              isOpenApplicableVisible: open_allow_show,
              unique_key: this.commonData.random_string(55)
            });
          }
          this.showLookupLoader = false;
        } else {
          this.showLookupLoader = false;
          this.clearInvalidfeature();
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        }
      }, error => {
        this.showLookupLoader = false;
        this.clearInvalidfeature();
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return;
      });
  }
}

GetDataByModelId(modal_code, press_location, index) {
  this.routing_detail_data = [];
  this.tree_data_json = [];
  this.live_tree_view_data = [];
  if (press_location == 'header') {
    this.showLookupLoader = true;
    this.service.GetDataByModelId(modal_code).subscribe(
      data => {
        if (data != undefined && data.LICDATA != undefined) {
          if (data.LICDATA[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
        }
        console.log(data);
        if (data.ModelDetail.length > 0) {
          for (let i = 0; i < data.ModelDetail.length; ++i) {
            let modeldata = data.ModelDetail[i];
            let value = '';
            let value_code = '';
            let desc = '';
            this.counter = 0;
            if (this.routing_detail_data.length > 0) {
              this.counter = this.routing_detail_data.length
            }
            this.counter++;
            let temp = new Date(this.routing_header_data.EffectiveDate);
            let temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
            let open_allow = true;
            let open_allow_show = true;

            if (modeldata.OPTM_TYPE == 1) {
              value = (modeldata.OPTM_FEATUREID).toString();
              value_code = modeldata.feature_code;
              console.log('in here ', modeldata.OPTM_TYPE, 'vlaue ', value_code, ' accessory ', modeldata.Accessory);
              if (modeldata.Accessory == 'Y' || modeldata.Accessory == 'y') {
                open_allow = false;
                open_allow_show = false;
              }

            } else if (modeldata.OPTM_TYPE == 2) {
              value = (modeldata.OPTM_ITEMKEY).toString();
              value_code = modeldata.OPTM_ITEMKEY;
            } else if (modeldata.OPTM_TYPE == 3) {
              value = (modeldata.OPTM_CHILDMODELID).toString();
              value_code = modeldata.child_code;
            }
            desc = modeldata.OPTM_DISPLAYNAME;
            this.routing_detail_data.push({
              lineno: this.counter,
              rowindex: this.counter,
              type: modeldata.OPTM_TYPE,
              type_value: (value),
              type_value_code: (value_code).toString(),
              description: desc,
              operation_top_level: '',
              oper_id: '',
              oper_code: '',
              oper_desc: '',
              oper_type: '',
              oper_consumption_method: '',
              oper_consumption_method_str: '',
              wc_id: '',
              wc_code: '',
              mtq: '1',
              count_point_operation: false,
              auto_move: false,
              effective_date: temp_effective_date,
              queue_time: '00:00',
              move_time: '00:00',
              qc_time: '00:00',
              time_uom: '1',
              opn_application: open_allow,
              isTypeDisabled: true,
              showOperationbtn: false,
              count_point_operation_disabled: false,
              inc_lead_time_calc: false,
              isOpenApplicableVisible: open_allow_show,
              unique_key: this.commonData.random_string(55)
            });

              /*  let icon_type = { "2": "item", "1": "feature", "3": "modal", "4": "operation" };
              if (this.live_tree_view_data.length == 0){
                this.live_tree_view_data.push({
                  "parentId": this.routing_header_data.modal_id, "parentNumber": this.routing_header_data.modal_code,  "tree_index": this.tree_data_json.length, "icon": icon_type[modeldata.OPTM_TYPE], "branchType": icon_type[modeldata.OPTM_TYPE], "component": "", "componentNumber": "", "operation_no": "", "current_row_index": this.counter
                });
              }
              this.live_tree_view_data.push({
                "parentId": this.routing_header_data.modal_id, "parentNumber": this.routing_header_data.modal_code, "tree_index": this.tree_data_json.length, "icon": icon_type[modeldata.OPTM_TYPE], "branchType": icon_type[modeldata.OPTM_TYPE], "component": value_code, "componentNumber": value, "operation_no": "", "current_row_index": this.counter
              }); */

            }
            this.showLookupLoader = false;
          } else {
            this.showLookupLoader = false;
            this.clearInvalidModel();
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);

          }
        }, error => {
          this.showLookupLoader = false;
          this.clearInvalidModel();
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commonService.isUnauthorized();
          } else {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          }
          return;
        });
} else {

}
}

clearInvalidWarehouse() {
  this.routing_header_data.warehouse_code = '';
  this.toastr.error('', this.language.InvalidWHCode, this.commonData.toast_config);
}

openWarehouseLook(flag) {
  this.made_changes = true;
  this.showLookupLoader = true;
  this.serviceData = []
  this.service.getWarehouseList().subscribe(
    data => {
      if (data != undefined) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
        }
      }
      if (data.length > 0) {
        this.lookupfor = 'warehouse_lookup';
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
    },
    error => {
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
      return;
    }
    )
}

getWarehouseDetails(warehouse_code) {
  this.showLookupLoader = true;
  this.ClearOperLineOnWarehouse();
  this.service.getWarehouseDetail(warehouse_code).subscribe(
    data => {
      console.log(data);
      if (data != null) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
          this.routing_header_data.warehouse_code = warehouse_code;
          this.showLookupLoader = false;
        } else {
          this.clearInvalidWarehouse();
          this.showLookupLoader = false;
          return;
        }
      } else {
        this.clearInvalidWarehouse();
        this.showLookupLoader = false;
        return;
      }
    }, error => {
      this.clearInvalidWarehouse();
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      }
      return;
    }
    );
}

openTemplateRoutingLookup(flag) {
this.made_changes = true;
  this.showLookupLoader = true;
  this.serviceData = []
  this.service.TemplateRoutingList().subscribe(
    data => {
      if (data != undefined) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
        }
      }
      if (data.length > 0) {
        this.lookupfor = 'template_routing_lookup';
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
    },
    error => {
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
      return;
    }
    )

}

clearInvalidTemplateRouting() {
  this.routing_header_data.template_routing_id = "";
  this.routing_header_data.template_routing_code = "";
  this.toastr.error('', this.language.invalid_template_routing_code, this.commonData.toast_config);
}

getTemplateRoutingDetails(template_code) {
  this.showLookupLoader = true;
  this.service.TemplateRoutingDetail(template_code).subscribe(
    data => {
      console.log(data);
      if (data != null) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
          this.routing_header_data.template_routing_id = data[0].ITEMCODE;
          this.routing_header_data.template_routing_code = data[0].ITEMCODE;
          this.showLookupLoader = false;
        } else {
          this.clearInvalidTemplateRouting();
          this.showLookupLoader = false;
          return;
        }
      } else {
        this.clearInvalidTemplateRouting();
        this.showLookupLoader = false;
        return;
      }
    },
    error => {
      this.showLookupLoader = false;
      this.clearInvalidTemplateRouting();
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      }
      return;
    });
}

on_type_click_lookup(type, rowindex) {
  this.made_changes = true;
  this.showLookupLoader = true;
  this.serviceData = [];
  this.showLookupLoader = false;
}

open_operation_lookup(type, rowindex) {
this.made_changes = true;
  this.serviceData = [];
  if (this.routing_header_data.warehouse_code == "" || this.routing_header_data.warehouse_code == null || this.routing_header_data.warehouse_code == undefined) {
    this.toastr.error('', this.language.noselectWarehouse, this.commonData.toast_config);
    return;
  }

  this.showLookupLoader = true;
  this.service.getOperationList(this.routing_header_data.warehouse_code).subscribe(
    data => {
      if (data != undefined) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
        }
      }
      if (data.length > 0) {
        this.current_grid_action_row = this.getGridCurrentRow(rowindex);
        this.lookupfor = 'operation_lookup';
        this.showLookupLoader = false;
        let temp_data_arr = [];
        let res_oper_type = this.commonData.operation_type();
        for (var ii = 0; ii < data.length; ii++) {
          data[ii].operTypeStr = res_oper_type[data[ii].OPRType];
          temp_data_arr.push(data[ii]);

        }
        console.log(temp_data_arr);
        this.serviceData = temp_data_arr;

      }
      else {
        this.lookupfor = "";
        this.serviceData = [];
        this.showLookupLoader = false;
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }
    },
    error => {
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
      }
      return;
    }
    )
}

open_wc_lookup(type, rowindex) {
  this.serviceData = [];
this.made_changes = true;
  if (this.routing_header_data.warehouse_code == "" || this.routing_header_data.warehouse_code == null || this.routing_header_data.warehouse_code == undefined) {
    this.toastr.error('', this.language.noselectWarehouse, this.commonData.toast_config);
    return;
  }

  this.showLookupLoader = true;
  this.service.getWCList(this.routing_header_data.warehouse_code).subscribe(
    data => {
      if (data != undefined) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            this.showLookupLoader = false;
            return;
          }
        }
      }
      if (data.length > 0) {
        this.current_grid_action_row = this.getGridCurrentRow(rowindex);
        this.lookupfor = 'workcenter_lookup';
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
    },
    error => {
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
      }
      return;
    }
    )
}

getOperationResourceDetail(oper_id, oper_code, oper_type, oper_consumption_type, rowindex, operation_line_unique_key, callback) {
  this.showLookupLoader = true;
  if (this.routing_detail_resource_data[rowindex] == undefined || this.routing_detail_resource_data[rowindex].length > 0) {
    this.routing_detail_resource_data[rowindex] = [];
  }
  this.service.getOperationResource(oper_id).subscribe(
    data => {
      this.showLookupLoader = false;
      if (data != undefined) {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
            this.commonService.RemoveLoggedInUser().subscribe();
            this.commonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
        }
      }
      if (data != undefined && data != '') {
        if (data.length > 0) {
          let operData = [];
          let localhcounter = 1;
          let basis = '1';
          let is_basis_disabled = false;
          if (oper_consumption_type == '1' || oper_consumption_type == 1) { // setup 
            basis = '4';
            is_basis_disabled = true;
          }

          if (oper_consumption_type == '2' || oper_consumption_type == 2) { // variable
            basis = '1';
            is_basis_disabled = false;
          }

          if (oper_consumption_type == '3' || oper_consumption_type == 3) { // Fixed
            basis = '1';
            is_basis_disabled = false;
          }
          for (let i = 0; i < data.length; ++i) {



            data[i].OPRCode = oper_code;
            data[i].lineno = localhcounter;
            data[i].rowindex = localhcounter;
            data[i].unique_key = operation_line_unique_key;
            data[i].ResCode = data[i].ResCode;

            data[i].ResName = data[i].ResName;
            data[i].ResType = data[i].ResType;
            data[i].ResUOM = data[i].ResUOM;
            data[i].ResCons = (data[i].ResCons).toString();
            data[i].ResInv = (data[i].ResInv).toString();
            data[i].ResUsed = data[i].ResUsed;
            data[i].TimeUOM = data[i].TimeUOM
            data[i].TimeCons = (data[i].TimeCons).toString();
            data[i].TimeInv = (data[i].TimeInv).toString();
            data[i].resource_consumption_type = oper_consumption_type;
            data[i].basis = data[i].ChrgBasis;
            data[i].schedule = false,
            data[i].oper_consumption_method = oper_consumption_type;
            data[i].oper_type = oper_type;

            operData.push(data[i]);
            localhcounter++;
          }
          this.routing_detail_resource_data[rowindex] = operData;
        }
      }
      if (callback != "" || callback !== undefined) {
        callback();
      }
    },
    error => {
      this.showLookupLoader = false;
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commonService.isUnauthorized();
      } else {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
      if (callback != "" || callback !== undefined) {
        callback();
      }
      return;
    }
    );
}

open_operation_resources(flag) {
  this.made_changes = true;
  if (Object.keys(this.current_selected_row).length > 0) {
    if (this.current_selected_row.oper_code != "") {
      this.showLookupLoader = true;
      // service call for operation wise resource 
      this.serviceData = [];
        /*  this.service.getOperationResource(this.current_selected_row.oper_code).subscribe(
        data => { */
          this.serviceData.oper_code = this.current_selected_row.oper_code;
          this.serviceData.wc_code = this.current_selected_row.wc_code;
          this.serviceData.unique_key = this.current_selected_row.unique_key;
          this.serviceData.oper_res = (this.routing_detail_resource_data[(this.current_selected_row.rowindex - 1)] != undefined) ? this.routing_detail_resource_data[(this.current_selected_row.rowindex - 1)] : [];
          this.lookupfor = 'routing_resource_lookup';
          this.showLookupLoader = false;


          this.showLookupLoader = false;
        } else {
          this.toastr.info('', this.language.Operationcodemissing + ' ' + this.current_selected_row.rowindex, this.commonData.toast_config);
          return;
        }

      } else {
        this.toastr.info('', this.language.select_atleast_oper, this.commonData.toast_config);
        return;
      }
    }

    changeEffectiveDate(picker_date) {
      this.made_changes = true;
      let temp = new Date(picker_date);
      this.routing_header_data.EffectiveDate = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
      this.over_ride_grid_effective_date()

    }

    confirm_override_grid_effective_date() {
      this.made_changes = true;
      this.dialog_params.push({ 'dialog_type': 'confirmation', 'message': this.language.confirm_override_detials_effective_date });
      this.show_dialog = true;
    }

    //This will take confimation box value
    get_dialog_value(userSelectionValue) {
this.made_changes = true;
      if (this.is_delete_called == true) {
        if (userSelectionValue == true) {
          this.onDelete(this.update_id);
        }
        this.show_dialog = false;
        this.is_delete_called = false;
      } else {
        console.log('in get_dialog_value', userSelectionValue);
        if (userSelectionValue == true) {
          this.over_ride_grid_effective_date();
        }
        this.show_dialog = false;

      }

    }

    over_ride_grid_effective_date() {
      console.log('in over_ride_grid_effective_date');
      let temp = new Date(this.routing_header_data.EffectiveDate);
      let temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
      // let temp_effective_date = new Date(temp.getFullYear(), (temp.getMonth()), temp.getDate());
      for (let i = 0; i < this.routing_detail_data.length; ++i) {
        this.routing_detail_data[i].effective_date = temp_effective_date;
      }
    }

    validate_header_info() {
      var output: any = '1';
      if (this.routing_header_data.routing_for == 'feature') {
        if (this.routing_header_data.feature_code == "" || this.routing_header_data.feature_code == undefined || this.routing_header_data.feature_code == null) {
          this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
          output = '0';
        }
      } else if (this.routing_header_data.routing_for == 'model') {
        if (this.routing_header_data.modal_code == "" || this.routing_header_data.modal_code == undefined || this.routing_header_data.modal_code == null) {
          this.toastr.error('', this.language.ModelCodeBlank, this.commonData.toast_config);
          output = '0';
        } else {
          if (this.routing_header_data.warehouse_code == "" || this.routing_header_data.warehouse_code == undefined || this.routing_header_data.warehouse_code == null) {
            this.toastr.error('', this.language.warehouseCodeBlank, this.commonData.toast_config);
            output = '0';
          }
        }
      }
      return output;
    }


    insert_new_operation(type) { // type = insert || type = add
      if (this.validate_header_info() == '0') {
        return false;
      }
      this.made_changes = true;
      this.counter = 0;
      if (this.routing_detail_data.length > 0) {
        this.counter = this.routing_detail_data.length
      }
      this.counter++;

      if (type == 'add') {
        this.current_selected_row = [];
        this.row_selection = [];
      }

      let current_row_index = 0;
      if (type == 'insert') {
        current_row_index = this.current_selected_row.rowindex;
        this.counter = current_row_index + 1;
        let row_shift_counter = 0;
        for (let i = 0; i < this.routing_detail_data.length; ++i) {
          if (this.routing_detail_data[i].rowindex > current_row_index) {
            this.routing_detail_data[i].rowindex = this.routing_detail_data[i].rowindex + 1;
            this.routing_detail_data[i].lineno = this.routing_detail_data[i].lineno + 1;
          }
        }
      }


      let temp_d = new Date(this.routing_header_data.EffectiveDate);
      let temp_effective_date = new Date((temp_d.getMonth() + 1) + '/' + temp_d.getDate() + '/' + temp_d.getFullYear());
      let new_row = {
        lineno: this.counter,
        rowindex: this.counter,
        type: '4',
        type_value: "",
        type_value_code: "",
        description: '',
        operation_top_level: '',
        oper_id: '',
        oper_code: '',
        oper_desc: '',
        oper_type: '',
        oper_consumption_method: '',
        wc_id: '',
        wc_code: '',
        mtq: '1',
        count_point_operation: false,
        auto_move: false,
        effective_date: temp_effective_date,
        queue_time: '00:00',
        move_time: '00:00',
        qc_time: '00:00',
        time_uom: '1',
        opn_application: true,
        isTypeDisabled: true,
        showOperationbtn: true,
        isOpenApplicableVisible: false,
        count_point_operation_disabled: false,
        inc_lead_time_calc: false,
        unique_key: this.commonData.random_string(55)
      };

      if (type == 'add') {
        this.routing_detail_data.push(new_row);
      }

      if (type == 'insert') {
        this.routing_detail_data.splice(current_row_index, 0, new_row);
        // this.routing_detail_data[current_row_index] = new_row;
      }

    }

    getGridCurrentRow(rowindex) {
      let currentrow = 0;
      if (this.routing_detail_data.length > 0) {
        for (let i = 0; i < this.routing_detail_data.length; ++i) {
          if (this.routing_detail_data[i].rowindex === rowindex) {
            currentrow = i;
          }
        }
      }
      return currentrow
    }

    clearInvalidOperationData(currentrow) {

      if (this.routing_detail_resource_data[currentrow] != undefined) {
        this.routing_detail_resource_data[currentrow] = [];
      }
      this.routing_detail_data[currentrow].oper_id = "";
      this.routing_detail_data[currentrow].oper_code = "";
      this.routing_detail_data[currentrow].oper_desc = "";
      this.routing_detail_data[currentrow].oper_type = "";
      this.routing_detail_data[currentrow].oper_consumption_method = "";
      this.routing_detail_data[currentrow].oper_consumption_method_str = "";
      this.routing_detail_data[currentrow].count_point_operation = false;
      this.routing_detail_data[currentrow].count_point_operation_disabled = false;
      $(".row_oper_id").eq(currentrow).val("");
      $(".row_oper_code").eq(currentrow).val("");
      this.routing_detail_data[currentrow].wc_id = "";
      this.routing_detail_data[currentrow].wc_code = "";
      $(".row_wc_id").eq(currentrow).val("");
      $(".row_wc_code").eq(currentrow).val("");
    }

    new_tree_item(type, operation_code, currentrow_data, rowindex) {
      let icon_type = { "item": "item", "feature": "feature", "model": "modal", "operation": "operation" };
      if (type == '4') {
        let update_data: any = this.tree_data_json.filter(function (obj) {
          return (obj.current_row_index == rowindex) ? obj : "";
        });

        if (update_data == "-1" || update_data == "") {
          this.live_tree_view_data.push({
            "operation_no": operation_code, "tree_index": this.tree_data_json.length, "icon": "operation", "branchType": "operation", "component": "", "componentNumber": "", "current_row_index": rowindex
          });
        } else {
          this.live_tree_view_data.push({
            "operation_no": operation_code, "tree_index": update_data[0].tree_index, "icon": "operation", "branchType": "operation", "component": "", "componentNumber": "", "current_row_index": rowindex
          });
        }
      } else {
        let update_data: any = this.tree_data_json.filter(function (obj) {
          return (obj.componentNumber == currentrow_data.type_value) ? obj : "";
        });


        if (update_data == "-1" || update_data == "") {
          this.live_tree_view_data.push({
            "operation_no": operation_code, "tree_index": this.tree_data_json.length, "icon": icon_type[currentrow_data.selected_type], "branchType": icon_type[currentrow_data.selected_type], "component": currentrow_data.description, "componentNumber": currentrow_data.type_value, "current_row_index": rowindex
          });
        } else {
          this.live_tree_view_data.push({
            "operation_no": operation_code, "tree_index": update_data[0].tree_index, "icon": icon_type[currentrow_data.selected_type], "branchType": icon_type[currentrow_data.selected_type], "component": currentrow_data.description, "componentNumber": currentrow_data.type_value, "current_row_index": rowindex
          });
        }

      }


    }

    on_input_change(value, rowindex, grid_element) {
      this.made_changes = true;
      let currentrow = 0;
      currentrow = this.getGridCurrentRow(rowindex);
      if (grid_element == 'selected_type') {
        this.routing_detail_data[currentrow].selected_type = value;
      }

      if (grid_element == 'type_value_code') {
        this.routing_detail_data[currentrow].type_value_code = (value).toString();
      }

      if (grid_element == 'description') {
        this.routing_detail_data[currentrow].description = value;
      }

      if (grid_element == 'oper_top_level') {
        this.routing_detail_data[currentrow].oper_top_level = value;
        this.routing_detail_data[currentrow].operation_top_level = value;
      }

      if (grid_element == 'oper_code') {
        this.showLookupLoader = true;
        this.routing_detail_data[this.current_grid_action_row].count_point_operation = false;
        this.routing_detail_data[this.current_grid_action_row].count_point_operation_disabled = false;
        this.routing_detail_data[this.current_grid_action_row].auto_move = false;
        this.service.getOperationDetail(value, 'detail', rowindex).subscribe(
          data => {
            console.log(data);
            if (data != null) {
              if (data != undefined) {
                if (data.length > 0) {
                  if (data[0].ErrorMsg == "7001") {
                    this.made_changes = false;
                    this.commonService.RemoveLoggedInUser().subscribe();
                    this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                    this.showLookupLoader = false;
                    return;
                  }
                }
              }

              if (data.length > 0) {
                let res_cnsmpt_mthd = this.commonData.res_consumption_method();

                this.routing_detail_data[currentrow].oper_id = data[0].OPRCode;
                this.routing_detail_data[currentrow].oper_code = data[0].OperationCode;
                this.routing_detail_data[currentrow].oper_desc = data[0].OPRDesc;
                this.routing_detail_data[currentrow].oper_consumption_method = data[0].OPRConsumMthd;
                this.routing_detail_data[currentrow].oper_consumption_method_str = res_cnsmpt_mthd[data[0].OPRConsumMthd];

                this.routing_detail_data[currentrow].oper_type = data[0].OPRType;
                this.routing_detail_data[currentrow].wc_id = data[0].DfltWCCode;
                this.routing_detail_data[currentrow].wc_code = data[0].DfltWCCode;
                this.routing_detail_data[currentrow].mtq = data[0].MTQ;

                this.routing_detail_data[currentrow].count_point_operation = false;
                this.routing_detail_data[currentrow].count_point_operation_disabled = false;

                if (data[0].OPRType == '4' || data[0].OPRType == '5') {

                  this.routing_detail_data[currentrow].count_point_operation = true;
                  this.routing_detail_data[currentrow].count_point_operation_disabled = true;
                }

                this.new_tree_item(this.routing_detail_data[currentrow].type, this.routing_detail_data[currentrow].oper_code, this.routing_detail_data[currentrow], this.routing_detail_data[currentrow].rowindex);


                this.getOperationResourceDetail(data[0].OPRCode, data[0].OperationCode, data[0].OPRType, data[0].OPRConsumMthd, currentrow, this.routing_detail_data[currentrow].unique_key, function () { });
              } else {
                this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
                this.clearInvalidOperationData(currentrow);
                this.showLookupLoader = false;
                return;
              }
            } else {
              this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
              this.clearInvalidOperationData(currentrow);
              this.showLookupLoader = false;
              return;
            }
          }, error => {
            this.clearInvalidOperationData(currentrow);
            this.showLookupLoader = false;
            if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
              this.commonService.isUnauthorized();
            } else {
              this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
            }
            return;
          }
          );

      }

      if (grid_element == 'oper_desc') {
        this.routing_detail_data[currentrow].oper_desc = value;
      }

      if (grid_element == 'wc_code') {

        this.showLookupLoader = true;
        this.service.getWCDetail(value, 'detail', rowindex).subscribe(
          data => {
            console.log(data);
            if (data != null) {

              if (data != undefined) {
                if (data.length > 0) {
                  if (data[0].ErrorMsg == "7001") {
                    this.made_changes = false;
                    this.commonService.RemoveLoggedInUser().subscribe();
                    this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                    this.showLookupLoader = false;
                    return;
                  }
                }
              }
              if (data.length > 0) {
                this.routing_detail_data[currentrow].wc_id = data[0].WCCode;
                this.routing_detail_data[currentrow].wc_code = data[0].WCCode;
                this.showLookupLoader = false;
              } else {
                this.toastr.error('', this.language.invalidwccodeRow + ' ' + rowindex, this.commonData.toast_config);
                this.routing_detail_data[currentrow].wc_id = "";
                this.routing_detail_data[currentrow].wc_code = "";
                $(".row_wc_id").eq(currentrow).val("");
                $(".row_wc_code").eq(currentrow).val("");
                this.showLookupLoader = false;
                return;
              }
            } else {
              this.toastr.error('', this.language.invalidwccodeRow + ' ' + rowindex, this.commonData.toast_config);
              this.routing_detail_data[currentrow].wc_id = "";
              this.routing_detail_data[currentrow].wc_code = "";
              $(".row_wc_id").eq(currentrow).val("");
              $(".row_wc_code").eq(currentrow).val("");
              this.showLookupLoader = false;
              return;
            }
          }, error => {
            this.routing_detail_data[currentrow].wc_id = "";
            this.routing_detail_data[currentrow].wc_code = "";
            $(".row_wc_id").eq(currentrow).val("");
            $(".row_wc_code").eq(currentrow).val("");
            if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
              this.commonService.isUnauthorized();
            } else {
              this.toastr.error('', this.language.invalidwccodeRow + ' ' + rowindex, this.commonData.toast_config);
            }
            this.showLookupLoader = false;
            return;
          }
          );


      }

      if (grid_element == 'mtq') {
        if (value == 0 && value != '') {
          value = 1;
          this.toastr.error('', this.language.mtq_cannot_be_blank_zero + ' ' + this.language.at_row + ' ' + rowindex, this.commonData.toast_config);
        }
        else {
          let rgexp = /^\d+$/;
          if (isNaN(value) == true) {
            value = 1;
            this.toastr.error('', this.language.mtq_valid_number, this.commonData.toast_config);
          } else if (value == 0 || value == '' || value == null || value == undefined) {
            value = 1;
            this.toastr.error('', this.language.mtq_cannot_be_blank_zero + ' ' + this.language.at_row + ' ' + rowindex, this.commonData.toast_config);
          } else if (value < 0) {
            value = 1;
            this.toastr.error('', this.language.mtq_value_nagative + ' ' + this.language.at_row + ' ' + rowindex, this.commonData.toast_config);
        } /*else if (rgexp.test(value) == false) {
          value = 1;
          this.toastr.error('', this.language.mtq_value_decimal + ' ' + this.language.at_row + ' ' + rowindex, this.commonData.toast_config);
        }*/
      }
      this.routing_detail_data[currentrow].mtq = value;
      $(".mtq_grid_level").eq(currentrow).val(value);
    }

    if (grid_element == 'count_point_operation') {
      if (this.routing_detail_data[currentrow].auto_move == true && value == true) {
        this.routing_detail_data[currentrow].count_point_operation = false;
        $(".count_point_operation_checkbox").eq(currentrow).prop("checked", false);
        this.toastr.error('', this.language.auto_move_count_point_cannot_bechecked + ' - ' + rowindex, this.commonData.toast_config);
      } else {
        this.routing_detail_data[currentrow].count_point_operation = value;
      }
    }

    if (grid_element == 'auto_move') {

      if (this.routing_detail_data[currentrow].count_point_operation == true && value == true) {
        this.routing_detail_data[currentrow].auto_move = false;
        $(".auto_move_checkbox").eq(currentrow).prop("checked", false);
        this.toastr.error('', this.language.auto_move_count_point_cannot_bechecked + ' - ' + rowindex, this.commonData.toast_config);
      } else {
        if (rowindex == 1 && value == true) {
          this.routing_detail_data[currentrow].auto_move = false;
          $(".auto_move_checkbox").eq(currentrow).prop("checked", false);
          this.toastr.error('', this.language.first_oper_cannot_automove, this.commonData.toast_config);
          return;
        }
        this.routing_detail_data[currentrow].auto_move = value;
      }
    }

    if (grid_element == 'effective_date') {
      console.log("effective_date ", value);
      let header_effective_date = new Date(this.routing_header_data.EffectiveDate);
      let temp_row_date = new Date(value);
      if(header_effective_date > temp_row_date){ 
        this.toastr.error('', this.language.detail_effective_date_header_efffective_date + ' - ' + rowindex, this.commonData.toast_config);
         this.routing_detail_data[currentrow].effective_date = new Date((header_effective_date.getMonth() + 1) + '/' + header_effective_date.getDate() + '/' + header_effective_date.getFullYear());
      } else {
        this.routing_detail_data[currentrow].effective_date = new Date((temp_row_date.getMonth() + 1) + '/' + temp_row_date.getDate() + '/' + temp_row_date.getFullYear());
      }
      
    }

    if (grid_element == 'inc_lead_time_calc') {
      this.routing_detail_data[currentrow].inc_lead_time_calc = value;
    }

    if (grid_element == 'queue_time') {

      this.routing_detail_data[currentrow].queue_time = this.format_time_in_hh_mm(value);
    }

    if (grid_element == 'move_time') {
      this.routing_detail_data[currentrow].move_time = this.format_time_in_hh_mm(value);
    }

    if (grid_element == 'qc_time') {
      this.routing_detail_data[currentrow].qc_time = this.format_time_in_hh_mm(value);
    }

    if (grid_element == 'time_uom') {
      this.routing_detail_data[currentrow].queue_time = "00:00";
      this.routing_detail_data[currentrow].move_time = "00:00";
      this.routing_detail_data[currentrow].qc_time = "00:00";
      this.routing_detail_data[currentrow].time_uom = value;
    }

    if (grid_element == 'opn_application') {
      if (value == false) {
        let temp_reset_date = new Date(this.routing_header_data.EffectiveDate);
        this.routing_detail_data[currentrow].oper_top_level = value;
        this.routing_detail_data[currentrow].operation_top_level = value;
        this.routing_detail_data[currentrow].oper_id = "";
        this.routing_detail_data[currentrow].oper_code = "";
        this.routing_detail_data[currentrow].oper_desc = "";
        this.routing_detail_data[currentrow].oper_consumption_method = "";
        this.routing_detail_data[currentrow].oper_consumption_method_str = "";
        this.routing_detail_data[currentrow].wc_id = "";
        this.routing_detail_data[currentrow].wc_code = "";
        this.routing_detail_data[currentrow].mtq = 1;
        this.routing_detail_data[currentrow].auto_move = value;
        this.routing_detail_data[currentrow].effective_date = new Date((temp_reset_date.getMonth() + 1) + '/' + temp_reset_date.getDate() + '/' + temp_reset_date.getFullYear());
        this.routing_detail_data[currentrow].count_point_operation = value;
        this.routing_detail_data[currentrow].count_point_operation_disabled = value;
        this.routing_detail_data[currentrow].inc_lead_time_calc = value;
        this.routing_detail_data[currentrow].queue_time = "00:00";
        this.routing_detail_data[currentrow].move_time = "00:00";
        this.routing_detail_data[currentrow].qc_time = "00:00";
        this.routing_detail_data[currentrow].time_uom = "1";
      }
      this.routing_detail_data[currentrow].opn_application = value;
    }

    //  console.log("this.routing_detail_data ", this.routing_detail_data);
    // console.log("this.routing_detail_resource_data[oper_code]", this.routing_detail_resource_data);
  }

  format_time_in_hh_mm(value) {
    if (value == "") {
      return "00:00";
    }
    if (!/:/.test(value)) { value += ':00'; }
    return value.replace(/^\d{1}:/, '0$&').replace(/:\d{1}$/, '$&0');
  }

  onDeleteRow(rowindex) {
    this.made_changes = true;
    if (this.routing_detail_data.length > 0) {
      for (let i = 0; i < this.routing_detail_data.length; ++i) {
        if (this.routing_detail_data[i].rowindex === rowindex) {
          if (this.tree_data_json.length > 0) {
            let temp_row_index = this.routing_detail_data[i].rowindex;
            let temp_type_value = this.routing_detail_data[i].type_value;
            let temp_type = this.routing_detail_data[i].type;
            let remove_tree_data = this.tree_data_json.findIndex(function (obj) {
              if (temp_type == '4') {
                return (obj['current_row_index'] == temp_row_index);
              } else {
                return (obj['componentNumber'] == temp_type_value);
              }
            });
            if (remove_tree_data != '-1') {
              // delete this.tree_data_json[remove_tree_data];
              this.tree_data_json.splice(remove_tree_data, 1);
            }
          }

          this.routing_detail_data.splice(i, 1);
          i = i - 1;
        }
        else {
          this.routing_detail_data[i].rowindex = i + 1;
        }
      }
      this.current_selected_row = [];
      this.row_selection = [];
    }
  }

  onSave() {
    if (this.validate_header_info() == '0') {
      return false;
    }
    if (this.routing_header_data.use_template_routing == false) {
      if (this.routing_detail_data.length > 0 && this.routing_detail_data != undefined) {
        let count_opn_appli_top_lvl = 0;
        for (let DetailIndex = 0; DetailIndex < this.routing_detail_data.length; DetailIndex++) {
          if (this.routing_detail_data[DetailIndex].oper_top_level == true) {
            if (this.routing_detail_data[DetailIndex].oper_code == undefined || this.routing_detail_data[DetailIndex].oper_code == null || this.routing_detail_data[DetailIndex].oper_code == '') {
              this.toastr.error('', this.language.operationmandatoryTopLevel + ' ' + (DetailIndex + 1), this.commonData.toast_config);
              return;
            }
          }

          if (this.routing_detail_data[DetailIndex].type == 2 && this.routing_detail_data[DetailIndex].opn_application == true && (this.routing_detail_data[DetailIndex].oper_code == undefined || this.routing_detail_data[DetailIndex].oper_code == null || this.routing_detail_data[DetailIndex].oper_code == '')) {
            this.toastr.error('', this.language.operationatitemmandatory + ' ' + (DetailIndex + 1), this.commonData.toast_config);
            return;
          }

          if (this.routing_detail_data[DetailIndex].type == 4 && (this.routing_detail_data[DetailIndex].oper_code == undefined || this.routing_detail_data[DetailIndex].oper_code == null || this.routing_detail_data[DetailIndex].oper_code == '')) {
            this.toastr.error('', this.language.operationatOprmmandatory + ' ' + (DetailIndex + 1), this.commonData.toast_config);
            return;
          }
          
          if (this.routing_detail_data[DetailIndex].oper_top_level == true || this.routing_detail_data[DetailIndex].opn_application == true){
            count_opn_appli_top_lvl++;
          }
        }

        if (count_opn_appli_top_lvl == 0){
          this.toastr.error('', this.language.one_oper_required, this.commonData.toast_config);
          return;
        }
      }

      // validate Grid line for operation setup type & inspection QC type 
      if (this.routing_detail_data.length > 0 && this.routing_detail_data != undefined) {
        let tmp_dtl_tble = this.routing_detail_data.filter(function (obj) {
          return (obj.oper_code != "" && obj.oper_code != undefined) ? obj : "";
        });
        if (tmp_dtl_tble.length > 0) {
          let temp__dtl_line_counter = 0;
          for (let temp_index_line = 0; temp_index_line < tmp_dtl_tble.length; temp_index_line++) {
            if (temp__dtl_line_counter == 0 && tmp_dtl_tble[temp_index_line].oper_type == '4') {
              this.toastr.error('', this.language.firstOperationInspectionQC, this.commonData.toast_config);
              //  this.clearInvalidOperationData(temp__dtl_line_counter);
              return;
            }

            let lastRowIndex = (tmp_dtl_tble.length - 1);
            if (lastRowIndex == temp__dtl_line_counter) { // last row 
              if (tmp_dtl_tble[temp_index_line].oper_type == '1') {
                this.toastr.error('', this.language.lastOperSetup, this.commonData.toast_config);
                //  this.clearInvalidOperationData(temp__dtl_line_counter);
                return;
              }
            }
            temp__dtl_line_counter++;
          }
        }
      }
    }

    if (this.routing_header_data.routing_for == 'model') {
      if (this.routing_header_data.opm_num_format == '' || this.routing_header_data.opm_num_format == null || this.routing_header_data.opm_num_format == undefined) {
        this.toastr.error('', this.language.opn_num_format_blank, this.commonData.toast_config);
        return;
      } else {
        if (this.routing_header_data.opm_num_format == 0) {
          this.toastr.error('', this.language.opn_num_format_zero, this.commonData.toast_config);
          return;
        }
      }

      if (this.routing_header_data.use_template_routing == true && (this.routing_header_data.template_routing_code == "" || this.routing_header_data.template_routing_code == undefined)) {
        this.toastr.error('', this.language.please_select_template_routing, this.commonData.toast_config);
        return;
      }

    }

    let objDataset: any = {};
    //console.log(this.routing_header_data);
    //console.log(this.routing_detail_data);

    // initialize
    objDataset.Connection = [];
    objDataset.Header = [];
    objDataset.Detail = [];
    objDataset.DetailResource = [];

    // override above array  
    objDataset.Connection.push({
      "loggedInUser": sessionStorage.getItem('loggedInUser'),
      "CompanyDBID": sessionStorage.getItem('selectedComp'),
      "GUID": sessionStorage.getItem("GUID"),
      "UsernameForLic": sessionStorage.getItem("loggedInUser"),
      "mode": this.form_mode
    });
    if (Object.keys(this.routing_header_data).length > 0) {
      let use_mtq_in_planing;
      if (this.routing_header_data.use_mtq_in_planing == true) {
        use_mtq_in_planing = 'Y';
      } else {
        use_mtq_in_planing = 'N';
      }
      let use_template_routing;
      if (this.routing_header_data.use_template_routing == true) {
        use_template_routing = 'Y';
      } else {
        use_template_routing = 'N';
      }
      objDataset.Header.push({
        EffectiveDate: this.routing_header_data.EffectiveDate,
        applicable_bom_unit: this.routing_header_data.applicable_bom_unit,
        default_batch_size: this.routing_header_data.default_batch_size,
        default_lot_size: this.routing_header_data.default_lot_size,
        feature_code: this.routing_header_data.feature_code,
        feature_description: this.routing_header_data.feature_description,
        feature_id: this.routing_header_data.feature_id,
        modal_code: this.routing_header_data.modal_code,
        modal_description: this.routing_header_data.modal_description,
        modal_id: this.routing_header_data.modal_id,
        opm_num_format: this.routing_header_data.opm_num_format,
        routing_for: this.routing_header_data.routing_for,
        template_routing_code: this.routing_header_data.template_routing_code,
        template_routing_id: this.routing_header_data.template_routing_id,
        use_mtq_in_planing: use_mtq_in_planing,
        use_template_routing: use_template_routing,
        warehouse_code: this.routing_header_data.warehouse_code,
        warehouse_id: this.routing_header_data.warehouse_id,
      });
    }

    let routing_detail_tmp_arr = [];
    if (this.routing_detail_data.length > 0 && this.routing_detail_data != undefined) {
      for (let resOper = 0; resOper < this.routing_detail_data.length; resOper++) {
        let oper_arr_data = this.routing_detail_data[resOper];
        //console.log("oper_arr_data", oper_arr_data);

        if (oper_arr_data.operation_top_level == true || oper_arr_data.oper_top_level == true) {
          oper_arr_data.operation_top_level = 'Y';
          oper_arr_data.oper_top_level = 'Y';
        } else {
          oper_arr_data.operation_top_level = 'N';
          oper_arr_data.oper_top_level = 'N';
        }


        if (oper_arr_data.inc_lead_time_calc == true) {
          oper_arr_data.inc_lead_time_calc = 'Y';
        } else {
          oper_arr_data.inc_lead_time_calc = 'N';
        }

        /* if (oper_arr_data.oper_type == true) {
          oper_arr_data.oper_type = 'N';
        } else {
          oper_arr_data.oper_type = 'Y';
        } */

        if (oper_arr_data.count_point_operation == true) {
          oper_arr_data.count_point_operation = 'Y';
        } else {
          oper_arr_data.count_point_operation = 'N';
        }

        if (oper_arr_data.auto_move == true) {
          oper_arr_data.auto_move = 'Y';
        } else {
          oper_arr_data.auto_move = 'N';
        }
        /*
        if (oper_arr_data.use_template_routing == true) {
          oper_arr_data.time_uom = 'Y';
        } else{
          oper_arr_data.time_uom = 'N';          
        } */

        if (oper_arr_data.opn_application == true) {
          oper_arr_data.opn_application = 'Y';
        } else {
          oper_arr_data.opn_application = 'N';
        }
        routing_detail_tmp_arr.push(oper_arr_data);
      }
    }

    let routing_detail_res_tmp_arr = [];
    if (this.routing_detail_resource_data.length > 0 && this.routing_detail_resource_data != undefined) {
      for (let resi = 0; resi < this.routing_detail_resource_data.length; resi++) {
        if (this.routing_detail_resource_data[resi] !== undefined && this.routing_detail_resource_data[resi] !== "") {
          let res_arr_data = this.routing_detail_resource_data[resi];
          for (let resd = 0; resd < res_arr_data.length; resd++) {
            if (res_arr_data[resd].schedule == true) {
              res_arr_data[resd].schedule = 1;
            } else {
              res_arr_data[resd].schedule = 0;
            }
            routing_detail_res_tmp_arr.push(res_arr_data[resd]);
          }
        }
      }
    }

    this.showLookupLoader = true;
    objDataset.Detail = routing_detail_tmp_arr;
    objDataset.DetailResource = routing_detail_res_tmp_arr;

    console.log("objDataset ", objDataset);
    this.service.SaveUpdateRouting(objDataset).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data == "7001") {
          this.made_changes = false;
          this.commonService.RemoveLoggedInUser().subscribe();
          this.commonService.signOut(this.toastr, this.route, 'Sessionout');
          return;
        }

        if (data === "True") {
          this.made_changes = false;
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('routing/view');
        } else {
          if (data == "AlreadyExist") {
            this.toastr.error('', this.language.routing_for + ' ' + this.language.this + ' ' + this.routing_header_data.routing_for + ' ' + this.language.alreadyExist, this.commonData.toast_config);
            return;
          } else {
            this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
            return;
          }

        }
      }, error => {
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return
      }
      )
  }


  deleteConfirm() {
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
    this.is_delete_called = true;
  }

  onDelete(model_feature_id) {
    this.showLookupLoader = true;
    let row_data = [{
      CompanyDBID: sessionStorage.selectedComp, RoutingId: model_feature_id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
    }]
    this.service.DeleteRouting(row_data).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
        }

        if (data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists") {
          this.toastr.error('', this.language.Refrence + ' at: ' + data[0].RoutingCode, this.commonData.toast_config);
        }
        else if (data[0].IsDeleted == "1") {
          this.toastr.success('', this.language.DataDeleteSuccesfully + ' : ' + data[0].RoutingCode, this.commonData.toast_config);
          this.made_changes = false;
          this.route.navigateByUrl('routing/view');
        }
        else {
          this.toastr.error('', this.language.DataNotDelete + ' : ' + data[0].RoutingCode, this.commonData.toast_config);
        }

      }, error => {
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return
      }
      )
  }


  // navigation functions - start

  navigateToFeatureModelHeader(type) {
    var type_value = type.trim();
    if (type_value == 'feature') {
      this.tree_data_json = [];
      this.route.navigateByUrl('feature/model/edit/' + this.routing_header_data.feature_id);
    } else if (type_value == 'model') {
      this.route.navigateByUrl('feature/model/edit/' + this.routing_header_data.modal_id);
    }
  }


  navigateToFeatureOrModelBom(type_value, type) {
    if (type == '1') {
      this.tree_data_json = [];
      this.route.navigateByUrl("feature/bom/edit/" + type_value);
    } else if (type == '3') {
      this.tree_data_json = [];
      this.route.navigateByUrl("modelbom/edit/" + type_value);
      /*this.GetDataByModelId(this.routing_header_data.modal_id, 'header', 0,true);*/
    }
  }

  get_childrens(componentNumber) {
    let data = this.complete_dataset.filter(function (obj) {
      return obj['parentNumber'] == componentNumber;
    });
    return data;
  }

  check_component_exist(componentNumber, level) {
    level = (parseInt(level) + 1);
    let data = [];
    if (componentNumber != "" && componentNumber != null && componentNumber != undefined) {
      data = this.tree_data_json.filter(function (obj) {
        return obj['parentNumber'] == componentNumber; //  && obj['level'] == level;
      });
    }
    return data;
  }

  childExpand(id: any) {
    id.classList.toggle("expanded")
    if (id.parentNode.parentNode.childNodes[4].style.display === "none") {
      id.parentNode.parentNode.childNodes[4].style.display = "block";
    } else {
      id.parentNode.parentNode.childNodes[4].style.display = "none";
    }
  }
  expandAll() {
    
    $(document).find('treeview').show()
    $(document).find('.expand-btn').addClass("expanded")
  }
  collapseAll() {
    
    $(document).find('treeview').hide()
    $(document).find('.expand-btn').removeClass("expanded")
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

  onExplodeClick(type) {
    if (type == "manual") {
      this.showtree();
    }
    let routing_for_id;
    let display_name;
    if (this.routing_header_data.routing_for == 'feature') {
      routing_for_id = this.routing_header_data.feature_id;
      display_name = this.routing_header_data.feature_code;
    } else if (this.routing_header_data.routing_for == 'model') {
      routing_for_id = this.routing_header_data.modal_id;
      display_name = this.routing_header_data.modal_code
    }
    if (routing_for_id != undefined) {
      //now call bom id
      if (this.tree_data_json == undefined || this.tree_data_json.length == 0) {


        this.service.getTreeData(this.companyName, routing_for_id).subscribe(
          data => {
            if (data != null && data != undefined) {

              if (data.length > 0) {
                if (data[0].ErrorMsg == "7001") {
                  this.made_changes = false;
                  this.commonService.RemoveLoggedInUser().subscribe();
                  this.commonService.signOut(this.toastr, this.route, 'Sessionout');
                  return;
                }
              }

              let routing_grid = this.routing_detail_data;
              let counter_temp = 0;
              let temp_data = data.filter(function (obj) {
                obj['tree_index'] = (counter_temp);
                obj['live_row_id'] = (counter_temp++);
                let c_obj = obj;
                let routing_grid_index = routing_grid.findIndex(function (obj) {
                  if (obj.type == '4') {
                    return (obj.oper_code == c_obj.operation_no || obj.oper_id == c_obj.operation_no);
                  } else {
                    return obj.type_value == c_obj.componentNumber;
                  }
                })
                obj['current_row_index'] = (routing_grid_index + 1);
                return obj;
              });
              this.tree_data_json = temp_data;
              console.log(this.tree_data_json);

            }
            else {
            }

          },
          error => {
            if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
              this.commonService.isUnauthorized();
            } else {
              this.toastr.error('', this.language.server_error, this.commonData.toast_config);
            }
            return;
          }
          );
      } else {

        for (let i = 0; i < this.routing_detail_data.length; ++i) {
          if (this.routing_detail_data[i].display_name == '') {
            let currentrowindx = i + 1;
            this.toastr.error('', this.language.DisplayNameRequired + currentrowindx, this.commonData.toast_config);
          }
        }

        let temp_data_level = this.tree_data_json.filter(function (obj) {
          return obj.level == "0" || obj.level == "1";
        });

        let sequence_count = parseInt(this.tree_data_json.length + 1);
        console.log(this.live_tree_view_data);
        if (this.live_tree_view_data.length > 0) {

          //for (var key in this.live_tree_view_data) {
            for (let key = 0; key < this.live_tree_view_data.length; key++) {
              let update_data: any = "";
              let update_index: any;
              let temp_current_row_index = this.live_tree_view_data[key].current_row_index;
              let temp_seq = {};
              if (this.live_tree_view_data[key].branchType == 'operation') {
                update_data = this.tree_data_json.filter(function (obj) {
                  return (obj.current_row_index == temp_current_row_index) ? obj : "";
                });
                update_index = this.tree_data_json.findIndex(function (tree_el) {
                  return (tree_el.current_row_index == temp_current_row_index) ? tree_el : "";
                });
              } else {
                let temp_component_nmber = this.live_tree_view_data[key].componentNumber;
                update_data = this.tree_data_json.filter(function (obj) {
                  return (obj.componentNumber == temp_component_nmber) ? obj : "";
                });
                update_index = this.tree_data_json.findIndex(function (tree_el) {
                  return (tree_el.componentNumber == temp_component_nmber) ? tree_el : "";
                });
              }

              if (update_data == "-1" || update_data == "") {
                temp_seq = { "sequence": sequence_count, "parentId": display_name, "parentNumber": routing_for_id, "component": "", "componentNumber": "", "level": "0", "live_row_id": this.tree_data_json.length, "is_local": "1", "tree_index": this.live_tree_view_data[key].tree_index, "branchType": this.live_tree_view_data[key].branchType, "icon": this.live_tree_view_data[key].icon, "modalImage": "", "operation_no": this.live_tree_view_data[key].operation_no, "current_row_index": this.live_tree_view_data[key].current_row_index };
                this.tree_data_json.push(temp_seq);
                temp_data_level.push(temp_seq);
              } else {

                temp_seq = { "sequence": update_data[0].sequence, "parentId": display_name, "parentNumber": routing_for_id, "component": this.live_tree_view_data[key].component, "componentNumber": this.live_tree_view_data[key].componentNumber, "level": "0", "live_row_id": update_data[0].live_row_id, "is_local": "1", "tree_index": update_data[0].tree_index, "branchType": update_data[0].branchType, "icon": update_data[0].icon, "modalImage": "", "operation_no": this.live_tree_view_data[key].operation_no, "current_row_index": update_data[0].current_row_index };

                this.tree_data_json[update_index] = (temp_seq);
              }

            }
            console.log(this.tree_data_json);
            this.live_tree_view_data = [];
          }
        }
      }
      else {
        this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
        return;
      }

    }

    // navigation functions - end
  }
