import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  isCollapsed = false;
  triggerTemplate: TemplateRef<void> | null = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const bottomLeft: any = document.querySelector('.ant-layout-sider-zero-width-trigger');
    /*bottomLeft.style.position = 'fixed';
    bottomLeft.style.top = '1rem';
    bottomLeft.style.zIndex = '100';*/
  }

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
}
