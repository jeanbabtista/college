package lib

import java.time.LocalDateTime
import kotlin.math.round

fun roundToTwoDecimals(number: Double): Double = round(number * 100) / 100

fun roundPercentage(number: Double): Double = round(number * 10000) / 100

fun getDateString(date: LocalDateTime) = "${date.dayOfMonth}. ${date.monthValue}. ${date.year}, ${date.hour}:${date.minute}"
