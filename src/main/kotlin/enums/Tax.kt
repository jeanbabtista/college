package enums

enum class Tax {
    GENERAL,
    GOODS;

    companion object {
        fun get(value: Tax): Double = when (value) {
            GENERAL -> .22
            GOODS -> .095
        }
    }
}