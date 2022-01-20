/*********************************** GRAFICOS ***********************************/
import { limiteActivos, datosbarra, activ, confi, falle, recup } from './scripts.js';
import { getDetalle } from './consumoapi.js';
import { isoPais } from './iso_pais.js'

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
    let idgraf = lugargrafico.id;
    let pais = idgraf.replace('_', ' ').replace('-', ',');;
   
    if (pais.split(" ").length>1)
     {

        isoPais.forEach((e) => {
            if (pais == e.paising) {
                pais = e.ISO_2;
            }
        });
    }
    console.log(`Pais :  ${pais}`);
    const token = localStorage.getItem('jwt-token');
    if (token) {
        const deta = await getDetalle(token, pais);
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
            text: "Paises con Covid-19",
            fontFamily: 'Roboto Mono',
            text: "Estados de contagios Covid 19 Mundial",
            fontFamily: "comic"
        },
        axisY: {
            title: "",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            tickColor: "#4F81BC",
            interval: 5000000,
            gridColor: "#f2f2f2",
        },
        axisX: {
            labelAngle: -30,
            gridColor: "#f2f2f2",
            gridThickness: 1,
        },
        toolTip: {
            shared: true
        },
        legend: {
            horizontalAlign: "center", 
            verticalAlign: "top",
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "column",
            color: "#fe6183",
            name: "Activos",
            legendText: "Casos Activos",
            showInLegend: true,
            dataPoints: datosbarra[activ]
        },
        {
            type: "column",
            name: "Confirmados",
            color: "#fcce51",
            legendText: "Casos Confirmados",
            //axisYType: "secondary",
            showInLegend: true,
            dataPoints: datosbarra[confi]
        },
        {
            type: "column",
            name: "Muertos",
            color: "#c8cbcf",
            legendText: "Casos Muertos",
            //axisYType: "secondary",
            showInLegend: true,
            dataPoints: datosbarra[falle]
        },
        {
            type: "column",
            color: "#49c0c4",
            name: "Recuperados",
            legendText: "Casos Recuperados",
            //axisYType: "secondary",
            showInLegend: true,
            dataPoints: datosbarra[recup]
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

export { datosGrafBarra, graficoBarra, muestragraficolin };