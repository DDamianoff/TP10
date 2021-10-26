export class MainDB {
    /*
    Para interactuar con el localStorage y la
    lista que lo representa forma mas organizada.
     */
    private _keyValueList: string[];

    get keyValueList(): string[] {
        return this._keyValueList;
    }

    constructor() {
        this.restoreKeyValueList();
        /*
        asumiendo que en el localStorage se
        almacenarán únicamente contactos.
        */
    }

    restoreKeyValueList() {
        this._keyValueList = Object.keys(localStorage);
    }

    clearAll() {
        localStorage.clear();
        this.restoreKeyValueList();
    }

    pushToDB(contacto: Contacto) {
        localStorage.addItem(contacto.dni, JSON.stringify(contacto));
        //this._keyValueList = this._keyValueList.push(contacto.dni.toString());

        /* como añadir individualmente el nuevo valor se comporta de forma extraña... */
        this.restoreKeyValueList();
    }
}

export class Contacto {
    firstname: string;
    lastname: string;
    dni: number;
    tel: number;
    email: string;
    direction: {
        name: string;
        number: number
    }
}