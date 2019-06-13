import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    constructor() {
    }

    // to be managaed on back
    notifications = [
        {
            title: 'Im the notif 1',
            link: '/content/notifications/1'
        },
        {
            title: 'Im the notif 2',
            link: '/content/notifications/2'
        }
    ];

    ngOnInit() {
    }

    toggle() {
    }
}
