package company

import lib.Printer
import java.time.LocalDateTime

class Company(
    name: String,
    fullName: String,
    private val isTaxpayer: Boolean,
    private val taxNumber: String,
    private val registrationNumber: String,
    private val location: String,
    private val numberOfEmployees: Int,
    private val description: String,
) {
    var name = name
        private set
    var fullName = fullName
        private set
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