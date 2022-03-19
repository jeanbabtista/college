import company.Company
import enums.Tax
import invoice.Invoice
import invoice.Item
import invoice.Items
import lib.BarcodeUtil
import java.util.*

fun main() {
    try {
        val ids = arrayOf(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID())

        val items = Items()
        items.add(ids[0], Item("Banana", 1.99, "96385074", 2))
        items.add(ids[1], Item("Nuts", 5.99, "123601057072"))
        items.add(ids[2], Item("Coffee", 11.99, "4070071967072", 1, discount = .2))
        items.add(ids[3], Item("T-Shirt", 29.99, "00012345600012", 2, tax = Tax.GENERAL))
        items.add(ids[4], Item("Pencil", 1.49, "08012349999999997", 3))

        // delete
        items.delete(ids[0], 1)

        // update
        items.updatePricePerPiece(ids[1], 10.0)
        items.updateDiscount(ids[1], .1)

        val companyEatSmartFeri = Company(
            "Eat Smart FERI",
            "Eat Smart FERI d.o.o",
            true,
            "SI58665765",
            "6261752000",
            "Cool Street 18, 1234 NYC",
            30,
            "Restaurant business, food delivery, cooking, meal prepping and more"
        )

        val customerFoodDelivery = Company(
            "Food Delivery",
            "Food Delivery d.o.o",
            true,
            "SI58665765",
            "6261752000",
            "Cool Street 17, 1234 Melbourne",
            15,
            "Food delivery and more"
        )

        val invoice = Invoice(
            "123601057072",
            items,
            companyEatSmartFeri,
            "Donald Trump",
            customerFoodDelivery,
        )

        invoice.print()

        val countryForBarcode = BarcodeUtil.getCompanyCountryFromBarcode("3830037942014")
        println(countryForBarcode)
    } catch (e: Exception) {
        println(e.message)
    }
}
