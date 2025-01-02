import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {


    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private dbService: DatabaseService
    ) {}


    navigateToSearchByTipoLocal(name: string) {
      this.router.navigate(['/pesquisar'], { 
        queryParams: { tipoLocal: name }
      });
    }

    scrollToMap() {
      const mapSection = document.querySelector('.map-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    ngAfterViewInit() {
      this.route.fragment.subscribe(fragment => {
        if (fragment === 'map-section') {
          const element = document.getElementById('map-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  

}
