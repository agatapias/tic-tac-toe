package pwr.edu.cloud.tictac.tictac

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TictacApplication

fun main(args: Array<String>) {
	runApplication<TictacApplication>(*args)
}
