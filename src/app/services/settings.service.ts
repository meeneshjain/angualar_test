import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { CommonData } from "src/app/models/CommonData";


@Injectable({
	providedIn: 'root'
})
export class SettingsService {

	config_params: any;
	common_params = new CommonData();
	logged_in_company = sessionStorage.selectedComp;
	public current_date = new Date();
	public formatted_date;
	constructor(private httpclient: HttpClient) {
		this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
		this.formatted_date = (this.current_date.getFullYear()) + '/' + (this.current_date.getMonth() + 1) + '/' + this.current_date.getDate();
	}

	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'multipart/form-data',
			'Accept': 'application/json'
		})
	}

	get_all_settings(): Observable<any> {
		let cache_control = this.common_params.random_string(40);
		let jObject = { GetModel: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
		return this.httpclient.post(this.config_params.service_url + "/Settings/GetAllSettings?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
	}

	save_update_settings(dataset): Observable<any> {
		let cache_control = this.common_params.random_string(40);
		
		var jObject = { GetData: JSON.stringify(dataset) };
		return this.httpclient.post(this.config_params.service_url + "/Settings/SaveUpdateSettings?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
	}
}
