import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template:
    '<nb-layout>' +
    '  <nb-layout-header>' +
    '    <app-navbar></app-navbar>' +
    '  </nb-layout-header>' +
    '  <nb-layout-column>' +
    '      <router-outlet></router-outlet>' +
    '  </nb-layout-column>' +
    '</nb-layout>'
})
export class AppComponent {
  constructor() {}
}
