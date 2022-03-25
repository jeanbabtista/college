package lib

import java.io.File

object BarcodeUtil {
    /**
     * Checks if [barcode] is valid or not.
     *
     * @param barcode String
     * @return Boolean - true if barcode is valid, false otherwise.
     * @throws IllegalArgumentException if barcode is invalid.
     */
    fun isBarcodeValid(barcode: String): Boolean {
        val n = barcode.length

        if (n < 7 || n in 9..11 || n in 15..16 || n > 18)
            throw IllegalArgumentException(getErrorMessage("Invalid barcode length"))

        var sum = 0
        val mod = if (n in arrayOf(8, 12, 14, 18)) 0 else 1

        for (i in 0 until n - 1)
            sum += barcode[i].digitToInt() * if (i % 2 == mod) 3 else 1

        return roundToHigherTen(sum) - sum == barcode.last().digitToInt()
    }

    private fun roundToHigherTen(number: Int): Int {
        var n = number
        while (n % 10 != 0)
            n++
        return n
    }

    /**
     * Returns country for [barcode]. First it checks whether the barcode is valid, and
     *
     * @param barcode String
     * @return Boolean - true if barcode is valid, false otherwise.
     * @throws IllegalArgumentException if barcode is invalid.
     */
    fun getCompanyCountryFromBarcode(barcode: String): String {
        val status = isBarcodeValid(barcode)

        if (!status)
            throw Exception(getErrorMessage("could not find corresponding country code for barcode '$barcode'"))

        val map = LinkedHashMap<String, String>()

        File("src/main/kotlin/lib/country-barcodes.txt").forEachLine { line ->
            val row = line.split(" ")

            val code = row[0]
            var name = String()
            row.forEachIndexed { i, s -> if (i != 0) name += "$s " }

            map[code] = name
        }

        val code = barcode.substring(0..2)

        if (map[code] === null)
            throw Exception(getErrorMessage("could not find corresponding country code for barcode '$barcode'"))

        return map[code]!!
    }

    /**
     * Returns check digit (13. digit) for [barcode]. Only supports GTIN-13 barcodes.
     *
     * @param barcode String
     * @return Int - Returns last digit of the barcode so that the barcode is correct.
     * @throws IllegalArgumentException if barcode is invalid.
     */
    fun getCheckDigit(barcode: String): Int {
        if (barcode.length != 12)
            throw IllegalArgumentException(getErrorMessage("operation only supported for GTIN-13 barcodes"))

        var sum = 0
        for (i in 0 until barcode.length - 1)
            sum += barcode[i].digitToInt() * if (i % 2 == 1) 3 else 1

        return roundToHigherTen(sum) - sum
    }
}