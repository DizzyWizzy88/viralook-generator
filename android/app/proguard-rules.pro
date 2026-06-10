# Firebase Rules
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**

# Stripe Rules
-keep class com.stripe.** { *; }
-dontwarn com.stripe.**

# Handle Vercel / Webview (If you are loading your site in a frame)
-keepattributes EnclosingMethod
-keepattributes InnerClasses
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# General Networking/JSON (Prevents data from being scrambled)
-keepnames class com.google.gson.** { *; }
-keepclassmembernames class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
