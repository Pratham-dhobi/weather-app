const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Surat%2CINDIA?unitGroup=us&key=FEJ88FR48ENSWZF3HAFLCW8KE';

try {
	fetchData = async() => {
        const response = await fetch(url);
	    const result = await response.json();
	    const days = result.days;
		console.log(days[0].datetime);
    }
    fetchData();
} catch (error) {
	console.error(error);
}