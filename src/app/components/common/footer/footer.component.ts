import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor(private CommonService: CommonService) { }
  showFooter: boolean;
  config_data = JSON.parse(sessionStorage.getItem('system_config'));
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  
  ngOnInit(){ 

    this.CommonService.currentIsLoggedInDataData.subscribe(
      (data) => {
          this.showFooter = data;
          }
     );

  }

  ngOnChanges() {  }

}
