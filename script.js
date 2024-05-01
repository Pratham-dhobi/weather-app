const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Surat%2CINDIA?unitGroup=us&key=FEJ88FR48ENSWZF3HAFLCW8KE';

function toCelsius(temp) {
	return ((temp - 32)*5/9).toFixed(2);
}
function createHourlyCard(time, temp) {
	let div = document.createElement('div');
	div.className = 'inner-card';
	div.innerHTML = `<span class="time-label">${time.slice(0,5)}</span><span class="hour-wise-temp-value">${toCelsius(temp)}<sup>o</sup></span><span class="material-symbols-outlined icon">partly_cloudy_day</span>`;
	return div;
}
function createDayWiseCard(date, temp) {
	let div = document.createElement('div');
	div.className = 'inner-card';
	if(document.querySelector('.day-cards').childElementCount === 0) {
		div.innerHTML = `<span class="day-label">Today</span><span class="date-label">${date.slice(5).replace(/-/g, '/')}</span><span class="day-wise-temp-value">${toCelsius(temp)}<sup><sup>o</sup></span>`;
	}else{
		div.innerHTML = `<span class="day-label">${new Date(date).toLocaleDateString('en-US', {weekday: "long"})}</span><span class="date-label">${date.slice(5).replace(/-/g, '/')}</span><span class="day-wise-temp-value">${toCelsius(temp)}<sup><sup>o</sup></span>`;
 	}
	return div;
}
fetchData = async(city) => {
     	const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}%2CINDIA?unitGroup=us&key=FEJ88FR48ENSWZF3HAFLCW8KE`);
	 	const result = await response.json();
	 	
		//set name
		if(city==='') {
			document.querySelector('#search').value = 'INDIA';
		}else {
			// set temperature
			document.querySelector('.temp').innerHTML = `${toCelsius(result.currentConditions.temp)}<sup><sup>o</sup></sup><span><sup>C</sup></span>`;
			// set feel like
			document.querySelector('.feels-like-value').innerHTML = `${toCelsius(result.currentConditions.feelslike)}<sup><sup>o</sup></sup>C`;
			// set visibility
			document.querySelector('.visibility-value').innerHTML = `${result.currentConditions.visibility} mi`;
			// set humidity
			document.querySelector('.humidity-value').innerHTML = `${result.currentConditions.humidity}%`;
			// set wind
			document.querySelector('.wind-value').innerHTML = `${result.currentConditions.windspeed}km/h`;
			
			document.querySelector('.temp-value').innerHTML = `${toCelsius(result.currentConditions.temp)}<sup><sup>o</sup></sup>C`;

			document.querySelector('.snow-value').innerHTML = `${result.currentConditions.snow}`;

			document.querySelector('.uv-value').innerHTML = `${result.currentConditions.uvindex}`;

			document.querySelector('.dew-value').innerHTML = `${result.currentConditions.dew}`;
			
			document.querySelector('.hour-cards').innerHTML = '';
			for(let hour of result.days[0].hours) {
				if(hour.datetime >= result.currentConditions.datetime) {
				 	document.querySelector('.hour-cards').appendChild(createHourlyCard(hour.datetime, hour.temp));
				}
			}

			document.querySelector('.day-cards').innerHTML = '';
			for(let day of result.days) {
				document.querySelector('.day-cards').appendChild(createDayWiseCard(day.datetime, day.temp));
			}
		}
	}

function fetchinfo() {
	let city = document.querySelector('#search').value;
	
	fetchData(city);
}
fetchData('surat');
