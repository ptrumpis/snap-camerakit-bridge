import LensFormatter from "./LensFormatter.js";

class OriginalFormatter extends LensFormatter {
    static format(lens) {
        return lens;
    }

    static reverse(lens) {
        return lens;
    }
}

export { OriginalFormatter };
export default OriginalFormatter;
