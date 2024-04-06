package pwr.edu.cloud.tictac.tictac.repository

import pwr.edu.cloud.tictac.tictac.entity.Match
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MatchRepository : JpaRepository<Match, Int> {
}