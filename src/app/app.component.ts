import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: '<nb-layout>' +
        '  <nb-layout-header fixed>' +
        '    <app-navbar (toggle)="toggleConfig($event)"></app-navbar>' +
        '  </nb-layout-header>' +
        '  <nb-layout-column>' +
        '      <app-dashboard [showConfig]="showConfig" (toggle)="toggleConfig($event)"></app-dashboard>' +
        '  </nb-layout-column>' +
        '</nb-layout>'
})
export class AppComponent {
    showConfig = false;

    constructor() {
    }


    toggleConfig(value: any) {
        if (value === null) {
            this.showConfig = !this.showConfig;
        } else {
            this.showConfig = value;
        }
    }
}
