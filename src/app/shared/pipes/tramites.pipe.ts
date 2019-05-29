import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeFiltros'
})
export class TramitesPipe implements PipeTransform {

  transform(value: any, args: any, arg2: any ): any {
    let campo: string = null;
    if ( args === undefined) return value;
    return value.filter( function (val ) {
      campo = arg2 == 1 ? val.descripcion : val.nombre;
      console.log( campo );
      return campo.toLowerCase().includes( args.toLowerCase());
    });
  }

}
