<template>
  <div class="page-wrapper">

    <Navbar :hideActions="true" />


    <!-- PAGE -->
    <div class="login-page">
      
      <!-- Animated Background Shapes -->
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>

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
         <router-link to="/login-entreprise" class="tab active">Se connecter</router-link>
         <router-link to="/inscription-entreprise" class="tab">S'inscrire</router-link>
        </div>

          <h2>Ravi de vous revoir !</h2>
          <p class="subtitle">
            Veuillez entrer vos identifiants pour accéder à votre espace.
          </p>

          <p class="role-label">Vous êtes :</p>

    <div class="role">
        <router-link to="/login" class="role-btn">
        <i class="fa-solid fa-user"></i>
        <span>CANDIDAT</span>
       </router-link>

       <router-link to="/login-entreprise" class="role-btn active">
       <i class="fa-solid fa-building"></i>
       <span>ENTREPRISE</span>
       </router-link>
    </div>



          <form>
            <label>Adresse e-mail professionnelle</label>
            <input
            type="email"
            v-model="email"
            class="form-control"
            placeholder="contact@votreentreprise.com"
            @input="validateEmail"/>

            <p
            v-if="email"
            :class="['helper', isProfessionalEmail ? 'valid' : 'error']">
            <i
            :class="isProfessionalEmail 
            ? 'fa-solid fa-circle-check' 
            : 'fa-solid fa-circle-exclamation'"></i>
           <span>
             {{ isProfessionalEmail ? 'E-mail professionnel valide' : 'Veuillez utiliser un e-mail professionnel (pas Gmail, Yahoo, etc.)' }}
           </span>
           </p>


            <div class="password-row">
            <label>Mot de passe</label>
            <a href="#" class="forgot">Mot de passe oublié ?</a>
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
            :disabled="!canSubmit"
            @click.prevent="handleLogin">
            Se connecter
            </button>
          </form>

          <div class="divider">
          <span>OU CONTINUER AVEC</span>
          </div>


        <div class="social">
          <button class="social-btn">
          <i class="fa-brands fa-google"></i>
          Google
          </button>
          <button class="social-btn">
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
import Navbar from './Navbar.vue';

const router = useRouter();

const password = ref<string>("");
const showPassword = ref<boolean>(false);

const togglePassword = (): void => {
  showPassword.value = !showPassword.value;
};

const email = ref<string>("");

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const freeEmailProviders = ['gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr', 'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'icloud.com', 'aol.com', 'protonmail.com', 'ymail.com'];

    const isProfessionalEmail = computed((): boolean => {
      if (!emailRegex.test(email.value)) return false;
      const domain = email.value.split('@')[1]?.toLowerCase();
      return !!(domain && !freeEmailProviders.includes(domain));
    });

const validateEmail = (): void => {
  // déclenche juste le recalcul
};
    // Strict Password Validation for Enterprise Login
    const passwordError = computed(() => {
      if (!password.value) return "Le mot de passe est obligatoire.";
      if (password.value.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
      if (!/[A-Z]/.test(password.value)) return "Le mot de passe doit contenir au moins une lettre majuscule.";
      if (!/[a-z]/.test(password.value)) return "Le mot de passe doit contenir au moins une lettre minuscule.";
      if (!/[0-9]/.test(password.value)) return "Le mot de passe doit contenir au moins un chiffre.";
      if (!/[^A-Za-z0-9]/.test(password.value)) return "Le mot de passe doit contenir au moins un caractère spécial (@, #, $, %, etc.).";
      return null;
    });

    const canSubmit = computed(() => {
      return isProfessionalEmail.value && passwordError.value === null;
    });

    const handleLogin = () => {
        // Mock Login
        localStorage.setItem('userRole', 'recruiter');
        localStorage.setItem('userToken', 'mock-token-recruiter');
        // Redirect to Employer Dashboard
        router.push('/employer-dashboard');
    };

</script>


<style scoped>
.login-page {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  padding-top: 70px;
  padding-bottom: 30px;
}

/* Background Animations */
.bg-shape {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
  animation: moveBackground 20s infinite alternate;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: #1f5bff;
  top: -100px;
  left: -100px;
  animation-duration: 25s;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: #8b5cf6;
  bottom: -50px;
  right: -50px;
  animation-duration: 30s;
  animation-direction: alternate-reverse;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: #10b981;
  top: 40%;
  left: 60%;
  opacity: 0.2;
  animation-duration: 35s;
}

@keyframes moveBackground {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 50px) scale(1.1); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}


.login-card {
  width: 900px;
  min-height: 480px;
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: visible;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08); /* Softer shadow for light theme */
  border: 1px solid #e2e8f0; /* Border for contrast on white bg */
  margin-top: 20px;
  position: relative;
  z-index: 1; /* Ensure card is above background */
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
  height: 92px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
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

form input.form-control {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 15px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

form input.form-control:focus {
  border-color: #1f5bff;
  background: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(31, 91, 255, 0.1);
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
  margin-top: 30px;
  padding: 14px;
  background: #1f5bff;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(31, 91, 255, 0.2);
}

.login-btn:hover {
  background: #1e4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(31, 91, 255, 0.3);
}

.login-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.social {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.social-btn {
  flex: 1;
  height: 48px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 600;
  color: #4b5563;
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

.remember input {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.remember input:checked + .checkmark {
  background: #1f5bff;
  border-color: #1f5bff;
}

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
  padding-right: 45px;
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
  height: 44px;
  padding-right: 48px;
  box-sizing: border-box;
}

form input.form-control {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 15px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.password-wrapper .form-control {
  padding-right: 48px;
  height: 44px;
}

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

.helper i {
  font-size: 14px;
}

.helper.error {
  color: #ef4444;
}

.helper.valid {
  color: #22c55e;
}

.input-error {
  border: 1.5px solid #ef4444;
}

.input-error:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.3);
}

.input-valid {
  border: 1.5px solid #22c55e;
}

.input-valid:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
}

.helper.weak {
  color: #ef4444;
}

.helper.medium {
  color: #f59e0b;
}

.helper.strong {
  color: #22c55e;
}

.input-warning {
  border: 1.5px solid #f59e0b;
}

.input-warning:focus {
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.3);
}

.login-btn:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
  opacity: 0.8;
}

.login-btn:not(:disabled):hover {
  background: #1e4ed8;
}

</style>
