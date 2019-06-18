import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    private _hideConfigWindow: boolean;

    constructor() {}

    toggleConfig() {
        this._hideConfigWindow = !this._hideConfigWindow;
    }

    openConfig() {
        this._hideConfigWindow = false;
    }

    closeConfig() {
        this._hideConfigWindow = true;
    }

    get hideConfigWindow(): boolean {
        return this._hideConfigWindow;
    }
}
