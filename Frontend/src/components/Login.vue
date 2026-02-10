<template>
  <div class="page-wrapper">

    <header class="header">
  <div class="header-container">
    <div class="logo">
      <img src="../assets/logo-modern.png" alt="Skillvia" />
    </div>

    <div class="header-links">
      <router-link to="/support">Besoin d'aide ?</router-link>
      <router-link to="/contact" class="contact-btn">Contactez-nous</router-link>
    </div>
  </div>
</header>


    <!-- PAGE -->
    <div class="login-page">
      <div class="login-card">

        <!-- LEFT PANEL -->
        <div class="left-panel">
          <h1>
            L'embauche objective<br />
            par la compétence.
          </h1>

          <p>
            Rejoignez Skillvia et transformez votre processus de recrutement
            grâce à nos évaluations par QCM validées scientifiquement.
          </p>

          <ul class="features">
            <li><i class="fa-solid fa-circle-check"></i> Évaluations certifiées par des experts</li>
            <li><i class="fa-solid fa-brain"></i> Réduction des biais cognitifs de 70%</li>
            <li><i class="fa-solid fa-bolt"></i> Processus de recrutement 2x plus rapide</li>
          </ul>
        </div>

        <!-- RIGHT PANEL -->
        <div class="right-panel">
          <div class="tabs">
         <router-link to="/login" class="tab active">Se connecter</router-link>
         <router-link to="/inscription" class="tab">S'inscrire</router-link>
        </div>

          <h2>Ravi de vous revoir !</h2>
          <p class="subtitle">
            Veuillez entrer vos identifiants pour accéder à votre espace.
          </p>

          <p class="role-label">Vous êtes :</p>

    <div class="role">
        <router-link to="/login" class="role-btn active">
        <i class="fa-solid fa-user"></i>
        <span>CANDIDAT</span>
       </router-link>

       <router-link to="/login-entreprise" class="role-btn">
       <i class="fa-solid fa-building"></i>
       <span>ENTREPRISE</span>
       </router-link>
    </div>



          <form v-if="!showForgotPassword">
            <label>Adresse e-mail</label>
            <input
            type="email"
            v-model="email"
            class="form-control"
            placeholder="nom@exemple.com"
            @input="validateEmail"/>

            <p
            v-if="email"
            :class="['helper', isEmailValid ? 'valid' : 'error']">
            <i
            :class="isEmailValid 
            ? 'fa-solid fa-circle-check' 
            : 'fa-solid fa-circle-exclamation'"></i>
           <span>
             {{ isEmailValid ? 'Adresse e-mail valide' : 'Enter a valid email' }}
           </span>
           </p>


            <div class="password-row">
            <label>Mot de passe</label>
            <a href="#" class="forgot" @click.prevent="toggleForgotPassword">Mot de passe oublié ?</a>
            </div>

          <div class="password-wrapper">
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-control"
              autocomplete="new-password"
              required
              :class="{
                'input-error': password && passwordError,
                'input-valid': password && !passwordError
              }"
              placeholder="Mot de passe"
            />


            <span class="eye" @mousedown.prevent @click="togglePassword">
              <EyeSlashIcon v-if="!showPassword" class="icon" />
              <EyeIcon v-else class="icon" />
            </span>


         </div>
        <div v-if="password" class="password-feedback">
            <p v-if="passwordError" class="helper error">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>{{ passwordError }}</span>
            </p>
        </div>
            <div class="options">
              <label class="remember">
              <input type="checkbox" />
              <span class="checkmark"></span>
               Rester connecté
              </label>

            </div>
            <button
            class="login-btn"
            type="button"
            :disabled="!canSubmit"
            @click="handleLogin">
            Se connecter
            </button>
          </form>

          <!-- FORGOT PASSWORD FORM -->
          <form v-else @submit.prevent="handleResetPassword">
            <h3>Récupération de mot de passe</h3>
            <p class="subtitle" style="margin-bottom: 20px;">
              Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
            </p>
            
            <label>Adresse e-mail</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              placeholder="nom@exemple.com"
              required
            />
            
            <button class="login-btn" type="submit" :disabled="!isEmailValid">
              Envoyer le lien
            </button>
            
            <div style="text-align: center; margin-top: 15px;">
              <a href="#" class="forgot" @click.prevent="toggleForgotPassword">
                <i class="fa-solid fa-arrow-left"></i> Retour à la connexion
              </a>
            </div>
          </form>

          <div class="divider">
          <span>OU CONTINUER AVEC</span>
          </div>


        <div class="social">
          <button class="social-btn" @click="handleSocialLogin('Google')">
          <i class="fa-brands fa-google"></i>
          Google
          </button>
          <button class="social-btn" @click="handleSocialLogin('LinkedIn')">
          <i class="fa-brands fa-linkedin"></i>
          LinkedIn
          </button>
        </div>

        </div>

      </div>
      <footer class="footer">
  <a href="#">Conditions d'utilisation</a>
  <a href="#">Politique de confidentialité</a>
  <a href="#">Mentions légales</a>
  <a href="#">@2026 Skillvia. Tous droits réservés</a>
</footer>
    </div>
    


  </div>
</template>


<script setup lang="ts">
import { ref,computed } from "vue";
import { useRouter } from "vue-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";

const router = useRouter();

const password = ref<string>("");
const showPassword = ref<boolean>(false);

const togglePassword = (): void => {
  showPassword.value = !showPassword.value;
};

const showForgotPassword = ref(false);
const toggleForgotPassword = () => {
    showForgotPassword.value = !showForgotPassword.value;
};

const handleResetPassword = () => {
    alert(`Un lien de réinitialisation a été envoyé à ${email.value}`);
    showForgotPassword.value = false;
};

const handleSocialLogin = (provider: string) => {
    // Open a popup to simulate OAuth
    const width = 500;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    const popup = window.open(
    '',
    'Social Login',
    `width=${width},height=${height},top=${top},left=${left}`
    );

    if (popup) {
    popup.document.write(`
        <html>
        <head>
            <title>Connexion avec ${provider}</title>
            <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f4f6fb; }
            .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            h2 { color: #333; }
            </style>
        </head>
        <body>
            <h2>Connexion avec ${provider}...</h2>
            <div class="loader"></div>
            <p>Veuillez patienter pendant l'authentification.</p>
        </body>
        </html>
    `);

    // Close after 2 seconds and verify
    setTimeout(() => {
        popup.close();
        // Simulate successful login
        localStorage.setItem('user_token', 'mock-social-token-' + Date.now());
        localStorage.setItem('user_info', JSON.stringify({ name: 'User ' + provider, role: 'candidat' }));
        
        alert(`Authentification avec ${provider} réussie !`);
        router.push('/dashboard-candidat'); // Redirect to "Dashboard" (JobBoard)
    }, 2000);
    }
};

const email = ref<string>("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Strict Password Validation for Login (as requested)
    const passwordError = computed(() => {
      if (!password.value) return "Le mot de passe est obligatoire.";
      // While unusual for login, user requested these specific messages for "login or signup"
      if (password.value.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
      if (!/[A-Z]/.test(password.value)) return "Le mot de passe doit contenir au moins une lettre majuscule.";
      if (!/[a-z]/.test(password.value)) return "Le mot de passe doit contenir au moins une lettre minuscule.";
      if (!/[0-9]/.test(password.value)) return "Le mot de passe doit contenir au moins un chiffre.";
      if (!/[^A-Za-z0-9]/.test(password.value)) return "Le mot de passe doit contenir au moins un caractère spécial (@, #, $, %, etc.).";
      return null;
    });

    const isEmailValid = computed<boolean>(() => {
      return emailRegex.test(email.value);
    });
    
    const validateEmail = (): void => {
      // déclenche juste le recalcul
    };

    const canSubmit = computed(() => {
      // For login, we now enforce the strict rules as well per user request, 
      // or at least that it has no errors if we are showing them.
      return isEmailValid.value && passwordError.value === null;
    });
    
    const handleLogin = () => {
        // Mock Login
        localStorage.setItem('user_token', 'mock-login-token-' + Date.now());
        localStorage.setItem('user_info', JSON.stringify({ name: email.value, role: 'candidat' }));
        router.push('/dashboard-candidat');
    };

</script>


<style scoped>
.login-page {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f4f6fb;
  padding-top: 70px;
  padding-bottom: 30px;
}


.login-card {
  width: 900px;
  min-height: 480px;
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: visible;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-top: 20px;
}


/* LEFT PANEL */
.left-panel {
  width: 45%;
  background: linear-gradient(135deg, #1f5bff 0%, #2563eb 100%);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Decorative background shapes */
.left-panel::before {
  content: '';
  position: absolute;
  top: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  pointer-events: none;
}

.left-panel::after {
  content: '';
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  pointer-events: none;
}

.left-panel h1 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
}

.left-panel p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 85%;
  position: relative;
  z-index: 1;
}

.left-panel ul {
  list-style: none;
  padding: 24px;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.left-panel li {
  margin-bottom: 16px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-weight: 500;
}

.left-panel li:last-child {
  margin-bottom: 0;
}

.left-panel li i {
  background: white;
  color: #1f5bff;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-top: -2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* RIGHT */
.right-panel {
  width: 55%;
  padding: 40px;
}

.tabs {
  display: flex;
  background: #f4f6fb;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 24px;
}

.tab {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #555;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  display: block;
  transition: all 0.2s ease;
}

.tab.active {
  background: white;
  color: #1f5bff;
  box-shadow: 0 2px 6px rgba(31, 91, 255, 0.3);
}


.subtitle {
  font-size: 13px;
  color: gray;
  margin-bottom: 20px;

}
.role-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.role {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.role-btn {
  flex: 1;
  height: 92px; /* plus haut comme l'image */
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column; /* icône AU-DESSUS */
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.role-btn i {
  font-size: 18px;
  color: #9ca3af;
}

/* bouton actif (comme l'image) */
.role-btn.active {
  border-color: #1f5bff;
  color: #1f5bff;
  background: #f5f8ff;
}

.role-btn.active i {
  color: #1f5bff;
}

.role .selected {
  border-color: #1f5bff;
  color: #1f5bff;
  font-weight: bold;
}

form label {
  display: block;
  margin-top: 15px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}

form input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
}

.options a {
  color: #1f5bff;
  text-decoration: none;
}

.login-btn {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: #1f5bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.social {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.social-btn {
  flex: 1;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn i {
  font-size: 16px;
}

.social-btn:hover {
  border-color: #1f5bff;
  background: #f5f8ff;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 15px rgba(0,0,0,0.04);
  z-index: 100;
  border-bottom: 1px solid rgba(0,0,0,0.03);
  transition: all 0.3s ease;
}

.header-container {
  max-width: 1200px;
  margin: auto;
  height: 80px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  width: 140px;
  display: block;
}

.header-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-links a {
  font-size: 14px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;
}

.header-links a:hover {
  color: #1f5bff;
}

.header-links .contact-btn {
  color: white;
  background: #1f5bff;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(31, 91, 255, 0.2);
  transition: all 0.2s ease;
}

.header-links .contact-btn:hover {
  background: #1e4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -1px rgba(31, 91, 255, 0.3);
  color: white;
}

.features li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.features i {
  background: rgba(255,255,255,0.2);
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
}
/* CHECKBOX PERSONNALISÉ */
.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #4B5563;
  user-select: none;
}

/* cacher le checkbox par défaut */
.remember input {
  display: none;
}

/* case personnalisée */
.checkmark {
  width: 16px;
  height: 16px;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

/* quand coché */
.remember input:checked + .checkmark {
  background: #1f5bff;
  border-color: #1f5bff;
}

/* ✓ */
.checkmark::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
}

/* afficher le ✓ */
.remember input:checked + .checkmark::after {
  opacity: 1;
}
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}
.footer {
  margin-top: 40px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 12px;
  color: #888;
}
.footer a {
  text-decoration: none;
  color: #888;
}

.footer a:hover {
  color: #1f5bff;
}
.password-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.password-row label {
  margin: 0;
  font-size: 13px;
}

.forgot {
  font-size: 12px;
  color: #1f5bff;
  text-decoration: none;
}

.forgot:hover {
  color: #1e4ed8;
}
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  font-size: 12px;
  color: #9ca3af;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  padding: 0 12px;
  white-space: nowrap;
}
.password-wrapper {
  position: relative;
}

.password-wrapper .form-control {
  padding-right: 45px; /* espace pour l’icône */
}

.eye {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.icon {
  width: 20px;
  height: 20px;
}

.eye:hover {
  color: #000;
}

/* optionnel : aligner label + lien */
.password-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.forgot {
  font-size: 0.85rem;
}
.password-wrapper {
  position: relative;
  margin-top: 5px;
}

.password-wrapper .form-control {
  height: 44px;              /* ⭐ hauteur fixe */
  padding-right: 48px;       /* ⭐ espace pour l’icône */
  box-sizing: border-box;
}
/* S'assurer que tous les inputs du formulaire ont la même largeur et box-sizing */
form input.form-control {
  width: 100%;           /* occupe tout l'espace disponible */
  box-sizing: border-box; /* inclut padding et border dans la largeur */
  height: 44px;           /* même hauteur que le password */
  padding: 10px;          /* padding uniforme */
  border-radius: 6px;
  border: 1px solid #ddd;
}

/* Pour le champ mot de passe avec l'icône */
.password-wrapper .form-control {
  padding-right: 48px;   /* espace pour l'icône */
  height: 44px;          /* même hauteur que email */
}
/* Helper texte */
/* Helper texte email */
.helper {
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 13px;
  font-weight: 500;
  margin-top: 6px;

  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  transition: all 0.25s ease;
}

/* Icône */
.helper i {
  font-size: 14px;
}

/* Email invalide */
.helper.error {
  color: #ef4444; /* rouge doux */
}

/* Email valide */
.helper.valid {
  color: #22c55e; /* vert doux */
}
/* Input invalide */
.input-error {
  border: 1.5px solid #ef4444;
}

.input-error:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.3);
}

/* Input valide */
.input-valid {
  border: 1.5px solid #22c55e;
}

.input-valid:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
}

/* Password states */
.helper.weak {
  color: #ef4444; /* rouge */
}

.helper.medium {
  color: #f59e0b; /* orange */
}

.helper.strong {
  color: #22c55e; /* vert */
}

/* Input states */
.input-warning {
  border: 1.5px solid #f59e0b;
}

.input-warning:focus {
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.3);
}
/* Bouton désactivé */
.login-btn:disabled {
  background: #c7d2fe; /* bleu très clair */
  cursor: not-allowed;
  opacity: 0.8;
}

/* Optionnel : hover uniquement quand actif */
.login-btn:not(:disabled):hover {
  background: #1e4ed8;
}

</style>
