import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

    private baseUrl = enviroments.baseUrl;
    private user?: User;

    constructor(private httpClient: HttpClient) { }
    
    get currentUser(): User | undefined {
        if( !this.user ) return undefined;

        return structuredClone(this.user);
    }

    login( email: string, password: string ): Observable<User> {
        return this.httpClient.get<User>(`${ this.baseUrl }/users/1`)
        .pipe(
            tap( user => { this.user = user }),
            tap( user => localStorage.setItem('id', 'asdjsajsajdSAJKAS.ASDKASJD.sadasld1') )
        )
    }

    checkAuthentication(): Observable<boolean> {

        if( !localStorage.getItem('id') ) return of(false);

        const token = localStorage.getItem('id');

        return this.httpClient.get<User>(`${ this.baseUrl }/users/1`)
            .pipe(
                tap( user => { this.user = user }),
                map(user => !!user),
                catchError( error => of(false) )
            )
    }

    logout(): void {
        this.user = undefined;
        localStorage.clear();
    }

}