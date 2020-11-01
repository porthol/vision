import { NbComponentStatus } from '@nebular/theme';

export class Pipeline {
  id: number;
  sha: string;
  ref: string;
  status: PipelineStatus;
  web_url: string;
  projectId: number;
}

export enum PipelineStatus {
  RUNNING = 'running',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELED = 'canceled',
  SKIPPED = 'skipped'
}

export function pipelineStatusToNbStatus(pipelineStatus: PipelineStatus): NbComponentStatus {
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
      return 'basic';
    case 'skipped':
      return 'primary';
    default:
      return 'basic';
  }
}

export function pipelineStatusToIcon(pipelineStatus: PipelineStatus): string {
  switch (pipelineStatus) {
    case 'running':
      return 'play-circle-outline';
    case 'pending':
      return 'pause-circle-outline';
    case 'success':
      return 'checkmark-circle-2-outline';
    case 'failed':
      return 'close-circle-outline';
    case 'canceled':
      return 'minus-circle-outline';
    case 'skipped':
      return 'skip-forward-outline';
    default:
      return '';
  }
}
