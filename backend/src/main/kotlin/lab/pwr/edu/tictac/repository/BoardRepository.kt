package lab.pwr.edu.tictac.repository

import lab.pwr.edu.tictac.entity.BoardItem
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BoardRepository : JpaRepository<BoardItem, Int> {
    fun findAllByMatchId(matchId: Int): List<BoardItem>
    fun findAllByMatchIdAndPosition(matchId: Int, position: Int): List<BoardItem>
}