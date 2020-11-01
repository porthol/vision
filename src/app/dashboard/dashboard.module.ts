import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { NbCardModule, NbIconModule, NbProgressBarModule, NbSpinnerModule } from '@nebular/theme';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, NbCardModule, NbSpinnerModule, NbIconModule, NbProgressBarModule]
})
export class DashboardModule {}
