import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../core/layout.service';
import { DataService } from '../data.service';
import { City } from '../locations';
import { CityService } from './city.service';

@Component({
  selector: 'app-city-selector',
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.css'],
})
export class CitySelectorComponent {
  @Input() tooltipText!: string;

  constructor(
    private dataService: DataService,
    private cityService: CityService,
    private layoutService: LayoutService
  ) {}

  public cities: City[] = this.dataService.getLocationMetadata()[1];
  public cityObservable: Observable<City | null> = this.cityService.city;

  changeCity(city: City): void {
    this.layoutService.flyToCity(city);
  }
}
