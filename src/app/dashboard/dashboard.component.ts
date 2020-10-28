import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GitlabService } from '../../services/gitlab.service';
import { Project } from '../../models/project';
import { ConfigService } from '../../services/config.service';
import { concatAll, first, map, mergeMap, scan, switchMap, tap } from 'rxjs/operators';
import { combineLatest, concat, Observable, of, Subject, timer } from 'rxjs';
import { Group } from '../../models/group';
import { Config } from '../../models/config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  @Output() toggleDashboard: EventEmitter<any>;
  configForm: FormGroup = new FormGroup({
    privateToken: new FormControl(),
    refreshTime: new FormControl(5, Validators.min(5))
  });
  config: Config;
  loadGroups$ = new Subject();
  loadProjects$ = new Subject<Group[]>();
  mainLoading = true;
  showGroups = false;
  showProjects = false;

  groups$: Observable<Group[]> = this.loadGroups$.pipe(
    tap(() => (this.showGroups = true)),
    tap(() => (this.mainLoading = true)),
    switchMap(() => this.gitlabService.getGroups()),
    tap(() => (this.mainLoading = false))
  );

  projects$: Observable<Project[]> = this.loadProjects$.pipe(
    switchMap(groups =>
      concat(of(groups)).pipe(
        tap(() => (this.showProjects = true)),
        tap(() => (this.mainLoading = true)),
        mergeMap(groups => groups.map(group => this.gitlabService.getProjects(group.id))),
        concatAll(),
        scan((acc, curr) => [...acc, ...curr], []),
        tap(() => (this.mainLoading = false)),
        tap(projects => this.setProjectsInclude(projects))
      )
    )
  );

  groupsSelected: Group[] = [];
  projectsSelected: Project[] = [];
  projectsInfo$$: Observable<Project>[] = [];

  constructor(private gitlabService: GitlabService, private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.closeConfig();
  }

  ngAfterViewInit(): void {
    this.loadConfig();
  }

  get hideConfig() {
    return this.configService.hideConfigWindow;
  }

  saveConfig() {
    this.configService.closeConfig();
    this.projectsInfo$$ = [];
    this.groupsSelected = [];
    this.projectsSelected = [];
    this.config = { ...this.configForm.value, projects: [], groups: [] };
    localStorage.setItem('config', JSON.stringify(this.config));

    if (this.config.privateToken) {
      this.mainLoading = true;
      this.loadGroups$.next();
    }
  }

  loadConfig() {
    timer(1000).subscribe(() => {
      this.config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : {};
      if (this.config?.privateToken) {
        if (this.config.refreshTime < 5) {
          this.config.refreshTime = 5;
        }
        this.configForm.patchValue(this.config);
        if (this.config.groups.length) {
          this.gitlabService
            .getGroups()
            .pipe(
              first(),
              map(groups => groups.filter(g => this.config.groups.includes(g.id)).map(g => ({ ...g, selected: true }))),
              tap(groups => this.setGroupSelected(groups)),
              mergeMap(groups => groups.map(group => this.gitlabService.getProjects(group.id))),
              concatAll(),
              scan((acc, curr) => [...acc, ...curr], []),
              map(projects =>
                projects.filter(p => this.config.projects.includes(p.id)).map(p => ({ ...p, exclude: false }))
              ),
              tap(projects => this.setProjectsInclude(projects)),
              tap(() => (this.mainLoading = false))
            )
            .subscribe(() => this.finishSelection(false));
        } else {
          this.mainLoading = false;
        }
      } else {
        this.mainLoading = false;
      }
    });
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

  setGroupSelected(groups: Group[]) {
    this.groupsSelected = groups.filter(g => g.selected);
  }

  nextProjects() {
    this.showGroups = false;
    this.loadProjects$.next(this.groupsSelected);
  }

  setProjectsInclude(projects: Project[]) {
    this.projectsSelected = projects.filter(p => !p.exclude);
  }

  finishSelection(saveConfig = true) {
    this.showProjects = false;
    this.projectsInfo$$ = this.projectsSelected.map((p, i) => this._projectInfo$(p));

    if (saveConfig) {
      // save groups and projects
      this.config.groups = this.groupsSelected.map(g => g.id);
      this.config.projects = this.projectsSelected.map(p => p.id);
      localStorage.setItem('config', JSON.stringify(this.config));
    }
  }

  private _projectInfo$(p: Project): Observable<Project> {
    return timer(0, this.config.refreshTime * 1000).pipe(
      switchMap(() =>
        combineLatest([
          of(p),
          this.gitlabService.getCommits(p.id),
          this.gitlabService
            .getRegistry(p.id)
            .pipe(switchMap(r => (r.length ? this.gitlabService.getTags(p.id, r[0].id) : of([])))),
          this.gitlabService.getPipelines(p.id)
        ])
      ),
      map(response => ({
        ...response[0],
        commits: response[1],
        tags: response[2],
        pipelines: response[3],
        refs: Array.from(new Set(response[3].map(pipeline => pipeline.ref)))
      })),
      map((p: Project) => ({
        ...p,
        lastPipelines: p.refs.map(ref => {
          return { ref, pipeline: p.pipelines.find(pipeline => pipeline.ref === ref) };
        })
      }))
    );
  }
}
