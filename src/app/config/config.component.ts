import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { concat, Observable, of, Subject } from 'rxjs';
import { Group } from '../../models/group';
import { concatAll, mergeMap, scan, switchMap, tap } from 'rxjs/operators';
import { Project } from '../../models/project';
import { GitlabService } from '../../services/gitlab.service';
import { Router } from '@angular/router';
import { Config } from '../../models/config';
import { findIndex } from '../utils/array/array.utils';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent implements OnInit {
  loadGroups$ = new Subject();
  loadProjects$ = new Subject<Group[]>();
  loader = false;
  showGroups = false;
  showProjects = false;
  configForm: FormGroup = new FormGroup({
    privateToken: new FormControl(),
    refreshTime: new FormControl(5, Validators.min(5)),
    groups: this.fb.array([]),
    projects: this.fb.array([])
  });

  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    private gitlabService: GitlabService,
    private router: Router
  ) {}

  groups$: Observable<Group[]> = this.loadGroups$.pipe(
    tap(() => (this.showGroups = true)),
    tap(() => (this.loader = true)),
    switchMap(() => this.gitlabService.getGroups()),
    tap(() => (this.loader = false))
  );

  projects$: Observable<Project[]> = this.loadProjects$.pipe(
    switchMap(groups =>
      concat(of(groups)).pipe(
        tap(() => (this.showProjects = true)),
        tap(() => (this.loader = true)),
        mergeMap(groups => groups.map(group => this.gitlabService.getProjects(group.id))),
        concatAll(),
        tap(projects => projects.forEach(p => this.addProject(p))),
        scan((acc, curr) => [...acc, ...curr], []),
        tap(() => (this.loader = false))
      )
    )
  );

  ngOnInit(): void {
    this.configForm.patchValue(this.configService.configSnapshot);
  }

  get groups() {
    return this.configForm.controls.groups as FormArray;
  }

  get projects() {
    return this.configForm.controls.projects as FormArray;
  }

  addGroup(group: Group) {
    group.selected = true;
    this.groups.push(this.fb.control(group));
  }

  removeGroup(group: Group) {
    group.selected = false;
    const i = findIndex(this.groups.value, g => g.id === group.id);
    this.groups.removeAt(i);
  }

  addProject(project: Project) {
    project.include = true;
    this.projects.push(this.fb.control(project));
  }

  removeProject(project: Project) {
    project.include = false;
    const i = findIndex(this.projects.value, p => p.id === project.id);
    this.projects.removeAt(i);
  }

  nextGroups() {
    this.configService.config = {
      ...this.configService.configSnapshot,
      privateToken: this.configForm.value.privateToken
    }; // first save for private token
    this.showGroups = true;
    this.loadGroups$.next();
  }

  nextProjects() {
    this.showGroups = false;
    this.loadProjects$.next(this.configForm.value.groups);
  }

  finishSelection() {
    this.configService.config = this._formatConfig();
    console.log(this.configForm.value);
    this.router.navigate(['/pipelines']);
  }

  private _formatConfig(): Config {
    const config = this.configForm.value;
    return {
      refreshTime: config.refreshTime || 5,
      privateToken: config.privateToken,
      groups: (config || []).groups.map(g => g.id),
      projects: (config || []).projects.map(p => p.id)
    };
  }
}
