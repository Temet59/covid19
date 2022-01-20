
import {ventanasModales} from './ventanasmodales.js';
import {datosGrafBarra,graficoBarra} from './graficos.js';
import {getPaises,postData,redefineActivosRecuperados} from './consumoapi.js';

/*********************************** START DE PROYECTO ***********************************/


const limiteActivos =10000;
var datosbarra = [];
const activ = 0;
const confi = 1;
const falle = 2;
const recup = 3;


const toggleElementos = () => {
    $(`#js-form`).toggle();
    $(`.cardgraf`).toggle();
    $(`#infocovid19`).toggle();
} 

const init = async () => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
        const posts = await getPaises(token);
        //console.log(posts);
        redefineActivosRecuperados(posts);
        datosbarra = datosGrafBarra(posts);
        await graficoBarra();

        console.log('Datos Barra : ',datosbarra);
        await ventanasModales();
        toggleElementos();
        
    }
}

window.onload = () => {
    let finalizar = document.getElementById('cierresesion');
    $('#js-form').submit(async () => {
        event.preventDefault();
        const email = document.getElementById('js-input-email').value;
        const password = document.getElementById('js-input-password').value;
        await postData(email, password);
        init();
    });
    
    finalizar.addEventListener("click", () => {
        localStorage.removeItem('jwt-token');
        toggleElementos();
        document.getElementById("chartContainerbarr").innerHTML = "";
        document.getElementById("infocovid19").innerHTML = "";
    });

    init();
};

export {limiteActivos,datosbarra,activ,confi,falle,recup}; 

/* const getPaises = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/total',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt} `
                }
            });
        const { data } = await response.json();
        return data;
    } catch (err) {
        console.error(`Error: ${err} `);
    }
}

const getDetalle = async (jwt, pais) => {
    try {
        const response = await fetch(`http://localhost:3000/api/countries/${pais}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt} `
                }
            });
        const { data } = await response.json();
        return data;
    } catch (err) {
        console.error(`Error: ${err} `);
    }
}


const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            });
        const { token } = await response.json();
        localStorage.setItem('jwt-token', token);
        return token
    } catch (err) {
        console.error(`Error: ${err} `);
    }
}


const redefineActivosRecuperados = (data) => {
    data.forEach((elem) => {
        let cal_activos = parseInt((elem.confirmed - elem.deaths) * 0.4);
        let cal_recuperados = parseInt((elem.confirmed - elem.deaths) * 0.6);
        elem.active = cal_activos;
        elem.recovered = cal_recuperados;
    });
}



const datosGrafBarra = (data) => {
    let activos = [];
    let confirmados = [];
    let fallecidos = [];
    let recuperados = [];
    let datosgrafbarra = [];

    data.forEach((elem) => {

        if (elem.active >= limiteActivos) {
            activos.push({ label: elem.location, y: elem.active });
            confirmados.push({ label: elem.location, y: elem.confirmed });
            fallecidos.push({ label: elem.location, y: elem.deaths });
            recuperados.push({ label: elem.location, y: elem.recovered });
        }
    });
    datosgrafbarra.push(activos);
    datosgrafbarra.push(confirmados);
    datosgrafbarra.push(fallecidos);
    datosgrafbarra.push(recuperados);
    return datosgrafbarra;
};

var muestragraficolin = async (e) => {
    let lugargrafico = e.target;
    idgraf = lugargrafico.id;
    //let pais=idgraf.replace('_', '%20');
    //let indice = idgraf.slice(3, idgraf.lenght);

    const token = localStorage.getItem('jwt-token');
    if (token) {
        const deta = await getDetalle(token,pais);
        //console.log("Detalle : ",deta);
        //console.log("Id Graf : ",idgraf+" indice : "+indice);
        await graficoLineas(idgraf, deta);
    }
};

var graficoLineas = async (idgraf, detalle) => {

    detalle.active = parseInt((detalle.confirmed - detalle.deaths) * 0.4);
    detalle.recovered = parseInt((detalle.confirmed - detalle.deaths) * 0.6);

    var chart = new CanvasJS.Chart(`chartContainerlin${idgraf}`, {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: `Casos Covid 19 : ${detalle.location}`
        },
        axisY: {
            title: "Personas contagiadas"
        },
        data: [{
            type: "column",
            showInLegend: true,
            legendMarkerColor: "grey",
            legendText: `Estado contagios`,
            dataPoints: [
                { y: detalle.active, label: "Activos" },
                { y: detalle.confirmed, label: "Confirmados" },
                { y: detalle.deaths, label: "Muertos" },
                { y: detalle.recovered, label: "Recuperados" },
            ]
        }]
    });

    chart.render();
}


var graficoBarra = async () => {
    var chart = new CanvasJS.Chart("chartContainerbarr", {
        animationEnabled: true,
        title: {
            text: "Estados de contagios Covid 19 Mundial"
        },
        axisY: {
            title: "Personas",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        axisY2: {
            title: "",
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "column",
            name: "Activos",
            legendText: "Casos Activos",
            showInLegend: true,
            dataPoints: datosbarra[0]
        },
        {
            type: "column",
            name: "Confirmados",
            legendText: "Casos Confirmados",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints: datosbarra[1]
        },
        {
            type: "column",
            name: "Muertos",
            legendText: "Casos Muertos",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints: datosbarra[2]
        },
        {
            type: "column",
            name: "Recuperados",
            legendText: "Casos Recuperados",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints: datosbarra[3]
        }]
    });

    chart.render();

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
}



let ventanasModales = async (datosbarra) => {
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
        let idmodal = e.label.split(" ").join("") + index;
        let idgraf = e.label.replace(' ', '_');
        if (e.y >= limiteActivos) {
            infocovid.innerHTML += `<div class="card">
                        <div class="container">
                            <div class="row">
                            <div class="col-6 col-md-2">${e.label}</div>
                            <div class="col-6 col-md-2">${e.y}</div>
                            <div class="col-6 col-md-2">${datosbarra[confi][index].y}</div>
                            <div class="col-6 col-md-2">${datosbarra[falle][index].y}</div>
                            <div class="col-6 col-md-2">${datosbarra[recup][index].y}</div>
                            <div id="btn${index}" class="col-6 col-md-2 grafmodal" data-toggle="modal" data-target="#${idmodal}">
                                <a id="${idgraf}" href="#">ver detalle</a>
                            </div>
                            </div>
                        </div>
                   
                </div>

                <div class="modal fade" id="${idmodal}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
} */