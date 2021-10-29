let valueDB;
let contactUnorderedListHTML;
// TODO: validaciones de campos usando regex.
// TODO: https://stackoverflow.com/questions/5384712/intercept-a-form-submit-in-javascript-and-prevent-normal-submission
function main() {
    valueDB = new MainDB();
    contactUnorderedListHTML = new CustomHTMLUlList("contactUnorderedListHTML");
    let form = document.getElementById('formContact');
    contactUnorderedListHTML.buildListFromLocalStorage(valueDB.keyValueList);
    // prevenir que el formulario realize el submit y reload de la página.
    form.addEventListener("submit", processForm);
}
function checkVoids(valueList) {
    /*
    Returns "true" if finds
    a void value.
    */
    let returnValue = false;
    for (let i = 0; i < valueList.length; i++) {
        if (!Boolean(valueList[i]))
            returnValue = true;
    }
    return returnValue;
}
function checkRepeatedValues(posibleContact) {
    /*
    Returns "true" if finds
    a repeated value.
    */
    // TODO: Keep loaded this data in the TB.
    let dniList = [];
    let telList = [];
    let mailList = [];
    for (let i = 0; i < valueDB.keyValueList.length; i++) {
        let currentValue = JSON.parse(localStorage.getItem(valueDB.keyValueList[i]));
        dniList.push(String(currentValue.dni));
        telList.push(String(currentValue.tel));
        mailList.push(String(currentValue.email));
    }
    return dniList.includes(String(posibleContact.dni)) ||
        telList.includes(String(posibleContact.tel)) ||
        mailList.includes(String(posibleContact.email));
}
// noinspection JSUnusedGlobalSymbols
function removeAllFromAll() {
    if (window.confirm('¿Desea remover todos los contactos?')) {
        // TODO: make this a method of CustomHTMLUlList.
        document.getElementById(contactUnorderedListHTML.ulId).innerHTML = '';
        valueDB.clearAll();
    }
}
function processForm(event) {
    let form = document.getElementById('formContact');
    let voidCamp;
    let repeatedCamp;
    let currentValue;
    if (event.preventDefault)
        event.preventDefault();
    voidCamp = checkVoids([
        form[1].value,
        form[2].value,
        form[3].value,
        form[4].value,
        form[5].value,
        form[7].value,
        form[8].value
    ]);
    currentValue = {
        firstname: form[1].value,
        lastname: form[2].value,
        dni: Number(form[4].value),
        tel: form[3].value,
        email: form[5].value,
        direction: {
            name: form[7].value,
            number: Number(form[8].value)
        }
    };
    repeatedCamp = checkRepeatedValues(currentValue);
    // TODO: fix current validations and add more.
    if (!voidCamp) {
        if (!repeatedCamp) {
            valueDB.pushToDB(currentValue);
            contactUnorderedListHTML.pushToUl(currentValue);
        }
        else {
            alert("valor ingresado con anterioridad");
        }
    }
    else {
        alert("campo vacío");
    }
    // para que el form no recargue.
    return false;
}
function removeFromAll(contactId) {
    if (window.confirm('¿Desea remover el contacto?')) {
        document.getElementById(`CID${contactId}`).remove();
        localStorage.removeItem(contactId);
        valueDB.restoreKeyValueList();
    }
}
class MainDB {
    constructor() {
        this.restoreKeyValueList();
        /*
        asumiendo que en el localStorage se
        almacenarán únicamente contactos.
        */
    }
    get keyValueList() {
        return this._keyValueList;
    }
    restoreKeyValueList() {
        this._keyValueList = Object.keys(localStorage);
    }
    clearAll() {
        localStorage.clear();
        this.restoreKeyValueList();
    }
    pushToDB(contacto) {
        localStorage.setItem(String(contacto.dni), JSON.stringify(contacto));
        //this._keyValueList = this._keyValueList.push(contacto.dni.toString());
        /* como añadir individualmente el nuevo valor se comporta de forma extraña... */
        this.restoreKeyValueList();
    }
}
class CustomHTMLUlList {
    // recuperar (desde la base de datos) desde un parámetro y ligarse a una ID.
    // remover elemento.
    // añadir elemento.
    constructor(ulID) {
        this.ul = document.getElementById(ulID);
        this._ulId = ulID;
    }
    get ulId() {
        return this._ulId;
    }
    buildListFromLocalStorage(keyValueList) {
        for (let i = 0; i < keyValueList.length; i++) {
            let currentUser = JSON.parse(localStorage.getItem(valueDB.keyValueList[i]));
            this.pushToUl(currentUser);
        }
    }
    pushToUl(contact) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(`${contact}`));
        li.setAttribute('id', `CID${contact.dni}`);
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
}
window.onload = main;
/*
TODO:     - Comprobaciones:
            - campos repetidos.
            - (...) vacíos.
          - confirmaciones.
*/ 
//# sourceMappingURL=app.js.map