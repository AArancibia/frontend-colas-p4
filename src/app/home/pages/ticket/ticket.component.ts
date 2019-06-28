import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '@app/core/services/websocket/websocket.service';
import {TicketService} from '@app/core/services/ticket/ticket.service';
import {Ticket} from '@app/core/models/ticket.model';
import { tap } from 'rxjs/operators';
import {Tramite} from '@app/core/models/tramite.model';
import {Tematica} from '@app/core/models/tematica.model';
import {TematicaService} from '@app/core/services/tematica/tematica.service';
import {SnackbarService} from 'ngx-snackbar';
import {TramiteService} from '@app/core/services/tramite/tramite.service';
import {Administrado} from '@app/core/models/administrado.model';
import {DetEstadoTicket} from '@app/core/models/detestadoticket.model';
import {NzNotificationService} from 'ng-zorro-antd';
import {VentanillaService} from '@app/core/services/ventanilla/ventanilla.service';
import {Ventanilla} from '@app/core/models/ventanilla.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, AfterViewInit {
  listTematica: Tematica[] = [];
  listTicket: any[] = [];
  listaTramites: Tramite[] = [];
  mostrarInfoAdministrado: Administrado = new Administrado();
  selectTicket: Ticket;
  validacionEstados: DetEstadoTicket;
  listVentanillas: Ventanilla[] = [];
  idtematica: number;
  idtramite: number;
  ventanilla: number;// Esto solo tiene el id
  derivar: boolean = false;
  ventanillaDerivar: any;
  visible: boolean;
  inputTramites: string;
  inputTematicas: string;
  pasos: number = 0;
  detallesTramite: any;
  activo: number = 0;
  estadoVentanilla: number = 0;
  ventanillaSeleccionada: number;
  constructor(
    private wsSocket: WebsocketService,
    public ticketService: TicketService,
    public tematicaService: TematicaService,
    public tramiteService: TramiteService,
    private notificationService: NzNotificationService,
    private snackBar: SnackbarService,
    private ventanillaService: VentanillaService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.ventanillaService.statusV$
      .pipe(
        tap(
          ( ventanilla: Ventanilla ) => {
            this.listarVentanillas();
            this.listarTematicas();
            this.ventanilla = ventanilla.id;
          }
        ),
      )
      .subscribe();
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    this.listarTickets();
    this.nuevoTicket();
    this.ventanillaAsignadaAlTicket();
    this.nuevoEstadoTicket();
    this.ticketDerivado();
    this.ultimoEstadoVentanilla();
  }

  cambiarTematica( ) {
    this.pasos = 0;
    this.ticketService.actualizarTematicaOrTramite( this.selectTicket.id , {})
      .pipe(
        tap( () => {
          this.selectTicket.idtematica = null;
          this.selectTicket.idtramite = null;
          this.idtramite = null;
        }),
      )
      .subscribe();
  }

  guardarTramite() {
    const ticket: Ticket = {
      ...this.selectTicket,
      //idtramite: this.idtramite,
    };
    const { idtramite, idtematica, id } = ticket;
    this.ticketService.actualizarTematicaOrTramite( id, {
      idtramite,
      idtematica,
    })
      .pipe(
        tap(
          ( ticketDB: Ticket ) => {
            this.notificationService.info(
              'Tramite Asignado', `Tramite ${ this.getTramite( idtramite ) } asignado a ticket ${ this.selectTicket.codigo }`,
              {
                nzStyle: {
                  //marginTop: '2.5rem',
                  //marginRight: '5rem',
                },
              }
            );
            this.idtramite = this.selectTicket.idtramite;
          }
        ),
      )
      .subscribe();
  }

  listarTickets() {
    this.ticketService.obtenerTicketsDia()
      .pipe(
        tap( ( tickets: Ticket[] ) => {
          this.listTicket = tickets.length > 0 ? tickets.filter( ticket => ticket.idventanilla == this.ventanilla || !ticket.idventanilla ) : [];
          const urgentes: Ticket[] = this.listTicket.filter( ( ticket: Ticket ) => ticket.urgente );
          console.log( urgentes );
          const preferenciales: Ticket[] = this.listTicket.filter( ( ticket: Ticket ) => ticket.preferencial );
          if ( preferenciales.length > 0 ) {
            preferenciales.reverse();
            preferenciales.map(
              ( preferencial: Ticket, index, array ) => {
                const ticketIndex = this.listTicket.findIndex( ticket => ticket.codigo == preferencial.codigo );
                console.log( preferencial );
                this.listTicket.splice( ticketIndex, 1 );
                this.listTicket.splice( 1, 0, preferencial );
              }
            );
          }
          console.log( this.listTicket );
          if ( this.listTicket.length > 0 ) {
            this.datosTicket( this.listTicket[ 0 ] );
            this.masDetalle();
          }
        }),
      )
      .subscribe();
  }

  nuevoTicket() {
    this.ticketService.nuevoTicket()
      .pipe(
        tap( ( ticket: Ticket ) => {
          if ( ticket.preferencial ) {
            this.listTicket.splice( 1, 0, ticket );
          } else {
            this.listTicket = [ ...this.listTicket, ticket];
          }
          this.listTicket = [ ...this.listTicket ];
          console.log( this.listTicket );
          if ( this.listTicket.length <= 1 ) {
            this.datosTicket( this.listTicket[ 0 ] );
            this.masDetalle();
          }
        }),
      )
      .subscribe();
  }

  estadosTickets( estado: number ) {
    if ( this.estadoVentanilla === 4 ) return;
    switch ( estado ) {
      // LLAMANDO
      case 2: {
        if ( this.validacionEstados.estadoticketId === 3 ) {
          return;
        } else if ( this.validacionEstados.estadoticketId === 1 || this.validacionEstados.estadoticketId === 2 ) {
          this.snackBar.add({
            msg: `Llamando ticket ${ this.selectTicket.codigo }`,
            background: '#000000',
            color: '#ffffff',
            customClass: '.snack-message',
            action: {
              text: `Quitar`,
              onClick: () => {},
              color: '#108ee9',
            },
            timeout: 3000,
            onRemove: () => { this.snackBar.clear(); }
          });
        }
        this.ticketService.asignarVentanilla( this.selectTicket.id, this.ventanilla )
          .pipe(
            tap( () => this.activo = estado ),
          )
          .subscribe();
        return;
      }
      // ATENDIENDO
      case 3: {
        if ( this.validacionEstados.estadoticketId !== 2 ) return;
        this.ticketService.guardarNuevoEstado( this.selectTicket.id, 3 )
          .pipe(
            tap( () => {
              this.derivar = true;
              this.activo = estado;
            }),
          )
          .subscribe();
        return;
      }
      // ATENDIDO
      case 4: {
        if ( this.selectTicket.idtramite !== this.idtramite ) {
          this.notificationService.error(
            'Notificación', 'No ha guardado los ultimos cambios en Asignar Tramite',
            {
              nzPauseOnHover: true,
            }
          );
          return;
        }
        if ( this.validacionEstados.estadoticketId === 1 ) return;
        const idestado = this.validacionEstados.estadoticketId === 2 ? 6 : 4;
        this.ticketService.guardarNuevoEstado( this.selectTicket.id,  idestado )
          .pipe(
            tap( () => {
              this.activo = 0;
              this.derivar = false;
              this.pasos = 0;
            }),
          )
          .subscribe();
        return;
      }
      // DERIVADO
      case 5: {
        if ( this.ventanillaDerivar == 0 ) return;
        this.ticketService.derivarTicket( this.selectTicket.id, this.ventanillaDerivar )
          .pipe(
            tap( () => {
              this.activo = 0;
              this.ventanillaDerivar = 0;
            }),
          )
          .subscribe();
        return;
      }
    }
  }

  ticketDerivado() {
    this.ticketService.ticketDerivado()
      .pipe(
        tap(
          ( derivado: any ) => {
            console.log( derivado );
            const ticket: Ticket = derivado.ticketaEmitir;
            const ventanillaAntigua = derivado.ventanillaAntigua;
            if ( ticket.idventanilla == this.ventanilla ) {
              this.listTicket.splice( 1 , 0, ticket );
              this.notificationService.config({
                nzPlacement: 'topLeft',
              });
              this.notificationService.info(
                `Ticket Derivado - Correlativo ${ ticket.codigo }`, `Nuevo ticket derivado en tu lista de tickets`
              );
            }
            if ( this.ventanilla == ventanillaAntigua ) {
              const ticketaSacar = this.listTicket.findIndex( ( item: Ticket ) => item.codigo === ticket.codigo );
              this.listTicket.splice( ticketaSacar, 1 );
              this.derivar = false;
              this.pasos = 0;
            }
            this.listTicket = [ ...this.listTicket ];
            this.datosTicket( this.listTicket[ 0 ] );
            if ( this.listTicket[ 0 ] && this.listTicket[ 0 ].idtematica === null ) {
              this.notificationService.create(
                'warning', 'Notificación',
                'Ticket vino sin Tematica',
              );
            }
          }
        ),
      )
      .subscribe();
  }

  nuevoEstadoTicket() {
    this.ticketService.nuevoEstadoTicket()
      .pipe(
        tap( ( ticket: Ticket ) => {
          const indexTicketAtendido = this.listTicket.findIndex( ( item: Ticket ) => item.codigo === ticket.codigo  );
          if ( ticket.idventanilla === this.ventanilla ) {
            this.listTicket.splice( indexTicketAtendido, 1, ticket );
            for ( let i = 0; i <= ticket.estadosIds.length ; i++ ) {
              if ( ticket.estadosIds[ i ] === 4 || ticket.estadosIds[ i ] === 6 ) {
                console.log( 'ya no entras' );
                this.listTicket.splice( indexTicketAtendido, 1 );
                break;
              }
            }
          }
          this.listTicket = [ ...this.listTicket ];
          this.datosTicket( this.listTicket[ 0 ] );
          if ( this.listTicket.length > 0 && ticket.idventanilla === this.ventanilla ) this.masDetalle();
          /*if ( this.listTicket[ 0 ].idtematica === null
            && this.validacionEstados.estadoticketId === 1
            && ticket.idventanilla === this.ventanilla  ) {
            this.notificationService.create(
              'warning', 'Notificación',
              'Ticket vino sin Tematica',
            );
          }*/
        }),
      )
      .subscribe();
  }

  ventanillaAsignadaAlTicket() {
    this.ticketService.ventanillaAsignadaAlTicket()
      .pipe(
        tap(
          ( ticket: Ticket ) => {
            console.log( ticket );
            const indexTicket = this.listTicket.findIndex( ( item ) => item.codigo == ticket.codigo );
            if ( ticket.idventanilla != this.ventanilla ) {
              if ( indexTicket > -1 ) {
                this.listTicket.splice( indexTicket , 1 );
              }
            } else {
              this.listTicket.splice( indexTicket , 1, ticket );
            }
            this.listTicket = [ ...this.listTicket ];
            this.datosTicket( this.listTicket[ 0 ] );
            //console.log( this.listTicket[ 0 ]  );
            if ( ticket.idventanilla === this.ventanilla ) {
              this.masDetalle();
            }
          }
        ),
      )
      .subscribe();
  }

  datosTicket( ticket: Ticket ) {
    //console.log( ticket )
    if ( ticket ) {
      this.selectTicket = ticket;
      this.mostrarInfoAdministrado = { ...this.selectTicket.administrado };
      /*this.idtramite = this.selectTicket.idtramite;
      if ( this.selectTicket.idtematica === null ) {
        this.pasos = 0;
      } else {
        console.log( 'haciendo listar tramite' );
        this.listarTramitePorTematica( this.selectTicket.idtematica );
      }*/
      this.selectTicket.detEstados.sort( ( a, b ) => new Date( b.fecha ).getTime() -  new Date( a.fecha ).getTime() );
      this.validacionEstados = this.selectTicket.detEstados[ 0 ];
      if ( this.validacionEstados.estadoticketId === 3 ) {
        this.derivar = true;
      }
      /*if ( this.selectTicket.idtramite && this.validacionEstados.estadoticketId === 3 ) {
        this.mostrarDetalleTramite( this.selectTicket.idtramite );
        //this.pasos = 2;
      }*/
    } else {
      this.mostrarInfoAdministrado = {};
      this.selectTicket = null;
      this.validacionEstados = null;
      this.idtramite = null ;
    }
  }

  masDetalle() {
    this.idtramite = this.selectTicket.idtramite;
    if ( this.selectTicket.idtematica === null ) {
      this.pasos = 0;
    } else {
      this.listarTramitePorTematica( this.selectTicket.idtematica );
    }

    if ( this.selectTicket.idtramite && this.validacionEstados.estadoticketId === 3 ) {
      this.mostrarDetalleTramite( this.selectTicket.idtramite );
      //this.pasos = 2;
    }
  }

  getTematica( idtematica ) {
    const tematica = this.listTematica.find( item => item.idtematica === idtematica );
    return tematica ? tematica.nombre : '';
  }

  mostrarDetalleTramite( idtramite ) {
    /*if ( this.validacionEstados.estadoticketId === 2 || this.validacionEstados.estadoticketId === 1 ) {
      this.notificationService.remove();
      this.notificationService.create(
        'warning', 'Notificación',
        'Necesita primero atender el ticket',
      );
      return;
    }*/
    this.tramiteService.obtenerDetallesDeTramite( idtramite )
      .pipe(
        tap( ( detalleTramite ) => {
          console.log( detalleTramite );
          this.detallesTramite = detalleTramite;
          //this.idtramite = idtramite;
          this.selectTicket.idtramite = idtramite;
          this.pasos = 2;
        }),
      )
      .subscribe();
  }

  getTramite( idtramite ) {
    const tramite = this.listaTramites.find( item => item.idtramite === idtramite );
    return tramite ? tramite.descripcion : '';
  }

  listarTematicas() {
    this.tematicaService.obtenerTematicas()
      .pipe(
        tap( ( tematicas: Tematica[] ) => this.listTematica = tematicas ),
      )
      .subscribe();
  }

  listarTramitePorTematica( idtematica ) {
    const idtramite = this.selectTicket.idtramite ? this.selectTicket.idtramite : null;
    this.ticketService.actualizarTematicaOrTramite( this.selectTicket.id , {
      idtematica,
      idtramite,
    })
      .pipe()
      .subscribe();
    this.tematicaService.tramitesByTematica( idtematica )
      .pipe(
        tap( ( tramites: Tramite[] ) => {
          this.listaTramites = tramites;
          this.selectTicket.idtematica = idtematica;
          this.pasos = 1;
        }),
      )
      .subscribe();
  }

  listarVentanillas() {
    this.ventanillaService.obtenerVentanillas()
      .pipe(
        tap(
          ( ventanillas: Ventanilla[] ) => {
            this.listVentanillas = ventanillas.filter( ( ventanilla: Ventanilla ) => ventanilla.id !== this.ventanilla );
          }
        ),
      )
      .subscribe();
  }

  bloquearActivarVentanilla( idestado ) {
    if ( this.validacionEstados && this.validacionEstados.estadoticketId > 1 ) return;
    this.ventanillaService.bloquearActivarVentanilla(
      this.ventanilla, idestado
    )
      .pipe(
        tap(
          ( resp: any ) => {
            this.estadoVentanilla = +resp.tbEstadoventanillaId;
          }
        ),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    const card: any = document.getElementById('card__ticket');
    const cardExtra: any = card.querySelector('.ant-card-extra');
    const cardHead: any = card.querySelector('.ant-card-head');
    const cardBody: any = card.querySelector('.ant-card-body');
    const cardList: any = card.querySelector('.ant-spin-nested-loading');
    const cardFooter: any = card.querySelector('.ant-list-footer');
    cardExtra.style.width = '100%';
    cardHead.style.height = '16%';
    cardBody.style.height = '74%';
    cardBody.style.padding = '0px';
    cardList.style.height = '100%';
    cardList.style.overflow = 'auto';
    cardFooter.style.paddingBottom = '0px';
    cardFooter.style.paddingTop = '0px';
    this.renderCardRight();
  }

  renderCardRight() {
    const cardRight: any = document.getElementById('card__right');
    const cardExtraRight: any = cardRight.querySelector('.ant-card-extra');
    cardExtraRight.style.width = '100%';
  }

  ultimoEstadoVentanilla() {
    if ( !this.ventanilla ) return;
    this.ventanillaService.ultimoEstado( this.ventanilla )
      .pipe(
        tap(
          ( estadoVentanilla: any ) => {
            this.estadoVentanilla = estadoVentanilla !== null ? estadoVentanilla.tbEstadoventanillaId : 3;
          }
        ),
      )
      .subscribe();
  }

  mostrarSatisfaccion() {
    //const contenido = document.getElementById( div ).innerHTML;
    let ventana = window.open('', 'IMPRIMIR', 'height=100%;' );
    ventana.document.open();
    ventana.document.write(
      `
        <html>
          <head>
            <title>Satisfacción</title>
            <link rel="stylesheet" href="assets/css/font/flaticon.css">
          </head>
          <style>
            .satisfaccion {
              min-height: 90vh;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 1.5rem;
              width: 30rem;
              border: 1px solid #8d8d8d;;
            }
            
            .satisfaccion__consulta {
              padding: .5rem 0;
            }
            
            .satisfaccion__consulta-caritas {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-around;
                align-items: center;
            }
            
            .satisfaccion__consulta-caritas p {
              text-align: center;
            }
            
            .satisfaccion__consulta-caritas i {
              font-size: 3rem;
            }
            
            .satisfaccion__consulta-pregunta {
                  margin-bottom: .5rem;
            }
            
            .satisfaccion__caja {
                display: flex;
                flex-direction: row;
              }
              
              .satisfaccion__caja h2 {
                text-align: center;
                width: 30%;
              }
              
              .satisfaccion__titulo {
                padding: 0;
                margin-top: .5rem;
                margin-bottom: -.5rem;
                text-align: center;
              }
              .u-margin-top-small {
                margin-top: 2rem;
              }
          </style>
        </html>
        <body onload="window.print();window.close()">
                <div class="satisfaccion">
    <div class="satisfaccion__caja">
      <h2 class="satisfaccion__caja-codigo">${ this.selectTicket.codigo }</h2>
      <p class="satisfaccion__caja-texto">
        Entregar al salir,
        su opinion nos ayuda a mejorar, porque usted nos importa
      </p>
    </div>
    <h1 class="text-center satisfaccion__titulo">
      Medidor de Satisfacción
    </h1>
    <h3 class="text-center satisfaccion__titulo">
      Marque con una "X" o encierre con un circulo "O"
    </h3>
    <div class="u-margin-top-small satisfaccion__consulta">
      <h3 class="satisfaccion__consulta-pregunta">
        ¿La información que se brindó fue útil?
      </h3>
      <div class="u-margin-top-small satisfaccion__consulta-caritas">
        <span>
          <img src="assets/images/001-happy.png" alt="">
          <p>Mal</p>
        </span>
        <span>
          <img src="assets/images/003-surprised.png" alt="">
          <p>Neutral</p>
        </span>
        <span>
          <img src="assets/images/002-sad.png" alt="">
          <p>Bien</p>
        </span>
      </div>
    </div>
    <div class="satisfaccion__consulta">
      <h3 class="satisfaccion__consulta-pregunta">
        ¿Está satisfecho con la atención brindada?
      </h3>
      <div class="u-margin-top-small satisfaccion__consulta-caritas">
        <span>
          <img src="assets/images/001-happy.png" alt="">
          <p>Mal</p>
        </span>
        <span>
          <img src="assets/images/003-surprised.png" alt="">
          <p>Neutral</p>
        </span>
        <span>
          <img src="assets/images/002-sad.png" alt="">
          <p>Bien</p>
        </span>
      </div>
    </div>
    <div class="satisfaccion__consulta">
      <h3 class="satisfaccion__consulta-pregunta">
        ¿Es de su agrado la nueva plataforma?
      </h3>
      <div class="u-margin-top-small satisfaccion__consulta-caritas">
        <span>
          <img src="assets/images/001-happy.png" alt="">
          <p>Mal</p>
        </span>
        <span>
          <img src="assets/images/003-surprised.png" alt="">
          <p>Neutral</p>
        </span>
        <span>
          <img src="assets/images/002-sad.png" alt="">
          <p>Bien</p>
        </span>
      </div>
    </div>
  </div>
        </body>
      `
    );
    ventana.document.close();
  }

  clickMe(): void {
    this.visible = false;
  }

  change(value: boolean): void {
    console.log(value);
  }

}
