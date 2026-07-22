#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// Konfigurasi Wi-Fi
const char* ssid = "Bulkup";
const char* password = "12345698";

// URL API Server Laptop (Pastikan IP sesuai dengan hasil ipconfig terbaru)
const char* serverUrl = "http://10.87.33.169:3000/api/sensor"; 

// Konfigurasi Sensor DHT22
#define DHTPIN 4          
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Konfigurasi Sensor PIR
#define PIRPIN 13         

// Konfigurasi Sensor Soil Moisture
#define SOILPIN 34        // Menggunakan pin ADC1_CH6 yang aman saat Wi-Fi aktif

// Nilai Kalibrasi Analog Sensor Tanah (Sesuaikan dengan hasil pengujian fisikmu)
const int AIR_VALUE = 3500;   // Nilai saat probe benar-benar kering di udara (0%)
const int WATER_VALUE = 1500; // Nilai saat probe dicelupkan ke air (100%)

// Fungsi untuk mengirim seluruh data sensor ke API Next.js
void kirimDataKeWeb(float suhu, float kelembapanAir, int motion, float kelembapanTanah) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Membuat dokumen JSON
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["temperature"] = suhu;
    jsonDoc["humidity"] = kelembapanAir;
    jsonDoc["motionDetected"] = (motion == HIGH) ? true : false;
    jsonDoc["soilMoisture"] = kelembapanTanah; 
    jsonDoc["plantId"] = 1; 

    String payload;
    serializeJson(jsonDoc, payload);

    // Mengirim HTTP POST
    int httpResponseCode = http.POST(payload);
    if (httpResponseCode > 0) {
      Serial.print("[HTTP] Data Terkirim! Respons kode: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("[HTTP] Pengiriman Gagal. Error: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  } else {
    Serial.println("[Wi-Fi] Terputus, tidak dapat mengirim data.");
  }
}

void setup() {
  Serial.begin(115200);
  
  // Inisialisasi Driver Sensor
  dht.begin();
  pinMode(PIRPIN, INPUT);
  pinMode(SOILPIN, INPUT); 
  
  // Memulai Koneksi Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Menghubungkan ke Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nTersambung ke Wi-Fi!");
  Serial.print("IP ESP32: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // 1. Membaca Sensor DHT22
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  // SOLUSI BYPASS: Jika DHT22 error/lepas, sistem tidak macet dan tetap membaca sensor lain
  if (isnan(t) || isnan(h)) {
    Serial.println("Warning: Gagal membaca DHT22! Menyetel nilai sementara ke 0.");
    t = 0.0;
    h = 0.0;
  }

  // 2. Membaca Sensor PIR (Gerakan)
  int statusGerakan = digitalRead(PIRPIN);

  // 3. Membaca Sensor Soil Moisture (Kelembapan Tanah)
  int rawSoil = analogRead(SOILPIN);
  
  // Menampilkan nilai analog asli untuk kalibrasi hardware
  Serial.print("NILAI ANALOG RAW SOIL: "); 
  Serial.println(rawSoil); 
  
  // Konversi nilai analog ke persentase 0 - 100% menggunakan mapping kalibrasi
  float persentaseSoil = map(rawSoil, AIR_VALUE, WATER_VALUE, 0, 100);
  
  // Batasi rentang nilai persentase agar tetap logis di 0% - 100%
  if (persentaseSoil < 0) persentaseSoil = 0;
  if (persentaseSoil > 100) persentaseSoil = 100;

  // Tampilkan data ke Serial Monitor untuk keperluan debugging fisik
  Serial.println("=================================");
  Serial.print("Suhu Udara       : "); Serial.print(t); Serial.println(" °C");
  Serial.print("Kelembapan Udara : "); Serial.print(h); Serial.println(" %");
  Serial.print("Kelembapan Tanah : "); Serial.print(persentaseSoil); Serial.println(" %");
  Serial.print("Deteksi Gerakan  : "); Serial.println((statusGerakan == HIGH) ? "ADA GERAKAN!" : "Aman");
  Serial.println("=================================");

  // Kirim semua data terintegrasi ke Next.js laptop
  kirimDataKeWeb(t, h, statusGerakan, persentaseSoil);

  // Interval pengiriman data berkala setiap 5 detik
  delay(5000);
}