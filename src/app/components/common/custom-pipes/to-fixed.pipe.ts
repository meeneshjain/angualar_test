import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed'
})
export class ToFixedPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (args == "2" ){
      return parseFloat(value).toFixed(2);
    } else if (args == "3") {
      return parseFloat(value).toFixed(3);
    } else if (args == "4") {
        return parseFloat(value).toFixed(4);
    } else  {
        return parseFloat(value).toFixed(3);
    }
  }

}
