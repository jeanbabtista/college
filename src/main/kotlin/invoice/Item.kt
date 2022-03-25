package invoice

import enums.Tax
import lib.*
import java.time.LocalDateTime

open class Item(
    name: String,
    pricePerPiece: Double,
    barcode: String,
    quantity: Int = 1,
    discount: Double = 0.0,
    tax: Tax = Tax.GOODS
) {
    init {
        try {
            if (!BarcodeUtil.isBarcodeValid(barcode))
                throw java.lang.IllegalArgumentException(getErrorMessage("Invalid barcode"))

            if (name == "")
                throw Exception(getErrorMessage("Item name cannot be empty"))

            if (pricePerPiece <= 0.0)
                throw Exception(getErrorMessage("Price per piece for '$name' must be bigger than 0"))

            if (quantity <= 0)
                throw Exception(getErrorMessage("Quantity for '$name' must be bigger than 0"))

            if (discount < 0.0 || discount > 1.0)
                throw Exception(getErrorMessage("Discount for '$name' has to be a number between 0 and 1"))
        } catch (e: Exception) {
            throw e
        }
    }

    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

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

    private var taxRate = Tax.get(tax)

    // private var netPriceNoDiscount = totalPrice * (1.0 - taxRate)

    /**
     * Returns string representation of Item class
     *
     * @return String.
     */
    override fun toString(): String {
        Printer.addColumn(name)
        Printer.addColumn(quantity.toString())
        Printer.addColumn(roundToTwoDecimals(pricePerPiece).toString())
        // Printer.addColumn(roundToTwoDecimals(netPriceNoDiscount).toString())
        Printer.addColumn(roundPercentage(discount).toString())
        Printer.addColumn(roundPercentage(taxRate).toString())
        Printer.addColumn(roundToTwoDecimals(totalPrice).toString())

        return Printer.toStringAndReset()
    }
}