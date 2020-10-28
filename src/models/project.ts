import { Pipeline } from './pipeline';
import { Registry } from './registry';
import { Tag } from './tag';
import { Commit } from './commit';

export class Project {
  id: number;
  description: string;
  name: string;
  path: string;
  pipelines: Pipeline[];
  registry: Registry;
  tags: Tag[];
  path_with_namespace: string;
  error = false;
  default_branch: string;
  web_url: string;
  commits: Commit[];
  refs: string[];
  exclude = false;
  lastPipelines: { ref: string; pipeline: Pipeline }[];
}
