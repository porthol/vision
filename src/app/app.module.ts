import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpInterceptorService } from '../services/http-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbGlobalLogicalPosition,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbProgressBarModule,
  NbSpinnerModule,
  NbThemeModule,
  NbToastrModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { GitlabService } from '../services/gitlab.service';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { ConfigModule } from './config/config.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RunnersModule } from './runners/runners.module';

@NgModule({
  declarations: [AppComponent, NavbarComponent],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NbDatepickerModule.forRoot(),
    NbThemeModule.forRoot({ name: 'dark' }),
    NbMenuModule.forRoot(),
    NbEvaIconsModule,
    NbToastrModule.forRoot({
      destroyByClick: true,
      position: NbGlobalLogicalPosition.BOTTOM_END,
      hasIcon: true
    }),
    NbLayoutModule,
    NbCardModule,
    NbIconModule,
    AppRoutingModule,
    ConfigModule,
    DashboardModule,
    RunnersModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    GitlabService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
