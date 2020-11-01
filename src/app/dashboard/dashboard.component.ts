import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GitlabService } from '../../services/gitlab.service';
import { Project } from '../../models/project';
import { ConfigService } from '../../services/config.service';
import { concatAll, filter, first, map, mergeMap, scan, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { PipelineStatus, pipelineStatusToIcon, pipelineStatusToNbStatus } from '../../models/pipeline';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  loader = true;

  config$ = this.configService.config$.pipe(
    filter(config => !!(config.groups.length && config.privateToken)),
    switchMap(config =>
      this.gitlabService.getGroups().pipe(
        first(),
        map(groups => groups.filter(g => config.groups.includes(g.id)).map(g => ({ ...g, selected: true }))),
        mergeMap(groups => groups.map(group => this.gitlabService.getProjects(group.id))),
        concatAll(),
        scan((acc, curr) => [...acc, ...curr], []),
        map(projects => projects.filter(p => config.projects.includes(p.id)).map(p => ({ ...p, exclude: false }))),
        tap(() => (this.loader = false)),
        tap(projects => this.generateDataLoading(projects))
      )
    )
  );

  projectsInfo$$: Observable<Project>[] = [];

  constructor(private gitlabService: GitlabService, private configService: ConfigService) {}

  pipelineStatusToNbStatus = pipelineStatusToNbStatus;
  pipelineStatusToIcon = pipelineStatusToIcon;

  pipelineStatusToValue(pipelineStatus: PipelineStatus) {
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

  generateDataLoading(projects: Project[]) {
    this.projectsInfo$$ = projects.map(p => this._projectInfo$(p));
  }

  private _projectInfo$(p: Project): Observable<Project> {
    return timer(0, this.configService.configSnapshot.refreshTime * 1000).pipe(
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
