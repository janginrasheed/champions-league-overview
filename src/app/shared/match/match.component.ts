import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Match} from "../../types/match";
import {SeasonDetails} from "../../types/season-details";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  @Input()
  public inputNotActive: boolean = true;

  @Output()
  public updatedMatchEmitter: EventEmitter<Match> = new EventEmitter<Match>();

  @Input()
  match: Match;

  @Input()
  seasonDetails: SeasonDetails;

  matchDetails: any = {
    homeClub: {
      name: null,
      id: null,
      goals: null,
      logo: null
    },
    awayClub: {
      name: null,
      id: null,
      goals: null,
      logo: null
    },
    matchDate: null,
    round: null,
    group: null
  };

  constructor() {
  }

  ngOnInit(): void {
    if (this.seasonDetails) {
      this.seasonDetails.seasonGroups.forEach(value => {
        value.groupClubs.forEach(value1 => {
          if (value1.clubId == this.match.homeClubId) {
            this.matchDetails.homeClub.name = value1.clubName;
            this.matchDetails.homeClub.id = value1.clubId;
            this.matchDetails.homeClub.logo = value1.clubLogo;

          } else if (value1.clubId == this.match.awayClubId) {
            this.matchDetails.awayClub.name = value1.clubName;
            this.matchDetails.awayClub.id = value1.clubId;
            this.matchDetails.awayClub.logo = value1.clubLogo;
          }

        });
      });
      this.seasonDetails.seasonGroups.forEach(group => {
        group.groupClubs.forEach(club => {
          if (club.clubName == this.matchDetails.homeClub.name || club.clubName == this.matchDetails.awayClub.name) {
            this.matchDetails.group = group.groupName;
          }
        })
      });
    }

    this.matchDetails.homeClub.goals = this.match.homeClubGoals;
    this.matchDetails.awayClub.goals = this.match.awayClubGoals;
    this.matchDetails.matchDate = this.match.date;
  }


  public editClicked(): void {
    this.inputNotActive = false;
  }

  public saveClicked(): void {
    this.match.homeClubGoals = this.matchDetails.homeClub.goals;
    this.match.awayClubGoals = this.matchDetails.awayClub.goals;

    if ((this.match.homeClubGoals == null && this.match.awayClubGoals == null)
      || !(this.match.homeClubGoals == null
        || this.match.awayClubGoals == null
        || +this.match.homeClubGoals > 99
        || +this.match.awayClubGoals > 99
        || +this.match.awayClubGoals < 0
        || +this.match.homeClubGoals < 0)) {
      this.inputNotActive = true;
      this.updatedMatchEmitter.emit(this.match);
    } else {
      this.inputNotActive = false;
    }
  }
}
