import { Component, OnInit } from '@angular/core';
import { CommonData } from 'src/app/models/CommonData';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  public commonData = new CommonData();
  imgPath = this.commonData.imgPath;
  constructor() { }

  ngOnInit() {
  }

}
