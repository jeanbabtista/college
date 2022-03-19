package enums

enum class Payment {
    CASH,
    CARD;

    companion object {
        fun get(value: Payment): String = when (value) {
            CASH -> "cash"
            CARD -> "card"
        }
    }
}