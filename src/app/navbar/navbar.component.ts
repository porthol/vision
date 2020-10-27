import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    constructor(private configService: ConfigService) {}

    ngOnInit() {}

    toggleConfig() {
        this.configService.toggleConfig();
    }
}
