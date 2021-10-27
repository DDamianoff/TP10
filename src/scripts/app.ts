
let valueDB: MainDB;
let contactUnorderedListHTML: CustomHTMLUlList;

// TODO: validaciones de campos usando regex.
// TODO: https://stackoverflow.com/questions/5384712/intercept-a-form-submit-in-javascript-and-prevent-normal-submission
function main() {
    valueDB = new MainDB();
    contactUnorderedListHTML = new CustomHTMLUlList("contactUnorderedListHTML");
    let form = <HTMLFormElement>document.getElementById('formContact');

    contactUnorderedListHTML.buildListFromLocalStorage(valueDB.keyValueList);

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

// noinspection JSUnusedGlobalSymbols
function removeAllFromAll() {
    // TODO: make this a method of CustomHTMLUlList.
    document.getElementById(contactUnorderedListHTML.ulId).innerHTML = '';
    valueDB.clearAll();
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
        dni: Number((<HTMLInputElement>form[4]).value),
        tel: (<HTMLInputElement>form[3]).value,
        email: (<HTMLInputElement>form[5]).value,
        direction: {
            name: (<HTMLInputElement>form[7]).value,
            number: Number((<HTMLInputElement>form[8]).value)
        }
    };

    // TODO: fix current validations and add more.
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


function removeFromAll(contactId: string) {
    document.getElementById(`CID${contactId}`).remove();
    localStorage.removeItem(contactId);
    valueDB.restoreKeyValueList();
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
    private readonly _ulId: string;
    // recuperar (desde la base de datos) desde un parámetro y ligarse a una ID.
    // remover elemento.
    // añadir elemento.
    constructor(ulID:string) {
        this.ul = document.getElementById(ulID);
        this._ulId = ulID;
    }

    get ulId(): string {
        return this._ulId;
    }

    buildListFromLocalStorage(keyValueList:string[]) {
        for (let i = 0; i < keyValueList.length; i++) {
            let currentUser: Contacto = JSON.parse(localStorage.getItem(keyValueList[i]));
            this.pushToUl(currentUser);
        }
    }

    pushToUl (contact:Contacto) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(`${contact}`));
        li.setAttribute('id',`CID${contact.dni}`);
        this.ul.appendChild(li);

        document.getElementById(`CID${contact.dni}`).innerHTML = `
            <div class="contact">
                <h3>${contact.firstname} ${contact.lastname} - ${contact.dni}</h3>
                <h4>Contacto:</h4>
                <p>
                    <a href="tel:${contact.tel}">${contact.tel}</a> -
                    <a href="mailto:${contact.email}">${contact.email}</a>
                </p>

                <h4>Dirección:</h4>
                <p>
                    <span> calle: ${contact.direction.name}</span> - <span>Nº ${contact.direction.number}</span>
                </p>
                
                <input type="button" onclick="removeFromAll('${contact.dni}')" value="remover"/>
            </div>`;
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
TODO:     - Comprobaciones:
            - campos repetidos.
            - (...) vacíos.
          - confirmaciones.
*/