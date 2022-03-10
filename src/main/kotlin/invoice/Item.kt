package invoice

import lib.Printer
import lib.roundPercentage
import lib.roundToTwoDecimals
import java.time.LocalDateTime
import java.util.UUID

class Item (
    private var name: String,
    private var pricePerPiece: Double,
    private var quantity: Int = 1,
    private var discount: Double = 0.0, // between 0 and 1
    private val taxRate: Double = 0.095,
    private val printer: Printer = Printer(),
) {
    init {
        if (discount > 1.0)
            throw Error("Discount has to be a number between 0 and 1")
    }

    fun setName(_name: String) {
        dateModified = LocalDateTime.now()
        name = _name
    }

    fun setPricePerPiece(_pricePerPiece: Double) {
        dateModified = LocalDateTime.now()
        pricePerPiece = _pricePerPiece
    }

    fun setQuantity(_quantity: Int) {
        dateModified = LocalDateTime.now()
        quantity = _quantity
    }

    fun setDiscount(_discount: Double) {
        dateModified = LocalDateTime.now()
        discount = _discount
    }

    val id: UUID = UUID.randomUUID()
    val barcode = "(01)00614141987658"
    private val price = pricePerPiece * quantity

    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    fun getTotalPrice() = roundToTwoDecimals(price * (1.0 - discount))

    private fun getNetPriceWithoutDiscount() = price * (1.0 - taxRate)

    override fun toString(): String {
        Printer.addColumn(name)
        Printer.addColumn(quantity.toString())
        Printer.Companion.addColumn(roundToTwoDecimals(pricePerPiece).toString())
        Printer.Companion.addColumn(roundToTwoDecimals(getNetPriceWithoutDiscount()).toString())
        Printer.Companion.addColumn(roundPercentage(discount).toString())
        Printer.Companion.addColumn(roundPercentage(taxRate).toString())
        Printer.Companion.addColumn(roundToTwoDecimals(getTotalPrice()).toString())

        return Printer.toStringAndReset()
    }
}