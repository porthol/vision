import { Project } from './project';

export interface Runner {
  active: boolean;
  architecture: string;
  description: string;
  id: number;
  ip_shared: boolean;
  ip_address: string;
  contacted_at: string;
  projects: Project[];
  revision: string;
  tag_list: string[];
  version: string;
  access_level: string;
  maximum_timeout: number;
  name: string;
  online: boolean;
  status: 'active' | 'paused' | 'online' | 'offline';
}
