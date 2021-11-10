import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GroupTableComponent} from './shared/group-table/group-table.component';
import {AvatarComponent} from './shared/avatar/avatar.component';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {HomeComponent} from './home/home.component';
import {GroupsComponent} from './groups/groups.component';
import {MatchesComponent} from './matches/matches.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {ClubsComponent} from './clubs/clubs.component';
import {MatInputModule} from "@angular/material/input";
import { MatchComponent } from './shared/match/match.component';
import {MatBadgeModule} from "@angular/material/badge";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDividerModule} from "@angular/material/divider";
import { ConfigComponent } from './config/config.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupTableComponent,
    AvatarComponent,
    NavbarComponent,
    HomeComponent,
    GroupsComponent,
    MatchesComponent,
    ClubsComponent,
    MatchComponent,
    ConfigComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatInputModule,
    MatSnackBarModule,
    HttpClientModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
