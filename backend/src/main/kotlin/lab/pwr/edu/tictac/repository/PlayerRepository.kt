package lab.pwr.edu.tictac.repository

import lab.pwr.edu.tictac.entity.Player
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PlayerRepository : JpaRepository<Player, Int> {
}