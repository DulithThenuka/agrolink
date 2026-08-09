package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.IoTFarmTelemetryDTO;
import com.example.agrolink.service.IoTFarmService;

@RestController
@RequestMapping("/api/v1/iot")
public class RestIoTController {

    private static final Logger logger = LoggerFactory.getLogger(RestIoTController.class);

    private final IoTFarmService ioTService;

    public RestIoTController(IoTFarmService ioTService) {
        this.ioTService = ioTService;
    }

    @GetMapping("/telemetry")
    public ApiResponse<IoTFarmTelemetryDTO> getTelemetry(@RequestParam(required = false) String deviceId) {
        logger.info("REST Request for IoT telemetry stream, deviceId: {}", deviceId);
        IoTFarmTelemetryDTO telemetry = ioTService.getFarmTelemetry(deviceId);
        return ApiResponse.success(telemetry);
    }

    @PostMapping("/irrigation/trigger")
    public ApiResponse<IoTFarmTelemetryDTO> triggerIrrigation(@RequestParam(required = false) String deviceId,
                                                               @RequestParam boolean enable) {
        logger.info("REST Request to trigger irrigation valve, deviceId: {}, enable: {}", deviceId, enable);
        IoTFarmTelemetryDTO telemetry = ioTService.triggerIrrigationValve(deviceId, enable);
        return ApiResponse.success(telemetry);
    }
}
