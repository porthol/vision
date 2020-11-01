import { Pipe, PipeTransform } from '@angular/core';
import { formatDuration } from './time.utils';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(duration: number, format = '{h} h {min}'): string {
    return formatDuration(duration, format);
  }
}
