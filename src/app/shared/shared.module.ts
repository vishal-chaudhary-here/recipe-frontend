import { NgModule } from '@angular/core';
import { FormatMediumDatetimePipe } from './date/format-medium-datetime.pipe';

@NgModule({
  imports: [],
  declarations: [
    FormatMediumDatetimePipe
  ],
  exports: [
    FormatMediumDatetimePipe
  ],
})
export class SharedModule {}
