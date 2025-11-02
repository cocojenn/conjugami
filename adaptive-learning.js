// SYSTÈME DE RÉVISION INTELLIGENTE ET PROFIL UTILISATEUR
// Basé sur l'algorithme SM-2 (SuperMemo) adapté

class AdaptiveLearning {
    constructor() {
        this.userProfile = this.loadProfile();
    }

    // Charger ou créer le profil utilisateur
    loadProfile() {
        const saved = localStorage.getItem('conjugami_profile');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Profil par défaut
        return {
            level: 'débutant', // débutant, intermédiaire, avancé
            nativeLanguage: 'en', // Pour contextualiser les exemples
            learningGoal: 'général', // général, voyage, professionnel, académique
            preferredTenses: [], // Temps que l'utilisateur veut prioriser
            weakTenses: [], // Temps à renforcer
            verbMastery: {}, // {verbe: {level: 0-5, lastReview: date, nextReview: date}}
            studyStreak: 0,
            lastStudyDate: null,
            totalStudyTime: 0, // en minutes
            preferences: {
                examplesStyle: 'personnel', // personnel, quotidien, professionnel
                difficulty: 'adaptatif', // facile, moyen, difficile, adaptatif
                enableAudio: false,
                theme: 'pastel'
            }
        };
    }

    // Sauvegarder le profil
    saveProfile() {
        localStorage.setItem('conjugami_profile', JSON.stringify(this.userProfile));
    }

    // Déterminer le niveau de l'utilisateur basé sur ses performances
    assessLevel() {
        const masteryLevels = Object.values(this.userProfile.verbMastery);
        
        if (masteryLevels.length < 5) {
            return 'débutant';
        }
        
        const avgMastery = masteryLevels.reduce((sum, v) => sum + v.level, 0) / masteryLevels.length;
        
        if (avgMastery < 2) return 'débutant';
        if (avgMastery < 4) return 'intermédiaire';
        return 'avancé';
    }

    // Obtenir les verbes à réviser (algorithme de répétition espacée)
    getVerbsToReview() {
        const now = new Date();
        const toReview = [];
        
        for (const [verb, data] of Object.entries(this.userProfile.verbMastery)) {
            const nextReview = new Date(data.nextReview);
            
            // Si le verbe doit être révisé
            if (now >= nextReview) {
                toReview.push({
                    verb: verb,
                    level: data.level,
                    daysSinceReview: Math.floor((now - new Date(data.lastReview)) / (1000 * 60 * 60 * 24))
                });
            }
        }
        
        // Trier par urgence (niveau bas = priorité haute)
        return toReview.sort((a, b) => {
            // Les verbes faibles en premier
            if (a.level !== b.level) return a.level - b.level;
            // Puis les plus anciens
            return b.daysSinceReview - a.daysSinceReview;
        });
    }

    // Calculer le prochain intervalle de révision (SM-2)
    calculateNextInterval(currentLevel, performance) {
        // performance: 0 (oublié) à 5 (parfait)
        let newLevel = currentLevel;
        let interval = 1; // jours
        
        if (performance >= 3) {
            // Bonne réponse
            newLevel = Math.min(5, currentLevel + 1);
            
            // Intervalles croissants
            const intervals = [1, 3, 7, 14, 30, 60]; // jours
            interval = intervals[newLevel] || 60;
        } else {
            // Mauvaise réponse - réinitialiser
            newLevel = Math.max(0, currentLevel - 1);
            interval = 1;
        }
        
        return { newLevel, interval };
    }

    // Enregistrer une performance de révision
    recordReview(verb, tense, performance) {
        const key = `${verb}_${tense}`;
        
        if (!this.userProfile.verbMastery[key]) {
            this.userProfile.verbMastery[key] = {
                level: 0,
                lastReview: new Date().toISOString(),
                nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                reviewCount: 0
            };
        }
        
        const current = this.userProfile.verbMastery[key];
        const { newLevel, interval } = this.calculateNextInterval(current.level, performance);
        
        current.level = newLevel;
        current.lastReview = new Date().toISOString();
        current.nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString();
        current.reviewCount++;
        
        // Mettre à jour les temps faibles
        if (performance < 3) {
            if (!this.userProfile.weakTenses.includes(tense)) {
                this.userProfile.weakTenses.push(tense);
            }
        } else if (performance >= 4) {
            // Retirer des temps faibles si bien maîtrisé
            this.userProfile.weakTenses = this.userProfile.weakTenses.filter(t => t !== tense);
        }
        
        this.saveProfile();
    }

    // Obtenir des suggestions personnalisées
    getPersonalizedSuggestions() {
        const suggestions = [];
        const verbsToReview = this.getVerbsToReview();
        
        // Suggestion 1: Verbes à réviser
        if (verbsToReview.length > 0) {
            suggestions.push({
                type: 'review',
                priority: 'high',
                title: `📚 ${verbsToReview.length} verbe(s) à réviser`,
                description: 'Ces verbes ont besoin d\'être révisés pour consolider ta mémoire',
                action: 'startReview',
                data: verbsToReview.slice(0, 5)
            });
        }
        
        // Suggestion 2: Temps faibles
        if (this.userProfile.weakTenses.length > 0) {
            const tenseNames = {
                present: 'Présent',
                passeCompose: 'Passé Composé',
                imparfait: 'Imparfait',
                futurProche: 'Futur Proche',
                futurSimple: 'Futur Simple',
                plusQueParfait: 'Plus-que-parfait',
                conditionnel: 'Conditionnel'
            };
            
            suggestions.push({
                type: 'practice',
                priority: 'medium',
                title: `💪 Renforce ton ${tenseNames[this.userProfile.weakTenses[0]]}`,
                description: 'Ce temps te pose encore des difficultés',
                action: 'practiceTense',
                data: this.userProfile.weakTenses[0]
            });
        }
        
        // Suggestion 3: Nouveau contenu
        const masteredVerbs = Object.keys(this.userProfile.verbMastery).length;
        if (masteredVerbs < 10) {
            suggestions.push({
                type: 'explore',
                priority: 'low',
                title: '🌟 Découvre de nouveaux verbes',
                description: `Tu connais ${masteredVerbs} verbes. Explore-en davantage !`,
                action: 'exploreVerbs'
            });
        }
        
        // Suggestion 4: Streak
        const today = new Date().toDateString();
        const lastStudy = this.userProfile.lastStudyDate ? new Date(this.userProfile.lastStudyDate).toDateString() : null;
        
        if (lastStudy !== today) {
            suggestions.push({
                type: 'streak',
                priority: 'medium',
                title: `🔥 Continue ta série ! (${this.userProfile.studyStreak} jours)`,
                description: 'Étudie aujourd\'hui pour maintenir ton streak',
                action: 'startStudy'
            });
        }
        
        return suggestions;
    }

    // Mettre à jour le streak quotidien
    updateStreak() {
        const today = new Date().toDateString();
        const lastStudy = this.userProfile.lastStudyDate ? new Date(this.userProfile.lastStudyDate).toDateString() : null;
        
        if (lastStudy === today) {
            return; // Déjà étudié aujourd'hui
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastStudy === yesterdayStr) {
            // Continue le streak
            this.userProfile.studyStreak++;
        } else if (lastStudy !== today) {
            // Streak cassé
            this.userProfile.studyStreak = 1;
        }
        
        this.userProfile.lastStudyDate = new Date().toISOString();
        this.saveProfile();
    }

    // Obtenir des verbes adaptés au niveau
    getVerbsByLevel(allVerbs, count = 5) {
        const level = this.assessLevel();
        const mastered = new Set(Object.keys(this.userProfile.verbMastery).map(k => k.split('_')[0]));
        
        // Verbes de base pour débutants
        const beginnerVerbs = ['être', 'avoir', 'parler', 'manger', 'aimer'];
        
        // Verbes intermédiaires
        const intermediateVerbs = ['travailler', 'jouer', 'regarder', 'écouter', 'donner', 'penser'];
        
        // Verbes avancés
        const advancedVerbs = ['chercher', 'trouver', 'montrer', 'demander', 'tourner', 'passer'];
        
        let pool = [];
        
        if (level === 'débutant') {
            pool = beginnerVerbs;
        } else if (level === 'intermédiaire') {
            pool = [...beginnerVerbs, ...intermediateVerbs];
        } else {
            pool = Object.keys(allVerbs);
        }
        
        // Filtrer les verbes non maîtrisés
        const available = pool.filter(v => !mastered.has(v));
        
        // Retourner un échantillon aléatoire
        return available.sort(() => Math.random() - 0.5).slice(0, count);
    }

    // Obtenir des temps adaptés au niveau
    getTensesByLevel() {
        const level = this.assessLevel();
        
        if (level === 'débutant') {
            return ['present', 'futurProche'];
        } else if (level === 'intermédiaire') {
            return ['present', 'passeCompose', 'imparfait', 'futurProche'];
        } else {
            return ['present', 'passeCompose', 'imparfait', 'futurProche', 'futurSimple', 'plusQueParfait', 'conditionnel'];
        }
    }

    // Générer un scénario contextualisé selon le profil
    getContextualizedScenario() {
        const goal = this.userProfile.learningGoal;
        const native = this.userProfile.nativeLanguage;
        
        const scenarios = {
            général: [
                {
                    title: 'Au café',
                    context: 'Tu es dans un café français et tu veux commander.',
                    verbs: ['avoir', 'aimer', 'prendre'],
                    difficulty: 'débutant'
                },
                {
                    title: 'Dans la rue',
                    context: 'Tu es perdu·e et tu demandes ton chemin.',
                    verbs: ['chercher', 'aller', 'tourner'],
                    difficulty: 'débutant'
                }
            ],
            voyage: [
                {
                    title: 'À l\'hôtel',
                    context: 'Tu arrives à l\'hôtel et tu fais le check-in.',
                    verbs: ['avoir', 'réserver', 'chercher'],
                    difficulty: 'débutant'
                },
                {
                    title: 'Au restaurant',
                    context: 'Tu commandes un repas dans un restaurant.',
                    verbs: ['aimer', 'manger', 'prendre'],
                    difficulty: 'débutant'
                }
            ],
            professionnel: [
                {
                    title: 'Réunion d\'équipe',
                    context: 'Tu participes à une réunion de travail.',
                    verbs: ['travailler', 'penser', 'proposer'],
                    difficulty: 'intermédiaire'
                },
                {
                    title: 'Présentation',
                    context: 'Tu présentes un projet à tes collègues.',
                    verbs: ['montrer', 'expliquer', 'parler'],
                    difficulty: 'intermédiaire'
                }
            ],
            académique: [
                {
                    title: 'En cours',
                    context: 'Tu es en classe et tu poses des questions.',
                    verbs: ['étudier', 'comprendre', 'demander'],
                    difficulty: 'intermédiaire'
                },
                {
                    title: 'À la bibliothèque',
                    context: 'Tu cherches des livres pour tes études.',
                    verbs: ['chercher', 'lire', 'trouver'],
                    difficulty: 'intermédiaire'
                }
            ]
        };
        
        const pool = scenarios[goal] || scenarios.général;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    // Analyser les erreurs pour identifier les patterns
    analyzeErrors() {
        const errors = JSON.parse(localStorage.getItem('conjugami_errors') || '[]');
        
        const patterns = {
            confusionTenses: {}, // Confond quels temps ?
            weakPronouns: [], // Difficultés avec quels pronoms ?
            commonMistakes: [] // Erreurs récurrentes
        };
        
        // Analyser les erreurs
        errors.forEach(err => {
            // Pattern de confusion entre temps
            if (err.correctTense && err.selectedTense) {
                const key = `${err.correctTense}-${err.selectedTense}`;
                patterns.confusionTenses[key] = (patterns.confusionTenses[key] || 0) + 1;
            }
            
            // Pronoms difficiles
            if (err.pronoun && !err.correct) {
                patterns.weakPronouns.push(err.pronoun);
            }
        });
        
        return patterns;
    }
}

// Export pour utilisation
window.AdaptiveLearning = AdaptiveLearning;
