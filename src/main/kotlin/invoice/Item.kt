package invoice

import lib.Printer
import lib.roundPercentage
import lib.roundToTwoDecimals
import java.time.LocalDateTime
import java.util.UUID

class Item (
    name: String,
    pricePerPiece: Double,
    quantity: Int = 1,
    discount: Double = 0.0, // between 0 and 1
    taxRate: Double = 0.095,
    private val printer: Printer = Printer(),
) {
    init {
        if (discount > 1.0)
            throw Error("Discount has to be a number between 0 and 1")
    }

    var totalPrice = pricePerPiece * quantity
        get() = roundToTwoDecimals(field * (1.0 - discount))
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
        }

    var name = name
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
        }

    var pricePerPiece = pricePerPiece
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
            totalPrice = field * quantity
        }

    var quantity = quantity
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
            totalPrice = pricePerPiece * field
        }

    var discount = discount
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
        }

    var taxRate = taxRate
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
        }

    val id: UUID = UUID.randomUUID()
    val barcode = "(01)00614141987658"

    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    private fun getNetPriceWithoutDiscount() = totalPrice * (1.0 - taxRate)

    override fun toString(): String {
        Printer.addColumn(name)
        Printer.addColumn(quantity.toString())
        Printer.addColumn(roundToTwoDecimals(pricePerPiece).toString())
        Printer.addColumn(roundToTwoDecimals(getNetPriceWithoutDiscount()).toString())
        Printer.addColumn(roundPercentage(discount).toString())
        Printer.addColumn(roundPercentage(taxRate).toString())
        Printer.addColumn(roundToTwoDecimals(totalPrice).toString())

        return Printer.toStringAndReset()
    }
}