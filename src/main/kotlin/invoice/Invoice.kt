package invoice

import lib.Printer
import lib.roundToTwoDecimals
import java.time.LocalDateTime
import java.util.*

class Invoice (
    private var items: Items,
    private var invoiceName: String,
    private var location: String,
    private var issuerName: String,
    private var cashierName: String,
    private var paymentMethod: String = "cash"
) {
    // values
    private val id = UUID.randomUUID().toString()
    private val barcode = "(01)00614141987658"
    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    // getters
    private fun getDateString() = "${dateCreated.dayOfMonth}. ${dateCreated.monthValue}. ${dateCreated.year}"
    fun getInvoiceNumber() = id

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
        cashierName = _merchantName
    }

    fun setPaymentMethod(_paymentMethod: String) {
        dateModified = LocalDateTime.now()
        paymentMethod = _paymentMethod
    }

    // other
    override fun toString(): String {
        // header
        Printer.addTextLn(invoiceName)
        Printer.addTextLn("classes.Invoice ID: ${getInvoiceNumber()}")
        Printer.addTextLn("Location: $location, ${getDateString()}")
        Printer.addLn()

        Printer.addText(items.toString())
        Printer.addTextLn("To pay (EUR): ${roundToTwoDecimals(items.getTotalPrice())}")
        Printer.addLn()

        // general information
        Printer.addTextLn("Payment method: $paymentMethod")
        Printer.addTextLn("Issued by: $issuerName")
        Printer.addTextLn("Invoiced by: $cashierName")
        Printer.addLn()

        Printer.addTextLn("All prices in EUR")
        Printer.addTextLn("DDV included in price")
        Printer.addTextLn("Barcode: $barcode")
        Printer.addLn()

        // other
        Printer.addTextLn("Thank you for visiting us!")
        Printer.addLn()

        return Printer.toStringAndReset()
    }
}