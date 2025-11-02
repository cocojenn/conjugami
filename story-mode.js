// MODE HISTOIRE - Scénarios interactifs contextualisés

class StoryMode {
    constructor(adaptiveLearning, verbDatabase) {
        this.adaptiveLearning = adaptiveLearning;
        this.verbDatabase = verbDatabase;
        this.currentScenario = null;
        this.currentStep = 0;
        this.choices = [];
        this.score = 0;
    }

    // Bibliothèque de scénarios
    getScenarios() {
        return [
            {
                id: 'cafe',
                title: '☕ Au Café',
                difficulty: 'débutant',
                goal: 'général',
                description: 'Tu arrives dans un café parisien et tu veux commander.',
                requiredVerbs: ['avoir', 'aimer', 'prendre'],
                requiredTenses: ['present', 'futurProche'],
                steps: [
                    {
                        text: 'Tu entres dans un café. Le serveur t\'accueille :',
                        character: 'serveur',
                        dialogue: '"Bonjour ! Vous désirez ?"',
                        question: 'Comment réponds-tu ?',
                        verb: 'aimer',
                        tense: 'present',
                        pronoun: 'je',
                        choices: [
                            { text: 'J\'aime un café, s\'il vous plaît', correct: false, feedback: 'On utilise plutôt "je voudrais" ou "j\'aimerais" pour commander.' },
                            { text: 'J\'aimerais un café, s\'il vous plaît', correct: true, feedback: 'Parfait ! Le conditionnel est poli pour commander.' },
                            { text: 'Je vais aimer un café', correct: false, feedback: 'Le futur proche n\'est pas naturel ici. Utilise le conditionnel.' }
                        ],
                        contextHint: '💡 Pour être poli quand on commande, on utilise le conditionnel "j\'aimerais"'
                    },
                    {
                        text: 'Le serveur te demande :',
                        character: 'serveur',
                        dialogue: '"Avec du lait ?"',
                        question: 'Tu réponds :',
                        verb: 'prendre',
                        tense: 'present',
                        pronoun: 'je',
                        choices: [
                            { text: 'Oui, je prends avec du lait', correct: true, feedback: 'Excellent ! "Prendre" au présent est parfait ici.' },
                            { text: 'Oui, je vais prendre avec du lait', correct: false, feedback: 'Le futur proche est possible mais moins naturel dans ce contexte immédiat.' },
                            { text: 'Oui, j\'ai pris avec du lait', correct: false, feedback: 'Le passé composé ne convient pas, c\'est maintenant que tu choisis !' }
                        ],
                        contextHint: '💡 Pour parler de ce qu\'on choisit maintenant, on utilise le présent'
                    },
                    {
                        text: 'Après avoir bu ton café, tu demandes l\'addition :',
                        character: 'toi',
                        dialogue: 'Excusez-moi...',
                        question: 'Comment demandes-tu l\'addition ?',
                        verb: 'avoir',
                        tense: 'present',
                        pronoun: 'je',
                        choices: [
                            { text: 'J\'ai l\'addition, s\'il vous plaît', correct: false, feedback: 'Non, ça voudrait dire que tu as déjà l\'addition.' },
                            { text: 'Je vais avoir l\'addition', correct: false, feedback: 'Le futur proche ne convient pas ici.' },
                            { text: 'Je peux avoir l\'addition, s\'il vous plaît ?', correct: true, feedback: 'Parfait ! C\'est la façon polie de demander l\'addition.' }
                        ],
                        contextHint: '💡 "Je peux avoir..." est une formule polie pour demander quelque chose'
                    }
                ]
            },
            {
                id: 'rue',
                title: '🗺️ Perdu dans la rue',
                difficulty: 'débutant',
                goal: 'voyage',
                description: 'Tu cherches la Tour Eiffel mais tu es perdu·e.',
                requiredVerbs: ['chercher', 'aller', 'tourner'],
                requiredTenses: ['present', 'futurProche'],
                steps: [
                    {
                        text: 'Tu abordes un passant :',
                        character: 'toi',
                        dialogue: 'Excusez-moi...',
                        question: 'Comment expliques-tu ce que tu cherches ?',
                        verb: 'chercher',
                        tense: 'present',
                        pronoun: 'je',
                        choices: [
                            { text: 'Je cherche la Tour Eiffel', correct: true, feedback: 'Parfait ! C\'est clair et direct.' },
                            { text: 'J\'ai cherché la Tour Eiffel', correct: false, feedback: 'Le passé composé suggère que tu as déjà arrêté de chercher.' },
                            { text: 'Je vais chercher la Tour Eiffel', correct: false, feedback: 'Le futur proche ne convient pas, tu la cherches maintenant !' }
                        ],
                        contextHint: '💡 Pour dire ce qu\'on est en train de faire, on utilise le présent'
                    },
                    {
                        text: 'Le passant te donne des indications :',
                        character: 'passant',
                        dialogue: '"C\'est tout droit, puis à droite."',
                        question: 'Tu confirmes que tu vas suivre ses instructions :',
                        verb: 'aller',
                        tense: 'futurProche',
                        pronoun: 'je',
                        choices: [
                            { text: 'Je vais aller tout droit', correct: true, feedback: 'Parfait ! Le futur proche pour une action immédiate.' },
                            { text: 'J\'allais tout droit', correct: false, feedback: 'L\'imparfait suggère que tu y allais avant mais plus maintenant.' },
                            { text: 'Je vais tout droit', correct: true, feedback: 'Aussi correct ! "Aller" peut être omis dans ce contexte.' }
                        ],
                        contextHint: '💡 Le futur proche "je vais" exprime une intention immédiate'
                    },
                    {
                        text: 'Le passant précise :',
                        character: 'passant',
                        dialogue: '"Ensuite vous tournez à droite au feu."',
                        question: 'Tu répètes pour être sûr·e :',
                        verb: 'tourner',
                        tense: 'present',
                        pronoun: 'je',
                        choices: [
                            { text: 'Donc je tourne à droite', correct: true, feedback: 'Excellent ! Le présent pour résumer les instructions.' },
                            { text: 'Donc j\'ai tourné à droite', correct: false, feedback: 'Le passé composé ne convient pas, tu n\'as pas encore tourné.' },
                            { text: 'Donc je tournais à droite', correct: false, feedback: 'L\'imparfait ne convient pas ici.' }
                        ],
                        contextHint: '💡 Le présent peut exprimer une action future proche dans un contexte d\'instructions'
                    }
                ]
            },
            {
                id: 'restaurant',
                title: '🍽️ Au Restaurant',
                difficulty: 'débutant',
                goal: 'voyage',
                description: 'Tu dînes dans un restaurant français.',
                requiredVerbs: ['manger', 'aimer', 'prendre'],
                requiredTenses: ['present', 'passeCompose'],
                steps: [
                    {
                        text: 'Le serveur te demande :',
                        character: 'serveur',
                        dialogue: '"Qu\'est-ce que vous prenez ?"',
                        question: 'Tu commandes :',
                        verb: 'prendre',
                        tense: 'futurProche',
                        pronoun: 'je',
                        choices: [
                            { text: 'Je vais prendre le steak-frites', correct: true, feedback: 'Parfait ! Le futur proche pour commander.' },
                            { text: 'Je prends le steak-frites', correct: true, feedback: 'Aussi correct ! Le présent fonctionne très bien.' },
                            { text: 'J\'ai pris le steak-frites', correct: false, feedback: 'Le passé composé suggère que tu as déjà pris, mais tu es en train de commander.' }
                        ],
                        contextHint: '💡 Le présent ou le futur proche fonctionnent tous les deux pour commander'
                    },
                    {
                        text: 'Après le repas, le serveur demande :',
                        character: 'serveur',
                        dialogue: '"C\'était bon ?"',
                        question: 'Tu réponds positivement :',
                        verb: 'aimer',
                        tense: 'passeCompose',
                        pronoun: 'je',
                        choices: [
                            { text: 'Oui, j\'aime beaucoup', correct: false, feedback: 'Le présent peut marcher, mais le passé composé est plus naturel pour parler de l\'expérience passée.' },
                            { text: 'Oui, j\'ai beaucoup aimé', correct: true, feedback: 'Parfait ! Le passé composé pour parler d\'une expérience terminée.' },
                            { text: 'Oui, j\'aimerais beaucoup', correct: false, feedback: 'Le conditionnel ne convient pas, le repas est déjà terminé.' }
                        ],
                        contextHint: '💡 Le passé composé pour parler d\'une action terminée'
                    },
                    {
                        text: 'Ton ami·e te demande :',
                        character: 'ami',
                        dialogue: '"Tu manges souvent au restaurant ?"',
                        question: 'Tu parles de tes habitudes :',
                        verb: 'manger',
                        tense: 'present',
                        pronoun: 'je',
                        choices: [
                            { text: 'Non, je ne mange pas souvent au restaurant', correct: true, feedback: 'Parfait ! Le présent pour parler d\'habitudes.' },
                            { text: 'Non, je n\'ai pas mangé souvent au restaurant', correct: false, feedback: 'Le passé composé ne convient pas pour parler d\'une habitude générale.' },
                            { text: 'Non, je ne mangeais pas souvent au restaurant', correct: false, feedback: 'L\'imparfait suggère une habitude passée qui n\'existe plus.' }
                        ],
                        contextHint: '💡 Le présent pour parler d\'habitudes actuelles'
                    }
                ]
            },
            {
                id: 'travail',
                title: '💼 Au Bureau',
                difficulty: 'intermédiaire',
                goal: 'professionnel',
                description: 'Premier jour dans une entreprise française.',
                requiredVerbs: ['travailler', 'présenter', 'parler'],
                requiredTenses: ['present', 'passeCompose', 'futurProche'],
                steps: [
                    {
                        text: 'Tu rencontres ton manager :',
                        character: 'manager',
                        dialogue: '"Bienvenue ! Parlez-nous de votre expérience."',
                        question: 'Tu parles de ton ancien poste :',
                        verb: 'travailler',
                        tense: 'passeCompose',
                        pronoun: 'je',
                        choices: [
                            { text: 'J\'ai travaillé 3 ans dans le marketing', correct: true, feedback: 'Excellent ! Le passé composé pour une expérience passée.' },
                            { text: 'Je travaille 3 ans dans le marketing', correct: false, feedback: 'Le présent ne convient pas pour parler d\'une expérience passée.' },
                            { text: 'Je travaillais dans le marketing', correct: false, feedback: 'L\'imparfait seul ne suffit pas sans contexte temporel précis.' }
                        ],
                        contextHint: '💡 Le passé composé pour parler d\'une expérience professionnelle passée'
                    },
                    {
                        text: 'On te fait visiter les bureaux :',
                        character: 'collègue',
                        dialogue: '"Et voici ton poste de travail."',
                        question: 'Tu exprimes ton enthousiasme :',
                        verb: 'travailler',
                        tense: 'futurProche',
                        pronoun: 'je',
                        choices: [
                            { text: 'Super ! Je vais travailler avec plaisir ici', correct: true, feedback: 'Parfait ! Le futur proche pour exprimer une intention.' },
                            { text: 'Super ! J\'ai travaillé avec plaisir ici', correct: false, feedback: 'Le passé composé ne convient pas, tu viens d\'arriver.' },
                            { text: 'Super ! Je travaillerai avec plaisir ici', correct: false, feedback: 'Le futur simple est possible mais moins naturel dans ce contexte immédiat.' }
                        ],
                        contextHint: '💡 Le futur proche pour parler d\'intentions immédiates'
                    }
                ]
            },
            {
                id: 'ecole',
                title: '📚 En Classe',
                difficulty: 'intermédiaire',
                goal: 'académique',
                description: 'Tu suis un cours de français langue étrangère.',
                requiredVerbs: ['comprendre', 'étudier', 'demander'],
                requiredTenses: ['present', 'passeCompose', 'imparfait'],
                steps: [
                    {
                        text: 'Le professeur explique une règle de grammaire :',
                        character: 'prof',
                        dialogue: '"Est-ce que vous comprenez ?"',
                        question: 'Tu es un peu perdu·e, tu réponds :',
                        verb: 'comprendre',
                        tense: 'present',
                        pronoun: 'je',
                        choices: [
                            { text: 'Je ne comprends pas tout', correct: true, feedback: 'Parfait ! C\'est honnête et le présent est approprié.' },
                            { text: 'Je n\'ai pas compris tout', correct: false, feedback: 'Le passé composé suggère que la leçon est finie, mais elle continue.' },
                            { text: 'Je ne comprenais pas tout', correct: false, feedback: 'L\'imparfait suggère une difficulté passée qui n\'existe plus.' }
                        ],
                        contextHint: '💡 Le présent pour parler de ton état actuel de compréhension'
                    },
                    {
                        text: 'Le prof te demande :',
                        character: 'prof',
                        dialogue: '"Qu\'est-ce que vous ne comprenez pas ?"',
                        question: 'Tu demandes de l\'aide :',
                        verb: 'demander',
                        tense: 'present',
                        pronoun: 'je',
                        choices: [
                            { text: 'Je demande si vous pouvez répéter', correct: false, feedback: 'Pas naturel. Mieux : "Je peux vous demander de répéter ?"' },
                            { text: 'Pouvez-vous répéter, s\'il vous plaît ?', correct: true, feedback: 'Parfait ! C\'est la façon polie et directe de demander.' },
                            { text: 'J\'ai demandé si vous pouviez répéter', correct: false, feedback: 'Le passé composé ne convient pas, tu demandes maintenant.' }
                        ],
                        contextHint: '💡 Pour demander poliment, utilise "Pouvez-vous..." ou "Je peux vous demander de..."'
                    }
                ]
            }
        ];
    }

    // Obtenir un scénario adapté au profil
    getAdaptedScenario() {
        const scenarios = this.getScenarios();
        const profile = this.adaptiveLearning.userProfile;
        const level = this.adaptiveLearning.assessLevel();
        
        // Filtrer par niveau
        let available = scenarios.filter(s => {
            if (level === 'débutant') return s.difficulty === 'débutant';
            if (level === 'intermédiaire') return s.difficulty === 'débutant' || s.difficulty === 'intermédiaire';
            return true; // avancé peut tout faire
        });
        
        // Filtrer par objectif d'apprentissage
        if (profile.learningGoal !== 'général') {
            const goalScenarios = available.filter(s => s.goal === profile.learningGoal);
            if (goalScenarios.length > 0) {
                available = goalScenarios;
            }
        }
        
        // Choisir aléatoirement
        return available[Math.floor(Math.random() * available.length)];
    }

    // Démarrer un scénario
    startScenario(scenarioId = null) {
        if (scenarioId) {
            this.currentScenario = this.getScenarios().find(s => s.id === scenarioId);
        } else {
            this.currentScenario = this.getAdaptedScenario();
        }
        
        this.currentStep = 0;
        this.choices = [];
        this.score = 0;
        
        return this.currentScenario;
    }

    // Obtenir l'étape actuelle
    getCurrentStep() {
        if (!this.currentScenario || this.currentStep >= this.currentScenario.steps.length) {
            return null;
        }
        return this.currentScenario.steps[this.currentStep];
    }

    // Faire un choix
    makeChoice(choiceIndex) {
        const step = this.getCurrentStep();
        if (!step) return null;
        
        const choice = step.choices[choiceIndex];
        this.choices.push({
            step: this.currentStep,
            choice: choiceIndex,
            correct: choice.correct
        });
        
        if (choice.correct) {
            this.score++;
            
            // Enregistrer la réussite dans le système adaptatif
            this.adaptiveLearning.recordReview(
                step.verb,
                step.tense,
                5 // Performance parfaite
            );
        } else {
            // Enregistrer l'erreur
            this.adaptiveLearning.recordReview(
                step.verb,
                step.tense,
                2 // Performance faible
            );
        }
        
        return {
            correct: choice.correct,
            feedback: choice.feedback,
            nextStep: this.currentStep + 1 < this.currentScenario.steps.length
        };
    }

    // Passer à l'étape suivante
    nextStep() {
        this.currentStep++;
        return this.getCurrentStep();
    }

    // Obtenir les résultats
    getResults() {
        const total = this.currentScenario ? this.currentScenario.steps.length : 0;
        const percentage = total > 0 ? Math.round((this.score / total) * 100) : 0;
        
        let message = '';
        let emoji = '';
        
        if (percentage >= 90) {
            message = 'Incroyable ! Tu es un·e pro de la conversation ! 🏆';
            emoji = '🏆';
        } else if (percentage >= 70) {
            message = 'Très bien ! Tu te débrouilles super bien ! 🌟';
            emoji = '🌟';
        } else if (percentage >= 50) {
            message = 'Pas mal ! Continue à pratiquer ! 💪';
            emoji = '💪';
        } else {
            message = 'Continue comme ça, la pratique fait le maître ! 📚';
            emoji = '📚';
        }
        
        return {
            score: this.score,
            total: total,
            percentage: percentage,
            message: message,
            emoji: emoji,
            choices: this.choices
        };
    }
}

// Export
window.StoryMode = StoryMode;
