package invoice

import lib.Printer
import java.time.LocalDateTime
import java.util.UUID

class Items: LinkedHashMap<UUID, Item>() {
    // values
    val id: UUID = UUID.randomUUID()
    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    val totalPrice: Double
        get() {
            var sum = 0.0
            forEach{(_, item) -> print("${item.totalPrice} ")}
            forEach{ (_, item) -> sum += item.totalPrice }
            return sum
        }

    override fun put(key: UUID, value: Item): Item? {
        dateModified = LocalDateTime.now()

        // first entry
        if (!super.containsKey(key))
            return super.put(key, value)

        // next entries
        val item = super.get(key)
        item!!.quantity += value.quantity

        return item
    }

    override fun remove(key: UUID): Item? {
        dateModified = LocalDateTime.now()

        if (!super.containsKey(key))
            return null

        val item = super.get(key)

        if (item!!.quantity < 1)
            throw java.lang.IllegalStateException("[ Items.kt ] Error deleting item ('${item.name}') - item does not contain enough quantity to be deleted")

        item.quantity -= 1
        return item
    }

    fun add(key: UUID, value: Item) {
        dateModified = LocalDateTime.now()

        // first entry
        if (!super.containsKey(key)) {
            super.put(key, value)
            return
        }

        // next entries
        val item = super.get(key)
        item!!.quantity += value.quantity
    }

    fun delete(key: UUID, quantity: Int) {
        dateModified = LocalDateTime.now()

        if (!super.containsKey(key))
            throw Exception("[ Items.kt ] Error deleting item - item ID unknown")

        val item = super.get(key)

        if (quantity < 0)
            throw Exception("[ Items.kt ] Error deleting item ('${item!!.name}') - quantity is negative")

        if (item!!.quantity < quantity)
            throw java.lang.IllegalStateException("[ Items.kt ] Error deleting item ('${item.name}') - item does not contain enough quantity to be deleted")

        item.quantity -= quantity
    }

    fun updatePricePerPiece(id: UUID, pricePerPiece: Double) {
        dateModified = LocalDateTime.now()

        val item = super.get(id)

        if (item === null)
            throw Exception("[ Items.kt ] Error updating price per piece - item ID unknown")

        item.pricePerPiece = pricePerPiece
    }

    fun updateQuantity(id: UUID, quantity: Int) {
        dateModified = LocalDateTime.now()

        val item = super.get(id)

        if (item === null)
            throw Exception("[ Items.kt ] Error updating quantity - item ID unknown")

        item.quantity = quantity
    }

    fun updateDiscount(id: UUID, discount: Double) {
        dateModified = LocalDateTime.now()

        val item = super.get(id)

        if (item === null)
            throw Exception("[ Items.kt ] Error updating discount - item ID unknown")

        item.discount = discount
    }

    override fun toString(): String {
        // header row
        Printer.addColumn("Article")
        Printer.addColumn("Quantity")
        Printer.addColumn("Price (€) / piece")
        // Printer.addColumn("Net price (€)")
        Printer.addColumn("Discount (%)")
        Printer.addColumn("DDV (%)")
        Printer.addColumn("Total price (€)")

        // lines and items
        Printer.addLine('=', 6)

        var i = 0
        forEach{ (_, item) ->
            Printer.addText(item.toString())
            if (i++ != super.size - 1)
                Printer.addLn()
            else
                Printer.addText(' ')
        }

        Printer.addLine('=', 6)

        return Printer.toStringAndReset()
    }
}