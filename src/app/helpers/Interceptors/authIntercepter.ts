import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let loginAccessToken = sessionStorage.getItem("authToken");
        
        if (loginAccessToken != '' && loginAccessToken != undefined && loginAccessToken != null) {
            req = req.clone({
                setHeaders: {
                    Authorization: loginAccessToken
                }
            }
            );
        }

        return next.handle(req);
    } 
}