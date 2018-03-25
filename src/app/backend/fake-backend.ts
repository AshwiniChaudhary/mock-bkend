/**
 * Implementation of the Mock-Backend
 */
 
import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';


function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    // first, get Base run from the local storage or initial data array
    let data: number[] = JSON.parse(localStorage.getItem('baseRunData'))

    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
        // wrap in timeout to simulate server api call
        setTimeout(() => {
            // get all baseRunData
            if (connection.request.url.endsWith('/fake-backend/base-run-data') &&
                connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(new ResponseOptions({
                    status: 200,
                    body: data
                })));

                return;
            }

            // update baseRunData
            if (connection.request.url.endsWith('/fake-backend/base-run-data') &&
                connection.request.method === RequestMethod.Put) {
                                
                let updatedData = JSON.parse(connection.request.getBody());
                /* if (data.length === -1) {
                    localStorage.setItem('baseRunData', JSON.stringify(updatedData));
                    connection.mockRespond(new Response(new ResponseOptions({status: 200})));
                } else {
                    localStorage.setItem('baseRunData', JSON.stringify(updatedData));
                    connection.mockRespond(new Response(new ResponseOptions({status: 200})));
                } */
                localStorage.setItem('baseRunData', JSON.stringify(updatedData));
                connection.mockRespond(new Response(new ResponseOptions({
                    status: 200,
                    body: updatedData
                })));
                return;
            }

            

            // pass through any requests not handled above
            let realHttp = new Http(realBackend, options);
            let requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe((response: Response) => {
                        connection.mockRespond(response);
                    },
                    (error: any) => {
                        connection.mockError(error);
                    });
        }, 500);

    });

    return new Http(backend, options);
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
};