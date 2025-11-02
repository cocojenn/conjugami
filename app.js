// CONJUGAMI - APP.JS avec système de variantes
// Charge les verbes depuis verbs.json et gère l'adaptation automatique

// Variables globales
let verbDatabase = {};
let currentVerb = null;
let searchedVerb = null; // Le verbe que l'utilisateur a cherché
let baseVerb = null; // Le verbe de base utilisé pour la conjugaison

// Noms des temps
const tenseNames = {
    present: '🔵 Présent',
    passeCompose: '🟣 Passé Composé',
    imparfait: '🟡 Imparfait',
    futurProche: '🟢 Futur Proche',
    futurSimple: '🔴 Futur Simple',
    plusQueParfait: '🟠 Plus-que-parfait',
    conditionnel: '🟤 Conditionnel'
};

// LocalStorage helpers
const storage = {
    getHistory: () => JSON.parse(localStorage.getItem('conjugami_history') || '[]'),
    addToHistory: (verb) => {
        let history = storage.getHistory();
        if (!history.includes(verb)) {
            history.unshift(verb);
            localStorage.setItem('conjugami_history', JSON.stringify(history));
        }
    },
    getExamples: (verb, tense) => JSON.parse(localStorage.getItem(`conjugami_examples_${verb}_${tense}`) || '[]'),
    addExample: (verb, tense, example) => {
        let examples = storage.getExamples(verb, tense);
        examples.push({ text: example, date: new Date().toISOString() });
        localStorage.setItem(`conjugami_examples_${verb}_${tense}`, JSON.stringify(examples));
    },
    deleteExample: (verb, tense, index) => {
        let examples = storage.getExamples(verb, tense);
        examples.splice(index, 1);
        localStorage.setItem(`conjugami_examples_${verb}_${tense}`, JSON.stringify(examples));
    },
    getStats: () => {
        return {
            verbes: storage.getHistory().length,
            exemples: Object.keys(localStorage).filter(k => k.startsWith('conjugami_examples_')).reduce((acc, key) => {
                return acc + JSON.parse(localStorage.getItem(key)).length;
            }, 0)
        };
    }
};

// Charger les verbes depuis verbs.json
async function loadVerbs() {
    try {
        const response = await fetch('verbs.json');
        const data = await response.json();
        verbDatabase = data.verbs;
        console.log(`✅ ${Object.keys(verbDatabase).length} verbes de base chargés`);
    } catch (error) {
        console.error('❌ Erreur chargement verbs.json:', error);
        alert('Erreur: Impossible de charger les verbes. Vérifie que verbs.json est présent.');
    }
}
verbDatabase = data.verbs;
        window.verbDatabase = verbDatabase;  // ← AJOUTE CETTE LIGNE
        console.log(`✅ ${Object.keys(verbDatabase).length} verbes de base chargés`);

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Recherche de verbe (avec support des variantes)
function searchVerb(query) {
    query = query.toLowerCase().trim();
    
    // 1. Chercher directement dans les verbes de base
    for (let verb in verbDatabase) {
        const data = verbDatabase[verb];
        
        // Chercher en français
        if (data.fr === query) return { base: verb, searched: query, isVariant: false };
        
        // Chercher dans les traductions
        if (data.en.some(t => t === query)) return { base: verb, searched: query, isVariant: false };
        if (data.es.some(t => t === query)) return { base: verb, searched: query, isVariant: false };
        if (data.pt.some(t => t === query)) return { base: verb, searched: query, isVariant: false };
        if (data.it.some(t => t === query)) return { base: verb, searched: query, isVariant: false };
    }
    
    // 2. Chercher dans les variantes
    for (let verb in verbDatabase) {
        const data = verbDatabase[verb];
        if (data.variants && data.variants.includes(query)) {
            return { base: verb, searched: query, isVariant: true };
        }
    }
    
    return null;
}

// Adapter une conjugaison pour une variante
function adaptConjugation(baseVerb, searchedVerb, conjugation) {
    // Si c'est le même verbe, pas d'adaptation
    if (baseVerb === searchedVerb) return conjugation;
    
    // Remplacer le verbe de base par la variante
    // Ex: "je viens" → "je reviens" (venir → revenir)
    
    // Méthode simple : remplacer toutes les occurrences
    // Pour les verbes en -ER : parler → reparler
    // Pour les irréguliers : venir → revenir
    
    // Trouver le radical du verbe de base
    let baseRoot = baseVerb;
    if (baseVerb.endsWith('er')) {
        baseRoot = baseVerb.slice(0, -2);
    } else if (baseVerb.endsWith('ir')) {
        baseRoot = baseVerb.slice(0, -2);
    } else if (baseVerb.endsWith('re')) {
        baseRoot = baseVerb.slice(0, -2);
    } else {
        // Verbe irrégulier - on garde tout
        baseRoot = baseVerb;
    }
    
    // Trouver le radical de la variante
    let searchedRoot = searchedVerb;
    if (searchedVerb.endsWith('er')) {
        searchedRoot = searchedVerb.slice(0, -2);
    } else if (searchedVerb.endsWith('ir')) {
        searchedRoot = searchedVerb.slice(0, -2);
    } else if (searchedVerb.endsWith('re')) {
        searchedRoot = searchedVerb.slice(0, -2);
    }
    
    // Remplacer intelligemment
    // Cas spécial pour les verbes irréguliers comme venir/revenir
    const irregularMappings = {
        'vien': 'revien', 'ven': 'reven', 'viend': 'reviend', 'vienn': 'revienn',
        'vai': 'revai', 'von': 'revon', 'all': 'reall',
        'pren': 'appren', 'prenn': 'apprenn', 'pri': 'appri',
        'met': 'remet', 'mett': 'remett', 'mi': 'remi',
        'fai': 'refai', 'fass': 'refass', 'fer': 'refer', 'fe': 'refe',
        'di': 'redi', 'disen': 'redisen', 'dison': 'redison'
    };
    
    // Essayer de trouver un mapping
    let adapted = conjugation;
    
    // Pour les verbes réguliers, remplacement simple du radical
    if (baseVerb.endsWith('er') && searchedVerb.endsWith('er')) {
        adapted = conjugation.replace(new RegExp(baseRoot, 'g'), searchedRoot);
    } else {
        // Pour les irréguliers, essayer les mappings
        for (let [base, variant] of Object.entries(irregularMappings)) {
            if (adapted.includes(base) && searchedVerb.includes(variant.slice(0, -1))) {
                adapted = adapted.replace(new RegExp(base, 'g'), variant);
            }
        }
        
        // Si ça n'a pas marché, essayer le remplacement simple
        if (adapted === conjugation) {
            adapted = conjugation.replace(new RegExp(baseRoot, 'g'), searchedRoot);
        }
    }
    
    return adapted;
}

// Afficher la conjugaison avec support des variantes
function displayConjugation(searchResult) {
    baseVerb = searchResult.base;
    searchedVerb = searchResult.searched;
    currentVerb = searchedVerb; // On stocke le verbe cherché
    
    const data = verbDatabase[baseVerb];
    
    // Titre avec indication de variante
    let titleHTML = searchedVerb.toUpperCase();
    if (searchResult.isVariant) {
        titleHTML += `<br><small style="font-size: 14px; color: #9B8FD8;">💡 Se conjugue comme ${baseVerb.toUpperCase()}</small>`;
    }
    document.getElementById('verb-title').innerHTML = titleHTML;
    
    const container = document.getElementById('conjugations-container');
    container.innerHTML = '';
    
    for (let tense in data.conjugations) {
        const tenseData = data.conjugations[tense];
        const userExamples = storage.getExamples(searchedVerb, tense);
        
        // Adapter les conjugaisons pour la variante
        const adaptedForms = tenseData.forms.map(f => adaptConjugation(baseVerb, searchedVerb, f));
        const adaptedNegative = tenseData.negative.map(f => adaptConjugation(baseVerb, searchedVerb, f));
        const adaptedExamples = tenseData.examples.map(f => adaptConjugation(baseVerb, searchedVerb, f));
        const adaptedExamplesNegative = tenseData.examplesNegative.map(f => adaptConjugation(baseVerb, searchedVerb, f));
        
        const section = document.createElement('div');
        section.className = 'tense-section';
        section.dataset.tense = tense;
        
        section.innerHTML = `
            <div class="tense-header" data-tense="${tense}">
                <div class="tense-header-content">
                    <div class="tense-title">${tenseNames[tense]}</div>
                    <div class="tense-usage">${tenseData.usage}</div>
                </div>
                <div class="tense-arrow">▼</div>
            </div>
            <div class="tense-content" data-tense="${tense}">
                <div class="tense-body">
                    <!-- Toggle négatif PAR TEMPS -->
                    <div class="negative-toggle" style="margin-bottom: 20px;">
                        <label class="switch">
                            <input type="checkbox" class="negative-toggle-${tense}">
                            <span class="slider"></span>
                        </label>
                        <span class="toggle-label">Forme négative</span>
                    </div>
                    
                    <div class="time-indicators">
                        <strong>⏰ Indicateurs :</strong> ${tenseData.timeIndicators}
                    </div>
                    <div class="conjugation-list" data-tense="${tense}">
                        ${adaptedForms.map(f => `<div class="conjugation-item">${f}</div>`).join('')}
                    </div>
                    <div class="tip-box">💡 ${tenseData.tip}</div>
                    <div class="examples-box" data-tense="${tense}">
                        <h4>📖 Exemples :</h4>
                        ${adaptedExamples.map(ex => `<div class="example-item">${ex}</div>`).join('')}
                    </div>
                    ${userExamples.length > 0 ? `
                        <div class="user-examples">
                            <h5>✍️ Mes exemples :</h5>
                            ${userExamples.map((ex, i) => `
                                <div class="user-example-item">
                                    ${ex.text}
                                    <button class="delete-user-example" onclick="deleteExample('${searchedVerb}', '${tense}', ${i})">🗑️</button>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="add-example-inline">
                        <h4>➕ Ajouter mon exemple</h4>
                        <textarea class="example-input-${tense}" placeholder="Écris ta phrase ici..."></textarea>
                        <button onclick="saveExample('${searchedVerb}', '${tense}')">Sauvegarder</button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(section);
        
        // Stocker les formes adaptées pour le toggle négatif
        section.dataset.adaptedForms = JSON.stringify(adaptedForms);
        section.dataset.adaptedNegative = JSON.stringify(adaptedNegative);
        section.dataset.adaptedExamples = JSON.stringify(adaptedExamples);
        section.dataset.adaptedExamplesNegative = JSON.stringify(adaptedExamplesNegative);
    }
    
    // Add click listeners pour les dropdowns
    document.querySelectorAll('.tense-header').forEach(header => {
        header.addEventListener('click', () => {
            const tense = header.dataset.tense;
            const content = document.querySelector(`.tense-content[data-tense="${tense}"]`);
            
            header.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
    
    // Add listeners pour les toggles négatifs PAR TEMPS
    for (let tense in data.conjugations) {
        const toggle = document.querySelector(`.negative-toggle-${tense}`);
        const section = document.querySelector(`.tense-section[data-tense="${tense}"]`);
        
        toggle.addEventListener('change', (e) => {
            const isNegative = e.target.checked;
            const adaptedForms = JSON.parse(section.dataset.adaptedForms);
            const adaptedNegative = JSON.parse(section.dataset.adaptedNegative);
            const adaptedExamples = JSON.parse(section.dataset.adaptedExamples);
            const adaptedExamplesNegative = JSON.parse(section.dataset.adaptedExamplesNegative);
            
            const forms = isNegative ? adaptedNegative : adaptedForms;
            const examples = isNegative ? adaptedExamplesNegative : adaptedExamples;
            
            // Update conjugaisons
            const conjugationList = document.querySelector(`.conjugation-list[data-tense="${tense}"]`);
            conjugationList.innerHTML = forms.map(f => `<div class="conjugation-item">${f}</div>`).join('');
            
            // Update exemples
            const examplesBox = document.querySelector(`.examples-box[data-tense="${tense}"]`);
            examplesBox.innerHTML = `
                <h4>📖 Exemples :</h4>
                ${examples.map(ex => `<div class="example-item">${ex}</div>`).join('')}
            `;
        });
    }
    
    storage.addToHistory(searchedVerb);
    showPage('conjugation-page');
}

// Sauvegarder un exemple
function saveExample(verb, tense) {
    const textarea = document.querySelector(`.example-input-${tense}`);
    const text = textarea.value.trim();
    
    if (text) {
        storage.addExample(verb, tense, text);
        textarea.value = '';
        
        // Recharger en gardant le verbe cherché
        const searchResult = searchVerb(verb);
        displayConjugation(searchResult);
        updateProgress();
        
        // Réouvrir le dropdown du temps concerné
        setTimeout(() => {
            const header = document.querySelector(`.tense-header[data-tense="${tense}"]`);
            const content = document.querySelector(`.tense-content[data-tense="${tense}"]`);
            header.classList.add('active');
            content.classList.add('active');
        }, 100);
    }
}

// Supprimer un exemple
function deleteExample(verb, tense, index) {
    storage.deleteExample(verb, tense, index);
    const searchResult = searchVerb(verb);
    displayConjugation(searchResult);
    updateProgress();
    
    // Réouvrir le dropdown
    setTimeout(() => {
        const header = document.querySelector(`.tense-header[data-tense="${tense}"]`);
        const content = document.querySelector(`.tense-content[data-tense="${tense}"]`);
        header.classList.add('active');
        content.classList.add('active');
    }, 100);
}

// Afficher mes verbes
function displayMesVerbes() {
    const history = storage.getHistory();
    const container = document.getElementById('mes-verbes-list');
    
    if (history.length === 0) {
        container.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">Aucun verbe consulté pour le moment.</p>';
        return;
    }
    
    container.innerHTML = history.map(verb => {
        const searchResult = searchVerb(verb);
        return `
            <div class="verb-card" onclick='displayConjugation(${JSON.stringify(searchResult)})'>
                <strong>${verb.toUpperCase()}</strong>
            </div>
        `;
    }).join('');
}

// Mettre à jour la progression
function updateProgress() {
    const stats = storage.getStats();
    
    document.getElementById('stat-verbes').textContent = stats.verbes;
    document.getElementById('stat-exemples').textContent = stats.exemples;
    
    let level = 1;
    let maxForLevel = 5;
    let emoji = '📄';
    let message = 'Commence à plier ton origami ! 🎨';
    
    if (stats.verbes >= 6) {
        level = 2;
        maxForLevel = 15;
        emoji = '📃';
        message = 'Ton origami prend forme ! 🎨';
    }
    if (stats.verbes >= 16) {
        level = 3;
        maxForLevel = 30;
        emoji = '🗒️';
        message = 'Ça ressemble à quelque chose ! 🦢';
    }
    if (stats.verbes >= 31) {
        level = 4;
        maxForLevel = 50;
        emoji = '🎨';
        message = 'Presque parfait ! Continue ! ✨';
    }
    if (stats.verbes >= 51) {
        level = 5;
        maxForLevel = 51;
        emoji = '🏆';
        message = 'Tu es un·e expert·e ! 🏆';
    }
    
    const progress = Math.min((stats.verbes / maxForLevel) * 100, 100);
    
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `Niveau ${level} : ${stats.verbes}/${maxForLevel}`;
    document.querySelector('.origami-shape').textContent = emoji;
    document.getElementById('origami-message').textContent = message;
    document.getElementById('motivational-text').textContent = message;
}

// Event Listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    const searchResult = searchVerb(query);
    
    if (searchResult) {
        displayConjugation(searchResult);
    } else {
        alert('Verbe non trouvé. Essaye "être", "avoir", "parler", "aimer", ou "manger" !');
    }
});

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

// Navigation buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page === 'mes-verbes') {
            displayMesVerbes();
            showPage('mes-verbes-page');
        } else if (page === 'mon-origami') {
            updateProgress();
            showPage('mon-origami-page');
        }
    });
});

// Back buttons
document.getElementById('back-home').addEventListener('click', () => showPage('home-page'));
document.getElementById('back-mes-verbes').addEventListener('click', () => showPage('home-page'));
document.getElementById('back-origami').addEventListener('click', () => showPage('home-page'));

// Initialisation
(async function init() {
    await loadVerbs();
    updateProgress();
})();


