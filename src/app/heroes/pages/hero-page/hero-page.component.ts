import { Component, OnInit } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../interfaces/heroe.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {

  public heroId?: Hero;

  constructor(
    private heroService: HeroService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.activateRoute.params
      .pipe(
        switchMap(({ id }) => this.heroService.getHeroeById(id)),
      ).subscribe(hero => {
        if (!hero) return this.router.navigate(['/heroes/list']);

        this.heroId = hero;
        return;
      })
  }

  goBack():void{
    this.router.navigateByUrl('heroes/list')
  }
}
