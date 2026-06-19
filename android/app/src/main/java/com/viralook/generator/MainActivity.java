
package com.viralook.generator

import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.viralook.generator.network.GenerateRequest
import com.viralook.generator.network.RetrofitClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 1. Initialize your UI components (make sure these IDs match your activity_main.xml)
        val inputEditText = findViewById<EditText>(R.id.editTextPrompt)
        val generateButton = findViewById<Button>(R.id.buttonGenerate)
        val resultImageView = findViewById<ImageView>(R.id.imageViewResult)
        val loadingProgressBar = findViewById<ProgressBar>(R.id.progressBarLoading)

        // 2. Set up the click handler
        generateButton.setOnClickListener {
            val userPrompt = inputEditText.text.toString().trim()

            if (userPrompt.isEmpty()) {
                Toast.makeText(this, "Please enter a prompt first!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Show loading spinner & disable button while the AI works
            loadingProgressBar.visibility = View.VISIBLE
            generateButton.isEnabled = false

            // 3. Fire the asynchronous request to your Google Colab backend
            val payload = GenerateRequest(prompt = userPrompt)
            
            RetrofitClient.apiService.generateImage(payload).enqueue(object : Callback<ResponseBody> {
                override fun onResponse(call: Call<ResponseBody>, response: Response<Response_body>) {
                    // Re-enable UI elements on the main thread
                    runOnUiThread {
                        loadingProgressBar.visibility = View.GONE
                        generateButton.isEnabled = true
                    }

                    if (response.isSuccessful && response.body() != null) {
                        // Success! Convert raw binary PNG bytes directly into an Android Bitmap
                        val bytes = response.body()!!.bytes()
                        val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)

                        // Display the generated image in your layout
                        runOnUiThread {
                            resultImageView.setImageBitmap(bitmap)
                        }
                    } else {
                        runOnUiThread {
                            Toast.makeText(this@MainActivity, "Server Error: ${response.code()}", Toast.LENGTH_LONG).show()
                        }
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    // Network failure (e.g. forgot to update the Ngrok URL or lost connection)
                    runOnUiThread {
                        loadingProgressBar.visibility = View.GONE
                        generateButton.isEnabled = true
                        Toast.makeText(this@MainActivity, "Connection Failed: ${t.message}", Toast.LENGTH_LONG).show()
                    }
                }
            })
        }
    }
}