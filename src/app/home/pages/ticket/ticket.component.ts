import {AfterViewInit, Component, OnInit} from '@angular/core';
import { distanceInWords } from 'date-fns';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, AfterViewInit {
  time = distanceInWords( new Date(), new Date() );
  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }/*,
    {
      key: '4',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '5',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '6',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '7',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '8',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }*/
  ];
  data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const card: any = document.getElementById('card__ticket');
    const cardRight: any = document.getElementById('card__right');
    const cardExtra: any = card.querySelector('.ant-card-extra');
    const cardExtraRight: any = cardRight.querySelector('.ant-card-extra');
    const cardBody: any = card.querySelector('.ant-card-body');
    const cardList: any = card.querySelector('.ant-spin-nested-loading');
    const cardFooter: any = card.querySelector('.ant-list-footer');
    cardExtra.style.width = '100%';
    cardBody.style.padding = '0px';
    cardList.style.height = '65vh';
    cardList.style.overflow = 'auto';
    cardFooter.style.paddingBottom = '0px';
    cardExtraRight.style.width = '100%';
  }

}
