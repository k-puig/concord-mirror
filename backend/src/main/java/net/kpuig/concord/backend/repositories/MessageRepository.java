package net.kpuig.concord.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import net.kpuig.concord.backend.datamodels.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
}
