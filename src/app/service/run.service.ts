import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class RunService {

    private static handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            if (error.status === 404) {
                errMsg = `Resource ${error.url} was not found`;    
            } else {
                const body = error.json() || '';
                const err = body.error || JSON.stringify(body);
                errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        return Observable.throw(errMsg);
    }
    
    constructor(private http: Http) {
    }

    getBaseRun(): Observable<number[]> {
        return this.http.get('/fake-backend/base-run-data')
            .map(response => response.json() as number[])
            .catch(RunService.handleError);
    }

    updateBaseRun(runData: number[]): Observable<any> {
        return this.http.put('/fake-backend/base-run-data', runData)
            .map(response => response.json())
            .catch(RunService.handleError);
    }

}