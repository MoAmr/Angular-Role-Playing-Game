import {Component} from '@angular/core';
import {GameControllerService} from '../../services/game-controller.service';
import {Armor, CharacterSkills, ExperienceToLevel, Hero, Weapon} from '../../models/characters';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
})
export class Inventory {

  constructor(private gameControllerService: GameControllerService) {}

  inventoryIsOpen = false;

  _characterSkills: typeof CharacterSkills = CharacterSkills;
  heroParty: Hero[] = this.gameControllerService.heroParty;
  mainCharacter: Hero = this.gameControllerService.mainCharacter;
  availableHeroes: Hero[] = this.gameControllerService.availableHeroes;
  inventory: (Weapon|Armor)[] = this.gameControllerService.partyInventory;
  _experienceToLevel: typeof ExperienceToLevel = ExperienceToLevel;

  selectedHero: Hero = this.heroParty[0];
  showAvailableHeroScreen = false;
  isFighting = this.gameControllerService.isFighting;

  openInventory() {
    this.inventoryIsOpen = true;
    this.heroParty = this.gameControllerService.heroParty;
    this.availableHeroes = this.gameControllerService.availableHeroes;
    this.inventory = this.gameControllerService.partyInventory;
    this.selectedHero = this.heroParty[0];
    this.showAvailableHeroScreen = false;
    this.isFighting = this.gameControllerService.isFighting;
  }

  closeInventory() {
    this.inventoryIsOpen = false;
  }

  setSelectedHero(newHero: Hero) {
    this.showAvailableHeroScreen = false;
    if (this.selectedHero !== newHero) {
      this.selectedHero = newHero;
    }
  }

  improveSkill(skill: CharacterSkills) {
    this.selectedHero.skills[skill]++;
    this.selectedHero.availableSkillPoints--;
  }

  equipItem(item: Weapon|Armor) {
    if (item instanceof Weapon) {
      this.inventory.push(this.selectedHero.equippedWeapon);
      this.selectedHero.equipNewWeapon(item);
    } else if (item instanceof Armor) {
      this.inventory.push(this.selectedHero.equippedArmor);
      this.selectedHero.equipNewArmor(item);
    }
    this.inventory.splice(this.inventory.indexOf(item), 1);
  }

  removeCharacterFromParty() {
    this.availableHeroes.push(this.selectedHero);
    this.heroParty.splice(this.heroParty.indexOf(this.selectedHero), 1);
    this.selectedHero = this.mainCharacter;
  }

  showAvailableHeroes() {
    this.selectedHero = undefined;
    this.showAvailableHeroScreen = true;
  }

  addHeroToParty(hero: Hero) {
    this.heroParty.push(hero);
    this.availableHeroes.splice(this.availableHeroes.indexOf(hero), 1);
    this.setSelectedHero(hero);
  }
}
