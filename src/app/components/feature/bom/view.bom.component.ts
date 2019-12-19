import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FeaturebomService } from '../../../services/featurebom.service';
import { CommonData, ColumnSetting } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UIHelper } from '../../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
    selector: 'app-feature-bom-view',
    templateUrl: '../../common/table.view.html',
    styleUrls: ['./bom.component.scss']
})


export class ViewFeatureBOMComponent implements OnInit {

    serviceData: any;
    public lookupfor = '';
    public selectedImage = "";


    @ViewChild("searchinput") _el: ElementRef;
    common_params = new CommonData();

    public listItems: Array<string> = this.common_params.default_limits;
    public selectedValue: number = 10;
    public skip: number = 0;

    language = JSON.parse(sessionStorage.getItem('current_lang'));
    page_main_title = this.language.Bom_title;
    add_route_link = '/feature/bom/add';
    public commonData = new CommonData();
    table_title = this.page_main_title;
    // generate table default constants
    table_pages: any;
    search_key: any;
    //table_head_foot = ['Select','#', 'Feature ID', 'Display Name', 'Action'];
    table_head_foot = [this.language.select, this.language.hash, this.language.Bom_FeatureId, this.language.Feature_Code, this.language.Bom_Displayname, this.language.action];
    public table_hidden_elements = [false, true, true, false, false, false];
    record_per_page_list: any = this.common_params.default_limits;
    public showLoader: boolean = true;
    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public dataBind: any = "";

    constructor(private fbs: FeaturebomService, private router: Router, private toastr: ToastrService,
        private commonservice: CommonService) { }
    show_table_footer: boolean = false;
    public showImportButton: boolean = false;
    //custom dialoag params
    public dialog_params: any = [];
    public show_dialog: boolean = false;
    public dialog_box_value: any;
    public row_id: any;
    public dataArray: any = [];
    public CheckedData: any = [];
    public companyName: string = "";
    public username: string = "";
    public GetItemData: any = [];
    public selectall: boolean = false;
    public isMultiDelete: boolean = false;
    public isColumnFilter: boolean = false;
    public menu_auth_index: string = "202";
    public showLookupLoader: boolean = false;

      public allowUnsort = true;
    public sort: SortDescriptor[];
    public gridView: GridDataResult;

    isMobile: boolean = false;
    isIpad: boolean = false;
    isDesktop: boolean = true;
    isPerfectSCrollBar: boolean = false;

    public columns: ColumnSetting[] = [
    {
        field: 'OPTM_FEATURECODE',
        title: this.language.Feature_Code,
        type: 'text',
        width: '500',
        attrType: 'link'
    },
    {
        field: 'OPTM_DISPLAYNAME',
        title: this.language.Bom_Displayname,
        type: 'text',
        width: '500',
        attrType: 'text'
    },
    {
        field: 'OPTM_ACCESSORY',
        title: this.language.Model_Accessory,
        type: 'text',
        width: '100',
        attrType: 'text'
    }
    ];

    getLookupValue($event) {

    }
    getcurrentPageSize(grid_value) {
        sessionStorage.setItem('defaultRecords', grid_value);
        this.skip = 0;
        this.selectedValue = grid_value;
        this.record_per_page = sessionStorage.getItem('defaultRecords');
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
    saveFilterState() {
        sessionStorage.setItem('isFilterEnabled', this.isColumnFilter.toString());
    }
    ngOnInit() {
        this.showLoader = true;
        const element = document.getElementsByTagName("body")[0];
        // element.className = "";
        this.detectDevice()
        //element.classList.add("app_feature-bom-view-model");
       // element.classList.add("opti_body-main-module");
        // element.classList.add('sidebar-toggled');
        // document.getElementById("opti_sidebar").classList.add('toggled');

        this.commonData.checkSession();
        this.companyName = sessionStorage.getItem('selectedComp');
        this.record_per_page = sessionStorage.getItem('defaultRecords');
        if (sessionStorage.getItem('defaultRecords') !== undefined && sessionStorage.getItem('defaultRecords') != "") {
            this.selectedValue = Number(sessionStorage.getItem('defaultRecords'));
        } else {
            this.selectedValue = Number(this.commonData.default_count);
        }
        if (sessionStorage.isFilterEnabled == "true") {
            this.isColumnFilter = true;
        } else {
            this.isColumnFilter = false;
        }

        // check screen authorisation - start
        this.commonservice.getMenuRecord().subscribe(
            menu_item => {
                let menu_auth_index = this.menu_auth_index
                let is_authorised = menu_item.filter(function (obj) {
                    return (obj.OPTM_MENUID == menu_auth_index) ? obj : "";
                });

                if (is_authorised.length == 0) {
                    let objcc = this;
                    setTimeout(function () {
                        objcc.toastr.error('', objcc.language.notAuthorisedScreen, objcc.commonData.toast_config);
                        objcc.router.navigateByUrl('home');
                    }, 200);
                }
            });
        // check screen authorisation - end

        this.service_call(this.current_page, this.search_string);

    }
    ngAfterViewInit() {
        //  this._el.nativeElement.focus();
    }

    dataStateChanged(event) {
        // console.log(event);
        event.filter = [];
        this.record_per_page = sessionStorage.getItem('defaultRecords');
        this.selectedValue = event.take;
        this.skip = event.skip;
    }

    on_selection(grid_event) {
        grid_event.selectedRows = [];
    }

    on_page_limit_change() {
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }

    getPageValue() {
        if (this.selectedValue == null) {
            this.selectedValue = 10;
        }
        return this.selectedValue;
    }

    search_results() {
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }

    service_call(page_number, search) {
        if (this.record_per_page !== undefined && sessionStorage.getItem('defaultRecords')) {
            if (this.record_per_page !== sessionStorage.getItem('defaultRecords')) {
                sessionStorage.setItem('defaultRecords', this.record_per_page);
            }
        } else {
            this.record_per_page = this.commonData.default_count;
            sessionStorage.setItem('defaultRecords', this.record_per_page);
        }
        var dataset = this.fbs.getAllViewDataForFeatureBom(search, page_number, this.record_per_page).subscribe(
            data => {
                console.log(data);
                this.showLoader = false;
                if (data != undefined && data.length > 0) {
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router, 'Sessionout');
                        return;
                    }
                }
                this.dataArray = data;

                var objj = this;
                var language = this.language;
                this.dataArray.filter(function(obj){
                    if(obj.OPTM_ACCESSORY == "Y") {
                        obj.OPTM_ACCESSORY = language.YES;
                    } else if(obj.OPTM_ACCESSORY == "N") {
                        obj.OPTM_ACCESSORY = language.NO;
                    }
                })
                this.loadServerData(this.dataArray);
                this.CheckedData = [];
                this.selectall = false;
                $("input[name='child_checkbox']").prop("checked", false);

            },error=>{
                this.showLookupLoader = false;
                if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
                this.commonservice.isUnauthorized();
                }
                return;
            });
    }

      public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.loadServerData(this.dataArray);
    }

   private loadServerData(dataset): void {
      if(this.sort !== undefined && this.sort !== null){
          this.gridView = {
              data: orderBy(dataset, this.sort),
              total: this.dataArray.length
          };
      } else {
          this.gridView = {
              data: dataset,
              total: this.dataArray.length
          }; 
      }
  }

    // action button values 
    show_button1: boolean = true;
    show_button2: boolean = true;
    show_button3: boolean = true;
    show_button4: boolean = true;
    feature_model_button : boolean = false;

    button1_title = this.language.edit;
    button2_title = this.language.delete;
    button3_title = this.language.associated_BOMs;
    button4_title = this.language.duplicate_record

    button1_color = "btn-info";
    button2_color = "btn-danger";
    button3_color = "btn-secondary";
    button4_color = "btn-success";

    button1_icon = "fa fa-edit fa-fw";
    button2_icon = "fa fa-trash-o fa-fw";
    button3_icon = "fa fa-share-alt fa-fw";
    button4_icon = "fa fa-copy fa-fw";


    button_click1(data) {

        this.router.navigateByUrl('feature/bom/edit/' + data.OPTM_FEATUREID);
        // button click function in here
    }

    button_click2(data) {
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.OPTM_FEATUREID;

        // var result = confirm(this.language.DeleteConfimation);
    }

    duplicate_record(data){
        this.router.navigateByUrl('feature/bom/add/' + data.OPTM_FEATUREID);
      }

    show_association(row_data){
        console.log("data " , row_data);
        this.showLookupLoader = true;
        this.fbs.ViewAssosciatedBOM(row_data.OPTM_FEATUREID).subscribe(
            data => {
                if (data != null && data != undefined) {
                    if (data.length > 0) {
                        if (data[0].ErrorMsg == "7001") {
                            this.commonservice.RemoveLoggedInUser().subscribe();
                            this.commonservice.signOut(this.toastr, this.router, 'Sessionout');
                            this.showLookupLoader = false;
                            return;
                        }

                        this.serviceData = data;
                        this.lookupfor = 'associated_BOM';
                        this.showLookupLoader = false;
                    }
                    else {
                        this.toastr.error('', this.language.no_assocaited_bom_with_feature + " : " + row_data.OPTM_FEATURECODE, this.commonData.toast_config);
                        this.showLookupLoader = false;
                        return;
                    }
                }
                else {
                    this.toastr.error('', this.language.no_assocaited_bom_with_feature + " : " + row_data.OPTM_FEATURECODE, this.commonData.toast_config);
                    this.showLookupLoader = false;
                    return;
                }
            },
            error => {
                this.showLookupLoader = false;
                if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
                    this.commonservice.isUnauthorized();
                } else {
                    this.toastr.error('', this.language.server_error, this.commonData.toast_config);
                }
                return;
            }
            );
        
    }

    //This will take confimation box value
    get_dialog_value(userSelectionValue) {
        if (userSelectionValue == true) {
            if (this.isMultiDelete == false) {
                this.delete_row();
            }
            else {
                this.delete_multi_row();
            }
        }
        this.show_dialog = false;
    }

    //delete values
    delete_row() {
        this.GetItemData = []
        this.GetItemData.push({
            CompanyDBId: this.companyName,
            FeatureId: this.row_id,
            GUID: sessionStorage.getItem("GUID"),
            UsernameForLic: sessionStorage.getItem("loggedInUser")
        });
        this.fbs.DeleteData(this.GetItemData).subscribe(
            data => {
                this.CheckedData = [];
                this.isMultiDelete = false;
                if (data != undefined && data.length > 0) {
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router, 'Sessionout');
                        return;
                    }
                }

                if (data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists") {
                    this.toastr.error('', this.language.Refrence + ' at: ' + data[0].FeatureCode, this.commonData.toast_config);
                    this.CheckedData = [];
                    this.selectall = false;
                }
                else if (data[0].IsDeleted == "1") {
                    this.toastr.success('', this.language.DataDeleteSuccesfully  + ' : ' + data[0].FeatureCode, this.commonData.toast_config);
                    this.service_call(this.current_page, this.search_string);
                    this.router.navigateByUrl('feature/bom/view');
                }
                else {
                    this.toastr.error('', this.language.DataNotDelete + ' : ' + data[0].FeatureCode, this.commonData.toast_config);
                }

                this.CheckedData = [];
                this.selectall = false;
                $("input[name='child_checkbox']").prop("checked", false);
            },error => {
                this.showLookupLoader = false;
                if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
                  this.commonservice.isUnauthorized();
                }
                return;
              }
            )
    }

    on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i].FeatureId == row_data.OPTM_FEATUREID) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            FeatureId: row_data.OPTM_FEATUREID,
                            CompanyDBId: this.companyName,
                            GUID: sessionStorage.getItem("GUID"),
                            UsernameForLic: sessionStorage.getItem("loggedInUser")
                        })
                    }
                    else {
                        this.CheckedData.splice(i, 1)
                    }
                }
            }
            if (isExist == 0) {
                this.CheckedData.push({
                    FeatureId: row_data.OPTM_FEATUREID,
                    CompanyDBId: this.companyName,
                    GUID: sessionStorage.getItem("GUID"),
                    UsernameForLic: sessionStorage.getItem("loggedInUser")
                })
            }
        }
        else {
            this.CheckedData.push({
                FeatureId: row_data.OPTM_FEATUREID,
                CompanyDBId: this.companyName,
                GUID: sessionStorage.getItem("GUID"),
                UsernameForLic: sessionStorage.getItem("loggedInUser")
            })
        }


    }

    on_Selectall_checkbox_checked(checkedvalue) {

        var isExist = 0;
        this.CheckedData = [];
        this.selectall = false

        if (checkedvalue == true) {
            this.selectall = true
            if (this.dataArray.length > 0) {
                for (let i = 0; i < this.dataArray.length; ++i) {

                    this.CheckedData.push({
                        FeatureId: this.dataArray[i].OPTM_FEATUREID,
                        CompanyDBId: this.companyName,
                        GUID: sessionStorage.getItem("GUID"),
                        UsernameForLic: sessionStorage.getItem("loggedInUser")
                    })
                }
            }



        }
        else {
            this.selectall = false
        }


    }

    delete() {
        if (this.CheckedData.length > 0) {
            this.isMultiDelete = true;
            this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
            this.show_dialog = true;
        }
        else {
            this.toastr.error('', this.language.Norowselected, this.commonData.toast_config)
        }
    }

    delete_multi_row() {
        this.showLoader = true
        if (this.CheckedData.length > 0) {
            this.fbs.DeleteData(this.CheckedData).subscribe(
                data => {
                    this.showLoader = false
                    this.CheckedData = [];
                    this.isMultiDelete = false;
                    if (data != undefined && data.length > 0) {
                        if (data[0].ErrorMsg == "7001") {
                            this.commonservice.RemoveLoggedInUser().subscribe();
                            this.commonservice.signOut(this.toastr, this.router, 'Sessionout');
                            return;
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].IsDeleted == "0" && data[i].Message == "ReferenceExists") {
                            this.toastr.error('', this.language.Refrence + ' at: ' + data[i].FeatureCode, this.commonData.toast_config);
                            this.CheckedData = [];
                            this.selectall = false;
                        }
                        else if (data[i].IsDeleted == "1") {
                            this.toastr.success('', this.language.DataDeleteSuccesfully + ' with Model Id : ' + data[i].FeatureCode, this.commonData.toast_config);
                            this.CheckedData = [];
                            this.selectall = false;
                            this.service_call(this.current_page, this.search_string);
                            this.router.navigateByUrl('feature/bom/view');
                        }
                        else {
                            this.toastr.error('', this.language.DataNotDelete + ' : ' + data[i].FeatureCode, this.commonData.toast_config);
                        }
                    }
                    this.CheckedData = [];
                    this.selectall = false;
                    $("input[name='child_checkbox']").prop("checked", false);
                },error => {
                    this.showLookupLoader = false;
                    if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
                      this.commonservice.isUnauthorized();
                    }
                    return;
                })

        }
        else {

            this.toastr.error('', this.language.Norowselected, this.commonData.toast_config)
        }
    }

}







