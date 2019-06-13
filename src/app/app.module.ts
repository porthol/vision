import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpInterceptorService } from '../services/http-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    NbDatepickerModule,
    NbGlobalLogicalPosition,
    NbMenuModule,
    NbSidebarService,
    NbThemeModule,
    NbToastrModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { UserService } from '../services/user.service';

// import { registerLocaleData } from '@angular/common';
// import localeFr from '@angular/common/locales/fr';
//
// // the second parameter 'fr' is optional
// registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        NbDatepickerModule.forRoot(),
        NbThemeModule.forRoot({ name: 'dark' }),
        NbMenuModule.forRoot(),
        NbEvaIconsModule,
        NbToastrModule.forRoot({
            destroyByClick: true,
            position: NbGlobalLogicalPosition.BOTTOM_END,
            hasIcon: true
        })
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
        NbSidebarService,
        UserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
