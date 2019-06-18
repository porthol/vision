import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GitlabService } from '../../services/gitlab.service';
import { Group } from '../../models/group';
import { Project } from '../../models/project';
import { Pipeline } from '../../models/pipeline';
import { ConfigService } from '../../services/config.service';
import { concatAll, flatMap, map } from 'rxjs/operators';
import { Registry } from '../../models/registry';
import { Observable } from 'rxjs';
import { Tag } from '../../models/tag';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    @Output() toggleDashboard: EventEmitter<any>;
    configForm: FormGroup;
    config: any;
    groups: Group[] = [];

    constructor(private gitlabService: GitlabService, private configService: ConfigService) {
        this.configForm = new FormGroup({
            privateToken: new FormControl(),
            groups: new FormControl(),
            repoExclude: new FormControl()
        });

        this.loadConfig();
    }

    ngOnInit() {}

    hideConfig() {
        return this.configService.hideConfigWindow;
    }

    saveConfig() {
        this.configService.closeConfig();
        localStorage.setItem('private_token', this.configForm.getRawValue().privateToken || '');
        localStorage.setItem('groups', this.configForm.getRawValue().groups || '');
        localStorage.setItem('repo_exclude', this.configForm.getRawValue().repoExclude || '');

        this.config = { ...this.configForm.getRawValue() };
        this.groups = [];
        this.loadRepos();
    }

    loadConfig() {
        if (localStorage.getItem('private_token')) {
            this.config = {
                privateToken: localStorage.getItem('private_token'),
                groups: localStorage.getItem('groups'),
                repoExclude: localStorage.getItem('repo_exclude')
            };
            this.configForm.patchValue(this.config);
            this.configService.closeConfig();
            this.loadRepos();
        }
    }

    loadRepos() {
        let loading = true;
        let groupsNames = [];
        let reposToExclude = [];
        if (this.config.groups) {
            groupsNames = this.config.groups
                .toLowerCase()
                .split(',')
                .map(name => name.trim());
        }

        if (this.config.repoExclude) {
            reposToExclude = this.config.repoExclude
                .toLowerCase()
                .split(',')
                .map(name => name.trim());
        }

        this.gitlabService
            .getGroups()
            .pipe(
                map(groups =>
                    groups.filter(group =>
                        groupsNames.length > 0 ? groupsNames.indexOf(group.name.toLowerCase()) !== -1 : true
                    )
                ),
                flatMap(groups => {
                    this.groups = [...groups];
                    return groups.map(group => this.gitlabService.getProjects(group.id));
                }),
                concatAll(),
                map((projects: Project[]) =>
                    projects.filter(project =>
                        reposToExclude.length > 0 ? reposToExclude.indexOf(project.name.toLowerCase()) === -1 : true
                    )
                ),
                flatMap(projects => {
                    return projects.map(project => {
                        // associate project to group
                        const group: Group = this.groups.find(group => {
                            return (project as any).namespace.id === group.id;
                        });
                        (group.projects || (group.projects = [])).push(project);
                        return this.gitlabService.getRegistry(project.id);
                    });
                }),
                concatAll(),
                flatMap((registry: Registry) => {
                    if (registry) {
                        const project = this.groups
                            .flatMap(group => group.projects)
                            .find(
                                (project: Project) =>
                                    project.path_with_namespace.toLowerCase() === registry.path.toLowerCase()
                            );
                        project.registry = registry;
                        return this.gitlabService.getTags(project.id, registry.id);
                    }
                    return new Observable(null);
                }),
                flatMap((tags: Tag[]) => {
                    if (tags) {
                        tags.map(tag => {
                            const project = this.groups
                                .flatMap(group => group.projects)
                                .find((project: Project) => project.id === tag.projectId);
                            if (project) {
                                (project.tags || (project.tags = [])).push(tag);
                            }
                        });
                    }
                    return this.groups
                        .flatMap(group => group.projects)
                        .map(project => this.gitlabService.getPipelines(project.id));
                }),
                concatAll(),
                map((pipelines: Pipeline[]) => {
                    if (pipelines) {
                        pipelines.map(pipeline => {
                            const project = this.groups
                                .flatMap(group => group.projects)
                                .find((project: Project) => project.id === pipeline.projectId);
                            if (project) {
                                (project.pipelines || (project.pipelines = [])).push(pipeline);
                            }
                        });
                    }
                })
            )
            .subscribe(() => {
                loading = false;
            });
    }
}
