//script for client code
      function getCoordinates(){
        
        //navigator API code to get coordinates
        if('geolocation' in navigator) {
          console.log('available');
          navigator.geolocation.getCurrentPosition(async position => {
    
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
            lat.toFixed(2);
            lon.toFixed(2);
          
          document.getElementById('latitude').textContent = lat;
          document.getElementById('longitude').textContent = lon;
    
          //URL for accessing weather at particular coordinates
          const api_url = `/weather/${lat},${lon}`;
          const res = await fetch(api_url);
          const d = await res.json();
          //console.log(d);
          
          const weatherInfo = d.weather[0].main;
          const tempInfo = d.main.temp;
          document.getElementById('weather').textContent = weatherInfo;
          document.getElementById('temp').textContent = tempInfo;
          //console.log(d);

          const data = {lat, lon, weatherInfo, tempInfo};
          
          //Options for POST method
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          };
          
          //POST data to database
          const db_response = await fetch('/dbdata',options);
          const db_result = await db_response.json();
          console.log(db_result);
          });
  
          } else {
          console.log('not available');
          }
        }
        
  