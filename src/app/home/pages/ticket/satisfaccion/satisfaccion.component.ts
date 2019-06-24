import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-satisfaccion',
  templateUrl: './satisfaccion.component.html',
  styleUrls: ['./satisfaccion.component.scss']
})
export class SatisfaccionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  imprimir( div: any ) {
    const contenido = document.getElementById( div ).innerHTML;
    let ventana = window.open('', 'IMPRIMIR', 'height=100%;' );
    ventana.document.open();
    ventana.document.write(
      `
        <html>
          <head>
            <title>Satisfacción</title>
          </head>
          <style>
            body {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-around;
                align-items: center;
            }
            .caritas {
                position: relative;
                height: 90vh;
                background-color: #108ee9;
             }
             i {
                font-size: 15rem;
             }
             button {
                 display: none;
             }
          </style>
        </html>
        <body onload="window.print();window.close()">
          ${ contenido }
        </body>
      `
    );
    ventana.document.close();
  }

}
