<template>
  <div class="page-wrapper">
    <Navbar :hideActions="true" />

    <div class="login-page">
      <!-- Dark Mesh BG -->
      <div class="mesh-bg"></div>
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>

      <!-- Particles -->
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
      <div class="particle particle-6"></div>

      <div class="login-card animate-in" style="--delay: 0.15s">

        <!-- LEFT PANEL -->
        <div class="left-panel">
          <div class="panel-bg-glow"></div>
          <div class="orbit-ring ring-1"></div>
          <div class="orbit-ring ring-2"></div>

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
              type="button"
              :disabled="!canSubmit"
              @click="handleLogin">
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
};
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
        localStorage.setItem('userRole', 'recruiter');
        localStorage.setItem('userToken', 'mock-token-recruiter');
        router.push('/employer-dashboard');
    };

</script>


<style scoped>
/* ==================== DARK THEME ==================== */
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #0c1222;
  margin: 0;
  padding: 0;
}

.login-page {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0c1222;
  padding-top: 70px;
  padding-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.mesh-bg {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(ellipse at 15% 30%, rgba(31, 91, 255, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 90%, rgba(16, 185, 129, 0.06) 0%, transparent 50%);
  z-index: 0;
}

/* ===== BACKGROUND ORBS ===== */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(31, 91, 255, 0.15) 0%, transparent 70%);
  top: -200px; left: -150px;
  animation: orbFloat 25s infinite alternate ease-in-out;
}

.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
  bottom: -150px; right: -100px;
  animation: orbFloat 30s infinite alternate-reverse ease-in-out;
}

.orb-3 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
  top: 50%; left: 50%;
  animation: orbFloat 35s infinite alternate ease-in-out;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 40px) scale(1.15); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}

@keyframes meshShift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(15deg); }
}

.particle {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  animation: particleFloat 18s infinite ease-in-out;
}

.particle-1 { width: 4px; height: 4px; background: rgba(99, 132, 255, 0.5); top: 15%; left: 20%; animation-delay: 0s; }
.particle-2 { width: 3px; height: 3px; background: rgba(139, 92, 246, 0.4); top: 30%; left: 75%; animation-delay: 2s; }
.particle-3 { width: 5px; height: 5px; background: rgba(59, 130, 246, 0.3); top: 65%; left: 15%; animation-delay: 4s; }
.particle-4 { width: 3px; height: 3px; background: rgba(16, 185, 129, 0.4); top: 80%; left: 65%; animation-delay: 6s; }
.particle-5 { width: 4px; height: 4px; background: rgba(99, 132, 255, 0.3); top: 45%; left: 45%; animation-delay: 1s; }
.particle-6 { width: 3px; height: 3px; background: rgba(139, 92, 246, 0.4); top: 90%; left: 35%; animation-delay: 3s; }

@keyframes particleFloat {
  0%, 100% { opacity: 0; transform: translateY(0) translateX(0); }
  10% { opacity: 1; }
  90% { opacity: 1; }
  50% { transform: translateY(-60px) translateX(20px); }
}

.animate-in {
  opacity: 0;
  transform: translateY(25px);
  animation: slideUp 0.7s ease forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Card */
.login-card {
  width: 920px;
  min-height: 480px;
  display: flex;
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: visible;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.left-panel {
  width: 45%;
  background: linear-gradient(135deg, #0c1a3a 0%, #0f0a2e 50%, #0a0e1a 100%);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: 20px 0 0 20px;
}

.panel-bg-glow {
  position: absolute;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  top: 20%;
  left: 20%;
  pointer-events: none;
}

.orbit-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid transparent;
  pointer-events: none;
}

.orbit-ring.ring-1 {
  width: 300px;
  height: 300px;
  border-top-color: rgba(59, 130, 246, 0.15);
  border-right-color: rgba(59, 130, 246, 0.05);
  top: -50px;
  right: -80px;
  animation: spin 12s linear infinite;
}

.orbit-ring.ring-2 {
  width: 200px;
  height: 200px;
  border-bottom-color: rgba(139, 92, 246, 0.12);
  border-left-color: rgba(139, 92, 246, 0.04);
  bottom: -30px;
  left: -40px;
  animation: spin 16s linear infinite reverse;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.left-panel h1 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.25;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #f1f5f9, #93b4ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.left-panel p {
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 30px;
  opacity: 0.7;
  max-width: 85%;
  position: relative;
  z-index: 1;
}

.left-panel ul {
  list-style: none;
  padding: 20px;
  text-align: left;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  width: 100%;
  max-width: 320px;
  position: relative;
  z-index: 1;
}

.left-panel li {
  margin-bottom: 14px;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.left-panel li:last-child { margin-bottom: 0; }

.left-panel li i {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-top: -1px;
}

.right-panel {
  width: 55%;
  padding: 35px 40px;
}

.right-panel h2 {
  color: #1e293b;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 22px;
}

.tab {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  display: block;
  transition: all 0.25s ease;
}

.tab.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1));
  color: #3b82f6;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.15);
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 18px;
}

.role-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #475569;
}

.role {
  display: flex;
  gap: 14px;
  margin-bottom: 20px;
}

.role-btn {
  flex: 1;
  height: 80px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
}

.role-btn i {
  font-size: 16px;
  color: #475569;
}

.role-btn.active {
  border-color: rgba(59, 130, 246, 0.4);
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.06);
}

.role-btn.active i {
  color: #3b82f6;
}

form label {
  display: block;
  margin-top: 14px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

form input.form-control {
  width: 100%;
  height: 42px;
  margin-top: 5px;
  padding: 10px 14px;
  font-size: 13px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  color: #0f172a;
  box-sizing: border-box;
  transition: all 0.25s ease;
  font-family: 'Inter', sans-serif;
}

form input.form-control::placeholder {
  color: #94a3b8;
}

form input.form-control:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: #ffffff;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.login-btn {
  width: 100%;
  margin-top: 18px;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.25);
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.login-btn:hover:not(:disabled)::before {
  transform: translateX(100%);
}

.login-btn:hover:not(:disabled) {
  box-shadow: 0 6px 25px rgba(59, 130, 246, 0.35);
  transform: translateY(-1px);
}

.login-btn:disabled {
  background: rgba(59, 130, 246, 0.2);
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
  box-shadow: none;
}

.social {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.social-btn {
  flex: 1;
  height: 42px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  color: #475569;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}

.social-btn i { font-size: 16px; }

.social-btn:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.08);
  color: #93b4ff;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  user-select: none;
}

.remember input { display: none; }

.checkmark {
  width: 16px;
  height: 16px;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.remember input:checked + .checkmark {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-color: transparent;
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

.remember input:checked + .checkmark::after { opacity: 1; }

.forgot {
  font-size: 12px;
  color: #60a5fa;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot:hover { color: #93b4ff; }

.password-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
}

.password-row label { margin: 0; }

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  font-size: 11px;
  color: #94a3b8;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
}

.divider span {
  padding: 0 12px;
  white-space: nowrap;
}

.password-wrapper {
  position: relative;
  margin-top: 5px;
}

.password-wrapper .form-control {
  padding-right: 45px;
}

.eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.eye:hover { color: #94a3b8; }

.icon {
  width: 18px;
  height: 18px;
}

.helper {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
  transition: all 0.25s ease;
}

.helper i { font-size: 13px; }
.helper.error { color: #f87171; }
.helper.valid { color: #34d399; }

.input-error { border: 1.5px solid #f87171 !important; }
.input-error:focus { box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.15) !important; }
.input-valid { border: 1.5px solid #34d399 !important; }
.input-valid:focus { box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.15) !important; }

.footer {
  margin-top: 40px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 12px;
  position: relative;
  z-index: 1;
}
.footer a {
  text-decoration: none;
  color: #475569;
  transition: color 0.2s;
}
.footer a:hover { color: #60a5fa; }

@media (max-width: 768px) {
  .login-card {
    width: 95%;
    flex-direction: column;
  }
  .left-panel, .right-panel {
    width: 100%;
  }
  .left-panel {
    border-radius: 20px 20px 0 0;
    padding: 30px;
  }
}
</style>
