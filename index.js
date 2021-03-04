const express = require('express');
const app = express();
const datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();
//const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening at ${port}`));
app.use(express.static('public1'));
app.use(express.json());

const database = new datastore({filename: 'database.db'});
database.loadDatabase();

//routing
app.get('/dbdata',(request, response)=>{
    database.find({}, (err,data)=>{
        if(err){
            response.end;
            return;
        }

        response.json(data);
    });
});



app.post('/dbdata',(request, response)=>{
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    //console.log(database);
    response.json({
            status: "success",
            timestamp: timestamp,
            latitude: data.lat,
            longitude: data.lon,
            weather: data.weatherInfo,
            temperature: data.tempInfo
    });
});

//weather API
app.get('/weather/:latlon', async (request, response)=>{
console.log(request.params);
const latlon = request.params.latlon.split(',');
const lat = latlon[0];
const lon = latlon[1];
console.log(lat,lon);


const api_key = process.env.API_KEY;
const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
const res = await fetch(api_url);
const d = await res.json();
//console.log(d);
response.json(d);
});

