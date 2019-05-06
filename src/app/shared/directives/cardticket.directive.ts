import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appCardticket]'
})
export class CardticketDirective implements OnInit {

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.el.nativeElement.style.display = 'flex';
    this.el.nativeElement.style.justifyContent = 'center';
    this.el.nativeElement.style.borderBottom = '.5px solid #e2e2e2';
    this.el.nativeElement.style.width = '90%';
    this.el.nativeElement.style.margin = '0 auto';
  }
}
