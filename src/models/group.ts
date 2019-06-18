import { Project } from './project';

export class Group {
    id: number;
    web_url: string;
    name: string;
    path: string;
    projects: Project[];
}
