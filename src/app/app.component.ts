import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="load()">Load and bootstrap</button>
    <div class="first-content"></div>
    <app-deferred-loading [props]="props"></app-deferred-loading>
  `,
  styles: [`.first-content {
    background-color: cornflowerblue;
    width: 100%;
    height: 120vh;
  }`]
})
export class AppComponent {
  isReadyForLazyComponent: boolean;

  props = {
    name: "Spike",
    onClick: this.handleLazyComponentClick.bind(this),
  };

  load(): void {
    this.isReadyForLazyComponent = true;
  }

  handleLazyComponentClick(val): void {
    console.log(`${val}: from lazy component!`)
  }
}
