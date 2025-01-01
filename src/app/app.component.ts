import { Component } from '@angular/core';
import { MockDataService } from './mock-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'organic-farmers-portal';

  constructor(private mockDataService: MockDataService) {}

  async ngOnInit() {
    await this.mockDataService.initializeMockData();
  }

  
}
