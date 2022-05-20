import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {GroupsComponent} from './groups/groups.component';
import {MatchesComponent} from './matches/matches.component';
import {ConfigComponent} from "./config/config.component";
import {AboutComponent} from "./about/about.component";

const routes: Routes = [
  {
    path: 'home/:selectedSeasonName',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'groups/:selectedSeasonName',
    component: GroupsComponent,
    pathMatch: 'full'
  },
  {
    path: 'matches/:selectedSeasonName',
    component: MatchesComponent,
    pathMatch: 'full'
  },
  {
    path: 'config',
    component: ConfigComponent,
    pathMatch: 'full'
  },
  {
    path: 'about',
    component: AboutComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

/*
localhost:4200/home/{{selectedSeason}}
localhost:4200/groups/{{selectedSeason}}
localhost:4200/matches/{{selectedSeason}}
localhost:4200/matches/{{selectedSeason}}/{{roundId}}
localhost:4200/config
localhost:4200/about

localhost:4200/home/2020-2021
localhost:4200/groups/2020-2021
localhost:4200/matches/2020-2021
localhost:4200/matches/2020-2021/1
localhost:4200/config
localhost:4200/about
*/
