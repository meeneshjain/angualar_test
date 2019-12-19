import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { CommonData, ColumnSetting } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
    selector: 'app-routing-view',
    templateUrl: '../common/table.view.html',
    styleUrls: ['./routing.component.scss']
})


export class ViewRoutingComponent implements OnInit {
    serviceData: any;
    public lookupfor = '';
    public selectedImage = "";
    public commonData = new CommonData();

    public listItems: Array<string> = this.commonData.default_limits;
    public selectedValue: number = Number(this.commonData.default_count);
    public skip:number = 0;

    language = JSON.parse(sessionStorage.getItem('current_lang'));
    page_main_title = this.language.routing;
    add_route_link = '/routing/add';
    public showLoader: boolean = true;
    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public dataBind: any = "";

    constructor(private rs: RoutingService, private router: Router, private toastr: ToastrService,
        private commonservice:CommonService) { }
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
    public isColumnFilter: any = false;
    public menu_auth_index = '206';
    isMobile: boolean = false;
    isIpad: boolean = false;
    isDesktop: boolean = true;
    isPerfectSCrollBar: boolean = false;
    public showLookupLoader: boolean = false;

        public allowUnsort = true;
    public sort: SortDescriptor[];
    public gridView: GridDataResult;

    show_button1: boolean = true;
    show_button2: boolean = true;
    show_button3: boolean = false;
    show_button4: boolean = false;
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

        this.router.navigateByUrl('routing/edit/' + data.OPTM_MODELFEATUREID);
        // button click function in here
    }
    button_click2(data) {
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.OPTM_MODELFEATUREID;
        // var result = confirm(this.language.DeleteConfimation);
    }

    duplicate_record(data){
        // data.OPTM_MODELFEATUREID
    }

    show_association(data){
        console.log("data " , data);
        return false;
    }

    get_dialog_value(userSelectionValue) {
        if (userSelectionValue == true) {

            this.showLoader = true;
            let row_data;
            if(this.CheckedData.length > 0){
                row_data = this.CheckedData;
            } else {
                row_data = [{ CompanyDBID: sessionStorage.selectedComp, RoutingId: this.row_id,
                    GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]
                }

                this.rs.DeleteRouting(row_data).subscribe(
                    data => {
                        this.showLoader = false;
                        this.CheckedData = [];
                        this.isMultiDelete = false;
                        for(var i=0;  i < data.length ; i++){
                            if(data[i].IsDeleted == "0" && data[i].Message == "ReferenceExists"){
                                this.toastr.error('', this.language.Refrence + ' at: ' + data[i].RoutingCode , this.commonData.toast_config);
                                this.CheckedData = [];
                                this.selectall = false;
                            }
                            else if(data[i].IsDeleted == "1"){
                                this.toastr.success('', this.language.DataDeleteSuccesfully + ' : ' + data[i].RoutingCode , this.commonData.toast_config);
                                this.CheckedData = [];
                                this.selectall = false;
                                this.service_call(this.current_page, this.search_string);
                                this.router.navigateByUrl('routing/view');
                            }
                            else{
                                this.toastr.error('', this.language.DataNotDelete + ' : ' + data[i].RoutingCode , this.commonData.toast_config);
                            }
                        }
                        this.CheckedData = [];
                        this.selectall = false;
                        $("input[name='child_checkbox']").prop("checked", false);
                    }, error => {
                        this.showLoader = false;
                        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
                            this.commonservice.isUnauthorized();
                        } else {
                            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
                        }
                        return
                    }
                    )

            }
            this.show_dialog = false;
        }

        public columns: ColumnSetting[] = [
        {
            field: 'OPTM_FEATURECODE',
            title: this.language.code,
            type: 'text',
            width: '200',
            attrType: 'link'
        },
        {
            field: 'OPTM_DISPLAYNAME',
            title: this.language.Bom_Displayname,
            type: 'text',
            width: '200',
            attrType: 'text'
        },
        {
            field: 'OPTM_EFFECTIVEDATE',
            title: this.language.Model_Date,
            type: 'text',
            width: '100',
            attrType: 'text'
        },
        {
            field: 'OPTM_TYPE',
            title: this.language.Type,
            type: 'text',
            width: '100',
            attrType: 'text'
        },
        {
            field: 'OPTM_STATUS',
            title: this.language.Model_Status,
            type: 'text',
            width: '200',
            attrType: 'text'
        },
        ];

        getcurrentPageSize(grid_value) {
            sessionStorage.setItem('defaultRecords', grid_value);
            this.skip = 0;
            this.selectedValue = grid_value;
            this.record_per_page = sessionStorage.getItem('defaultRecords');
        }

        getLookupValue($event) {

        }

        getPageValue() {
            if(this.selectedValue == null){
                this.selectedValue = 10;
            }  
            return this.selectedValue;
        }

        dataStateChanged(event){
            // console.log(event);
            event.filter = [];
            this.record_per_page = sessionStorage.getItem('defaultRecords');
            this.selectedValue = event.take;
            this.skip = event.skip;
        }

        on_selection(grid_event) {
            grid_event.selectedRows = [];
        }

        saveFilterState() {
            sessionStorage.setItem('isFilterEnabled', this.isColumnFilter.toString());
        }

        ngOnInit() {
            this.showLoader = true;
            const element = document.getElementsByTagName("body")[0];
            // element.className = "";
            this.detectDevice()
           /* element.classList.add("app_feature-bom-view-model");
            element.classList.add("opti_body-main-module");*/
            // element.classList.add('sidebar-toggled');
            // document.getElementById("opti_sidebar").classList.add('toggled');

            this.commonData.checkSession();
            this.companyName = sessionStorage.getItem('selectedComp');
            this.record_per_page = sessionStorage.getItem('defaultRecords');

            if(sessionStorage.isFilterEnabled == "true" ) {
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
                }, error => {
                    if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
                        this.commonservice.isUnauthorized();
                    } else {
                        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
                    }
                    return
                });
            // check screen authorisation - end

            this.service_call(this.current_page, this.search_string);

        }
        ngAfterViewInit() {
            //  this._el.nativeElement.focus();
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

        service_call(page_number, search) {
            var dataset = this.rs.get_all_routing_data().subscribe(
                data => {
                    console.log(data);               
                    if(data != undefined){
                        if(data.length > 0){
                            if (data[0].ErrorMsg == "7001") {
                                this.commonservice.RemoveLoggedInUser().subscribe();
                                this.commonservice.signOut(this.toastr, this.router, 'Sessionout');
                                this.showLoader = false;
                                return;
                            } 
                        }
                    }
                    this.dataArray = data; 
                    this.loadServerData(this.dataArray);
                    this.showLoader = false;         
                    this.CheckedData = [];
                    this.selectall = false;
                    $("input[name='child_checkbox']").prop("checked", false);
                },
                error => {
                this.showLoader = false; 
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

        on_Selectall_checkbox_checked(checkedvalue) {
            var isExist = 0;
            this.CheckedData = []
            this.selectall = false

            if (checkedvalue == true) {
                if (this.dataArray.length > 0) {
                    this.selectall = true
                    for (let i = 0; i < this.dataArray.length; ++i) {

                        this.CheckedData.push({
                            RoutingId: this.dataArray[i].OPTM_MODELFEATUREID,
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

        on_checkbox_checked(checkedvalue, row_data) {
            var isExist = 0;
            if (this.CheckedData.length > 0) {
                for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                    if (this.CheckedData[i].RoutingId == row_data.OPTM_MODELFEATUREID) {
                        isExist = 1;
                        if (checkedvalue == true) {
                            this.CheckedData.push({
                                RoutingId: row_data.OPTM_MODELFEATUREID,
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
                        RoutingId: row_data.OPTM_MODELFEATUREID,
                        CompanyDBId: this.companyName,
                        GUID: sessionStorage.getItem("GUID"),
                        UsernameForLic: sessionStorage.getItem("loggedInUser")
                    })
                }
            }
            else {
                this.CheckedData.push({
                    RoutingId: row_data.OPTM_MODELFEATUREID,
                    CompanyDBId: this.companyName,
                    GUID: sessionStorage.getItem("GUID"),
                    UsernameForLic: sessionStorage.getItem("loggedInUser")
                })
            }


        }
    }
