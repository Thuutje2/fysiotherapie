package fysiotherapie.physiotherapy.domain.enums;

public enum ActivityType {
    WALKING("Lopen"),
    RUNNING("Rennen"),
    THROWING("Gooien");

    private final String value;

    ActivityType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ActivityType fromValue(String value) {
        for (ActivityType type : ActivityType.values()) {
            if (type.getValue().equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown activity type: " + value);
    }
}