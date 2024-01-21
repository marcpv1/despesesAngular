import { Component, OnInit, OnDestroy } from '@angular/core';
import { DespesesService } from '../despeses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  activatedRoute: ActivatedRoute;
  swService: DespesesService;
  loadedSide = 'Tot';
  subscription;

  importTotal=0;
  importPagatPer1=0;
  importPagatPer2=0;
  importPendentPagar1=0;
  importPendentPagar2=0;
  OperacioPendent1="";
  OperacioPendent2="";

  constructor(activatedRoute: ActivatedRoute, swService: DespesesService) {
    this.activatedRoute = activatedRoute;
    this.swService = swService;
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(
      (params) => {
        this.importTotal=this.swService.sumaDespeses(params.side);
        console.log('params.side  ' + params.side);

        this.CarregarPagariCobrar();
      }
    );
    this.subscription = this.swService.charactersChanged.subscribe(
      () => {
        console.log('loadedSide ' + this.loadedSide);

        this.CarregarPagariCobrar();
      }
    );

  }

  CarregarPagariCobrar() {
    
      this.importTotal = Number(this.swService.sumaDespeses(this.loadedSide).toFixed(2));
      this.importPagatPer1 = Number(this.swService.sumaDespeses('Marc').toFixed(2));
      this.importPagatPer2 = Number(this.swService.sumaDespeses('Anna').toFixed(2));

      let importDiferencia=Number(this.importPagatPer1)-Number(this.importPagatPer2);

      this.importPendentPagar1=Number((Number(importDiferencia)/2).toFixed(2));
      this.importPendentPagar2=-(this.importPendentPagar1);

      if (this.importPendentPagar1<this.importPendentPagar2) {
          this.OperacioPendent1="Pagar"; this.OperacioPendent2="Cobrar";
      } else {
          this.OperacioPendent1="Cobrar"; this.OperacioPendent2="Pagar";
      }
      this.importPendentPagar1=Math.abs(this.importPendentPagar1);
      this.importPendentPagar2=Math.abs(this.importPendentPagar2);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
