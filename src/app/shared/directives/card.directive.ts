import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appCard]'
})
export class CardDirective implements OnInit{

  constructor(
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    const card: any = this.el.nativeElement;
    console.log( card );
    //const cardExtraRight: any = card.querySelector('.ant-card-extra');
    //cardExtraRight.style.width = '100%';
  }
}
