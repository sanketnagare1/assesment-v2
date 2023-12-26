export function isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(date)) {
        return true;
    } else {
        return false;
    }
}

export function isValidHour(hour: number): boolean {
    if (Number.isInteger(hour) && hour >= 1 && hour <= 24) {
        return true;
    } else {
        return false;
    }
}
