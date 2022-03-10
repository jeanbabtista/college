import company.Company
import invoice.Invoice
import invoice.Item
import invoice.Items

fun main() {
    val items1 = Items()
    items1.add(Item("Banana", 1.99, 2))
    items1.add(Item("Nuts", 5.99))
    items1.add(Item("Coffee", 11.99, 1, discount = .2))
    items1.add(Item("White T-Shirt", 29.99, 2, taxRate = .225))
    items1.add(Item("Pencil", 1.49, 3))

    val items2 = Items()
    items2.add(Item("Fake item 1", 1.99))
    items2.add(Item("Fake item 2", 5.99))

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

    val companyFakeCompany = Company(
        "FAKE company",
        "FAKE COMPANY d.o.o",
        false,
        "",
        "6261752001",
        "Janžev Vrh 54a, 9252 Radenci",
        0,
        "Fake company with fake employees, fake location and fake registration number"
    )

    val invoice1 = Invoice(
        items1,
        companyEatSmartFeri,
        "Žan Bedrač",
        "Donald Trump"
    )

    val invoice2 = Invoice(
        items2,
        companyFakeCompany,
        "Fake Person",
        "Fake Cashier"
    )

    invoice1.print()
    invoice2.print()
}