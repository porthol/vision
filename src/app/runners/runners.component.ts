import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { GitlabService } from '../../services/gitlab.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Runner } from '../../models/runner';
import { Observable, timer } from 'rxjs';
import { Job } from '../../models/job';
import { pipelineStatusToIcon, pipelineStatusToNbStatus } from '../../models/pipeline';

@Component({
  selector: 'app-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.css']
})
export class RunnersComponent {
  loader = false;

  constructor(private configService: ConfigService, private gitlabService: GitlabService) {}

  runners$ = timer(0, this.configService.configSnapshot.refreshTime * 1000).pipe(
    switchMap(() => this.gitlabService.getRunners()),
    tap(console.log),
    tap(runners => runners.forEach(r => (this.runnersJobs$$[r.id] = this.getRunnerJobs(r))))
  );

  pipelineStatusToNbStatus = pipelineStatusToNbStatus;
  pipelineStatusToIcon = pipelineStatusToIcon;
  runnersJobs$$: Observable<Job[]>[] = [];

  getRunnerJobs(runner: Runner) {
    return this.gitlabService.getRunnerJob(runner.id).pipe(
      map(jobs => {
        return jobs.splice(0, 3);
      }),
      tap(console.log)
    );
  }
}
