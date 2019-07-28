import {Component} from '@angular/core';
import {GameControllerService} from '../../services/game-controller.service';
import {Router} from '@angular/router';
import {Hero, Monster} from '../../models/characters';
import {CharacterAction} from '../../models/chapter';

@Component({
  selector: 'story',
  templateUrl: './story.html',
  styleUrls: ['./story.css']
})
export class Story {

  constructor(private gameControllerService: GameControllerService,
              private router: Router) {
  }

  currentChapter = this.gameControllerService.currentChapter;
  heroParty: Hero[] = this.gameControllerService.heroParty;
  enemyParty: Monster[] = this.currentChapter.enemyParty;

  actionDelay: number = this.gameControllerService.actionDelay;
  displayMessage = '';
  successMessages: string[] = [];
  showNextChapterButton = false;

  chooseAction(action: string): void {
    if (this.successMessages.length) {
      return;
    }

    this.displayMessage = `You decide to ${action}.`;
    setTimeout(() => {
      switch (action) {
        case CharacterAction.attack:
          this.tryAttack();
          break;
        case CharacterAction.sneak:
          this.trySneak();
          break;
        case CharacterAction.persuade:
          this.tryPersuade();
          break;
        case CharacterAction.doNothing:
          this.doNothing();
          break;
        default:
          console.log('Something went horribly wrong in story >> chooseAction');
      }
    }, this.actionDelay);
  }

  tryAttack(): void {
    this.gameControllerService.isFighting = true;
    this.router.navigateByUrl('/fight');
  }

  trySneak(): void {
    let sneakBarrier = 0;
    let sneakPower = 0;
    this.enemyParty.forEach(enemy => {
      sneakBarrier += enemy.barriers.sneak;
    });
    this.heroParty.forEach(hero => {
      sneakPower += hero.sneak();
    });
    if (sneakPower >= sneakBarrier) {
      this.displayMessage = `Your attempt at sneaking was a success!`;
      setTimeout(() => {
        this.onSuccess();
      }, this.actionDelay);
    } else {
      this.displayMessage = `Your attempt at sneaking was a failure!`;
      setTimeout(() => {
        this.onSneakPersuadeFailure();
      }, this.actionDelay);
    }
  }

  tryPersuade(): void {
    let persuasionBarrier = 0;
    let persuasionPower = 0;
    this.enemyParty.forEach(enemy => {
      persuasionBarrier += enemy.barriers.persuade;
    });
    this.heroParty.forEach(hero => {
      persuasionPower += hero.persuade();
    });
    if (persuasionPower >= persuasionBarrier) {
      this.displayMessage = `Your attempt at persuasion was a success!`;
      setTimeout(() => {
        this.onSuccess();
      }, this.actionDelay);
    } else {
      this.displayMessage = `Your attempt at persuasion was a failure!`;
      setTimeout(() => {
        this.onSneakPersuadeFailure();
      }, this.actionDelay);
    }
  }

  doNothing(): void {
    this.displayMessage = `You decide tp do nothing and move on.`;
    setTimeout(() => {
      this.nextChapter();
    }, this.actionDelay);
  }

  onSuccess(): void {
    this.successMessages = this.gameControllerService.encounterSuccess();
    this.showNextChapterButton = true;
  }

  onSneakPersuadeFailure(): void {
    switch (this.currentChapter.sneakPersuadeFail) {
      case CharacterAction.attack:
      default:
        this.displayMessage = `The enemy attacks you.`;
        setTimeout(() => {
          this.tryAttack();
        }, this.actionDelay);
        break;
      case CharacterAction.doNothing:
        this.displayMessage = `Your failure spoiled the opportunity and your party moves on.`;
        setTimeout(() => {
          this.nextChapter();
        }, this.actionDelay);
        break;
    }
  }

  nextChapter(): void {
    this.gameControllerService.nextChapter();
    this.currentChapter = this.gameControllerService.currentChapter;
    this.heroParty = this.gameControllerService.heroParty;
    this.enemyParty = this.currentChapter.enemyParty;
    this.displayMessage = '';
    this.successMessages = [];
    this.showNextChapterButton = false;
  }
}
