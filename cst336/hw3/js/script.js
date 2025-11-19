const API = 'https://www.behindthename.com/api';
const KEY = 'au362010856';

const form = document.getElementById('lookupForm');
const nameInput = document.getElementById('nameInput');
const exactChk = document.getElementById('exactChk');
const statusEl = document.getElementById('status');
const errorEl = document.getElementById('formError');
const resultsEl = document.getElementById('results');
const randomBtn = document.getElementById('randomBtn');

form.addEventListener('submit', handleFormSubmit);
randomBtn.addEventListener('click', handleRandomSearch);

async function handleFormSubmit(event) {
    //no browser page reloading
    event.preventDefault();

    //clear any previous messages
    errorEl.textContent = '';
    resultsEl.innerHTML = '';
    statusEl.textContent = '';

    const nameToLookup = nameInput.value.trim();

    //validation
    if (nameToLookup === '') {
        document.getElementById('formError').textContent = "Enter a Name.";
        nameInput.focus();
        return;
    }

    console.log('Name:', nameToLookup);

    const exactOption = exactChk.checked ? '&exact=yes' : '';
    setStatus("Searching...");

    try {
        const url = `https://www.behindthename.com/api/lookup.json?name=${encodeURIComponent(nameToLookup)}&key=${KEY}${exactOption}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        //pass data into a fucntion that fills out card information here
        displayInformation(data);
        setStatus('Done.');
    } catch (e) {

    }
}

async function handleRandomSearch() {
    errorEl.textContent = '';
    resultsEl.innerHTML = '';
    statusEl.textContent = '';

    const exactOption = exactChk.checked ? '&exact=yes' : '';
    setStatus('Pulling random name');

    try {
        const randomUrl = `https://www.behindthename.com/api/random.json?key=${KEY}&number=1`;
        const randomResponse = await fetch(randomUrl);
        const randomData = await randomResponse.json();
        const randomName = Array.isArray(randomData.names) ? randomData.names[0] : null;
        console.log('Random name:', randomName);

        const url = `https://www.behindthename.com/api/lookup.json?name=${encodeURIComponent(randomName)}&key=${KEY}${exactOption}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        //pass data into a fucntion that fills out card information here
        displayInformation(data);
        setStatus('Done.');
    } catch (e) {

    }
}

function normalizeLookupPayload(payload) {
    if (Array.isArray(payload)) return payload;
    if (payload?.results) return payload.results;
    if (payload) return [payload];
    return [];
}

function displayInformation(data) {
    const items = normalizeLookupPayload(data);
    if (!items.length) {
        resultsEl.innerHTML = '<p class="muted">No details found.</p>';
        return;
    }

    let html = '';
    for (const item of items) {
        html += compileCard(item);
    }

    resultsEl.innerHTML = html;
}

function compileCard(item) {
    const name = item.name;
    const gender = parseGender(item.gender);
    const usages = parseUsage(item.usages);
    const genderIcon = genderImg(item.gender);

    return `
        <div class="card">
            <div class="card-header">
                <h2>${name}</h2>
                ${genderIcon}
            </div>
            <p>Gender: ${gender}</p>
            <p>Languages: ${usages}</p>
        </div>
    `;
}

function parseGender(gender) {
    if (gender === 'm') {
        return 'Masculine';
    }
    else if (gender === 'f') {

        return 'Feminine';
    }
    else {

        return 'Unisex';
    }
}

function parseUsage(usage) {
    let languages = [];
    if (!usage || !Array.isArray(usage) || usage.length === 0) {
        return 'Unknown';
    }
    
    for (const item of usage) {
        const fullName = item.usage_full || item.name || '';
        const code = item.usage_code || item.code || '';

        const label = fullName ? `${fullName} (${code.toUpperCase()})` : code.toUpperCase();

        if (!languages.includes(label)) {
            languages += ' ' + label;
        }
    }

    return languages;
}

function genderImg(gender) {
    let imgFile = '';

    if (gender === 'm') {
        imgFile = 'male.png';
    } else if (gender === 'f') {
        imgFile = 'female.png';
    } else {
        imgFile = 'unisex.png';
    }

  return `<img src="img/${imgFile}" alt="${gender} symbol" class="gender-icon">`;
}

function setStatus(input) {
    statusEl.textContent = input;
}