import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlackPage } from './black.page';

const routes: Routes = [
  {
    path: '',
    component: BlackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlackPageRoutingModule {}
