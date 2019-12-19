import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'blankhandler'
})
export class BlankhandlerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    
    if(value == null || value == undefined || value == "")
    {
      return "N/A";
    }
    else{
      return value;
    }
  }

}
