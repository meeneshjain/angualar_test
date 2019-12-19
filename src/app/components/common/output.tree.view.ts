import { Component, Input } from '@angular/core';
import { OutputComponent } from '../../components/output/output.component';

@Component({
    selector: 'formelementstreeview',
    template: `
     <ul>
     <li class="tree_label_li" *ngFor="let inner_element of tree_data_json; let i= index;" style="display:none;">
     <div class="has_elements" *ngIf="form_tree_get_children(inner_element.component).length > 0">
        <span class="parent_span"> 
            <i class="btn btn-sm expand_cllapse_click fa" data-visible="0"></i>
            <span class="tree_label"> {{inner_element.component}}  </span>
        </span>
        <formelementstreeview [tree_data_json]="form_tree_get_children(inner_element.component)" [complete_dataset]="complete_dataset" ></formelementstreeview>
    </div>
    <div *ngIf="form_tree_get_children(inner_element.component).length == 0">
        <span>
            <input type="{{inner_element.element_type}}" name="tree_el_{{inner_element.parentId}}" #treeinput value="{{inner_element.component}}"  (click)="on_element_input_change(inner_element,treeinput.checked)"  [(checked)]="inner_element.checked">
            <span class="tree_label">{{inner_element.component}}</span>
        </span>
    </div>
    </li>
    </ul>
    `,

})

export class FormElementTreeViewComponent {
    
    @Input() tree_data_json;
    @Input() complete_dataset;

    log(data) {
        console.log(data);
    }
    constructor(private OutputObject: OutputComponent) { }

    form_tree_get_children(component) {
        let data = this.complete_dataset.filter(function (obj) {
            return obj['parentId'] == component;
        });
        return data;
    }

    on_element_input_change(data,value) {
   //     this.OutputObject.on_element_input_change(data,value)
      }
}