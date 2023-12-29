import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { LogService } from './log.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class DespesesService {
  private characters = [
    { name: 'Luke Skywalker', side: '' , pagatPer : 1},
    { name: 'Darth Vader', side: '' , pagatPer: 1}
  ];
  private logService: LogService;
  charactersChanged = new Subject<void>();
  http: Http;

  constructor(logService: LogService, http: Http, private router: Router) {
    this.logService =  logService;
    this.http = http;    
  }

  fetchCharacters() {
    var domini = window.location.hostname;
    var URL_ws="";
    var host_local="192.168.1.37";
    var  host_remot="marcpv1.zapto.org";

    if (domini.includes(':')) {
      URL_ws="http://" + host_local + "/despeses/ws.php?format=json";
    } else 
    {
      if (domini.includes("192")) {
        URL_ws="http://" + host_local + "/despeses/ws.php?format=json";
      } else {
        URL_ws="http://" + host_remot + "/despeses/ws.php?format=json";
      }
    }

    console.log('Ruta per get: ' + URL_ws);

    this.http.get(URL_ws)
      .map((response: Response) => {
        const data = response.json();
        const extractedChars = data.despeses;
        const chars = extractedChars.map((char) => {
          return {name: char.despesa.establiment, 
                  description: char.despesa.descripcio, 
                  dateC: char.despesa.dataC2,
                  price: char.despesa.ImportC,
                  side: '',
                  pagatPer: char.despesa.IdPagatPer,
                  nomPagatPer: (char.despesa.IdPagatPer==1) ? "Marc" : "Anna" };
        });
        return chars;
      })
      .subscribe(
        (data) => {
          /*console.log(data);*/
          this.characters = data;
          this.charactersChanged.next();
        }
      );
  }

  getCharacters(chosenList) {
    console.log('getCharacters ' + chosenList);

    if ((chosenList === 'Tot')||(chosenList == '')) {
      /*this.characters.slice();*/
     return this.characters.filter((char) => {
      return char.side=='';
     })

    }
    return this.characters.filter((char) => {
      console.log('Filtre ' + chosenList);
      if (chosenList=='Marc') return char.pagatPer == 1;
      if (chosenList=='Anna') return char.pagatPer == 2;
    })
  }

  onSideChosen(charInfo) {
    const pos = this.characters.findIndex((char) => {
      return char.name === charInfo.name;
    })
    this.characters[pos].side = charInfo.side;
    this.charactersChanged.next();
    this.logService.writeLog('Changed side of ' + charInfo.name + ', new side: ' + charInfo.side);
  }

  addCharacter(name: string, desc: string, dataC: string, persona: number, importC: number, idCategoria: number, targeta:boolean) {

    let _targeta=targeta ? 1 : 0;

    console.log("establiment: " + name);
    console.log("desc: " + desc);
    console.log("persona: " + persona);
    console.log("dataC: " + dataC);
    console.log("importC: " + importC);
    console.log("idCategoria: " + idCategoria);
    console.log("targeta: " + _targeta);

    var domini = window.location.hostname;
    var URL_ws="";
    var host_local="192.168.1.37";
    var host_remot="marcpv1.zapto.org";

    if (domini.includes(':')) {
      URL_ws="http://" + host_local + "/despeses/ws3.php";
    } else 
    {
      if (domini.includes("192")) {
        URL_ws="http://" + host_local + "/despeses/ws3.php";
      } else {
        URL_ws="http://" + host_remot + "/despeses/ws3.php";
      }
    }

    let d= new _despesa(name, desc, dataC, persona, importC, idCategoria,_targeta);

    console.log(URL_ws);
    console.log(d);

    this.callPost(URL_ws,d);

  }

  callPost(URL_ws:string, d: _despesa) {

    const httpOptions = {
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
        'Content-Type':  'application/json'
        })
      };

    this.http.post(URL_ws, d, httpOptions).subscribe(
      (val) => {
          console.log("POST call successful value returned in body", 
                      val);
      },
      response => {
          console.log("POST call in error", response);
      },
      () => {
          console.log("The POST observable is now completed.");
      });
      
  }
 
}

export class _despesa{
  establiment: string;
  descripcio:string;
  dataC:string;
  pagatPer:number;
  importC:number;
  categoria:number;
  targeta:number;
  nomPagatPer:string;

  constructor(establiment: string, descripcio: string, dataC: string, pagatPer: number, importC: number, categoria: number, targeta: number) {
    this.establiment = establiment;
    this.descripcio = descripcio;
    this.dataC = dataC;
    this.pagatPer = pagatPer;
    this.importC = importC;
    this.categoria = categoria;
    this.targeta = targeta;
    this.nomPagatPer = "Marc";/*(this.pagatPer==1) ? "Marc" : "Anna";*/
  }
}
