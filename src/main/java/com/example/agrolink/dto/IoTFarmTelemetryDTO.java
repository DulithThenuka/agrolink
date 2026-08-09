package com.example.agrolink.dto;

public final class IoTFarmTelemetryDTO {

    private final String deviceId;
    private final double soilMoisturePercent;
    private final double temperatureC;
    private final double humidityPercent;
    private final double soilPh;
    private final double waterTankLevelPercent;
    private final String mqttStatus;
    private final String recommendation;
    private final boolean automaticIrrigationEnabled;
    private final String valveState;
    private final String lastSyncTimestamp;

    public IoTFarmTelemetryDTO(String deviceId,
                               double soilMoisturePercent,
                               double temperatureC,
                               double humidityPercent,
                               double soilPh,
                               double waterTankLevelPercent,
                               String mqttStatus,
                               String recommendation,
                               boolean automaticIrrigationEnabled,
                               String valveState,
                               String lastSyncTimestamp) {
        this.deviceId = deviceId;
        this.soilMoisturePercent = soilMoisturePercent;
        this.temperatureC = temperatureC;
        this.humidityPercent = humidityPercent;
        this.soilPh = soilPh;
        this.waterTankLevelPercent = waterTankLevelPercent;
        this.mqttStatus = mqttStatus;
        this.recommendation = recommendation;
        this.automaticIrrigationEnabled = automaticIrrigationEnabled;
        this.valveState = valveState;
        this.lastSyncTimestamp = lastSyncTimestamp;
    }

    public String getDeviceId() { return deviceId; }
    public double getSoilMoisturePercent() { return soilMoisturePercent; }
    public double getTemperatureC() { return temperatureC; }
    public double getHumidityPercent() { return humidityPercent; }
    public double getSoilPh() { return soilPh; }
    public double getWaterTankLevelPercent() { return waterTankLevelPercent; }
    public String getMqttStatus() { return mqttStatus; }
    public String getRecommendation() { return recommendation; }
    public boolean isAutomaticIrrigationEnabled() { return automaticIrrigationEnabled; }
    public String getValveState() { return valveState; }
    public String getLastSyncTimestamp() { return lastSyncTimestamp; }
}
