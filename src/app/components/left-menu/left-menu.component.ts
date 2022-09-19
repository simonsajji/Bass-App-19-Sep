import { AnimationStyleMetadata } from '@angular/animations';
import { Component, OnInit,Input,Output,EventEmitter, HostListener } from '@angular/core';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrServices } from 'src/app/services/toastr.service';
import { MoveService } from 'src/app/services/move.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import {fromEvent} from 'rxjs';


@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})



export class LeftMenuComponent implements OnInit {

  @Input() branchData:any;
  @Input() selectedRoute:any;
  @Input() selectedBranch:any;
  @Input() branchView:any;
  @Input() locationsView:any;
  @Input() routesView:any;
  @Input() draggeditem:any;
  @Output() branchSelectEvent = new EventEmitter<any>();
  @Output() fetchAllRoutesEvent = new EventEmitter<any>();
  @Output() selectBranchLocationEvent = new EventEmitter<any>();
  @Output() selectRouteEvent = new EventEmitter<any>();
  dropArea:any;
  dropPoint:any;
  dragActive:boolean = false;
  xPos:any;
  yPos:any;
  constructor(private dialog: MatDialog,private toastr: ToastrServices,private moveService:MoveService,private apiService:ApiService) { }

  ngOnInit(): void {
    this.moveService.getDraggedItems().subscribe((item:any) => {
      this.draggeditem = item;
    });
  }

  shrinkBranch(branch:any){
    this.branchData?.forEach((element:any)=>{
      if(element?.BranchId == branch?.BranchId) element.dropped = false;
    })
  }

  expandBranch(branch:any){
    // this.shrinkAllBranches();
    this.branchData?.forEach((element:any)=>{
      if(element?.BranchId == branch?.BranchId) element.dropped = true;
      // else element.dropped = false;
    })
  }

  currentbranchSelect(branch:any){
    this.branchSelectEvent.emit(branch);
  }

  getAllRoutesofBranch(branch:any,view:any){
    this.fetchAllRoutesEvent.emit({branch:branch,view:view})
  }

  selectBranchLocation(branch:any){
    this.selectBranchLocationEvent.emit(branch);
  }

  allowDrop(ev:any,route:any) {
    ev.preventDefault();
    this.dropPoint = route;
    this.dragActive = true;
    var x = this.xPos;
    var y = this.yPos;
    console.log(x,y)
    var newposX = x - 60;
    var newposY = y - 60;
    let el = document?.getElementById('circle');
    let d = document.getElementById("drp")
    let rect = ev?.target.getBoundingClientRect();
    let xnew = ev?.clientX - rect.left; //x position within the element.
    let ynew = ev?.clientY - rect.top;
    // console.log(ev?.clientX)
 
    // if(el) el.style.transform = "translate(" + (newposX - 7) + "px," + (newposY - 7) + "px)";
    // if(el) el.style.top = (d?.clientTop) + "px";
    // if(el) el.style.left = (d?.clientLeft) + "px" ;
    if(el){
      // el.clientTop = ev?.clientY;
      // if(el) el.style.transform = "translate(" + (newposX - 7) + "px," + (newposY - 7) + "px)";
    }
    el?.classList.remove('d-none');
  }

  getDivPosition(event:any){ 
    var x = event.clientX; 
    var y = event.clientY; 
    console.log(x,y);
    let el = document?.getElementById('circle');
    if(el) el.style.top = y + "px";
    if(el) el.style.left = x + "px";
    this.dragActive = true;
    if(el?.classList.contains('v-hidden')) el?.classList.remove('v-hidden');
  } 

  leaveDropArea(ev:any){
    let el = document?.getElementById('circle');
    el?.classList.add('v-hidden');
  }

  itemDrop(ev:any,route:any){
    this.dropArea = route;
    this.dragActive = false;
    let el = document?.getElementById('circle');
    el?.classList.add('v-hidden');
    if(this.draggeditem.length>0 && this.dropArea && (this.dropArea?.RouteId != this.draggeditem[0]?.RouteId)) this.moveLocation();
    this.dropPoint = null;
  }

  moveLocation(){
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: {
        message: `Are you sure want to Move ${this.draggeditem.length} Locations from ${this.draggeditem[0]?.RouteName} to ${this.dropArea?.RouteName}?`,
      },
      width: '26%',
      height : '23%',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed == true) {
        // remove location from current route
        console.log(this.draggeditem)
        this.branchData?.forEach((element:any) => {
          element?.Routes?.forEach((route:any)=>{
              this.draggeditem?.forEach((item:any)=>{
               route.Locations =  route?.Locations?.filter((loc:any,index:any)=>{return (loc?.LocationId != item?.LocationId)})
              })              
            // })
          })
        });
         // also remove it from selectedRoute
         this.draggeditem?.forEach((item:any)=>{
           this.selectedRoute.Locations =  this.selectedRoute?.Locations?.filter((loc:any,index:any)=>{return (loc?.LocationId != item?.LocationId)})
        })  
        // add location from new route
        this.branchData?.forEach((element:any) => {
          element?.Routes?.forEach((route:any)=>{
            if(this.dropArea?.RouteId == route?.RouteId) route?.Locations?.push(...this.draggeditem)
          })
        });
        this.toastr.success(`Moved  ${this.draggeditem.length} Locations to Route ${this.dropArea?.RouteName}  successfully`);
        this.draggeditem = [];// need to set it in service
        this.moveService.setDraggedItems([])
        this.dropArea = null;
        this.dropPoint = null;
      }
      this.moveApiLocation();
    });
    
  }

  moveApiLocation(){
    let params = [
      {
          "ItemId": 10,
          "ItemName": "loc010",
          "SourceBranchId": 2,
          "TargetBranchId": 3,
          "SourceRouteId": 4,
          "TargetRouteId": 5,
          "SourceTechnicianId": 6,
          "TargetTechnicianId": 7,
          "InitiatorId": 80
      },
      {
          "ItemId": 11,
          "ItemName": "loc110",
          "SourceBranchId": 2,
          "TargetBranchId": 3,
          "SourceRouteId": 4,
          "TargetRouteId": 5,
          "SourceTechnicianId": 6,
          "TargetTechnicianId": 7,
          "InitiatorId": 81
      }
  ]
    this.apiService.post(`http://bassnewapi.testzs.com/api/Branch/LocationMoveBetweenRoute`,params).subscribe((res)=>{
    console.log(res)
    })
  }

  moveLocationOnClick(ev:any){
    if(this.draggeditem && this.dropArea) this.moveLocation();
  }


  getLocationsofRoute(route:any){
    console.log(route?.RouteId);
    this.apiService.get(`http://bassnewapi.testzs.com/api/Branch/LocationList/${route?.RouteId}`).subscribe((res)=>{
      route.Locations = res;
      route.isrouteDropped = true;
      route?.Locations.forEach((item:any)=>{
        item.selected = false;
      })
      console.log(this.branchData);
    })
  }

  selectRoute(route:any){
    this.selectRouteEvent.emit(route);

  }

}
