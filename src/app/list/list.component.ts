import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DespesesService } from '../despeses.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  despeses = [];
  activatedRoute: ActivatedRoute;
  swService: DespesesService;
  loadedSide = 'Tot';
  subscription;

  constructor(activatedRoute: ActivatedRoute, swService: DespesesService) {
    this.activatedRoute = activatedRoute;
    this.swService = swService;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params) => {
        this.despeses = this.swService.getDespeses(params.side);
        this.loadedSide = params.side;
      }
    );
    this.subscription = this.swService.despesesChanged.subscribe(
      () => {
        this.despeses = this.swService.getDespeses(this.loadedSide);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
