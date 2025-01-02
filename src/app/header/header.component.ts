import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userLocation: string = '';
  locationState: 'initial' | 'success' | 'error' = 'initial';

  ngOnInit() {
    // Não iniciamos a solicitação de localização automaticamente
  }

  requestLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => this.handleLocationSuccess(position),
        (error) => this.handleLocationError(error)
      );
    } else {
      this.locationState = 'error';
    }
  }

  private handleLocationSuccess(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords;
    this.reverseGeocode(latitude, longitude);
  }

  private handleLocationError(error: GeolocationPositionError) {
    console.error('Erro ao obter localização:', error);
    this.locationState = 'error';
  }

  private reverseGeocode(latitude: number, longitude: number) {
    // Aqui você deve usar um serviço de geocodificação reversa
    // Como exemplo, vamos usar a API do Nominatim do OpenStreetMap
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then(response => response.json())
      .then(data => {
        const address = data.address;
        console.log(data)
        this.userLocation = `${address.city || address.town}, ${address.state}, ${address.suburb || address.neighbourhood}`;
        this.locationState = 'success';
        localStorage.setItem('userAddress', JSON.stringify(data));
      })
      .catch(error => {
        console.error('Erro na geocodificação reversa:', error);
        this.locationState = 'error';
      });
  }
}