import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<main><router-outlet /></main>`,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(160deg, #eef4f8 0%, #f7fafc 45%, #e8eef3 100%);
      font-family: Roboto, "Helvetica Neue", sans-serif;
    }
  `,
})
export class AppComponent {}
