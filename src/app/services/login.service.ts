import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../interfaces/Pokemon';
import { User } from '../interfaces/User';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public user: User = {
    username: '',
    coins: 0,
    cards: [],
  };
  public logged: boolean = false;
  private token: string = '';
  private BURL = 'https://lostin70s.com/lpwebfront/api/poke-user';

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string): void {
    this.http
      .post(`${this.BURL}/login`, {
        name: username,
      })
      .subscribe({
        next: (data: any) => {
          this.token = data.token;

          this.http
            .get(`${this.BURL}/user`, {
              headers: {
                token: this.token,
              },
            })
            .subscribe({
              next: (data: any) => {
                this.user = {
                  username: data.name,
                  coins: data.coins,
                  cards: data.deck,
                };
                this.logged = true;
                this.router.navigate(['deck']);
              },
              error: (err) => {
                console.error(err);
              },
            });
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  disconnect(): void {
    this.http
      .delete(this.BURL, {
        headers: {
          token: this.token,
        },
      })
      .subscribe({
        next: (data: any) => {
          this.logged = false;
          this.token = '';
          this.user = {
            username: '',
            coins: 0,
            cards: [],
          };
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getUser(): void {
    this.http
      .get(`${this.BURL}/user`, {
        headers: {
          token: this.token,
        },
      })
      .subscribe({
        next: (data: any) => {
          this.user = {
            username: data.name,
            coins: data.coins,
            cards: data.deck,
          };
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  decreaseMoney(amount: number): void {
    this.http
      .put(
        this.BURL,
        {
          name: this.user.username,
          coins: this.user.coins - amount,
          deck: this.user.cards,
        },
        {
          headers: {
            token: this.token,
          },
        }
      )
      .subscribe({
        next: (data: any) => {
          this.getUser();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  increaseMoney(amount: number): void {
    this.http
      .put(
        this.BURL,
        {
          name: this.user.username,
          coins: this.user.coins + amount,
          deck: this.user.cards,
        },
        {
          headers: {
            token: this.token,
          },
        }
      )
      .subscribe({
        next: (data: any) => {
          this.getUser();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  addCardToDeck(card: Pokemon): void {
    this.user.cards.push(parseInt(card.poke_id));
    this.http
      .put(
        this.BURL,
        {
          name: this.user.username,
          coins: this.user.coins,
          deck: this.user.cards,
        },
        {
          headers: {
            token: this.token,
          },
        }
      )
      .subscribe({
        next: (data: any) => {
          this.getUser();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
