import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GitlabService } from '../../services/gitlab.service';
import { Project } from '../../models/project';
import { ConfigService } from '../../services/config.service';
import { concatAll, flatMap, map } from 'rxjs/operators';
import { Tag } from '../../models/tag';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    @Output() toggleDashboard: EventEmitter<any>;
    configForm: FormGroup;
    config: any;
    repos: Project[] = [];
    mainLoading: boolean;
    loadPipelines: Subject<Project>;
    loadTags: Subject<Project>;
    loadCommits: Subject<Project>;

    constructor(private gitlabService: GitlabService, private configService: ConfigService) {
        this.configForm = new FormGroup({
            privateToken: new FormControl(),
            groups: new FormControl(),
            repoExclude: new FormControl()
        });

        this.loadConfig();
        this.loadPipelines = new Subject<Project>();
        this.loadPipelines
            .pipe(
                flatMap((project: Project) => {
                    project.loaders.push({ id: 'pipelines', status: true });
                    return this.gitlabService.getPipelines(project.id);
                })
            )
            .subscribe((response: any) => {
                const project = this.repos.find((project: Project) => project.id === response.projectId);
                if (response.pipelines) {
                    response.pipelines.map(pipeline => {
                        if (project) {
                            (project.pipelines || (project.pipelines = [])).push(pipeline);
                            // console.log(Array.from(new Set(project.pipelines.map(pipeline => pipeline.ref))));
                        }
                    });
                }
                const loader = project.loaders.find(loader => loader.id === 'pipelines');
                loader.status = false;
            });

        this.loadTags = new Subject<Project>();
        this.loadTags
            .pipe(
                flatMap(project => {
                    project.loaders.push({ id: 'tags', status: true });
                    return this.gitlabService.getRegistry(project.id);
                }),
                flatMap(response => {
                    const project = this.repos.find((project: Project) => project.id === response.projectId);
                    if (response.registry) {
                        project.registry = response.registry;
                        return this.gitlabService.getTags(project.id, response.registry.id);
                    }

                    const loader = project.loaders.find(loader => loader.id === 'tags');
                    loader.status = false;
                    return new Observable(null);
                })
            )
            .subscribe((tags: Tag[]) => {
                if (tags) {
                    tags.map(tag => {
                        const project = this.repos.find((project: Project) => project.id === tag.projectId);
                        if (project) {
                            (project.tags || (project.tags = [])).push(tag);
                            const loader = project.loaders.find(loader => loader.id === 'tags');
                            loader.status = false;
                        }
                    });
                }
            });

        this.loadCommits = new Subject<Project>();
        this.loadCommits
            .pipe(
                flatMap(project => {
                    project.loaders.push({ id: 'commits', status: true });
                    return this.gitlabService.getCommits(project.id);
                })
            )
            .subscribe(response => {
                if (response.commits) {
                    const project = this.repos.find((project: Project) => project.id === response.projectId);
                    response.commits.map(commit => {
                        if (project) {
                            const loader = project.loaders.find(loader => loader.id === 'commits');
                            loader.status = false;
                            (project.commits || (project.commits = [])).push(commit);
                        }
                    });
                }
            });
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
        this.repos = [];
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

    isLoading(repo: Project) {
        console.log(repo.loaders);
        console.log(repo.loaders);
        return repo.loaders.reduce((sum, next) => sum || next.status, false);
    }

    loadRepos() {
        const tmpRepos = [];
        let groupsNames = [];
        let reposToExclude = [];
        this.mainLoading = true;
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
                    return groups.map(group => this.gitlabService.getProjects(group.id));
                }),
                concatAll(),
                map((projects: Project[]) => {
                    projects = projects.filter(project =>
                        reposToExclude.length > 0 ? reposToExclude.indexOf(project.name.toLowerCase()) === -1 : true
                    );
                    tmpRepos.push([...projects]);
                    return projects;
                }),
                map(projects => {
                    this.repos = tmpRepos.flatMap(projects => {
                        return projects;
                    });
                    this.mainLoading = false;

                    return projects.map(project => {
                        project.loaders = [];
                        project.loaders.push({ id: 'start', status: true });
                        this.loadPipelines.next(project);
                        this.loadTags.next(project);
                        this.loadCommits.next(project);
                        return project;
                    });
                })
            )
            .subscribe(projects => {
                projects.map(project => {
                    const loader = project.loaders.find(loader => loader.id === 'start');
                    loader.status = false;
                });
            });
    }
}
