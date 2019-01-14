// A date time formatter which outputs formatted time according to options
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short"
};

module.exports = new Intl.DateTimeFormat("en-US", options);

// Usage:
// const d = new Intl.DateTimeFormat("en-US", options);
// console.log(d.format(new Date())); //Oct 1, 2018, 17:30:06 PDT
