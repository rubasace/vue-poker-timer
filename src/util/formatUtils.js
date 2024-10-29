export function formatClockValue(timeInSeconds) {
    if (timeInSeconds < 0) {
        return '00:00';
    }
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor(timeInSeconds / 60) - hours * 60;
    const seconds = timeInSeconds - hours * 3600 - minutes * 60;
    const hoursPart = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''
    return `${hoursPart}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}