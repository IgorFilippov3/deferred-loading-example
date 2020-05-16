import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DeferredLoadingComponent } from "src/app/deferred-loading.componen";

@NgModule({
  declarations: [
    AppComponent,
    DeferredLoadingComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
