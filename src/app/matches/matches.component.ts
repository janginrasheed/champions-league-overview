import {Component, OnInit, ViewChild} from '@angular/core';
import {ComponentBase} from "../shared/base/component-base";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../services/data.service";
import {SeasonDetails} from "../types/season-details";
import {Match} from "../types/match";
import {Round} from "../types/round";
import {forkJoin, Observable} from "rxjs";
import {MatchComponent} from "../shared/match/match.component";

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent extends ComponentBase implements OnInit {
  selectedSeasonId: number;
  seasonDetails: SeasonDetails;
  public isLoading = true;
  private _errorText: string = '';
  roundMatches: Match[] = [];
  allMatches: Match[];
  rounds: Round[];
  public inputNotActive: boolean = true;

  get errorText(): string {
    return this._errorText;
  }

  set errorText(value: string) {
    this._errorText = value;
  }

  constructor(private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              public router: Router) {
    super(router);
  }

  ngOnInit(): void {
    super.ngOnInit();

    forkJoin([
      this.dataService.getAllRounds()
    ]).subscribe((data) => {
      this.rounds = data[0];
    });
    this.selectedSeasonId = this.activatedRoute.snapshot.params.seasonid;
    this.dataService.getSeasonDetails(this.selectedSeasonId).subscribe(data => {
      this.seasonDetails = data[0];
      this.isLoading = false;
    }, error => {
      this.errorText = "Fehler beim Laden";
      this.isLoading = false;
    });
    this.dataService.getSeasonMatches(this.selectedSeasonId).subscribe(data => {
      this.allMatches = data;
    });
  }

  public init() {

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
    this.dataService.updateMatchByMatchId(updatedMatch).subscribe();
  }

  // @ViewChild(MatchComponent) child:MatchComponent;
  // this.child.scoreEmitter();

}
