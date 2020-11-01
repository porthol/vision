import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RunnersComponent } from './runners/runners.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pipelines',
        component: DashboardComponent
      },
      {
        path: 'runners',
        component: RunnersComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pipelines'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
