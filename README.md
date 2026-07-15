# 🌱 GrowSmart

Smart Plant Monitoring and Automatic Watering System Based on IoT

---

## 📖 Overview

GrowSmart is an Internet of Things (IoT)-based smart plant monitoring and automatic watering system designed to help users monitor plant conditions in real time and automate irrigation when needed.

The system uses an ESP32 microcontroller to collect environmental data from multiple sensors, including a DHT22 sensor for temperature and humidity, a soil moisture sensor to measure soil moisture levels, and a PIR sensor for motion detection. The collected data is sent to a web application built with Next.js, where users can monitor sensor readings, configure soil moisture thresholds, and view historical sensor data.

When the soil moisture level falls below the configured threshold, the system automatically activates a water pump to irrigate the plant. This automation helps maintain optimal soil moisture while reducing manual effort and improving water efficiency.

GrowSmart integrates IoT hardware with a modern web dashboard, providing a practical solution for smart agriculture and home plant care.

...

## ✨ Features

- 🌡️ Real-time temperature monitoring
- 💧 Real-time air humidity monitoring
- 🌱 Soil moisture monitoring
- 🚶 Motion detection using PIR sensor
- 🚿 Automatic watering system
- ⚙️ Configurable soil moisture threshold
- 📊 Sensor data history
- 🌐 Web-based dashboard for monitoring and management

...

## 🛠️ Technologies

### Frontend
- Next.js
- React
- Tailwind CSS
- TypeScript

### Backend
- Next.js API Routes
- Prisma ORM

### Database
- MySQL

### IoT Hardware
- ESP32
- DHT22 Sensor
- Soil Moisture Sensor
- PIR Motion Sensor
- Relay Module
- Water Pump

...

## 📂 Project Structure

GrowSmart/
├── app/                 # Next.js application
├── components/          # Reusable UI components
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── firmware/            # ESP32 firmware
│   ├── include/
│   ├── lib/
│   ├── src/
│   ├── test/            # Unit testing
│   └── platformio.ini
├── package.json
└── README.md

...

## 📋 Requirements

Before running this project, make sure the following software is installed:

- Node.js (v18 or later)
- npm
- Visual Studio Code
- PlatformIO Extension
- MySQL
- Git

## 🚀 Installation

Follow the steps below to set up and run the GrowSmart project.

### 1. Clone the Repository

Clone the project repository to your local machine.

```bash
git clone https://github.com/Seicy/GrowSmart.git
cd GrowSmart
```

---

## 💻 Web Application Setup

### 2. Install Dependencies

Install all required packages.

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and configure the database connection.

Example:

```env
DATABASE_URL="mysql://username:password@localhost:3306/growsmart"
```

### 4. Generate Prisma Client and Synchronize Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Web Application

Start the Next.js development server.

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 📡 ESP32 Firmware Setup

### 6. Open the Firmware Project

Open the **firmware** folder using **Visual Studio Code** with the **PlatformIO** extension installed.

```
firmware/
```

### 7. Configure Wi-Fi Credentials

Open `src/main.cpp` and update the Wi-Fi configuration.

```cpp
const char* ssid = "Your WiFi Name";
const char* password = "Your WiFi Password";
```

Also update the server URL according to your computer's local IP address.

```cpp
const char* serverUrl = "http://YOUR_LOCAL_IP:3000/api/sensor";
```

### 8. Build and Upload the Firmware

Use PlatformIO to build and upload the firmware to the ESP32 board.

---

## ▶️ Running the System

Before using the system, make sure that:

- The MySQL database is running.
- The Next.js web application is running.
- The ESP32 is connected to the same Wi-Fi network as the server.
- All sensors (DHT22, Soil Moisture, PIR) are properly connected.
- The relay module and water pump are connected correctly.

Once everything is running, the ESP32 will collect sensor data and send it to the web application in real time. The dashboard will display the latest readings, and the water pump will automatically turn on whenever the soil moisture level falls below the configured threshold.

## 📡 System Workflow

1. ESP32 reads data from DHT22, Soil Moisture, and PIR sensors.
2. Sensor data is sent to the Next.js API via Wi-Fi.
3. The server stores sensor data in the database.
4. The web dashboard displays sensor readings in real time.
5. If soil moisture falls below the configured threshold, the system automatically activates the water pump.
6. The pump stops once the desired soil moisture level is reached.

---

## 👨‍💻 Development Team

This project was developed by the **GrowSmart Development Team** as part of the Project-Based Learning (PBL) at Politeknik Negeri Batam.

- *Nadya Satya Handayani , S.Kom., M.Kom* - Project manager
- *Rafif Ihsaan Syawaly - 3312401095* - Leader
- *Alamsyah - 3312401094* - Member

---

## 📄 License

This project was developed for educational purposes as part of the **Project-Based Learning (PBL)** course at **Politeknik Negeri Batam**.

The source code is intended for learning and academic evaluation only.