import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { DetailComponent } from './detail/detail.component';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

const routes: Routes = [
  { path: ':id', component: NavbarComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
