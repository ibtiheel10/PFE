<template>
  <Navbar />
  <div class="pricing-container">
    <section class="pricing-header">
      <h1>Nos Tarifs</h1>
      <p>Choisissez le forfait qui correspond le mieux à vos besoins de recrutement.</p>
    </section>

    <div class="pricing-grid">
      <!-- Starter Plan -->
      <div class="pricing-card">
        <div class="card-header">
          <h3>Starter</h3>
          <div class="price">
            <span class="currency">€</span>
            <span class="amount">49</span>
            <span class="period">/mois</span>
          </div>
        </div>
        <ul class="features">
          <li><i class="fas fa-check"></i> Jusqu'à 5 tests par mois</li>
          <li><i class="fas fa-check"></i> 100 candidats inclus</li>
          <li><i class="fas fa-check"></i> Support par email</li>
          <li><i class="fas fa-check"></i> Analyses de base</li>
        </ul>
        <router-link to="/inscription" class="btn-select">Commencer</router-link>
      </div>

      <!-- Pro Plan -->
      <div class="pricing-card featured">
        <div class="badge">Plus Populaire</div>
        <div class="card-header">
          <h3>Professionnel</h3>
          <div class="price">
            <span class="currency">€</span>
            <span class="amount">149</span>
            <span class="period">/mois</span>
          </div>
        </div>
        <ul class="features">
          <li><i class="fas fa-check"></i> Tests illimités</li>
          <li><i class="fas fa-check"></i> 500 candidats inclus</li>
          <li><i class="fas fa-check"></i> Support prioritaire 24/7</li>
          <li><i class="fas fa-check"></i> Analyses avancées & IA</li>
          <li><i class="fas fa-check"></i> Personnalisation marque</li>
        </ul>
        <router-link to="/inscription" class="btn-select featured-btn">Choisir Pro</router-link>
      </div>

      <!-- Enterprise Plan -->
      <div class="pricing-card">
        <div class="card-header">
          <h3>Entreprise</h3>
          <div class="price">
            <span class="amount">Sur Mesure</span>
          </div>
        </div>
        <ul class="features">
          <li><i class="fas fa-check"></i> Candidats illimités</li>
          <li><i class="fas fa-check"></i> Intégration ATS</li>
          <li><i class="fas fa-check"></i> Account Manager dédié</li>
          <li><i class="fas fa-check"></i> Sécurité SSO & API</li>
          <li><i class="fas fa-check"></i> Support sur site optionnel</li>
        </ul>
        <router-link to="/contact" class="btn-select">Contacter la Vente</router-link>
      </div>
    </div>

    <section class="faq-section">
      <h2>Questions Fréquentes</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h4>Puis-je changer de plan à tout moment ?</h4>
          <p>Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis votre tableau de bord.</p>
        </div>
        <div class="faq-item">
          <h4>Y a-t-il une période d'essai gratuite ?</h4>
          <p>Absolument ! Nous proposons une version d'essai de 14 jours avec toutes les fonctionnalités du plan Pro.</p>
        </div>
        <div class="faq-item">
          <h4>Quels types de paiement acceptez-vous ?</h4>
          <p>Nous acceptons toutes les cartes de crédit majeures, les virements bancaires et PayPal.</p>
        </div>
        <div class="faq-item">
          <h4>Mes données sont-elles sécurisées ?</h4>
          <p>La sécurité est notre priorité. Toutes vos données sont chiffrées et conformes au RGPD.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue';
// No complex logic needed for static display, but we can add props or methods if required later.
</script>

<style scoped>
.pricing-container {
  padding: 140px 20px 80px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  color: #2d3748;
}

.pricing-header {
  text-align: center;
  margin-bottom: 60px;
}

.pricing-header h1 {
  font-size: 3rem;
  color: #1a202c;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pricing-header p {
  font-size: 1.2rem;
  color: #718096;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
}

.pricing-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #edf2f7;
}

.pricing-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.pricing-card.featured {
  background: #1a202c;
  color: white;
  border: none;
  transform: scale(1.05);
}

.pricing-card.featured .price .period,
.pricing-card.featured .features li {
  color: #a0aec0;
}

.pricing-card.featured:hover {
  transform: scale(1.08) translateY(-5px);
}

.badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #ecc94b;
  color: #1a202c;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.card-header h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.price {
  margin-bottom: 30px;
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 5px;
}

.amount {
  font-size: 3rem;
  font-weight: 800;
}

.period {
  font-size: 1rem;
  color: #718096;
  margin-left: 5px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  flex-grow: 1;
}

.features li {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  color: #4a5568;
}

.features i {
  color: #48bb78;
  margin-right: 12px;
}

.btn-select {
  display: block;
  text-align: center;
  text-decoration: none;
  padding: 15px;
  border-radius: 12px;
  border: 2px solid #667eea;
  background: transparent;
  color: #667eea;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-select:hover {
  background: #667eea;
  color: white;
}

.featured-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.featured-btn:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}

.faq-section {
  text-align: center;
}

.faq-section h2 {
  font-size: 2.5rem;
  margin-bottom: 50px;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  text-align: left;
}

.faq-item h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #2d3748;
}

.faq-item p {
  color: #718096;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .pricing-card.featured {
    transform: none;
  }
  .pricing-card.featured:hover {
    transform: translateY(-5px);
  }
  .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style>