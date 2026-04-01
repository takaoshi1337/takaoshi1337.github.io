async function loadWeather() {
    try {
        const res = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=55.8304&longitude=49.0661&current=temperature_2m,weathercode'
        );
        const data = await res.json();
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weathercode;

        const weatherMap = {
            0:  ['☀️', 'clear sky'],
            1:  ['🌤️', 'mainly clear'],
            2:  ['⛅', 'partly cloudy'],
            3:  ['☁️', 'overcast'],
            45: ['🌫️', 'foggy'],
            48: ['🌫️', 'icy fog'],
            51: ['🌦️', 'light drizzle'],
            53: ['🌦️', 'drizzle'],
            55: ['🌧️', 'heavy drizzle'],
            61: ['🌧️', 'light rain'],
            63: ['🌧️', 'rain'],
            65: ['🌧️', 'heavy rain'],
            71: ['🌨️', 'light snow'],
            73: ['🌨️', 'snow'],
            75: ['❄️', 'heavy snow'],
            80: ['🌦️', 'showers'],
            95: ['⛈️', 'thunderstorm'],
        };

        const [icon, desc] = weatherMap[code] ?? ['🌡️', 'unknown'];

        document.getElementById('weather-icon').textContent = icon;
        document.getElementById('weather-temp').textContent = `${temp}°C`;
        document.getElementById('weather-desc').textContent = desc;
    } catch {
        document.getElementById('weather-desc').textContent = 'unavailable';
    }
}

loadWeather();