package com.viralook.generator.network

import com.google.gson.annotations.SerializedName

data class GenerateRequest(
    @SerializedName("prompt")
    val prompt: String
)