import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'formatMediumDatetime',
})
export class FormatMediumDatetimePipe implements PipeTransform {
  transform(day: dayjs.Dayjs | null | undefined): string {
    return day ? day.format(environment.SHOW_DATE_TIME_FORMAT) : '';
  }
}
