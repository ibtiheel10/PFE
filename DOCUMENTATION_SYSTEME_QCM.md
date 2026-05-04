# 📋 Documentation Complète du Système QCM

## 🎯 Vue d'ensemble

Le système QCM (Questionnaire à Choix Multiples) est un module complet d'évaluation des candidats intégré dans la plateforme Skillvia. Il permet aux entreprises de générer automatiquement des tests techniques via IA, de les administrer aux candidats, et d'évaluer automatiquement les résultats.

---

## 🏗️ Architecture Globale

### Stack Technique
- **Backend**: NestJS + TypeScript + TypeORM
- **Frontend**: Vue 3 + TypeScript + Vite
- **IA**: OpenAI GPT (via service AI personnalisé)
- **Base de données**: PostgreSQL

### Flux de données
```
Entreprise → Génération QCM (IA) → Stockage Questions → 
Candidat → Passage Test → Soumission Réponses → 
Évaluation Automatique → Résultats + Recommandations IA
```

---

## 📁 Structure des Fichiers

### Backend

#### 1. **Entités (Database Models)**
- `Backend/src/entities/question.entity.ts` - Modèle de données des questions
- `Backend/src/entities/candidature.entity.ts` - Stocke les réponses et scores

#### 2. **Services IA**
- **`Backend/src/ai/ai.service.ts`** (lignes 528-702)
  - `generateQuestions()` - Ligne 528
  - `regenerateQuestions()` - Ligne 560
  - `generateRecommendation()` - Ligne 586
  - `analyzeDetailedSkills()` - Ligne 650

#### 3. **Service de Scoring**
- **`Backend/src/ai/scoring.service.ts`** (lignes 1-67)
  - `calculateScore()` - Ligne 35 : Calcule le score basé sur les réponses

#### 4. **Contrôleurs API**
- **`Backend/src/ai/ai.controller.ts`** (lignes 107-136)
  - `POST /ai/generate-questions` - Ligne 107
  - `POST /ai/regenerate-questions` - Ligne 118
  - `POST /ai/submit-answers` - Ligne 133

- **`Backend/src/entreprise/entreprise.service.ts`** (lignes 520-572)
  - Intégration génération QCM dans création d'offre

#### 5. **Gestion des Candidatures**
- `Backend/src/candidatures/candidatures.service.ts`
  - Endpoints pour récupérer/soumettre évaluations

### Frontend

#### 1. **Composants de Génération (Entreprise)**
- **`Frontend/src/components/liste_poste_entreprise.vue`** (lignes 307-378)
  - Interface de génération QCM
  - Fonction `generateQCM()` - Ligne 925

- **`Frontend/src/components/ajoutposte.vue`**
  - Formulaire de création d'offre avec QCM intégré

#### 2. **Composants d'Évaluation (Candidat)**
- **`Frontend/src/components/candidate/EvaluationSession.vue`** (1-500+ lignes)
  - Interface complète de passage du test
  - Timer avec persistance
  - Système anti-triche
  - Navigation entre questions
  - Soumission des réponses

- **`Frontend/src/components/candidate/EvaluationResult.vue`**
  - Affichage des résultats
  - Recommandations IA
  - Analyse détaillée des compétences

#### 3. **Services Frontend**
- **`Frontend/src/services/entrepriseService.ts`**
  - `generateQuestionsForOffre()`
  - `regenerateQuestionsForOffre()`
  - `saveQuestionsForOffre()`

---

## 🔧 Fonctions Principales Détaillées

### 1. Génération de Questions (Backend)

#### **`generateQuestions()`** 
📍 **Fichier**: `Backend/src/ai/ai.service.ts`  
📍 **Lignes**: 528-556

```typescript
async generateQuestions(
  jobDescription: string,
  offre: any = null,
  competences: string = '',
): Promise<any[]>
```

**Fonctionnement**:
1. Extrait le titre du poste de la description
2. Appelle `generateWithRetry()` pour générer 5 questions via IA
3. Si une offre est fournie, crée des entités Question et les sauvegarde en DB
4. Retourne les questions générées

**Utilisation**:
- Appelée lors de la création d'une offre d'emploi
- Génère automatiquement un QCM adapté au poste

---

#### **`regenerateQuestions()`**
📍 **Fichier**: `Backend/src/ai/ai.service.ts`  
📍 **Lignes**: 560-584

```typescript
async regenerateQuestions(
  jobDescription: string,
  previousQuestions: string[] = [],
  competences: string = '',
): Promise<QuizQuestion[]>
```

**Fonctionnement**:
1. Prend en compte les questions précédentes pour éviter les doublons
2. Génère 5 nouvelles questions différentes
3. Ajoute un chronomètre de 30 secondes par question

**Utilisation**:
- Permet au recruteur de régénérer le QCM s'il n'est pas satisfait
- Évite les questions répétitives

---

### 2. Évaluation et Scoring (Backend)

#### **`calculateScore()`**
📍 **Fichier**: `Backend/src/ai/scoring.service.ts`  
📍 **Lignes**: 35-67

```typescript
calculateScore(
  questions: QuizQuestion[], 
  answers: string[]
): ScoreResult
```

**Fonctionnement**:
1. Compare chaque réponse du candidat avec la bonne réponse
2. Incrémente le score pour chaque bonne réponse
3. Calcule le pourcentage final
4. Retourne les détails question par question

**Structure de retour**:
```typescript
{
  score: number,           // Nombre de bonnes réponses
  total: number,           // Nombre total de questions
  percentage: number,      // Score en pourcentage
  details: Array<{
    question: string,
    selectedAnswer: string,
    correctAnswer: string,
    isCorrect: boolean
  }>
}
```

---

#### **`generateRecommendation()`**
📍 **Fichier**: `Backend/src/ai/ai.service.ts`  
📍 **Lignes**: 586-648

```typescript
async generateRecommendation(
  jobDescription: string,
  results: TestResult[],
): Promise<AIRecommendation>
```

**Fonctionnement**:
1. Calcule le score global
2. Identifie les points forts (questions correctes)
3. Identifie les faiblesses (questions incorrectes)
4. Appelle l'IA pour une analyse détaillée des compétences
5. Génère des recommandations personnalisées
6. Fallback déterministe si l'IA échoue

**Utilisation**:
- Appelée après la soumission du test
- Fournit un feedback détaillé au candidat

---

### 3. Interface de Passage du Test (Frontend)

#### **EvaluationSession.vue**
📍 **Fichier**: `Frontend/src/components/candidate/EvaluationSession.vue`  
📍 **Lignes**: 1-500+

**Composants clés**:

##### **Timer avec Persistance** (lignes 60-120)
```typescript
const sessionDurationSeconds = ref(FALLBACK_DURATION_SECONDS);
const totalTimeSeconds = ref(0);

const startTimer = () => {
  timerInterval = window.setInterval(() => {
    if (totalTimeSeconds.value > 0) {
      totalTimeSeconds.value--;
      totalTimeInSeconds.value++;
      
      // Sync avec localStorage pour gérer les rafraîchissements
      const startTimeStr = localStorage.getItem(getSessionStartTimeKey(candId));
      if (startTimeStr) {
        const actualElapsed = Math.floor((Date.now() - parseInt(startTimeStr)) / 1000);
        totalTimeInSeconds.value = actualElapsed;
        totalTimeSeconds.value = Math.max(0, sessionDurationSeconds.value - actualElapsed);
      }
    } else {
      clearInterval(timerInterval);
      handleNext(true); // Auto-submit
    }
  }, 1000);
};
```

**Fonctionnalités**:
- Persistance du temps de démarrage dans localStorage
- Synchronisation avec l'horloge système
- Résistant aux rafraîchissements de page
- Auto-soumission à l'expiration

---

##### **Système Anti-Triche** (lignes 200-350)

**Détections implémentées**:
1. **Changement d'onglet** - `handleVisibilityChange()`
2. **Perte de focus** - `handleBlur()`
3. **Clic droit** - `preventContextMenu()`
4. **Copier/Coller** - `preventDefaultAction()`
5. **Outils développeur** - `handleKeydown()` (F12, Ctrl+Shift+I)
6. **Capture d'écran** - Détection de PrintScreen

**Système d'infractions**:
```typescript
const MAX_INFRACTIONS = 3;
const infractionsCount = ref(0);

const handleInfraction = (type: string) => {
  if (IMMEDIATE_FORFEIT_TYPES.includes(type)) {
    triggerForfeit(type); // Annulation immédiate
  } else {
    infractionsCount.value++;
    if (infractionsCount.value >= MAX_INFRACTIONS) {
      triggerForfeit(type); // Annulation après 3 avertissements
    }
  }
};
```

**Infractions graves (forfait immédiat)**:
- Capture d'écran
- Changement d'onglet
- Perte de focus (autre application)

---

##### **Navigation et Soumission** (lignes 450-500)

```typescript
const handleNext = async (forced = false) => {
  // Enregistrer la réponse actuelle
  if (selectedOptionIndex.value !== null && currentQuestion.value) {
    studentAnswers.value[currentQuestion.value.id] = selectedOptionIndex.value;
  }

  if (forced || isLastQuestion.value) {
    // Soumission finale
    await api.post(`/candidatures/${candId}/evaluation`, { 
      answers: studentAnswers.value,
      tempsEcoule: formatDuration(totalTimeInSeconds.value)
    });
    
    // Nettoyage localStorage
    sessionStorage.removeItem(getSessionKey(candId));
    localStorage.removeItem(getSessionStartTimeKey(candId));
    
    // Redirection vers résultats
    router.push({ name: 'EvaluationResult', params: { id: candId } });
  } else {
    // Question suivante
    currentQuestionIndex.value++;
    selectedOptionIndex.value = null;
  }
};
```

---

### 4. Génération QCM (Frontend Entreprise)

#### **`generateQCM()`**
📍 **Fichier**: `Frontend/src/components/liste_poste_entreprise.vue`  
📍 **Lignes**: 925-1000

```typescript
const generateQCM = async () => {
  if (!form.value.title || !form.value.description) {
    await Swal.fire({
      icon: 'warning',
      title: 'Informations manquantes',
      text: 'Veuillez remplir le titre et la description avant de générer un QCM'
    });
    return;
  }
  
  qcmLoading.value = true;
  
  try {
    if (!createdOffreId.value) {
      // Créer l'offre d'abord si elle n'existe pas
      // ...
    }
    
    const response = await generateQuestionsForOffre(
      createdOffreId.value,
      form.value.description,
      form.value.requirements
    );
    
    if (response.success) {
      generatedQuestions.value = response.questions;
      await Swal.fire({
        icon: 'success',
        title: 'QCM généré !',
        text: `${questions.length} questions ont été générées avec succès`
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la génération du QCM'
    });
  } finally {
    qcmLoading.value = false;
  }
};
```

---

## 🔄 Flux Complet d'une Évaluation

### Phase 1: Création (Entreprise)
1. **Entreprise crée une offre** → `ajoutposte.vue`
2. **Clique sur "Générer QCM avec l'IA"** → `generateQCM()`
3. **Backend génère 5 questions** → `ai.service.ts:generateQuestions()`
4. **Questions sauvegardées en DB** → `question.entity.ts`
5. **Entreprise valide et publie l'offre**

### Phase 2: Candidature
1. **Candidat postule à l'offre** → Création `candidature.entity`
2. **Statut initial**: "En attente"
3. **Date QCM programmée** → `dateLancementQcm`

### Phase 3: Passage du Test
1. **Candidat accède au test** → `EvaluationSession.vue`
2. **Vérification**: Pas déjà passé (409 si déjà fait)
3. **Chargement questions** → `GET /candidatures/:id/evaluation`
4. **Timer démarre** → Persistance localStorage
5. **Système anti-triche activé** → Surveillance continue
6. **Candidat répond aux questions** → Stockage local des réponses
7. **Soumission** → `POST /candidatures/:id/evaluation`

### Phase 4: Évaluation
1. **Backend reçoit les réponses** → `candidatures.service.ts`
2. **Calcul du score** → `scoring.service.ts:calculateScore()`
3. **Génération recommandations IA** → `ai.service.ts:generateRecommendation()`
4. **Mise à jour candidature** → Score + Statut + Détails
5. **Notification entreprise** → Nouvelle candidature évaluée

### Phase 5: Résultats
1. **Candidat voit ses résultats** → `EvaluationResult.vue`
2. **Affichage**: Score, détails par question, recommandations
3. **Entreprise voit le score** → Dashboard candidatures

---

## 📊 Structure des Données

### Question Entity
```typescript
{
  id: number,
  contenu: {
    question: string,
    options: Array<{
      text: string,
      isCorrect: boolean
    }>,
    category: string
  },
  chronometre: number,  // Durée en secondes
  offre: OffreEmploi
}
```

### Candidature Entity (après évaluation)
```typescript
{
  id: number,
  score: number,        // Score en pourcentage
  statut: string,       // "Accepté" / "Refusé" / "En attente"
  evaluationDetails: {
    ScoreParCompetence: Record<string, number>,
    recommendations: string[],
    strengths: string[],
    weaknesses: string[],
    tempsEcoule: string
  },
  reponsesCandidats: Array<{
    questionId: number,
    selectedAnswer: string,
    isCorrect: boolean
  }>
}
```

---

## 🔐 Sécurité et Anti-Triche

### Mesures Implémentées

1. **Détection Changement d'Onglet**
   - Event: `visibilitychange`
   - Action: Avertissement ou forfait

2. **Blocage Copier/Coller**
   - Events: `copy`, `cut`, `paste`, `selectstart`
   - Prévention totale

3. **Blocage Outils Développeur**
   - Keys: F12, Ctrl+Shift+I/J
   - Prévention + avertissement

4. **Détection Capture d'Écran**
   - Key: PrintScreen
   - Forfait immédiat

5. **Timer Persistant**
   - localStorage avec timestamp
   - Résistant aux rafraîchissements
   - Synchronisation horloge système

6. **Session Unique**
   - Vérification backend: déjà passé → 409
   - Verrou sessionStorage

### Système de Forfait
```typescript
const triggerForfeit = async (reason: string) => {
  // 1. Arrêt du timer
  clearInterval(timerInterval);
  
  // 2. Appel backend forfait
  await api.post(`/candidatures/${candId}/forfeit`, { reason });
  
  // 3. Score = 0%, Statut = "Refusé"
  
  // 4. Nettoyage localStorage
  
  // 5. Redirection résultats
  router.push({ name: 'EvaluationResult' });
};
```

---

## 🎨 Interface Utilisateur

### Entreprise
- **Génération QCM**: Modal avec aperçu des questions
- **Édition**: Modification texte questions et options
- **Validation**: Sélection réponse correcte par radio button
- **Régénération**: Nouvelles questions différentes

### Candidat
- **Header**: Timer + Progression + Titre
- **Question**: Card avec texte formaté
- **Options**: Radio buttons stylisés
- **Navigation**: Bouton "Question Suivante" / "Soumettre"
- **Anti-triche**: Banner + Modal d'avertissement

---

## 📈 Métriques et Analytics

### Données Collectées
- Score global (%)
- Score par compétence
- Temps écoulé
- Nombre d'infractions
- Détails par question (correct/incorrect)

### Recommandations IA
- Points forts identifiés
- Faiblesses détectées
- Suggestions d'amélioration
- Analyse comportementale

---

## 🚀 Points d'Extension Futurs

1. **Banque de Questions**
   - Réutilisation de questions validées
   - Catégorisation par compétence

2. **Difficulté Adaptative**
   - Questions plus difficiles si bonnes réponses
   - Ajustement dynamique

3. **Vidéo Surveillance**
   - Enregistrement webcam pendant le test
   - Détection de présence multiple

4. **Analytics Avancés**
   - Temps moyen par question
   - Taux de réussite par compétence
   - Comparaison avec autres candidats

5. **Questions Ouvertes**
   - Évaluation par IA des réponses textuelles
   - Scoring automatique

---

## 📝 Résumé des Fichiers Clés

| Fichier | Rôle | Lignes Importantes |
|---------|------|-------------------|
| `Backend/src/ai/ai.service.ts` | Génération questions + Recommandations | 528-702 |
| `Backend/src/ai/scoring.service.ts` | Calcul score | 35-67 |
| `Backend/src/ai/ai.controller.ts` | API endpoints QCM | 107-136 |
| `Frontend/src/components/candidate/EvaluationSession.vue` | Interface passage test | 1-500+ |
| `Frontend/src/components/liste_poste_entreprise.vue` | Génération QCM entreprise | 307-378, 925-1000 |
| `Backend/src/entities/question.entity.ts` | Modèle données questions | Tout le fichier |
| `Backend/src/entities/candidature.entity.ts` | Stockage réponses/scores | Tout le fichier |

---

## 🎯 Conclusion

Le système QCM de Skillvia est une solution complète et sécurisée pour l'évaluation automatisée des candidats. Il combine:
- **IA générative** pour créer des tests adaptés
- **Interface intuitive** pour candidats et recruteurs
- **Sécurité robuste** avec système anti-triche
- **Évaluation automatique** avec feedback détaillé
- **Persistance des données** pour reprendre après interruption

Le code est modulaire, bien structuré et facilement extensible pour de futures améliorations.
