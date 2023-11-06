import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/heroe.interface';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit{
  public heroes: Hero[]= [];

  constructor(private HeroService: HeroService){}

  ngOnInit(): void {
    this.HeroService.getHeros().subscribe(heroes => this.heroes = heroes);
  }


}
