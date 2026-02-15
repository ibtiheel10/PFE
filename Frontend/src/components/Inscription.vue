<template>
  <div class="page-wrapper">

    <!-- HEADER (inchangé) -->
    <Navbar :hideActions="true" />

    <!-- PAGE -->
    <div class="login-page">
      
      <!-- Animated Background Shapes -->
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>

      <div class="login-card">

        <!-- LEFT PANEL (texte image) -->
        <div class="left-panel">
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
            Créez votre compte pour commencer l'aventure Skillvia.
          </p>

          <!-- ROLE -->
          <div class="role">
            <router-link
              to="/inscription"
              class="role-btn active">
              <i class="fa-solid fa-user"></i>
              <span>CANDIDAT</span>
            </router-link>

            <router-link
              to="/inscription-entreprise"
              class="role-btn">
              <i class="fa-solid fa-building"></i>
              <span>ENTREPRISE</span>
            </router-link>
          </div>

          <!-- FORM -->
          <form>

            <label>Nom complet</label>
            <input
              type="text"
              v-model="fullname"
              class="form-control"
              placeholder="Jean Dupont"
              required />

            <label>Adresse e-mail</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              placeholder="jean@exemple.com" />

            <p
              v-if="email"
              :class="['helper', isEmailValid ? 'valid' : 'error']">
              <i
                :class="isEmailValid
                  ? 'fa-solid fa-circle-check'
                  : 'fa-solid fa-circle-exclamation'"></i>
              <span>
                {{ isEmailValid ? 'Adresse e-mail valide' : 'Adresse e-mail invalide' }}
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
            
            <div class="password-tools" style="margin-top: 15px;">
              <button type="button" class="generate-btn" @click="generateSecurePassword">
                <i class="fa-solid fa-key"></i> Suggérer un mot de passe sécurisé
              </button>
            </div>

            <!-- CONDITIONS -->
            <label class="checkbox-label">
              <input type="checkbox" v-model="acceptedTerms" />
              <span>
                J’accepte les
                <a href="#">Conditions d’Utilisation</a>
                et la
                <a href="#">Politique de confidentialité</a>.
              </span>
            </label>

            <button
              class="login-btn"
              :disabled="!canSubmit"
              @click.prevent="handleSignup">
              Créer mon compte →
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
    
    // const role = ref<'candidat' | 'entreprise'>('candidat'); // Unused
    const router = useRouter();
    
    const fullname = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const acceptedTerms = ref(false);
    
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    
    const togglePassword = () => showPassword.value = !showPassword.value;
    const toggleConfirmPassword = () => showConfirmPassword.value = !showConfirmPassword.value;

    const generateSecurePassword = () => {
      const length = 12;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      let retVal = "";
      
      // Ensure at least one of each required type
      retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
      retVal += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
      retVal += "0123456789".charAt(Math.floor(Math.random() * 10));
      retVal += "!@#$%^&*".charAt(Math.floor(Math.random() * 8));

      for (let i = 0, n = charset.length; i < length - 4; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      
      // Shuffle the password
      password.value = retVal.split('').sort(function(){return 0.5-Math.random()}).join('');
      confirmPassword.value = password.value;
      // Show password so user can save it
      showPassword.value = true;
      showConfirmPassword.value = true;
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
          router.push('/jobs'); // Redirect to "Dashboard" (JobBoard)
        }, 2000);
      }
    };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = computed(() => emailRegex.test(email.value));
    
    // Strict Password Validation
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
    
    // Kept for canSubmit check
    const isPasswordValid = computed(() => passwordError.value === null);
    
    const canSubmit = computed(() => {
      // Button validates if: Name OK, Email OK, Password Valid (No Error), Confirmation Valid, Terms ACCEPTED
      return (
        fullname.value.length > 2 &&
        isEmailValid.value &&
        isPasswordValid.value &&
        confirmPasswordError.value === null &&
        acceptedTerms.value
      );
    });

    const handleSignup = () => {
      if (!acceptedTerms.value) {
        alert("Veuillez accepter les conditions d'utilisation.");
        return;
      }
      // Mock Success
      localStorage.setItem('user_token', 'mock-signup-token-' + Date.now());
      localStorage.setItem('user_info', JSON.stringify({ name: fullname.value, role: 'candidat' }));

      alert(`Compte créé avec succès pour ${fullname.value} !`);
      router.push('/login');
    };
    </script>
<style scoped>
/* ===============================
   GLOBAL
================================ */
/* ===============================
   GLOBAL
================================ */
/* * { remove global wildcard to prevent icon font override } */

.login-page {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff; /* Light background */
  padding-top: 70px;
  padding-bottom: 30px;
  position: relative;
  overflow: hidden;
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

/* ===============================
   CARD
================================ */
.login-card {
  width: 900px;
  display: flex;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08); /* Softer shadow for light theme */
  border: 1px solid #e2e8f0; /* Border for contrast on white bg */
  margin-top: 20px;
  position: relative;
  z-index: 1; /* Ensure card is above background */
}

/* ===============================
   LEFT PANEL
================================ */
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

.stats {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.stats > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats strong {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
  display: block;
}

.stats span {
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
}

/* ===============================
   RIGHT PANEL
================================ */
.right-panel {
  width: 55%;
  padding: 40px;
}

.subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 20px;
}

/* ===============================
   TABS
================================ */
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
  background: #fff;
  color: #1f5bff;
  box-shadow: 0 2px 6px rgba(31,91,255,0.3);
}

/* ===============================
   ROLE
================================ */
.role {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.role-btn {
  flex: 1;
  height: 92px;
  border: 2px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
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

/* ===============================
   FORM
================================ */
form label {
  display: block;
  margin-top: 14px;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
}

.form-control {
  width: 100%;
  height: 44px;
  margin-top: 6px;
  padding: 10px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
}

/* ===============================
   PASSWORD
================================ */
.password-wrapper {
  position: relative;
}

.password-wrapper .form-control {
  padding-right: 48px;
}

.eye {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6b7280;
}

.icon {
  width: 20px;
  height: 20px;
}

/* ===============================
   HELPER EMAIL
================================ */
.helper {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
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

/* ===============================
   DETAILED PASSWORD FEEDBACK
================================ */
.password-feedback {
  margin-top: 10px;
}

.strength-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.strength-text.weak { color: #ef4444; }
.strength-text.medium { color: #f59e0b; }
.strength-text.strong { color: #22c55e; }

.missing-criteria {
  list-style: none;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.missing-criteria li {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.missing-criteria li:last-child {
  margin-bottom: 0;
}

.missing-criteria li.met {
  color: #22c55e;
  font-weight: 600;
}

.missing-criteria li i {
  font-size: 8px;
}

.missing-criteria li.met i {
  font-size: 10px;
}

/* ===============================
   CONDITIONS
================================ */

/* ===============================
   BUTTON
================================ */
.login-btn {
  width: 100%;
  height: 46px;
  margin-top: 20px;
  background: #1f5bff;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.login-btn:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
}

/* ===============================
   SWITCH AUTH
================================ */
.switch-auth {
  margin-top: 18px;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  text-align: center;
}

.switch-auth a {
  color: #1f5bff;
  text-decoration: none;
  font-weight: 700;
}

/* ===============================
  box-shadow: 0 6px 10px -1px rgba(31, 91, 255, 0.3);
  color: white;
}

/* ===============================
   PASSWORD TOOLS
================================ */
.password-tools {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  margin-bottom: 8px;
}

.generate-btn {
  background: none;
  border: none;
  color: #1f5bff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.generate-btn:hover {
  background: #eff6ff;
  color: #1e40af;
}

/* ===============================
   DIVIDER & SOCIAL
================================ */
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

.social {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
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
  font-size: 13px;
  color: #374151;
}

.social-btn i {
  font-size: 16px;
}

.social-btn:hover {
  border-color: #1f5bff;
  background: #f5f8ff;
  color: #1f5bff;
}

.footer {
  margin-top: 40px;
  font-size: 12px;
  color: #888;
  display: flex;
  gap: 20px;
}

.footer a {
  color: #888;
  text-decoration: none;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px; /* espace checkbox ↔ texte */
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 600;        /* comme l’image */
  color: #4B5563;          /* gris exact */
  cursor: pointer;
}

.checkbox-label input {
  width: 14px;
  height: 14px;
  accent-color: #2563eb;   /* bleu propre */
}

.checkbox-label a {
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.checkbox-label a:hover {
  color: #1e40af;
}

/* ===============================
   PASSWORD VALIDATION STATES
================================ */
/* Input error state */
.input-error {
  border: 1.5px solid #ef4444;
}

.input-error:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.3);
}

/* Input warning state */
.input-warning {
  border: 1.5px solid #f59e0b;
}

.input-warning:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.3);
}

/* Input valid state */
.input-valid {
  border: 1.5px solid #22c55e;
}

.input-valid:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
}

/* Password strength helper text */
.helper.weak {
  color: #ef4444; /* rouge */
}

.helper.medium {
  color: #f59e0b; /* orange */
}

.helper.strong {
  color: #22c55e; /* vert */
}

</style>