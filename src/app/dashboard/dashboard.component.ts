import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    @Output() toggle: EventEmitter<any>;
    configForm: FormGroup;
    @Input() showConfig: boolean;
    config: any;

    constructor() {
        this.configForm = new FormGroup({
            privateToken: new FormControl(),
            groups: new FormControl(),
            repoExclude: new FormControl()
        });

        this.showConfig = true;
        this.toggle = new EventEmitter();

        this.loadConfig();
    }

    ngOnInit() {
    }


    saveConfig() {
        this.toggleConfig(true);
        localStorage.setItem('private_token', this.configForm.getRawValue().privateToken || '');
        localStorage.setItem('groups', this.configForm.getRawValue().groups || '');
        localStorage.setItem('repo_exclude', this.configForm.getRawValue().repoExclude || '');

        this.config = { ...this.configForm.getRawValue() };
    }

    loadConfig() {
        if (localStorage.getItem('private_token')) {
            this.config = {
                privateToken: localStorage.getItem('private_token'),
                groups: localStorage.getItem('groups'),
                repoExclude: localStorage.getItem('repo_exclude')
            };
            this.configForm.patchValue(this.config);
            this.toggleConfig(true);
        }
    }

    toggleConfig(value = null) {
        this.toggle.emit(value);
    }
}
