import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {
  @Input() x=0;
  @Input() y=0;
  @Output() moveEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {}

  move(ev:any){
    this.moveEvent.emit(ev);
  }

  

}
