import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

    private baseUrl: string = enviroments.baseUrl;

    constructor(private httpClient: HttpClient) { }

    getHeroes(): Observable<Hero[]> {
        return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
    }

    getHeroById( id:string ): Observable<Hero | undefined> {
        return this.httpClient.get<Hero>(`${this.baseUrl}/heroes/${id}`)
        .pipe(
            catchError(error => of(undefined))
        );
    }

    getSuggestions( query: string ): Observable<Hero[]> {
        return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
    }

    addHero( hero: Hero ): Observable<Hero> {
        return this.httpClient.post<Hero>(`${this.baseUrl}/heroes`, hero);
    }

    updateHero( hero: Hero ): Observable<Hero> {
        console.log(hero)
        if( !hero.id ) throw new Error('El id es necesario para actualizar');

        return this.httpClient.put<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
    }

    deleteHeroById( id: string ): Observable<boolean> {
        return this.httpClient.delete<boolean>(`${this.baseUrl}/heroes/${id}`)
        .pipe(
            map( (resp) => true ),
            catchError(error => of(false)),
        );
    }

}