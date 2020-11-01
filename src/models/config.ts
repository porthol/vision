export class Config {
  privateToken: string;
  refreshTime: number;
  groups: number[] = [];
  projects: number[] = [];

  constructor() {
    this.privateToken = null;
    this.refreshTime = 5;
    this.groups = [];
    this.projects = [];
  }
}
