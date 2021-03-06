var data = '[{"Afspraak":{"Id":2,"naamKlant":"J. Jansen","adresKlant":"Elandsgracht 34, Amsterdam","gewenstTijdstip":"2020-01-07T10:00:00Z","dichtsbijzijndeHalte":"Marnixstraat","afstandHalte":340,"redenAfspraak":"Wifi doet het niet meer","naamMonteur":"Wim Kan"}},{"Afspraak":{"Id":1,"naamKlant":"P. Pieterse","adresKlant":"Wiebautstraat 12, Amsterdam","gewenstTijdstip":"2020-01-07T12:15:00Z","dichtsbijzijndeHalte":"Wiebautstraat","afstandHalte":200,"redenAfspraak":"Internet klapt er voortdurend uit","naamMonteur":"Wim Kan"}},{"Afspraak":{"Id":15,"naamKlant":"R. Genen","adresKlant":"Frans Halsstraat 213, Amsterdam","gewenstTijdstip":"2020-07-01T10:15:00Z","dichtsbijzijndeHalte":"Burg. v. Leeuwenlaan","afstandHalte":340,"redenAfspraak":"Soms geen internet","naamMonteur":"Wim Kan"}},{"Afspraak":{"Id":16,"naamKlant":"T. Klenen","adresKlant":"Velserweg 67, Amsterdam","gewenstTijdstip":"2020-07-01T08:15:00Z","dichtsbijzijndeHalte":"Molenwerf 80","afstandHalte":100,"redenAfspraak":"iPad werkt niet met internet","naamMonteur":"Wim Kan"}},{"Afspraak":{"Id":11,"naamKlant":"A. Kleding","adresKlant":"Louwesweg 5, Amsterdam","gewenstTijdstip":"2020-07-01T11:45:00Z","dichtsbijzijndeHalte":"Louwesweg","afstandHalte":200,"redenAfspraak":"Kastje knippert de hele tijd","naamMonteur":"Klaas Besten"}},{"Afspraak":{"Id":10,"naamKlant":"W. Wever","adresKlant":"Antwerpenbaan 23, Amsterdam","gewenstTijdstip":"2020-07-01T14:30:00Z","dichtsbijzijndeHalte":"Oudenaardeplantsoen","afstandHalte":120,"redenAfspraak":"Internet is traag","naamMonteur":"Klaas Besten"}},{"Afspraak":{"Id":9,"naamKlant":"P. Denzer","adresKlant":"Baldwinstraat 67, Amsterdam","gewenstTijdstip":"2020-07-01T07:00:00Z","dichtsbijzijndeHalte":"Matterhorn","afstandHalte":50,"redenAfspraak":"Wifi doet het niet in de ochtend","naamMonteur":"Klaas Besten"}},{"Afspraak":{"Id":8,"naamKlant":"J. Huizen","adresKlant":"Velserweg 4, Amsterdam","gewenstTijdstip":"2020-07-01T14:00:00Z","dichtsbijzijndeHalte":"Molenwerf","afstandHalte":100,"redenAfspraak":"Internet hapert in de avond","naamMonteur":"Klaas Besten"}},{"Afspraak":{"Id":7,"naamKlant":"R. Glas","adresKlant":"Waterleliegracht 7, Amsterdam","gewenstTijdstip":"2020-07-01T11:45:00Z","dichtsbijzijndeHalte":"Van Hallstraat","afstandHalte":230,"redenAfspraak":"Slecht internet","naamMonteur":"Klaas Besten"}},{"Afspraak":{"Id":6,"naamKlant":"H. Klezen","adresKlant":"Blauwburgwal 12, Amsterdam","gewenstTijdstip":"2020-07-01T08:15:00Z","dichtsbijzijndeHalte":"Nieuwzijds Wal","afstandHalte":350,"redenAfspraak":"Soms wel, soms geen internet","naamMonteur":"Klaas Besten"}}]'
var everyAppointment = JSON.parse(data)

const LOG_DETAILS = 1;
const LOG_STEPS = 2;
const LOG_ERRORS = 3;
const LOG_LEVEL = LOG_DETAILS;


// variabele index.html


/**
 * Function that onyl writes info to the console if its message exceeds the general LOG LEVEL
 * @param {*} msg 
 * @param {*} msgSeverity (one of the values LOG_DETAILS, LOG_STEPS, LOG_ERRORS)
 */

function logInfo (msg,msgSeverity) {
	if (msgSeverity >= LOG_LEVEL) {
		console.log (msg);
	}
}

/**
 * ImportMap is a function that read the content from a URL and expects JSON in return.
 * It then hands over the content to the function processMap to actually process its content
 * 
 * @param {*} fileName 
 */

function importMap (fileName) {

 	var xmlhttp = new XMLHttpRequest();
	var url = fileName;
	
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myArr = JSON.parse(this.responseText);
			processMapInfo(myArr);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

/**
 * Reads the line information and updates the internal map structure
 * @param {*} lineData (JSON string as object)
 */
function processMapInfo (lineData) {
	var mainItem;
	var networkItem;
	var networkItemStop;
	var listOfStops = {}; // declared as associative array

	for (mainItem in lineData) {
		logInfo (mainItem,LOG_DETAILS);
		// There should be only 1 mainItem that starts with something like "GVB_"
		// We need this to access the other information

		/* First read the transportation type and its id */
		typeOfTransportation = lineData[mainItem]["Line"].TransportType;
		idOfTransportation = lineData[mainItem]["Line"].LinePublicNumber;

		for (networkItem in lineData[mainItem]["Network"]) {
			// usually there are 1 or 2 networkItems that each represent a list of network stops
			for (networkItemStop in lineData[mainItem]["Network"][networkItem]) {
				// scan all stops
				// add a stop to a list based on its order; this is described by UserStopOrderNumber
				// but only when it does not exist already
				if (!listOfStops.hasOwnProperty(lineData[mainItem]["Network"][networkItem][networkItemStop].UserStopOrderNumber)) {
					listOfStops [lineData[mainItem]["Network"][networkItem][networkItemStop].UserStopOrderNumber] = 
						lineData[mainItem]["Network"][networkItem][networkItemStop].TimingPointName;
				}
			}
		}
	}	
	logInfo (listOfStops,LOG_DETAILS);

	// listOfStops now has all the info to update your map structure :-)
}

/**
 * We need a way to check that ALL imports have finished as this is a ASYNCHRONOUS process
 * @param {*} expectedNumberOfFiles 
 */
/**function checkImport (expectedNumberOfFiles) {
	if (listOfLines.length == expectedNumberOfFiles) {
		clearTimeout ();

		// etc... all JSON files have been processed ... do your thing :-)
	}
}
*/

/** 
 * Eigen code
*/




function laadAfspraken() {
	var appointmentContainer = document.getElementById("afspraakContainer"); 
	appointmentContainer.innerHTML = ""; 
	for (var i = 0; i < everyAppointment.length; i++) {
		// var afspraken = everyAppointment[i]; 
		// appointmentContainer.innerHTML += '<div class="appointments" data-index="'+i+'">'+' afspraak '+ i+'</div>'
		console.log(everyAppointment[i].Afspraak.naamKlant);

		var createDiv = document.createElement('div') 
		var makeTextNode = document.createTextNode(everyAppointment[i].Afspraak.naamKlant + " | ");  
		createDiv.appendChild(makeTextNode)
		var makeTextNode = document.createTextNode(everyAppointment[i].Afspraak.adresKlant + " | ");  
		createDiv.appendChild(makeTextNode)
		var makeTextNode = document.createTextNode(everyAppointment[i].Afspraak.gewenstTijdstip + " | ");  
		createDiv.appendChild(makeTextNode)
		var makeTextNode = document.createTextNode(everyAppointment[i].Afspraak.dichtsbijzijndeHalte + " | ");  
		createDiv.appendChild(makeTextNode)
		var makeTextNode = document.createTextNode(everyAppointment[i].Afspraak.afstandHalte + " | ");  
		createDiv.appendChild(makeTextNode)
		var makeTextNode = document.createTextNode(everyAppointment[i].Afspraak.redenAfspraak + " | ");  
		createDiv.appendChild(makeTextNode)
		var makeTextNode = document.createTextNode(everyAppointment[i].Afspraak.naamMonteur + " | ");  
		createDiv.appendChild(makeTextNode)
		appointmentContainer.parentNode.insertBefore(createDiv, appointmentContainer)


	}
	
	
	
	
};


function addButtonActions() {
	var afsprakenLaden = document.getElementById("afspraakContent");
	
	afsprakenLaden.addEventListener('click', function() {
	laadAfspraken();
	});
}



/**
 * INITIALISATION
 * Create the map of tram and metro data
 */

importMap ("https://ori.clow.nl/algds/GVB_1_1.json");
importMap ("https://ori.clow.nl/algds/GVB_2_1.json");
importMap ("https://ori.clow.nl/algds/GVB_3_1.json");
importMap ("https://ori.clow.nl/algds/GVB_4_1.json");
importMap ("https://ori.clow.nl/algds/GVB_5_1.json");
importMap ("https://ori.clow.nl/algds/GVB_7_1.json");
importMap ("https://ori.clow.nl/algds/GVB_11_1.json");
importMap ("https://ori.clow.nl/algds/GVB_12_1.json");
importMap ("https://ori.clow.nl/algds/GVB_13_1.json");
importMap ("https://ori.clow.nl/algds/GVB_14_1.json");
importMap ("https://ori.clow.nl/algds/GVB_17_1.json");
importMap ("https://ori.clow.nl/algds/GVB_19_1.json");
importMap ("https://ori.clow.nl/algds/GVB_24_1.json");
importMap ("https://ori.clow.nl/algds/GVB_26_1.json");
importMap ("https://ori.clow.nl/algds/GVB_50_1.json");
importMap ("https://ori.clow.nl/algds/GVB_51_1.json");
importMap ("https://ori.clow.nl/algds/GVB_52_1.json");
importMap ("https://ori.clow.nl/algds/GVB_53_1.json");
importMap ("https://ori.clow.nl/algds/GVB_54_1.json");

addButtonActions(); 
// add a short wait so we know ALL 16 lines have been processed


