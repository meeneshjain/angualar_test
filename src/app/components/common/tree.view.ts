import { Component, Input, HostListener, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
    selector: 'treeview',
    template: `
     <ul>
        <li class="treeview_li" *ngFor="let innerelement of tree_data_json; let i= index;">  
            <ng-template #template>
                <div class="modal-body text-center image-previe-container">
                    <img [attr.src]="innerelement.modalImage"  style="max-width:100%">
                </div>
            </ng-template>
            <ng-template #popTemplate>
                <div class="text-center">
                  <img *ngIf="!innerelement.modalImage==''" [attr.src]="innerelement.modalImage" height="100" (click)="openModal(template)">
                  <div *ngIf="innerelement.modalImage=='' || innerelement.modalImage== undefined " class="no-img-msg">No Image Found</div>
                </div>
              </ng-template>
            <span 
            [popover]="popTemplate"
            container="body"
            [outsideClick]="true"            
              popoverTitle="{{innerelement.component}}"
              placement="left"
              triggers="" #pop="bs-popover"> 
              <span #btn (click)="childExpand(btn)" class="expand-btn" *ngIf="get_childrens(innerelement.unique_key, innerelement.level).length > 0"></span>
              
              <span [attr.data-branchtype]="innerelement.branchType" (click)="pop.toggle()">{{innerelement.component}}</span>

              <ng-container *ngIf="innerelement.branchType !='operation' && innerelement.component!=''">
                  <span class="opration-type" *ngIf="innerelement.branchType !='value' && innerelement.operation_no !=''">{{innerelement.operation_no}}</span>
              </ng-container>
              <span class="opration-type" *ngIf="innerelement.branchType =='operation' && innerelement.operation_no != '' ">{{innerelement.operation_no}}</span>
            </span>
            <treeview #tree style="display:none" [tree_data_json]="get_childrens(innerelement.unique_key, innerelement.level)" [complete_dataset]="complete_dataset" *ngIf="get_childrens(innerelement.unique_key, innerelement.level).length > 0"></treeview>

    </ul>
    `,

})

export class TreeViewComponent {
    @Input() tree_data_json;
    @Input() complete_dataset;

    @HostListener('window:scroll, scroll', ['$event'])
    onScroll($event, pop: any) {
        $('body').click()
    }
    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) { }

    openModal(template: TemplateRef<any>) {
        $('body').click()
        this.modalRef = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
    }

    log(data) {
        console.log(data);
    }
    ngOnInit() {
        $('[data-toggle="popover"]').popover({
            container: 'body',
            trigger: 'hover'
        })
    }

    get_childrens(unique_key, current_level) {
        var next_level = (parseInt(current_level) + 1);
        let data = [];
        if (unique_key != "" && unique_key != null && unique_key != undefined) {
            data = this.complete_dataset.filter(function (obj) {
                return obj['node_id'] == unique_key; //  && obj.level == next_level;
            });
        }
        return data;
    }
    // if (
    //     this.isOpen
    //     && !this._er.nativeElement.contains(event.target)
    //     && !this.popover._popover!._componentRef!.location.nativeElement!.contains(event.target)
    //   ) {
    //     this.hide();
    //   }
    childExpand(id: any) {
        id.classList.toggle("expanded")
        if (id.parentNode.parentNode.childNodes[4].style.display === "none") {
            id.parentNode.parentNode.childNodes[4].style.display = "block";
        } else {
            id.parentNode.parentNode.childNodes[4].style.display = "none";
        }
    }
}