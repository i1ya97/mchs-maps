import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import fireData  from '../../assets/fire.json';
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
  selectSubstrate = 'streets-v11';

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style + this.selectSubstrate,
      zoom: 9,
      center: [this.lng, this.lat]
      
    });
    this.map.on('load',  map => {
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.setLayoutProperty('country-label', 'text-field', [
        'get',
        'name_ru'
        ]);
        var marker = new mapboxgl.Marker()
        .setLngLat([81, 54.8])
        .addTo(this.map);
        const data = fireData;
        data.forEach(bush => {
          var marker = new mapboxgl.Marker()
          .setLngLat([bush.xi, bush.yi])
          .addTo(this.map);
        });
        this.map.addSource("myImageSource", {
          "type": "image",
          "url": "../../assets/zem.png",
          "coordinates": [
              [74.88, 57.5],
              [86.18, 57.5],
              [86.18, 52.8],
              [74.88, 52.8]
            ]
        });
        this.map.addLayer({
            "id": "overlay",
            "source": "myImageSource",
            "type": "raster",
            "paint": {
            "raster-opacity": 0.85
            }
        });
    });
  };
  
  select(event) {
    this.selectSubstrate = event.target.value;
    this.map.setStyle(this.style + this.selectSubstrate);
    setTimeout(() =>{
    this.map.addSource("myImageSource", {
      "type": "image",
      "url": "../../assets/zem.png",
      "coordinates": [
          [74.88, 57.5],
          [86.18, 57.5],
          [86.18, 52.8],
          [74.88, 52.8]
      ]
    });
    this.map.addLayer({
        "id": "overlay",
        "source": "myImageSource",
        "type": "raster",
        "paint": {
        "raster-opacity": 0.85
        }
    });}, 1000)
  };

}
