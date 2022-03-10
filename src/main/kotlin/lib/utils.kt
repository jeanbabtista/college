package lib

import kotlin.math.round

fun roundToTwoDecimals(number: Double): Double = round(number * 100) / 100

fun roundPercentage(number: Double): Double = round(number * 10000) / 100
