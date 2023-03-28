import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../interfaces/Pokemon';
import { LoginService } from '../services/login.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css'],
})
export class DeckComponent implements OnInit {
  currentFilter: number = 0;
  renderedList: Array<Pokemon> = [];

  constructor(
    public loginService: LoginService,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    if (!this.loginService.logged) {
      this.router.navigate(['login']);
    }

    this.getPokemons();
  }

  updateFilter(event) {
    this.currentFilter = event.target.value;
  }

  getPokemons() {
    for (let pokeId of this.loginService.user?.cards) {
      this.storeService.fetchPokemonById(pokeId).subscribe({
        next: (data: Pokemon) => {
          this.renderedList.push(data);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
