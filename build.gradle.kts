import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jetbrains.dokka.gradle.DokkaTask

plugins {
    kotlin("jvm") version "1.6.10"
    id("org.jetbrains.dokka") version "1.6.10"
    application
}

group = "me.user"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
    implementation(kotlin("test"))
    compileOnly("org.jetbrains.dokka:dokka-core:1.6.10")
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
}

tasks.withType<DokkaTask>().configureEach {
    outputDirectory.set(buildDir.resolve("../documentation"))

    dokkaSourceSets {
        named("main") {
            moduleName.set("moduleName")
            includes .from("Module.md")
        }
    }
}

application {
    mainClass.set("MainKt")
}