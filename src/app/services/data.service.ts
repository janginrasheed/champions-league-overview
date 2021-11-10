import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, first, switchMap} from 'rxjs/operators';
import {Season} from '../types/season';
import {SeasonDetails} from '../types/season-details';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Match} from "../types/match";
import {Round} from "../types/round";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) {
  }

  public getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(`http://localhost:8081/service/rest/seasons`).pipe(
      first(), catchError(error => {
        this.snackBar.open("Fehler beim Lader der Saisonen", "ok", {duration: 10000});
        console.error("Fehler beim Lader der Saisonen");
        return throwError(error);
      })
    );
  }

  public getSeasonDetails(selectedSeasonId: number): Observable<SeasonDetails[]> {
    return this.http.get<SeasonDetails[]>(`http://localhost:8081/service/rest/seasondetails/${selectedSeasonId}`).pipe(
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


    public insertSeason(data: Season) {
      return this.http.post<Season>("http://localhost:8081/service/rest/seasons", data).pipe(
        first()
      );
    }

  public getAllRounds(): Observable<Round[]> {
    return this.http.get<Round[]>(`http://localhost:8081/service/rest/rounds`).pipe(
      first()
    );
  }

  public getSeasonMatches(selectedSeasonId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`http://localhost:8081/service/rest/matches/${selectedSeasonId}`).pipe(
      first()
    );
  }

  public updateMatchByMatchId(updatedMatch: Match): Observable<Match> {
    return this.http.put<Match>(`http://localhost:8081/service/rest/matches/updatematch/${updatedMatch.matchId}`, updatedMatch).pipe(
      first()
    );
  }

}
