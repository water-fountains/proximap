/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */
import { Component, OnInit } from '@angular/core';
import { DirectionsService, Leg, TravelMode } from './directions.service';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.css'],
})
export class DirectionsComponent implements OnInit {
  startCoords: any;
  goalCoords: any;
  public leg: Leg = { steps: [], duration: 0 };

  public travelMode: TravelMode = 'walking';

  constructor(private directionsService: DirectionsService) {}

  ngOnInit(): void {
    this.directionsService.directions.subscribe(data => {
      if (data !== null) {
        this.leg = data.routes[0].legs[0];
        // added for #124 to move google maps button to directions pane
        this.goalCoords = data.routes[0].geometry.coordinates.slice(-1)[0];
        this.startCoords = data.routes[0].geometry.coordinates[0];
      }
    });
  }

  changeTravelMode(): void {
    this.directionsService.setTravelMode(this.travelMode);
  }
}
