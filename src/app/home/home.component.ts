import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../database.service';
import { IPontoDistribuicao, IProdutor } from '../models/produtor.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  

  constructor(private router: Router
  ) {
  }

  ngOnInit() {
  }

  navigateToSearch(tipoProduto: string) {
    this.router.navigate(['/pesquisar'], { 
      queryParams: { tipoProduto: tipoProduto }
    });
  }

  ////////////////////////////////////////////

  ngAfterViewInit(): void {
    this.setupVideoLoop();
  }

  setupVideoLoop(): void {
    const video = this.bgVideo.nativeElement;

    video.addEventListener('loadedmetadata', () => {
      // Garante que o vídeo esteja mutado
      video.muted = true;

      // Tenta iniciar a reprodução
      video.play().catch(error => {
        console.log('Autoplay foi impedido:', error);
      });
    });

    video.addEventListener('timeupdate', () => {
      const buffer = 0.5; // Meio segundo antes do fim
      if (video.currentTime > video.duration - buffer) {
        video.currentTime = 0;
      }
    });

    // Reinicia o vídeo quando terminar
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play().catch(error => {
        console.log('Reinício automático foi impedido:', error);
      });
    });
  }

}
