import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlackPageRoutingModule } from './black-routing.module';

import { BlackPage } from './black.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlackPageRoutingModule
  ],
  declarations: [BlackPage]
})
export class BlackPageModule {}
