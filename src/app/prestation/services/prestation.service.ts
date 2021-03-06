import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Prestation } from '../../shared/models/prestation-m';
import { fackeCollection } from './fackecollection';
import { State } from '../../shared/enums/state.enum';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class PrestationService {

  private _collection$: Observable<Prestation[]>;
  private itemsCollection: AngularFirestoreCollection<Prestation>;

  public message$: Subject<string> = new Subject();

  constructor(private afs: AngularFirestore, private http: HttpClient) {
    // this.collection = fackeCollection;
    this.itemsCollection = afs.collection<Prestation>('id');
    this.collection$ = this.itemsCollection.valueChanges().pipe(
      map((data) => {
        // console.log(data);
        const tab = [];
        data.forEach((res) => {
          tab.push(new Prestation(res));
        });
        return tab;
      })
    );

    // this.collection$ = this.http.get('urlapi/prestation');
  }

  get collection$(): Observable<Prestation[]> {
    return this._collection$;
  }

  set collection$(col: Observable<Prestation[]>) {
    this._collection$ = col;
  }


  public updatePrestation(presta: Prestation, state?: State) {
    presta.state = state;
    const prestaToUpdate = {...presta};
  }

  public addPrestation(presta: Prestation) {
    // this.collection.push(presta);
  }


  add(item: Prestation): Promise<any> {
    const id = this.afs.createId();
    const prestation = { id, ...item };
    return this.itemsCollection.doc(id).set(prestation).catch((e) => {
      console.log(e);
    });
    // return this.http.post('urlapi/prestations', item);
  }

  update(item: Prestation, option?: State): Promise<any> {
    const presta  = {...item};
    if (option) {
      presta.state = option;
    }
    return this.itemsCollection.doc(item.id).update(presta).catch((e) => {
      console.log(e);
    });

    // return this.http.patch('urlapi/prestations', item.id, presta);
  }


  delete(item: Prestation): Promise<any> {
    console.log(item);
    if (item.state === State.ANNULE) {
      return this.itemsCollection.doc(item.id).delete().catch((e) => {
        console.log(e);
      });
    }

    // return this.http.delete('urlapi/prestations/${item.id}');
  }

  getPrestation(id: string): Observable<Prestation> {
    return this.itemsCollection.doc<Prestation>(id).valueChanges();
    // return this.http.get('urlapi/prestations/${id}');
  }


}
