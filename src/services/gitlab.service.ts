import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Project } from '../models/project';
import { Group } from '../models/group';
import { Pipeline } from '../models/pipeline';
import { Tag } from '../models/tag';
import { Commit } from '../models/commit';
import { Registry } from '../models/registry';
import { Observable } from 'rxjs';
import { Runner } from '../models/runner';
import { Job } from '../models/job';

export interface RunnerParams {
  scope?: string;
  type?: string;
  status?: string;
  tap_list?: string[];
}

@Injectable()
export class GitlabService {
  constructor(private http: HttpClient) {}

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(environment.apiUrl + 'groups');
  }

  getProjects(groupId: number) {
    return this.http.get<Project[]>(environment.apiUrl + 'groups/' + groupId + '/projects');
  }

  getPipelines(projectId: number) {
    return this.http.get<Pipeline[]>(environment.apiUrl + 'projects/' + projectId + '/pipelines');
  }

  getRegistry(projectId: number) {
    return this.http.get<Registry[]>(environment.apiUrl + 'projects/' + projectId + '/registry/repositories');
  }

  getTags(projectId: number, repositoryId: number) {
    return this.http.get<Tag[]>(
      environment.apiUrl + 'projects/' + projectId + '/registry/repositories/' + repositoryId + '/tags'
    );
  }

  getCommits(projectId: number) {
    return this.http.get<Commit[]>(environment.apiUrl + 'projects/' + projectId + '/repository/commits');
  }

  getRunners(filter: RunnerParams = {}) {
    return this.http.get<Runner[]>(environment.apiUrl + 'runners', { params: filter as HttpParams });
  }

  getRunnerJob(runnerId: number) {
    return this.http.get<Job[]>(environment.apiUrl + 'runners/' + runnerId + '/jobs');
  }
}
