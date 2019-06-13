import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content.component';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,
    NbUserModule
} from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { ContentRoutingModule } from './content-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ContentComponent, NavbarComponent, ProfileComponent, DashboardComponent],
    imports: [
        FormsModule,
        CommonModule,
        NbUserModule,
        RouterModule,
        NbSidebarModule,
        NbLayoutModule,
        NbActionsModule,
        NbCardModule,
        NbMenuModule,
        NbIconModule,
        NbCheckboxModule,
        NbInputModule,
        ContentRoutingModule,
        NbContextMenuModule,
        ReactiveFormsModule,
        NbDatepickerModule,
        NbButtonModule
    ]
})
export class ContentModule {}
