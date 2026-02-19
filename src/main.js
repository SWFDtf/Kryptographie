// Globale Variablen für Stundenlogik
let currentTotalHours = 0;
let currentWrittenCount = 0;

function updateLogic() {
    let totalHours = 0;
    let totalWritten = 0;
    let errors = [];
    let warnings = [];

    const form = document.getElementById('wahlbogen');
    const selects = form.querySelectorAll('select.course-select');
    
    // Dynamische Stunden für FS2/FS3
    const fs2Code = document.getElementById('fs2_code').value;
    const fs2Hours = (fs2Code === 'S1' || fs2Code === 'R1') ? 4 : 3;
    document.getElementById('fs2_hours').innerText = fs2Hours;
    
    const fs3Code = document.getElementById('fs3_code').value;
    const fs3Hours = (fs3Code === 'S1' || fs3Code === 'R1') ? 4 : 3;
    document.getElementById('fs3_hours').innerText = fs3Hours;

    selects.forEach(s => s.classList.remove('written'));

    let countFS = 0, countNW = 0, countGW = 0, countKUMU = 0, hasRelOrPL = false;
    let gwWritten = false, nwWritten = false, fs2Written = false;

    selects.forEach(select => {
        const val = select.value;
        if (!val) return;

        let hours = parseInt(select.getAttribute('data-hours'));
        if (select.id === 'FS2') hours = fs2Hours;
        if (select.id === 'FS3') hours = fs3Hours;

        // Ist schriftlich?
        let isWritten = (val === 'S' || val.endsWith('_S'));
        if (isWritten) {
            totalWritten++;
            select.classList.add('written');
            if (select.getAttribute('data-field') === '2') gwWritten = true;
            if (select.getAttribute('data-type') === 'NW') nwWritten = true;
            if (select.id === 'FS2') fs2Written = true;
        }

        if (select.id !== 'SP') totalHours += hours; else totalHours += hours; 

        // Kategorien
        const type = select.getAttribute('data-type');
        const field = select.getAttribute('data-field');

        if (select.id === 'E5' || select.id === 'FS2' || select.id === 'FS3') countFS++;
        if (select.id === 'KU' || select.id === 'MU') countKUMU++;
        if (field === '2') countGW++;
        if (type === 'NW') countNW++;
        if (select.id === 'REL') hasRelOrPL = true;
    });

    currentTotalHours = totalHours;
    currentWrittenCount = totalWritten;

    // Validierung
    if (!document.getElementById('D').value) errors.push("Deutsch ist Pflicht.");
    if (!document.getElementById('E5').value) errors.push("Fortgeführte FS (E5) ist Pflicht.");
    if (!document.getElementById('M').value) errors.push("Mathe ist Pflicht.");
    if (!document.getElementById('SP').value) errors.push("Sport ist Pflicht.");
    if (countKUMU === 0) errors.push("Kunst oder Musik Pflicht.");
    if (countGW === 0) errors.push("Mind. eine Gesellschaftswissenschaft Pflicht.");
    if (!hasRelOrPL) errors.push("Religion oder Philosophie Pflicht.");
    // Bei Zuvielen Stunden oder aber auch schriftliche Fächer
    if (totalHours > 37) errors.push("Zu viele Stunden.");
    if (totalWritten > 8) errors.push("Zu viele schriftliche Fächer.");   
    
    const isLingProfile = (countFS >= 2);
    const isSciProfile = (countNW >= 2);
    if (!isLingProfile && !isSciProfile) errors.push("Schwerpunkt fehlt (2. FS oder 2. NW wählen).");
    if (countNW === 0) errors.push("Mind. eine klassische Naturwissenschaft (BI, PH, CH) Pflicht.");
    
    const ifSelect = document.getElementById('IF').value;
    if (ifSelect && countNW < 2) errors.push("Informatik nur als 2. NW wählbar.");

    if (!gwWritten && !nwWritten && !fs2Written) warnings.push("Schwerpunktfach: I.d.R. muss ein weiteres Fach schriftlich sein (FS, GW oder NW).");

    document.getElementById('sumHours').innerText = totalHours;
    document.getElementById('sumWritten').innerText = totalWritten;

    
    const valBox = document.getElementById('validationOutput');
    valBox.className = 'validation-box';
    
    if (errors.length > 0) {
        valBox.classList.add('error');
        valBox.innerHTML = "<strong>Fehler:</strong><ul class='error-list'>" + errors.map(e => `<li>${e}</li>`).join('') + "</ul>";
    } else if (warnings.length > 0) {
        valBox.classList.add('warning');
        valBox.innerHTML = "<strong>Hinweise:</strong><ul class='error-list'>" + warnings.map(w => `<li>${w}</li>`).join('') + "</ul>";
    } else {
        valBox.classList.add('ok');
        valBox.innerHTML = "<strong>Wahl gültig!</strong> Alle Bedingungen scheinen erfüllt.";
    }
}

// --- PDF DRUCK FUNKTION ---
function printPDF() {
    // 1. Zusammenfassungstabelle füllen
    const tbody = document.getElementById('summaryBody');
    tbody.innerHTML = '';
    
    const selects = document.querySelectorAll('select.course-select');
    let rows = [];

    // Daten sammeln
    selects.forEach(sel => {
        if(!sel.value) return;

        let name = sel.getAttribute('data-name');
        let code = sel.id;
        let field = sel.getAttribute('data-field');
        let typeCode = sel.value; // M, S, ER_S...
        
        // Namen verfeinern
        if(code === 'FS2') {
            code = document.getElementById('fs2_code').value;
            name = "2. Fremdsprache (" + code + ")";
        }
        if(code === 'FS3') {
            code = document.getElementById('fs3_code').value;
            name = "3. Fremdsprache (" + code + ")";
        }
        if(code === 'VX') {
             // Vertiefung
             const sub = sel.options[sel.selectedIndex].text;
             name = "Vertiefung: " + sub;
        }

        // Stunden
        let hours = parseInt(sel.getAttribute('data-hours'));
        if (sel.id === 'FS2') hours = parseInt(document.getElementById('fs2_hours').innerText);
        if (sel.id === 'FS3') hours = parseInt(document.getElementById('fs3_hours').innerText);

        // Art (Lesbar machen)
        let typeText = "Mündlich";
        if(typeCode === 'S' || typeCode.includes('_S')) typeText = "Schriftlich";
        if(code === 'SP') typeText = "Teilnahme"; // Sport

        rows.push({ field, name, code, typeText, hours });
    });

    // Sortieren nach Feld
    rows.sort((a,b) => a.field - b.field);

    // Rendern
    rows.forEach(r => {
        let tr = document.createElement('tr');
        let fieldTxt = (r.field === '0') ? '-' : r.field;
        tr.innerHTML = `
            <td style="text-align:center">${fieldTxt}</td>
            <td>${r.name}</td>
            <td style="text-align:center">${r.code}</td>
            <td>${r.typeText}</td>
            <td style="text-align:center">${r.hours}</td>
        `;
        tbody.appendChild(tr);
    });

    // Footer Stats im Print
    document.getElementById('printSumHours').innerText = currentTotalHours;
    document.getElementById('printSumWritten').innerText = currentWrittenCount;

    // 2. Druckdialog öffnen
    window.print();
}

// Initialisierung
updateLogic();
