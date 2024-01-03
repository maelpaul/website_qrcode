
// get the id from the previous page and display the data related to the phone

function getParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const param1 = urlParams.get('phone_id');

    const resultPhrase = "Information about phone " + param1;
    const resultParagraph = document.createElement('h1');
    resultParagraph.textContent = resultPhrase;

    document.getElementById('output').appendChild(resultParagraph);

    initMap(param1);
    listUrl(param1);
    SMSFile(param1);
    initVideoReader(param1);
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

    const locationData = await extractLocationByID(param1);
    var latitude;
    var longitude;
    var date;


    var map;
    var marker;

    var redIcon = L.icon({
        iconUrl: '../../images/redping.png', 
        iconSize: [28, 41], 
        iconAnchor: [14, 41], 
        popupAnchor: [0, -35] 
    });
    var blueIcon = L.icon({
        iconUrl: '../../images/blueping.png', 
        iconSize: [28, 41], 
        iconAnchor: [14, 41], 
        popupAnchor: [0, -35] 
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


    
async function extractLocationByID(id) {


    const response = await fetch('../../data/gps.txt');
    const fileContent = await response.text();
    const lines = fileContent.split('\n');

    var locList = [];

    for (const line of lines) {
        const [ids, gpsInfo] = line.split(',');

        const trimmedId = ids.trim();

        if (trimmedId === id) {

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

async function listUrl(id) {

    const outputDiv = document.getElementById('outputurl');
    outputDiv.innerHTML = '';

    const listUrl = await extractUrlByID(id);
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

            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('file-section' + (index)%2);
    
            const linkElement = document.createElement("a");
            linkElement.href = url;
            linkElement.textContent = url;
            linkElement.style.color = "black";
            linkElement.style.fontSize = "20px";
    
            sectionDiv.appendChild(linkElement);
            outputDiv.appendChild(sectionDiv);
    
    
        });
    }

}

async function extractUrlByID(id) {


    const response = await fetch('../../data/url.txt');
    const fileContent = await response.text();
    const lines = fileContent.split('\n');
    var urlList = [];
    for (const line of lines) {
        const [ids, urlInfo] = line.split(',');

        const trimmedId = ids.trim();

        if (trimmedId === id) {

            const urlPart = urlInfo
                .replace('url : ', '')
                .trim();

            urlList.push(urlPart);

        }
    }

    return urlList;
}

// --------------- manage the data dealing with the sms retrieved ----------------

async function SMSFile(id) {
    var fileUrl = '../../data/sms/sms_'+id+'.txt';
    document.getElementById('downloadButton').addEventListener('click', function() {
    
        var a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileUrl.split('/').pop();
    
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    });
}


// ------------------------ display the video reader ---------------------------

function initVideoReader(param1) {
    var videoPlayer = document.getElementById('myVideo');
    var videoError = document.getElementById('videoError');
    var videoFileName = "../../video/"+param1+".mp4"; 
    
    videoPlayer.src = videoFileName;

    videoPlayer.addEventListener('error', function(e) {
        
        if (videoPlayer.error.code == videoPlayer.error.MEDIA_ERR_SRC_NOT_SUPPORTED){
            errorText = "No video found for this phone";
        }
       
        videoError.innerHTML = '';

        videoError.classList.add('file-section0');

        const textDiv = document.createElement('div');
        textDiv.textContent = errorText;
        textDiv.classList.add('line-text');

        videoError.appendChild(textDiv);
        videoError.style.display = 'block';
        videoPlayer.style.display = 'none'; 
    }); 
}



// ------------ call the functions above when loading the page ------------
window.onload = getParameters;



