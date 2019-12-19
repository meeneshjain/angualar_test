import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.toString().toLowerCase().includes(searchText);
        });
    }
    
}

@Pipe({
    name: 'Lookupfilter'
})
export class LookupFilterPipe implements PipeTransform {
  
    transform(items: any[], searchText: string): any[] {
        var transitem=[]
        if (items !== undefined ){
            if (items.length > 0) {
                for (let i = 0; i < items.length; ++i) {

                    transitem.push(Object.values(items[i]))
                }
                if (!transitem) return [];
                if (!searchText) return transitem;
                searchText = searchText.toLowerCase();
                return transitem.filter(it => {
                    return it.toString().toLowerCase().includes(searchText);
                });
            }
        }
       
    }
}
