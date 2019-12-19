import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class FeaturebomService {
  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;

  constructor(private httpclient: HttpClient) { 
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  getFeatureList(): Observable<any> {
    console.log(' in  service');

    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"),
    UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetFeatureList", jObject, this.common_params.httpOptions);
  }

  getFeatureDetails(feature_code,press_location,index): Observable<any>{
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, featureCode: feature_code ,pressLocation:press_location,rowid:index,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
      return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetFeatureList", jObject, this.common_params.httpOptions);
  }

  getItemDetails(ItemKey): Observable<any>{
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, ItemKey: ItemKey, 
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
      return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetItemList", jObject, this.common_params.httpOptions);
  }

  SaveModelBom(SaveData): Observable<any>{
    SaveData[0]['GUID'] = sessionStorage.getItem("GUID");
    SaveData[0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
    let jObject: any = { AddModelBom: JSON.stringify(SaveData)};
      return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/AddUpdateFeatureBOMData", jObject, this.common_params.httpOptions);
  }

  getAllViewDataForFeatureBom(search:string,PageNumber:any,record_per_page:any): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, SearchString:search,PageNumber:PageNumber, PageLimit:record_per_page,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetDataForCommonView", jObject, this.common_params.httpOptions);
  }

  DeleteData(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem:  JSON.stringify(id)  };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/DeleteFeatureFromHDRandDTL", jObject, this.common_params.httpOptions);
  }

  GetDataByFeatureId(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,FeatureId:id, GUID: sessionStorage.getItem("GUID"),
    UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetDataByFeatureId", jObject, this.common_params.httpOptions);
  }

  UploadFeatureBOM(form:FormData): Observable<any> {
    let req=new HttpRequest('POST',this.config_params.service_url + "/FeatureBOM/UploadFeatureBOMAttachments",form);  
    return this.httpclient.request(req);
    
  }
  onFeatureIdChange(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,FeatureId:id,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckValidFeatureIdEnteredForFeatureBOM", jObject, this.common_params.httpOptions);
  }
  onItemIdChange(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,ItemCode:id,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckValidItemEnteredForFeatureBOM", jObject, this.common_params.httpOptions);
  }

  GetDataForExplodeViewForFeatureBOM(CompanyDBID,featureId,featureDisplayName): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: CompanyDBID,FeatureID: featureId, featureDisplayName: featureDisplayName,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetDataForExplodeViewForFeatureBOM", jObject, this.common_params.httpOptions);
  }

  ViewAssosciatedBOM(featureId): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,FeatureID: featureId,GUID: sessionStorage.getItem("GUID"),
     UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/ViewAssosciatedBOM", jObject, this.common_params.httpOptions);
  }

  checkFeaturesAlreadyAddedinParent(enteredFeatureID,parentFeatureID): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,parentFeatureID: parentFeatureID, enteredFeatureID: enteredFeatureID,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckFeaturesAlreadyAddedinParent", jObject, this.common_params.httpOptions);
  }

  GetPriceList(ItemKey): Observable<any> {
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,ItemKey:ItemKey,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetPriceListForFeatureBOM", jObject, this.common_params.httpOptions);
  }

  CheckValidPriceListEntered(ItemKey,priceListName): Observable<any> {
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,ItemKey:ItemKey, PriceListName:priceListName,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckPriceList", jObject, this.common_params.httpOptions);
  }
}
