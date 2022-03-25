package enums

enum class Tax {
    GENERAL,
    GOODS;

    companion object {
        /**
         * Returns string representation of given enum value.
         *
         * @param value Payment
         * @return String.
         */
        fun get(value: Tax): Double = when (value) {
            GENERAL -> .22
            GOODS -> .095
        }
    }
}