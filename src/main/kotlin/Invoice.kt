import java.time.LocalDateTime
import java.util.*

class Invoice (
    private var items: Items
) {
    val id = UUID.randomUUID().toString()
    val barcode = "random-barcode-string-to-implement"
    private val date = LocalDateTime.now()
    private val tax = .195

    private fun getDate(): String = "${date.dayOfMonth}. ${date.monthValue}. ${date.year}"

    override fun toString(): String {
        var temp = String()

        temp += "(${getDate()}) Invoice\n"
        temp += items
        temp += "------------------------------------------------------------\n"

        return temp
    }
}