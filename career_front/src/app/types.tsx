export type JOBDATA = {
    id: number;
    title: string;
    company: string;
    category: string;
    requirements: string;
    description: string;
    tags: string;
    link: string;
    created_at: string;
}

export type ANALYSISDATA = {
    relevant_skills_and_experiences : string[];
    areas_for_improvement: string[];
    match_score: string;
    summary_and_resoning: string;
}