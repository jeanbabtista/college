package lib

import com.google.gson.Gson
import java.io.FileReader
import java.sql.Connection
import java.sql.DriverManager

data class JsonSchema(
    val url: String,
    val db: String,
    val username: String,
    val password: String,
)

class DatabaseUtil {
    companion object {
        private fun getJsonConfig(): JsonSchema =
            Gson().fromJson(FileReader("src/main/kotlin/db/config.json"), JsonSchema::class.java)

        fun getConnection(): Connection? {
            val ( url, db, username, password ) = getJsonConfig()
            return DriverManager.getConnection("$url/$db?user=$username&password=$password")
        }

        fun query(sql: String): List<Map<String, Any>> {
            val connection = getConnection()
            val statement = connection?.createStatement()
            val resultSet = statement?.executeQuery(sql)

            val metaData = resultSet?.metaData
            val columnCount = metaData?.columnCount ?: 0
            val columnNames = (1..columnCount).map { metaData?.getColumnName(it) }

            val rows = mutableListOf<Map<String, Any>>()

            while (resultSet?.next() == true) {
                val row = mutableMapOf<String, Any>()

                for (i in 1..columnCount)
                    row[columnNames[i - 1] ?: String()] = resultSet.getObject(i)

                rows.add(row)
            }

            return rows
        }

        fun displayData(data: List<Map<String, Any>>, columnSize: Int = 15) {
            // print key names
            val keys = data.firstOrNull()?.keys ?: listOf()
            for (key in keys)
                print(key.padEnd(columnSize))
            println()

            // print line
            for (i in 0 .. columnSize * keys.size)
                print("-")
            println()

            // print data rows
            for (row in data) {
                for ((_, value) in row)
                    print(value.toString().padEnd(columnSize))
                println()
            }
        }
    }
}