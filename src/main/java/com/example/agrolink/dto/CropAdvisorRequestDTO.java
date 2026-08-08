package com.example.agrolink.dto;

import java.math.BigDecimal;

public class CropAdvisorRequestDTO {

    private String location;
    private double landSizeAcres;
    private String soilType;
    private String waterAvailability;
    private String month;
    private BigDecimal budgetLkr;

    public CropAdvisorRequestDTO() {}

    public CropAdvisorRequestDTO(String location, double landSizeAcres, String soilType, String waterAvailability, String month, BigDecimal budgetLkr) {
        this.location = location;
        this.landSizeAcres = landSizeAcres;
        this.soilType = soilType;
        this.waterAvailability = waterAvailability;
        this.month = month;
        this.budgetLkr = budgetLkr;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getLandSizeAcres() { return landSizeAcres; }
    public void setLandSizeAcres(double landSizeAcres) { this.landSizeAcres = landSizeAcres; }

    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }

    public String getWaterAvailability() { return waterAvailability; }
    public void setWaterAvailability(String waterAvailability) { this.waterAvailability = waterAvailability; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public BigDecimal getBudgetLkr() { return budgetLkr; }
    public void setBudgetLkr(BigDecimal budgetLkr) { this.budgetLkr = budgetLkr; }
}
