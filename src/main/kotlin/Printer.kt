class Printer {
    companion object {
        private const val columnLength = 20
        private var string = String()

        override fun toString(): String = string

        fun toStringAndReset(): String {
            val s = string
            reset()

            return s
        }

        fun addColumn(s: String, _columnLength: Int = columnLength) {
            for (i in 0 .. _columnLength)
                addText(if (i < s.length) s[i] else ' ')
        }

        fun addColumn(char: Char, _columnLength: Int = columnLength) {
            addText(char)

            for (i in 1 .. _columnLength)
                addText(' ')
        }

        fun addLine(char: Char = '-', numberOfColumns: Int, _columnLength: Int = columnLength) {
            addLn()
            for (i in 0 until numberOfColumns)
                for (j in 0 .. _columnLength)
                    addText(char)
            addLn()
        }

        fun addLn() {
            string += '\n'
        }

        fun addText(text: String) {
            string += text
        }

        fun addText(char: Char) {
            string += char
        }

        fun addTextLn(text: String) {
            addText(text)
            addLn()
        }

        fun addTextLn(char: Char) {
            addText(char)
            addLn()
        }

        private fun reset() {
            string = String()
        }

    }
}