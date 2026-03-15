# Flint Eats Platform - Tagging Reference Guide

## 📁 Workspace Structure Reference

### **Data Sources (@data)**
- `2025-06-markets (2).csv` - Commercial food retailers (441 locations)
- `2025-06-foodpantrysites (2).csv` - Food pantry locations
- `food_resources (2).json` - Comprehensive food resource database (526 locations)
- `locations_without_coordinates (1).csv` - Locations needing geocoding
- `locations_without_coordinates-updated.csv` - Updated geocoding list

### **Scripts (@scripts)**
- `analyze_data_sources.js` - Data integrity analysis
- `cleanup_markets.js` - Data cleaning utilities
- `validate_locations.cjs` - Location validation

### **Documentation (@docs)**
- `Pages and Functions 1.md` - Core platform documentation
- `Pages and Functions 2.md` - Feature specifications

---

## 🎨 Location Tagging System

### **Provider Types & Color Coding**

| Type | Icon | Color Code | Badge | Data Source |
|------|------|------------|-------|-------------|
| **FarmersMarket** | 🍎 Green Apple | 🟢 Green | N/A | food_resources.json |
| **FoodRetailer** | 🏪 Store | 🔵 Blue | Credit Card (EBT) | markets.csv |
| **FoodPantry** | 🥫 Canned Goods | 🟣 Purple | N/A | food_resources.json |
| **MealSite** | 🍽️ Fork/Spoon | 🟣 Purple | N/A | food_resources.json |
| **MobileMarket** | 🚐 Mobile | 🟣 Purple | Seasonal | food_resources.json |
| **WIC_SNAP_Office** | 🏢 Office | 🟡 Yellow | N/A | food_resources.json |

### **Program Badges**

| Program | Badge | Field | Values |
|---------|-------|-------|--------|
| **EBT/SNAP** | 💳 Credit Card | `ebt_accepted` | true/false |
| **DUFB** | 🥕🪙 Carrot+Coin | `dufb_offered` | true/false |
| **WIC** | 🍼 WIC | `wic_accepted` | true/false |

---

## 📄 Pages & Associated Functions

### **1. Local Food Locator (@pages:nearby)**
**File**: `src/app/pages/nearby/nearby.page.ts`

**Functions**:
- `getNearby()` - Distance-based location finding
- `searchByInventory()` - Live-filtering by food items
- `filterByPrograms()` - Filter by EBT/DUFB/WIC
- `getIconForLocation()` - Color-coded icon assignment

**Tags**:
- `@map-component`
- `@geolocation`
- `@color-coded-markers`
- `@live-filtering`

**Associated Data**:
- `@data:food_resources.json`
- `@data:markets.csv`
- `@services:eats-locations.service.ts`

---

### **2. Social Feed (@pages:feed)**
**File**: `src/app/pages/feed/feed.page.ts`

**Functions**:
- `sharePost()` - Native OS sharing
- `likePost()` - Heart/like functionality
- `moderateContent()` - Content moderation

**Tags**:
- `@social-networking`
- `@community-discussion`
- `@content-moderation`
- `@haptic-feedback`

**Associated Services**:
- `@services:feed.service.ts`
- `@services:discourse-integration`

---

### **3. Education Library (@pages:library)**
**File**: `src/app/pages/library/library.page.ts`

**Functions**:
- `loadEducationalContent()` - JSON-based content loading
- `displayCards()` - Card-based layout
- `filterByCategory()` - Category filtering

**Tags**:
- `@education-hub`
- `@json-content`
- `@card-layout`
- `@sustainability-content`

**Content Categories**:
- `healthy-swaps`
- `eating-the-rainbow`
- `composting`
- `food-waste-reduction`
- `gardening-planning`

---

### **4. Video Library (@pages:library/detail)**
**File**: `src/app/pages/library/detail/detail.page.ts`

**Functions**:
- `playVideo()` - Full-screen playback
- `loadOnboardingVideos()` - Welcome tutorials
- `handleZIndexFix()` - Pop-up container fixes

**Tags**:
- `@video-library`
- `@onboarding`
- `@multimedia`
- `@z-index-fixes`

**Priority Content**:
- `welcome-video`
- `need-help-tutorial`

---

### **5. Profile & Account (@pages:me)**
**File**: `src/app/pages/me/me.page.ts`

**Functions**:
- `manageProfile()` - Profile management
- `setSafetyTags()` - Allergy/safety preferences
- `deleteAccount()` - Account deletion (CA Delete Act)
- `verifyAge()` - Age verification (2026 compliance)
- `sendCredentialsEmail()` - Email credentials

**Tags**:
- `@profile-management`
- `@2026-compliance`
- `@age-verification`
- `@data-privacy`
- `@safety-tags`
- `@account-deletion`

**Compliance Features**:
- `@digital-identity-wallet`
- `@biometric-age-estimation`
- `@parental-consent`
- `@session-tracking`
- `@zero-party-data`

---

### **6. Calendar & Events (@components:calendar)**
**File**: `src/app/components/calendar/calendar.component.ts`

**Functions**:
- `displayEvents()` - Event scheduling
- `setNotifications()` - 30-min pre-event alerts
- `fixViewMoreButton()` - Navigation fixes

**Tags**:
- `@calendar`
- `@event-tracking`
- `@notifications`
- `@mobile-markets`

---

### **7. Rewards Dashboard (@pages:rewards)**
**File**: `src/app/pages/rewards/rewards.page.ts`

**Functions**:
- `trackPoints()` - Point system tracking
- `calculateSharePoints()` - Social sharing rewards
- `displayLoyaltyStatus()` - Tier status

**Tags**:
- `@gamification`
- `@rewards`
- `@loyalty-program`
- `@share-points`
- `@behavioral-economics`

**Point Values**:
- Post creation: 10 points
- Referral: 5 points
- Event sharing: Share Points

---

### **8. Benefits & Deals (@pages:deals)**
**File**: `src/app/pages/me/deals/deals.page.ts`

**Functions**:
- `loadDeals()` - Coupon aggregation
- `groceryBudgeter()` - Budget planning tool
- `checkGeofence()` - Location-based deals
- `contextualUI()` - Weather/time-based UI

**Tags**:
- `@benefits-awareness`
- `@snap-assistance`
- `@dufb-program`
- `@geofencing`
- `@contextual-ui`
- `@grocery-budgeter`

---

### **9. Admin Portal (@pages:admin)** ⭐ NEW
**File**: `src/app/pages/admin/admin.page.ts`

**Functions**:
- `manageLocations()` - CRUD operations
- `moderateDeals()` - Deal approval workflow
- `manageGeofences()` - Geofence management
- `viewAnalytics()` - Analytics dashboard
- `exportData()` - Data export

**Tags**:
- `@admin-portal`
- `@content-moderation`
- `@rbac`
- `@data-management`
- `@analytics`
- `@export`

**Roles**:
- `Super Admin` - Full system access
- `Community Moderator` - Deal/Social feed moderation
- `Health Educator` - Educational content management

---

### **10. Location Detail Views**

#### **Market Detail (@pages:detail/market)**
**File**: `src/app/pages/detail/market/market-detail.page.ts`
**Tags**: `@market-detail`, `@retailer-info`, `@inventory-display`

#### **Food Pantry Detail (@pages:detail/foodpantrysite)**
**File**: `src/app/pages/detail/foodpantrysite/foodpantrysite-detail.page.ts`
**Tags**: `@pantry-detail`, `@eligibility-info`, `@hours-display`

---

## 🗄️ Data Models & Tags

### **EatsLocation Interface**
```typescript
interface EatsLocation {
  id: number;                    // @primary-key
  name: string;                  // @location-name
  address: string;               // @address
  lat: number;                   // @latitude
  lng: number;                   // @longitude
  provider_type: FoodResourceType; // @provider-type @color-coded
  ebt_accepted: boolean;          // @ebt-badge @program-filter
  dufb_offered: boolean;        // @dufb-badge @program-filter
  wic_accepted: boolean;        // @wic-badge @program-filter
  food_categories_list: string[]; // @inventory-tags @searchable
  hours: string;                // @operating-hours
  phone: string;               // @contact-info
  url: string;                // @website
  notes: string;             // @additional-info
}
```

---

## 🔍 Search & Filter Tags

### **Searchable Fields**
- `@searchable:name` - Location name
- `@searchable:address` - Street address
- `@searchable:inventory` - Food categories
- `@searchable:provider-type` - Type of provider

### **Filter Categories**
- `@filter:ebt` - EBT/SNAP accepted
- `@filter:dufb` - Double Up Food Bucks
- `@filter:wic` - WIC accepted
- `@filter:open-now` - Currently open
- `@filter:allergy-safe` - Allergy-safe locations
- `@filter:type` - Provider type

---

## 🛡️ Compliance & Privacy Tags

### **2026 Regulatory Compliance**
- `@compliance:age-verification` - Biometric/digital ID
- `@compliance:parental-consent` - Minor protection
- `@compliance:ca-delete-act` - Account deletion
- `@compliance:session-tracking` - Usage limits
- `@compliance:zero-party-data` - Explicit preferences

### **Privacy Features**
- `@privacy:data-retention` - Automated deletion
- `@privacy:shadow-social-graph` - Minor protection
- `@privacy:geolocation-restrictions` - Location privacy

---

## 🎮 Gamification Tags

### **Point System**
- `@gamification:post-points` - 10 points per post
- `@gamification:referral-points` - 5 points per referral
- `@gamification:share-points` - Social sharing rewards
- `@gamification:loyalty-tiers` - Tiered status system

---

## 🗺️ Geolocation Tags

### **Map Features**
- `@geolocation:genesee-county` - County boundary
- `@geolocation:geofencing` - 500m proximity alerts
- `@geolocation:clustering` - Marker clustering
- `@geolocation:distance-calculation` - Distance to user

### **Contextual Features**
- `@contextual:weather-based` - Weather UI adaptation
- `@contextual:time-based` - Time-based recommendations
- `@contextual:location-check-in` - Automatic prompts

---

## 📊 Analytics Tags

### **Tracking Metrics**
- `@analytics:search-terms` - Most searched items
- `@analytics:location-views` - Location popularity
- `@analytics:user-engagement` - App usage patterns
- `@analytics:program-utilization` - Benefits usage

---

## 🔧 Development Tags

### **Technical Implementation**
- `@tech:leaflet-divicon` - Custom map markers
- `@tech:client-side-caching` - Performance optimization
- `@tech:edge-computing` - Local processing
- `@tech:discourse-api` - Community discussion
- `@tech:firebase` - Backend database
- `@tech:react-tailwind` - Admin portal stack

### **AI Integration**
- `@ai:content-moderation` - Automated moderation
- `@ai:customizer` - Natural language component generation
- `@ai:loading-states` - Transparent AI processing

---

## 📱 Component Hierarchy

```
@pages:admin
├── @components:location-edit-modal
├── @services:eats-locations.service
└── @guards:admin-auth.guard

@pages:nearby
├── @components:map-popup
├── @services:eats-locations.service
└── @services:geolocation.service

@pages:feed
├── @components:eats-ugc-card
├── @services:feed.service
└── @services:discourse.service

@pages:me
├── @pages:me/deals
├── @pages:me/recipes
├── @pages:me/reviews
└── @services:user.service
```

---

## ✅ Usage Examples

### **Searching by Tags**
```javascript
// Find all EBT-enabled farmers markets
locations.filter(loc => 
  loc.provider_type === 'FarmersMarket' && 
  loc.ebt_accepted === true
);

// Search by inventory
eatsLocationsService.searchByInventory('carrots');

// Filter by programs
filterByPrograms({ ebtOnly: true, dufbOnly: false });
```

### **Color Coding Logic**
```javascript
getProviderTypeColor(type) {
  switch(type) {
    case 'FarmersMarket': return 'success';  // Green
    case 'FoodRetailer': return 'primary'; // Blue
    case 'FoodPantry': return 'tertiary';  // Purple
    default: return 'medium';
  }
}
```

---

*Generated: 2026-03-14*
*Total Locations: 967*
*Data Sources: food_resources.json + markets.csv*