import { Component, OnInit } from '@angular/core';
import { EatsLocationsService } from '@app/services/eats-locations.service';
import { EatsLocation } from '@app/models/eats-location';
import { AlertController, ModalController } from '@ionic/angular';
import { LocationEditModalComponent } from '@app/components/location-edit-modal/location-edit-modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss']
})
export class AdminPage implements OnInit {
  locations: EatsLocation[] = [];
  filteredLocations: EatsLocation[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  
  // Admin role check
  isAdmin: boolean = true; // TODO: Implement proper role checking
  isStaff: boolean = false; // TODO: Implement proper role checking

  constructor(
    private eatsLocationsService: EatsLocationsService,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.locations = this.eatsLocationsService.eatsLocations;
    this.filteredLocations = [...this.locations];
  }

  filterLocations() {
    this.filteredLocations = this.locations.filter(location => {
      const matchesSearch = !this.searchTerm || 
        location.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.selectedType === 'all' || 
        location.provider_type === this.selectedType;
      
      return matchesSearch && matchesType;
    });
  }

  async editLocation(location: EatsLocation) {
    const modal = await this.modalController.create({
      component: LocationEditModalComponent,
      componentProps: { location: { ...location } }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    
    if (data && data.updated) {
      this.updateLocation(data.location);
    }
  }

  async addLocation() {
    const newLocation: EatsLocation = {
      id: Date.now(),
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      provider_type: 'FoodRetailer',
      class: 'Market',
      ebt_accepted: false,
      dufb_offered: false,
      wic_accepted: false,
      hours: '',
      phone: '',
      url: '',
      notes: '',
      food_categories_list: []
    };

    const modal = await this.modalController.create({
      component: LocationEditModalComponent,
      componentProps: { location: newLocation, isNew: true }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    
    if (data && data.updated) {
      this.addNewLocation(data.location);
    }
  }

  async deleteLocation(location: EatsLocation) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${location.name}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.removeLocation(location);
          }
        }
      ]
    });

    await alert.present();
  }

  updateLocation(updatedLocation: EatsLocation) {
    const index = this.locations.findIndex(loc => loc.id === updatedLocation.id);
    if (index !== -1) {
      this.locations[index] = updatedLocation;
      this.filterLocations();
      this.saveData();
    }
  }

  addNewLocation(newLocation: EatsLocation) {
    this.locations.push(newLocation);
    this.filterLocations();
    this.saveData();
  }

  removeLocation(location: EatsLocation) {
    const index = this.locations.findIndex(loc => loc.id === location.id);
    if (index !== -1) {
      this.locations.splice(index, 1);
      this.filterLocations();
      this.saveData();
    }
  }

  saveData() {
    // In a real implementation, this would save to backend
    console.log('Saving data...');
    // For now, we'll just update the local service
    this.eatsLocationsService.eatsLocations = [...this.locations];
  }

  exportData() {
    const data = {
      locations: this.locations,
      exportDate: new Date().toISOString(),
      totalCount: this.locations.length
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flint-eats-locations.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  getProviderTypeColor(type: string): string {
    switch (type) {
      case 'FarmersMarket': return 'success';
      case 'FoodRetailer': return 'primary';
      case 'FoodPantry': return 'tertiary';
      case 'MealSite': return 'tertiary';
      case 'MobileMarket': return 'tertiary';
      default: return 'medium';
    }
  }

  getProviderIcon(type: string): string {
    switch (type) {
      case 'FarmersMarket': return 'nutrition-outline';
      case 'FoodRetailer': return 'storefront-outline';
      case 'FoodPantry': return 'cube-outline';
      case 'MealSite': return 'restaurant-outline';
      case 'MobileMarket': return 'bus-outline';
      default: return 'location-outline';
    }
  }

  getProviderTypes(): string[] {
    return ['all', 'FarmersMarket', 'FoodRetailer', 'FoodPantry', 'MealSite', 'MobileMarket'];
  }
}