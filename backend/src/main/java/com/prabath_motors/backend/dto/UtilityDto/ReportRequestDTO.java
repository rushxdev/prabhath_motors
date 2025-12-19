package com.prabath_motors.backend.dto.UtilityDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequestDTO {
    private String startDate;
    private String endDate;
    private String utilityType;
    private boolean includeChart;
    private String chartType;
}
