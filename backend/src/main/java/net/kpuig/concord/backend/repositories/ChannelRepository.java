package net.kpuig.concord.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import net.kpuig.concord.backend.datamodels.Channel;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
    
}
