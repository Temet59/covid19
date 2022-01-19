/*********************** MOSTRAR INFORMACION Y VENTANAS MODALES ************************/
import {limiteActivos,datosbarra,activ,confi,falle,recup} from './scripts.js';
import {muestragraficolin} from './graficos.js';
var ventanasModales = async () => {
    const infocovid = document.getElementById("infocovid19");
    infocovid.innerHTML = "";
    infocovid.innerHTML += `<div class="card">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-6 col-md-4">Pais</div>
                                        <div class="col-6 col-md-2">Casos Activos</div>
                                        <div class="col-6 col-md-2">Casos Confirmados</div>
                                        <div class="col-6 col-md-2">Casos Muertos</div>
                                        <div class="col-6 col-md-2">Casos Recuperados</div>
                                    </div>
                                </div>
                            </div>`;

    datosbarra[activ].forEach((e, index) => {
        //let idmodal = e.label.split(" ").join("") + index;
        let idgraf = e.label.replace(' ', '_');
            idgraf = e.label.replace(',', '-');
        if (e.y >= limiteActivos) {
            infocovid.innerHTML += `<div class="card">
                        <div class="container">
                            <div class="row">
                            <div class="col-6 col-md-2">${e.label}</div>
                            <div class="col-6 col-md-2">${e.y}</div>
                            <div class="col-6 col-md-2">${datosbarra[confi][index].y}</div>
                            <div class="col-6 col-md-2">${datosbarra[falle][index].y}</div>
                            <div class="col-6 col-md-2">${datosbarra[recup][index].y}</div>
                            <div id="btn${index}" class="col-6 col-md-2 grafmodal" data-toggle="modal" data-target="#mod${index}">
                                <!--a href="">ver detalle</a-->
                                <span class="linksimu" id="${idgraf}">ver detalle</span>
                            </div>
                            </div>
                        </div>
                   
                </div>

                <div class="modal fade" id="mod${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg"  role="document">
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
                </div>`;
        }
        document.querySelectorAll('div .grafmodal').forEach((element) => {
            element.addEventListener('click', muestragraficolin);
        });
    })
}

export {ventanasModales};