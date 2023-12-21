import { Component, OnInit, Input } from '@angular/core';

import { DespesesService } from '../despeses.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() character;
  swService: DespesesService;

  constructor(swService: DespesesService) {
    this.swService = swService;
  }

  ngOnInit() {
  }

  onAssign(side) {
    // this.character.side = side;
    // this.sideAssigned.emit({name: this.character.name, side: side});
    this.swService.onSideChosen({ name: this.character.name, side: side });
  }
}
