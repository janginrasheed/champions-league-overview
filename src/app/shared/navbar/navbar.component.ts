import {Component, OnInit} from '@angular/core';
import {NavigationPath} from '../enums/navigation-path.enum';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Season} from '../../types/season';
import {DataService} from '../../services/data.service';
import {filter, map} from "rxjs/operators";
import {INavigationParameter, NavigationUtils} from "../utils/navigation-utils";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  // panelOpenState = false;
  navigationPathEnum = NavigationPath;
  seasons: Season[];
  isLoading = true;
  currentPage: String;
  private _selectedSeasonId: number = 1;

  get selectedSeasonId(): number {
    return this._selectedSeasonId;
  }

  set selectedSeasonId(value: number) {
    if (this._selectedSeasonId !== value) {
      this._selectedSeasonId = value;

      const currentRouteElements = this.currentPage.split('/');

      const foundRoutes = Object.values(NavigationPath).filter(route => {
        const routeElements = route.split('/');

        if (routeElements.length !== currentRouteElements.length) return false;

        let matchRoute: boolean = true;
        routeElements.forEach((element, index) => {
            if (!matchRoute) return;

            if (element.startsWith('{{') && element.endsWith('}}')) {
              // console.log(`param: ${element}`);
            } else {
              // console.log(`${element} compare to ${currentRouteElements[index]}`);
              if (element !== currentRouteElements[index]) {
                matchRoute = false;
              }
            }
          }
        );

        return matchRoute;
      });

      // console.log(Object.values(NavigationPath));
      // console.log(foundRoutes);

      if (foundRoutes.length === 1) {
        const foundRoute = foundRoutes[0];

        const foundParamNames = foundRoute.split('/')
          .filter(element => element.startsWith('{{') && element.endsWith('}}'))
          .map(param => param.replace('{{', '').replace('}}', ''));

        if (foundParamNames.length > 0) {
          // console.log(`found params: ${foundParamNames.join(',')}`);

          const navigationParameter: INavigationParameter = {
            [foundParamNames[0]]: {
              value: this.selectedSeasonId
            }
          };
          const newUrl = NavigationUtils.getNavigationURLByString(foundRoute, navigationParameter);
          this.navigateToUrl(newUrl);
        } else {
          this.navigateToUrl(foundRoute);
        }

      } else {
        // console.log(`Eindeutige Route konnte nicht gefunden werden.`);
      }
    }
  }

  constructor(private router: Router,
              private dataService: DataService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dataService.getSeasons().subscribe(data => {
      this.seasons = data;
      this.isLoading = false;
      if (this.selectedSeasonId == null || this.selectedSeasonId > this.seasons.length || this.selectedSeasonId < this.seasons.length) {
        this.selectedSeasonId = this.checkCurrentSeason().seasonId;
      }
    });
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.rootRoute(this.activatedRoute)),
      filter((route: ActivatedRoute) => route.outlet === 'primary'),
    ).subscribe((route: ActivatedRoute) => {
      this.currentPage = this.router.routerState.snapshot.url;
      if (route.snapshot.params.seasonid >= 1) {
        this.selectedSeasonId = +route.snapshot.params.seasonid;
      } else {
        const navigationParameter: INavigationParameter = {
          ['seasonId']: {
            value: this.selectedSeasonId
          }
        };
        const newUrl = NavigationUtils.getNavigationURL(NavigationPath.SEASON_URL, navigationParameter);
        this.navigateToUrl(newUrl);
      }
    });
  }

  private rootRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  public navigateTo(url: NavigationPath) {
    const navigationParameter: INavigationParameter = {
      ['seasonId']: {
        value: this.selectedSeasonId
      }
    };
    const newUrl = NavigationUtils.getNavigationURL(url, navigationParameter);
    this.navigateToUrl(newUrl);
  }

  public navigateToUrl(url: String): void {
    // this.router.navigate([url]);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([url]);
    });
  }

  public checkCurrentSeason(): Season {
    let currentSeason: Season = {seasonId: null, season: null};
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    (currentMonth + 1) < 9 ? currentSeason.season = (currentYear - 1) + "/" + currentYear : currentSeason.season = currentYear + "/" + (currentYear + 1);

    this.seasons.forEach(season => {
      if (season.season == currentSeason.season) {
        currentSeason.seasonId = season.seasonId;
      }
    });

    return currentSeason;
  }

}
