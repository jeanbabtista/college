package lib

import java.io.File

object BarcodeUtil {
    /**
     * @throws IllegalArgumentException
     * - if barcode is invalid
     */
    fun isBarcodeValid(barcode: String): Boolean {
        val n = barcode.length

        if (n < 7 || n in 9..11 || n in 15..16 || n > 18)
            throw IllegalArgumentException("[ BarcodeUtil.kt ] Invalid barcode length")

        var sum = 0
        val mod = if (n in arrayOf(8, 12, 14, 18)) 0 else 1

        for (i in 0 until n - 1)
            sum += barcode[i].digitToInt() * if (i % 2 == mod) 3 else 1

        if (roundToHigherTen(sum) - sum == barcode.last().digitToInt())
            return true
        else
            throw IllegalArgumentException("[ BarcodeUtil.kt ] Invalid barcode")
    }

    private fun roundToHigherTen(number: Int): Int {
        var n = number
        while (n % 10 != 0)
            n++
        return n
    }

    /**
     * @throws IllegalArgumentException
     * - if barcode is invalid
     */
    fun getCompanyCountryFromBarcode(barcode: String): String {
        isBarcodeValid(barcode)

        val map = LinkedHashMap<String, String>()

        File("src/main/kotlin/lib/country-barcodes.txt").forEachLine { line ->
            val row = line.split(" ")

            val code = row[0]
            var name = String()
            row.forEachIndexed { i, s -> if (i != 0) name += "$s " }

            map[code] = name
        }

        // map.forEach { item -> println("[${item.key}]: ${item.value}")}

        val code = barcode.substring(0 .. 2)

        if (map[code] === null)
            throw Exception("[ BarcodeUtil.kt ] ${object{}.javaClass.enclosingMethod.name} - could not find corresponding country code for barcode '$barcode'")

        return map[code]!!
    }
}