export function isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(date)) {
        return true;
    }
    else {
        return false;
    }
}
export function isValidHour(hour) {
    if (Number.isInteger(hour) && hour >= 1 && hour <= 24) {
        return true;
    }
    else {
        return false;
    }
}
