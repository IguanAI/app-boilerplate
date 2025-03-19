# Component Styling System

This directory contains the styling system for the Ionic Vue Boilerplate application. The system is designed to provide consistent styling across the application while reducing duplication and making it easier to maintain.

## Structure

- `variables.css`: Contains CSS variables for colors, spacing, and other design tokens
- `components.css`: Contains reusable component styles that can be used across the application

## Usage

### Card Components

```html
<!-- Basic card -->
<div class="app-card">
  <!-- Card content -->
</div>

<!-- Danger card (for logout, etc.) -->
<div class="app-card app-card-danger">
  <!-- Card content -->
</div>

<!-- Glassmorphic card (decorative element) -->
<div class="glassmorphic-card">
  <!-- Card content -->
</div>
```

### Button Components

```html
<!-- Primary button -->
<ion-button class="app-button-primary">
  Button Text
</ion-button>

<!-- Outline button -->
<ion-button class="app-button-outline" fill="outline">
  Button Text
</ion-button>

<!-- Tertiary button -->
<ion-button class="app-button-tertiary">
  Button Text
</ion-button>
```

### Form Components

```html
<!-- Input -->
<ion-item class="app-input">
  <ion-label position="floating">Label</ion-label>
  <ion-input></ion-input>
</ion-item>

<!-- Verification input (for 2FA/codes) -->
<ion-item class="app-input app-verification-input">
  <ion-label position="floating">Verification Code</ion-label>
  <ion-input></ion-input>
</ion-item>

<!-- Checkbox -->
<ion-item lines="none" class="app-checkbox">
  <ion-checkbox slot="start"></ion-checkbox>
  <ion-label>Checkbox Label</ion-label>
</ion-item>

<!-- Feature option checkbox -->
<ion-item lines="none" class="app-checkbox app-feature-option">
  <ion-checkbox slot="start"></ion-checkbox>
  <ion-label>Feature Option</ion-label>
</ion-item>

<!-- Select -->
<ion-item class="app-select-item">
  <ion-label>Select Label</ion-label>
  <ion-select class="app-select">
    <ion-select-option value="1">Option 1</ion-select-option>
    <ion-select-option value="2">Option 2</ion-select-option>
  </ion-select>
</ion-item>
```

### Animation Components

```html
<!-- Fade in animation -->
<div class="fade-in">
  <!-- Content -->
</div>

<!-- Fade in with delay -->
<div class="fade-in" style="--delay: 0.3s">
  <!-- Content -->
</div>

<!-- Fade in and slide up -->
<div class="fade-in-up">
  <!-- Content -->
</div>

<!-- Staggered card animations -->
<div class="staggered-card">Item 1</div>
<div class="staggered-card">Item 2</div>
<div class="staggered-card">Item 3</div>
```

### Layout Components

```html
<!-- Section container -->
<div class="app-section">
  <!-- Section content -->
</div>

<!-- Container with max width -->
<div class="app-container">
  <!-- Container content -->
</div>

<!-- Background pattern -->
<div class="bg-grid-pattern">
  <!-- Content -->
</div>

<!-- Text gradient -->
<h1 class="text-gradient">Heading with gradient</h1>
```

## Best Practices

1. **Use the component classes** instead of writing custom styles when possible
2. **Combine with Tailwind** for custom layouts and adjustments
3. **Maintain dark mode support** by letting the component system handle theme variations
4. **Use animations sparingly** to avoid overwhelming the user
5. **Keep custom styles to a minimum** and consider adding commonly used styles to the component system

## Customization

The component system is designed to be customizable through CSS variables. You can override these variables in your component's scoped styles or in a global stylesheet.

```css
:root {
  --card-padding-x: 2rem;
  --card-border-radius: 1.5rem;
}
```