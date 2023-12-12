
// get the IP address from the previous page display the data related to this phon



function getParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Récupérer les valeurs des paramètres
    const param1 = urlParams.get('phone_ip');

    const resultPhrase = "Information about phone " + param1;
    const resultParagraph = document.createElement('h1');
    resultParagraph.textContent = resultPhrase;

    document.getElementById('output').appendChild(resultParagraph);

    initMap(param1);
    listUrl(param1);
}


// --------------- manage the data dealing with the location ------------


function isTooClose(locList, newLoc) {

    for (var i=0; i<locList.length; i++) {
        if (Math.abs(newLoc.latitude - locList[i].latitude) < 0.001 && Math.abs(newLoc.longitude - locList[i].longitude) < 0.001) {
            return true;
        }
    }
    return false;
}

async function initMap(param1) {

    const locationData = await extractLocationByIpAddress(param1);
    var latitude;
    var longitude;
    var date;


    var map;
    var marker;

    var redIcon = L.icon({
        iconUrl: '../../images/redping.png', // Replace with the path to your icon file
        iconSize: [28, 41], // Size of the icon
        iconAnchor: [14, 41], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -35] // Point from which the popup should open relative to the iconAnchor
    });
    var blueIcon = L.icon({
        iconUrl: '../../images/blueping.png', // Replace with the path to your icon file
        iconSize: [28, 41], // Size of the icon
        iconAnchor: [14, 41], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -35] // Point from which the popup should open relative to the iconAnchor
    });
    

    if (locationData.length === 0) {
        latitude = 0.0;
        longitude = 0.0;
        date = "1/1/1";

        map = L.map('map').setView([latitude, longitude], 13);
        marker = L.marker([latitude, longitude], {icon: redIcon}).addTo(map);
        marker.bindPopup("<b>No position found</b><br>").openPopup();


    } else {
        map = L.map('map').setView([parseFloat(locationData[locationData.length-1].latitude), parseFloat(locationData[locationData.length-1].longitude)], 13);
        var printLocList = [];
        for (var i =locationData.length-1; i>= 0; i--) {
            latitude = parseFloat(locationData[i].latitude);
            longitude = parseFloat(locationData[i].longitude);
            date = locationData[i].date;

            if (!isTooClose(printLocList, {latitude, longitude})) {

                printLocList.push({latitude, longitude});

                if (i === locationData.length-1) {
                    marker = L.marker([latitude, longitude], {icon: redIcon}).addTo(map);
                    marker.bindPopup("<b>Last position<br>On "+date+"</b><br>("+latitude+","+longitude+")").openPopup();
                } else {
                    marker = L.marker([latitude, longitude], {icon: blueIcon}).addTo(map);

                    marker.bindPopup("<b>Position<br>On "+date+"</b><br>("+latitude+","+longitude+")").closePopup();
                }
            }
        }
    }



    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    

    var popup = L.popup();

    function onMapClick(e) {
        alert("You clicked the map at " + e.latlng);
    }




    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }



    map.on('click', onMapClick);

}


    
async function extractLocationByIpAddress(ipAddress) {


    const response = await fetch('../../data/gps.txt');
    const fileContent = await response.text();
    const lines = fileContent.split('\n');

    var locList = [];

    for (const line of lines) {
        const [ip, gpsInfo] = line.split(',');

        const trimmedIp = ip.trim();

        if (trimmedIp === ipAddress) {

            // Extract latitude, longitude, and date without using regex
            const gpsParts = gpsInfo
                .replace('gps : (', '')
                .replace(')', '')
                .split(':')
                .map(part => part.trim());

            if (gpsParts.length === 3) {
                const latitude = gpsParts[0];
                const longitude = gpsParts[1];
                const date = gpsParts[2];
                locList.push({ latitude, longitude, date });
            } else {
                console.error('Invalid gpsInfo format:', gpsInfo);
            }
        }
    }

    return locList;
}


// --------------- manage the data dealing with the url scanned ----------------

async function listUrl(ipAddress) {

    const outputDiv = document.getElementById('outputurl');
    outputDiv.innerHTML = '';

    const listUrl = await extractUrlByIpAddress(ipAddress);
    if (listUrl.length === 0) {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('file-section0');

        const textDiv = document.createElement('div');
        textDiv.textContent = "No visited url found for this phone";
        textDiv.classList.add('line-text');

        sectionDiv.appendChild(textDiv);
        outputDiv.appendChild(sectionDiv);
    } else {


        listUrl.forEach(function (url, index) {
            // Création d'une div pour chaque section du fichier
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('file-section' + (index)%2);
    
            const linkElement = document.createElement("a");
            linkElement.href = url;
            linkElement.textContent = url;
            linkElement.style.color = "black";
            linkElement.style.fontSize = "20px";
    
    
            // Ajout du bouton et du texte à la div de la section
    
            sectionDiv.appendChild(linkElement);
    
            // Ajout de la section à la sortie
            outputDiv.appendChild(sectionDiv);
    
    
        });
    }

}

async function extractUrlByIpAddress(ipAddress) {


    const response = await fetch('../../data/url.txt');
    const fileContent = await response.text();
    const lines = fileContent.split('\n');
    var urlList = [];
    for (const line of lines) {
        const [ip, urlInfo] = line.split(',');

        const trimmedIp = ip.trim();

        if (trimmedIp === ipAddress) {

            const urlPart = urlInfo
                .replace('url : ', '')
                .trim();

            urlList.push(urlPart);

        }
    }

    return urlList;
}





// Appeler la fonction lors du chargement de la page
window.onload = getParameters;







