import java.util.UUID

class Item(
    var name: String,
    private var price: Double,
    var quantity: Int = 1,
    var discount: Double = 0.0 // between 0 and 1
) {
    init {
        price *= quantity

        if (discount > 1.0)
            throw Error("Discount has to be a number between 0 and 1")
    }

    val id: UUID = UUID.randomUUID()
    val barcode = "random-barcode-string-to-implement"

    private fun price(): Double {
        if (discount > 0.0)
            return price * (1.0 - discount)
        return price
    }

    override fun toString() = "[ #${id.toString().slice(1..5)} ] $name -> ${price()} €"
}