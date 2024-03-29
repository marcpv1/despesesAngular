import { Component, OnInit } from '@angular/core';
import { DespesesService } from '../despeses.service';

import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-character',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css']
})
export class CreateCharacterComponent implements OnInit {
  Persones = [
    { display: 'Marc', value: '1' },
    { display: 'Anna', value: '2' }
  ]

  Categories = [{idCategoria:1, Nom: 'tst1'}];

  _despesesService: DespesesService;
  defaultName = '';
  dataC;
  targeta;
  http: Http;
  activatedRoute: ActivatedRoute;
  nom='';
  desc;
  comboPersones;

  constructor(_despesesService: DespesesService, http: Http, activatedRoute: ActivatedRoute) {
    this._despesesService = _despesesService;
    this.dataC = new Date().toISOString().substring(0, 10);
    this.targeta = true;

    this.http = http;

    var host_local="192.168.1.37";
    var host_remot="marcpv1.zapto.org";
    var domini = window.location.hostname;
    var URL_ws='';
    this.activatedRoute=activatedRoute;
    //this.desc='aasfdf';

    if (domini.includes(':')) {
      URL_ws="http://" + host_local + "/despeses/ws2.php?format=json";
    } else 
    {
      if (domini.includes("192")) {
        URL_ws="http://" + host_local + "/despeses/ws2.php?format=json";
      } else {
        URL_ws="http://" + host_remot + "/despeses/ws2.php?format=json";
      }
    }

    //console.log(URL_ws);

    this.http.get(URL_ws)
      .map((response: Response) => {
        const data = response.json();
        const extractedChars = data.despeses;
        const chars = extractedChars.map((char) => {
          return {idCategoria: char.despesa.idCategoria, Nom: char.despesa.Nom };
        });
        return chars;
      }).subscribe(
        (data) => {
          //console.log(data);
          this.Categories = data;
        }
      );

      //console.log('Categories ' + this.Categories);

  }

  ngOnInit() {

    let id = this.activatedRoute.snapshot.paramMap.get('id');
  
    console.log('Valor de id ' + id);

    this.comboPersones=id;

    this.activatedRoute.params.subscribe(
      (params) => {
        id = this.activatedRoute.snapshot.paramMap.get('id');
        this.comboPersones=id;
      })
      
    //console.log('Param nom: ' + this.nom);
  }

  onSubmit(submittedForm) {
    if (submittedForm.invalid) {
      return;
    }
    console.log(submittedForm);
    this._despesesService.addDespesa(submittedForm.value.establiment, submittedForm.value.desc, submittedForm.value.dataC, submittedForm.value.persona 
      , submittedForm.value.importC, submittedForm.value.categoria, submittedForm.value.targeta);

    this.alert();
  }

  alert() {
    window.alert('Nova despesa guardada correctament');
  }
}
