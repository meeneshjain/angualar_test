import { Injectable } from '@angular/core';import { parse } from 'querystring';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  common_params = new CommonData();
  public logged_in_company = sessionStorage.selectedComp;
  public config_params: any = "";
  config_parameter;

  // Declaration
  private commonData = new Subject<any>();
  commonData$ = this.commonData.asObservable();

  constructor(private httpclient: HttpClient,private toastr: ToastrService, private router: Router) { }

  // Methods
  public ShareData(data: any) {
    this.commonData.next(data);
  }


  async get_config(callback) {
    /*let config_call = await fetch( this.common_params.get_current_url() +  "/assets/data/json/config.json");*/
    let config_call = await fetch( this.common_params.get_current_url() +  "/assets/config.json");
    let config_data = await config_call.json();
    console.log("config_call - ", config_data[0]);
    if(callback != undefined && callback !== ""){
      sessionStorage.setItem('system_config', JSON.stringify(config_data[0]));
      callback(config_data[0]);
      
    }

  }

  async set_language(config_data, callback){
  /*  let language_call = await fetch(this.common_params.get_current_url() + "/assets/data/json/i18n/" + config_data['locale'] + ".json");*/
    let language_call = await fetch(this.common_params.get_current_url() + "/assets/i18n/" + config_data['locale'] + ".json");
    let language_data = await language_call.json();

    sessionStorage.setItem('current_lang', JSON.stringify(language_data));
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    if(callback != undefined && callback !== ""){
      sessionStorage.setItem('system_config', JSON.stringify(config_data));
      callback();
    }
  }

  //This will get he service according to user settings done on Admin Portal
  getMenuRecord(): Observable<any>{
    //this.config_params.product_code = 'CNF';
    if (this.config_params == undefined || this.config_params == "") {
      this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    }
    let jObject = { Menus: JSON.stringify([{ CompanyDBID: this.config_params.admin_db_name ,Product: this.config_params.product_code ,UserCode:  sessionStorage.getItem('loggedInUser') }]) }
    return this.httpclient.post(this.config_params.service_url + "/login/GetMenuRecord", jObject, this.common_params.httpOptions);
  }

  //This will get he service according to user settings done on Admin Portal
  getPermissionDetails(): Observable<any>{
    let jObject = { Permission: JSON.stringify([{ CompanyDBID: this.config_params.admin_db_name ,Product: this.config_params.product_code ,UserCode:  sessionStorage.getItem('loggedInUser') , MenuId:  sessionStorage.getItem('currentMenu') }]) }
    return this.httpclient.post(sessionStorage.getItem('psURL') + "/api/login/GetPermissionDetails", jObject, this.common_params.httpOptions);
  }

  // save session data
  private isLoggedInData = new BehaviorSubject<any>(sessionStorage.getItem('isLoggedIn'));
  currentIsLoggedInDataData = this.isLoggedInData.asObservable();

  public setisLoggedInData() {
    this.isLoggedInData.next(sessionStorage.getItem('isLoggedIn'));
  }

  // set menu data global
  public menuItem = new BehaviorSubject<any>([]);
  currentmenuItemData = this.menuItem.asObservable();

  public setMenuItem(menuItemArr){
    this.menuItem.next(menuItemArr);
  }

  RemoveLoggedInUser(): Observable<any> {
    var jObject = { GUID: sessionStorage.getItem("GUID"), LoginId: sessionStorage.getItem("loggedInUser") };
    sessionStorage.removeItem('authToken');
    return this.httpclient.post(this.config_params.service_url + "/Login/RemoveLoggedInUser", jObject, this.common_params.httpOptions);
  } 

  signOut(toastr: ToastrService, router: Router, Logoutvar){
    let language:any = JSON.parse(sessionStorage.getItem('current_lang'));  

    if(Logoutvar == 'Logout'){
      toastr.error('', language.session_logout, this.common_params.toast_config);
    }
    else {
      toastr.error('', language.session_stopped, this.common_params.toast_config);
    }
    
    /* sessionStorage.clear();
    localStorage.clear(); */
    let login_page = this.common_params.application_path + '/index.html#login';

    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('selectedComp');
    sessionStorage.removeItem('loggedInUser');
    
    // this.router.navigateByUrl('/login');

    setTimeout(()=>{   
      this.setisLoggedInData();
      router.navigateByUrl('/login');
    }, 1000);
  }

  // get company details 
  GetCompanyDetails(selectedCompID): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetPSURL: JSON.stringify([{ CompanyDBID: selectedCompID }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Base/GetCompanyDetails", jObject, this.common_params.httpOptions);
  }

  //Get Server Date
  GetServerDate(): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetPSURL: JSON.stringify([{ CompanyDBID: sessionStorage.getItem('selectedComp') }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Base/GetServerDate", jObject, this.common_params.httpOptions);
  }

  isUnauthorized() {
    this.RemoveLoggedInUser().subscribe();
    this.signOut(this.toastr, this.router, 'Sessionout');
    return;
  }

}
