import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigComponent } from './config.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigRoutingModule } from './config.routing.module';

@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbSpinnerModule,
    ConfigRoutingModule
  ]
})
export class ConfigModule {}
