package invoice

import enums.Tax
import lib.BarcodeUtil
import lib.Printer
import lib.getErrorMessage

class InternalItem(
    department: UShort,
    name: String,
    pricePerKilo: Double,
    barcode: String,
    quantityInKilo: Int = 1,
    discount: Double = 0.0,
    tax: Tax = Tax.GOODS
) : Item(name, pricePerKilo, barcode, quantityInKilo, discount, tax) {
    private val internalId = counter.toString()
        get() = field.padStart(4, '0')

    private var internalBarcode = String()

    init {
        if (!(200u until 300u).contains(department))
            throw Exception(getErrorMessage("Department must be between 200 and 299"))

        counter++

        // set internal barcode
        internalBarcode =
            department.toString() +
                    internalId +
                    (quantityInKilo * 1000).toString().padStart(5, '0')

        internalBarcode += BarcodeUtil.getCheckDigit(internalBarcode)
    }

    companion object {
        var counter: Int = 1
    }

    /**
     * Returns string representation of InternalItem class
     *
     * @return String.
     */
    override fun toString(): String {
        Printer.addText(super.toString())
        Printer.addColumn(internalBarcode)
        return Printer.toStringAndReset()
    }
}