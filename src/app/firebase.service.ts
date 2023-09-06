import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';

// Interface définissant la structure des données de température
export interface temperatureModel {
  temperature: number;
  time: any;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  bigChart!: any[];

  // Récupération des données à partir de Firebase pour le grand graphique
  getBigChart(): Observable<any[]> {
    return this.temperatureObservable.pipe(
      map((temperatureData) => {
        // Transformation des données de température en un format compatible avec le graphique
        const newData = [
          {
            name: 'Temperatures',
            data: temperatureData.map((data) => data.temperature),
            time: temperatureData.map((data) => data.time),
          },
        ];

        // Mise à jour des données du grand graphique
        this.updateBigChart(newData);
        // this.updatePieChart(pieData);

        return newData;
      })
    );
  }

  // Mise à jour des données du grand graphique
  updateBigChart(newData: any[]) {
    this.bigChart = newData;
    console.log('this.updateBigChart', this.bigChart);
  }

  // Envoi de données à Firebase pour contrôler l'état de la LED
  sendDataToFirebase(isLedOn: boolean) {
    this.fireStoreService
      .collection('ledStatus')
      .doc('ledDocument')
      .set(
        {
          isLedOn: isLedOn,
        },
        { merge: true }
      ) // Utilisation de l'option merge pour mettre à jour ou ajouter si cela n'existe pas
      .then(() => {
        console.log('État de la LED mis à jour ou ajouté');
      })
      .catch((error: any) => {
        console.error(
          "Erreur lors de la mise à jour des données de l'état de la LED : ",
          error
        );
      });
  }

  // Cette fonction modifie la valeur "value" dans le document slide_document
  // qui est dans la collection sliderValue
  sendSliderValue(newValue: number) {
    this.fireStoreService
      .collection('sliderValue')
      .doc('slide_document')
      .set(
        {
          value: newValue,
        },
        { merge: true }
      ) // Utilisation de l'option merge pour mettre à jour ou ajouter si cela n'existe pas
      .then(() => {
        console.log('Données de la valeur du slider mises à jour ou ajoutées');
      })
      // En cas de problème, affichage dans la console de l'application
      .catch((error: any) => {
        console.error(
          'Erreur lors de la mise à jour des données de la valeur du slider : ',
          error
        );
      });
  }

  private temperatureCollection!: AngularFirestoreCollection<temperatureModel>;
  temperatureObservable!: Observable<temperatureModel[]>;

  // Constructeur de la classe FirebaseService
  constructor(private readonly fireStoreService: AngularFirestore) {
    // Initialisation de la collection Firestore pour les données de température
    this.temperatureCollection =
      fireStoreService.collection<temperatureModel>('TemperatureData');

    /*
  Description détaillée de ce constructeur :

Le constructeur est responsable de l'initialisation de la classe FirebaseService. Il prend en argument le service AngularFirestore, qui permet d'interagir avec Firebase Firestore.

Dans la première ligne, la propriété temperatureCollection est initialisée en utilisant le service AngularFirestore. Elle représente la collection Firestore où sont stockées les données de température.

Ensuite, un observable (temperatureObservable) est créé pour surveiller les changements dans la collection TemperatureData. Cela permet à l'application de réagir aux mises à jour en temps réel des données de température dans Firestore.

La méthode snapshotChanges() est utilisée pour obtenir un instantané des changements dans la collection. Cela inclut les ajouts, les mises à jour et les suppressions de documents.

En utilisant l'opérateur map, chaque action de changement est transformée en un objet JavaScript contenant les données de température et l'identifiant unique du document. Cela facilite l'utilisation de ces données dans d'autres parties de l'application.

En résumé, ce constructeur initialise la connexion à Firebase Firestore et crée un observable pour surveiller les changements dans la collection de données de température. Cela permet à l'application d'obtenir des mises à jour en temps réel des données de température à partir de Firebase.
  */

    // Création d'un observable pour surveiller les changements dans la collection de données de température
    this.temperatureObservable = this.temperatureCollection
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map((a: any) => {
            // Extraction des données de température du document Firestore
            let temperatureData = a.payload.doc.data() as temperatureModel;
            // Extraction de l'identifiant unique du document Firestore
            let id = a.payload.doc.id;

            // Transformation des données de Firebase en un format utilisable
            return {
              id,
              ...temperatureData,
            };
          })
        )
      );
  }

  // Ajout de fausses données de température à Firebase
  addFakeTemperatureData() {
    const fakeData = [
      {
        temperature: 25,
        time: { seconds: 1676011320, nanoseconds: 211000000 },
      },
      {
        temperature: 30,
        time: { seconds: 1676014320, nanoseconds: 311000000 },
      },
      {
        temperature: 35,
        time: { seconds: 1676017320, nanoseconds: 411000000 },
      },
      // Ajoutez plus de fausses données au besoin
    ];

    // Ajout des données simulées à la collection Firebase
    fakeData.forEach((data) => {
      this.fireStoreService
        .collection<temperatureModel>('TemperatureData')
        .add(data);
    });
  }
}
