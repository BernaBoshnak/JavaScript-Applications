function attachEvents() {
    document.getElementById('submit').addEventListener('click', getWeather);
}

attachEvents();

async function getWeather() {
    const input = document.getElementById('location');
    const cityName = input.value;

    const code = await getCode(cityName);

    const [current, upcoming] = await Promise.all([
        getWeatherToday(code),
        getWeatherUpcoming(code)
    ]);
}

async function getCode(cityName) {
    const forecast = document.getElementById('forecast');
    try {
        const url = 'http://localhost:3030/jsonstore/forecaster/locations';

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`${response.status} (${response.statusText})`);
        }
        const town = data.find(x => x.name.toLowerCase() === cityName.toLowerCase());

        if (!town) {
            throw new Error('Error (Invalid town name)!');
        }
        
        forecast.style.display = 'block';
        return town.code;
    } catch (error) {
        forecast.style.display = 'block';
        const pElement = create('p', undefined, error.message);
        pElement.setAttribute('id', 'errorMessage');
        forecast.appendChild(pElement);
    }
}

const weatherSymbols = {
    'Sunny': '☀',
    'Partly sunny': '⛅',
    'Overcast': '☁',
    'Rain': '☂',
    'Degrees': '°'
}

async function getWeatherToday(code) {
    const url = 'http://localhost:3030/jsonstore/forecaster/today/' + code;

    const response = await fetch(url);
    const data = await response.json();

    const current = document.getElementById('current');

    const divElement = create('div', 'forecasts');
    const firstSpanElement = create('span', 'condition symbol', weatherSymbols[data.forecast.condition]);
    divElement.appendChild(firstSpanElement);
    const secondSpanElement = create('span', 'condition');
    const name = create('span', 'forecast-data', data.name);
    const spanElement = create('span', 'forecast-data', `${data.forecast.low}° / ${data.forecast.high}°`);
    const secondSpan = create('span', 'forecast-data', data.forecast.condition);

    secondSpanElement.appendChild(name);
    secondSpanElement.appendChild(spanElement);
    secondSpanElement.appendChild(secondSpan);
    divElement.appendChild(secondSpanElement);

    current.appendChild(divElement);
}

async function getWeatherUpcoming(code) {
    const url = 'http://localhost:3030/jsonstore/forecaster/upcoming/' + code;

    const response = await fetch(url);
    const data = await response.json();

    const upcoming = document.getElementById('upcoming');
    const divElement = create('div', 'forecasts-info');

    for (const forecast of data.forecast) {
        const firstSpanElement = create('span', 'upcoming');
        divElement.appendChild(firstSpanElement);

        const spanElement = create('span', 'symbol', weatherSymbols[forecast.condition]);
        const secondSpan = create('span', 'forecast-data', `${forecast.low}° / ${forecast.high}°`);
        const thirdSpan = create('span', 'forecast-data', forecast.condition);
        firstSpanElement.appendChild(spanElement);
        firstSpanElement.appendChild(secondSpan);
        firstSpanElement.appendChild(thirdSpan);
    }

    upcoming.appendChild(divElement);
}

function create(type, className, content) {
    const result = document.createElement(type);

    result.className = className;

    if (content) {
        result.textContent = content;
    }
    return result;
}
