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
    for (let value in valueList) {
        if (Boolean(value))
            returnValue = true;
    }
    return returnValue;
}
// noinspection JSUnusedGlobalSymbols
function removeAllFromAll() {
    document.getElementById(contactUnorderedListHTML.ulId).innerHTML = '';
    valueDB.clearAll();
}
function processForm(event) {
    if (event.preventDefault)
        event.preventDefault();
    let form = document.getElementById('formContact');
    let voidCamp = checkVoids([
        form[1].value,
        form[2].value,
        form[3].value,
        form[4].value,
        form[5].value,
        form[7].value,
        form[8].value,
    ]);
    let currentValue = {
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
    // TODO: fix current validations and add more.
    if (voidCamp) {
        valueDB.pushToDB(currentValue);
        contactUnorderedListHTML.pushToUl(currentValue);
    }
    else {
        alert("campo vacío");
    }
    // para que el form no recargue.
    return false;
}
function removeFromAll(contactId) {
    document.getElementById(`CID${contactId}`).remove();
    localStorage.removeItem(contactId);
    valueDB.restoreKeyValueList();
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
            let currentUser = JSON.parse(localStorage.getItem(keyValueList[i]));
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
*/ 
//# sourceMappingURL=app.js.map