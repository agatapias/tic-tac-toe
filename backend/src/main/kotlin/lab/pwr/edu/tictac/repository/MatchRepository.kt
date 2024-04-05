package lab.pwr.edu.tictac.repository

import lab.pwr.edu.tictac.entity.Match
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MatchRepository : JpaRepository<Match, Int> {
}