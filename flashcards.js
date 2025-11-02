// SYSTÈME DE FLASHCARDS INTELLIGENTES
// Avec algorithme de répétition espacée et personnalisation

class FlashcardSystem {
    constructor(adaptiveLearning, verbDatabase) {
        this.adaptiveLearning = adaptiveLearning;
        this.verbDatabase = verbDatabase;
        this.currentDeck = [];
        this.currentIndex = 0;
        this.sessionStats = {
            total: 0,
            correct: 0,
            medium: 0,
            difficult: 0,
            startTime: null
        };
    }

    // Générer un deck de flashcards personnalisé
    generateDeck(count = 10) {
        this.currentDeck = [];
        this.currentIndex = 0;
        this.sessionStats = {
            total: count,
            correct: 0,
            medium: 0,
            difficult: 0,
            startTime: new Date()
        };
        
        // Obtenir les verbes à réviser en priorité
        const toReview = this.adaptiveLearning.getVerbsToReview();
        const reviewVerbs = toReview.slice(0, Math.min(count, toReview.length));
        
        // Compléter avec de nouveaux verbes si nécessaire
        const needed = count - reviewVerbs.length;
        if (needed > 0) {
            const newVerbs = this.adaptiveLearning.getVerbsByLevel(this.verbDatabase, needed);
            newVerbs.forEach(verb => {
                reviewVerbs.push({ verb: verb, level: 0 });
            });
        }
        
        // Obtenir les temps adaptés au niveau
        const availableTenses = this.adaptiveLearning.getTensesByLevel();
        
        // Créer les flashcards
        reviewVerbs.forEach(({ verb }) => {
            // Choisir un temps aléatoire parmi ceux adaptés au niveau
            const tense = availableTenses[Math.floor(Math.random() * availableTenses.length)];
            
            // Choisir un pronom aléatoire
            const pronouns = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
            const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
            const pronounIndex = pronouns.indexOf(pronoun);
            
            const verbData = this.verbDatabase[verb];
            if (!verbData || !verbData.conjugations[tense]) return;
            
            const tenseData = verbData.conjugations[tense];
            const answer = tenseData.forms[pronounIndex];
            
            this.currentDeck.push({
                verb: verb,
                tense: tense,
                pronoun: pronoun,
                answer: answer,
                usage: tenseData.usage,
                example: tenseData.examples[Math.floor(Math.random() * tenseData.examples.length)],
                revealed: false
            });
        });
        
        // Mélanger le deck
        this.currentDeck.sort(() => Math.random() - 0.5);
    }

    // Obtenir la flashcard actuelle
    getCurrentCard() {
        if (this.currentIndex >= this.currentDeck.length) {
            return null;
        }
        return this.currentDeck[this.currentIndex];
    }

    // Révéler la réponse
    revealAnswer() {
        const card = this.getCurrentCard();
        if (card) {
            card.revealed = true;
        }
        return card;
    }

    // Enregistrer la performance et passer à la carte suivante
    rateCard(difficulty) {
        // difficulty: 'easy' (5), 'medium' (3), 'hard' (1)
        const card = this.getCurrentCard();
        if (!card) return;
        
        let performance;
        switch(difficulty) {
            case 'easy':
                performance = 5;
                this.sessionStats.correct++;
                break;
            case 'medium':
                performance = 3;
                this.sessionStats.medium++;
                break;
            case 'hard':
                performance = 1;
                this.sessionStats.difficult++;
                break;
            default:
                performance = 0;
        }
        
        // Enregistrer dans le système adaptatif
        this.adaptiveLearning.recordReview(card.verb, card.tense, performance);
        
        // Si difficile, ajouter la carte à la fin du deck
        if (difficulty === 'hard' && this.currentIndex < this.currentDeck.length - 2) {
            const cardCopy = { ...card, revealed: false };
            this.currentDeck.push(cardCopy);
            this.sessionStats.total++;
        }
        
        // Passer à la carte suivante
        this.currentIndex++;
    }

    // Obtenir les stats de la session
    getSessionStats() {
        if (this.sessionStats.startTime) {
            const duration = Math.floor((new Date() - this.sessionStats.startTime) / 1000); // secondes
            return {
                ...this.sessionStats,
                duration: duration,
                completed: this.currentIndex,
                remaining: this.currentDeck.length - this.currentIndex,
                accuracy: this.sessionStats.correct / Math.max(1, this.currentIndex) * 100
            };
        }
        return this.sessionStats;
    }

    // Réinitialiser le deck
    reset() {
        this.currentDeck = [];
        this.currentIndex = 0;
        this.sessionStats = {
            total: 0,
            correct: 0,
            medium: 0,
            difficult: 0,
            startTime: null
        };
    }
}

// INTERFACE UTILISATEUR DES FLASHCARDS
class FlashcardUI {
    constructor() {
        this.flashcardSystem = null;
        this.adaptiveLearning = new AdaptiveLearning();
    }

    // Initialiser avec la base de données de verbes
    init(verbDatabase) {
        this.flashcardSystem = new FlashcardSystem(this.adaptiveLearning, verbDatabase);
    }

    // Créer la page de flashcards
    createFlashcardPage() {
        return `
            <div id="flashcard-page" class="page">
                <div class="container">
                    <button class="back-btn" id="back-from-flashcard">← Retour</button>
                    
                    <div class="flashcard-header">
                        <h2>🃏 Flashcards</h2>
                        <div class="flashcard-progress">
                            <span id="flashcard-counter">0/0</span>
                            <div class="mini-progress-bar">
                                <div class="mini-progress-fill" id="flashcard-progress-bar"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Vue de démarrage -->
                    <div id="flashcard-start" class="flashcard-view active">
                        <div class="flashcard-intro">
                            <div class="icon-large">🎴</div>
                            <h3>Révise intelligemment !</h3>
                            <p>Les flashcards s'adaptent à ton niveau et utilisent la répétition espacée pour une mémorisation optimale.</p>
                            
                            <div class="flashcard-settings">
                                <label>
                                    <span>Nombre de cartes :</span>
                                    <select id="flashcard-count">
                                        <option value="5">5 cartes (rapide)</option>
                                        <option value="10" selected>10 cartes</option>
                                        <option value="15">15 cartes</option>
                                        <option value="20">20 cartes (intense)</option>
                                    </select>
                                </label>
                            </div>
                            
                            <button class="primary-btn" id="start-flashcards">
                                Commencer la révision
                            </button>
                            
                            <!-- Suggestions personnalisées -->
                            <div id="flashcard-suggestions" class="suggestions-box"></div>
                        </div>
                    </div>

                    <!-- Vue de la flashcard -->
                    <div id="flashcard-study" class="flashcard-view">
                        <div class="flashcard-container">
                            <div class="flashcard" id="flashcard">
                                <div class="flashcard-front">
                                    <div class="flashcard-tense-badge" id="tense-badge">Présent</div>
                                    <div class="flashcard-question">
                                        <p class="flashcard-instruction">Conjugue le verbe :</p>
                                        <h3 class="flashcard-verb" id="flashcard-verb">PARLER</h3>
                                        <p class="flashcard-pronoun">
                                            avec <strong id="flashcard-pronoun">je</strong>
                                        </p>
                                    </div>
                                    <div class="flashcard-hint" id="flashcard-hint">
                                        💡 Pour parler maintenant
                                    </div>
                                    <button class="secondary-btn" id="reveal-btn">
                                        Voir la réponse
                                    </button>
                                </div>

                                <div class="flashcard-back hidden">
                                    <div class="flashcard-answer">
                                        <div class="answer-label">Réponse correcte :</div>
                                        <h3 class="answer-text" id="flashcard-answer">je parle</h3>
                                        <div class="answer-example" id="flashcard-example">
                                            📖 Je parle français
                                        </div>
                                    </div>

                                    <div class="flashcard-rating">
                                        <p>Comment c'était ?</p>
                                        <div class="rating-buttons">
                                            <button class="rating-btn rating-hard" data-difficulty="hard">
                                                😰<br>Difficile
                                            </button>
                                            <button class="rating-btn rating-medium" data-difficulty="medium">
                                                🤔<br>Moyen
                                            </button>
                                            <button class="rating-btn rating-easy" data-difficulty="easy">
                                                😊<br>Facile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Vue des résultats -->
                    <div id="flashcard-results" class="flashcard-view">
                        <div class="results-container">
                            <div class="icon-large">🎉</div>
                            <h3>Session terminée !</h3>
                            
                            <div class="results-stats">
                                <div class="stat-item stat-green">
                                    <div class="stat-icon">😊</div>
                                    <div class="stat-value" id="result-easy">0</div>
                                    <div class="stat-label">Facile</div>
                                </div>
                                <div class="stat-item stat-yellow">
                                    <div class="stat-icon">🤔</div>
                                    <div class="stat-value" id="result-medium">0</div>
                                    <div class="stat-label">Moyen</div>
                                </div>
                                <div class="stat-item stat-red">
                                    <div class="stat-icon">😰</div>
                                    <div class="stat-value" id="result-hard">0</div>
                                    <div class="stat-label">Difficile</div>
                                </div>
                            </div>

                            <div class="results-accuracy">
                                <div class="accuracy-circle">
                                    <span id="accuracy-percentage">85%</span>
                                    <span class="accuracy-label">Taux de réussite</span>
                                </div>
                            </div>

                            <div class="results-time">
                                ⏱️ Temps : <strong id="session-duration">2m 15s</strong>
                            </div>

                            <div class="results-message" id="results-message">
                                Continue comme ça ! 🌟
                            </div>

                            <div class="results-actions">
                                <button class="secondary-btn" id="review-again">
                                    🔄 Nouvelle session
                                </button>
                                <button class="primary-btn" id="back-home-results">
                                    🏠 Retour à l'accueil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Afficher une flashcard
    displayCard() {
        const card = this.flashcardSystem.getCurrentCard();
        
        if (!card) {
            this.showResults();
            return;
        }

        // Mettre à jour le compteur
        const stats = this.flashcardSystem.getSessionStats();
        document.getElementById('flashcard-counter').textContent = 
            `${stats.completed + 1}/${stats.total}`;
        
        const progress = ((stats.completed + 1) / stats.total) * 100;
        document.getElementById('flashcard-progress-bar').style.width = progress + '%';

        // Noms des temps
        const tenseNames = {
            present: 'Présent',
            passeCompose: 'Passé Composé',
            imparfait: 'Imparfait',
            futurProche: 'Futur Proche',
            futurSimple: 'Futur Simple',
            plusQueParfait: 'Plus-que-parfait',
            conditionnel: 'Conditionnel'
        };

        // Afficher la carte (face avant)
        document.getElementById('tense-badge').textContent = tenseNames[card.tense];
        document.getElementById('flashcard-verb').textContent = card.verb.toUpperCase();
        document.getElementById('flashcard-pronoun').textContent = card.pronoun;
        document.getElementById('flashcard-hint').textContent = `💡 ${card.usage}`;

        // Réinitialiser l'état
        document.querySelector('.flashcard-front').classList.remove('hidden');
        document.querySelector('.flashcard-back').classList.add('hidden');
        
        // Réponse
        document.getElementById('flashcard-answer').textContent = card.answer;
        document.getElementById('flashcard-example').textContent = `📖 ${card.example}`;
    }

    // Révéler la réponse
    revealAnswer() {
        this.flashcardSystem.revealAnswer();
        
        document.querySelector('.flashcard-front').classList.add('hidden');
        document.querySelector('.flashcard-back').classList.remove('hidden');
    }

    // Noter la carte et passer à la suivante
    rateCard(difficulty) {
        this.flashcardSystem.rateCard(difficulty);
        
        // Mettre à jour le streak
        this.adaptiveLearning.updateStreak();
        
        // Afficher la carte suivante
        setTimeout(() => {
            this.displayCard();
        }, 300);
    }

    // Afficher les résultats
    showResults() {
        const stats = this.flashcardSystem.getSessionStats();
        
        // Cacher la vue d'étude
        document.getElementById('flashcard-study').classList.remove('active');
        
        // Afficher les résultats
        const resultsView = document.getElementById('flashcard-results');
        resultsView.classList.add('active');
        
        // Remplir les stats
        document.getElementById('result-easy').textContent = stats.correct;
        document.getElementById('result-medium').textContent = stats.medium;
        document.getElementById('result-hard').textContent = stats.difficult;
        
        // Accuracy
        const accuracy = Math.round(stats.accuracy);
        document.getElementById('accuracy-percentage').textContent = accuracy + '%';
        
        // Durée
        const minutes = Math.floor(stats.duration / 60);
        const seconds = stats.duration % 60;
        document.getElementById('session-duration').textContent = 
            `${minutes}m ${seconds}s`;
        
        // Message personnalisé
        let message = '';
        if (accuracy >= 90) {
            message = 'Excellent travail ! Tu maîtrises parfaitement ! 🏆';
        } else if (accuracy >= 70) {
            message = 'Très bien ! Continue comme ça ! 🌟';
        } else if (accuracy >= 50) {
            message = 'Bon début ! Avec de la pratique, tu vas y arriver ! 💪';
        } else {
            message = 'Continue à t\'entraîner, tu vas progresser ! 📚';
        }
        document.getElementById('results-message').textContent = message;
    }

    // Afficher les suggestions personnalisées
    displaySuggestions() {
        const suggestions = this.adaptiveLearning.getPersonalizedSuggestions();
        const container = document.getElementById('flashcard-suggestions');
        
        if (suggestions.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        const html = suggestions.slice(0, 2).map(sug => `
            <div class="suggestion-card suggestion-${sug.priority}">
                <h4>${sug.title}</h4>
                <p>${sug.description}</p>
            </div>
        `).join('');
        
        container.innerHTML = `
            <h4>💡 Recommandations pour toi :</h4>
            ${html}
        `;
    }

    // Démarrer une session
    startSession() {
        const count = parseInt(document.getElementById('flashcard-count').value);
        
        this.flashcardSystem.generateDeck(count);
        
        // Cacher la vue de démarrage
        document.getElementById('flashcard-start').classList.remove('active');
        
        // Afficher la vue d'étude
        document.getElementById('flashcard-study').classList.add('active');
        
        // Afficher la première carte
        this.displayCard();
    }

    // Configurer les event listeners
    setupEventListeners() {
        // Bouton de démarrage
        document.getElementById('start-flashcards').addEventListener('click', () => {
            this.startSession();
        });

        // Bouton de révélation
        document.getElementById('reveal-btn').addEventListener('click', () => {
            this.revealAnswer();
        });

        // Boutons de notation
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.currentTarget.dataset.difficulty;
                this.rateCard(difficulty);
            });
        });

        // Bouton nouvelle session
        document.getElementById('review-again').addEventListener('click', () => {
            document.getElementById('flashcard-results').classList.remove('active');
            document.getElementById('flashcard-start').classList.add('active');
            this.displaySuggestions();
        });

        // Bouton retour
        document.getElementById('back-from-flashcard').addEventListener('click', () => {
            showPage('home-page');
        });

        document.getElementById('back-home-results').addEventListener('click', () => {
            showPage('home-page');
        });
    }
}

// Export
window.FlashcardUI = FlashcardUI;
window.FlashcardSystem = FlashcardSystem;
