import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class GitlabService {
    private resourceUrl = environment.apiUrl + '/users';

    constructor(private httpClient: HttpClient) {}

    getProjects(id: string, criteria = {} as any) {
        return this.httpClient.get(this.resourceUrl + '/' + id, { params: criteria });
    }
}
