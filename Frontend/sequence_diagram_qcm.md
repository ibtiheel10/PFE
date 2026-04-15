# Diagramme de Séquence : Génération, Examen et Feedback QCM

Ce diagramme de séquence illustre de manière détaillée les interactions entre un candidat (ou l'entreprise), l'API du Backend, le service d'Intelligence Artificielle de votre application ([AiService](file:///c:/Users/aya%20labyedh/Desktop/PFE/Backend/src/ai/ai.service.ts#41-704)) et l'API externe (par exemple Groq ou OpenAI). Il couvre l'ensemble du cycle de vie d'un quiz, de sa création à la restitution du feedback.

```mermaid
sequenceDiagram
    autonumber
    
    actor E as Entreprise / Recruteur
    actor C as Candidat
    participant API as Backend (Contrôleurs)
    participant AI_S as AiService
    participant DB as Base de Données
    participant Groq as AI externe (Groq/OpenAI)

    %% 1. GÉNÉRATION DE QCM
    rect rgb(200, 220, 240)
        Note over E, Groq: 1. Génération initiale du QCM
        E->>API: Demande de génération QCM (Offre, Description, Compétences)
        API->>AI_S: generateQuestions(jobDescription, offre, competences)
        AI_S->>Groq: Prompt d'extraction de compétences (si nécessaire)
        Groq-->>AI_S: Liste JSON de compétences précises
        AI_S->>Groq: callAI(Prompt pour générer QCM de 5 questions stricte)
        Groq-->>AI_S: Retour JSON avec questions du QCM
        AI_S->>AI_S: Parse, valide, nettoie et formate (QuizQuestion[])
        AI_S->>DB: Sauvegarde les questions générées liées à l'offre
        DB-->>AI_S: Confirmation (Entités créées)
        AI_S-->>API: QCM complet généré
        API-->>E: QCM disponible
    end

    %% 2. RÉGÉNÉRATION DE QCM (Optionnelle)
    rect rgb(240, 230, 200)
        Note over C, Groq: 2. Régénération (si un autre QCM est demandé)
        C->>API: Demande nouveau QCM (évite les précédentes questions)
        API->>AI_S: regenerateQuestions(jobDescription, previousQuestions, competences)
        AI_S->>Groq: callAI(Prompt QCM en excluant previousQuestions)
        Groq-->>AI_S: Nouveau QCM (JSON)
        AI_S->>AI_S: Validation (Vérifie qu'il n'y a pas de doublons)
        AI_S-->>API: Nouveaux éléments QuizQuestion[]
        API-->>C: Fournit au candidat son QCM personnalisé
    end

    %% 3. PASSAGE DE L'EXAMEN
    rect rgb(210, 240, 210)
        Note over C, API: 3. Le Candidat passe l'examen
        C->>API: Commence l'examen et récupère le QCM (si pré-généré)
        API-->>C: Renvoie questions, options et chronomètre de l'offre
        
        loop Réponse à chaque question
            C->>C: Lit la question, compte le chronomètre, sélectionne une option
        end
        
        C->>API: Soumission des réponses complètes (TestResult[])
    end

    %% 4. CRÉATION DU FEEDBACK
    rect rgb(240, 210, 240)
        Note over C, Groq: 4. Évaluation IA et Feedback
        API->>AI_S: generateRecommendation(jobDescription, résultats)
        AI_S->>AI_S: Calcule le score global (ex: 80%) et filtre le correct/incorrect
        
        AI_S->>Groq: analyzeDetailedSkills(jobDescription, résultats)
        Note right of AI_S: Demande d'analyser les listes des bonnes <br/> et mauvaises réponses avec justification
        Groq-->>AI_S: JSON (detailedSkills, behavioralSkills + justifications)
        
        AI_S->>AI_S: Assemble AIRecommendation (Score, Strengths, Weaknesses)
        AI_S-->>API: Retourne le rapport détaillé
        API->>DB: Sauvegarde les résultats de l'évaluation
        DB-->>API: Sauvegarde validée
        API-->>C: Affiche le Score / Feedback & Recommandations ciblés
        API-->>E: Rend les résultats du candidat disponibles dans le Dashboard
    end
```

### Explications des étapes clés basées sur votre code :
1. **Génération (Questions avec Retry) :** L'AI (Groq/OpenAI) est d'abord interrogée pour obtenir des compétences précises sur la description du poste. Ensuite, on envoie le prompt massif avec les règles de génération strictes. S'il ne renvoie pas un format viable, l'API bascule (_retry / rotation des modèles_) sur différents modèles Groq pour essayer d'avoir un JSON sans timeout.
2. **Régénération :** La fonction [regenerateQuestions](file:///c:/Users/aya%20labyedh/Desktop/PFE/Backend/src/ai/ai.service.ts#560-578) envoie intentionnellement l'historique de passage (les anciennes questions) pour forcer le LLM à créer un jeu de données unique à 100%. 
3. **Examen en cours :** L'objet _TestResult_ contiendra la "question posée", la "selectedAnswer", et la vraie "correctAnswer".
4. **Feedback (Recommandations et compétences spécifiques) :** Après un calcul déterministique (pour sécuriser le fonctionnement et obtenir un taux de réussite via `score`), l'API bascule vers la fonction [analyzeDetailedSkills()](file:///c:/Users/aya%20labyedh/Desktop/PFE/Backend/src/ai/ai.service.ts#643-693). Cette méthode effectue du _Skill Extraction_ : elle demande exactement pourquoi un candidat a échoué (ou réussi) et l'IA donne un JSON contenant des notes par technologies précises (ex: `JavaScript: 70`, `Problem Solving: 100`).
