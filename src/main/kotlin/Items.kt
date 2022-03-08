import java.util.UUID

class Items {
    private var items = arrayListOf<Item>()

    fun getAll() = items

    fun find(id: UUID) = items.find { item -> item.id === id }
    fun find(name: String) = items.find { item -> item.name === name}

    fun add(item: Item) = items.add(item)

    fun delete(item: Item) = items.remove(item)

    fun update(id: UUID, item: Item): Boolean {
        val found = find(id)
        if (found === null)
            return false

        items[items.indexOf(found)] = item
        return true
    }

    override fun toString(): String {
        var temp = String()
        items.forEach { item -> temp += item.toString() + '\n' }
        return temp
    }

    // fun sum(): Double = items.reduce { acc, item -> }
}