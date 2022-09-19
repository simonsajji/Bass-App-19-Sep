import { Component, OnInit,Input} from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent implements OnInit {
  
  @Input() higherWidth:any;
  @Input() lowerWidth:any;
  @Input() gridColumn:any;
  @Input() loaderDatas:any;
  constructor() { }

  ngOnInit(): void {
  }

}
