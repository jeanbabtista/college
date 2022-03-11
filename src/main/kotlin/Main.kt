import company.Company
import invoice.Invoice
import invoice.Item
import invoice.Items

fun main() {
    val items = Items()
    items.add(Item("Banana", 1.99, 2))
    items.add(Item("Nuts", 5.99))
    items.add(Item("Coffee", 11.99, 1, discount = .2))
    items.add(Item("White T-Shirt", 29.99, 2, taxRate = .225))
    items.add(Item("Pencil", 1.49, 3))

    items.delete(items.getByIndex(0).id)
    items.update(items.getByIndex(0).id, pricePerPiece = 6.78, quantity = 2, discount = .1)

    val companyEatSmartFeri = Company(
        "Eat Smart FERI",
        "Eat Smart FERI d.o.o",
        true,
        "SI58665765",
        "6261752000",
        "Koroška cesta 18, 1234 Maribor",
        30,
        "Restaurant business, food delivery, cooking, meal prepping and more"
    )

    val customerFoodDelivery = Company(
        "Food Delivery",
        "Food Delivery d.o.o",
        true,
        "SI58665765",
        "6261752000",
        "Koroška cesta 17, 1234 Maribor",
        15,
        "Food delivery and more"
    )

    val invoice = Invoice(
        items,
        companyEatSmartFeri,
        customerFoodDelivery,
        "Donald Trump"
    )

    invoice.print()
}