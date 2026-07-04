package com.viralook.generator.network

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ViralookApiService {
    
    @POST("generate")
    fun generateImage(
        @Body request: GenerateRequest
    ): Call<ResponseBody>
}