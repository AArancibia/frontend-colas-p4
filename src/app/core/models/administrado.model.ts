/**
 * Administrado Model
 * @class
 */
export class Administrado {
    /**
   * Constructor del Modelo Administrado
   * @constructor
   */
    constructor(
      /** Id del Administrado */
      public id?: number,
      /** 
       * Nro del Documento
       **/
      public nrodoc?: string,
      /** Tipo de Documento */
      public tipodoc?: string,
      /** Nombre del Administrado */
      public nombre?: string,
      /** Apellido Paterno del Administrado */
      public apepat?: string,
      /** Apellido Materno del Administrado */
      public apemat?: string,
      /** Id de Contribuyente - Rentas */
      public idcontribuyente?: number,
    ) {}
}
