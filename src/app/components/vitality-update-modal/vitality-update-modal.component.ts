import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-vitality-update-modal',
  template: `
    <ion-header>
      <ion-toolbar color="success">
        <ion-title>🎉 Flint Eats Updated!</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">✕</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="update-content">
        <h2>Vitality Updates Complete</h2>
        
        <ion-list>
          <ion-item>
            <ion-icon name="checkmark-circle" slot="start" color="success"></ion-icon>
            <ion-label>
              <h3>967 Locations Loaded</h3>
              <p>Food resources + Markets data</p>
            </ion-label>
          </ion-item>
          
          <ion-item>
            <ion-icon name="color-palette" slot="start" color="primary"></ion-icon>
            <ion-label>
              <h3>Color-Coded Markers</h3>
              <p>🟢 Farmers Markets | 🔵 Grocery | 🟣 Pantries</p>
            </ion-label>
          </ion-item>
          
          <ion-item>
            <ion-icon name="search" slot="start" color="tertiary"></ion-icon>
            <ion-label>
              <h3>Live Search by Inventory</h3>
              <p>Search: apples, milk, canned goods, etc.</p>
            </ion-label>
          </ion-item>
          
          <ion-item>
            <ion-icon name="construct" slot="start" color="warning"></ion-icon>
            <ion-label>
              <h3>Admin Panel Ready</h3>
              <p>Add, edit, delete locations at /admin</p>
            </ion-label>
          </ion-item>
        </ion-list>
        
        <ion-button expand="block" color="success" (click)="dismiss()">
          Start Testing
        </ion-button>
        
        <p class="version">v2.5.0 - All 17 tests passed ✓</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .update-content {
      text-align: center;
      padding: 16px;
    }
    h2 {
      color: var(--ion-color-success);
      margin-bottom: 20px;
    }
    ion-list {
      margin: 20px 0;
      text-align: left;
    }
    .version {
      margin-top: 20px;
      color: var(--ion-color-medium);
      font-size: 12px;
    }
  `]
})
export class VitalityUpdateModalComponent {
  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
