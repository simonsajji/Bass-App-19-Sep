import { Component, OnInit,Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {
    '(document:click)': '(onBodyClick($event))'
  }
})
export class HeaderComponent implements OnInit {
  
  @Input() currentAccount:any;
  dropDown:any;
  @Output() logEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {}

  onBodyClick(event:any): void {
    if (event.target.classList[0] !== 'no-close') {
      this.dropDown = false;
    }
  }

  logOut(ev:any){
    this.logEvent.emit(ev);
  }

}
