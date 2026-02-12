package net.kpuig.concord

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform