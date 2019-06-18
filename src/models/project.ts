import { Pipeline } from './pipeline';
import { Registry } from './registry';
import { Tag } from './tag';

export class Project {
    id: number;
    description: string;
    name: string;
    path: string;
    pipelines: Pipeline[];
    registry: Registry;
    tags: Tag[];
    path_with_namespace: string;
}
