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

  // private apiUrl = 'http://localhost:8081/service/rest/';

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) {
  }

  public getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(`http://localhost:8081/service/rest/seasons`).pipe(
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

  public getSeasonDetails(selectedSeasonName: String): Observable<SeasonDetails[]> {
    return this.http.get<SeasonDetails[]>(`http://localhost:8081/service/rest/seasondetails/${selectedSeasonName}`).pipe(
      first(), switchMap(data => {
        data.forEach(seasonDetail => {
          seasonDetail.seasonGroups.sort((a, b) => a.groupName.localeCompare(b.groupName));
        });
        return of(data);
      }),
      retry(1),
      catchError(error => {
        this.handleError(error);
        console.error("Fehler beim Lader der Saisondaten");
        return throwError(error);
      })
    );
  }

  public insertSeason(data: Season) {
    return this.http.post<Season>("http://localhost:8081/service/rest/seasons", data).pipe(
      first(),
      retry(1),
      catchError(error => {
        this.handleError(error);
        console.error("Fehler beim Hinzufügen der Saison");
        return throwError(error);
      })
    );
  }

  public getAllRounds(): Observable<Round[]> {
    return this.http.get<Round[]>(`http://localhost:8081/service/rest/rounds`).pipe(
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
    return this.http.get<Match[]>(`http://localhost:8081/service/rest/matches/${selectedSeasonName}`).pipe(
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
    return this.http.put<Match>(`http://localhost:8081/service/rest/matches/updatematch/${updatedMatch.matchId}`, updatedMatch).pipe(
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
    return this.http.put<Match>(`http://localhost:8081/service/rest/matches/deletematchresult/${matchId}`, matchId).pipe(
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

/* TO DELETE
public getSeasonDetails2(selectedSeasonId: number): Observable<SeasonDetails[]> {
  return this.http.get<SeasonDetails[]>(`http://localhost:8081/service/rest/seasondetails2/${selectedSeasonId}`).pipe(
    first(), switchMap(data => {
      data.forEach(seasonDetail => {
        seasonDetail.seasonGroups.sort((a, b) => a.groupName.localeCompare(b.groupName));
      });
      return of(data);
    }), catchError(error => {
      this.snackBar.open("Fehler beim Lader der Saisondaten", "ok", {duration: 30000});
      console.error("Fehler beim Lader der Saisondaten");
      return throwError(error);
    })
  );
}

public getSeasonMatches2(selectedSeasonId: number): Observable<Match[]> {
  return this.http.get<Match[]>(`http://localhost:8081/service/rest/matches/${selectedSeasonId}`).pipe(
    first()
  );
}
*/
