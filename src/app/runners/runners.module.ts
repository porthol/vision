import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunnersComponent } from './runners.component';
import { RunnersRoutingModule } from './runners.routing.module';

@NgModule({
  declarations: [RunnersComponent],
  imports: [CommonModule, RunnersRoutingModule]
})
export class RunnersModule {}
