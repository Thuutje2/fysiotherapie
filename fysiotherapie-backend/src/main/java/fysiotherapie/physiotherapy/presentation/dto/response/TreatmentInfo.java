package fysiotherapie.physiotherapy.presentation.dto.response;

import fysiotherapie.physiotherapy.domain.Treatment;

import java.time.LocalDate;

public class TreatmentInfo {
    public LocalDate startDate;
    public LocalDate endDate;
    public String condition;

    public TreatmentInfo(Treatment treatment) {
        this.startDate = treatment.getStartDate();
        this.endDate = treatment.getEndDate();
        this.condition = treatment.getCondition();
    }
}
