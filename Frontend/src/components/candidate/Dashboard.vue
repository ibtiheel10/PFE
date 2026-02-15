<template>
    <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
            
            <div class="relative z-10 max-w-2xl">
                <h2 class="text-3xl font-bold mb-2">Bon retour, Alexandre </h2>
                <p class="text-blue-100 text-lg mb-6">Maximisez vos chances de réussite aujourd'hui. Consultez l'état de vos candidatures et préparez vos prochains défis.</p>
                <div class="flex gap-4">
                    <button @click="goToJobs" class="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition shadow-sm">
                        Explorer les offres
                    </button>

                </div>
            </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Column (2/3) -->
            <div class="lg:col-span-2 space-y-8">
                
                <!-- Applications en cours -->
                <section>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-800">Candidatures récentes</h3>
                        <button @click="goToJobs" class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Voir tout</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <!-- Card 1 -->
                        <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group" @click="openApplication('Product Designer')">
                            <div class="flex justify-between items-start mb-4">
                                <div class="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                    <!-- Logo Placeholder -->
                                    <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                                </div>
                                <span class="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md text-xs font-bold border border-orange-100">Test Technique</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Product Designer</h4>
                                <p class="text-sm text-gray-500 mb-4">Tech Solutions SA • Paris</p>
                                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <span class="text-xs text-gray-400 font-medium">Mis à jour il y a 2j</span>
                                    <button @click.stop="startTest" class="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Continuer</button>
                                </div>
                            </div>
                        </div>

                        <!-- Card 2 -->
                        <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group" @click="openApplication('Fullstack Developer')">
                            <div class="flex justify-between items-start mb-4">
                                <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                    <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                </div>
                                <span class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100">Entretien RH</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Fullstack Developer</h4>
                                <p class="text-sm text-gray-500 mb-4">Innovate Corp • Remote</p>
                                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <span class="text-xs text-gray-400 font-medium">Demain à 14:00</span>
                                    <button @click.stop="openDetails" class="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">Détails</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills Analysis Chart - Large Animated Bar Chart -->
                <section class="skills-analysis-card">
                    <div class="chart-header">
                        <div>
                            <h3 class="chart-title">Analyse des compétences</h3>
                            <p class="chart-subtitle">Janvier - Juin 2024</p>
                        </div>
                        <div class="time-selector">
                            <button 
                                @click="selectedRange = '6months'" 
                                :class="['time-btn', { active: selectedRange === '6months' }]"
                            >
                                6 Mois
                            </button>
                            <button 
                                @click="selectedRange = '1year'" 
                                :class="['time-btn', { active: selectedRange === '1year' }]"
                            >
                                1 An
                            </button>
                        </div>
                    </div>
                   
                    <div class="bar-chart-container">
                        <div class="bars-wrapper">
                            <div v-for="(data, index) in currentChartData" :key="index" class="bar-group">
                                <div class="bars-pair">
                                    <div class="bar bar-1" :style="{ '--bar-height': data.score1 + '%', '--animation-delay': (index * 0.1) + 's' }">
                                        <div class="bar-tooltip">{{ data.score1 }}%</div>
                                    </div>
                                    <div class="bar bar-2" :style="{ '--bar-height': data.score2 + '%', '--animation-delay': (index * 0.1 + 0.1) + 's' }">
                                        <div class="bar-tooltip">{{ data.score2 }}%</div>
                                    </div>
                                </div>
                                <span class="month-label">{{ data.label }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Statistics Footer -->
                    <div class="chart-footer">
                        <div class="trend-indicator">
                            <i class="fa-solid fa-arrow-trend-up"></i>
                            <span class="trend-text">Progression de <strong>{{ selectedRange === '6months' ? '5.2%' : '12.8%' }}</strong> cette période</span>
                        </div>
                        <div class="date-range">Affichage des {{ selectedRange === '6months' ? '6 derniers mois' : '12 derniers mois' }}</div>
                    </div>
                </section>
            </div>

            <!-- Right Column (1/3) -->
            <div class="space-y-8">
                
                <!-- Suggestions -->
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="p-5 border-b border-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-900">Suggestions pour vous</h3>
                        <BoltIcon class="w-5 h-5 text-yellow-500" />
                    </div>
                    <div class="divide-y divide-gray-50">
                        <div class="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="font-bold text-sm text-gray-800 group-hover:text-blue-600">Développeur Frontend Senior</h4>
                            </div>
                            <p class="text-xs text-gray-500 mb-3">NextGen Solutions • Paris</p>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">React</span>
                                <span class="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">TypeScript</span>
                            </div>
                        </div>
                        <div class="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="font-bold text-sm text-gray-800 group-hover:text-blue-600">Architecte UX</h4>
                            </div>
                            <p class="text-xs text-gray-500 mb-3">Global Design Studio • Lyon</p>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Figma</span>
                                <span class="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Recherche Utilisateur</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 bg-gray-50 text-center">
                        <button @click="goToJobs" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide">Voir tout</button>
                    </div>
                </div>

                <!-- Recent Results -->
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div class="p-5 border-b border-gray-50">
                        <h3 class="font-bold text-gray-900">Derniers Résultats</h3>
                    </div>
                    <div class="p-2">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th class="text-[10px] uppercase text-gray-400 font-bold p-3">Test</th>
                                    <th class="text-[10px] uppercase text-gray-400 font-bold p-3 text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="result in results" :key="result.name" class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td class="p-3">
                                        <div class="text-sm font-semibold text-gray-700">{{ result.name }}</div>
                                        <div class="text-[11px] text-gray-400">{{ result.date }}</div>
                                    </td>
                                    <td class="p-3 text-right">
                                        <span class="font-bold text-sm" :class="getScoreColor(result.score)">{{ result.score }}%</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { BoltIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

// Chart Logic
const selectedRange = ref('6months');

const chartData6Months = [
    { label: 'Jan', score1: 65, score2: 55 },
    { label: 'Fév', score1: 85, score2: 72 },
    { label: 'Mar', score1: 78, score2: 68 },
    { label: 'Avr', score1: 50, score2: 62 },
    { label: 'Mai', score1: 75, score2: 58 },
    { label: 'Juin', score1: 82, score2: 70 }
];

const chartData1Year = [
    { label: 'J', score1: 45, score2: 40 },
    { label: 'F', score1: 55, score2: 50 },
    { label: 'M', score1: 60, score2: 55 },
    { label: 'A', score1: 65, score2: 60 },
    { label: 'M', score1: 70, score2: 65 },
    { label: 'J', score1: 75, score2: 70 },
    { label: 'J', score1: 80, score2: 75 },
    { label: 'A', score1: 85, score2: 80 },
    { label: 'S', score1: 82, score2: 78 },
    { label: 'O', score1: 78, score2: 74 },
    { label: 'N', score1: 84, score2: 80 },
    { label: 'D', score1: 88, score2: 84 }
];

const currentChartData = computed(() => {
    return selectedRange.value === '6months' ? chartData6Months : chartData1Year;
});

const results = [
    { name: 'JavaScript Advanced', date: '12 Oct 2023', score: 92 },
    { name: 'React Hooks', date: '08 Oct 2023', score: 88 },
    { name: 'UI Design Systems', date: '25 Sep 2023', score: 74 },
];

const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    return 'text-orange-500';
};

const goToJobs = () => {
    router.push('/candidat/jobs');
};

const openApplication = (title: string) => {
    alert('Ouverture de la candidature: ' + title);
};

const startTest = () => {
    alert('Redirection vers le module de test...');
};

const openDetails = () => {
    alert('Affichage des détails du rendez-vous');
};
</script>

<style scoped>
/* Skills Analysis Card */
.skills-analysis-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.skills-analysis-card:hover {
  box-shadow: 0 10px 40px rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.2);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.time-selector {
  display: flex;
  gap: 0.5rem;
  background: #F3F4F6;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.time-btn {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.3s;
}

.time-btn.active {
  background: white;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.time-btn:hover:not(.active) {
  color: #111827;
}

/* Bar Chart Container */
.bar-chart-container {
  position: relative;
  width: 100%;
  height: 350px;
  padding: 1rem 0;
}

.bars-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
  gap: 1rem;
}

.bar-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  height: 100%;
}

.bars-pair {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  height: 100%;
  width: 100%;
}

.bar {
  width: 18px;
  border-radius: 4px 4px 0 0;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--bar-height);
  animation: barGrow 1s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: var(--animation-delay);
}

.bar-1 {
  background-color: #93c5fd;
  box-shadow: 0 2px 4px rgba(147, 197, 253, 0.2);
}

.bar-1:hover {
  background-color: #60a5fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(147, 197, 253, 0.4);
}

.bar-2 {
  background-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.bar-2:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.bar-tooltip {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #1F2937;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  white-space: nowrap;
  z-index: 10;
}

.bar:hover .bar-tooltip {
  opacity: 1;
}

.month-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9CA3AF;
  text-align: center;
}

@keyframes barGrow {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--bar-height);
    opacity: 1;
  }
}

/* Footer Styles */
.chart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #F3F4F6;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10B981;
}

.trend-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.trend-text strong {
  color: #10B981;
  font-weight: 700;
}

.date-range {
  font-size: 0.75rem;
  color: #9CA3AF;
  font-weight: 500;
}
</style>
