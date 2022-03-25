package enums

enum class Payment {
    CASH,
    CARD;

    companion object {
        /**
         * Returns string representation of given enum value.
         *
         * @param value Payment
         * @return String.
         */
        fun get(value: Payment): String = when (value) {
            CASH -> "cash"
            CARD -> "card"
        }
    }
}