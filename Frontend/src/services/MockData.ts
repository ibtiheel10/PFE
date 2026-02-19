import { reactive } from 'vue';

export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    category: 'IT' | 'MARKETING' | 'FINANCE' | 'HR';
    salary: string;
    description: {
        intro: string;
        mission: string;
        responsibilities: string[];
    };
    skills: string[];
    icon: string;
    iconColor: string;
    postedTime: string;
    tags: string[];
    daysLeft?: number;
    mcqDuration: number;
    mcqQuestionsCount: number;
    mcqPassScore: number;
    testDate?: string;
    testTime?: string;
}

export interface Application {
    id: number;
    jobId: number;
    candidateName: string;
    status: 'Pending' | 'Interview' | 'Rejected' | 'Accepted';
    date: string;
    score?: number;
}

export const MockData = reactive({
    jobs: [
        {
            id: 1,
            title: 'Développeur Fullstack Senior',
            company: 'TechCorp',
            location: 'Paris, FR (Télétravail)',
            category: 'IT',
            description: {
                intro: 'Rejoignez notre équipe plateforme pour construire des API évolutives.',
                mission: 'Architecturer et construire des applications web modernes.',
                responsibilities: ['Développer des frontends Vue.js', 'Concevoir des API Node.js', 'Mentorer les juniors']
            },
            skills: ['Vue.js', 'Node.js', 'TypeScript', 'AWS'],
            icon: 'fa-solid fa-code',
            iconColor: '#3b82f6',
            postedTime: 'Il y a 2 jours',
            tags: ['TEMPS PLEIN', 'TÉLÉTRAVAIL'],
            daysLeft: 2,
            mcqDuration: 25,
            mcqQuestionsCount: 20,
            mcqPassScore: 70,
            testDate: '15 Fév 2026',
            testTime: '14:00'
        },
        {
            id: 2,
            title: 'Spécialiste Contenu Marketing',
            company: 'Innovate Solutions',
            location: 'Berlin, DE',
            category: 'MARKETING',
            description: {
                intro: 'Améliorez notre présence de marque grâce à un storytelling captivant.',
                mission: 'Créer du contenu engageant pour des campagnes mondiales.',
                responsibilities: ['Rédiger des articles de blog', 'Gérer les réseaux sociaux', 'Analyser les métriques SEO']
            },
            skills: ['Copywriting', 'SEO', 'Réseaux Sociaux', 'Google Analytics'],
            icon: 'fa-solid fa-bullhorn',
            iconColor: '#8b5cf6',
            postedTime: 'Il y a 1 jour',
            tags: ['HYBRIDE'],
            daysLeft: 5,
            mcqDuration: 15,
            mcqQuestionsCount: 15,
            mcqPassScore: 65,
            testDate: '16 Fév 2026',
            testTime: '10:30'
        },
        {
            id: 3,
            title: 'Auditeur Financier Associé',
            company: 'Future Ventures',
            location: 'Londres, UK',
            category: 'FINANCE',
            description: {
                intro: 'Gérer les audits internes et assurer la conformité financière.',
                mission: 'Assurer l\'exactitude des rapports financiers.',
                responsibilities: ['Mener des audits', 'Préparer des rapports', 'Évaluation des risques']
            },
            skills: ['Audit', 'Excel', 'Gestion des Risques', 'IFRS'],
            icon: 'fa-solid fa-chart-line',
            iconColor: '#10b981',
            postedTime: 'Il y a 3 jours',
            tags: ['SUR SITE'],
            daysLeft: 10,
            mcqDuration: 30,
            mcqQuestionsCount: 25,
            mcqPassScore: 75,
            testDate: '18 Fév 2026',
            testTime: '09:00'
        },
        {
            id: 4,
            title: 'Architecte Systèmes Cloud',
            company: 'TechCorp',
            location: 'Télétravail',
            category: 'IT',
            description: {
                intro: 'Concevoir et implémenter une infrastructure cloud évolutive.',
                mission: 'Construire des systèmes cloud résilients.',
                responsibilities: ['Gérer la flotte AWS', 'Optimiser les coûts', 'Assurer la sécurité']
            },
            skills: ['AWS', 'Kubernetes', 'Terraform', 'Python'],
            icon: 'fa-solid fa-cloud',
            iconColor: '#06b6d4',
            postedTime: 'Il y a 5 jours',
            tags: ['TÉLÉTRAVAIL'],
            daysLeft: 8,
            mcqDuration: 40,
            mcqQuestionsCount: 30,
            mcqPassScore: 80,
            testDate: '20 Fév 2026',
            testTime: '15:30'
        }
    ] as Job[],

    applications: [
        // Job 1
        { id: 101, jobId: 1, candidateName: 'Jean Dupont', status: 'Pending', date: '12/02/2026', score: 92 },
        { id: 102, jobId: 1, candidateName: 'Marie Claire', status: 'Accepted', date: '11/02/2026', score: 88 },
        { id: 105, jobId: 1, candidateName: 'Luc Besson', status: 'Interview', date: '10/02/2026', score: 85 },
        { id: 106, jobId: 1, candidateName: 'Sarah Connor', status: 'Pending', date: '09/02/2026', score: 78 },
        { id: 107, jobId: 1, candidateName: 'John Doe', status: 'Rejected', date: '08/02/2026', score: 45 },
        // Job 2
        { id: 103, jobId: 2, candidateName: 'Ahmed Benali', status: 'Pending', date: '13/02/2026', score: 95 },
        { id: 104, jobId: 2, candidateName: 'Sophie Martin', status: 'Rejected', date: '10/02/2026', score: 55 },
        { id: 108, jobId: 2, candidateName: 'Thomas Muller', status: 'Accepted', date: '12/02/2026', score: 91 },
        // Job 3
        { id: 109, jobId: 3, candidateName: 'Emma Watson', status: 'Pending', date: '11/02/2026', score: 89 },
        { id: 110, jobId: 3, candidateName: 'Paul Pogba', status: 'Interview', date: '12/02/2026', score: 82 },
        { id: 111, jobId: 3, candidateName: 'Zinedine Zidane', status: 'Pending', date: '13/02/2026', score: 75 },
        { id: 112, jobId: 3, candidateName: 'Karim Benzema', status: 'Accepted', date: '10/02/2026', score: 94 },
        // Job 4
        { id: 113, jobId: 4, candidateName: 'Elon Musk', status: 'Pending', date: '12/02/2026', score: 96 },
        { id: 114, jobId: 4, candidateName: 'Jeff Bezos', status: 'Interview', date: '11/02/2026', score: 90 },
        { id: 115, jobId: 4, candidateName: 'Bill Gates', status: 'Accepted', date: '09/02/2026', score: 87 },
        { id: 116, jobId: 4, candidateName: 'Mark Zuckerberg', status: 'Rejected', date: '08/02/2026', score: 62 },
        { id: 117, jobId: 4, candidateName: 'Steve Jobs', status: 'Pending', date: '07/02/2026', score: 84 }
    ] as Application[],

    // Helper to add application
    apply(jobId: number, candidateName: string) {
        this.applications.push({
            id: Date.now(),
            jobId,
            candidateName,
            status: 'Pending',
            date: new Date().toLocaleDateString(),
        });
    },

    getJob(id: number) {
        return this.jobs.find(j => j.id === id);
    },

    getApplicantsCount(jobId: number) {
        return this.applications.filter(a => a.jobId === jobId).length;
    },

    deleteJob(id: number) {
        this.jobs = this.jobs.filter(j => j.id !== id);
        this.applications = this.applications.filter(a => a.jobId !== id);
    },

    deleteApplication(id: number) {
        this.applications = this.applications.filter(a => a.id !== id);
    },

    updateJobTitle(id: number, newTitle: string) {
        const job = this.jobs.find(j => j.id === id);
        if (job) {
            job.title = newTitle;
        }
    },

    addJob(data: {
        title: string;
        company: string;
        location: string;
        category: string;
        salary: string;
        description: string;
        requirements: string;
        contractType: string;
        remote: string;
        experience: string;
        deadline: string;
        mcqDuration?: number;
        mcqQuestionsCount?: number;
        mcqPassScore?: number;
    }) {
        // Map form category → Job category type
        const catMap: Record<string, 'IT' | 'MARKETING' | 'FINANCE' | 'HR'> = {
            tech: 'IT',
            marketing: 'MARKETING',
            finance: 'FINANCE',
            rh: 'HR',
            design: 'IT',
            ventes: 'MARKETING',
        };
        const iconMap: Record<string, { icon: string; color: string }> = {
            IT: { icon: 'fa-solid fa-code', color: '#3b82f6' },
            MARKETING: { icon: 'fa-solid fa-bullhorn', color: '#8b5cf6' },
            FINANCE: { icon: 'fa-solid fa-chart-line', color: '#10b981' },
            HR: { icon: 'fa-solid fa-users', color: '#f59e0b' },
        };

        const mappedCat = catMap[data.category] ?? 'IT';
        const iconInfo = iconMap[mappedCat] ?? { icon: 'fa-solid fa-briefcase', color: '#64748b' };

        const remoteTag: Record<string, string> = {
            remote: 'TÉLÉTRAVAIL',
            hybrid: 'HYBRIDE',
            onsite: 'SUR SITE',
        };

        const newJob: Job = {
            id: Date.now(),
            title: data.title,
            company: data.company || 'Mon Entreprise',
            location: data.location + (data.remote === 'remote' ? ' (Télétravail)' : ''),
            category: mappedCat,
            salary: data.salary || 'Non précisé',
            description: {
                intro: data.description,
                mission: data.description,
                responsibilities: data.requirements
                    ? data.requirements.split('\n').filter(Boolean)
                    : [],
            },
            skills: data.requirements
                ? data.requirements.split('\n').filter(Boolean).slice(0, 6)
                : [],
            icon: iconInfo.icon,
            iconColor: iconInfo.color,
            postedTime: "À l'instant",
            tags: [remoteTag[data.remote] ?? 'SUR SITE', data.contractType.toUpperCase()],
            daysLeft: data.deadline
                ? Math.max(0, Math.ceil((new Date(data.deadline).getTime() - Date.now()) / 86400000))
                : 30,
            mcqDuration: data.mcqDuration ?? 20,
            mcqQuestionsCount: data.mcqQuestionsCount ?? 15,
            mcqPassScore: data.mcqPassScore ?? 70,
        };

        this.jobs.unshift(newJob);  // Add at the top of the list
        return newJob;
    },
});
