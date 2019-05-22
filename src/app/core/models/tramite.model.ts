export class Tramite {
    constructor(
        public idtramite?: number,
        public descripcion?: string,
        public precio?: number,
        public plazo?: number,
        public idtematica?: number,
        public idcalificacion?: number,
    ) {}
}