import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pipelines',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'runners',
        loadChildren: () => import('./runners/runners.module').then(m => m.RunnersModule)
      },
      {
        path: 'config',
        loadChildren: () => import('./config/config.module').then(m => m.ConfigModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'config'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
