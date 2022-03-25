package lib

import java.time.LocalDateTime
import kotlin.math.round
import kotlin.test.assertEquals

fun roundToTwoDecimals(number: Double): Double =
    round(number * 100) / 100

fun roundPercentage(number: Double): Double =
    round(number * 10000) / 100

fun getDateString(date: LocalDateTime) =
    "${date.dayOfMonth}. ${date.monthValue}. ${date.year}, ${date.hour}:${date.minute}"

fun getErrorMessage(message: String) =
    "[ ERROR ] $message"

fun testBarcodeValidation() {
    assertEquals(true, BarcodeUtil.isBarcodeValid("96385074"), "GTIN-8 valid code")
    assertEquals(true, BarcodeUtil.isBarcodeValid("123601057072"), "GTIN-12 valid code")
    assertEquals(true, BarcodeUtil.isBarcodeValid("4070071967072"), "GTIN-13 valid code")
    assertEquals(true, BarcodeUtil.isBarcodeValid("00012345600012"), "GTIN-14 valid code")
    assertEquals(true, BarcodeUtil.isBarcodeValid("08012349999999997"), "GSIN valid code")
    assertEquals(true, BarcodeUtil.isBarcodeValid("001234560000000018"), "SSCC valid code")

    assertEquals(false, BarcodeUtil.isBarcodeValid("96385075"), "GTIN-8 invalid code")
    assertEquals(false, BarcodeUtil.isBarcodeValid("123601057073"), "GTIN-12 invalid code")
    assertEquals(false, BarcodeUtil.isBarcodeValid("4070071967073"), "GTIN-13 invalid code")
    assertEquals(false, BarcodeUtil.isBarcodeValid("00012345600013"), "GTIN-14 invalid code")
    assertEquals(false, BarcodeUtil.isBarcodeValid("08012349999999998"), "GSIN invalid code")
    assertEquals(false, BarcodeUtil.isBarcodeValid("001234560000000019"), "SSCC invalid code")
}