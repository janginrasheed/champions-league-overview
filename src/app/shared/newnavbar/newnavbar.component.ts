import {Component, OnInit} from '@angular/core';
import {NavigationPath} from "../enums/navigation-path.enum";
import {Season} from "../../types/season";
import {INavigationParameter, NavigationUtils} from "../utils/navigation-utils";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {filter, map} from "rxjs/operators";
import {ParamsService} from "../../services/params.service";

@Component({
  selector: 'app-newnavbar',
  templateUrl: './newnavbar.component.html',
  styleUrls: ['./newnavbar.component.scss']
})
export class NewnavbarComponent implements OnInit {

  selectedSeasonName: String;

  constructor(private router: Router,
              private paramsService: ParamsService) {
  }

  ngOnInit(): void {

  }

  public navigateTo(url: string): void {
    this.selectedSeasonName = this.paramsService.selectedSeasonName;
    if (url.includes("about") || url.includes("config")) {
      this.router.navigate([url]);
    } else {
      this.router.navigate([url, this.selectedSeasonName]);
    }
  }

}
