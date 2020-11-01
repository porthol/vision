import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from '../models/config';
import { map } from 'rxjs/operators';

@Injectable()
export class ConfigService {
  private _configKey = 'config';
  private _config$ = new BehaviorSubject<Config>(this._loadConfig());

  constructor() {
    this._config$.subscribe(conf => {
      localStorage.setItem(this._configKey, JSON.stringify(conf));
    });
  }

  get config$(): Observable<Config> {
    return this._config$.asObservable().pipe(
      map(conf => ({
        privateToken: conf.privateToken || null,
        refreshTime: conf.refreshTime ? (conf.refreshTime < 5 ? 5 : conf.refreshTime) : 5,
        projects: conf.projects || [],
        groups: conf.groups || []
      }))
    );
  }

  set config(config: Config) {
    this._config$.next(config);
  }

  get configSnapshot() {
    return this._config$.getValue();
  }

  private _loadConfig(): Config {
    const configFromLocal = localStorage.getItem(this._configKey);
    try {
      return configFromLocal ? JSON.parse(configFromLocal) : new Config();
    } catch (e) {
      console.error(e);
      return new Config();
    }
  }
}
