import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { GitlabService } from '../../services/gitlab.service';
import { map, tap } from 'rxjs/operators';
import { Runner } from '../../models/runner';
import { Observable } from 'rxjs';
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

  runners$ = this.gitlabService.getRunners().pipe(
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
