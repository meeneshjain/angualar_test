import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class ModelbomService {

  config_params: any;
  common_params = new CommonData();
  public logged_in_company = "";
  
  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }
  
 

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    })
  }

  /* post_data_with_file(input_file_obj: File, modelbom_data): Observable<any> {
    console.log(' in  post_data_with_file');
    console.log(input_file_obj);
    console.log(input_file_obj.name);
    
    
    let form_data: FormData = new FormData();
    form_data.append('file', input_file_obj, input_file_obj.name);
    console.log('form_data');
    console.log(form_data);
    
    this.logged_in_company = sessionStorage.selectedComp;
    // let jObject = { file_data: form_data, ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, modelbom_data: modelbom_data }]) };
    let jObject = { form_data };
    console.log(jObject);
    
    return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/GetBomModel/", input_file_obj, this.httpOptions);
  } */

  GetModelList(): Observable<any> {
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, GUID: sessionStorage.getItem("GUID"),
    UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetModelList", jObject, this.common_params.httpOptions);
  }

  getModelDetails(model_code,press_location,index): Observable<any>{
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelID: model_code ,pressLocation:press_location,rowid:index,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
      return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetModelList", jObject, this.common_params.httpOptions);
  }

  getModelFeatureDetails(feature_code,press_location,index): Observable<any>{
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, featureCode: feature_code ,pressLocation:press_location,rowid:index,
      GUID: sessionStorage.getItem("GUID"),UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
      return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetFeatureList", jObject, this.common_params.httpOptions);
  }

  getItemDetails(ItemKey): Observable<any>{
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, ItemKey: ItemKey,GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
      return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetItemList", jObject, this.common_params.httpOptions);
  }

  SaveModelBom(SaveData): Observable<any>{
    SaveData["ModelData"][0]['GUID'] =  sessionStorage.getItem("GUID");
    SaveData["ModelData"][0]['UsernameForLic'] =  sessionStorage.getItem("loggedInUser");

    var jObject = { AddModel: JSON.stringify(SaveData) };

    //let jObject:any={ AddModel: JSON.stringify(SaveData), RuleModel: JSON.stringify(RuleData)};

      return this.httpclient.post(this.config_params.service_url + "/ModelBOM/AddUpdateModelBOM", jObject, this.common_params.httpOptions);
  }

  getAllViewDataForModelBom(search:string,PageNumber:any,record_per_page:any): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, SearchString:search,PageNumber:PageNumber, PageLimit:record_per_page,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetDataForCommonViewForModelBOM", jObject, this.common_params.httpOptions);
  }

  GetPriceList(ItemKey): Observable<any> {
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { PriceList: JSON.stringify([{ CompanyDBID: this.logged_in_company,ItemKey:ItemKey,GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetPriceList", jObject, this.common_params.httpOptions);
  }

  GetDataByModelId(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company,ModelId:id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetDataByModelID", jObject, this.common_params.httpOptions);
  }

  DeleteData(clicked_model_id): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { DeleteModel: JSON.stringify(clicked_model_id) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/DeleteModelBOMFromHDRandDTL", jObject, this.common_params.httpOptions);
  }

  GetDataForExplodeViewForModelBOM(CompanyDBID,modelID,modalDesc): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: CompanyDBID,ModelID: modelID ,ModelDisplayName: modalDesc,GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetDataForExplodeViewForModelBOM", jObject, this.common_params.httpOptions);
  }

  getRuleLookupList(id): Observable<any>{
    let current_date = new Date();
    let formatted_date: any = (current_date.getFullYear()) + '/' + (current_date.getMonth() + 1) + '/' + current_date.getDate();
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelId: id, currentDate: formatted_date ,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetAllRules", jObject, this.common_params.httpOptions);
  }

  getRuleOutput(rule_id, seq_id): Observable<any> {
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBId: this.logged_in_company, RuleId: rule_id, SeqId: seq_id }]) };
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetOutputDataForRule", jObject, this.common_params.httpOptions);
  }

  onModelIdChange(code): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { ModelList: JSON.stringify([{ CompanyDBID: this.logged_in_company,ModelCode:code,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/CheckValidModelEntered", jObject, this.common_params.httpOptions);
  }

  onFeatureIdChangeModelBom(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company,FeatureId:id,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckValidFeatureIdEnteredForFeatureBOM", jObject, this.common_params.httpOptions);
  }
  
  onItemIdChangeModelBom(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company,ItemCode:id,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckValidItemEnteredForFeatureBOM", jObject, this.common_params.httpOptions);
  }

  CheckModelAlreadyAddedinParent(enteredModelID,parentModelID): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company,parentModelID: parentModelID, enteredModelID: enteredModelID,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/CheckModelAlreadyAddedinParent", jObject, this.common_params.httpOptions);
  }
  onVerifyOutput(VerifyData): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject:any = { GetData: JSON.stringify( VerifyData) };
    // let jObject:any = { GetData: JSON.stringify([{ VerifyData: VerifyData , GUID: sessionStorage.getItem("GUID"),
    //  UsernameForLic: sessionStorage.getItem("loggedInUser") }])};
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/VerifyOutput", jObject, this.common_params.httpOptions);
  }

  CheckMaxSelectedValue(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company,featureId:id,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetMaxSelectableForFeature", jObject, this.common_params.httpOptions);
  }

  CheckMaxSelectedValueForModel(id): Observable<any> {
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company,ModelId:id,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetMaxSelectableForModel", jObject, this.common_params.httpOptions);
  }

  CheckValidPriceListEntered(ItemKey,priceListName): Observable<any> {
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company,ItemKey:ItemKey, PriceListName:priceListName ,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckPriceList", jObject, this.common_params.httpOptions);
  }
}
