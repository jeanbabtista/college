package lib

object Printer {
    private const val columnLength = 20
    private var string = String()

    /**
     * Returns string representation of class Printer.
     *
     * @return String
     */
    override fun toString(): String = string

    /**
     * Returns string representation of class Printer and resets internal string.
     *
     * @return String
     */
    fun toStringAndReset(): String {
        val s = string
        reset()

        return s
    }

    /**
     * Adds column of size 20 by default to internal string for given string from arguments.
     *
     * @param s String
     * @param _columnLength Int, default is 20
     * @return Unit
     */
    fun addColumn(s: String, _columnLength: Int = columnLength) {
        for (i in 0.._columnLength)
            addText(if (i < s.length) s[i] else ' ')
    }

    /**
     * Adds column of size 20 by default to internal string for given character from arguments.
     *
     * @param char Char
     * @param _columnLength Int, default is 20
     * @return Unit
     */
    fun addColumn(char: Char, _columnLength: Int = columnLength) {
        addText(char)

        for (i in 1.._columnLength)
            addText(' ')
    }

    /**
     * Adds line of [char]'s of width [numberOfColumns] * [_columnLength] to internal string.
     *
     * @param char Char, default is '-'
     * @param numberOfColumns Int
     * @param _columnLength Int, default is 20
     * @return Unit
     */
    fun addLine(char: Char = '-', numberOfColumns: Int, _columnLength: Int = columnLength) {
        addLn()
        for (i in 0 until numberOfColumns)
            for (j in 0.._columnLength)
                addText(char)
        addLn()
    }

    /**
     * Adds newline character to internal string.
     *
     * @return Unit
     */
    fun addLn() {
        string += '\n'
    }

    /**
     * Adds [text] string to internal string.
     *
     * @param text String
     * @return Unit
     */
    fun addText(text: String) {
        string += text
    }

    /**
     * Adds [char] character to internal string.
     *
     * @param char Char
     * @return Unit
     */
    fun addText(char: Char) {
        string += char
    }

    /**
     * Adds [text] string with newline to internal string.
     *
     * @param text String
     * @return Unit
     */
    fun addTextLn(text: String) {
        addText(text)
        addLn()
    }

    /**
     * Adds [char] character with newline to internal string.
     *
     * @param char Char
     * @return Unit
     */
    fun addTextLn(char: Char) {
        addText(char)
        addLn()
    }

    /**
     * Resets string to empty string.
     *
     * @return Unit
     */
    private fun reset() {
        string = String()
    }
}