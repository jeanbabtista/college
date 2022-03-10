import invoice.Invoice
import invoice.Item
import invoice.Items

fun main() {
    try {
        val items = Items()
        items.add(Item("Banana", 1.99, 2))
        items.add(Item("Nuts", 5.99))
        items.add(Item("Coffee", 11.99, 1, discount = .2))
        items.add(Item("White T-Shirt", 29.99, 2, taxRate = .225))
        items.add(Item("Pencil", 1.49, 3))

        val invoice = Invoice(
            items,
            "EAT SMART",
            "MB, Koroška cesta",
            "Eat smart FERI d.o.o",
            "Žan Bedrač"
        )

        invoice.print()
    } catch (e: Error) {
        println("Error: ${e.message}")
    }
}