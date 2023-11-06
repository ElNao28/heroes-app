import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/heroe.interface';
import { HeroService } from '../../services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap, filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('',{nonNullable:true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC-Comics', desc: 'DC - Comics' },
    { id: 'Marvel-Comics', desc: 'Marvel - Comics' }
  ]

  constructor(
    private heroService:HeroService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    ){}

  ngOnInit(): void {

    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
    .pipe(
      switchMap(({id})=>this.heroService.getHeroeById(id)),
    ).subscribe(hero => {
      if(!hero) return this.router.navigateByUrl('/');

      this.heroForm.reset(hero);
      return;
    });

  }

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero

    return hero;
  }

  onSubmit():void{

    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroService.updateHero(this.currentHero)
      .subscribe(hero =>{
        this.showSnackBar(`${hero.superhero} updated!`);
      });
      return;
    }
    this.heroService.addHero(this.currentHero)
    .subscribe(hero =>{
      this.router.navigate(['heroes/edit',hero.id])
      this.showSnackBar(`${hero.superhero} created!`);
    })
  }

  onDeleteHero(){
    if(!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
    .pipe(
      filter(result =>result),
      switchMap(()=>this.heroService.deleteHeroById(this.currentHero.id)),
      filter(wasDeleted =>wasDeleted),
    )
    .subscribe(result=>{
      this.router.navigateByUrl('/');
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   if(!result) return;
    //   this.heroService.deleteHeroById(this.currentHero.id)
    //   .subscribe(wasDeleted =>{
    //     if(wasDeleted)
    //     this.router.navigateByUrl('/');
    //   });
    // });

  }

  showSnackBar(message:string):void{
    this.snackbar.open(message, 'done',{
      duration:2500,
    })
  }
}