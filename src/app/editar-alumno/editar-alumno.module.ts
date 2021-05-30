import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarAlumnoPageRoutingModule } from './editar-alumno-routing.module';

import { EditarAlumnoPage } from './editar-alumno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditarAlumnoPageRoutingModule
  ],
  declarations: [EditarAlumnoPage]
})
export class EditarAlumnoPageModule {}
