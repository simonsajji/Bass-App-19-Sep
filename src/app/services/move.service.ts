import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MoveService {

  draggedItem:any = new BehaviorSubject<any>([]);
  constructor() { }

  getDraggedItems(){
    return this.draggedItem.asObservable();
  }

  setDraggedItems(temp: any){
    return this.draggedItem.next(temp);
  }
}
