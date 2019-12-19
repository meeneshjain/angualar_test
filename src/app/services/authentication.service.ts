import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public config_params: any;
  common_params = new CommonData();
  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }



  //Login function to hit login API
  login(loginCredentials: any, psURL: string): Observable<any> {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { Login: JSON.stringify([{ User: loginCredentials.userName, Password: loginCredentials.password, IsAdmin: false }]) };
    //Return the response form the API  
    return this.httpclient.post(psURL + "/login/ValidateUserLogin", jObject, this.common_params.httpOptions);
  }

  // //This function will get Company acc. to User
  getCompany(loginCredentials: any, psURL: string): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    //Product: this.config_params.product_code
    let jObject: any = { Username: JSON.stringify([{ Username: loginCredentials.userName, Product: this.config_params.product_code }]) };
    //Return the response form the API  
    return this.httpclient.post(psURL + "/login/GetCompaniesAndLanguages", jObject, this.common_params.httpOptions)
  }

  //Get psURL
  getPSURL(): Observable<any> {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    let admin_db = this.config_params.admin_db_name;
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { GetPSURL: JSON.stringify([{ CompanyDBID: admin_db }]) };
    //Return the response form the API 
    return this.httpclient.post(this.config_params.service_url + "/Base/GetPSURL", jObject, this.common_params.httpOptions);
  }

  //Get currency code
  /*   getCurrencyCode(selectedCompID): Observable<any> {
     this.config_params = JSON.parse(sessionStorage.getItem('system_config')); 
     //JSON Obeject Prepared to be send as a param to API
     let jObject: any = { GetPSURL: JSON.stringify([{ CompanyDBID: selectedCompID }]) };
     //Return the response form the API 
      return this.httpclient.post(this.config_params.service_url + "/Base/GetCompanyDetails", jObject, this.common_params.httpOptions);
   } */


  getLicenseData(compId: string, loginCredentials: any): Observable<any> {

    let jObject = {
      LoginId: loginCredentials.userName,
      CompanyId: compId
    };
    return this.httpclient.post(this.config_params.service_url + "/Login/GetLicenseData", jObject, this.common_params.httpOptions);
  }



  RemoveLoggedInUser(): Observable<any> {
    var jObject = { GUID: sessionStorage.getItem("GUID"), LoginId: sessionStorage.getItem("loggedInUser") };
    return this.httpclient.post(this.config_params.service_url + "/Login/RemoveLoggedInUser", jObject, this.common_params.httpOptions);
  }
}



