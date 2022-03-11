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
    private var customer: Company,
    private var cashierName: String,
    private var paymentMethod: String = "cash"
) {
    // values
    private val id: UUID = UUID.randomUUID()
    private val invoiceNumber = "${issuer.name.replace(" ","").uppercase().substring(0, 5)}-$counter"
    private val barcode = "(01)00614141987658"
    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    companion object {
        var counter: Int = 0
        fun counter(): Int = counter
    }

    init {
        counter++
    }

    // getters
    private fun getInvoiceNumber() = invoiceNumber

    fun print() = println(toString())

    // setters
    fun setCashierName(_cashierName: String) {
        dateModified = LocalDateTime.now()
        cashierName = _cashierName
    }

    fun setCostumer(_customer: Company) {
        dateModified = LocalDateTime.now()
        customer = _customer
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