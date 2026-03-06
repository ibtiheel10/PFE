<template>
  <Navbar />
  <div class="support-page">
    <!-- Hero Section -->
    <header class="support-hero">
      <div class="hero-content">
        <h1>Centre d'aide Skillvia</h1>
        <p>Comment pouvons-nous vous aider aujourd'hui ?</p>
        <div class="search-bar-container">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher une réponse (ex: 'entretien', 'mot de passe'...)" 
            class="search-input"
          />
        </div>
      </div>
    </header>

    <!-- Categories Section -->
    <section class="support-categories">
      <div class="container">
        <div class="categories-grid">
          <div class="category-card">
            <div class="category-icon candidate"><i class="fas fa-user-graduate"></i></div>
            <h3>Candidats</h3>
            <p>Gérez votre profil, passez vos tests et suivez vos candidatures.</p>
            <a href="#faq" class="category-link">En savoir plus →</a>
          </div>
          <div class="category-card">
            <div class="category-icon recruiter"><i class="fas fa-building"></i></div>
            <h3>Recruteurs</h3>
            <p>Créez des tests, gérez vos offres et analysez les talents.</p>
            <a href="#faq" class="category-link">En savoir plus →</a>
          </div>
          <div class="category-card">
            <div class="category-icon technical"><i class="fas fa-laptop-code"></i></div>
            <h3>Technique</h3>
            <p>Résolutions de problèmes, intégrations API et sécurité.</p>
            <a href="#faq" class="category-link">En savoir plus →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq-section">
      <div class="container">
        <h2 class="section-title">Questions Fréquentes</h2>
        <div class="faq-list">
          <div v-for="(item, index) in filteredFaqs" :key="index" class="faq-item">
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ item.question }}</h3>
              <i :class="['fas', activeFaq === index ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>
            <div v-show="activeFaq === index" class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="support-contact">
      <div class="container">
        <div class="contact-banner">
          <div class="banner-text">
            <h2>Vous ne trouvez pas votre réponse ?</h2>
            <p>Notre équipe de support est disponible du lundi au vendredi de 9h à 18h.</p>
          </div>
          <router-link to="/contact" class="btn-contact-support">
            Contacter le support
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Navbar from './Navbar.vue';

const searchQuery = ref('');
const activeFaq = ref<number | null>(0);

const faqs = [
  {
    question: "Comment puis-je passer mon test ?",
    answer: "Une fois que vous avez reçu l'invitation par e-mail, cliquez sur le lien fourni. Assurez-vous d'être dans un endroit calme avec une connexion internet stable."
  },
  {
    question: "Puis-je recommencer un test en cas de problème technique ?",
    answer: "Si vous rencontrez une déconnexion ou un bug durant le test, contactez immédiatement notre support. Nous pourrons réinitialiser votre session après vérification."
  },
  {
    question: "Comment sont calculés les scores ?",
    answer: "Les scores sont basés sur la précision de vos réponses et, dans certains cas, sur le temps de réponse. Chaque recruteur définit ensuite ses propres seuils de réussite."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Oui, Skillvia est entièrement conforme au RGPD. Vos données personnelles sont chiffrées et ne sont transmises qu'au recruteur gérant l'offre concernée."
  },
  {
    question: "Qu'est-ce qu'un e-mail professionnel ?",
    answer: "Un e-mail professionnel est un e-mail lié au domaine de votre entreprise (ex: @maboite.com). Les adresses gratuites (Gmail, Yahoo) ne sont pas acceptées pour les comptes recruteurs."
  },
  {
    question: "Comment modifier mon profil candidat ?",
    answer: "Connectez-vous à votre compte, cliquez sur votre avatar en haut à droite, puis sélectionnez 'Mon profil'. Vous pourrez y modifier vos informations personnelles et votre CV."
  },
  {
    question: "Combien de temps ai-je pour compléter un test ?",
    answer: "La durée varie selon le test, généralement entre 15 et 45 minutes. Le temps restant est affiché en haut de l'écran pendant le test."
  },
  {
    question: "Puis-je voir mes résultats après le test ?",
    answer: "Vous recevrez un récapitulatif par e-mail après le test. Les résultats détaillés sont visibles dans votre espace 'Mes Tests' une fois que le recruteur les aura validés."
  }
];

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs;
  return faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};
</script>

<style scoped>
.support-page {
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  background-color: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.support-hero {
  background: linear-gradient(135deg, #1f5bff 0%, #0d47a1 100%);
  color: white;
  padding: 160px 20px 100px;
  text-align: center;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2.5rem;
}

.search-bar-container {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.2rem;
}

.search-input {
  width: 100%;
  padding: 18px 20px 18px 55px;
  border-radius: 12px;
  border: none;
  font-size: 1.1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  outline: none;
}

/* Categories */
.support-categories {
  padding: 80px 0;
  margin-top: -50px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.category-card {
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid #e2e8f0;
}

.category-card:hover {
  transform: translateY(-10px);
}

.category-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  font-size: 2rem;
}

.category-icon.candidate { background: #eff6ff; color: #1f5bff; }
.category-icon.recruiter { background: #f0fdf4; color: #10b981; }
.category-icon.technical { background: #faf5ff; color: #a855f7; }

.category-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1e293b;
}

.category-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.category-link {
  color: #1f5bff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
}

/* FAQ Section */
.faq-section {
  padding: 40px 0 80px;
}

.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 50px;
  color: #1e293b;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.faq-question {
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.faq-question:hover {
  background: #fbfcfe;
}

.faq-question h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #334155;
}

.faq-question i {
  color: #94a3b8;
  font-size: 0.9rem;
}

.faq-answer {
  padding: 0 25px 20px;
  color: #64748b;
  line-height: 1.6;
  font-size: 1rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}

/* Contact Banner */
.support-contact {
  padding-bottom: 100px;
}

.contact-banner {
  background: white;
  padding: 50px;
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}

.banner-text h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 10px;
  color: #1e293b;
}

.banner-text p {
  color: #64748b;
  font-size: 1.1rem;
}

.btn-contact-support {
  padding: 16px 32px;
  background: #1f5bff;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-contact-support:hover {
  background: #1e4ed8;
  box-shadow: 0 10px 20px rgba(31, 91, 255, 0.2);
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-banner {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
  
  .hero-content h1 {
    font-size: 2.2rem;
  }
}
</style>
