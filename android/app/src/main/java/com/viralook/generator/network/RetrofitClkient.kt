package com.viralook.generator.network

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    // 💡 Update this whenever you restart your Colab server cell
    private const val BASE_URL = "https://riverbed-foil-eastward.ngrok-free.dev/"

    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor { chain ->
                val originalRequest = chain.request()
                
                // Magic handshake header to bypass the Ngrok warning screen
                val bypassRequest = originalRequest.newBuilder()
                    .header("ngrok-skip-browser-warning", "bypass")
                    .header("Content-Type", "application/json")
                    .build()
                
                chain.proceed(bypassRequest)
            }
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .build()
    }

    val apiService: ViralookApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ViralookApiService::class.java)
    }
}