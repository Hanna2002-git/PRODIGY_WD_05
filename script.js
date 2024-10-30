const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; 
const geoDBUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
const geoDBApiKey = '52c179d6bemsha69344a6026f78ap10d4cfjsn2a246cdb7fef';

$(document).ready(() => {
    getWeatherByCity('Trivandrum'); 
});


async function getWeatherByCity(city = $('#city-input').val()) {
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    await fetchWeather(endpoint);
}


function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            await fetchWeather(endpoint);
        }, () => alert('Unable to retrieve location.'));
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}


async function fetchWeather(endpoint) {
    try {
        const res = await fetch(endpoint);
        const data = await res.json();
        if (res.ok) {
            displayWeather(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


function displayWeather(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    $('#weather-info').fadeIn();
}


async function suggestCities() {
    const query = $('#city-input').val();
    if (query.length < 3) {
        $('#suggestions').hide();
        return;
    }
    
    try {
        const response = await fetch(`${geoDBUrl}?namePrefix=${query}&limit=5`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': geoDBApiKey,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        const data = await response.json();
        displaySuggestions(data.data);
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
    }
}


function displaySuggestions(cities) {
    const suggestionsContainer = $('#suggestions');
    suggestionsContainer.empty();
    
    cities.forEach(city => {
        const cityElement = `<p onclick="selectCity('${city.name}')">${city.name}, ${city.countryCode}</p>`;
        suggestionsContainer.append(cityElement);
    });
    
    suggestionsContainer.show();
}


function selectCity(city) {
    $('#city-input').val(city);
    $('#suggestions').hide();
    getWeatherByCity(city);
}
