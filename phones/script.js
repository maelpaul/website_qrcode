// Displays the different ids of the corrupted phones to acceed the data related to these phones

function loadFile() {
    const filePath = '../data/id.txt';

    fetch(filePath)
        .then(response => response.text())
        .then(contents => displayFileContents(contents))
        .catch(error => console.error('An error occured while loading the file:', error));
}


function displayFileContents(contents) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    const lines = contents.split('\n');
    lines.forEach(function (line, index) {

        if (line !== "") {

            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('file-section' + (index)%2);

            const button = document.createElement('button');
            button.textContent = 'i';
            button.classList.add('section-button');

            button.addEventListener('click', function() {
                const newPath = './info';

                const parameterName = 'phone_id';
                const parameterValue = String(line);

                const newURL = `${newPath}?${parameterName}=${encodeURIComponent(parameterValue)}`;

                window.location.href = newURL;
            });

            const textDiv = document.createElement('div');
            textDiv.textContent = line;

            textDiv.classList.add('line-text');

            sectionDiv.appendChild(button);
            sectionDiv.appendChild(textDiv);

            outputDiv.appendChild(sectionDiv);
        }

    });
}
