package fysiotherapie.physiotherapy.application.dto.response;

import fysiotherapie.physiotherapy.domain.Measurement;

import java.time.LocalDate;
import java.time.LocalTime;

public class MeasurementInfo {
    public long id;
    public String activity;
    public LocalDate date;
    public LocalTime time;

    public MeasurementInfo(Measurement measurement) {
        this.id = measurement.getId();
        this.date = measurement.getDate();
        this.time = measurement.getTime();
        this.activity = measurement.getActivity();
    }
}
