import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../interfaces/Pokemon';
import { LoginService } from '../services/login.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  booster: Array<Pokemon> = [];

  constructor(
    private storeService: StoreService,
    public loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.loginService.logged) {
      this.router.navigate(['login']);
    }
  }

  buyCards(): void {
    if (!(this.loginService.user?.coins >= 10)) return;

    this.booster = [];
    for (let i: number = 0; i < 10; ++i) {
      this.storeService.fetchPokemon().subscribe({
        next: (data: any) => {
          let fetchedPokemon: Pokemon = {
            poke_id: data.poke_id,
            name: data.name,
            image: data.image,
            type: data.type,
            stats: {
              attack: data.stats.attack,
              hp: data.stats.hp,
              speed: data.stats.speed,
              defense: data.stats.defense,
            },
          };
          this.booster.push(fetchedPokemon);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
    this.loginService.decreaseMoney(10);
  }

  getCard(card: Pokemon) {
    this.booster = this.booster.filter((c: Pokemon) => {
      return c.poke_id != card.poke_id;
    });
    this.loginService.addCardToDeck(card);
  }

  sellCard(card: Pokemon) {
    this.booster = this.booster.filter((c: Pokemon) => {
      return c.poke_id != card.poke_id;
    });
    this.loginService.increaseMoney(0.5);
  }
}
