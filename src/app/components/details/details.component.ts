import { Component, OnInit,OnChanges,Input,Output, EventEmitter } from '@angular/core';
import { MoveService } from 'src/app/services/move.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit,OnChanges{

  @Input() branches:any;
  @Input() branchData:any;
  @Input() loader:any;
  @Input() selectedBranch:any;
  @Input() selectedRoute:any;
  @Input() branchView:any;
  @Input() locationsView:any;
  @Input() routesView:any;
  // @Input() draggeditem:any;
  @Input() dataloader:any;

  @Output() onRightClkEvnt = new EventEmitter<any>();
  @Output() selectRouteEvent = new EventEmitter<any>();
  @Output() selectLocationEvent = new EventEmitter<any>();
  draggeditem:any;
  constructor(private moveService:MoveService) { }

  ngOnInit(): void {
    this.moveService.getDraggedItems().subscribe((item:any) => {
      this.draggeditem = item;
    })
  }

  ngOnChanges(){
  }

  chooseRoute(route:any){
    this.selectRouteEvent.emit(route);
  }

  onRightClick(ev:any,route:any){
    ev?.preventDefault();
    this.onRightClkEvnt.emit(route);
  }

  itemDragged(location:any){
    console.log(this.draggeditem)
  }

  selectLocation(ev:any,item:any){
    // this.selectLocationEvent.emit(location);
    console.log(item)
    if(item?.selected){
      item.selected = false;
      this.draggeditem = this.draggeditem.filter((loc:any)=>{
        if(item?.LocationId != loc?.LocationId) return item 
      });
      this.moveService.setDraggedItems(this.draggeditem)
    }
    else{
      item.selected = true;
      if(item?.LocationId){
        this.draggeditem?.push(item);
        this.moveService.setDraggedItems(this.draggeditem)

      }
      else{ 
        this.draggeditem = [];
        this.moveService.setDraggedItems(this.draggeditem)
      }
      console.log(this.draggeditem)
    }
  }

  clearSelectedLocations(){
    this.draggeditem = [];
    this.moveService.setDraggedItems(this.draggeditem);
    this.selectedRoute?.Locations?.forEach((element:any) => {
      element.selected = false;
      
    });
  }


}
