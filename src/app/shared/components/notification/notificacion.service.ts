import {Injectable, TemplateRef} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(
    private notification: NzNotificationService,
  ) {

  }

  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template);
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
