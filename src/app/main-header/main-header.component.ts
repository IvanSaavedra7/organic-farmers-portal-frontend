import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {


    constructor(
      private router: Router,
      private dbService: DatabaseService
    ) {}


    navigateToSearchByTipoLocal(name: string) {
      this.router.navigate(['/pesquisar'], { 
        queryParams: { tipoLocal: name }
      });
    }
  

}
