/*********************** MOSTRAR INFORMACION Y VENTANAS MODALES ************************/

import {limiteActivos,datosbarra,activ,confi,falle,recup} from './scripts.js';
import {muestragraficolin} from './graficos.js';

var ventanasModales = async () => {
    const infocovid = document.getElementById("infocovid19");
    infocovid.innerHTML = "";


    datosbarra[activ].forEach((e, index) => {
        let idgraf = e.label.replace(' ', '_');
        idgraf = e.label.replace(',', '-');
        if (e.y >= limiteActivos) {

            infocovid.innerHTML += `
            <table class="table table-striped">`;

            if (index == 0) {
                infocovid.innerHTML += `
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Pais</th>
                <th scope="col">Casos Activos</th>
                <th scope="col">Casos Confirmados</th>
                <th scope="col">Casos Muertos</th>
                <th scope="col">Casos Recuperados</th>
                <th scope="col"></th>
              </tr>
            </thead>`;
            }

            infocovid.innerHTML +=`
                <tbody>
                    <tr>
                        <td scope="row">${index + 1}</td>
                        <td>${e.label}</td>
                        <td>${e.y}</td>
                        <td>${datosbarra[confi][index].y}</td>
                        <td>${datosbarra[falle][index].y}</td>
                        <td>${datosbarra[recup][index].y}</td>
                        <td><div id="btn${index}" class="col-6 col-md-2 grafmodal" data-toggle="modal" data-target="#mod${index}">
                            <a href="#btn${index}" id="${idgraf}">ver detalle</a>
                        </div></td>
                    </tr>
                
                    <tr>

                    <td>
    <div class="modal fade" id="mod${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${e.label}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" >
                    <div class="grafico2 col-auto text-center p-5" id="chartContainerlin${idgraf}"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
                </div > </td></tr>`;
        }
        infocovid.innerHTML +=`
        </tbody >
        </table >`;

        document.querySelectorAll('div .grafmodal').forEach((element) => {
            element.addEventListener('click', muestragraficolin);
        });
    })

}

export { ventanasModales };