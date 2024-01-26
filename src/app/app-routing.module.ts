import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';
import { ListComponent } from './list/list.component';
import { CreateCharacterComponent } from './create-character/create-character.component';


const routes = [
    { path: 'despeses', component: TabsComponent, children: [
      { path: '', redirectTo: 'Tot', pathMatch: 'full' },
      { path: ':side', component: ListComponent }
    ] },
    { path: 'nova-despesa/:id', component: CreateCharacterComponent },
    { path: '**', redirectTo: '/despeses/' }
  ];

  @NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
  })
  export class AppRoutingModule {};