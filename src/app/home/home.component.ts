import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../database.service';
import { IPontoDistribuicao, IProdutor } from '../models/produtor.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { CadastroModalComponent } from '../cadastro-modal/cadastro-modal.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  private map!: L.Map;
  private markers: (L.Marker | L.LayerGroup)[] = [];
  showProducers = true;
  showMarkets = true;
  showFairs = true;
  mapInitialized = false;

  
  categories = [
    { name: 'Frutas', type: 'frutas', image: 'fruits.jpg' },
    { name: 'Legumes', type: 'legumes', image: 'vegetables.jpg' },
    { name: 'Hortaliças', type: 'hortaliças', image: 'greens.jpg' },
    { name: 'Grãos', type: 'grãos', image: 'grains.jpg' },
    { name: 'Animal', type: 'animal', image: 'animal.png' },
    { name: 'Tubérculos', type: 'tuberculos', image: 'tuberculos.jpg' },
  ];

  popularItems: (IPontoDistribuicao | IProdutor)[] = [];

  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPopularItems();
  }

  openCadastroModal() {
    const dialogRef = this.dialog.open(CadastroModalComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Atualizar a lista de itens ou fazer qualquer outra ação necessária
      }
    });
  }

  async loadPopularItems() {
    const allItems = [
      ...(await this.dbService.getPontosDistribuicao()),
      ...(await this.dbService.getProdutores())
    ];
    this.popularItems = this.shuffleArray(allItems).slice(0, 3);
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  navigateToSearch() {
    this.router.navigate(['/pesquisar']);
  }

  navigateToSearchByCategory(category: string) {
    this.router.navigate(['/pesquisar'], { 
      queryParams: { tipoProduto: category }
    });
  }

  navigateToSearchByName(name: string) {
    this.router.navigate(['/pesquisar'], { 
      queryParams: { nome: name }
    });
  }

  ////////////////////////////////////////////

  async ngAfterViewInit(): Promise<void> {
    this.setupVideoLoop();
    await this.initMap();
    this.mapInitialized = true;
    await this.loadMarkers();
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

  ///////////////////////////////////////////////////////

  private async initMap(): Promise<void> {
    const userAddress = JSON.parse(localStorage.getItem('userAddress') || '{}');
    const cidadeMaisOcorrencias = await this.getCidadeMaisOcorrencias();
    
    let mapCenter: [number, number];
    
    if (userAddress.lat && userAddress.lon) {
      mapCenter = [parseFloat(userAddress.lat), parseFloat(userAddress.lon)];
    } else {
      const coords = await this.geocodeAddress({ cidade: cidadeMaisOcorrencias });
      mapCenter = coords || [-22.9068, -47.0628]; // Default para Campinas
    }
  
    this.map = L.map('map').setView(mapCenter, 12);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private async loadMarkers(): Promise<void> {
    const produtores = await this.dbService.getProdutores();
    const pontosDistribuicao = await this.dbService.getPontosDistribuicao();
  
    if (this.showProducers) {
      await this.addMarkers(produtores, 'produtor');
    }
    
    if (this.showMarkets) {
      await this.addMarkers(pontosDistribuicao.filter(p => p.tipo === 'mercado'), 'mercado');
    }
    
    if (this.showFairs) {
      await this.addMarkers(pontosDistribuicao.filter(p => p.tipo === 'feira'), 'feira');
    }
  }

  private async addMarkers(items: (IProdutor | IPontoDistribuicao)[], type: string): Promise<void> {
    for (const item of items) {
      try {
        const coordinates: [number, number] = [item.latitude, item.longitude];
        
        let icon: L.Icon<L.IconOptions>;
        const circleColor: string = 'rgba(8, 84, 18, 0.54)'; // Verde semi-transparente
  
        switch (type) {
          case 'produtor':
            icon = L.icon({
              iconUrl: 'assets/icons/producer-icon.png',
              iconSize: [25, 25],
              iconAnchor: [12, 12], // Ajustado para o centro do ícone
              popupAnchor: [1, -34],
            });
            break;
          case 'mercado':
            icon = L.icon({
              iconUrl: 'assets/icons/market-icon.png',
              iconSize: [25, 25],
              iconAnchor: [12, 12], // Ajustado para o centro do ícone
              popupAnchor: [1, -34],
            });
            break;
          case 'feira':
            icon = L.icon({
              iconUrl: 'assets/icons/fair-icon.png',
              iconSize: [25, 25],
              iconAnchor: [12, 12], // Ajustado para o centro do ícone
              popupAnchor: [1, -34],
            });
            break;
          default:
            icon = L.icon({
              iconUrl: 'assets/icons/default-icon.png',
              iconSize: [25, 25],
              iconAnchor: [12, 12], // Ajustado para o centro do ícone
              popupAnchor: [1, -34],
            });
        }
  
        const circle = L.circleMarker(coordinates, {
          radius: 18,
          fillColor: circleColor,
          fillOpacity: 1,
          color: 'transparent',
          weight: 1
        });
  
        const marker = L.marker(coordinates, { icon: icon });
        
        marker.bindPopup(`
          <strong>${item.nome}</strong><br>
          ${item.rua}, ${item.bairro}<br>
          ${item.cidade} - ${item.estado}
        `);
        
        // Crie um grupo de camadas com o círculo e o marcador
        const group = L.layerGroup([circle, marker]);
        
        // Adicione o grupo ao mapa
        group.addTo(this.map);
  
        // Adicione o grupo ao array de marcadores
        this.markers.push(group);
      } catch (error) {
        console.error('Erro ao adicionar marcador:', error);
      }
    }
  }
  
  async updateMarkers(): Promise<void> {
    if (!this.map) {
      console.error('Mapa não inicializado');
      return;
    }
  
    this.markers.forEach(group => {
      if (group instanceof L.LayerGroup) {
        group.removeFrom(this.map);
      }
    });
  
    this.markers = [];
    await this.loadMarkers();
  }
  private async geocodeAddress(item: Partial<IProdutor | IPontoDistribuicao>): Promise<[number, number] | null> {
    const address = item.cidade ? item.cidade : `${item.rua}, ${item.bairro}, ${item.cidade}, ${item.estado}, ${item.cep}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.error('Erro na geocodificação:', error);
    }
  
    return null;
  }



  private async getCidadeMaisOcorrencias(): Promise<string> {
    const produtores = await this.dbService.getProdutores();
    const pontosDistribuicao = await this.dbService.getPontosDistribuicao();
    
    const todosEnderecos = [...produtores, ...pontosDistribuicao];
    const contagem = todosEnderecos.reduce((acc, item) => {
      acc[item.cidade] = (acc[item.cidade] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});
  
    let cidadeMaisOcorrencias = '';
    let maxOcorrencias = 0;
  
    for (const [cidade, ocorrencias] of Object.entries(contagem)) {
      if (ocorrencias > maxOcorrencias) {
        cidadeMaisOcorrencias = cidade;
        maxOcorrencias = ocorrencias;
      }
    }
  
    return cidadeMaisOcorrencias || 'Campinas';
  }

}
