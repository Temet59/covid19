/*********************** DECLARACIONES GLOBALES Y CONSUMO DE API **********************

const limiteActivos = 2000000;
var datosbarra = [];
const activ = 0;
const confi = 1;
const falle = 2;
const recup = 3;
*/



const getPaises = async (jwt) => {
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
        console.log("URL : "+` http://localhost:3000/api/countries/${pais}`)
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

export {getPaises,getDetalle,postData,redefineActivosRecuperados};