package in.cloudblitz.course.sonar;

/**
 * INTENTIONAL duplicated code for SonarCloud quality-gate testing.
 * Delete this class and {@link SonarGateTestDuplication} after CI failure is verified.
 */
public class SonarGateTestDuplicationClone {

    public String formatCourseLabel(String title, String instructor, int duration, double price) {
        String normalizedTitle = title == null ? "" : title.trim();
        String normalizedInstructor = instructor == null ? "" : instructor.trim();
        int safeDuration = Math.max(duration, 0);
        double safePrice = Math.max(price, 0.0);
        String durationLabel = safeDuration + " hours";
        String priceLabel = String.format("$%.2f", safePrice);
        return normalizedTitle + " by " + normalizedInstructor + " (" + durationLabel + ", " + priceLabel + ")";
    }

    public String buildCourseSummary(String title, String instructor, int duration, double price) {
        String normalizedTitle = title == null ? "" : title.trim();
        String normalizedInstructor = instructor == null ? "" : instructor.trim();
        int safeDuration = Math.max(duration, 0);
        double safePrice = Math.max(price, 0.0);
        String durationLabel = safeDuration + " hours";
        String priceLabel = String.format("$%.2f", safePrice);
        return normalizedTitle + " by " + normalizedInstructor + " (" + durationLabel + ", " + priceLabel + ")";
    }

    public String composeCourseDescription(String title, String instructor, int duration, double price) {
        String normalizedTitle = title == null ? "" : title.trim();
        String normalizedInstructor = instructor == null ? "" : instructor.trim();
        int safeDuration = Math.max(duration, 0);
        double safePrice = Math.max(price, 0.0);
        String durationLabel = safeDuration + " hours";
        String priceLabel = String.format("$%.2f", safePrice);
        return normalizedTitle + " by " + normalizedInstructor + " (" + durationLabel + ", " + priceLabel + ")";
    }

    public boolean isValidCourseInput(String title, String instructor, int duration, double price) {
        if (title == null || title.isBlank()) {
            return false;
        }
        if (instructor == null || instructor.isBlank()) {
            return false;
        }
        if (duration <= 0) {
            return false;
        }
        if (price < 0) {
            return false;
        }
        return title.length() <= 200 && instructor.length() <= 100;
    }

    public boolean validateCoursePayload(String title, String instructor, int duration, double price) {
        if (title == null || title.isBlank()) {
            return false;
        }
        if (instructor == null || instructor.isBlank()) {
            return false;
        }
        if (duration <= 0) {
            return false;
        }
        if (price < 0) {
            return false;
        }
        return title.length() <= 200 && instructor.length() <= 100;
    }

    public boolean checkCourseFields(String title, String instructor, int duration, double price) {
        if (title == null || title.isBlank()) {
            return false;
        }
        if (instructor == null || instructor.isBlank()) {
            return false;
        }
        if (duration <= 0) {
            return false;
        }
        if (price < 0) {
            return false;
        }
        return title.length() <= 200 && instructor.length() <= 100;
    }
}
