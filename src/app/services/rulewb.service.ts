import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class RulewbService {
  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;

  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  GetRuleList(search: any, page_number: any, record_per_page: any): Observable<any> {
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, SearchString: search, PageNumber: page_number, PageLimit: record_per_page ,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetRuleWBDataForCommonView", jObject, this.common_params.httpOptions);
  }

  getFeatureList(): Observable<any> {
    console.log(' in rule service');

    let jObject = { FeatureList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllFeatureForRuleWorkBench", jObject, this.common_params.httpOptions);
  }

  getFeatureBOMHeader(feature_code): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp, FeatureId: feature_code,  GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetFOMbyFID", jObject, this.common_params.httpOptions);
  }

  getFeatureDetails(feature_code, press_location, index): Observable<any> {
    let jObject = { FeatureList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, FeatureId: feature_code, pressLocation: press_location, rowid: index,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllFeatureForRuleWorkBench", jObject, this.common_params.httpOptions);
  }

  GetModelList(): Observable<any> {
    let jObject = { ModelList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"),
    UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllModelsForRuleWorkBench", jObject, this.common_params.httpOptions);
  }


  getFeatureDetailsForOutput(feature_code): Observable<any> {
    let jObject = { FeatureDetails: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, FeatureId: feature_code,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllDetailsForFeature", jObject, this.common_params.httpOptions);
  }

  //save data
  SaveData(Data): Observable<any> {
    Data["single_data_set_header"][0]['GUID'] = sessionStorage.getItem("GUID");
    Data["single_data_set_header"][0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { AddRule: JSON.stringify(Data) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/AddUpdateDataForRuleWorkBench", jObject, this.common_params.httpOptions);
  }

  GetDataByRuleID(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { FeatureList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, RuleId: id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetDataByRuleID", jObject, this.common_params.httpOptions);
  }

  DeleteData(id): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelList: JSON.stringify(id) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/DeleteRule", jObject, this.common_params.httpOptions);
  }

  onFeatureIdChange(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, FeatureId: id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckValidFeatureIdEnteredForFeatureBOM", jObject, this.common_params.httpOptions);
  }

  onModelIdChange(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, ModelCode: id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")  }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/CheckValidModelEntered", jObject, this.common_params.httpOptions);
  }

  get_model_feature_options(id, type): Observable<any> {
    let jObject: any = '';
    if (type == "1") {
      jObject = { FeatureList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, FeatureId: id, Type: type,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    } else if (type == "2") {
      jObject = { FeatureList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, ModelId: id, Type: type,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    }

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllChildOfFeatureModel", jObject, this.common_params.httpOptions);
  }


  onChildFeatureIdChange(type, id, value): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { FeatureList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, type: type, id: id, value: value ,
    GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/CheckValidChildofFeatureModel", jObject, this.common_params.httpOptions);
  }

  onChildModelIdChange(type, id, value): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { FeatureList: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, type: type, id: id, value: value,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/CheckValidChildofFeatureModel", jObject, this.common_params.httpOptions);
  }
}
