---
title: flutter-ship-flavor
published: 2025-04-26
description: ''
image: ''
tags: []
category: ''
draft: true 
---
## Android 

1. Refactor the package name, simple right click on the package part that you want to rename it and then choose refactor rename. 

2. Open Android app --> add flavors to gradle
```gradle
android {
    namespace = "com.kosratdahmad.myprayers"
    //...
    defaultConfig {
        //...
        applicationId = namespace
        //...
    }

    flavorDimensions += "app"
    productFlavors {
        create("dev") {
            dimension = "app"
            resValue(
                type = "string", name = "app_name", value = "MP Dev"
            )
            applicationIdSuffix = ".dev"
        }
        create("prod") {
            dimension = "app"
            resValue(
                type = "string", name = "app_name", value = "My Prayers"
            )
        }
    }
}
```
3. Add foreground, background, and monochrome in the drawable folder per flavor
4. Then add `ic_launcher.xml` file in this path `src/main/res/mipmap-anydpi-v26`
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>

    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
```
## iOS 

The best resource to follow is Flutter's doc about [ios flavors](https://docs.flutter.dev/deployment/flavors-ios)
