package invoice

import company.Company
import enums.Payment
import lib.*
import java.time.LocalDateTime
import java.util.*

class Invoice(
    private val barcode: String,
    private var items: Items,
    private var issuer: Company,
    cashierName: String,
    customer: Company? = null,
    paymentMethod: Payment = Payment.CASH
) {
    init {
        counter++

        try {
            BarcodeUtil.isBarcodeValid(barcode)

            if (cashierName == "")
                throw Exception(getErrorMessage("Cashier name cannot be empty"))
        } catch (e: Exception) {
            throw e
        }
    }

    companion object {
        var counter: Int = 0
    }

    private val id: UUID = UUID.randomUUID()
    private val invoiceNumber = "${issuer.name.replace(" ", "").uppercase().substring(0, 5)}-$counter"
    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()


    /**
     * Prints invoice to the screen.
     *
     * @return Unit.
     */
    fun print() = println(toString())

    private var cashierName = cashierName
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
        }

    var customer = customer
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
        }

    private var paymentMethod = paymentMethod
        set(value) {
            dateModified = LocalDateTime.now()
            field = value
        }


    /**
     * Returns string representation of Invoice class
     *
     * @return String.
     */
    override fun toString(): String {
        // issuer
        Printer.addText(issuer.toString())

        // invoice
        Printer.addTextLn("Invoice ID: $invoiceNumber")
        Printer.addTextLn("Date: ${getDateString(dateCreated)}")
        Printer.addLn()

        // items
        Printer.addText(items.toString())
        Printer.addTextLn("To pay (EUR): ${roundToTwoDecimals(items.totalPrice)}")
        Printer.addLn()

        // general
        Printer.addTextLn("Payment method: ${Payment.get(paymentMethod)}")
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