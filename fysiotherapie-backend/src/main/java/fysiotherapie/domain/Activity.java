package fysiotherapie.domain;

import fysiotherapie.domain.enums.ActivityType;

import java.util.ArrayList;
import java.util.List;

public class Activity {
    private ActivityType type;
    private List<Joint> joints = new ArrayList<>();

    public Activity(ActivityType type) {
        this.type = type;
    }
}
