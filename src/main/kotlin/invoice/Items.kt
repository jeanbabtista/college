package invoice

import lib.Printer
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

    fun getByIndex(index: Int) = items[index]

    // CRUD functions
    fun getTotalPrice(): Double {
        var sum = 0.0
        items.forEach{ item -> sum += item.totalPrice }
        return sum
    }

    fun add(item: Item): UUID {
        dateModified = LocalDateTime.now()
        items.add(item)
        return item.id
    }

    private fun find(id: UUID) = items.find { item -> item.id === id }

    fun update(
        id: UUID,
        name: String = "",
        pricePerPiece: Double = 0.0,
        quantity: Int = 0,
        discount: Double = 0.0,
        taxRate: Double = 0.0
    ): Boolean {
        dateModified = LocalDateTime.now()

        val found = find(id)
        if (found === null) {
            println("Unable to find requested item")
            return false
        }

        val item = items[items.indexOf(found)]

        if (name !== "")
            item.name = name

        if (pricePerPiece != 0.0)
            item.pricePerPiece = pricePerPiece

        if (quantity != 0)
            item.quantity = quantity

        if (discount != 0.0)
            item.discount = discount

        if (taxRate != 0.0)
            item.taxRate = taxRate

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
                Printer.addText(' ')
        }

        Printer.addLine('=', 7)

        return Printer.toStringAndReset()
    }
}