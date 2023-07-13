import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  });
  public isNotEdit: boolean = true;

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ]

  constructor( 
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }
  
  ngOnInit(): void {
    this.isNotEdit = !this.router.url.includes('edit');
    if( this.isNotEdit ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroById( id ) )
      ).subscribe(hero => {
        if( !hero ) return this.router.navigateByUrl('/');

        this.heroForm.reset( hero );
        return;
      })

  }

  onSubmit(): void {
    console.log(this.heroForm.invalid)
    if( this.heroForm.invalid ) return;

    if( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackBar(`Hero ${hero.superhero} updated!`);
        });

      return;
    }

    this.heroesService.addHero( this.currentHero )
        .subscribe(hero => {
          this.router.navigate(['/heroes/edit', hero.id]);
          this.showSnackBar(`Hero ${hero.superhero} created!`);

        })

  }

  onDeleteHero(): void {
    if( !this.currentHero.id ) throw new Error('Hero ID is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result ),
      switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id! ) ),
      filter( (wasDeleted: boolean) => wasDeleted ),
    )
    .subscribe(result => {
      this.router.navigateByUrl('/heroes');
      this.showSnackBar(`Hero ${this.currentHero.superhero} deleted!`);
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   if( !result ) return;

    //   this.heroesService.deleteHeroById( this.currentHero.id! )
    //     .subscribe(wasDeleted => {
    //       if( wasDeleted ) {
    //         this.router.navigateByUrl('/heroes');
    //         this.showSnackBar(`Hero ${this.currentHero.superhero} deleted!`);
    //       }
    //     })
    // });
  }

  showSnackBar( message: string ): void {
    this.snackBar.open( message, 'done', {
      duration: 2500,
    });
  }

}
