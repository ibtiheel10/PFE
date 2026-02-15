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
            title: 'Senior Fullstack Developer',
            company: 'TechCorp',
            location: 'Paris, FR (Remote)',
            category: 'IT',
            description: {
                intro: 'Join our core platform team to build scalable APIs.',
                mission: 'Architect and build modern web applications.',
                responsibilities: ['Develop Vue.js frontends', 'Design Node.js APIs', 'Mentor juniors']
            },
            skills: ['Vue.js', 'Node.js', 'TypeScript', 'AWS'],
            icon: 'fa-solid fa-code',
            iconColor: '#3b82f6',
            postedTime: '2 days ago',
            tags: ['FULL TIME', 'REMOTE'],
            daysLeft: 2,
            mcqDuration: 25,
            mcqQuestionsCount: 20,
            mcqPassScore: 70,
            testDate: '15 Fév 2026',
            testTime: '14:00'
        },
        {
            id: 2,
            title: 'Marketing Content Specialist',
            company: 'Innovate Solutions',
            location: 'Berlin, DE',
            category: 'MARKETING',
            description: {
                intro: 'Elevate our brand presence through compelling storytelling.',
                mission: 'Create engaging content for global campaigns.',
                responsibilities: ['Write blog posts', 'Manage social media', 'Analyze SEO metrics']
            },
            skills: ['Copywriting', 'SEO', 'Social Media', 'Google Analytics'],
            icon: 'fa-solid fa-bullhorn',
            iconColor: '#8b5cf6',
            postedTime: '1 day ago',
            tags: ['HYBRID'],
            daysLeft: 5,
            mcqDuration: 15,
            mcqQuestionsCount: 15,
            mcqPassScore: 65,
            testDate: '16 Fév 2026',
            testTime: '10:30'
        },
        {
            id: 3,
            title: 'Financial Audit Associate',
            company: 'Future Ventures',
            location: 'London, UK',
            category: 'FINANCE',
            description: {
                intro: 'Manage internal audits and ensure financial compliance.',
                mission: 'Ensure accuracy in financial reporting.',
                responsibilities: ['Conduct audits', 'Prepare reports', 'Risk assessment']
            },
            skills: ['Auditing', 'Excel', 'Risk Management', 'IFRS'],
            icon: 'fa-solid fa-chart-line',
            iconColor: '#10b981',
            postedTime: '3 days ago',
            tags: ['ON SITE'],
            daysLeft: 10,
            mcqDuration: 30,
            mcqQuestionsCount: 25,
            mcqPassScore: 75,
            testDate: '18 Fév 2026',
            testTime: '09:00'
        },
        {
            id: 4,
            title: 'Cloud Systems Architect',
            company: 'TechCorp',
            location: 'Remote',
            category: 'IT',
            description: {
                intro: 'Design and implement scalable cloud infrastructure.',
                mission: 'Build resilient cloud systems.',
                responsibilities: ['Manage AWS fleet', 'Optimize costs', 'Ensure security']
            },
            skills: ['AWS', 'Kubernetes', 'Terraform', 'Python'],
            icon: 'fa-solid fa-cloud',
            iconColor: '#06b6d4',
            postedTime: '5 days ago',
            tags: ['REMOTE'],
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
    }
});
