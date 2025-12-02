# 🏙 NagarSaathi – Smart Municipal Grievance Management Platform

<div align="center">

![NagarSaathi](https://img.shields.io/badge/NagarSaathi-Smart%20City-blue?style=for-the-badge&logo=google-maps)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-8.15-green?style=for-the-badge&logo=mongodb)

*A Smart Municipal Grievance Reporting & Management System*

[![Watch Live Demo Video](https://img.shields.io/badge/🎥_Watch_Live_Demo_Video-Click_Here-red?style=for-the-badge&logo=youtube)](https://drive.google.com/file/d/1koSNqW70FttERfYd2sp2oAp6D0jm0PXI/view?usp=sharing)

</div>

---

## 📖 Introduction

*NagarSaathi* is a digital platform that enables citizens to report municipal issues easily while local authorities track and resolve complaints through dashboards and analytics.

### 🎯 Project Overview
- Citizen grievance reporting  
- Real-time status tracking  
- Ward-wise complaint management  
- Admin dashboards & analytics  
- QR-based scanning and access to complaint details  
- Excel export for reporting  

---
# 🔧 Challenges Faced 

## 📍 GPS Integration
Our system automatically captures **precise location data** when citizens report issues:
- **Auto-detection**: One-tap GPS capture using browser/device location services
- **Map interface**: Interactive map for manual pin placement with draggable markers
- **Ward mapping**: Automatic ward assignment based on geolocation coordinates
- **Address validation**: Converts coordinates to readable addresses using reverse geocoding

## 🔳 QR Code Integration
Every complaint gets a **scannable digital identity**:
- **Unique QR generation**: Automatic QR creation for each new complaint
- **Mobile-friendly**: Scan with any smartphone camera to access complaint details
- **Status updates**: QR codes update in real-time as complaints progress
- **Field verification**: Workers scan codes on-site to confirm arrival and start work

## 📊 Real-Time Analytics Integration
Live insights for better municipal management:
- **Dashboard metrics**: Live counts of pending/in-progress/resolved complaints
- **Trend analysis**: Charts showing peak reporting times and common issue types
- **Performance tracking**: Average resolution times per ward and department
- **Export-ready**: One-click Excel/PDF reports with filters by date, ward, or issue type

## 🏗 System Architecture

```mermaid
graph TD
    C[👥 Citizen] -->|Submit Complaints| F[⚛ React Frontend]
    F -->|REST API| B[🟢 Node.js Backend]
    B -->|Database| D[(🗄 MongoDB Atlas)]
    B -->|QR Services| Q[🔳 QR Generator/Scanner]
    B -->|Excel Export| X[📊 Report Export]
    B -->|Location Services| M[📍 Maps/Geolocation API]
    A[🏛 Admin] -->|Manage + Update Complaints| F
