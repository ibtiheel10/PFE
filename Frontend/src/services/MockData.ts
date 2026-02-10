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
    mcqDuration: number;
    icon: string;
    iconColor: string;
    postedTime: string;
    tags: string[];
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
            salary: '€55k - €75k',
            description: {
                intro: 'Join our core platform team to build scalable APIs.',
                mission: 'Architect and build modern web applications.',
                responsibilities: ['Develop Vue.js frontends', 'Design Node.js APIs', 'Mentor juniors']
            },
            skills: ['Vue.js', 'Node.js', 'TypeScript', 'AWS'],
            mcqDuration: 25,
            icon: 'fa-solid fa-code',
            iconColor: '#3b82f6',
            postedTime: '2 days ago',
            tags: ['FULL TIME', 'REMOTE']
        },
        {
            id: 2,
            title: 'Marketing Content Specialist',
            company: 'Innovate Solutions',
            location: 'Berlin, DE',
            category: 'MARKETING',
            salary: '€40k - €55k',
            description: {
                intro: 'Elevate our brand presence through compelling storytelling.',
                mission: 'Create engaging content for global campaigns.',
                responsibilities: ['Write blog posts', 'Manage social media', 'Analyze SEO metrics']
            },
            skills: ['Copywriting', 'SEO', 'Social Media', 'Google Analytics'],
            mcqDuration: 15,
            icon: 'fa-solid fa-bullhorn',
            iconColor: '#8b5cf6',
            postedTime: '1 day ago',
            tags: ['HYBRID']
        },
        {
            id: 3,
            title: 'Financial Audit Associate',
            company: 'Future Ventures',
            location: 'London, UK',
            category: 'FINANCE',
            salary: '£45k - £60k',
            description: {
                intro: 'Manage internal audits and ensure financial compliance.',
                mission: 'Ensure accuracy in financial reporting.',
                responsibilities: ['Conduct audits', 'Prepare reports', 'Risk assessment']
            },
            skills: ['Auditing', 'Excel', 'Risk Management', 'IFRS'],
            mcqDuration: 30,
            icon: 'fa-solid fa-chart-line',
            iconColor: '#10b981',
            postedTime: '3 days ago',
            tags: ['ON SITE']
        },
        {
            id: 4,
            title: 'Cloud Systems Architect',
            company: 'TechCorp',
            location: 'Remote',
            category: 'IT',
            salary: '€70k - €95k',
            description: {
                intro: 'Design and implement scalable cloud infrastructure.',
                mission: 'Build resilient cloud systems.',
                responsibilities: ['Manage AWS fleet', 'Optimize costs', 'Ensure security']
            },
            skills: ['AWS', 'Kubernetes', 'Terraform', 'Python'],
            mcqDuration: 40,
            icon: 'fa-solid fa-cloud',
            iconColor: '#06b6d4',
            postedTime: '5 days ago',
            tags: ['REMOTE']
        }
    ] as Job[],

    applications: [] as Application[],

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
    }
});
