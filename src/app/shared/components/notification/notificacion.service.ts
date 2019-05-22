import {Injectable, TemplateRef} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd';
import {SnackbarService} from 'ngx-snackbar';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(
    public notification: NzNotificationService,
    private snackBar: SnackbarService,
  ) {

  }

  addMessage( ticket ) {
    this.snackBar.add({
      msg: `Llamado al Ticket ${ ticket.idticket }`,
      timeout: 3000,
      action: {
        text: 'Borrar',
        onClick: (snack) => {
          console.log('dismissed: ' + snack.id);
        },
      },
    });
  }

  messageOffline() {
    this.notification.config({
      nzTop: '24px',
    });
    this.notification.error(
      'Servidor Desconectado',
      'No hay conexion con el servidor',
      {
        nzDuration: 0,
      }
    );
    const servidor: any = document.querySelector('.ant-notification.ant-notification-topRight');
    servidor.setAttribute('id', 'servidorMensaje');
    const statusMensaje = document.getElementById('servidorMensaje');
    statusMensaje.style.right = '50%';
    statusMensaje.style.transform = 'translate( 50%, 50% )';
    statusMensaje.removeAttribute('id');
  }

  messageOnline() {
    this.notification.remove();
    this.notification.success( 'Servidor Conectado', 'Todo OK' );
  }
}
