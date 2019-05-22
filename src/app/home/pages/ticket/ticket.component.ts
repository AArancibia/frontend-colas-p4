import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {distanceInWords} from 'date-fns';
import {WebsocketService} from '@app/core/services/websocket/websocket.service';
import {TicketService} from '@app/core/services/ticket/ticket.service';
import {NotificacionService} from '@app/shared/components/notification/notificacion.service';
import {Ticket} from '@app/core/models/ticket.model';
import {tap} from 'rxjs/operators';
//import {CreateTicket, LoadTickets} from '@app/features/ticket-store/state/ticket.action';
//import {AppState} from '@app/features/ticket-store/state/ticket.type';
import {Observable} from 'rxjs';
import {Tramite} from '@app/core/models/tramite.model';
import {Tematica} from '@app/core/models/tematica.model';
import {TematicaService} from '@app/core/services/tematica/tematica.service';
import {DetEstadoTicket} from '@app/core/models/detestadoticket.model';
import {EstadoTicket} from '@app/shared/enum/estado-ticket.enum';
import {SnackbarService} from 'ngx-snackbar';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, AfterViewInit, OnDestroy {
  time = distanceInWords( new Date(), new Date() );
  tickets$: Observable< Ticket[] >;
  listTematica: Tematica[] = [];
  listTicket: any[] = [];
  listaTramites: Tramite[] = [];
  mostrarInfoTicket: Tramite = new Tramite();
  idtematica: number;
  ventanilla: any;
  derivar: boolean = false;
  estado: number = -1;
  constructor(
    private wsSocket: WebsocketService,
    public ticketService: TicketService,
    public tematicaService: TematicaService,
    private notificationService: NotificacionService,
    private snackBar: SnackbarService,
  ) {

  }

  ngOnInit() {
    //this.listarTickets();
    this.ventanilla = Number( prompt('Ventanilla' ) );
    this.obtenerListaTickets();
    this.nuevoTicket();
    this.ventanillaAsignadaAlTicket();
    this.listarTematica();
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
          this.listTicket = [ ...this.listTicket, ticket];
        }),
        tap( () => this.llenarInfoTicket() )
      ).subscribe();
  }

  estadoTicket( estado: EstadoTicket ) {
    switch ( estado ) {
      case EstadoTicket.llamando: {
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
          .subscribe(
            responseList => {
              console.log( responseList );
            }
          );
        break;
      }
      case EstadoTicket.atendido: {
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
              }
            ),
          )
          .subscribe();
        break;
      }
      case EstadoTicket.derivado: {
        break;
      }
      default:
        break;
    }

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
    console.log( this.listTicket[0] );
    this.mostrarInfoTicket = this.listTicket.length > 0 ? { ...this.listTicket[0].administrado } : {};
    this.idtematica = this.listTicket.length > 0 ? this.listTicket[0].idtematica : -1;
    this.estado = this.listTicket.length > 0 && this.listTicket[0].detestadotickets.length > 0 ? this.listTicket[0].detestadotickets.length : -1;
    this.listarTramiteByTematica();
  }

  listarTramiteByTematica() {
    if ( !this.idtematica ) return;
    this.tematicaService.tramitesByTematica( this.idtematica )
    .pipe(
      tap( ( tramites: Tramite[] ) => {
        this.listaTramites = tramites;
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
    const tematica = this.listTematica.find( tematica => tematica.idtematica === idtematica );
    return !tematica ? '' : tematica.nombre;
  }

  ngOnDestroy(): void {
    const salir = prompt('Estas seguro de salir, se perderan cambios, el sistema esta intentando una reconexión');
    if ( salir !== 'si') return;
  }

  ngAfterViewInit(): void {
    const card: any = document.getElementById('card__ticket');
    const cardRight: any = document.getElementById('card__right');
    const cardExtra: any = card.querySelector('.ant-card-extra');
    const cardHead: any = card.querySelector('.ant-card-head');
    const cardExtraRight: any = cardRight.querySelector('.ant-card-extra');
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
    cardExtraRight.style.width = '100%';
  }

}
