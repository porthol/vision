import { Component, EventEmitter, OnInit, Output } from '@angular/core';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    @Output() toggle: EventEmitter<any>;

    constructor() {
        this.toggle = new EventEmitter();
    }

    ngOnInit() {}

    toggleConfig() {
        this.toggle.emit(null);
    }
}
