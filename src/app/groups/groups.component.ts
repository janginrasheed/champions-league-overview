import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {SeasonDetails} from '../types/season-details';
import {ActivatedRoute, Router} from "@angular/router";
import {ComponentBase} from "../shared/base/component-base";
import {Match} from "../types/match";
import {ClubTable} from "../types/club-table";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent extends ComponentBase implements OnInit {

  public isLoading = true;
  private _errorText: string = '';
  private _selectedSeasonId: number;
  matches: Match[];
  clubsGroupsData: ClubTable[][] = [[], [], [], [], [], [], [], []];
  groupName: string[] = [];

  get selectedSeasonId(): number {
    return this._selectedSeasonId;
  }

  set selectedSeasonId(value: number) {
    this._selectedSeasonId = value;
  }

  private _seasonDetails: SeasonDetails;

  get seasonDetails(): SeasonDetails {
    return this._seasonDetails;
  }

  set seasonDetails(value: SeasonDetails) {
    this._seasonDetails = value;
  }

  get errorText(): string {
    return this._errorText;
  }

  set errorText(value: string) {
    this._errorText = value;
  }

  constructor(private dataService: DataService,
              private changeDetectorRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute,
              public router: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.seasonDetails = null;
    this._selectedSeasonId = this.activatedRoute.snapshot.params.seasonid;
    this.dataService.getSeasonDetails(this._selectedSeasonId).subscribe(data => {
      this._seasonDetails = data[0];
      this.isLoading = false;
      this.fillClubsData();
      console.log(this.clubsGroupsData);
    }, error => {
      this.errorText = "Fehler beim Laden";
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    });

    this.dataService.getSeasonMatches(this.selectedSeasonId).subscribe(data => {
      this.matches = data;
    });
    super.ngOnInit();
    // this.init()

    //Array initialisieren
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

  fillClubsData(): void {
    if (!this.isLoading) {
      this.seasonDetails.seasonGroups.forEach((group, i) => {
        this.groupName[i] = group.groupName;
        group.groupClubs.forEach((club, j) => {
          this.clubsGroupsData[i][j].clubId = club.clubId;
          this.clubsGroupsData[i][j].clubLogo = club.clubLogo;
          this.clubsGroupsData[i][j].clubName = club.clubName;
        });
        if (this.matches) {
          this.clubsGroupsData[i].forEach(clubTable => {
              clubTable.played = 0;
              clubTable.won = 0;
              clubTable.drawn = 0;
              clubTable.lost = 0;
              clubTable.goalsFor = 0;
              clubTable.goalsAgainst = 0;
              clubTable.goalDifference = 0;
              clubTable.points = 0;
              this.matches.forEach(match => {
                if (clubTable.clubId == match.homeClubId && match.homeClubGoals != null) {
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
                } else if (clubTable.clubId == match.awayClubId && match.homeClubGoals != null) {
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
  }

  public init() {

  }

}
