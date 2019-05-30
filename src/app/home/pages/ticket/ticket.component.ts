import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {distanceInWords} from 'date-fns';
import {WebsocketService} from '@app/core/services/websocket/websocket.service';
import {TicketService} from '@app/core/services/ticket/ticket.service';
import {NotificacionService} from '@app/shared/components/notification/notificacion.service';
import {Ticket} from '@app/core/models/ticket.model';
import {startWith, tap} from 'rxjs/operators';
import {Tramite} from '@app/core/models/tramite.model';
import {Tematica} from '@app/core/models/tematica.model';
import {TematicaService} from '@app/core/services/tematica/tematica.service';
import {DetEstadoTicket} from '@app/core/models/detestadoticket.model';
import {EstadoTicket} from '@app/shared/enum/estado-ticket.enum';
import {SnackbarService} from 'ngx-snackbar';
import {tick} from '@angular/core/testing';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, AfterViewInit {
  listTematica: Tematica[] = [];
  listTicket: any[] = [];
  listaTramites: Tramite[] = [];
  //listaTramites2: Tramite[] = [];
  mostrarInfoTicket: Tramite = new Tramite();
  idtematica: number;
  ventanilla: any;
  derivar: boolean = false;
  estado: number = -1;
  ventanillaDerivar: number;
  visible: boolean;
  visibleTematica: boolean;
  inputTramites: string;
  inputTematicas: string;
  pasos: number = 0;
  selectTramite: number = 0;
  mostrarTematica: string;
  constructor(
    private wsSocket: WebsocketService,
    public ticketService: TicketService,
    public tematicaService: TematicaService,
    private notificationService: NotificacionService,
    private snackBar: SnackbarService,
  ) {

  }

  clickMe(): void {
    this.visible = false;
  }

  change(value: boolean): void {
    console.log(value);
  }

  ngOnInit() {
    //this.listarTickets();
    this.ventanilla = Number( prompt('Ventanilla' ) );
    this.obtenerListaTickets();
    this.nuevoTicket();
    this.ventanillaAsignadaAlTicket();
    this.listarTematica();
    this.ticketDerivadoOtraVentanilla();
  }

  obtenerListaTickets() {
    this.ticketService.obtenerTicketsDia()
      .pipe(
        tap(( tickets: Ticket[] ) => {
          //this.listTicket = tickets.map( ticket => ticket.idventanilla );
          this.listTicket = tickets.filter( ticket => ticket.idventanilla == this.ventanilla || !ticket.idventanilla );
          console.log( this.listTicket );
        }),
        tap( () => {
          this.llenarInfoTicket();
          this.listarTramiteByTematica();
        })
      )
      .subscribe();
  }

  listarTickets() {
    this.ticketService.obtenerTickets()
    .pipe(
      tap(( tickets: Ticket[] ) => {
        this.listTicket = tickets;
      }),
      tap( () => {
        this.llenarInfoTicket();
        this.listarTramiteByTematica();
      })
    )
    .subscribe();
  }

  nuevoTicket() {
    this.ticketService.nuevoTicket()
      .pipe(
        tap( ( ticket: Ticket ) => {
          ticket.detestadotickets.splice( 0 );
          ticket.detestadotickets.push( { idticket: ticket.idticket, idestado: 1 });
          if ( ticket.preferencial ) {
            this.listTicket.splice( 1, 0, ticket );
          } else {
            this.listTicket = [ ...this.listTicket, ticket];
          }
          this.listTicket = [ ...this.listTicket ];
        }),
        tap( () => this.llenarInfoTicket() )
      ).subscribe();
  }

  estadoTicket( estado: EstadoTicket ) {
    console.log( this.listTicket[0] );
    switch ( estado ) {
      case EstadoTicket.llamando: {
        //this.atender = true;
        if ( this.listTicket[0].idventanilla ) {
          this.snackBar.add({
            msg: `Llamado al Ticket ${ this.listTicket[0].idticket }`,
            timeout: 3000,
            action: {
              text: 'Borrar',
              onClick: (snack) => {
                console.log('dismissed: ' + snack.id);
              },
            },
          });
          return;
        }
        const detestado: DetEstadoTicket = {
          idestado: 2,
          idticket: this.listTicket[0].idticket,
        };
        this.ticketService.asignarVentanillaAndGuardarDetEstadoTicket(
          detestado.idticket,
          this.ventanilla,
          detestado,
        )
          .subscribe();
        break;
      }
      case EstadoTicket.atendiendo: {
        if ( this.listTicket[0].detestadotickets.length > 2 ) {
          this.snackBar.add({
            msg: 'Ticket atendido o esta siendo atendido',
            timeout: 2500,
            action: {
              text: 'Quitar'
            }
          });
          return;
        }
        const detestado: DetEstadoTicket = {
          idestado: 3,
          idticket: this.listTicket[0].idticket,
        };
        this.ticketService.guardarNuevoEstado( detestado )
          .pipe(
            tap(
              ( ticketDB: Ticket ) => {
                const indexTicketAtendido = this.listTicket.findIndex( ( ticket: Ticket ) => ticket.codigo == ticketDB.codigo  );
                this.listTicket.splice( indexTicketAtendido, 1, ticketDB );
                this.listTicket = [ ...this.listTicket ];
                console.log( this.listTicket );
                this.derivar = true;
                this.llenarInfoTicket();
              }
            ),
          )
          .subscribe();
        break;
      }
      case EstadoTicket.derivado: {
        const detestado: DetEstadoTicket = {
          idestado: 4,
          idticket: this.listTicket[0].idticket,
        };
        this.ticketService.asignarVentanillaAndGuardarDetEstadoTicket(
          detestado.idticket,
          this.ventanillaDerivar,
          detestado,
        )
          .subscribe();
        break;
      }
      case EstadoTicket.atendido : {
        const detestado: DetEstadoTicket = {
          idestado: 5,
          idticket: this.listTicket[0].idticket,
        };
        this.ticketService.guardarNuevoEstado( detestado )
          .pipe(
            tap( ( ticket: Ticket ) => {
              if ( ticket.idventanilla == this.ventanilla ) {
                this.listTicket.splice( 0 , 1 );
              }
              this.listTicket = [ ...this.listTicket ];
              this.derivar = false;
              //this.vistaDetalle = false;
              this.llenarInfoTicket();
              //this.atender = false;
            }),
          )
          .subscribe();
        break;
      }
      default:
        break;
    }

  }

  ticketDerivadoOtraVentanilla() {
    this.ticketService.ticketDerivadoAVentanilla()
      .pipe(
        tap( ( derivado: any ) => {
          const ticket = derivado.ticket;
          const oldVentanilla = derivado.oldVentanilla;
          //console.log( ticket );
          //const indexTicket = this.listTicket.findIndex( ( ticketo ) => ticketo.codigo == ticket.codigo );
          let utltimoDerivado;
          if ( ticket.idventanilla == this.ventanilla ) {
            this.listTicket.map(
              ( searchTicket, index, array ) => {
                if ( searchTicket.detestadotickets.length > 3 ) {
                  utltimoDerivado = searchTicket;
                }
              }
            );
            if ( utltimoDerivado ) {
              const indexUltimoDerivado = this.listTicket.findIndex( ( ticketo ) => ticketo.codigo == utltimoDerivado.codigo );
              console.log( utltimoDerivado );
              console.log( indexUltimoDerivado );
              this.listTicket.splice( indexUltimoDerivado + 1, 0, ticket );
            } else {
              this.listTicket.splice( 1, 0, ticket );
            }

          }
          if ( oldVentanilla == this.ventanilla ) {
            this.listTicket.splice( 0, 1 );
            this.derivar = false;
          }
          this.listTicket = [ ...this.listTicket ];
          this.llenarInfoTicket();
          //this.atender = false;
        }),
      )
      .subscribe();
  }

  ventanillaAsignadaAlTicket() {
    this.ticketService.ventanillaAsignadaAlTicket()
      .pipe(
        tap(( ticket: Ticket ) => {
          console.log( ticket );
          const indexTicket = this.listTicket.findIndex( ( ticketo ) => ticketo.codigo == ticket.codigo );
          if ( ticket.idventanilla != this.ventanilla ) {
            //console.log( `${ ticket.idventanilla } --- ${ this.ventanilla }`);
            this.listTicket.splice( indexTicket , 1 );
            this.listTicket = [ ...this.listTicket ];
          } else {
            this.listTicket.splice( indexTicket , 1, ticket );
            this.listTicket = [ ...this.listTicket ];
          }
          this.llenarInfoTicket();
        })
      )
      .subscribe();
  }

  llenarInfoTicket() {
    //console.log( this.listTicket[0] );
    const ticket = this.listTicket[ 0 ];
    this.mostrarInfoTicket = this.listTicket.length > 0 ? { ...ticket.administrado } : {};
    this.idtematica = this.listTicket.length > 0 ? ticket.idtematica : -1;
    this.estado = this.listTicket.length > 0 && ticket.detestadotickets.length > 0 ? ticket.detestadotickets.length : -1;
    this.derivar = this.estado > 2;
    this.listarTramiteByTematica();
    this.mostrarTematica = ticket ? this.getTematica( ticket.idtematica ) : null;
    this.selectTramite = ticket ? ticket.idtramite : -1;
    this.pasos = this.idtematica > 0 ? 1 : 0;
    console.log( ticket );
  }

  listarTramiteByTematica() {
    if ( !this.idtematica ) return;
    this.tematicaService.tramitesByTematica( this.idtematica )
    .pipe(
      tap( ( tramites: Tramite[] ) => {
        this.listaTramites = tramites;
        //this.listaTramites2 = tramites;
      })
    )
    .subscribe();
  }

  listarTematica() {
    this.tematicaService.obtenerTematicas()
    .pipe(
      tap( ( tematicas: Tematica[] ) => {
        this.listTematica = tematicas;
      })
    )
    .subscribe();
  }

  getTematica( idtematica: number ) {
    const tematica = this.listTematica.find( item => item.idtematica == idtematica );
    return !tematica ? '' : tematica.nombre;
  }

  actualizarTematica(  { idtematica }: Tematica ) {
    console.log( idtematica );
    const idticket = this.listTicket[ 0 ].idticket;
    this.idtematica = idtematica;
    const json: any = {
      idticket,
      idtematica: this.idtematica,
      idtramite: null,
    };
    this.selectTramite = -1;
    this.listarTramiteByTematica();
    this.ticketService.actualizarTematicaOrTramite( idticket, json )
      .pipe(
        tap(
          ( ticket: Ticket ) => {
            const findIndexTicket = this.listTicket.findIndex( ( item: Ticket ) => item.idticket == ticket.idticket );
            this.listTicket.splice( findIndexTicket, 1, ticket );
            this.listTicket = [ ...this.listTicket ];
            //this.vistaDetalle = false;
            this.pasos = 1;
          }
        ),
      )
      .subscribe();
  }

  mostrarListaTematicas() {
    this.pasos = 0;
  }

  seleccionarTramite( tramite: Tramite ) {
    //this.vistaDetalle = true;
    const { idtramite } = tramite;
    this.selectTramite = idtramite;
    const idticket = this.listTicket[0].idticket;
    const json = {
      idticket,
      idtramite,
    };
    console.log( json );
    this.ticketService.actualizarTematicaOrTramite( idticket, json )
      .pipe(
        tap(
          ( ticket: Ticket ) => {
            console.log( ticket );
            const findIndexTicket = this.listTicket.findIndex( ( item: Ticket ) => item.idticket == ticket.idticket );
            this.listTicket.splice( findIndexTicket, 1, ticket );
            this.listTicket = [ ...this.listTicket ];
            this.pasos = 2;
          }
        ),
      )
      .subscribe();
  }

  getTramite( idtramite: number ) {
    const tramite = this.listaTramites.find( item => item.idtramite === idtramite );
    return !tramite ? '' : tramite.descripcion;
  }

  regresarListaTramites() {
    //this.vistaDetalle = false;
    this.renderCardRight();
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
    this.renderCardRight();
  }

  renderCardRight() {
    const cardRight: any = document.getElementById('card__right');
    const cardExtraRight: any = cardRight.querySelector('.ant-card-extra');
    cardExtraRight.style.width = '100%';
  }
}
