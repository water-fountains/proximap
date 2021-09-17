import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { City } from '../locations';
import { CityService } from './city.service';

@Component({
  selector: 'app-city-selector',
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.css'],
})
export class CitySelectorComponent {
  @Input() tooltipText: string;

  constructor(private dataService: DataService, private cityService: CityService) {}

  public cities: City[] = this.dataService.getLocationMetadata()[1];
  public cityObservable: Observable<City> = this.cityService.city;

  changeCity(city: City): void {
    this.cityService.setCity(city);
  }
}
