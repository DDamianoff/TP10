
let valueDB: MainDB;
let contactUnorderedListHTML: CustomHTMLUlList;

// TODO: validaciones de campos usando regex.
// TODO: https://stackoverflow.com/questions/5384712/intercept-a-form-submit-in-javascript-and-prevent-normal-submission
function main() {
    valueDB = new MainDB();
    contactUnorderedListHTML = new CustomHTMLUlList("contactUnorderedListHTML");
    let form = <HTMLFormElement>document.getElementById('formContact');




    // prevenir que el formulario realize el submit y reload de la página.
    form.addEventListener("submit", processForm);


}

function checkVoids(valueList: string[]) {
    /*
    Returns "true" if finds
    a void value.
    */
    let returnValue: boolean = false;
    for (let value in valueList) {
        if (Boolean(value)) returnValue = true;
    }
    return returnValue;
}

function processForm(event) {
    if (event.preventDefault) event.preventDefault();
    let form: HTMLFormElement = <HTMLFormElement>document.getElementById('formContact');
    let voidCamp: boolean = checkVoids(<string[]>[
        (<HTMLInputElement>form[1]).value,
        (<HTMLInputElement>form[2]).value,
        (<HTMLInputElement>form[3]).value,
        (<HTMLInputElement>form[4]).value,
        (<HTMLInputElement>form[5]).value,
        (<HTMLInputElement>form[7]).value,
        (<HTMLInputElement>form[8]).value,
    ]);

    let currentValue: Contacto = {
        firstname: (<HTMLInputElement>form[1]).value,
        lastname: (<HTMLInputElement>form[2]).value,
        dni: Number((<HTMLInputElement>form[3]).value),
        tel: (<HTMLInputElement>form[4]).value,
        email: (<HTMLInputElement>form[5]).value,
        direction: {
            name: (<HTMLInputElement>form[7]).value,
            number: Number((<HTMLInputElement>form[8]).value)
        }
    };

    if(voidCamp) {
        valueDB.pushToDB(currentValue);
        contactUnorderedListHTML.pushToUl(currentValue);
    }
    else {
        alert("campo vacío");
    }

    // para que el form no recargue.
    return false;
}

class MainDB {
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
        localStorage.setItem(String(contacto.dni), JSON.stringify(contacto));
        //this._keyValueList = this._keyValueList.push(contacto.dni.toString());

        /* como añadir individualmente el nuevo valor se comporta de forma extraña... */
        this.restoreKeyValueList();
    }
}

class CustomHTMLUlList {
    private ul: HTMLElement;
    // recuperar (desde la base de datos) desde un parámetro y ligarse a una ID.
    // remover elemento.
    // añadir elemento.
    constructor(ulID:string) {
        this.ul = document.getElementById(ulID);
    }

    private buildListFromLocalStorage(keyValueList:string[]) {
        for (const value in keyValueList) {
            let currentUser: Contacto = JSON.parse(localStorage.getItem(value));
            this.pushToUl(currentUser);
        }
    }

    pushToUl (contact:Contacto) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(`${contact}`));
        li.setAttribute('id',`CID${contact.dni}`);
        this.ul.appendChild(li);
    }
}

class Contacto {
    firstname: string;
    lastname: string;
    dni: number;
    tel: string;
    email: string;
    direction: {
        name: string;
        number: number
    }
}

window.onload = main;
/*
TODO:   - Funciones:
            - Añadir al sistema (lista, DB, ul, !incluid ID en la lista!)
                - ul - li: asignar id a cada campo (poder eliminarlo a posteriori).
            - Remover.
            - Purgar.
            - Restaurar.
        - Comprobaciones:
            - campos repetidos.
            - (...) vacíos.
 */