package company

import lib.Printer
import lib.getDateString
import java.time.LocalDateTime

class Company(
    private val name: String,
    val fullName: String,
    private val isTaxpayer: Boolean,
    private val taxNumber: String,
    private val registrationNumber: String,
    private val location: String,
    private val numberOfEmployees: Int,
    private val description: String,
) {
    private val dateSignIn = LocalDateTime.now()

    override fun toString(): String {
        Printer.addTextLn(name)
        Printer.addTextLn(location)

        if (isTaxpayer)
            Printer.addTextLn("DDV ID: $taxNumber")

        Printer.addLn()

        return Printer.toStringAndReset()
    }
}