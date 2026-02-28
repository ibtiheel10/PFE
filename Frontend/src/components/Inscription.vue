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
            Rejoignez la<br />
            révolution du recrutement
          </h1>

          <p>
            Dites adieu aux CV traditionnels. Évaluez les compétences réelles
            grâce à nos tests QCM objectifs et trouvez le candidat idéal.
          </p>

          <div class="stats">
            <div>
              <strong>10k+</strong>
              <span>Évaluations réussies</span>
            </div>
            <div>
              <strong>500+</strong>
              <span>Entreprises partenaires</span>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="right-panel">

          <!-- TABS -->
          <div class="tabs">
            <router-link to="/login" class="tab">Se connecter</router-link>
            <router-link to="/inscription" class="tab active">S'inscrire</router-link>
          </div>

          <h2>S'inscrire</h2>
          <p class="subtitle">
            Créez votre compte {{ selectedRole === 'entreprise' ? 'entreprise ' : '' }}pour commencer l'aventure Skillvia.
          </p>

          <!-- ROLE -->
          <div class="role">
            <button
              @click="selectedRole = 'candidat'"
              :class="['role-btn', { active: selectedRole === 'candidat' }]">
              <i class="fa-solid fa-user"></i>
              <span>CANDIDAT</span>
            </button>

            <button
              @click="selectedRole = 'entreprise'"
              :class="['role-btn', { active: selectedRole === 'entreprise' }]">
              <i class="fa-solid fa-building"></i>
              <span>ENTREPRISE</span>
            </button>
          </div>

          <!-- FORM -->
          <form>

            <label>{{ selectedRole === 'entreprise' ? "Nom de l'entreprise" : "Nom complet" }}</label>
            <input
              type="text"
              v-model="fullname"
              class="form-control"
              :placeholder="selectedRole === 'entreprise' ? 'Nom de l\'entreprise' : 'Jean Dupont'"
              required />

            <div v-if="selectedRole === 'entreprise'">
              <label>Secteur d'activité</label>
              <input
                type="text"
                v-model="sector"
                class="form-control"
                placeholder="Ex: Technologie, Finance, Santé"
                required />
            </div>

            <label>{{ selectedRole === 'entreprise' ? 'Adresse e-mail professionnelle' : 'Adresse e-mail' }}</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              :placeholder="selectedRole === 'entreprise' ? 'contact@votreentreprise.com' : 'jean@exemple.com'" />

            <p
              v-if="email"
              :class="['helper', isEmailValid ? 'valid' : 'error']">
              <i
                :class="isEmailValid
                  ? 'fa-solid fa-circle-check'
                  : 'fa-solid fa-circle-exclamation'"></i>
              <span>
                {{ emailValidationMessage }}
              </span>
            </p>

            <!-- PASSWORD -->
            <label>Mot de passe</label>
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

              <span class="eye" @click="togglePassword">
                <EyeIcon v-if="!showPassword" class="icon" />
                <EyeSlashIcon v-else class="icon" />
              </span>
            </div>

            <!-- Password Helper Text -->
            <div v-if="password" class="password-feedback">
                <p v-if="passwordError" class="helper error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span>{{ passwordError }}</span>
                </p>
                <p v-else class="helper valid">
                     <i class="fa-solid fa-circle-check"></i>
                </p>
            </div>

             <!-- CONFIRM PASSWORD -->
            <label>Confirmer le mot de passe</label>
            <div class="password-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                class="form-control"
                required
                :class="{
                  'input-error': confirmPassword && confirmPasswordError,
                   'input-valid': confirmPassword && !confirmPasswordError
                }"
                placeholder="Confirmer mot de passe"
              />

              <span class="eye" @click="toggleConfirmPassword">
                <EyeIcon v-if="!showConfirmPassword" class="icon" />
                <EyeSlashIcon v-else class="icon" />
              </span>
            </div>

            <p
               v-if="confirmPassword"
               :class="['helper', confirmPasswordError ? 'error' : 'valid']">
                <i :class="confirmPasswordError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'"></i>
                <span v-if="confirmPasswordError">{{ confirmPasswordError }}</span>
            </p>
            
            <div class="password-tools" style="margin-top: 12px;">
              <button type="button" class="generate-btn" @click="generateSecurePassword">
                <i class="fa-solid fa-key"></i> Suggérer un mot de passe sécurisé
              </button>
            </div>

            <!-- CONDITIONS -->
            <label class="checkbox-label">
              <input type="checkbox" v-model="acceptedTerms" />
              <span>
                J'accepte les
                <a href="#">Conditions d'Utilisation</a>
                et la
                <a href="#">Politique de confidentialité</a>.
              </span>
            </label>

            <!-- Messages API -->
            <div v-if="errorMessage" class="api-msg api-error">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>{{ errorMessage }}</span>
            </div>
            <div v-if="successMessage" class="api-msg api-success">
              <i class="fa-solid fa-circle-check"></i>
              <span>{{ successMessage }}</span>
            </div>

            <button
              class="login-btn"
              :disabled="!canSubmit"
              @click.prevent="handleSignup">
              <span v-if="isLoading"><i class="fa-solid fa-spinner fa-spin"></i> Création en cours...</span>
              <span v-else>Créer mon compte →</span>
            </button>
          </form>

          <div class="divider">
            <span>OU CONTINUER AVEC</span>
          </div>

          <div class="social">
            <button class="social-btn" type="button" @click="handleSocialLogin('Google')">
              <i class="fa-brands fa-google"></i>
              Google
            </button>
            <button class="social-btn" type="button" @click="handleSocialLogin('LinkedIn')">
              <i class="fa-brands fa-linkedin"></i>
              LinkedIn
            </button>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <footer class="footer">
        <a href="#">© 2026 Skillvia</a>
        <a href="#">Support</a>
        <a href="#">Sécurité</a>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
    import { ref, computed } from "vue";
    import { useRouter } from "vue-router";
    import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";
    import Navbar from './Navbar.vue';
    import { register } from '../services/authService';

    const router = useRouter();

    const selectedRole = ref<'candidat' | 'entreprise'>('candidat');

    const fullname = ref("");
    const sector = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const acceptedTerms = ref(false);

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    // ─── États de l'UI ────────────────────────────────────────────────────────
    const isLoading = ref(false);
    const errorMessage = ref<string | null>(null);
    const successMessage = ref<string | null>(null);

    const togglePassword = () => showPassword.value = !showPassword.value;
    const toggleConfirmPassword = () => showConfirmPassword.value = !showConfirmPassword.value;

    const generateSecurePassword = () => {
      const length = 12;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      let retVal = "";
      retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
      retVal += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
      retVal += "0123456789".charAt(Math.floor(Math.random() * 10));
      retVal += "!@#$%^&*".charAt(Math.floor(Math.random() * 8));
      for (let i = 0, n = charset.length; i < length - 4; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      password.value = retVal.split('').sort(function(){return 0.5-Math.random()}).join('');
      confirmPassword.value = password.value;
      showPassword.value = true;
      showConfirmPassword.value = true;
    };

    const handleSocialLogin = (provider: string) => {
      const width = 500, height = 600;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      const popup = window.open('', 'Social Login', `width=${width},height=${height},top=${top},left=${left}`);
      if (popup) {
        popup.document.write(`<html><head><title>Connexion avec ${provider}</title>
          <style>body{font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#0a0e1a;color:#e2e8f0;}
          .loader{border:4px solid rgba(255,255,255,0.1);border-top:4px solid #3b82f6;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;}
          @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style></head>
          <body><h2>Connexion avec ${provider}...</h2><div class="loader"></div></body></html>`);
        setTimeout(() => {
          popup.close();
          localStorage.setItem('userToken', 'mock-social-token-' + Date.now());
          localStorage.setItem('userRole', 'candidat');
          router.push('/dashboard');
        }, 2000);
      }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const professionalEmailRegex = /^[^\s@]+@(?!(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|live\.com|aol\.com))[^\s@]+\.[^\s@]+$/i;

    const isEmailValid = computed(() => {
      if (selectedRole.value === 'entreprise') return professionalEmailRegex.test(email.value);
      return emailRegex.test(email.value);
    });

    const emailValidationMessage = computed<string>(() => {
      if (selectedRole.value === 'entreprise') {
        return isEmailValid.value ? 'E-mail professionnel valide' : 'Veuillez utiliser un e-mail professionnel (ex: pas de Gmail, Yahoo)';
      }
      return isEmailValid.value ? 'Adresse e-mail valide' : 'Veuillez entrer une adresse e-mail valide.';
    });

    const passwordError = computed(() => {
      if (!password.value) return "Le mot de passe est obligatoire.";
      if (password.value.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
      if (!/[A-Z]/.test(password.value)) return "Le mot de passe doit contenir au moins une lettre majuscule.";
      if (!/[a-z]/.test(password.value)) return "Le mot de passe doit contenir au moins une lettre minuscule.";
      if (!/[0-9]/.test(password.value)) return "Le mot de passe doit contenir au moins un chiffre.";
      if (!/[^A-Za-z0-9]/.test(password.value)) return "Le mot de passe doit contenir au moins un caractère spécial (@, #, $, %, etc.).";
      return null;
    });

    const confirmPasswordError = computed(() => {
        if (!confirmPassword.value) return "Veuillez confirmer votre mot de passe.";
        if (confirmPassword.value !== password.value) return "Les mots de passe ne correspondent pas.";
        return null;
    });

    const isPasswordValid = computed(() => passwordError.value === null);

    const canSubmit = computed(() => {
      const isSectorValid = selectedRole.value === 'entreprise' ? sector.value.length > 2 : true;
      return (
        fullname.value.length > 2 &&
        isSectorValid &&
        isEmailValid.value &&
        isPasswordValid.value &&
        confirmPasswordError.value === null &&
        acceptedTerms.value &&
        !isLoading.value
      );
    });

    // ─── Inscription : appel API réel ─────────────────────────────────────────
    const handleSignup = async () => {
      if (!acceptedTerms.value) {
        errorMessage.value = "Veuillez accepter les conditions d'utilisation.";
        return;
      }

      errorMessage.value = null;
      successMessage.value = null;
      isLoading.value = true;

      try {
        // Adapter le rôle au format attendu par le backend ('Candidat' | 'Entreprise')
        const roleForApi = selectedRole.value === 'entreprise' ? 'Entreprise' : 'Candidat';

        await register({
          nom: fullname.value,
          email: email.value,
          password: password.value,
          role: roleForApi,
          ...(roleForApi === 'Candidat'
            ? { prenom: '' }
            : { secteur: sector.value }),
        });

        successMessage.value = `Compte créé avec succès pour ${fullname.value} ! Redirection vers la connexion...`;
        setTimeout(() => router.push('/login'), 2000);

      } catch (err: any) {
        if (!err.response) {
          errorMessage.value = "Erreur de connexion au serveur (CORS ou serveur hors ligne).";
        } else if (err.response.data?.errors) {
          // Gestion des erreurs de validation ou d'identité ASP.NET
          const errors = err.response.data.errors;
          if (Array.isArray(errors)) {
            errorMessage.value = errors.join(' ');
          } else if (typeof errors === 'object' && errors !== null) {
            const firstErrorKey = Object.keys(errors)[0];
            if (firstErrorKey) {
              const errArray = (errors as Record<string, string[]>)[firstErrorKey];
              errorMessage.value = (errArray && errArray.length > 0) ? (errArray[0] || "Données d'inscription invalides.") : "Données d'inscription invalides.";
            } else {
              errorMessage.value = "Données d'inscription invalides.";
            }
          } else {
            errorMessage.value = err.response.data?.title || "Données d'inscription invalides.";
          }
        } else {
          errorMessage.value = err.response.data?.message || err.response.data?.title || "Une erreur est survenue lors de la création du compte.";
        }
      } finally {
        isLoading.value = false;
      }
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

/* CARD */
/* CARD */
.login-card {
  width: 920px;
  display: flex;
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

/* LEFT PANEL */
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

.stats {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 20px;
  width: 100%;
  max-width: 320px;
  position: relative;
  z-index: 1;
}

.stats > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats strong {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 4px;
  display: block;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stats span {
  font-size: 12px;
  opacity: 0.7;
  font-weight: 500;
}

/* RIGHT PANEL */
.right-panel {
  width: 55%;
  padding: 30px 35px;
}

.right-panel h2 {
  color: #1e293b;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 3px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
}

/* TABS */
.tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 18px;
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
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.15));
  color: #93b4ff;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
}

/* ROLE */
.role {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
}

.role-btn {
  flex: 1;
  height: 75px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.role-btn i {
  font-size: 16px;
  color: #475569;
}

.role-btn.router-link-active,
.role-btn.router-link-exact-active,
.role-btn.active {
  border: 1px solid #93c5fd !important;
  color: #3b82f6 !important;
  background-color: #eff6ff !important;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.1);
}

.role-btn.router-link-active i,
.role-btn.router-link-exact-active i,
.role-btn.active i {
  color: #3b82f6 !important;
}

/* FORM */
form label {
  display: block;
  margin-top: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
}

.form-control {
  width: 100%;
  height: 40px;
  margin-top: 4px;
  padding: 9px 12px;
  font-size: 13px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  color: #0f172a;
  box-sizing: border-box;
  transition: all 0.25s ease;
  font-family: 'Inter', sans-serif;
}

.form-control::placeholder {
  color: #475569;
}

.form-control:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: #ffffff;
}

/* PASSWORD */
.password-wrapper {
  position: relative;
}

.password-wrapper .form-control {
  padding-right: 42px;
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
  transition: color 0.2s;
}

.eye:hover { color: #64748b; }

.icon {
  width: 18px;
  height: 18px;
}

/* HELPER */
.helper {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  margin-top: 5px;
}

.helper i { font-size: 12px; }
.helper.error { color: #f87171; }
.helper.valid { color: #34d399; }

.password-feedback {
  margin-top: 6px;
}

.input-error { border: 1.5px solid #f87171 !important; }
.input-error:focus { box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.15) !important; }
.input-valid { border: 1.5px solid #34d399 !important; }
.input-valid:focus { box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.15) !important; }

/* BUTTON */
.login-btn {
  width: 100%;
  height: 42px;
  margin-top: 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
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

/* API messages */
.api-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.api-error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.api-success {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}


.password-tools {
  display: flex;
  justify-content: flex-end;
}

.generate-btn {
  background: none;
  border: none;
  color: #60a5fa;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.generate-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #93b4ff;
}

/* DIVIDER & SOCIAL */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 16px 0;
  font-size: 11px;
  color: #475569;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}

.divider span {
  padding: 0 12px;
  white-space: nowrap;
}

.social {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.social-btn {
  flex: 1;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 12px;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
}

.social-btn i { font-size: 14px; }

.social-btn:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.08);
  color: #93b4ff;
}

.footer {
  margin-top: 30px;
  font-size: 12px;
  display: flex;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.footer a {
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}

.footer a:hover { color: #60a5fa; }

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  margin-top: 14px;
}

.checkbox-label input {
  width: 14px;
  height: 14px;
  accent-color: #3b82f6;
}

.checkbox-label a {
  font-weight: 600;
  color: #60a5fa;
  text-decoration: none;
}

.checkbox-label a:hover {
  color: #93b4ff;
}

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