import java.time.LocalDateTime
import java.util.*

class Invoice (
    private var items: Items,
    private var invoiceName: String,
    private var location: String,
    private var merchantName: String,
    private var paymentMethod: String = "cash"
) {
    // values
    private val id = UUID.randomUUID().toString()
    private val barcode = "(01)00614141987658"
    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    // getters
    private fun getDateString() = "${dateCreated.dayOfMonth}. ${dateCreated.monthValue}. ${dateCreated.year}"

    fun print() = println(toString())

    // setters
    fun setInvoiceName(_invoiceName: String) {
        dateModified = LocalDateTime.now()
        invoiceName = _invoiceName
    }

    fun setLocation(_location: String) {
        dateModified = LocalDateTime.now()
        location = _location
    }

    fun setMerchantName(_merchantName: String) {
        dateModified = LocalDateTime.now()
        merchantName = _merchantName
    }

    fun setPaymentMethod(_paymentMethod: String) {
        dateModified = LocalDateTime.now()
        paymentMethod = _paymentMethod
    }

    // other
    override fun toString(): String {
        // header
        Printer.addTextLn(invoiceName)
        Printer.addTextLn("Invoice ID: $id")
        Printer.addTextLn("Location: $location, ${getDateString()}")
        Printer.addLn()

        Printer.addText(items.toString())
        Printer.addTextLn("To pay (EUR): ${roundToTwoDecimals(items.getTotalPrice())}")
        Printer.addLn()

        // general information
        Printer.addTextLn("Payment method: $paymentMethod")
        Printer.addTextLn("Invoiced by: $merchantName")
        Printer.addLn()

        Printer.addTextLn("All prices in EUR")
        Printer.addTextLn("DDV included in price")
        Printer.addLn()

        // other
        Printer.addTextLn("Thank you for visiting us!")
        Printer.addLn()

        Printer.addTextLn("ID: $id")
        Printer.addTextLn("Barcode: $barcode")

        return Printer.toStringAndReset()
    }
}