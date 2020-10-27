import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GitlabService } from '../../services/gitlab.service';
import { Project } from '../../models/project';
import { ConfigService } from '../../services/config.service';
import { concatAll, flatMap, map, scan, switchMap, tap } from 'rxjs/operators';
import { Tag } from '../../models/tag';
import { interval, Observable, Subject } from 'rxjs';
import { Group } from '../../models/group';
import { Config } from '../../models/config';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    @Output() toggleDashboard: EventEmitter<any>;
    configForm: FormGroup = new FormGroup({
        privateToken: new FormControl(),
        refreshTime: new FormControl(5, Validators.min(5))
    });
    config: Config;
    loadGroups$ = new Subject();
    loadProjects$ = new Subject<Group[]>();

    loadPipelines = new Subject<Project>();
    loadTags = new Subject<Project>();
    loadCommits = new Subject<Project>();
    loader: boolean;
    mainLoading = false;
    showGroups = false;
    showProjects = false;

    groups$: Observable<Group[]> = this.loadGroups$.pipe(
        tap(() => (this.showGroups = true)),
        tap(() => (this.mainLoading = true)),
        switchMap(() => this.gitlabService.getGroups()),
        tap(() => (this.mainLoading = false))
    );

    projects$: Observable<Project[]> = this.loadProjects$.pipe(
        tap(() => (this.showProjects = true)),
        tap(() => (this.mainLoading = true)),
        flatMap(groups => groups.map(group => this.gitlabService.getProjects(group.id))),
        concatAll(),
        scan((acc, curr) => [...acc, ...curr], []),
        tap(() => (this.mainLoading = false)),
        tap(projects => this.setProjectsInclude(projects))
    );

    groupsSelected: Group[] = [];
    projectsSelected: Project[] = [];

    constructor(private gitlabService: GitlabService, private configService: ConfigService) {
        this.loader = true;
        this.loadConfig();
        this.loadPipelines
            .pipe(
                flatMap((project: Project) => {
                    project.loaders.push({ id: 'pipelines', status: true });
                    return this.gitlabService.getPipelines(project.id);
                })
            )
            .subscribe((response: any) => {
                const project = this.projectsSelected.find((project: Project) => project.id === response.projectId);
                if (response.pipelines.length > 0) {
                    project.pipelines = [...response.pipelines];
                    project.refs = Array.from(new Set(project.pipelines.map(pipeline => pipeline.ref)));
                    project.lastPipelines = project.refs.map(ref => {
                        return { ref, pipeline: project.pipelines.find(pipeline => pipeline.ref === ref) };
                    });
                }
                const loader = project.loaders.find(loader => loader.id === 'pipelines');
                loader.status = false;
            });

        this.loadTags
            .pipe(
                flatMap(project => {
                    project.loaders.push({ id: 'tags', status: true });
                    return this.gitlabService.getRegistry(project.id);
                }),
                flatMap(response => {
                    const project = this.projectsSelected.find((project: Project) => project.id === response.projectId);
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
                if (tags.length > 0) {
                    const project = this.projectsSelected.find((project: Project) => project.id === tags[0].projectId);
                    if (project) {
                        project.tags = tags;
                    }
                    const loader = project.loaders.find(loader => loader.id === 'tags');
                    loader.status = false;
                }
            });

        this.loadCommits
            .pipe(
                flatMap(project => {
                    project.loaders.push({ id: 'commits', status: true });
                    return this.gitlabService.getCommits(project.id);
                })
            )
            .subscribe(response => {
                if (response.commits) {
                    const project = this.projectsSelected.find((project: Project) => project.id === response.projectId);
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
        this.config = { ...this.config, ...this.configForm.value };
        localStorage.setItem('config', JSON.stringify(this.config));

        if (this.config.privateToken) {
            this.loader = true;
            this.loadGroups$.next();
        }
    }

    loadConfig() {
        this.config = JSON.parse(localStorage.getItem('config'));
        if (this.config.privateToken) {
            if (this.config.refreshTime < 5) {
                this.config.refreshTime = 5;
            }
            this.configForm.patchValue(this.config);
            this.configService.closeConfig();
            this.loadGroups$.next();
        }
    }

    isLoading(repo: Project) {
        return repo.loaders.reduce((sum, next) => sum || next.status, false);
    }

    pipelineStatusToNbStatus(pipelineStatus: string) {
        switch (pipelineStatus) {
            case 'running':
                return 'info';
            case 'pending':
                return 'warning';
            case 'success':
                return 'success';
            case 'failed':
                return 'danger';
            case 'canceled':
                return '';
            case 'skipped':
                return 'primary';
            default:
                return '';
        }
    }

    pipelineStatusToValue(pipelineStatus: string) {
        switch (pipelineStatus) {
            case 'running':
                return 60;
            case 'pending':
                return 10;
            case 'success':
                return 100;
            case 'failed':
                return 40;
            case 'canceled':
                return 0;
            case 'skipped':
                return 0;
            default:
                return 0;
        }
    }

    setGroupSelected(group: Group[]) {
        this.groupsSelected = group.filter(g => g.selected);
        this.config.groups = this.groupsSelected.map(g => g.id);
    }

    nextProjects() {
        this.showGroups = false;
        this.loadProjects$.next(this.groupsSelected);
    }

    setProjectsInclude(projects: Project[]) {
        this.projectsSelected = projects.filter(p => !p.exclude);
        this.config.projects = this.projectsSelected.map(p => p.id);
    }

    finishSelection() {
        this.showProjects = false;
        this.projectsSelected.forEach(p => {
            this.loadPipelines.next(p);
            this.loadTags.next(p);
            this.loadCommits.next(p);
        });

        interval(this.config.refreshTime * 1000)
            .pipe(
                map(() => {
                    this.loader = false;
                    return this.projectsSelected.map(project => {
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
