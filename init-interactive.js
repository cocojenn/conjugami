// INITIALISATION DES FONCTIONNALITÉS INTERACTIVES
// Ce fichier connecte toutes les nouvelles fonctionnalités ensemble

(async function initInteractiveFeatures() {
    console.log('🚀 Initialisation des fonctionnalités interactives...');
    
    // Attendre que les verbes soient chargés (depuis app.js)
    let retries = 0;
    const maxRetries = 10;
    
    while (!window.verbDatabase && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
    }
    
    if (!window.verbDatabase) {
        console.error('❌ Impossible de charger verbDatabase');
        return;
    }
    
    console.log('✅ Verbes chargés:', Object.keys(window.verbDatabase).length);
    
    // Initialiser le système adaptatif
    const adaptiveLearning = new AdaptiveLearning();
    console.log('✅ Système adaptatif initialisé');
    console.log('   Niveau:', adaptiveLearning.assessLevel());
    console.log('   Streak:', adaptiveLearning.userProfile.studyStreak, 'jours');
    
    // Initialiser les flashcards
    const flashcardUI = new FlashcardUI();
    flashcardUI.init(window.verbDatabase);
    
    // Injecter la page des flashcards dans le DOM
    const flashcardPageHTML = flashcardUI.createFlashcardPage();
    document.body.insertAdjacentHTML('beforeend', flashcardPageHTML);
    
    // Setup event listeners
    flashcardUI.setupEventListeners();
    flashcardUI.displaySuggestions();
    
    console.log('✅ Flashcards initialisées');
    
    // Initialiser le mode histoire
    const storyMode = new StoryMode(adaptiveLearning, window.verbDatabase);
    initStoryPage(storyMode);
    console.log('✅ Mode histoire initialisé');
    
    // Initialiser les mini-jeux
    const speedRun = new SpeedRunGame(adaptiveLearning, window.verbDatabase);
    const memoryMatch = new MemoryMatchGame(adaptiveLearning, window.verbDatabase);
    initGamesPage(speedRun, memoryMatch);
    console.log('✅ Mini-jeux initialisés');
    
    // Stocker globalement pour accès facile
    window.interactiveFeatures = {
        adaptiveLearning,
        flashcardUI,
        storyMode,
        speedRun,
        memoryMatch
    };
    
    // Mettre à jour le message motivant avec des suggestions personnalisées
    updateMotivationalMessage(adaptiveLearning);
    
    console.log('🎉 Toutes les fonctionnalités interactives sont chargées !');
})();

// Initialiser la page du mode histoire
function initStoryPage(storyMode) {
    const storyContent = document.getElementById('story-content');
    if (!storyContent) return;
    
    // Afficher la liste des scénarios
    displayStoryList(storyMode);
    
    // Event listener pour le bouton retour
    document.getElementById('back-from-story')?.addEventListener('click', () => {
        showPage('home-page');
        displayStoryList(storyMode); // Réinitialiser la liste
    });
}

// Afficher la liste des scénarios
function displayStoryList(storyMode) {
    const storyContent = document.getElementById('story-content');
    if (!storyContent) return;
    
    const scenarios = storyMode.getScenarios();
    const profile = storyMode.adaptiveLearning.userProfile;
    const level = storyMode.adaptiveLearning.assessLevel();
    
    // Filtrer selon le niveau
    const availableScenarios = scenarios.filter(s => {
        if (level === 'débutant') return s.difficulty === 'débutant';
        if (level === 'intermédiaire') return s.difficulty !== 'avancé';
        return true;
    });
    
    const html = `
        <div class="story-list">
            ${availableScenarios.map(scenario => `
                <div class="story-card" onclick="startStory('${scenario.id}')">
                    <div class="story-card-header">
                        <div class="story-title">${scenario.title}</div>
                        <span class="story-difficulty difficulty-${scenario.difficulty}">
                            ${scenario.difficulty}
                        </span>
                    </div>
                    <p class="story-description">${scenario.description}</p>
                    <div class="story-verbs">
                        ${scenario.requiredVerbs.map(v => 
                            `<span class="verb-tag">${v}</span>`
                        ).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    storyContent.innerHTML = html;
}

// Démarrer un scénario
window.startStory = function(scenarioId) {
    const storyMode = window.interactiveFeatures.storyMode;
    const scenario = storyMode.startScenario(scenarioId);
    
    displayStoryStep(storyMode);
};

// Afficher une étape du scénario
function displayStoryStep(storyMode) {
    const step = storyMode.getCurrentStep();
    const storyContent = document.getElementById('story-content');
    
    if (!step) {
        // Scénario terminé - afficher les résultats
        displayStoryResults(storyMode);
        return;
    }
    
    const scenario = storyMode.currentScenario;
    const currentStepIndex = storyMode.currentStep;
    
    const html = `
        <div class="scenario-container">
            <div class="scenario-progress">
                ${scenario.steps.map((_, i) => `
                    <div class="progress-dot ${i === currentStepIndex ? 'active' : ''} ${i < currentStepIndex ? 'completed' : ''}"></div>
                `).join('')}
            </div>
            
            <div class="scenario-scene">
                <p class="scene-context">${step.text}</p>
                
                ${step.character && step.dialogue ? `
                    <div class="character-dialogue">
                        <div class="character-label">${step.character}</div>
                        <div class="dialogue-text">${step.dialogue}</div>
                    </div>
                ` : ''}
                
                <div class="scenario-question">
                    <p class="question-text">${step.question}</p>
                    
                    <div class="choices-container" id="choices-container">
                        ${step.choices.map((choice, i) => `
                            <button class="choice-btn" onclick="makeStoryChoice(${i})">
                                ${choice.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                ${step.contextHint ? `
                    <div class="context-hint">${step.contextHint}</div>
                ` : ''}
            </div>
        </div>
    `;
    
    storyContent.innerHTML = html;
}

// Faire un choix dans le scénario
window.makeStoryChoice = function(choiceIndex) {
    const storyMode = window.interactiveFeatures.storyMode;
    const result = storyMode.makeChoice(choiceIndex);
    
    // Afficher le feedback
    const choicesContainer = document.getElementById('choices-container');
    const buttons = choicesContainer.querySelectorAll('.choice-btn');
    
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === choiceIndex) {
            btn.classList.add(result.correct ? 'correct' : 'incorrect');
        }
    });
    
    // Ajouter le feedback
    const feedbackBox = document.createElement('div');
    feedbackBox.className = `feedback-box ${result.correct ? 'correct' : 'incorrect'}`;
    feedbackBox.innerHTML = `
        <div class="feedback-text">
            ${result.correct ? '✅' : '❌'} ${result.feedback}
        </div>
    `;
    
    document.querySelector('.scenario-scene').appendChild(feedbackBox);
    
    // Bouton continuer
    if (result.nextStep) {
        const continueBtn = document.createElement('button');
        continueBtn.className = 'primary-btn';
        continueBtn.style.marginTop = '20px';
        continueBtn.textContent = 'Continuer →';
        continueBtn.onclick = () => {
            storyMode.nextStep();
            displayStoryStep(storyMode);
        };
        document.querySelector('.scenario-scene').appendChild(continueBtn);
    } else {
        // Dernier step - bouton voir résultats
        setTimeout(() => {
            displayStoryResults(storyMode);
        }, 2000);
    }
};

// Afficher les résultats du scénario
function displayStoryResults(storyMode) {
    const results = storyMode.getResults();
    const storyContent = document.getElementById('story-content');
    
    const html = `
        <div class="results-container">
            <div class="icon-large">${results.emoji}</div>
            <h3>Scénario terminé !</h3>
            
            <div class="results-accuracy">
                <div class="accuracy-circle">
                    <span id="accuracy-percentage">${results.percentage}%</span>
                    <span class="accuracy-label">Réussite</span>
                </div>
            </div>
            
            <div class="results-stats">
                <div class="stat-item">
                    <div class="stat-value">${results.score}</div>
                    <div class="stat-label">sur ${results.total}</div>
                </div>
            </div>
            
            <div class="results-message">${results.message}</div>
            
            <div class="results-actions">
                <button class="secondary-btn" onclick="showPage('story-page'); displayStoryList(window.interactiveFeatures.storyMode);">
                    ← Autres scénarios
                </button>
                <button class="primary-btn" onclick="showPage('home-page')">
                    🏠 Accueil
                </button>
            </div>
        </div>
    `;
    
    storyContent.innerHTML = html;
};

// Initialiser la page des mini-jeux
function initGamesPage(speedRun, memoryMatch) {
    const gamesContent = document.getElementById('games-content');
    if (!gamesContent) return;
    
    const html = `
        <div class="games-grid">
            <div class="game-card" onclick="startSpeedRun()">
                <div class="game-icon">⚡</div>
                <div class="game-title">Speed Run</div>
                <p class="game-description">
                    Conjugue un maximum de verbes en 60 secondes !
                </p>
            </div>
            
            <div class="game-card" onclick="startMemoryMatch()">
                <div class="game-icon">🧠</div>
                <div class="game-title">Memory Match</div>
                <p class="game-description">
                    Retrouve les paires infinitif-conjugaison !
                </p>
            </div>
            
            <div class="game-card" style="opacity: 0.5; cursor: not-allowed;">
                <div class="game-icon">🏗️</div>
                <div class="game-title">Conjugation Builder</div>
                <p class="game-description">
                    Construis la bonne conjugaison (bientôt disponible)
                </p>
            </div>
        </div>
    `;
    
    gamesContent.innerHTML = html;
    
    // Event listener pour le bouton retour
    document.getElementById('back-from-games')?.addEventListener('click', () => {
        showPage('home-page');
    });
}

// Démarrer Speed Run (à implémenter)
window.startSpeedRun = function() {
    alert('🚧 Speed Run sera disponible dans la prochaine version !');
    // TODO: Implémenter l'interface du jeu
};

// Démarrer Memory Match (à implémenter)
window.startMemoryMatch = function() {
    alert('🚧 Memory Match sera disponible dans la prochaine version !');
    // TODO: Implémenter l'interface du jeu
};

// Mettre à jour le message motivant avec des suggestions
function updateMotivationalMessage(adaptiveLearning) {
    const suggestions = adaptiveLearning.getPersonalizedSuggestions();
    const motivationalText = document.getElementById('motivational-text');
    
    if (!motivationalText || suggestions.length === 0) return;
    
    const highPriority = suggestions.find(s => s.priority === 'high');
    if (highPriority) {
        motivationalText.textContent = highPriority.title + ' 💪';
    }
}
