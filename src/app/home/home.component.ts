import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SeasonDetails} from "../types/season-details";
import {Club} from "../types/club";
import {Season} from "../types/season";
import {forkJoin} from "rxjs";
import {Match} from "../types/match";
import {ClubTable} from "../types/club-table";
import {ParamsService} from "../services/params.service";
import {Round} from "../types/round";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  seasons: Season[];
  seasonDetails: SeasonDetails;
  seasonMatches: Match[];
  rounds: Round[];
  roundMatches: Match[] = [];
  seasonName: String = this.activatedRoute.snapshot.params.selectedSeasonName;
  private _selectedSeasonName: String;
  private _selectedRoundId: number;
  isClubSelected = false;
  selectedClub: Club = {clubId: 0, clubName: "", clubLogo: "", countryId: 0};
  groupOfSelectedClub: String;
  clubMatches: Match[] = [];
  clubsData: ClubTable[] = [];
  clubsGroupsData: ClubTable[][] = [[], [], [], [], [], [], [], []];
  groupsNames: string[] = [];
  inputNotActive = true;
  isLoading = true;
  errorText: string = '';

  get selectedSeasonName(): String {
    return this._selectedSeasonName;
  }

  set selectedSeasonName(value: String) {
    this._selectedSeasonName = value;
    this.changeUrl();
    this.getData();
    this.clearSelectedClub();
  }

  get selectedRoundId(): number {
    return this._selectedRoundId;
  }

  set selectedRoundId(value: number) {
    this._selectedRoundId = value;
    this.getRoundMatches(this.selectedRoundId);
  }

  constructor(private dataService: DataService,
              private paramsService: ParamsService,
              private changeDetectorRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.checkSeasonName()) {
      this.paramsService.selectedSeasonName = this.activatedRoute.snapshot.params.selectedSeasonName;
      this.selectedSeasonName = this.paramsService.selectedSeasonName;
    } else {
      if (this.paramsService.selectedSeasonName) {
        this.selectedSeasonName = this.paramsService.selectedSeasonName;
      } else {
        this.getCurrentSeason();
      }
    }

    for (let i = 0; i < 4; i++) {
      this.clubsData[i] = {
        clubId: 0,
        clubLogo: '',
        clubName: '',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++)
        this.clubsGroupsData[i][j] = {
          clubId: 0,
          clubLogo: '',
          clubName: '',
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        };
    }

  }

  public clubSelected(selectedClub: Club, groupName: String) {

    this.clubMatches = [];
    this.selectedClub = selectedClub;
    this.groupOfSelectedClub = groupName;
    this.seasonMatches.forEach(match => {
      if (this.selectedClub.clubId == match.homeClubId ||
        this.selectedClub.clubId == match.awayClubId) {
        this.clubMatches.push(match);
      }
    });

    this.clubsGroupsData.forEach(clubsGroupData => {
      clubsGroupData.forEach(club => {
        if (club.clubId == selectedClub.clubId) {
          this.clubsData = clubsGroupData;
        }
      });
    });
    this.isClubSelected = true;
  }

  fillClubsData(): void {
    if (!this.isLoading) {
      this.seasonDetails.seasonGroups.forEach((group, i) => {
        this.groupsNames[i] = group.groupName;
        group.groupClubs.forEach((club, j) => {
          this.clubsGroupsData[i][j].clubId = club.clubId;
          this.clubsGroupsData[i][j].clubLogo = club.clubLogo;
          this.clubsGroupsData[i][j].clubName = club.clubName;
        });
        if (this.seasonMatches) {
          this.clubsGroupsData[i].forEach(clubTable => {
              clubTable.played = 0;
              clubTable.won = 0;
              clubTable.drawn = 0;
              clubTable.lost = 0;
              clubTable.goalsFor = 0;
              clubTable.goalsAgainst = 0;
              clubTable.goalDifference = 0;
              clubTable.points = 0;
              this.seasonMatches.forEach(match => {
                if (clubTable.clubId == match.homeClubId
                  && match.homeClubGoals != ""
                  && match.homeClubGoals != null
                ) {
                  clubTable.played += 1;
                  clubTable.goalsFor += +match.homeClubGoals;
                  clubTable.goalsAgainst += +match.awayClubGoals;
                  if (match.homeClubGoals > match.awayClubGoals) {
                    clubTable.won += 1;
                    clubTable.points += 3;
                  } else if (match.homeClubGoals == match.awayClubGoals) {
                    clubTable.drawn += 1;
                    clubTable.points += 1;
                  } else if (match.homeClubGoals < match.awayClubGoals) {
                    clubTable.lost += 1;
                  }
                } else if (clubTable.clubId == match.awayClubId
                  && match.homeClubGoals != ""
                  && match.homeClubGoals != null
                ) {
                  clubTable.played += 1;
                  clubTable.goalsFor += +match.awayClubGoals;
                  clubTable.goalsAgainst += +match.homeClubGoals;
                  if (match.awayClubGoals > match.homeClubGoals) {
                    clubTable.won += 1;
                    clubTable.points += 3;
                  } else if (match.awayClubGoals == match.homeClubGoals) {
                    clubTable.drawn += 1;
                    clubTable.points += 1;
                  } else if (match.awayClubGoals < match.homeClubGoals) {
                    clubTable.lost += 1;
                  }
                }
                if ((clubTable.clubId == match.homeClubId || clubTable.clubId == match.awayClubId) && match.homeClubGoals != null) {
                  let index = this.clubsGroupsData[i].indexOf(clubTable);
                  this.clubsGroupsData[i][index].played = clubTable.played;
                  this.clubsGroupsData[i][index].won = clubTable.won;
                  this.clubsGroupsData[i][index].drawn = clubTable.drawn;
                  this.clubsGroupsData[i][index].lost = clubTable.lost;
                  this.clubsGroupsData[i][index].goalsFor = clubTable.goalsFor;
                  this.clubsGroupsData[i][index].goalsAgainst = clubTable.goalsAgainst;
                  this.clubsGroupsData[i][index].goalDifference = clubTable.goalsFor - clubTable.goalsAgainst;
                  this.clubsGroupsData[i][index].points = clubTable.points;
                }
              });
            }
          );
        }
      });
    }
    console.log(this.clubsGroupsData);
  }

  getData() {
    const seasons = this.dataService.getSeasons();
    const seasonDetails = this.dataService.getSeasonDetails(this.selectedSeasonName);
    const matches = this.dataService.getSeasonMatches(this.selectedSeasonName);
    const rounds = this.dataService.getAllRounds();
    forkJoin([seasons, seasonDetails, matches, rounds]).subscribe(result => {
      this.seasons = result[0];
      this.seasonDetails = result[1];
      this.seasonMatches = result[2];
      this.rounds = result[3];
      this.selectedRoundId = 1; //TODO
      this.isLoading = false;
      this.fillClubsData();
      if (!this.seasonDetails) {
        this.getCurrentSeason();
        this.fillClubsData();
      }
    }, error => {
      this.errorText = "Fehler beim Laden der Saisondaten"
      this.isLoading = false;
      // this.changeDetectorRef.detectChanges();
    });
  }

  public updateMatchScore(updatedMatch: Match): void {
    this.dataService.updateMatchByMatchId(updatedMatch).subscribe();
    this.navigateTo(); //TODO - Reload Match & Group
  }

  navigateTo() {
    this.router.navigate(['/']);
  }

  public changeUrl(): void {
    this.paramsService.selectedSeasonName = this.selectedSeasonName;
    this.router.navigate(['home/', this.selectedSeasonName]);
  }

  public clearSelectedClub() {
    this.selectedClub = {clubId: 0, clubName: "", clubLogo: "", countryId: 0};
    this.isClubSelected = false;
  }

  public getRoundMatches(roundId: number) {
    this.roundMatches = [];
    if (this.seasonMatches.length > 0) {
      this.seasonMatches.forEach(match => {
        if (match.roundId == roundId) {
          this.roundMatches.push(match);
        }
      });
    }
  }

  public checkSeasonName(): boolean {
    if (this.seasonName) {
      if (this.seasonName.length != 9) {
        return false;
      } else return +this.seasonName.substring(0, 4) + 1 === +this.seasonName.substring(5, 9);
    }
  }

  public getCurrentSeason() {
    let todayDate = new Date();

    if ((todayDate.getMonth() + 1) < 9) {
      this.selectedSeasonName = (todayDate.getFullYear() - 1) + "-" + todayDate.getFullYear();
    } else {
      this.selectedSeasonName = todayDate.getFullYear() + "-" + (todayDate.getFullYear() + 1);
    }
    console.log(this.selectedSeasonName);
  }

}

// round.roundId < 7 ? this.selectedRound = "G. " + round.round + ". Spieltag" : this.selectedRound = round.stage + " " + round.homeAway;
