import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, first, retry, switchMap} from 'rxjs/operators';
import {Season} from '../types/season';
import {SeasonDetails} from '../types/season-details';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Match} from "../types/match";
import {Round} from "../types/round";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _apiUrl = 'http://localhost:8081/service/rest/';

  get apiUrl(): string {
    return this._apiUrl;
  }

  set apiUrl(value: string) {
    this._apiUrl = value;
  }

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) {
  }

  public getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this.apiUrl + "seasons").pipe(
      first(),
      retry(1),
      catchError(error => {
        this.handleError(error);
        // this.snackBar.open("Fehler beim Lader der Saisons liste", "ok", {duration: 5000});
        console.error("Fehler beim Lader der Saisons liste");
        return throwError(error);
      })
    );
  }

  public getSeasonDetails(selectedSeasonName: String): Observable<SeasonDetails> {
    return this.http.get<SeasonDetails>(this.apiUrl + `seasondetails/${selectedSeasonName}`).pipe(
      first(), switchMap(data => {
        data.seasonGroups.sort((a, b) => a.groupName.localeCompare(b.groupName));
        return of(data);
      }),
      retry(1),
      catchError(error => {
        this.handleError(error);
        console.error("Fehler beim Laden der Saisondaten");
        return throwError(error);
      })
    );
  }

  public getAllRounds(): Observable<Round[]> {
    return this.http.get<Round[]>(this.apiUrl + "rounds").pipe(
      first(),
      retry(1),
      catchError(error => {
        this.handleError(error);
        console.error("Fehler beim Laden der Runden");
        return throwError(error);
      })
    );
  }

  public getSeasonMatches(selectedSeasonName: String): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl + `matches/${selectedSeasonName}`).pipe(
      first(),
      retry(1),
      catchError(error => {
        this.handleError(error);
        console.error("Fehler beim Laden der Saisonspiele");
        return throwError(error);
      })
    );
  }

  public updateMatchByMatchId(updatedMatch: Match): Observable<Match> {
    return this.http.put<Match>(this.apiUrl + `matches/updatematch/${updatedMatch.matchId}`, updatedMatch).pipe(
      first(),
      retry(1),
      catchError(error => {
        this.handleError(error);
        console.error("Fehler beim Speichern des Spielergebnisses");
        return throwError(error);
      })
    );
  }

  public deleteMatchResult(matchId: number): Observable<Match> {
    return this.http.put<Match>(this.apiUrl + `matches/deletematchresult/${matchId}`, matchId).pipe(
      first(),
      retry(1),
      catchError(error => {
        this.handleError(error);
        console.error("Fehler beim Speichern des Spielergebnisses");
        return throwError(error);
      })
    );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage)
    return throwError(errorMessage);
  }

}
