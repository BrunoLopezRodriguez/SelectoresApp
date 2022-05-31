import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../intefaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region   : ['',[Validators.required,  ],  ],
    pais     : ['',[Validators.required,  ],  ],
    frontera : ['',[Validators.required,  ],  ],
  })

  regiones: string[]= [];
  paises: PaisSmall[]=[];
 // fronteras: string []= [];
  fronteras: PaisSmall[]= [];
  pais2!: Pais

  //UI
  cargando: boolean = false;


  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // this.miFormulario.get('region')?.valueChanges
    // .subscribe(region => {
    //   console.log(region);

    //   this.paisesService.getPaisesPorRegion(region)
    //   .subscribe(paises=>{
    //     console.log(paises);
    //     this.paises=paises;
    //   })
    // })

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      }),
      switchMap( region=> this.paisesService.getPaisesPorRegion(region))
    )
    .subscribe(paises => {
      console.log(paises);
      this.paises= paises;
      this.cargando = false;
    })

    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
        if(this.miFormulario.get('pais')?.value!==''){
          this.pais2 = this.miFormulario.get('pais')?.value[0];
        }
      }),
      switchMap( pais => this.paisesService.getPaisPorCodigo(pais) ),
      switchMap((pais) => this.paisesService.getPaisesPorCodigos(this.pais2.borders))

    )
    .subscribe(paises => {
        this.fronteras = paises
        this.cargando = false;
      }
    );
  }

  guardar(){

    console.log(this.miFormulario.value);
  }



}
