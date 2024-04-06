package pwr.edu.cloud.tictac.tictac.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne

@Entity
data class Match(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Int? = null,
        @OneToOne
//        @JoinColumn(name = "player_id_1", nullable = false)
        var player1: Player,
        @OneToOne
//        @JoinColumn(name = "player_id_2", nullable = false)
        var player2: Player,
        var isPlayer1Turn: Boolean = true,
)
