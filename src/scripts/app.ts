import {Contacto, MainDB} from "./class";

let valueDB: MainDB;

function main() {
    valueDB = new MainDB();

    console.log(valueDB.keyValueList);

    let test: Contacto = {
        firstname: "edmundo",
        lastname: "pedro",
        dni: 12121212,
        tel: 1243,
        email: "hola@asd.com",
        direction: {
            name: "pedro sanchez",
            number: 999
        }
    };

    console.log(JSON.parse(JSON.stringify(test)));

    valueDB.pushToDB(test);
}

window.onload = main;
/*
TODO:   - Funciones:
            - Añadir al sistema (lista, DB, ul, !incluid ID en la lista!)
            - Remover.
            - Purgar.
            - Restaurar.
        - Comprobaciones:
            - campos repetidos.
            - (...) vacíos.
 */