import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { CommonService } from 'src/app/services/common.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from 'src/app/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router'
import 'bootstrap';
import * as $ from 'jquery';
import { UIHelper } from '../../helpers/ui.helpers';


@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	public commonData = new CommonData();
	language = JSON.parse(sessionStorage.getItem('current_lang'));
	public settings_data: any = [];
	constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private setting_service: SettingsService, private toastr: ToastrService, private commonService: CommonService, private DialogService: DialogService) { }
	public page_main_title = this.language.preferences
	public made_changes: boolean = false;
	public isUpdateButtonVisible: boolean = true;
	public isMobile: boolean = false;
	public isIpad: boolean = false;
	public isDesktop: boolean = true;
	public isPerfectSCrollBar: boolean = false;
	public showLoader: boolean = true;
	public showLookupLoader: boolean = false;
	public view_route_link = '/home';
	public loggedin_user:string = "";
	public current_commpany:string = "";

	canDeactivate() {
		if(this.made_changes == true){
			return this.DialogService.confirm('');
		} else {
			return true;
		}
	}

	detect_change(){
		this.made_changes = true;
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
		this.showLoader = true;
		this.loggedin_user = sessionStorage.getItem('loggedInUser');
		this.current_commpany = sessionStorage.getItem('selectedComp');
		this.setting_service.get_all_settings().subscribe(
			data => {
				if (data != undefined) {
					if (data[0].ErrorMsg == "7001") {
						this.made_changes = false;
						this.commonService.RemoveLoggedInUser().subscribe();
						this.commonService.signOut(this.toastr, this.route, 'Sessionout');
						return;
					}
				}

				if(data.length > 0){
					let temp_obj = [];
					for (var si = 0; si < data.length; si++) {
						temp_obj[data[si]['NAME']] = data[si]['VALUE'];
					}
					this.settings_data = temp_obj;
				}
				this.showLoader = false;
			},
			error => {
				this.showLoader = false;
			});
	}

	onUpdateClick(){
		this.showLookupLoader = true;
		let report_data_save: any = {};
		report_data_save.settingdata = [];
		report_data_save.apidata = [];
		report_data_save.connectiondetails = [];
		let temp = {};
		for(let index in this.settings_data){
			temp = {
				"NAME"  : index,
				"VALUE" : this.settings_data[index]
			};
			report_data_save.settingdata.push(temp);
		}

		report_data_save.connectiondetails.push({
			CompanyDBID: this.current_commpany,
			Username: this.loggedin_user,
		});

		report_data_save.apidata.push({
			GUID: sessionStorage.getItem("GUID"),
			UsernameForLic: this.loggedin_user
		});

		this.setting_service.save_update_settings(report_data_save).subscribe(
			data => {
				this.showLookupLoader = false;
				if (data != null && data != undefined) {
					if(data.length > 0 && data != undefined){
						if (data[0].ErrorMsg == "7001") {
							this.made_changes = false;
							this.commonService.RemoveLoggedInUser().subscribe();
							this.commonService.signOut(this.toastr, this.route, 'Sessionout');
							return;
						}
					}
				}

				if (data[0].Status == "True") {
					this.toastr.success('', this.language.DataUpdateSuccesfully, this.commonData.toast_config);
					this.route.navigateByUrl(this.view_route_link);
				} else {
					this.toastr.error('', this.language.DataNotUpdated, this.commonData.toast_config);
					return;
				}
			}, error => {
				this.showLoader = false;
				this.toastr.error('', this.language.server_error, this.commonData.toast_config);
				return;
				
			});
	}
}
