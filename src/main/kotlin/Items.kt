import java.time.LocalDateTime
import java.util.UUID

class Items {
    // values
    private val id: UUID = UUID.randomUUID()
    private val items = arrayListOf<Item>()
    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    // getters
    fun getAll() = items

    // CRUD functions
    fun getTotalPrice(): Double {
        var sum = 0.0
        items.forEach{ item -> sum += item.getTotalPrice() }
        return sum
    }

    fun add(item: Item): UUID {
        dateModified = LocalDateTime.now()
        items.add(item)
        return item.id
    }

    private fun find(id: UUID) = items.find { item -> item.id === id }

    fun updatePricePerPiece(id: UUID, pricePerPiece: Double): Boolean {
        dateModified = LocalDateTime.now()

        val found = find(id)
        if (found === null) {
            println("Unable to find requested item")
            return false
        }

        items[items.indexOf(found)].setPricePerPiece(pricePerPiece)
        return true
    }

    fun delete(id: UUID): Boolean {
        dateModified = LocalDateTime.now()
        return items.removeIf { item: Item -> item.id === id }
    }

    override fun toString(): String {
        // header row
        Printer.addColumn("Article")
        Printer.addColumn("Quantity")
        Printer.addColumn("Price (€) / piece")
        Printer.addColumn("Net price (€)")
        Printer.addColumn("Discount (%)")
        Printer.addColumn("DDV (%)")
        Printer.addColumn("Total price (€)")

        // lines and items
        Printer.addLine('=', 7)

        items.forEachIndexed { i, item ->
            Printer.addText(item.toString())
            if (i != items.count() - 1)
                Printer.addLn()
            else
                Printer.addText(' ') }

        Printer.addLine('=', 7)

        return Printer.toStringAndReset()
    }
}