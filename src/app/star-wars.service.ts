import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { LogService } from './log.service';
import { Router } from '@angular/router';

@Injectable()
export class StarWarsService {
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
    var host_remot="marcpv1.zapto.org";

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
                  pagatPer: char.despesa.IdPagatPer };
        });
        return chars;
      })
      .subscribe(
        (data) => {
          console.log(data);
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

  addCharacter(name, side, pagatPer) {
    const pos = this.characters.findIndex((char) => {
      return char.name === name;
    })
    if (pos !== -1) {
      return;
    }
    const newChar = {name: name, side: side, pagatPer: pagatPer};
    this.characters.push(newChar);
  }
}
