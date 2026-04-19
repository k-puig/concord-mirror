package net.kpuig.shoebill.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.kpuig.shoebill.backend.datamodels.channel.Channel;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    
}
