import { Component, SimpleChanges } from '@angular/core';
import { FirebaseService } from './firebase.service';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  chartOptions!: any;
  bigChart: any = [];
  constructor(private firebaseService: FirebaseService) {}

  // État de la LED (activée ou désactivée)
  isLedOn = false;

  // Méthode de communication (Firebase ou MQTT)
  communicationMethod: 'firebase' | 'mqtt' = 'firebase'; // Par défaut, communication via Firebase

  // Sujet (topic) pour MQTT (à remplacer par le sujet que le subscriber Python écoute)
  topic = 'test/hello';

  // Données du graphique
  data: any = [];

  // Highcharts
  Highcharts = Highcharts;

  // Valeur initiale du slider
  valueSlider: number = 0;

  // Propriétés du slider
  disabled: boolean = false;
  max: number = 100;
  min: number = 0;
  step: number = 25;
  thumbLabel: boolean = true;
  showTicks: boolean = true;

  // Cette fonction est utilisée pour envoyer les données du slider à Firebase
  onSliderInput(): void {
    console.log('Nouvelle valeur du slider', this.valueSlider);

    this.firebaseService.sendSliderValue(this.valueSlider);
  }

  // Cette fonction est exécutée lors de l'initialisation du composant
  ngOnInit(): void {
    // Connexion à Firebase et détection des changements dans les données du graphique
    this.firebaseService.getBigChart().subscribe((bigChartData) => {
      this.bigChart = bigChartData;
      console.log(this.bigChart);

      // Transformation des données de temps
      const transformedTimeData = this.bigChart[0]?.time.map(
        (time_tmp: any) => {
          const time = new Date(time_tmp.seconds * 1000); // Conversion des secondes en millisecondes
          const formattedTime = time.toLocaleString(); // Formatage de l'heure
          return formattedTime;
        }
      );

      // Configuration du graphique Highcharts
      this.chartOptions = {
        // Configuration générale du graphique
        chart: {
          type: 'area', // Type de graphique (graphique en aires)
          backgroundColor: '#ffffff', // Couleur de fond du graphique
          style: {
            fontFamily: "'Arial', sans-serif", // Police de caractères du texte du graphique
            color: '#333333', // Couleur du texte du graphique
          },
        },
        // Titre du graphique
        title: {
          text: 'Random DATA', // Texte du titre du graphique
          style: {
            color: '#333333', // Couleur du texte du titre
          },
        },
        // Sous-titre du graphique
        subtitle: {
          text: 'Demo', // Texte du sous-titre du graphique
          style: {
            color: '#666666', // Couleur du texte du sous-titre
          },
        },
        // Infobulle (tooltip) du graphique
        tooltip: {
          split: true, // Afficher les informations dans une infobulle divisée
          valueSuffix: ' millions', // Suffixe pour les valeurs dans l'infobulle
          backgroundColor: 'rgba(255, 255, 255, 0.75)', // Couleur de fond de l'infobulle
          style: {
            color: '#333333', // Couleur du texte de l'infobulle
          },
        },
        // Configuration des crédits du graphique
        credits: {
          enabled: false, // Désactiver l'affichage des crédits
        },
        // Configuration de l'exportation du graphique
        exporting: {
          enabled: true, // Activer l'exportation du graphique
        },
        // Configuration des séries de données
        series: [
          {
            name: 'Temperatures', // Nom de la série de données
            data: [], // Données de la série (initialement vide)
          },
        ],
        // Configuration de l'axe des abscisses (X)
        xAxis: {
          categories: [], // Catégories de l'axe des abscisses (initialement vide)
          labels: {
            style: {
              color: '#333333', // Couleur des étiquettes de l'axe des abscisses
            },
          },
          lineColor: '#666666', // Couleur de la ligne de l'axe des abscisses
          tickColor: '#666666', // Couleur des marques de l'axe des abscisses
        },
        // Configuration de l'axe des ordonnées (Y)
        yAxis: {
          labels: {
            style: {
              color: '#333333', // Couleur des étiquettes de l'axe des ordonnées
            },
          },
          lineColor: '#666666', // Couleur de la ligne de l'axe des ordonnées
          tickColor: '#666666', // Couleur des marques de l'axe des ordonnées
        },
        // Configuration de la légende du graphique
        legend: {
          itemStyle: {
            color: '#333333', // Couleur du texte de la légende
          },
        },
      };
      
      console.log("transformed data");
      console.log(transformedTimeData);
      console.log("this.data");
      console.log(this.data);

      // Mise à jour des données du graphique
      this.chartOptions.xAxis.categories = transformedTimeData;
      this.chartOptions.series = [{ data: this.bigChart[0]?.data, name: 'temperature' }];

      console.log('Options du graphique', this.chartOptions);
    });

    // Activation de l'export Highcharts
    HC_exporting(Highcharts);
  }

  // Cette fonction permet de basculer l'état de la LED (activée ou désactivée)
  toggleLed(): void {
    this.isLedOn = !this.isLedOn;
    this.communicationMethod === 'firebase';
    this.firebaseService.sendDataToFirebase(this.isLedOn);
    // ...
  }

  // Cette fonction détermine la source de l'image en fonction de la valeur du slider
  getImageSource(): string {
    if (this.valueSlider < 25) {
      return 'assets\\deg_0.jpg';
    } else if (this.valueSlider >= 25 && this.valueSlider < 50) {
      return 'assets\\deg_1.jpg';
    } else if (this.valueSlider >= 50 && this.valueSlider <= 75) {
      return 'assets\\deg_2.jpg';
    } else {
      return 'assets\\deg_3.jpg';
    }
  }
}
