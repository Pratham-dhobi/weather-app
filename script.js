function toCelsius(temp) {
	return ((temp - 32)*5/9).toFixed(2);
}
function createHourlyCard(time, temp, result) {
	let div = document.createElement('div');
	div.className = 'inner-card';
	let icon;
	if(time <= result.currentConditions.sunset && time >= result.currentConditions.sunrise) {
		icon = `<span class="material-symbols-outlined icon">partly_cloudy_day</span>`; 
	}else {
		icon = `<span class="material-symbols-outlined icon">Bedtime</span>`;
	}
	div.innerHTML = `<span class="time-label">${time.slice(0,5)}</span><span class="hour-wise-temp-value">${toCelsius(temp)}<sup>o</sup></span>${icon}`;
	return div;
}

function createDayWiseCard(date, temp, result) {
	let div = document.createElement('div');
	div.className = 'inner-card';
	if(document.querySelector('.day-cards').childElementCount === 0) {
		div.innerHTML = `<span class="day-label">Today</span><span class="date-label">${date.slice(5).replace(/-/g, '/')}</span><span class="day-wise-temp-value">${toCelsius(temp)}<sup>o</span>`;
	}else{
		div.innerHTML = `<span class="day-label">${new Date(date).toLocaleDateString('en-US', {weekday: "long"})}</span><span class="date-label">${date.slice(5).replace(/-/g, '/')}</span><span class="day-wise-temp-value">${toCelsius(temp)}<sup>o</sup>`;
 	}
	return div;
}

function measureUV(uv) {
	if(uv >= 0 && uv <= 2) {
		return 'Low';
	}else if(uv >= 3 && uv <= 5) {
		return 'Moderate';
	}else if(uv >= 6 && uv <= 7) {
		return 'High';
	}else if(uv >= 8 && uv <= 10) {
		return 'Very High';
	}else if(uv >= 11) {
		return 'Extreme';
	}
}
function showNightIcon() {
	document.querySelector('.img').innerHTML = '<span class="material-symbols-outlined">nights_stay</span>';
}
function showSpinner(display) {
	if(!display) {
		document.querySelector('.spinner').style.display = 'none';
	}
}
function changeLineColor(card) {
	card.classList.add('lightbg');
}
function nightCardBg(card) {
	card.classList.add('nightcardbg');
}
fetchData = async(city) => {
	 	let loading = true;
	 	showSpinner(loading);

     	const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}%2CINDIA?unitGroup=us&key=FEJ88FR48ENSWZF3HAFLCW8KE`);
	 	const result = await response.json();
		loading = false;
		showSpinner(loading);
		
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
		
		document.querySelector('.temp-value').innerHTML = `<div class="temp-inner-container">${toCelsius(result.currentConditions.temp)}<sup><sup>o</sup></sup>C</div>`;

		document.querySelector('.pressure-value').innerHTML = `<div class="pressure-inner-container"><p>${Number.parseFloat(result.currentConditions.pressure)} hPa</p></div>`;

		document.querySelector('.uv-value').innerHTML = `<div class="uv-inner-container"><p>${result.currentConditions.uvindex}</p><p>${measureUV(result.currentConditions.uvindex)}</p></div>`;

		document.querySelector('.dew-value').innerHTML = `<div class="dew-inner-container">${toCelsius(result.currentConditions.dew)}<sup><sup>o</sup></sup>C</div>`;
		
		document.querySelector('#temp-text').innerText = result.currentConditions.conditions;

		document.querySelector('.hour-cards').innerHTML = '';
		for(let hour of result.days[0].hours) {
			if(hour.datetime >= result.currentConditions.datetime) {
				document.querySelector('.hour-cards').appendChild(createHourlyCard(hour.datetime, hour.temp, result));
			}
		}

		document.querySelector('.day-cards').innerHTML = '';
		for(let day of result.days) {
			document.querySelector('.day-cards').appendChild(createDayWiseCard(day.datetime, day.temp, result));
		}
		
		let left_container = document.querySelector('.left-container');
		let right_container = document.querySelector('.right-container');
		
		if(result.currentConditions.sunset.slice(0,1) === result.currentConditions.datetime.slice(0,1)) {
			
			left_container.style.background = 'url(/images/evening.jpg)';

		}else if(result.currentConditions.datetime > result.currentConditions.sunset || result.currentConditions.datetime < result.currentConditions.sunrise) {
	
			left_container.style.background = 'url(/images/night-image.jpg)';
			left_container.style.backgroundPositionX = '40%';
			left_container.style.backgroundRepeat = 'no-repeat';
			right_container.style.backgroundColor = 'rgb(12, 22, 64)';
			showNightIcon();
		
			let inner_cards = document.querySelectorAll('.inner-card');
			let icons = document.querySelectorAll('.icon');
			for(let i= 0;i<inner_cards.length;i++) {
				inner_cards[i].style.color = 'rgb(213, 213, 213)';
				changeLineColor(inner_cards[i]);
				nightCardBg(inner_cards[i]);
			}
			
			for (let i = 0; i < icons.length; i++) {
				icons[i].style.color = '#00fbfd';				
			}
			
			let headings = document.querySelectorAll('.heading');
			for (let i = 0; i < headings.length; i++) {
				headings[i].style.color = '#00fbfd';
			}
			
			let values = document.querySelectorAll('.value');
			for (let i = 0; i < values.length; i++) {
				values[i].style.color = 'white';
			}
		}
	}

function fetchinfo() {
	let city = document.querySelector('#search').value;
	
	if(city === '') {
		document.querySelector('#search').value = 'INDIA';
		fetchData('India');
	}else {
		fetchData(city);
	}
}
fetchData('surat');