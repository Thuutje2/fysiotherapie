package fysiotherapie.physiotherapy.application.dto.response;

import fysiotherapie.physiotherapy.domain.Treatment;

import java.time.LocalDate;

public class TreatmentInfo {
    public long id;
    public LocalDate startDate;
    public LocalDate endDate;
    public String condition;

    public TreatmentInfo(Treatment treatment) {
        this.id = treatment.getId();
        this.startDate = treatment.getStartDate();
        this.endDate = treatment.getEndDate();
        this.condition = treatment.getCondition();
    }
}
