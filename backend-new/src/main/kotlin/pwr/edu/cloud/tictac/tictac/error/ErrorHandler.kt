package pwr.edu.cloud.tictac.tictac.error

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import pwr.edu.cloud.tictac.tictac.error.exception.*

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

    @ExceptionHandler(
            NameBlankException::class,
    )
    fun handleBadRequest(ex: Exception): ResponseEntity<String> {
        logError(ex)
        return ResponseEntity(ex.message, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(
            NameAlreadyExistsException::class,
            FieldAlreadySelectedException::class
    )
    fun handleConflict(ex: Exception): ResponseEntity<String> {
        logError(ex)
        return ResponseEntity(ex.message, HttpStatus.CONFLICT)
    }

    private fun logError(e: Exception) {
        logger.error(e.message, e)
    }
}