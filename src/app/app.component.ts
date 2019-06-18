import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template:
        '<nb-layout>' +
        '  <nb-layout-header fixed>' +
        '    <app-navbar></app-navbar>' +
        '  </nb-layout-header>' +
        '  <nb-layout-column>' +
        '      <app-dashboard></app-dashboard>' +
        '  </nb-layout-column>' +
        '</nb-layout>'
})
export class AppComponent {
    constructor() {}
}
