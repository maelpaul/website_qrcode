// script.js

function loadFile() {
    // Chemin d'accès au fichier (à personnaliser)
    const filePath = '../paquets.txt';

    fetch(filePath)
        .then(response => response.text())
        .then(contents => displayFileContents(contents))
        .catch(error => console.error('Erreur lors du chargement du fichier:', error));
}

function displayFileContents(contents) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    const lines = contents.split('\n');
    lines.forEach(function (line, index) {
        // Création d'une div pour chaque section du fichier
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('file-section' + (index)%2);

        // Ajout d'un bouton à gauche du texte
        const button = document.createElement('button');
        button.textContent = 'i';
        button.classList.add('section-button');

        // Ajout du texte dans la div de la section
        const textDiv = document.createElement('div');
        textDiv.textContent = line;

        textDiv.classList.add('line-text');

        // Ajout du bouton et du texte à la div de la section
        sectionDiv.appendChild(button);
        sectionDiv.appendChild(textDiv);

        // Ajout de la section à la sortie
        outputDiv.appendChild(sectionDiv);
    });
    console.log(outputDiv);
}
