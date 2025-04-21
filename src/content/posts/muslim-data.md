---
title: "Muslim Data: A library for Islamic Apps"
published: 2025-04-21
description: ''
image: ''
tags: []
category: ''
draft: true
---

## Overview

Muslims perform prayers five times a day, and the prayer times vary from one location to another. These times are calculated based on the position of the sun relative to each specific location. The website [praytimes.org](https://praytimes.org) explains the prayer time equations in detail and even provides implementations in several programming languages.

However, not all countries follow these calculated methods. For instance, in Iraq, fixed prayer times have been set by the Ministry of Awqaf, which differ from the auto-calculated ones. Because of this, many prayer time apps do not work correctly in our region.

Back in 2014, I noticed this gap in our local Muslim community — people couldn’t rely on the available prayer apps due to the use of fixed prayer times. To address this, I started developing a prayer app called **MyPrayers**. It offers both fixed and auto-calculated prayer times, along with other features such as Azkars, Qibla direction, the 99 Names of Allah, and more. The **MyPrayers** app is available on [Google Play](https://play.google.com/store/apps/details?id=com.kosratdahmad.myprayers&pcampaignid=web_share), [AppGallery](https://appgallery.huawei.com/app/C101066833), and the [App Store](https://apps.apple.com/us/app/my-prayers/id1390015257).

Since then, my goal has been to support developers who want to build Muslim apps by creating reusable and easy-to-integrate packages for Android, iOS, and Flutter. In 2020, I began working on an open-source library called Muslim Data, which provides all the core data needed for a prayer app. This includes accurate prayer times (both fixed and calculated), Azkars, Names of Allah, multi-language support and more — all accessible with just a few lines of code.

The **Muslim Data** project is available across all three platforms:

::github{repo="my-prayers/muslim-data-android"}
::github{repo="my-prayers/muslim-data-ios"}
::github{repo="my-prayers/muslim-data-flutter"}

The **Muslim Data** follows the `repository design pattern` which only exposes one class for providing data named `MuslimRepository()`. In this article, I’ll briefly showcase the functionality of the Muslim Data package. For more details, feel free to explore the repositories linked above.

## Locations

The **Muslim Data** package has prepopulated database contains some useful location functionalities that helps developers to build an app to not depend on the internet to find location or getting the of the location. It provides **Offline Location Search**, **Geocoding**, and **Reverse Geocoding** and also the Location object has been used while getting a prayer time in the package. 

### Flutter Sample Usage 

**Search for a location**: You can search for any cities or places around the world and this is useful when a user doesn't have internet connection or user's location is turned off so that you can search here:

```dart
Future<void> searchLocationExample() async {
  final muslimRepo = MuslimRepository();
  final locations = await muslimRepo.searchLocations(locationName: 'makka');

  print("Locations: $locations");
}
```

**Geocode a location**: Use geocoder method to find a location by country code and city name.

```dart
Future<void> geocodeLocationExample() async {
  final muslimRepo = MuslimRepository();
  final location = await muslimRepo.geocoder(
    countryCode: "GB",
    locationName: "London",
  );

  if (location != null) {
    print("Location: $location");
  } else {
    print("Location name cannot be geocoded");
  }
}
```

**Reverse Geocode a location**: Use reverseGeocoder method to find a location by latitude and longitude.

```dart
Future<void> reverseGeocode() async {
  final muslimRepo = MuslimRepository();
  final location = await muslimRepo.reverseGeocoder(
    latitude: 51.5074,
    longitude: -0.1278,
  );

  if (location != null) {
    print("Location: $location");
  } else {
    print("Location could not be reverse geocoded");
  }
}
```

## Prayer Times
The `location` object holds `hasFixedPrayerTime` property to indicate whether use auto calculated prayer times or fetch it from the database. So by provide the (`Location`, `PrayerAttribute`, and `Date`) objects to the `getPrayerTimes` method, you can easily get prayer times of that location as shown below.

### Flutter Sample Usage

```dart
Future<void> getPrayerTimesExample() async {
  final muslimRepo = MuslimRepository();

  // Create a PrayerAttribute object.
  final attribute = PrayerAttribute(
    calculationMethod: CalculationMethod.makkah,
    asrMethod: AsrMethod.shafii,
    higherLatitudeMethod: HigherLatitudeMethod.angleBased,
    offset: [0, 0, 0, 0, 0, 0],
  );

  // Assume that 'location' has been retrieved using one of the location methods above.

  final prayerTime = await muslimRepo.getPrayerTimes(
    location: location,  
    date: DateTime.now(),
    attribute: attribute,
  );

  if (prayerTime != null) {
    print("Prayer Times: $prayerTime");
  }
}
```

## Azkars
As mentioned, the package has been shipped with prepopulated database that contains all Azkars from Hisnul Muslim book with its translation for the given language. Currently, it is available for these languages (`en`, `ar`, `ckb`, `ckb_BADINI`, `fa`, and `ru`). 

### Flutter Example Usage

**Azkar Category**: Get all azkar categories with its translation for the given language.

```dart
void getAzkarCategoriesExample() async {
  final muslimRepo = MuslimRepository();
  final categories = await muslimRepo.getAzkarCategories(language: Language.en);

  print("Azkar Categories: $categories");
}
```

**Azkar Chapters**: 
1. Get azkar chapters with its translation for the given language.

```dart
void getAzkarChaptersExample() async {
  final muslimRepo = MuslimRepository();
  final categories = await muslimRepo.getAzkarChapters(language: Language.en);

  print("Azkar Chapters: $categories");
}
```

2. Get azkar chapters for a specific category with its translation for the given language.


```dart
void getAzkarChaptersExample() async {
  final muslimRepo = MuslimRepository();
  final categories = await muslimRepo.getAzkarChapters(
    language: Language.en,
    categoryId: 1,
  );

  print("Azkar Chapters: $categories");
}
```

3. Get azkar chapters by chapter ids. This method is particularly useful for implementing a favorites feature on azkar. By just saving the azkar ids, you can later retrieve the full details when needed using this method, simplifying management and synchronization of your favorite azkar entries.

```dart
void getAzkarChaptersExample() async {
  final muslimRepo = MuslimRepository();
  final categories = await muslimRepo.getAzkarChaptersByIds(
    language: Language.en,
    chapterIds: [12, 15],
  );

  print("Azkar Chapters: $categories");
}
```

**Azkar Items**: Get azkar items for a specific chapter and it is localized for the given language.

```dart
void getAzkarItemsExample() async {
  final muslimRepo = MuslimRepository();
  final categories = await muslimRepo.getAzkarItems(
    language: Language.en,
    chapterId: 1,
  );

  print("Azkar Items: $categories");
}
```

## Names of Allah

Last but not least, the package provides the 99 names of Allah with its translation, and it is available for these languages (`en`, `ar`, `ckb`, `ckb_BADINI`, `fa`, and `ru`)

### Flutter Example Usage

```dart
Future<void> getNamesOfAllah() async {
  final muslimRepo = MuslimRepository();
  final names = await muslimRepo.getNames(language: Language.en);
  print("Names of Allah: $names");
}
```

## Contribution

We welcome contributions from developers of all skill levels! Whether you're improving documentation, fixing bugs, or suggesting new features, your input is invaluable. To get started, please review our guidelines on GitHub and feel free to open issues or submit pull requests.

Happy coding! 🚀