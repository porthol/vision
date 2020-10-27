import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Project } from '../models/project';
import { Group } from '../models/group';
import { Pipeline } from '../models/pipeline';
import { map } from 'rxjs/operators';
import { Tag } from '../models/tag';
import { Commit } from '../models/commit';
import { Registry } from '../models/registry';
import { Observable } from 'rxjs';

@Injectable()
export class GitlabService {
    constructor(private httpClient: HttpClient) {}

    getGroups(): Observable<Group[]> {
        return this.httpClient.get<Group[]>(environment.apiUrl + 'groups');
    }

    getProjects(groupId: number) {
        return this.httpClient.get<Project[]>(environment.apiUrl + 'groups/' + groupId + '/projects');
    }

    getPipelines(projectId: number) {
        return this.httpClient.get<Pipeline[]>(environment.apiUrl + 'projects/' + projectId + '/pipelines').pipe(
            map(pipelines => {
                return { projectId, pipelines };
            })
        );
    }

    getRegistry(projectId: number) {
        return this.httpClient
            .get<Registry[]>(environment.apiUrl + 'projects/' + projectId + '/registry/repositories')
            .pipe(
                map(registries => {
                    return { projectId, registry: registries[0] };
                })
            );
    }

    getTags(projectId: number, repositoryId: number) {
        return this.httpClient
            .get<Tag[]>(
                environment.apiUrl + 'projects/' + projectId + '/registry/repositories/' + repositoryId + '/tags'
            )
            .pipe(
                map(tags => {
                    return tags.map(tag => {
                        tag.projectId = projectId;
                        return tag;
                    });
                })
            );
    }

    getCommits(projectId: number) {
        return this.httpClient.get<Commit[]>(environment.apiUrl + 'projects/' + projectId + '/repository/commits').pipe(
            map(commits => {
                return { projectId, commits };
            })
        );
    }
}
