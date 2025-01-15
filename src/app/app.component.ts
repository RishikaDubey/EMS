import { Component } from '@angular/core';
import { IndexedDBService } from './services/indexDB.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ems';

  constructor(private readonly indexedDBService: IndexedDBService) {}

  getDBStatus() {
    this.indexedDBService.getDbStatus().subscribe((isConnected) => {
      console.log('Database status:', isConnected ? 'Connected' : 'Disconnected');
    });
  }
}
