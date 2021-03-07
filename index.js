//server code using express framework

const express = require('express');
const app = express();

//NEDB database
const datastore = require('nedb');

//fetch function
const fetch = require('node-fetch');

//env file
require('dotenv').config();

//listen on a particular port
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening at ${port}`));

//folder to keep all the client code in
app.use(express.static('public1'));

//use jason formatting
app.use(express.json());

//create a new database file if it doesn't exist
const database = new datastore({filename: 'database.db'});
database.loadDatabase();

//routing get method
app.get('/dbdata',(request, response)=>{
    database.find({}, (err,data)=>{
        if(err){
            response.end;
            return;
        }

        response.json(data);
    });
});


//routing post method
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

//routing weather API using coordinates
app.get('/weather/:latlon', async (request, response)=>{
console.log(request.params);
const latlon = request.params.latlon.split(',');
const lat = latlon[0];
const lon = latlon[1];
console.log(lat,lon);

//environment variable for API key
const api_key = process.env.API_KEY;
const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
const res = await fetch(api_url);
const d = await res.json();
//console.log(d);
response.json(d);
});

