let city_input = document.getElementById('city_input'),
searchBtn = document.getElementById('searchBtn'),
locationBtn = document.getElementById('locationBtn'),
api_key = 'e90c47caa960c30fa31b793d0da79aca',
currentWeatherCard = document.querySelector('.weather-card'), 
fiveDaysForecastCard = document.querySelector('.weather-bar'),
airQualityItems = document.querySelector('.items'),
aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'],
airIndex = document.getElementById('air-index'),
sunDetails = document.querySelector('.sun'),
humidityVal = document.getElementById('humidity'),
pressureVal = document.getElementById('pressure'),
visibilityVal = document.getElementById('visibility'),
windSpeedVal = document.getElementById('wind-speed'),
feelsVal = document.getElementById('feels-like'),
hourelyForecastCard = document.querySelector('.boxes'),
savedCities = document.getElementById('cityname');

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}` ,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ] ,
    months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        airIndex.innerHTML = `${aqiList[data.list[0].main.aqi - 1]}`;
        airQualityItems.innerHTML = `
            <div class="img-item">
                <img src="./media/wind.png" alt="" class="h-14">
            </div>
            <div class="item">
                <p class="text-red-600">PM2.5</p>
                <h2 class="text-2xl">${pm2_5}</h2>
            </div>
            <div class="item">
                <p class="text-red-600">PM10</p>
                <h2 class="text-2xl">${pm10}</h2>
            </div>
            <div class="item">
                <p class="text-red-600">SO2</p>
                <h2 class="text-2xl">${so2}</h2>
            </div>
            <div class="item">
                <p class="text-red-600">CO</p>
                <h2 class="text-2xl">${co}</h2>
            </div>
            <div class="item">
                <p class="text-red-600">NO</p>
                <h2 class="text-2xl">${no}</h2>
            </div>
            <div class="item">
                <p class="text-red-600">NO2</p>
                <h2 class="text-2xl">${no2}</h2>
            </div>
            <div class="item">
                <p class="text-red-600">NH3</p>
                <h2 class="text-2xl">${nh3}</h2>
            </div>
            <div class="item">
                <p class="text-red-600">O3</p>
                <h2 class="text-2xl">${o3}</h2>
            </div>
         `
    })
    .catch(() => {
        alert('Failed to fetch air quality index')
    })

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
       let date = new Date();
       currentWeatherCard.innerHTML = `
            <div class="current-weather flex justify-evenly">
                <div class="details">
                    <p class="text-white">Now</p>
                    <h1 class="text-3xl">${(data.main.temp - 273.15).toFixed(2)}&deg;C</h1>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr class="border mb-2">
            <div class="card-footer items-center">
                <p class="ml-3 flex gap-2"><img src="./media/calendar.png" alt="" class="h-5">${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                <p class="ml-3 flex gap-2"><img src="./media/location.png" alt="" class="w-5">${name}, ${country}</p>
            </div>
       `;
       let {sunrise, sunset} = data.sys, 
       {timezone, visibility} = data,
       {humidity, pressure, feels_like} = data.main,
       {speed} = data.wind, 
       sRiseTime = moment.utc(sunrise, 'x').add(timezone, 'seconds').format('hh:mm A'), 
       sSetTime = moment.utc(sunset, 'x').add(timezone, 'seconds').format('hh:mm A');
       sunDetails.innerHTML = `
        <div class="card-head">
            <p>Sunrise & Sunset</p>
        </div>
        <div class="card flex gap-10 justify-evenly mt-6 md:flex sm:flex-wrap">
            <div class="sunrise flex gap-5 items-center">
                <img src="./media/sunrise.png" alt="" class="h-16">
                <div class="sr-info">
                    <p class="text-red-600">Sunrise</p>
                    <p class="text-2xl">${sRiseTime}</p>
                </div>
            </div>
            <div class="sunset flex gap-5 items-center">
                <img src="./media/sunset.png" alt="" class="h-14">
                <div class="ss-info">
                    <p class="text-red-600">Sunset</p>
                    <p class="text-2xl">${sSetTime}</p>
                </div>
            </div>
        </div>
       `;
       humidityVal.innerHTML = `${humidity}%`;
       pressureVal.innerHTML = `${pressure}hPa`;
       visibilityVal.innerHTML = `${visibility / 1000}km`;
       windSpeedVal.innerHTML = `${speed}m/s`;
       feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`
    }).catch(() => {
        alert('Failed to fetch current weather');
    })

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let uniqueForecastDays = [];
        let hourelyForecast = data.list;
        hourelyForecastCard.innerHTML = '';
        for(i=0; i<=7; i++) {
            let hrForecastDate = new Date(hourelyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = 'PM';
            if(hr < 12) a = 'AM';
            if(hr == 0) hr = 12;
            if(hr > 12) hr = hr - 12;    
            hourelyForecastCard.innerHTML+= `
                <div class="box border border-black rounded-lg p-3 flex flex-col items-center bg-slate-400">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourelyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourelyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
            `
        }
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate)
            }
        });
        fiveDaysForecastCard.innerHTML = '';
        fiveDaysForecastCard.innerHTML += `<h2 class="text-xl text-center text-white">5 Days Forecast</h2>`;
        for(let i=1; i<fiveDaysForecast.length; i++)
        {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="day flex justify-around">
                    <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="" class="h-11 w-11">
                    <span class="flex">
                        <p>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}</p>
                        &deg;C
                    </span>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `
        }
    }).catch(() => {
        alert('Failed to fetch weather forecast');
    })
}

function getCoordinates() {
    let cityName = city_input.value.trim();
    loadToLocal(cityName);
    city_input.value = '';
    if(!cityName) return;
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(()=>{
        alert(`failed to fetch results of ${cityName}`);
    })
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`
        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            let {name, country, state} = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            console.log("Failed to fetch user coordinates");
        })
    }, error => {
        if(error.code === error.PERMISSION_DENIED){
            alert('Geolocation permission denied. Please reset location permission tp grant access again');
        }
    })
}

function reloadPage() {
    location.reload();
}

function fetchFromLocal() {
    var storedValues = JSON.parse(localStorage.getItem('storedValues')) || [];
    savedCities.innerHTML = '';
    storedValues.forEach(city => {
        const newOption = document.createElement("option");
        newOption.value = city;
        savedCities.appendChild(newOption);
    });
}

function loadToLocal(cityName) {
    var storedValues = JSON.parse(localStorage.getItem('storedValues')) || [];
    if(!storedValues.includes(cityName)) {
        storedValues.push(cityName);
    }
    localStorage.setItem('storedValues', JSON.stringify(storedValues));
    fetchFromLocal();
}

searchBtn.addEventListener("click", getCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);
city_input.addEventListener("keyup", e => e.key === 'Enter' && getCoordinates());
window.addEventListener("load", getUserCoordinates); 
fetchFromLocal();