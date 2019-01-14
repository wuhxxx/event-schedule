// Convert number of minutes to time string like "09:00"
export function toTimeString(time) {
    if (typeof time !== "number" || time < 0 || time > 1440)
        return new Error("Invalid input for toTimeString()");

    let hour = ~~(time / 60);
    let minute = ~~(time % 60);

    hour = hour < 10 ? "0" + hour : String(hour);
    minute = minute < 10 ? "0" + minute : String(minute);

    return `${hour}:${minute}`;
}

// Convert a time string to number of minutes
export function toNumOfMinutes(timeString) {
    if (!timeString) return 0;
    if (typeof timeString !== "string")
        return new Error("Invalid input for toNumberOfMinutes()");

    const arr = timeString.split(":");
    if (arr.length !== 2)
        return new Error("Invalid input for toNumberOfMinutes()");

    return parseInt(arr[0]) * 60 + parseInt(arr[1]);
}
