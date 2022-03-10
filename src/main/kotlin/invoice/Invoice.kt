package invoice

import company.Company
import lib.Printer
import lib.getDateString
import lib.roundToTwoDecimals
import java.time.LocalDateTime
import java.util.*

class Invoice (
    private var items: Items,
    private var issuer: Company,
    private var customerName: String,
    private var cashierName: String,
    private var paymentMethod: String = "cash"
) {
    // values
    private val id = UUID.randomUUID().toString()
    private val barcode = "(01)00614141987658"
    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    // getters
    private fun getInvoiceNumber() = id

    fun print() = println(toString())

    // setters
    fun setCashierName(_cashierName: String) {
        dateModified = LocalDateTime.now()
        cashierName = _cashierName
    }

    fun setCustomerName(_customerName: String) {
        dateModified = LocalDateTime.now()
        customerName = _customerName
    }

    fun setPaymentMethod(_paymentMethod: String) {
        dateModified = LocalDateTime.now()
        paymentMethod = _paymentMethod
    }

    // other
    override fun toString(): String {
        // issuer
        Printer.addText(issuer.toString())

        // invoice
        Printer.addTextLn("Invoice ID: ${getInvoiceNumber()}")
        Printer.addTextLn("Date: ${getDateString(dateCreated)}")
        Printer.addLn()

        // items
        Printer.addText(items.toString())
        Printer.addTextLn("To pay (EUR): ${roundToTwoDecimals(items.getTotalPrice())}")
        Printer.addLn()

        // general
        Printer.addTextLn("Payment method: $paymentMethod")
        Printer.addTextLn("Issued by: ${issuer.fullName}")
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