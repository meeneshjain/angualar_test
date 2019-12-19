import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/services/common.service";
import { ToastrService } from 'ngx-toastr';
import { CommonData } from "../../../models/CommonData";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
  
})
export class SidebarComponent implements OnInit {

  imgPath = 'assets/images';

  constructor(private commonService: CommonService, private toastr: ToastrService, private router: Router) { }
  public menu_obj:any = [];
  public menu_options: any = [];
  project_name: any = 'OptiPro Configurator';
  showSidebar: boolean ;
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  private commonData = new CommonData();

  selectedItem: string='home';

  ngOnInit() { 

    this.commonService.currentIsLoggedInDataData.subscribe(
      (data) => {
          this.showSidebar = data;
          }
     );

    // get current url with last word
    let getURL = window.location.href;
    //console.log(getURL);
    this.menu_options = [
      { "menu_code": "200", "menu_title": this.language.itemcodegeneration, "router_link": "item-code-generation/view", "icon_path": this.imgPath + "/leftpanel/code.svg ", "chkURL": "item-code-generation" },
      { "menu_code": "201", "menu_title": this.language.model_feature_master, "router_link": "feature/model/view", "icon_path": this.imgPath + "/leftpanel/featuremodel.svg", "chkURL": "model" },
      { "menu_code": "202", "menu_title": this.language.feature_Bom, "router_link": "feature/bom/view", "icon_path": this.imgPath + "/leftpanel/featureBOM.svg", "chkURL": "bom" },
      { "menu_code": "203", "menu_title": this.language.Model_Bom, "router_link": "modelbom/view", "icon_path": this.imgPath + "/leftpanel/modelBOM.svg", "chkURL": "modelbom" },
      { "menu_code": "204", "menu_title": this.language.rule_workbench, "router_link": "rulewb/view", "icon_path": this.imgPath + "/leftpanel/ruleworkbench.svg", "chkURL": "rulewb" },
      { "menu_code": "206", "menu_title": this.language.routing, "router_link": "routing/view", "icon_path": this.imgPath + "/leftpanel/routing.svg", "chkURL": "routing" },
      { "menu_code": "207", "menu_title": this.language.archiving, "router_link": "archiving/configuration", "icon_path": this.imgPath + "/leftpanel/archive.svg", "chkURL": "archiving" }, 
      { "menu_code": "205", "menu_title": this.language.config_wizard, "router_link": "output/view", "icon_path": this.imgPath + "/leftpanel/configure.svg", "chkURL": "output" } 
    ]
    let chkISFeature = getURL.includes('feature');
    let partsOfUrl = getURL.split('/');
    //this.selectedItem = partsOfUrl[partsOfUrl.length - 1];

    if(chkISFeature==true){
      this.selectedItem = partsOfUrl[5];
    }else{
      this.selectedItem = partsOfUrl[4];
    }

    this.commonService.getMenuRecord().subscribe(
      data => {
        if (data != null) {
          let allowed_menus_ids =["0"];
          for(let menu_item of data){
            allowed_menus_ids.push(menu_item.OPTM_MENUID);
          }

          for(let menu_data of this.menu_options){
            if(allowed_menus_ids.indexOf(menu_data.menu_code) !== -1){
             this.menu_obj.push(menu_data);
           }
          }
        }
      },
      error =>{
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return
      }
    )
   
  }

  //On Menu Press
  
  onMenuPress(pressedMenu, newValue, getchkValue){
    sessionStorage.setItem('currentMenu',pressedMenu[0].menu_code);
    this.selectedItem = getchkValue;
  }

  onMenuPressHome(modulename){
    this.selectedItem = modulename;
  }

  //Core Functions
  //This will get the menu code and rertun the filterd row
  getMenuDetails(menu_code){
    return this.menu_options.filter(e => e.menu_code == menu_code);
  }

  //get record from DB

  /* getMenuRecord(){
    this.commonService.getMenuRecord().subscribe(
      data => {
        if (data != null) {
          let allowed_menus_ids =["0"];

          for(let menu_item of data){
            allowed_menus_ids.push(menu_item.OPTM_MENUID);
          }
   
          for(let menu_data of this.menu_options){
           if(allowed_menus_ids.indexOf(menu_data.menu_code) !== -1){
             this.menu_obj.push(menu_data);
           }
          }
        }
      },
      error =>{
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonService.isUnauthorized();
        } else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        }
        return
      }
    )
  }*/
}
