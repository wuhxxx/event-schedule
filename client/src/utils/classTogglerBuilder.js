/**
 * A reusable function builder to toggle class list by given condition
 * @param {String} origin origin class list
 * @param {String} onTrue classList to toggle when True
 * @param {String} onFalse classList to toggle when False
 */
export default function classTogglerBuilder(origin, onTrue, onFalse) {
    /**
     * @param {boolean} condition
     */
    const toggleClassBy = condition => {
        if (condition) {
            return origin + (onTrue ? " " + onTrue : "");
        } else {
            return origin + (onFalse ? " " + onFalse : "");
        }
    };
    return toggleClassBy;
}
