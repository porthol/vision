import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Project } from '../models/project';
import { Group } from '../models/group';
import { Pipeline } from '../models/pipeline';
import { Registry } from '../models/registry';
import { map } from 'rxjs/operators';
import { Tag } from '../models/tag';

@Injectable()
export class GitlabService {
    constructor(private httpClient: HttpClient) {}

    getGroups() {
        return this.httpClient.get<Group[]>(environment.apiUrl + 'groups');
    }

    getProjects(groupId: number) {
        return this.httpClient.get<Project[]>(environment.apiUrl + 'groups/' + groupId + '/projects');
    }

    getPipelines(projectId: number) {
        return this.httpClient.get<Pipeline[]>(environment.apiUrl + 'projects/' + projectId + '/pipelines').pipe(
            map(pipelines => {
                return pipelines.map(pipeline => {
                    pipeline.projectId = projectId;
                    return pipeline;
                });
            })
        );
    }

    getRegistry(projectId: number) {
        return this.httpClient
            .get<Registry[]>(environment.apiUrl + 'projects/' + projectId + '/registry/repositories')
            .pipe(map(registries => registries[0]));
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
}
