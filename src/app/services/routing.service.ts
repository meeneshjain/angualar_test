import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;

  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  get_all_routing_data(): Observable<any> {
    let jObject = { Routing: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp ,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/GetAllRoutingData", jObject, this.common_params.httpOptions);
  }

  get_routing_details(routing_id): Observable<any> {
    let jObject = { Routing: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, RoutingID: routing_id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/GetRoutingService", jObject, this.common_params.httpOptions);
  }

  getFeatureList(): Observable<any> {
  
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/FeatureList", jObject, this.common_params.httpOptions);
  }

  GetModelList(): Observable<any> {
    let jObject:any = { GetData: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp ,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/ModelList", jObject, this.common_params.httpOptions);
  }

  getFeatureDetail(id): Observable<any> {
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, FeatureCode: id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/FeatureDetail", jObject, this.common_params.httpOptions);
  }

  getModalDetail(id): Observable<any> {
    let jObject = { ModelBOMDetail: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, ModelCode: id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/ModelDetail", jObject, this.common_params.httpOptions);
  }

  GetDataByFeatureId(id): Observable<any> {
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, FeatureId: id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/GetDataByFeatureId", jObject, this.common_params.httpOptions);
  }

  GetDataByModelId(id): Observable<any> {
    let jObject = { ModelBOMDetail: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, ModelId: id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/GetDataByModelID", jObject, this.common_params.httpOptions);
  }

  getWarehouseDetail(id): Observable<any> {
    let jObject = { WareHouse: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, WarehouseId: id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/WarehouseDetail", jObject, this.common_params.httpOptions);
  }

  getWarehouseList(): Observable<any> {
    let jObject = { WareHouse: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/WarehouseList", jObject, this.common_params.httpOptions);
  }

  getOperationList(warehouse_id): Observable<any> {
    let jObject = { Operation: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, WarehouseCode : warehouse_id ,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/OperationList", jObject, this.common_params.httpOptions);
  }

  getWCList(warehouse_id): Observable<any> {
    let jObject = { WC: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, WarehouseCode : warehouse_id,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/WCList", jObject, this.common_params.httpOptions);
  }

  getOperationDetail(id, pressLocation, rowid): Observable<any> {
    let jObject = { Operation: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, OperationCode: id, pressLocation: pressLocation, rowid: rowid,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/OperationDetail", jObject, this.common_params.httpOptions);
  }

  getWCDetail(id, pressLocation, rowid): Observable<any> {
    let jObject = { WC: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, WCCode: id, pressLocation: pressLocation, rowid: rowid,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/WCDetail", jObject, this.common_params.httpOptions);
  }

  getResourceList(wc_code): Observable<any> {
    let jObject = { Resource: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, WCCode: wc_code,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/ResourceList", jObject, this.common_params.httpOptions);
  }

  getResourceDetail(ResourceCode): Observable<any> {
    let jObject = { Resource: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, ResourceCode: ResourceCode,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/ResourceDetail", jObject, this.common_params.httpOptions);
  }

  getOperationResource(OperationCode): Observable<any> {
    let jObject = { Resource: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, OperationCode: OperationCode,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/OperationResource", jObject, this.common_params.httpOptions);
  }


  SaveUpdateRouting(objDataset): Observable<any> {
    var jObject = { AddEditRouting: JSON.stringify(objDataset) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/AddEditRouting", jObject, this.common_params.httpOptions);
  }

  DeleteRouting(routing_data ): Observable<any> {
      let jObject = { Routing: JSON.stringify(routing_data) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/DeleteRouting", jObject, this.common_params.httpOptions);
  }
 

  TemplateRoutingList(): Observable<any> {
    let jObject = { TemplateRouting: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }])};
    return this.httpclient.post(this.config_params.service_url + "/Routing/TeamplateRoutingList", jObject, this.common_params.httpOptions);
  }

  getResConversionInverse(type, value, resource_id): Observable<any>{
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"), type: type, value: value, resource_id: resource_id }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/CalculateResourceData", jObject, this.common_params.httpOptions);
  }

  TemplateRoutingDetail(template_product_code): Observable<any> {
    let jObject = { TemplateRouting: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, template_product_code: template_product_code, GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/TemplateRoutingDetail", jObject, this.common_params.httpOptions);
  }

  getTreeData(CompanyDBID, routing_id): Observable<any> {
    let jObject = {
      Routing: JSON.stringify([{
        CompanyDBID: CompanyDBID, 
        RoutingID: routing_id,
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    }
    return this.httpclient.post(this.config_params.service_url + "/Routing/getTreeData", jObject, this.common_params.httpOptions);
  }

}
