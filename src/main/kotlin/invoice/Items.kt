package invoice

import lib.Printer
import lib.getErrorMessage
import java.time.LocalDateTime
import java.util.*

class Items : LinkedHashMap<UUID, Item>() {
    // values
    val id: UUID = UUID.randomUUID()
    private val dateCreated = LocalDateTime.now()
    private var dateModified = LocalDateTime.now()

    val totalPrice: Double
        get() {
            var sum = 0.0
            forEach { (_, item) -> sum += item.totalPrice }
            return sum
        }

    /**
     * Adds [value]'s quantity to current [key]'s item quantity.
     *
     * If key doesn't exist yet, it creates new item with that key, otherwise it only performs addition.
     *
     * @param key UUID
     * @param value Item
     * @return Unit.
     */
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

    /**
     * Subtracts [quantity] by given [key] from the item.
     *
     * This does not remove the item from the list, it only subtracts quantity from the item. If the subtracted
     * quantity results in being less than 0, then an Error is thrown.
     *
     * @param key UUID
     * @param quantity Int
     * @return Unit.
     */
    fun delete(key: UUID, quantity: Int) {
        dateModified = LocalDateTime.now()

        if (!super.containsKey(key))
            throw Exception(getErrorMessage("Error deleting item - item ID unknown"))

        val item = super.get(key)

        if (quantity < 0)
            throw Exception(getErrorMessage("Error deleting item ('${item!!.name}') - quantity is negative"))

        if (item!!.quantity < quantity)
            throw java.lang.IllegalStateException(
                getErrorMessage(
                    "Error deleting item ('${item.name}') - item does not contain enough quantity to be deleted"
                )
            )

        item.quantity -= quantity
    }

    /**
     * Updates item's [pricePerPiece] correspondingly.
     *
     * @param id UUID
     * @param pricePerPiece Double
     * @return Unit.
     */
    fun updatePricePerPiece(id: UUID, pricePerPiece: Double) {
        dateModified = LocalDateTime.now()

        val item = super.get(id)

        if (item === null)
            throw Exception(getErrorMessage("Error updating price per piece - item ID unknown"))

        item.pricePerPiece = pricePerPiece
    }

    /**
     * Updates item's [quantity] correspondingly.
     *
     * @param id UUID
     * @param quantity Int
     * @return Unit.
     */
    fun updateQuantity(id: UUID, quantity: Int) {
        dateModified = LocalDateTime.now()

        val item = super.get(id)

        if (item === null)
            throw Exception(getErrorMessage("Error updating quantity - item ID unknown"))

        item.quantity = quantity
    }

    /**
     * Updates item's [discount] correspondingly.
     *
     * @param id UUID
     * @param discount Double
     * @return Unit.
     */
    fun updateDiscount(id: UUID, discount: Double) {
        dateModified = LocalDateTime.now()

        val item = super.get(id)

        if (item === null)
            throw Exception(getErrorMessage("Error updating quantity - item ID unknown"))

        item.discount = discount
    }

    /**
     * Returns string representation of Items class
     *
     * @return String.
     */
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
        forEach { (_, item) ->
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