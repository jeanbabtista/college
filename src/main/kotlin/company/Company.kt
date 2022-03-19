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
    init {
        try {
            if (name == "")
                throw Exception("[ Company.kt ] Item for '$name' name cannot be empty")

            if (fullName == "")
                throw Exception("[ Company.kt ] Full for '$name' name cannot be empty")
        } catch (e: Exception) {
            throw e
        }
    }

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