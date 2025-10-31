// Base de données de verbes (exemples - on en ajoutera plus après)
const verbDatabase = {
    'manger': {
        fr: 'manger',
        en: ['eat', 'to eat'],
        es: ['comer'],
        pt: ['comer'],
        it: ['mangiare'],
        conjugations: {
            present: {
                forms: ['je mange', 'tu manges', 'il/elle mange', 'nous mangeons', 'vous mangez', 'ils/elles mangent'],
                negative: ['je ne mange pas', 'tu ne manges pas', 'il/elle ne mange pas', 'nous ne mangeons pas', 'vous ne mangez pas', 'ils/elles ne mangent pas'],
                tip: 'Verbe régulier en -ER',
                examples: ['Je mange une pizza', 'Tu manges au restaurant', 'Nous mangeons ensemble']
            },
            passeCompose: {
                forms: ["j'ai mangé", 'tu as mangé', 'il/elle a mangé', 'nous avons mangé', 'vous avez mangé', 'ils/elles ont mangé'],
                negative: ["je n'ai pas mangé", "tu n'as pas mangé", "il/elle n'a pas mangé", "nous n'avons pas mangé", "vous n'avez pas mangé", "ils/elles n'ont pas mangé"],
                tip: 'Avec AVOIR + participe passé -É',
                examples: ["Hier, j'ai mangé une pizza", 'Tu as mangé quoi?', 'Nous avons mangé ensemble']
            },
            imparfait: {
                forms: ['je mangeais', 'tu mangeais', 'il/elle mangeait', 'nous mangions', 'vous mangiez', 'ils/elles mangeaient'],
                negative: ['je ne mangeais pas', 'tu ne mangeais pas', 'il/elle ne mangeait pas', 'nous ne mangions pas', 'vous ne mangiez pas', 'ils/elles ne mangeaient pas'],
                tip: 'Radical: mang- + terminaisons de l\'imparfait',
                examples: ['Quand j\'étais petit, je mangeais beaucoup', 'Tu mangeais toujours à la cantine', 'Nous mangions ensemble tous les jours']
            },
            futurProche: {
                forms: ['je vais manger', 'tu vas manger', 'il/elle va manger', 'nous allons manger', 'vous allez manger', 'ils/elles vont manger'],
                negative: ['je ne vais pas manger', 'tu ne vas pas manger', 'il/elle ne va pas manger', 'nous n\'allons pas manger', 'vous n\'allez pas manger', 'ils/elles ne vont pas manger'],
                tip: 'ALLER (au présent) + infinitif',
                examples: ['Je vais manger dans 5 minutes', 'Tu vas manger où?', 'Nous allons manger ensemble ce soir']
            },
            futurSimple: {
                forms: ['je mangerai', 'tu mangeras', 'il/elle mangera', 'nous mangerons', 'vous mangerez', 'ils/elles mangeront'],
                negative: ['je ne mangerai pas', 'tu ne mangeras pas', 'il/elle ne mangera pas', 'nous ne mangerons pas', 'vous ne mangerez pas', 'ils/elles ne mangeront pas'],
                tip: 'Infinitif + terminaisons du futur',
                examples: ['Demain, je mangerai au restaurant', 'Tu mangeras avec nous?', 'Nous mangerons à 20h']
            },
            plusQueParfait: {
                forms: ["j'avais mangé", 'tu avais mangé', 'il/elle avait mangé', 'nous avions mangé', 'vous aviez mangé', 'ils/elles avaient mangé'],
                negative: ["je n'avais pas mangé", "tu n'avais pas mangé", "il/elle n'avait pas mangé", "nous n'avions pas mangé", "vous n'aviez pas mangé", "ils/elles n'avaient pas mangé"],
                tip: 'AVOIR à l\'imparfait + participe passé',
                examples: ["J'avais mangé avant de partir", 'Tu avais mangé quoi?', 'Nous avions mangé ensemble']
            },
            conditionnel: {
                forms: ['je mangerais', 'tu mangerais', 'il/elle mangerait', 'nous mangerions', 'vous mangeriez', 'ils/elles mangeraient'],
                negative: ['je ne mangerais pas', 'tu ne mangerais pas', 'il/elle ne mangerait pas', 'nous ne mangerions pas', 'vous ne mangeriez pas', 'ils/elles ne mangeraient pas'],
                tip: 'Infinitif + terminaisons de l\'imparfait',
                examples: ['Je mangerais bien une pizza', 'Tu mangerais avec nous?', 'Nous mangerions volontiers']
            }
        }
    },
    'aller': {
        fr: 'aller',
        en: ['go', 'to go'],
        es: ['ir'],
        pt: ['ir'],
        it: ['andare'],
        conjugations: {
            present: {
                forms: ['je vais', 'tu vas', 'il/elle va', 'nous allons', 'vous allez', 'ils/elles vont'],
                negative: ['je ne vais pas', 'tu ne vas pas', 'il/elle ne va pas', 'nous n\'allons pas', 'vous n\'allez pas', 'ils/elles ne vont pas'],
                tip: 'Verbe irrégulier très utilisé',
                examples: ['Je vais au cinéma', 'Tu vas où?', 'Nous allons à Paris']
            },
            passeCompose: {
                forms: ['je suis allé(e)', 'tu es allé(e)', 'il/elle est allé(e)', 'nous sommes allé(e)s', 'vous êtes allé(e)(s)', 'ils/elles sont allé(e)s'],
                negative: ['je ne suis pas allé(e)', 'tu n\'es pas allé(e)', 'il/elle n\'est pas allé(e)', 'nous ne sommes pas allé(e)s', 'vous n\'êtes pas allé(e)(s)', 'ils/elles ne sont pas allé(e)s'],
                tip: 'Avec ÊTRE + accord du participe!',
                examples: ['Je suis allé au cinéma hier', 'Tu es allé où?', 'Nous sommes allés à Paris']
            },
            imparfait: {
                forms: ["j'allais", 'tu allais', 'il/elle allait', 'nous allions', 'vous alliez', 'ils/elles allaient'],
                negative: ["je n'allais pas", "tu n'allais pas", "il/elle n'allait pas", "nous n'allions pas", "vous n'alliez pas", "ils/elles n'allaient pas"],
                tip: 'Radical: all- + terminaisons',
                examples: ["J'allais souvent au parc", 'Tu allais à l\'école à pied?', 'Nous allions au marché le samedi']
            },
            futurProche: {
                forms: ['je vais aller', 'tu vas aller', 'il/elle va aller', 'nous allons aller', 'vous allez aller', 'ils/elles vont aller'],
                negative: ['je ne vais pas aller', 'tu ne vas pas aller', 'il/elle ne va pas aller', 'nous n\'allons pas aller', 'vous n\'allez pas aller', 'ils/elles ne vont pas aller'],
                tip: 'ALLER + ALLER (oui, deux fois!)',
                examples: ['Je vais aller au cinéma', 'Tu vas aller où?', 'Nous allons aller à Paris']
            },
            futurSimple: {
                forms: ["j'irai", 'tu iras', 'il/elle ira', 'nous irons', 'vous irez', 'ils/elles iront'],
                negative: ["je n'irai pas", "tu n'iras pas", "il/elle n'ira pas", "nous n'irons pas", "vous n'irez pas", "ils/elles n'iront pas"],
                tip: 'Radical irrégulier: ir-',
                examples: ["J'irai au cinéma demain", 'Tu iras où?', 'Nous irons à Paris']
            },
            plusQueParfait: {
                forms: ["j'étais allé(e)", 'tu étais allé(e)', 'il/elle était allé(e)', 'nous étions allé(e)s', 'vous étiez allé(e)(s)', 'ils/elles étaient allé(e)s'],
                negative: ["je n'étais pas allé(e)", "tu n'étais pas allé(e)", "il/elle n'était pas allé(e)", "nous n'étions pas allé(e)s", "vous n'étiez pas allé(e)(s)", "ils/elles n'étaient pas allé(e)s"],
                tip: 'ÊTRE à l\'imparfait + participe',
                examples: ["J'étais allé au cinéma avant", 'Tu étais allé où?', 'Nous étions allés à Paris']
            },
            conditionnel: {
                forms: ["j'irais", 'tu irais', 'il/elle irait', 'nous irions', 'vous iriez', 'ils/elles iraient'],
                negative: ["je n'irais pas", "tu n'irais pas", "il/elle n'irait pas", "nous n'irions pas", "vous n'iriez pas", "ils/elles n'iraient pas"],
                tip: 'Radical irrégulier: ir-',
                examples: ["J'irais bien au cinéma", 'Tu irais où?', 'Nous irions à Paris']
            }
        }
    }
};

// Noms des temps en français
const tenseNames = {
    present: '🔵 Présent',
    passeCompose: '🟣 Passé Composé',
    imparfait: '🟡 Imparfait',
    futurProche: '🟢 Futur Proche',
    futurSimple: '🔴 Futur Simple',
    plusQueParfait: '🟠 Plus-que-parfait',
    conditionnel: '🟤 Conditionnel'
};

// Variables globales
let currentVerb = null;
let isNegative = false;

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
    getExamples: (verb) => JSON.parse(localStorage.getItem(`conjugami_examples_${verb}`) || '[]'),
    addExample: (verb, example) => {
        let examples = storage.getExamples(verb);
        examples.push({ text: example, date: new Date().toISOString() });
        localStorage.setItem(`conjugami_examples_${verb}`, JSON.stringify(examples));
    },
    deleteExample: (verb, index) => {
        let examples = storage.getExamples(verb);
        examples.splice(index, 1);
        localStorage.setItem(`conjugami_examples_${verb}`, JSON.stringify(examples));
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

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Recherche de verbe
function searchVerb(query) {
    query = query.toLowerCase().trim();
    
    // Chercher dans la base de données
    for (let verb in verbDatabase) {
        const data = verbDatabase[verb];
        
        // Chercher en français
        if (data.fr === query) return verb;
        
        // Chercher dans les traductions
        if (data.en.some(t => t === query)) return verb;
        if (data.es.some(t => t === query)) return verb;
        if (data.pt.some(t => t === query)) return verb;
        if (data.it.some(t => t === query)) return verb;
    }
    
    return null;
}

// Afficher la conjugaison
function displayConjugation(verb) {
    currentVerb = verb;
    const data = verbDatabase[verb];
    
    document.getElementById('verb-title').textContent = verb.toUpperCase();
    
    const container = document.getElementById('conjugations-container');
    container.innerHTML = '';
    
    for (let tense in data.conjugations) {
        const tenseData = data.conjugations[tense];
        const forms = isNegative ? tenseData.negative : tenseData.forms;
        
        const section = document.createElement('div');
        section.className = 'tense-section';
        
        section.innerHTML = `
            <div class="tense-title">${tenseNames[tense]}</div>
            <div class="conjugation-list">
                ${forms.map(f => `<div class="conjugation-item">${f}</div>`).join('')}
            </div>
            <div class="tip-box">💡 ${tenseData.tip}</div>
            <div class="examples-box">
                <h4>📖 Exemples :</h4>
                ${tenseData.examples.map(ex => `<div class="example-item">${ex}</div>`).join('')}
            </div>
        `;
        
        container.appendChild(section);
    }
    
    // Afficher les exemples personnels
    displayMyExamples(verb);
    
    // Ajouter à l'historique
    storage.addToHistory(verb);
    
    // Afficher la page
    showPage('conjugation-page');
}

// Afficher mes exemples
function displayMyExamples(verb) {
    const examples = storage.getExamples(verb);
    const container = document.getElementById('my-examples-list');
    
    if (examples.length === 0) {
        container.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">Aucun exemple pour le moment</p>';
        return;
    }
    
    container.innerHTML = examples.map((ex, i) => `
        <div class="my-example-card">
            ${ex.text}
            <button class="delete-example-btn" onclick="deleteExample(${i})">🗑️</button>
        </div>
    `).join('');
}

// Supprimer un exemple
function deleteExample(index) {
    storage.deleteExample(currentVerb, index);
    displayMyExamples(currentVerb);
    updateProgress();
}

// Afficher mes verbes
function displayMesVerbes() {
    const history = storage.getHistory();
    const container = document.getElementById('mes-verbes-list');
    
    if (history.length === 0) {
        container.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">Aucun verbe consulté pour le moment</p>';
        return;
    }
    
    container.innerHTML = history.map(verb => `
        <div class="verb-card" onclick="displayConjugation('${verb}')">
            <strong>${verb.toUpperCase()}</strong>
        </div>
    `).join('');
}

// Mettre à jour la progression
function updateProgress() {
    const stats = storage.getStats();
    
    document.getElementById('stat-verbes').textContent = stats.verbes;
    document.getElementById('stat-exemples').textContent = stats.exemples;
    
    // Calculer le niveau
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
    const verb = searchVerb(query);
    
    if (verb) {
        displayConjugation(verb);
    } else {
        alert('Verbe non trouvé. Essaye "manger" ou "aller" pour le moment !');
    }
});

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

document.getElementById('negative-mode').addEventListener('change', (e) => {
    isNegative = e.target.checked;
    if (currentVerb) {
        displayConjugation(currentVerb);
    }
});

document.getElementById('save-example-btn').addEventListener('click', () => {
    const text = document.getElementById('example-input').value.trim();
    if (text && currentVerb) {
        storage.addExample(currentVerb, text);
        document.getElementById('example-input').value = '';
        displayMyExamples(currentVerb);
        updateProgress();
        alert('✅ Exemple sauvegardé !');
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
updateProgress();