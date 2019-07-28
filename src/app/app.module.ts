import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './components/app.component';
import {CharacterCreation} from './components/character-creation/character-creation';
import {Fight} from './components/fight/fight';
import {Inventory} from './components/inventory/inventory';
import {Start} from './components/start/start';
import {Story} from './components/story/story';
import {GameControllerService} from './services/game-controller.service';

const routes: Routes = [
  { path: '', component: Start },
  { path: 'story', component: Story },
  { path: 'character-creation', component: CharacterCreation },
  { path: 'fight', component: Fight },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    Start,
    CharacterCreation,
    Story,
    Inventory,
    Fight
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [
    GameControllerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
