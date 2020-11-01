import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunnersComponent } from './runners.component';
import { RunnersRoutingModule } from './runners.routing.module';
import { NbAlertModule, NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { TimeModule } from '../utils/time/time.module';

@NgModule({
  declarations: [RunnersComponent],
  imports: [CommonModule, RunnersRoutingModule, NbCardModule, NbSpinnerModule, NbAlertModule, NbIconModule, TimeModule]
})
export class RunnersModule {}
