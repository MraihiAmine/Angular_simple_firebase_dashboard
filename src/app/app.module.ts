// Importation des modules nécessaires depuis Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Importation du composant principal de l'application
import { AppComponent } from './app.component';

// Importation des modules Angular Material pour les composants UI
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Importation du module FormsModule pour la gestion des formulaires
import { FormsModule } from '@angular/forms';

// Importation du module FlexLayout pour la mise en page flexible
import { FlexLayoutModule } from '@angular/flex-layout';

// Importation des modules Firebase pour la gestion des données
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';

// Importation de l'environnement Firebase depuis le fichier de configuration
import { environment } from 'src/environments/environments';

// Importation du module Highcharts pour la création de graphiques
import { HighchartsChartModule } from 'highcharts-angular';

// Après l'installation des bibliothèques Firebase, Highcharts, Flex et Angular Material,
// on les définit dans la section "imports".

// Le module FlexLayout est utilisé pour organiser la disposition des images, des boutons et des sliders.

// Les modules AngularFireAnalyticsModule, AngularFirestoreModule et AngularFireModule.initializeApp(environment.firebase)
// sont utilisés pour la communication avec Firebase.

// Le module HighchartsChartModule est utilisé pour l'utilisation de graphiques à courbes dans l'application.
@NgModule({ 
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSliderModule,
    FormsModule,
    FlexLayoutModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    HighchartsChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}