import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SeasonDetails} from "../types/season-details";
import {GroupDetails} from "../types/group-details";
import {ComponentBase} from "../shared/base/component-base";
import {Club} from "../types/club";
import {Season} from "../types/season";
import {MatSnackBar} from "@angular/material/snack-bar";
import {forkJoin, Observable} from "rxjs";
import {Match} from "../types/match";
import {Round} from "../types/round";
import {ClubTable} from "../types/club-table";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends ComponentBase implements OnInit {

  seasonDetails: SeasonDetails[];
  selectedClub: Club;
  selectedClubGroup: GroupDetails;
  selectedSeasonId: number;
  errorText: string = '';
  public inputNotActive = true;
  matches: Match[];
  public isLoading = true;
  clubMatches: Match[] = [];
  clubsData: ClubTable[] = [];

  constructor(private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              public router: Router,
              private snackBar: MatSnackBar) {
    super(router);
  }

  ngOnInit(): void {
    this.selectedSeasonId = this.activatedRoute.snapshot.params.seasonid;

    const seasonDetails = this.dataService.getSeasonDetails(this.selectedSeasonId);
    const matches = this.dataService.getSeasonMatches(this.selectedSeasonId);
    forkJoin([seasonDetails, matches]).subscribe(result => {
      this.seasonDetails = result[0];
      this.matches = result[1];
      this.isLoading = false;
    });

    super.ngOnInit();

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
  }

  public init() {
  }

  public clubSelected(club: Club, group: GroupDetails) {
    this.clubMatches = [];
    this.selectedClub = club;
    this.selectedClubGroup = group;
    if (!this.isLoading) {
      this.matches.forEach(match => {
        if (this.selectedClub.clubId == match.homeClubId ||
          this.selectedClub.clubId == match.awayClubId) {
          this.clubMatches.push(match);
        }
      });
      console.log(this.clubMatches);
      /********/
      let groupIndex = this.seasonDetails[0].seasonGroups.indexOf(group);
      this.seasonDetails[0].seasonGroups[groupIndex].groupClubs.forEach((club, i) => {
        this.clubsData[i].clubId = club.clubId;
        this.clubsData[i].clubLogo = club.clubLogo;
        this.clubsData[i].clubName = club.clubName;
      });
      this.clubsData.forEach(clubTable => {
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
            let index = this.clubsData.indexOf(clubTable);
            this.clubsData[index].played = clubTable.played;
            this.clubsData[index].won = clubTable.won;
            this.clubsData[index].drawn = clubTable.drawn;
            this.clubsData[index].lost = clubTable.lost;
            this.clubsData[index].goalsFor = clubTable.goalsFor;
            this.clubsData[index].goalsAgainst = clubTable.goalsAgainst;
            this.clubsData[index].goalDifference = clubTable.goalsFor - clubTable.goalsAgainst;
            this.clubsData[index].points = clubTable.points;
          }
        });
      });
    }
  }

  public updateMatchScore(updatedMatch: Match): void {
    this.dataService.updateMatchByMatchId(updatedMatch).subscribe();
    this.navigateTo();
  }

  navigateTo() {
    this.router.navigate(['/']);
  }

}
