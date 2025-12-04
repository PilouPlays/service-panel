function initServicePage(serviceName) {

    let toggleBtn = document.getElementById("toggleBtn");
    let timerDisplay = document.getElementById("timer");
    let historyTable = document.getElementById("historyTable");
    let totalDisplay = document.getElementById("totalTime");
    let resetBtn = document.getElementById("resetBtn");

    let isRunning = false;
    let startTime = null;
    let interval = null;

    // Charger données
    let data = JSON.parse(localStorage.getItem(serviceName)) || {
        history: [],
        total: 0
    };

    // Affiche l'historique
    data.history.forEach(entry => {
        addRow(entry.date, formatTime(entry.duration));
    });

    // Affiche total cumulé
    totalDisplay.textContent = formatTime(data.total);

    // Fonction timer
    function updateTimer() {
        let diff = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = formatTime(diff);
    }

    // Ajouter ligne au tableau
    function addRow(date, duration) {
        let row = historyTable.insertRow();
        row.insertCell(0).textContent = date;
        row.insertCell(1).textContent = duration;
    }

    // Formater en HH:MM:SS
    function formatTime(sec) {
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec % 3600) / 60);
        let s = sec % 60;
        return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    }

    // Bouton démarrer / arrêter
    toggleBtn.onclick = () => {

        if (!isRunning) {
            // démarrer
            isRunning = true;
            toggleBtn.textContent = "Arrêter le service";
            startTime = Date.now();
            interval = setInterval(updateTimer, 1000);

        } else {
            // arrêter
            isRunning = false;
            toggleBtn.textContent = "Démarrer le service";
            clearInterval(interval);

            let duration = Math.floor((Date.now() - startTime) / 1000);

            let date = new Date().toLocaleString("fr-FR");

            addRow(date, formatTime(duration));

            // Sauvegarde
            data.history.push({ date, duration });
            data.total += duration;
            totalDisplay.textContent = formatTime(data.total);

            localStorage.setItem(serviceName, JSON.stringify(data));
        }
    };

    // RESET
    resetBtn.onclick = () => {
        if (confirm("Effacer tout l’historique ?")) {
            data = { history: [], total: 0 };
            localStorage.setItem(serviceName, JSON.stringify(data));
            location.reload();
        }
    };
    }

