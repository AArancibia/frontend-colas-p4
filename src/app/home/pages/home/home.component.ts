import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UsuarioService} from '@app/core/services/usuario/usuario.service';
import {Usuario} from '@app/core/models/usuario.model';
import {tap} from 'rxjs/operators';
import {VentanillaService} from '@app/core/services/ventanilla/ventanilla.service';
import {Ventanilla} from '@app/core/models/ventanilla.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  isCollapsed = false;
  triggerTemplate: TemplateRef<void> | null = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;
  inputValue: string;
  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private ventanillaService: VentanillaService,
  ) { }

  ngOnInit() {
  }

  onInput( nombreUsuario: string): void {
    if ( !nombreUsuario ) return;
    this.usuarioService.filtrarUsuarios( nombreUsuario )
      .pipe(
        tap( ( usuariosFiltrados: Usuario[] ) => {
          this.usuarios = usuariosFiltrados;
        }),
      )
      .subscribe();
  }

  guardarVentanilla( { idusuario } ) {
    console.log( idusuario );
    this.ventanillaService.obtenerVentanillaporIdUsuario( idusuario )
      .pipe(
        tap(
          ( ventanilla: Ventanilla ) => {
            this.ventanillaService.ventanilla = ventanilla;
            this.ventanillaService.ventanillaS.next( ventanilla );
          }
        ),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    const bottomLeft: any = document.querySelector('.ant-layout-sider-zero-width-trigger');
  }

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
}
