import { Project } from './project';

export class Group {
  auto_devops_enabled: boolean;
  avatar_url: string;
  created_at: Date;
  default_branch_protection: number;
  description: string;
  emails_disabled: boolean;
  full_name: string;
  full_path: string;
  id: number;
  mentions_disabled: boolean;
  name: string;
  parent_id: number;
  path: string;
  project_creation_level: string;
  request_access_enabled: boolean;
  require_two_factor_authentication: boolean;
  share_with_group_lock: boolean;
  subgroup_creation_level: string;
  two_factor_grace_period: number;
  visibility: number;
  web_url: string;
  selected = false;
  projects: Project[];
}
