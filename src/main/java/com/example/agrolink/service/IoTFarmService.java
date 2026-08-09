package com.example.agrolink.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.example.agrolink.dto.IoTFarmTelemetryDTO;

@Service
public class IoTFarmService {

    private static final Logger logger = LoggerFactory.getLogger(IoTFarmService.class);

    private final Map<String, String> valveStateMap = new ConcurrentHashMap<>();

    public IoTFarmTelemetryDTO getFarmTelemetry(String deviceId) {
        String targetDeviceId = (deviceId != null && !deviceId.isBlank()) ? deviceId : "ESP32-AGRO-8941";
        logger.info("Fetching IoT farm telemetry for deviceId: {}", targetDeviceId);

        String currentValveState = valveStateMap.getOrDefault(targetDeviceId, "CLOSED");

        double soilMoisture = 32.0;
        double temperature = 29.0;
        double humidity = 71.0;
        double soilPh = 6.4;
        double waterTank = 38.0;

        String recommendation = currentValveState.equals("OPEN")
                ? "Drip irrigation active. Target soil moisture 65% in progress."
                : "Irrigation required within the next 4 hours (Soil moisture at 32%).";

        return new IoTFarmTelemetryDTO(
                targetDeviceId,
                soilMoisture,
                temperature,
                humidity,
                soilPh,
                waterTank,
                "CONNECTED (Broker: mqtt://broker.agrolink.io:1883)",
                recommendation,
                true,
                currentValveState,
                "Just now"
        );
    }

    public IoTFarmTelemetryDTO triggerIrrigationValve(String deviceId, boolean enable) {
        String targetDeviceId = (deviceId != null && !deviceId.isBlank()) ? deviceId : "ESP32-AGRO-8941";
        String newState = enable ? "OPEN" : "CLOSED";
        valveStateMap.put(targetDeviceId, newState);

        logger.info("MQTT Signal published to ESP32 topic agrolink/actuator/{}/irrigation: VALVE_{}", targetDeviceId, newState);

        return getFarmTelemetry(targetDeviceId);
    }
}
