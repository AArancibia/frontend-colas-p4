import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appCard]'
})
export class CardDirective implements OnInit{

  constructor(
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    console.log( this.el.nativeElement.querySelector('ant-list-footer') );
  }
}
