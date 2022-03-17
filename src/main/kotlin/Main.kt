import java.io.File
import java.io.InputStream
import java.util.LinkedList

const val FLOAT = 1
const val VARIABLE = 2
const val PLUS = 3
const val MINUS = 4
const val TIMES = 5
const val DIVIDE = 6
const val POW = 7
const val LPAREN = 8
const val RPAREN = 9

interface Automaton {
    val states: Set<Int>
    val alphabet: IntRange
    fun next(state: Int, symbol: Int): Int
    fun value(state: Int): Int
    val startState: Int
    val finalStates: Set<Int>
}

data class Token(val value: Int, val lexeme: String, val startRow: Int, val startColumn: Int)

object Example : Automaton {
    override val states = setOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31)
    override val alphabet = 0..255
    override val startState = 1
    override val finalStates = setOf(2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 19, 21, 23, 25, 30, 31)

    private val numberOfStates = states.maxOrNull()!! + 1
    private val numberOfSymbols = alphabet.maxOrNull()!! + 1
    private val transitions = Array(numberOfStates) { IntArray(numberOfSymbols) }
    private val values: Array<Int> = Array(numberOfStates) { 0 }

    override fun next(state: Int, symbol: Int): Int =
        if (symbol == Scanner.EOF_SYMBOL) Scanner.ERROR_STATE
        else {
            assert(states.contains(state))
            assert(alphabet.contains(symbol))
            transitions[state][symbol]
        }

    override fun value(state: Int): Int {
        assert(states.contains(state))
        return values[state]
    }

    init {
        setFloatTransitions()       // float        -> [0-9]+(.[0-9]+)?
        setVariableTransitions()    // variable     -> [a-zA-Z]+[0-9]*
        setPlusTransitions()        // plus         -> +
        setMinusTransitions()       // minus        -> -
        setTimesTransitions()       // times        -> *
        setDivideTransitions()      // divide       -> /
        setPowTransitions()         // pow          -> ^
        setLparenTransitions()      // lparen       -> (
        setRparenTransitions()      // rparen       -> )
        setWhitespace()             // ignore whitespace
    }

    private fun setTransition(from: Int, symbol: Char, to: Int) {
        transitions[from][symbol.code] = to
    }

    private fun setValue(state: Int, terminal: Int) {
        values[state] = terminal
    }

    private const val ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    private const val NUMBERS = "0123456789"
    private const val WHITESPACE = " \n\t\r\b"

    private fun setFloatTransitions() {
        for (digit in NUMBERS) {
            setTransition(1, digit, 2)
            setTransition(2, digit, 2)
            setTransition(3, digit, 4)
            setTransition(4, digit, 4)
        }

        setTransition(2, '.', 3)

        setValue(2, 1)
        setValue(4, 1)
    }

    private fun setVariableTransitions() {
        for (char in ALPHABET) {
            setTransition(1, char, 5)
            setTransition(5, char, 5)
        }

        for (digit in NUMBERS) {
            setTransition(5, digit, 6)
            setTransition(6, digit, 6)
        }

        setValue(5, 2)
        setValue(6, 2)
    }

    private fun setPlusTransitions() {
        setTransition(1, '+', 7)
        setValue(7, 3)
    }

    private fun setMinusTransitions() {
        setTransition(1, '-', 8)
        setValue(8, 4)
    }

    private fun setTimesTransitions() {
        setTransition(1, '*', 9)
        setValue(9, 5)
    }

    private fun setDivideTransitions() {
        setTransition(1, '/', 10)
        setValue(10, 6)
    }

    private fun setPowTransitions() {
        setTransition(1, '^', 11)
        setValue(11, 7)
    }

    private fun setLparenTransitions() {
        setTransition(1, '(', 12)
        setValue(12, 8)
    }

    private fun setRparenTransitions() {
        setTransition(1, ')', 13)
        setValue(13, 9)
    }

    private fun setWhitespace() {
        for (c in WHITESPACE) {
            setTransition(1, c, 31)
            setTransition(31, c, 31)
        }
    }
}

class Scanner(
    private val automaton: Automaton,
    private val stream: InputStream
) {
    private var state = automaton.startState
    private var last: Int? = null
    private var buffer = LinkedList<Byte>()
    private var row = 1
    private var column = 1

    companion object {
        const val EOF_SYMBOL = -1
        const val ERROR_STATE = 0
        const val SKIP_VALUE = 0
        const val NEWLINE = '\n'.code
    }

    private fun updatePosition(symbol: Int) {
        if (symbol == NEWLINE) {
            row++
            column = 1
        } else
            column++
    }

    private fun getValue(): Int {
        var symbol = last ?: stream.read()
        state = automaton.startState

        while (true) {
            updatePosition(symbol)
            val nextState = automaton.next(state, symbol)

            if (nextState == ERROR_STATE) {
                if (automaton.finalStates.contains(state)) {
                    last = symbol
                    return automaton.value(state)
                } else throw Error("Invalid pattern at ${row}:${column}")
            }

            state = nextState
            buffer.add(symbol.toByte())
            symbol = stream.read()
        }
    }

    private fun eof(): Boolean = last == EOF_SYMBOL

    fun getToken(): Token? {
        if (eof())
            return null

        val startRow = row
        val startColumn = column
        buffer.clear()

        val value = getValue()
        return if (value == SKIP_VALUE) getToken() else Token(
            value,
            String(buffer.toByteArray()),
            startRow,
            startColumn
        )
    }
}

class Parser(private val scanner: Scanner) {
    private var last: Token? = null

    fun recognize(): Boolean {
        last = scanner.getToken()
        val status = recognizeE()
        return if (last == null) status else false
    }

    private fun recognizeE(): Boolean =
        recognizeT() && recognizeEE()

    private fun recognizeEE(): Boolean {
        val lookahead = last?.value ?: return true

        return when(lookahead) {
            PLUS -> recognizeTerminal(PLUS) && recognizeT() && recognizeEE()
            MINUS -> recognizeTerminal(MINUS) && recognizeT() && recognizeEE()
            else -> true
        }
    }

    private fun recognizeT(): Boolean =
        recognizeX() && recognizeTT()


    private fun recognizeTT(): Boolean {
        val lookahead = last?.value ?: return true

        return when(lookahead) {
            TIMES -> recognizeTerminal(TIMES) && recognizeX() && recognizeTT()
            DIVIDE -> recognizeTerminal(DIVIDE) && recognizeX() && recognizeTT()
            else -> true
        }
    }

    private fun recognizeX(): Boolean =
        recognizeY() && recognizeXX()

    private fun recognizeXX(): Boolean {
        val lookahead = last?.value ?: return true

        return when (lookahead) {
            POW -> recognizeTerminal(POW) && recognizeX()
            else -> true
        }
    }

    private fun recognizeY(): Boolean {
        val lookahead = last?.value ?: return true

        return when (lookahead) {
            MINUS -> recognizeTerminal(MINUS) && recognizeF()
            PLUS -> recognizeTerminal(PLUS) && recognizeF()
            else -> recognizeF()
        }
    }

    private fun recognizeF(): Boolean {
        val lookahead = last?.value ?: return false

        return when(lookahead) {
            LPAREN -> recognizeTerminal(LPAREN) && recognizeE() && recognizeTerminal(RPAREN)
            FLOAT -> recognizeTerminal(FLOAT)
            VARIABLE -> recognizeTerminal(VARIABLE)
            else -> false
        }
    }

    private fun recognizeTerminal(value: Int): Boolean {
        if (last?.value != value)
            return false

        last = scanner.getToken()
        return true
    }
}

fun main(args: Array<String>) {
    val scanner = Scanner(Example, File(args[0]).inputStream())
    print(if (Parser(scanner).recognize()) "accept" else "reject")
}