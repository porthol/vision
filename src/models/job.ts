import { Project } from './project';
import { Pipeline } from './pipeline';
import { Commit } from './commit';
import { User } from './user';

export interface Job {
  id: number;
  ip_address: string;
  status: string;
  stage: string;
  name: string;
  ref: string;
  tag: boolean;
  coverage: string;
  created_at: Date;
  started_at: Date;
  finished_at: Date;
  duration: number;
  user: User;
  commit: Commit;
  pipeline: Pipeline;
  project: Project;
}
