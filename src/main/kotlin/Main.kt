import org.w3c.dom.Element
import org.w3c.dom.NodeList
import java.io.File
import javax.xml.XMLConstants
import javax.xml.parsers.DocumentBuilderFactory
import javax.xml.transform.TransformerFactory
import javax.xml.transform.dom.DOMSource
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource
import javax.xml.validation.SchemaFactory
import javax.xml.xpath.XPathConstants
import javax.xml.xpath.XPathFactory

fun main() {
    val base = "src/main/kotlin"
    println(if (isXMLValid("$base/test.xml", "$base/schema.xsd")) "valid" else "invalid")

    /*for (i in 1 .. 5)
        addXMLElement(XMLObject(
            i,
            ('a' + i - 1).toString(),
            ('a' + i - 1).toString(),
            20 + i,
            ('a' + i - 1).toString(),
            if (i % 2 == 0) "male" else "female" ,
            "01.01.200$i",
            "College",
            "Sick and ill",
            arrayOf("image1.png", "image2.png"),
            i
        ), "$base/test.xml", "./schema.xsd")

    removeXMLObjectById(3, "$base/test.xml")*/

    println("-------------- ID 1 ----------------")
    println(xPathCallToXML("/infected/person[id='1']", "$base/test.xml"))
    println("-------------- MALE ----------------")
    println(xPathCallToXML("/infected/person[sex='male']", "$base/test.xml"))
    println("-------------- INFECTION RATE ABOVE 3 ----------------")
    println(xPathCallToXML("/infected/person[infection-rate>3]", "$base/test.xml"))
}

data class XMLObject(
    val id: Int,
    val fname: String,
    val lname: String,
    val age: Int,
    val location: String,
    val sex: String,
    val birthdate: String,
    val education: String,
    val description: String,
    val images: Array<String>,
    val infectionRate: Int
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as XMLObject

        if (id != other.id) return false
        if (fname != other.fname) return false
        if (lname != other.lname) return false
        if (age != other.age) return false
        if (location != other.location) return false
        if (sex != other.sex) return false
        if (birthdate != other.birthdate) return false
        if (education != other.education) return false
        if (description != other.description) return false
        if (!images.contentEquals(other.images)) return false
        if (infectionRate != other.infectionRate) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + fname.hashCode()
        result = 31 * result + lname.hashCode()
        result = 31 * result + age
        result = 31 * result + location.hashCode()
        result = 31 * result + sex.hashCode()
        result = 31 * result + birthdate.hashCode()
        result = 31 * result + education.hashCode()
        result = 31 * result + description.hashCode()
        result = 31 * result + images.contentHashCode()
        result = 31 * result + infectionRate
        return result
    }
}

fun isXMLValid(xmlFilePath: String, xsdFilePath: String): Boolean {
    val xsd = File(xsdFilePath)
    val xml = File(xmlFilePath)

    return try {
        SchemaFactory
            .newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI)
            .newSchema(xsd)
            .newValidator()
            .validate(StreamSource(xml))

        true
    } catch (e: Exception) {
        println("Error: ${e.message}")
        false
    }
}

fun addXMLElement(xmlObject: XMLObject, xmlFilePath: String, xsdFilePath: String) {
    val file = File(xmlFilePath)

    if (file.createNewFile())
        file.writeText(
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<infected xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"$xsdFilePath\">" +
                    "</infected>"
        )

    val doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(file)
    val root = doc.createElement("person")

    fun appendChild(name: String, body: String, parent: Element? = null) {
        val e = doc.createElement(name)
        e.appendChild(doc.createTextNode(body))

        if (parent !== null)
            parent.appendChild(e)
        else
            root.appendChild(e)
    }

    appendChild("id", xmlObject.id.toString())
    appendChild("fname", xmlObject.fname)
    appendChild("lname", xmlObject.lname)
    appendChild("age", xmlObject.age.toString())
    appendChild("location", xmlObject.location)
    appendChild("sex", xmlObject.sex)
    appendChild("birthdate", xmlObject.birthdate)
    appendChild("education", xmlObject.education)
    appendChild("description", xmlObject.description)

    val imagesElement = doc.createElement("images")
    for (image in xmlObject.images)
        appendChild("image", image, imagesElement)
    root.appendChild(imagesElement)

    appendChild("infection-rate", xmlObject.infectionRate.toString())
    doc.documentElement.appendChild(root)

    TransformerFactory
        .newInstance()
        .newTransformer()
        .transform(DOMSource(doc), StreamResult(File(xmlFilePath)))
}

fun removeXMLObjectById(id: Int, xmlFilePath: String) {
    val file = File(xmlFilePath)
    val doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(file)
    val root = doc.documentElement
    val xPath = XPathFactory.newInstance().newXPath()
    val result = xPath.evaluate("/infected/person[id='$id']", doc, XPathConstants.NODESET) as NodeList

    for (i in 0 until result.length)
        root.removeChild(result.item(i))

    TransformerFactory
        .newInstance()
        .newTransformer()
        .transform(DOMSource(doc), StreamResult(File(xmlFilePath)))
}

fun xPathCallToXML(expression: String, xmlFilePath: String): String {
    val file = File(xmlFilePath)
    val doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(file)

    val xPath = XPathFactory.newInstance().newXPath()
    val result = xPath.evaluate(expression, doc, XPathConstants.NODESET) as NodeList

    var s = String()
    for (i in 0 until result.length)
        s += result.item(i).textContent

    return s
}