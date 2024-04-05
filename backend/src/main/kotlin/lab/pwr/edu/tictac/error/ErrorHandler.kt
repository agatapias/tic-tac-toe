package lab.pwr.edu.tictac.error

import lab.pwr.edu.tictac.error.exception.BoardItemNotFoundException
import lab.pwr.edu.tictac.error.exception.MatchNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@ControllerAdvice
class ErrorHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler(
            BoardItemNotFoundException::class,
            MatchNotFoundException::class
    )
    fun handleNotFound(e: Exception): ResponseEntity<String> {
        logError(e)
        return ResponseEntity(e.message, HttpStatus.NOT_FOUND)
    }

    private fun logError(e: Exception) {
        logger.error(e.message, e)
    }
}