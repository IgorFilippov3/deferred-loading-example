import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-lazy",
  template: `
    <div>
      <hr>
      <div> Hello, I am lazy component!</div>
      <button (click)="handleClick()">Data from child</button>
      <hr>
    </div>
  `,
})
export class LazyComponent {
  @Output() onClick: EventEmitter<string> = new EventEmitter();
  @Input() name: string;

  handleClick(): void {
    this.onClick.emit(`My name is ${this.name}!`);
  }
}