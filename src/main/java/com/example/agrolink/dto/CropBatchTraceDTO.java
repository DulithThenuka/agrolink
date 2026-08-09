package com.example.agrolink.dto;

public final class CropBatchTraceDTO {

    private final String batchCode;
    private final Long cropId;
    private final String productName;
    private final String farmerName;
    private final String farmLocation;
    private final String harvestedDate;
    private final String packedDate;
    private final String transportVehicle;
    private final String qualityInspectionStatus;
    private final String deliveredDate;
    private final String blockchainHash;

    public CropBatchTraceDTO(String batchCode,
                             Long cropId,
                             String productName,
                             String farmerName,
                             String farmLocation,
                             String harvestedDate,
                             String packedDate,
                             String transportVehicle,
                             String qualityInspectionStatus,
                             String deliveredDate,
                             String blockchainHash) {
        this.batchCode = batchCode;
        this.cropId = cropId;
        this.productName = productName;
        this.farmerName = farmerName;
        this.farmLocation = farmLocation;
        this.harvestedDate = harvestedDate;
        this.packedDate = packedDate;
        this.transportVehicle = transportVehicle;
        this.qualityInspectionStatus = qualityInspectionStatus;
        this.deliveredDate = deliveredDate;
        this.blockchainHash = blockchainHash;
    }

    public String getBatchCode() { return batchCode; }
    public Long getCropId() { return cropId; }
    public String getProductName() { return productName; }
    public String getFarmerName() { return farmerName; }
    public String getFarmLocation() { return farmLocation; }
    public String getHarvestedDate() { return harvestedDate; }
    public String getPackedDate() { return packedDate; }
    public String getTransportVehicle() { return transportVehicle; }
    public String getQualityInspectionStatus() { return qualityInspectionStatus; }
    public String getDeliveredDate() { return deliveredDate; }
    public String getBlockchainHash() { return blockchainHash; }
}
