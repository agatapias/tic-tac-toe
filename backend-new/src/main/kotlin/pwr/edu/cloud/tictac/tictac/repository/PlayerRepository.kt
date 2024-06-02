package pwr.edu.cloud.tictac.tictac.repository

import pwr.edu.cloud.tictac.tictac.entity.Player
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PlayerRepository : JpaRepository<Player, Int> {
    fun findByName(name: String): Player?
}