fun main() {
    try {
        val items = Items()
        items.add(Item("Banana", 1.99, 2))
        items.add(Item("Nuts", 5.99))
        items.add(Item("Coffee", 11.99, discount = .2))

        val invoice = Invoice(items)
        println(invoice)

        val nuts = items.find("Nuts")
        if (nuts === null)
            return

        items.update(nuts.id, Item("Oranges", 3.99, discount = 0.9))

        println(invoice)
    } catch (e: Error) {
        println("Error: ${e.message}")
    }
}