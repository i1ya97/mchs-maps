import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import fireData from '../../assets/fire.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/';
  lat = 55;
  lng = 82.8;
  station = [];
  markers: mapboxgl.Marker[] = [];
  selectSubstrate = 'streets-v11';

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style + this.selectSubstrate,
      zoom: 9,
      center: [this.lng, this.lat]

    });
    this.map.on('load', map => {
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.setLayoutProperty('country-label', 'text-field', [
        'get',
        'name_ru'
      ]);
      const data = fireData;
      let region = data[0].data;
      region.forEach(reg => {
        this.station.push(reg.name);
      })

      // data.forEach(bush => {
      //   var marker = new mapboxgl.Marker()
      //   .setLngLat([bush.xi, bush.yi])
      //   .addTo(this.map);
      // });
    });
  };

  select(event) {
    this.selectSubstrate = event.target.value;
    this.map.setStyle(this.style + this.selectSubstrate);
  };
  selectStation(event) {

    let select = event.target.value;
    const data = fireData;
    let region = data[0].data;
    this.markers.forEach(m => {
      m.remove();
    })
    this.markers =[];
    region.forEach(reg => {
      if (reg.name === select) {
        reg.state.forEach(s => {
          this.markers.push(
            new mapboxgl.Marker()
              .setLngLat([s.xi, s.yi])
              .addTo(this.map));
          this.markers[this.markers.length-1].getElement().addEventListener('click', () => {
            alert("Clicked");
          });
        })
      }
    })
  }

}
