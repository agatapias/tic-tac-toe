package pwr.edu.cloud.tictac.tictac.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class Player(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Int? = null,
        @Column(unique = true)
        var name: String,
        var displayName: String,
        var timestamp: Long,
        var wantsToPlay: Boolean = false
)