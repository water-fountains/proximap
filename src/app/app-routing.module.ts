import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";

const routes: Routes = [
  { path: '', component: NavbarComponent },
  { path: ':lang', component: NavbarComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
