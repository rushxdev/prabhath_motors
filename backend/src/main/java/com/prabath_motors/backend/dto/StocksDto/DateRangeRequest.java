package com.prabath_motors.backend.dto.StocksDto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DateRangeRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean showLowStockOnly;
}
