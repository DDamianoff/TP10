class MainDB {
    private readonly DBKeyValueListKey:string = 'DBKeyValues';
    private KeyValueList: string[];

    constructor() {
        if (!Boolean(localStorage.getItem(this.DBKeyValueListKey))) {
            // si existe... entonces ?... restaurar.

        }
        else {
            // si no existe, crear y restaurar.
        }
    }
}







function main() {
    let test: {
        "firstname": string,
        "lastname": string,
        "dni": number,
        "tel": number,
        "email": string,
        "direction": {
            "name":string,
            "number": number
        }
    };
}

window.onload = main;
/*
TODO:   - Definir la DB.
        - Definir el modelo de objeto.
        - Funciones:
            - Añadir al sistema (lista, DB, ul, !incluid ID en la lista!)
            - Remover.
            - Purgar.
            - Restaurar.
        - Comprobaciones:
            - campos repetidos.
            - (...) vacíos.





id (DNI)
{
 firstname: "ex",
 lastname: "xample",
 dni: 123...
 direction: {
    name:
 }

}
 */