import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../services/data.service";
import {SeasonDetails} from "../types/season-details";
import {Match} from "../types/match";
import {Round} from "../types/round";
import {forkJoin} from "rxjs";
import {ParamsService} from "../services/params.service";

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {
  seasonDetails: SeasonDetails;
  rounds: Round[];
  allMatches: Match[];
  roundMatches: Match[] = [];
  private _selectedSeasonName: String;
  private _currentRoundId: number;
  inputNotActive: boolean = true;
  selectedRound: String;
  // public isLoading = true;
  // public errorText: string = '';

  get selectedSeasonName(): String {
    return this._selectedSeasonName;
  }

  set selectedSeasonName(value: String) {
    this._selectedSeasonName = value;
  }

  get currentRoundId(): number {
    return this._currentRoundId;
  }

  set currentRoundId(value: number) {
    this._currentRoundId = value;
    this.getRoundMatches(this.currentRoundId);
    this.getRoundName();
  }

  constructor(private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private paramsService: ParamsService,
              public router: Router) {
  }

  ngOnInit(): void {
    this.paramsService.selectedSeasonName = this.activatedRoute.snapshot.params.selectedSeasonName;
    this.selectedSeasonName = this.paramsService.selectedSeasonName;
    /*
    forkJoin([
      this.dataService.getAllRounds()
    ]).subscribe((data) => {
      this.rounds = data[0];
    });

    this.dataService.getSeasonDetails(this.selectedSeasonName).subscribe(data => {
      this.seasonDetails = data[0];
      this.isLoading = false;
    }, error => {
      this.errorText = "Fehler beim Laden";
      this.isLoading = false;
    });

    this.dataService.getSeasonMatches(this.selectedSeasonName).subscribe(data => {
      this.allMatches = data;
    });
    */

    const allRounds = this.dataService.getAllRounds();
    const seasonDetails = this.dataService.getSeasonDetails(this.selectedSeasonName);
    const allMatches = this.dataService.getSeasonMatches(this.selectedSeasonName);
    forkJoin([allRounds, seasonDetails, allMatches]).subscribe(result => {
      this.rounds = result[0];
      this.seasonDetails = result[1][0];
      this.allMatches = result[2];
      this.currentRoundId = 1;
      //this.getCurrentRound();
    });
  }

  public getRoundMatches(roundId: number) {
    this.roundMatches = [];
    if (this.allMatches.length > 0) {
      this.allMatches.forEach(match => {
        if (match.roundId == roundId) {
          this.roundMatches.push(match);
        }
      });
    }
  }

  public updateMatchScore(updatedMatch: Match): void {
    if (updatedMatch.homeClubGoals.length == 0 && updatedMatch.awayClubGoals.length == 0) {
      this.dataService.deleteMatchResult(updatedMatch.matchId).subscribe();
    } else {
      this.dataService.updateMatchByMatchId(updatedMatch).subscribe();
    }
  }

  public getRoundName() {
    this.rounds.forEach(round => {
      if (round.roundId == this.currentRoundId) {
        round.roundId < 7 ? this.selectedRound = "G. " + round.round + ". Spieltag" : this.selectedRound = round.stage + " " + round.homeAway;
      }
    });
  }

}
