import { Component } from '@angular/core';
import { ApiDataService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title : string = 'Green IT Application';

  constructor(private apiService : ApiDataService) {
  }

}
